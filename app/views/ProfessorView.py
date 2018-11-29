#/src/views/ProfessorView

from flask import request, Response, Blueprint, session, render_template, redirect
import uuid
import datetime
import random, string
from ..models.ProfessorModel import ProfessorModel, ProfessorSchema
from ..models.StudentModel import StudentModel, StudentSchema
from ..models.CourseModel import CourseModel, CourseSchema
from ..models.LectureModel import LectureModel, LectureSchema
from ..models.QuestionModel import QuestionModel, QuestionSchema, MultipleChoiceModel, MultipleChoiceSchema, FreeTextModel, FreeTextSchema
from ..models.AnswerModel import AnswerModel, AnswerSchema
from .. import db
from ..shared.Authentication import Auth
from ..shared.Util import custom_response

from .. import socketio

professor_api = Blueprint('professors', __name__)
professor_schema = ProfessorSchema()
student_schema = StudentSchema()
course_schema = CourseSchema()
lecture_schema = LectureSchema()
question_schema = QuestionSchema()
multiple_choice_schema = MultipleChoiceSchema()
free_text_schema = FreeTextSchema()
answer_schema = AnswerSchema()

@professor_api.route('/data', methods=['GET'])
@Auth.professor_auth_required
def get_all_data(current_user):
    """
    returns all courses, lectures, and questions of the current prof
    """
    result = []
    courses = current_user.courses

    for course in courses:
        course_data = course_schema.dump(course).data
        
        lectures_data = []
        lectures = course.lectures

        for lecture in lectures:
            lecture_data = lecture_schema.dump(lecture).data

            questions = lecture.questions
            questions_data = question_schema.dump(questions, many=True).data
            lecture_data['questions'] = questions_data

            lectures_data.append(lecture_data)

        course_data['lectures'] = lectures_data
        result.append(course_data)

    return custom_response(result, 200)

@professor_api.route('/courses', methods=['GET'])
@Auth.professor_auth_required
def get_courses(current_user):
    """
    Returns all courses of the current prof
    """
    courses = current_user.courses
    course_data = course_schema.dump(courses, many=True).data
    return custom_response(course_data, 200)

@professor_api.route('/courses', methods=['POST'])
@Auth.professor_auth_required
def create_course(current_user):
    """
    Creates a new course of the current prof
    """
    # get data from request body and create new course
    req_data = request.get_json()
    print('req_data = ' + str(req_data))
    req_data['creator_id'] = current_user.id
    data, error = course_schema.load(req_data)

    if error:
        return custom_response(error, 400)

    course = CourseModel(data)

    # generate enrollment code and save to database
    enroll_code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
    course.enroll_code = enroll_code
    course.save()

    # add the course to the prof's list of courses
    current_user.courses.append(course)
    db.session.commit()

    # response returns all courses
    all_courses = current_user.courses
    all_courses_data = course_schema.dump(all_courses, many=True).data
    return custom_response({'message': 'course created', 'id': course.id, 'courses': all_courses_data}, 201)

@professor_api.route('/courses/<course_id>', methods=['GET'])
@Auth.professor_auth_required
def get_course_info(current_user, course_id):
    # retrieve course and check if valid, permissions
    course = CourseModel.get_course_by_uuid(course_id)
    if not course:
        return custom_response({'error': 'course_id does not exist'}, 400)
    if not current_user in course.professors:
        return custom_response({'error': 'permission denied'}, 400)

    course_data = course_schema.dump(course).data
    return custom_response(course_data, 200)

@professor_api.route('/courses/<course_id>', methods=['POST'])
@Auth.professor_auth_required
def add_professor(current_user, course_id):
    """
    add professor to an existing course
    """
    # retrieve course and check if valid
    course = CourseModel.get_course_by_uuid(course_id)
    if not course:
        return custom_response({'error': 'course_id does not exist'}, 400)

    # check permissions
    if not course:
        return custom_response({'error': 'course_id does not exist'}, 400)
    if not current_user in course.professors:
        return custom_response({'error': 'permission denied'}, 400)

    req_data = request.get_json()
    new_professor_netId = req_data.get("netId")

    # check if professor already part of course
    new_professor = ProfessorModel.get_professor_by_netId(new_professor_netId)
    if new_professor in course.professors:
        return custom_response({'error': 'already teaching this course'}, 400)

    # append new prof to the course's list of professors
    course.professors.append(new_professor)
    db.session.commit()

    return custom_response({'message': 'professor added to course', 'netId': new_professor_netId}, 201)

