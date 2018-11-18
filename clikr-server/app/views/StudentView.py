#/src/views/StudentView

from flask import request, json, Response, Blueprint, session, redirect, render_template
import uuid
from ..models.StudentModel import StudentModel, StudentSchema
from ..models.CourseModel import CourseModel, CourseSchema
from ..models.QuestionModel import QuestionModel, QuestionSchema
from ..models.AnswerModel import AnswerModel, AnswerSchema
from .. import db, cas
from ..shared.Authentication import Auth
from ..shared.CASClient import CASClient

from flask_socketio import send, emit, join_room
from .. import socketio

student_api = Blueprint('students', __name__)
student_schema = StudentSchema()
course_schema = CourseSchema()
question_schema = QuestionSchema()
answer_schema = AnswerSchema()

@socketio.on('subscribe')
def on_join(course_id):
    join_room(course_id)
    emit('server message', 'you joined the room ' + course_id)

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
def get_open_questions(current_user, course_id):
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

    # query database and return result
    open_questions = QuestionModel.query.filter_by(is_open=True) # FIXME: returns open questions for ALL courses!
    question_data = question_schema.dump(open_questions, many=True).data
    return custom_response(question_data, 200)

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
        return custom_response({'error': 'permission denied'}, 400)

    # check if question is open
    if not question.is_open:
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

@student_api.route('/login', methods=['GET', 'POST'])
def login():
    """
    Does not provide authentication at the moment! 
    Its only purpose is to obtain a session (cookie) for a student, which is used to identify the user in subsequent API calls.
    """

    # for testing purposes, the user only needs to supply his netId (no password required)
    if request.method == 'GET':
        return render_template('login.html')
    else:
        netId = request.form.get('netId')

        # check if student exists in DB
        student = StudentModel.get_student_by_netId(netId)
        if not student:
            return render_template('logged_in.html', error='Invalid netId')
        
        # create a session for the user
        session['username'] = netId
        session['role'] = 'student'

        return render_template('logged_in.html', role=session['role'], netId=session['username'])

@student_api.route('/logincas', methods=['GET'])
def login_cas():
    auth_response = cas.authenticate()

    if isinstance(auth_response, str):
        return render_template('login_test.html', username=session['username'])
    else:
        return auth_response

@student_api.route('/secure', methods=['GET'])
@cas.cas_required
def secure():
    return render_template('login_test.html', username=session['username'])


def custom_response(res, status_code):
    """
    Custom Response Function
    """
    return Response(
        mimetype="application/json",
        response=json.dumps(res),
        status=status_code
    )