#/src/views/StudentView

from flask import request, Response, Blueprint, session, redirect, render_template
import uuid
import json
from ..models.StudentModel import StudentModel, StudentSchema
from ..models.CourseModel import CourseModel, CourseSchema
from ..models.QuestionModel import QuestionModel, QuestionSchema, MultipleChoiceSchema, FreeTextSchema
from ..models.AnswerModel import AnswerModel, AnswerSchema
from ..models.LectureModel import LectureModel, LectureSchema
from .. import db, cas
from ..shared.Authentication import Auth
from ..shared.Util import custom_response, check_lecture_open, check_lecture_past
from ..shared.SocketIOUtil import emit_question_statistics
from ..shared.MarshmallowUtil import dump_one_question

from sqlalchemy import func

from flask_socketio import send, emit, join_room
from .. import socketio

student_api = Blueprint('students', __name__)
student_schema = StudentSchema()
course_schema = CourseSchema()
answer_schema = AnswerSchema()
lecture_schema = LectureSchema()

@socketio.on('subscribe student')
def on_join(course_id):

    # authenticate the user
    current_user = Auth.authenticate_student()
    if not current_user:
        emit('server message', 'permission denied')
        return

    # retrieve course and check if valid
    course = CourseModel.get_course_by_uuid(course_id)
    if not course:
        emit('server message', 'invalid course_id')
        return

    # check permission
    if not course in current_user.courses:
        emit('server message', 'permission denied')
        return

    join_room(course_id)

    # filter for the specified course
    questions_data = get_open_questions(course_id)
    
    emit('all open questions', {'questions': questions_data, 'message': 'you joined the room (course) ' + course_id})

@student_api.route('/name', methods=['GET'])
@Auth.student_auth_required
def get_name(current_user):
    """
    Returns name of the current prof
    """
    full_name = f'{current_user.netId}'
    return custom_response({'name': full_name}, 200)

@student_api.route('/courses', methods=['GET'])
@Auth.student_auth_required
def get_courses(current_user):
    """
    returns all courses of the current student
    """
    courses = current_user.courses
    course_data = course_schema.dump(courses, many=True).data
    return custom_response(course_data, 200)

@student_api.route('/courses', methods=['POST'])
@Auth.student_auth_required
def enroll_in_course(current_user):
    """
    enrolls the current student in a course
    """
    req_data = request.get_json()
    enroll_code = req_data.get("enroll_code")

    # retrieve course and check if valid
    course = CourseModel.get_course_by_code(enroll_code)
    if not course:
        return custom_response({'error': 'invalid enrollment code'}, 400)
    if course in current_user.courses:
        return custom_response({'error': 'already enrolled in this course'}, 400)

    # add the course to the student's list of courses
    current_user.courses.append(course)
    db.session.commit()

    # prepare response
    course_data = course_schema.dump(course).data
    return custom_response({'message': 'student enrolled', 'id': course_data.get('id')}, 201)

@student_api.route('/courses/<course_id>', methods=['GET'])
@Auth.student_auth_required
def get_course_info(current_user, course_id):
    course = CourseModel.get_course_by_uuid(course_id)

    if not course:
        return custom_response({'error': 'course_id does not exist'}, 400)
    if not current_user in course.students:
        return custom_response({'error': 'permission denied'}, 400)

    reduced_course_schema = CourseSchema(exclude=['creator_id', 'created_at', 'modified_at', 'enroll_code'])
    course_data = reduced_course_schema.dump(course).data
    return custom_response(course_data, 200)

@student_api.route('/courses/<course_id>', methods=['DELETE'])
@Auth.student_auth_required
def drop_course(current_user, course_id):
    """
    drop this course
    """
    # retrieve course and check if valid
    course = CourseModel.get_course_by_uuid(course_id)
    if not course:
        return custom_response({'error': 'course_id does not exist'}, 400)

    # check enrollment
    if not current_user in course.students:
        return custom_response({'error': 'not enrolled in this course'}, 400)

    # remove current user from the course's list of students
    course.students.remove(current_user)
    db.session.commit()

    return custom_response({'message': 'dropped course'}, 200)