@professor_api.route('/courses/<course_id>', methods=['PATCH'])
@Auth.professor_auth_required
def update_course(current_user, course_id):
    # retrieve course and check if valid, permissions
    course = CourseModel.get_course_by_uuid(course_id)
    if not course:
        return custom_response({'error': 'course_id does not exist'}, 400)
    if not current_user in course.professors:
        return custom_response({'error': 'permission denied'}, 400)

    # get data from request body
    updated_data = request.get_json()
    course.update(updated_data)

    return custom_response({'message': 'course updated'}, 201)
    
@professor_api.route('/courses/<course_id>', methods=['DELETE'])
@Auth.professor_auth_required
def delete_course(current_user, course_id):
    """
    delete this course
    """
    # retrieve course and check if valid
    course = CourseModel.get_course_by_uuid(course_id)
    if not course:
        return custom_response({'error': 'course_id does not exist'}, 400)

    # check permissions
    if not current_user in course.professors:
        return custom_response({'error': 'permission denied'}, 400)

    course.delete()
    return custom_response({'message': 'course deleted'}, 200)

@professor_api.route('/courses/<course_id>/code', methods=['GET'])
@Auth.professor_auth_required
def get_enrollment_code(current_user, course_id):
    """
    get a (new) enrollment code for the course
    """
    # retrieve course and check if valid
    course = CourseModel.get_course_by_uuid(course_id)
    if not course:
        return custom_response({'error': 'course_id does not exist'}, 400)

    if not course:
        return custom_response({'error': 'course_id does not exist'}, 400)
    # check permissions
    if not current_user in course.professors:
        return custom_response({'error': 'permission denied'}, 400)

    enroll_code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
    updated_data = {'enroll_code' : enroll_code}
    course.update(updated_data)

    return custom_response({'message': 'code created', 'enroll_code': enroll_code}, 200)

@professor_api.route('/courses/<course_id>/students', methods=['GET'])
@Auth.professor_auth_required
def get_students(current_user, course_id):
    """
    gets list of students enrolled in courses
    """
    # retrieve course and check if valid
    course = CourseModel.get_course_by_uuid(course_id)
    if not course:
        return custom_response({'error': 'course_id does not exist'}, 400)
    
    # check permissions
    if not current_user in course.professors:
        return custom_response({'error': 'permission denied'}, 400)

    students = course.students
    students_data = student_schema.dump(students, many=True).data

    return custom_response(students_data, 200)

@professor_api.route('/courses/<course_id>/students', methods=['POST'])
@Auth.professor_auth_required
def enroll_student(current_user, course_id):
    """
    manually enrolls student
    """
    # retrieve student and check if valid
    req_data = request.get_json()
    netId = req_data.get("netId")
    student = StudentModel.get_student_by_netId(netId)
    if not student:
        return custom_response({'error': 'student netId does not exist'}, 400)

    # retrieve course and check if valid
    course = CourseModel.get_course_by_uuid(course_id)
    if not course:
        return custom_response({'error': 'course_id does not exist'}, 400)
    
    # check permissions
    if not current_user in course.professors:
        return custom_response({'error': 'permission denied'}, 400)
    
    # check if student is already enrolled
    if course in student.courses:
        return custom_response({'error': 'already enrolled in this course'}, 400)
    
    # add the course to the student's list of courses
    student.courses.append(course)
    db.session.commit()

    # prepare response
    course_data = course_schema.dump(course).data
    return custom_response({'message': 'student enrolled', 'id': course_data.get('id')}, 200)

@professor_api.route('/courses/<course_id>/students/<student_id>', methods=['DELETE'])
@Auth.professor_auth_required
def remove_student(current_user, course_id, student_id):
    """
    manually deletes student
    """
    student = StudentModel.get_student_by_uuid(student_id)
    if not student:
        return custom_response({'error': 'student does not exist'}, 400)
    student_netId = student.netId

    course = CourseModel.get_course_by_uuid(course_id)
    if not course:
        return custom_response({'error': 'course_id does not exist'}, 400)
    
    # check permissions
    if not current_user in course.professors:
        return custom_response({'error': 'permission denied'}, 400)

    # check if student enrolled
    if not course in student.courses:
        return custom_response({'error': 'student not enrolled in this course'}, 400)

    # remove the course from the student's list of courses
    student.courses.remove(course) 
    db.session.commit()

    # prepare response
    course_data = course_schema.dump(course).data
    return custom_response({'message': 'student removed',
                            'id': course_data.get('id'),
                            'netId': student_netId}, 200)

@professor_api.route('/courses/<course_id>/lectures', methods=['GET'])
@Auth.professor_auth_required
def get_lectures(current_user, course_id):
    """
    Returns all lectures for a course
    """
    course = CourseModel.get_course_by_uuid(course_id)

    # check if course_id is valid
    if not course:
        return custom_response({'error': 'course_id does not exist'}, 400)

    # check permissions
    if not current_user in course.professors:
        return custom_response({'error': 'permission denied'}, 400)

    # retrieve and return lectures
    lectures = course.lectures

    lecture_data = []
    for lecture in lectures:
        one_lecture_data = lecture_schema.dump(lecture).data
        
        # add number of questions to each lecture
        one_lecture_data['num_questions'] = len(lecture.questions)
        lecture_data.append(one_lecture_data)

    return custom_response(lecture_data, 200)

@professor_api.route('/courses/<course_id>/lectures', methods=['POST'])
@Auth.professor_auth_required
def create_lecture(current_user, course_id):
    """
    Create a new lecture in a course
    """
    # retrieve course and check if valid
    course = CourseModel.get_course_by_uuid(course_id)
    if not course:
        return custom_response({'error': 'course_id does not exist'}, 400)

    # check permissions
    if not current_user in course.professors:
        return custom_response({'error': 'permission denied'}, 400)

    # get data from request body and create new lecture
    req_data = request.get_json()
    req_data['creator_id'] = current_user.id
    req_data['course_id'] = course_id
    data, error = lecture_schema.load(req_data)

    if error:
        return custom_response(error, 400)

    lecture = LectureModel(data)
    lecture.save()

    # add the lecture to this course's list of lectures
    course.lectures.append(lecture)
    db.session.commit()

    # response returns all lectures for this course
    all_lectures = course.lectures
    all_lectures_data = lecture_schema.dump(all_lectures, many=True).data
    return custom_response({'message': 'lecture created', 'id': lecture.id, 'lectures': all_lectures_data}, 201)

@professor_api.route('/lectures/<lecture_id>', methods=['GET'])
@Auth.professor_auth_required
def get_lecture_info(current_user, lecture_id):
    # retrieve lecture and check if valid
    lecture = LectureModel.get_lecture_by_uuid(lecture_id)
    if not lecture:
        return custom_response({'error': 'lecture_id does not exist'}, 400)

    # retrieve course and check permissions
    course = lecture.course
    if not current_user in course.professors:
        return custom_response({'error': 'permission denied'}, 400)

    # return lecture data and number of questions
    lecture_data = lecture_schema.dump(lecture).data
    lecture_data['num_questions'] = len(lecture.questions)
    return custom_response(lecture_data, 200)

@professor_api.route('/lectures/<lecture_id>', methods=['PATCH'])
@Auth.professor_auth_required
def update_lecture(current_user, lecture_id):
    # retrieve lecture and check if valid
    lecture = LectureModel.get_lecture_by_uuid(lecture_id)
    if not lecture:
        return custom_response({'error': 'lecture_id does not exist'}, 400)

    # retrieve course and check permissions
    course = lecture.course
    if not current_user in course.professors:
        return custom_response({'error': 'permission denied'}, 400)

    # get data from request body
    updated_data = request.get_json()
    lecture.update(updated_data)

    return custom_response({'message': 'lecture updated'}, 200)

@professor_api.route('/lectures/<lecture_id>', methods=['DELETE'])
@Auth.professor_auth_required
def delete_lecture(current_user, lecture_id):
    """
    delete this lecture
    """
    # retrieve lecture and check if valid
    lecture = LectureModel.get_lecture_by_uuid(lecture_id)
    if not lecture:
        return custom_response({'error': 'lecture does not exist'}, 400)

    # retrieve course and check permissions
    course = lecture.course
    if not current_user in course.professors:
        return custom_response({'error': 'permission denied'}, 400)

    lecture.delete()
    return custom_response({'message': 'lecture deleted'}, 200)