@student_api.route('/courses/<course_id>/questions', methods=['GET'])
@Auth.student_auth_required
def get_open_questions_api(current_user, course_id):
    """
    returns all open questions for this course
    """
    # retrieve course and check if valid
    course = CourseModel.get_course_by_uuid(course_id)
    if not course:
        return custom_response({'error': 'course_id does not exist'}, 400)

    # check permissions (enrollment)
    if not current_user in course.students:
        return custom_response({'error': 'permission denied'}, 400)

    questions_data = get_open_questions(course_id)

    return custom_response(questions_data, 200)

def get_open_questions(course_id):
    # query database to get ALL open questions
    all_lectures = LectureModel.query.filter_by(course_id=course_id).all()
    lecture_ids = [lecture.id for lecture in all_lectures]
    scheduled_lectures = [lecture for lecture in all_lectures if check_lecture_open(lecture)]
    open_questions = QuestionModel.query.filter(QuestionModel.lecture_id.in_(lecture_ids), QuestionModel.is_open==True).all()

    # filter for the specified course
    questions_data = []
    for question in open_questions:
        if question.lecture.course_id == course_id:
            # use the appropriate question schema
            question_data = dump_one_question(question, exclude=['correct_answer'])
            question_data['scheduled'] = False
            questions_data.append(question_data)

    for lecture in scheduled_lectures:
        for question in lecture.questions:
            question_data = dump_one_question(question, exclude=['correct_answer'])
            question_data['opened_at'] = str(lecture.open_date)
            question_data['closed_at'] = str(lecture.close_date)
            question_data['scheduled'] = True
            questions_data.append(question_data)

    return questions_data

@student_api.route('/courses/<course_id>/prevquestions', methods=['GET'])
@Auth.student_auth_required
def get_previous_questions(current_user, course_id):
    """
    returns all previous questions along with the submitted answer for this course
    """
    # retrieve course and check if valid
    course = CourseModel.get_course_by_uuid(course_id)
    if not course:
        return custom_response({'error': 'course_id does not exist'}, 400)

    # check permissions (enrollment)
    if not current_user in course.students:
        return custom_response({'error': 'permission denied'}, 400)

    # return list of all previous (already closed) questions for this course
    # query database to get ALL previously closed questions # TODO: this may be way too inefficient
    all_lectures = LectureModel.query.filter_by(course_id=course.id).all()
    lecture_ids = [lecture.id for lecture in all_lectures]
    past_lectures = [lecture for lecture in all_lectures if check_lecture_past(lecture)]
    prev_questions = QuestionModel.query.filter(QuestionModel.lecture_id.in_(lecture_ids), QuestionModel.closed_at != None).order_by(QuestionModel.closed_at.desc()).all()

    # filter for the specified course
    prev_questions_data = []
    for question in prev_questions:
        if question.lecture.course_id == course_id:
            # use the appropriate question schema
            question_data = dump_one_question(question)

            # retrieve the student's answer to this question
            answer_tuple = AnswerModel.query.filter_by(question_id=question.id, student_id=current_user.id).first()
            if answer_tuple:
                question_data['answer'] = answer_tuple.answer
            else:
                question_data['answer'] = None
            
            prev_questions_data.append(question_data)

    for lecture in past_lectures:
        for question in lecture.questions:
            # use the appropriate question schema
            question_data = dump_one_question(question)

            # retrieve the student's answer to this question
            answer_tuple = AnswerModel.query.filter_by(question_id=question.id, student_id=current_user.id).first()
            if answer_tuple:
                question_data['answer'] = answer_tuple.answer
            else:
                question_data['answer'] = None
            
            prev_questions_data.append(question_data)

    return custom_response(prev_questions_data, 200)

@student_api.route('/questions/<question_id>', methods=['GET'])
@Auth.student_auth_required
def get_answer(current_user, question_id):
    """
    get the previously submitted answer to this question
    """
    # retrieve question and check if valid
    question = QuestionModel.get_question_by_uuid(question_id)
    if not question:
        return custom_response({'error': 'question_id does not exist'}, 400)

    # retrieve course and check permissions
    course = question.lecture.course
    if not current_user in course.students:
        return custom_response({'error': 'permission denied'}, 400)

    # retrieve previous answer
    answer = AnswerModel.query.filter_by(question_id=question_id, student_id=current_user.id).first()
    if not answer:
        return custom_response({'error': 'no previous answer found'}, 400)
    
    answer_data = answer_schema.dump(answer).data
    return custom_response(answer_data, 200)