@professor_api.route('/lectures/<lecture_id>/questions', methods=['GET'])
@Auth.professor_auth_required
def get_questions(current_user, lecture_id):
    """
    Returns all questions for a lecture
    """
    # retrieve lecture and check if valid
    lecture = LectureModel.get_lecture_by_uuid(lecture_id)
    if not lecture:
        return custom_response({'error': 'lecture does not exist'}, 400)

    # retrieve course and check permissions
    course = lecture.course
    if not current_user in course.professors:
        return custom_response({'error': 'permission denied'}, 400)

    # retrieve questions and return
    questions = lecture.questions
    question_data = question_schema.dump(questions, many=True).data
    return custom_response(question_data, 200)

@professor_api.route('/lectures/<lecture_id>/questions', methods=['POST'])
@Auth.professor_auth_required
def create_question(current_user, lecture_id):
    """
    Create a new question in a lecture
    """
    # retrieve lecture and check if valid
    lecture = LectureModel.get_lecture_by_uuid(lecture_id)
    if not lecture:
        return custom_response({'error': 'lecture does not exist'}, 400)

    # retrieve course and check permissions
    course = lecture.course
    if not current_user in course.professors:
        return custom_response({'error': 'permission denied'}, 400)

    # get data from request body
    req_data = request.get_json()
    req_data['creator_id'] = current_user.id
    req_data['lecture_id'] = lecture_id

    # load the appropriate schema and create new question
    try:
        question_type = req_data['question_type']
    except:
        return custom_response({'error': 'question type required'}, 400)
    if question_type == 'multiple_choice':
        data, error = multiple_choice_schema.load(req_data)
        if error:
            return custom_response(error, 400)
        question = MultipleChoiceModel(data)
    elif question_type == 'free_text':
        data, error = free_text_schema.load(req_data)
        if error:
            return custom_response(error, 400)
        question = FreeTextModel(data)
    else:
        return custom_response({'error': 'invalid question type'}, 400)

    question.save()

    # add the question to this lecture's list of questions
    lecture.questions.append(question)
    db.session.commit()

    all_questions = lecture.questions
    all_questions_data = question_schema.dump(all_questions, many=True).data
    return custom_response({'message': 'question created', 'id': question.id, 'questions': all_questions_data}, 201)

@professor_api.route('/questions/<question_id>', methods=['GET'])
@Auth.professor_auth_required
def get_question_info(current_user, question_id):
    # retrieve question and check if valid
    question = QuestionModel.get_question_by_uuid(question_id)
    if not question:
        return custom_response({'error': 'question_id does not exist'}, 400)

    # retrieve course and check permissions
    course = question.lecture.course
    if not current_user in course.professors:
        return custom_response({'error': 'permission denied'}, 400)

    question_type = question.question_type
    if question_type == 'multiple_choice':
        question_data = multiple_choice_schema.dump(question).data
    elif question_type == 'free_text':
        question_data = free_text_schema.dump(question).data
    else:
        return custom_response({'error': 'question_type not found'}, 400)
    return custom_response(question_data, 200)

@professor_api.route('/questions/<question_id>', methods=['DELETE'])
@Auth.professor_auth_required
def delete_question(current_user, question_id):
    """
    delete this question
    """
    # retrieve question and check if valid
    question = QuestionModel.get_question_by_uuid(question_id)
    if not question:
        return custom_response({'error': 'question does not exist'}, 400)

    # retrieve course and check permissions
    course = question.lecture.course
    if not current_user in course.professors:
        return custom_response({'error': 'permission denied'}, 400)

    question.delete()
    return custom_response({'message': 'question deleted'}, 200)

@professor_api.route('/questions/<question_id>/answers', methods=['GET'])
@Auth.professor_auth_required
def get_answers(current_user, question_id):
    """
    returns all student answers for this question
    """
    question = QuestionModel.get_question_by_uuid(question_id)
    if not question:
        return custom_response({'error': 'question does not exist'}, 400)

    # retrieve course and check permissions
    course = question.lecture.course
    if not current_user in course.professors:
        return custom_response({'error': 'permission denied'}, 400)

    # retrieve answers and return
    answer_data = answer_schema.dump(question.answers, many=True).data
    return custom_response(answer_data, 200)

@professor_api.route('/questions/<question_id>', methods=['POST'])
@Auth.professor_auth_required
def handle_question_action(current_user, question_id):
    """
    open or close this question
    """
    # retrieve question and check if valid
    question = QuestionModel.get_question_by_uuid(question_id)
    if not question:
        return custom_response({'error': 'question does not exist'}, 400)

    # retrieve course and check permissions
    course = question.lecture.course
    if not current_user in course.professors:
        return custom_response({'error': 'permission denied'}, 400)

    # get data from request body
    req_data = request.get_json()

    # call the appropriate handler
    try:
        action = req_data['action']
    except:
        return custom_response({'error': 'action required'}, 400)
    if action == 'open':
        return _open_question(current_user, question, course)
    elif action == 'close':
        return _close_question(current_user, question, course)
    else:
        return custom_response({'error': 'invalid action'}, 400)

@professor_api.route('/questions/<question_id>', methods=['PATCH'])
@Auth.professor_auth_required
def update_question(current_user, question_id):
    # retrieve question and check if valid
    question = QuestionModel.get_question_by_uuid(question_id)
    if not question:
        return custom_response({'error': 'question does not exist'}, 400)

    # retrieve course and check permissions
    course = question.lecture.course
    if not current_user in course.professors:
        return custom_response({'error': 'permission denied'}, 400)

    # get data from request body
    updated_data = request.get_json()
    question.update(updated_data)

    return custom_response({'message': 'question updated'}, 200)

def _open_question(current_user, question, course):
    # check if question is opened already
    if question.is_open:
        return custom_response({'error': 'question is open already'}, 400)

    # open the question (note that that questions can be opened and closed multiple times)
    updated_data = {
        'is_open': True,
        'opened_at': datetime.datetime.utcnow(),
        'closed_at': None
    }
    question.update(updated_data)

    # push question to students using socketIO
    socketio.emit('server message', 'question ' + question.id + ' has been opened!', room=course.id)

    if question.question_type == 'multiple_choice':
        detailed_schema = MultipleChoiceSchema(exclude=['correct_answer'])  # TODO: maybe separate schemas to send questions to students vs. to profs?
    elif question.question_type == 'free_text':
        detailed_schema = FreeTextSchema(exclude=['correct_answer'])
    
    detailed_data = detailed_schema.dump(question).data
    socketio.emit('question opened', detailed_data, room=course.id)
    
    return custom_response({'message': 'question opened'}, 200)

def _close_question(current_user, question, course):
    # check if question is open
    if not question.is_open:
        return custom_response({'error': 'question is not open'}, 400)

    # close the question
    updated_data = {
        'is_open': False,
        'closed_at': datetime.datetime.utcnow()
    }
    question.update(updated_data)

    socketio.emit('server message', 'question ' + question.id + ' has been closed!', room=course.id)

    return custom_response({'message': 'question closed'}, 200)

@professor_api.route('/login', methods=['GET', 'POST'])
def login():
    """
    Does not provide authentication at the moment! 
    Its only purpose is to create a session (cookie) for a professor, which is used to identify the user in subsequent API calls.
    """

    # for testing purposes, the user only needs to supply his netId (no password required)
    if request.method == 'GET':
        
        if 'username' in session:
            netId = session['username']
        else:
            netId = None

        if 'role' in session:
            role = session['role']
        else:
            role = ''

        return render_template('login_professor.html', role=role, netId=netId)
    else:
        netId = request.form.get('netId')

        # check if student exists in DB
        professor = ProfessorModel.get_professor_by_netId(netId)
        if not professor:
            return render_template('login_professor.html', error='Invalid netId')
        
        # create a session for the user
        session['username'] = netId
        session['role'] = 'professor'

        service_url = request.args.get('service')

        if service_url:
            print('redirecting to' + service_url)
            return redirect(service_url)
        else:
            return render_template('login_professor.html', role=session['role'], netId=session['username'])

@professor_api.route('/logout', methods=['GET'])
def logout():
    """
    deletes the session cookie
    """
    session.pop('username', None)

    service_url = request.args.get('service')

    if service_url:
        return redirect(service_url)
    else:
        return custom_response({'message': 'logged out'}, 200)