@student_api.route('/questions/<question_id>', methods=['POST'])
@Auth.student_auth_required
def submit_answer(current_user, question_id):
    """
    submit an answer to the question
    """
    # retrieve question and check if valid
    question = QuestionModel.get_question_by_uuid(question_id)
    if not question:
        return custom_response({'error': 'question_id does not exist'}, 400)

    # retrieve course and check permissions
    course = question.lecture.course
    if not current_user in course.students:
        return custom_response({'error': 'permission denied - student is not enrolled'}, 400)

    # check if question is open or if lecture is open
    lecture_is_open = check_lecture_open(question.lecture)
    if not (question.is_open or lecture_is_open):
        return custom_response({'error': 'question is not open'}, 400)

    # get data from request body
    req_data = request.get_json()
    req_data['student_id'] = current_user.id
    req_data['question_id'] = question_id
    data, error = answer_schema.load(req_data)

    if error:
        return custom_response({'error': error}, 400)

    # check if student has already answered this question
    answer = AnswerModel.query.filter_by(question_id=question_id, student_id=current_user.id).first()
    if answer:
        # update existing answer
        answer.update(data)
        message = 'answer updated'
    else:
        # create new answer
        answer = AnswerModel(data)
        answer.save()

        # add the answer to this question's list of answers and this student's list of answers
        question.answers.append(answer)
        current_user.answers.append(answer)
        db.session.commit()
        message = 'answer created'

    # push updated results to professor using socketio
    emit_question_statistics(question)

    # prepare response
    answer_data = answer_schema.dump(answer).data
    return custom_response({'message': message, 'id': answer_data['id'], 'question_id': answer_data['question_id']}, 200)

@student_api.route('/questions/<question_id>', methods=['DELETE'])
@Auth.student_auth_required
def delete_answer(current_user, question_id):
    """
    delete previous answer to the question (also works if question is closed)
    """
    # retrieve question and check if valid
    question = QuestionModel.get_question_by_uuid(question_id)
    if not question:
        return custom_response({'error': 'question_id does not exist'}, 400)

    # retrieve course and check permissions
    course = question.lecture.course
    if not current_user in course.students:
        return custom_response({'error': 'permission denied'}, 400)

    # check if student has already answered this question
    answer = AnswerModel.query.filter_by(question_id=question_id, student_id=current_user.id).first()
    if not answer:
        return custom_response({'error': 'no answer to this question found'}, 400)

    # delete answer from the question's list of answers
    question.answers.remove(answer)
    db.session.commit()

    return custom_response({'message': 'answer deleted'}, 200)

@student_api.route('/login', methods=['GET'])
@cas.cas_required
def login():
    """
    Redirects the user to the CAS login page, which after succesful cas login redirects back here.
    This page then redirects again to the page specified in the service parameter (or to the login page if none specified)
    """
    netId = session['username']
    
    # check if this user exists in the database, otherwise create it
    current_user = StudentModel.get_student_by_netId(netId)
    
    if not current_user:
        # create new student
        current_user = StudentModel({'netId': netId})
        current_user.save()

    # set role (username is set by CASClient)
    session['role'] = 'student'

    # check if there is a redirect url
    service_url = request.args.get('service')
    if service_url:
        print('redirecting to' + service_url)
        return redirect(service_url)
    else:
        return 'logged in as student ' + session['username']

@student_api.route('/logout', methods=['GET'])
def logout():
    """
    deletes the session cookie (but does not log the user out of CAS)
    """
    session.pop('username', None)

    service_url = request.args.get('service')

    if service_url:
        return redirect(service_url)
    else:
        return 'logged out'
     
# endpoint for socketIO testing; comment out before deployment
# @student_api.route('/socketio', methods=['GET'])
# def socketIO_test():
#     return render_template('socketIO_student.html')