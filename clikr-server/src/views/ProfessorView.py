#/src/views/ProfessorView

from flask import request, json, Response, Blueprint
import uuid
import datetime
import random, string
from ..models.ProfessorModel import ProfessorModel, ProfessorSchema
from ..models.StudentModel import StudentModel, StudentSchema
from ..models.CourseModel import CourseModel, CourseSchema
from ..models.LectureModel import LectureModel, LectureSchema
from ..models.QuestionModel import QuestionModel, QuestionSchema, MultipleChoiceModel, MultipleChoiceSchema, FreeTextModel, FreeTextSchema
from ..models import db
from ..shared.Authentication import Auth

professor_api = Blueprint('professors', __name__)
professor_schema = ProfessorSchema()
student_schema = StudentSchema()
course_schema = CourseSchema()
lecture_schema = LectureSchema()
question_schema = QuestionSchema()
multiple_choice_schema = MultipleChoiceSchema()
free_text_schema = FreeTextSchema()

@professor_api.route('/courses', methods=['GET'])
@Auth.professor_token_required
def get_courses(current_user):
    """
    Returns all courses of the current prof
    """
    courses = current_user.courses
    course_data = course_schema.dump(courses, many=True).data
    return custom_response(course_data, 200)

@professor_api.route('/courses', methods=['POST'])
@Auth.professor_token_required
def create_course(current_user):
    """
    Creates a new course of the current prof
    """
    # get data from request body and create new course
    req_data = request.get_json()
    req_data['creator_id'] = current_user.id
    data, error = course_schema.load(req_data)

    if error:
        return custom_response(error, 400)

    course = CourseModel(data)
    course.save()

    enroll_code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
    updated_data = {'enroll_code' : enroll_code}
    course.update(updated_data)

    # add the course to the prof's list of courses
    current_user.courses.append(course)
    db.session.commit()

    # prepare response
    course_data = course_schema.dump(course).data
    return custom_response({'message': 'course created', 'id': course_data.get('id'),
                            'creator_id': course_data.get('creator_id')}, 201)

@professor_api.route('/courses/<course_id>', methods=['GET'])
@Auth.professor_token_required
def get_course_info(current_user, course_id):
    # retrive course and check if valid, permissions
    course = CourseModel.get_course_by_uuid(course_id)
    if not course:
        return custom_response({'error': 'course_id does not exist'}, 400)
    if not current_user in course.professors:
        return custom_response({'error': 'permission denied'}, 400)

    course_data = course_schema.dump(course).data
    course_data_reduced = {'dept':course_data['dept'], 'coursenum':course_data['coursenum'],
                            'title':course_data['title'], 'description':course_data['description'],
                            'year':course_data['year'],'term':course_data['term'],
                            'created_at':course_data['created_at'], 'modified_at':course_data['modified_at']}
    return custom_response(course_data_reduced, 200)

@professor_api.route('/courses/<course_id>', methods=['POST'])
@Auth.professor_token_required
def add_professor(current_user, course_id):
    """
    add professor to a course by adding a course to the professor's courses
    """
    course = CourseModel.get_course_by_uuid(course_id)

    # check permissions
    if not course:
        return custom_response({'error': 'course_id does not exist'}, 400)
    if not current_user in course.professors:
        return custom_response({'error': 'permission denied'}, 400)

    req_data = request.get_json()
    new_professor = req_data.get("netId")

    course = CourseModel.get_course_by_uuid(course_id)

    # check if professor already part of course
    professor = ProfessorModel.get_professor_by_netId(new_professor)
    if course in professor.courses:
        return custom_response({'error': 'already teaching this course'}, 400)

    professor.courses.append(course)
    db.session.commit()

    return custom_response({'message': 'professor added to course',
                            'netId': new_professor}, 201)

@professor_api.route('/courses/<course_id>', methods=['PATCH'])
@Auth.professor_token_required
def update_course(current_user, course_id):
    # retrive course and check if valid, permissions
    course = CourseModel.get_course_by_uuid(course_id)
    if not course:
        return custom_response({'error': 'course_id does not exist'}, 400)
    if not current_user in course.professors:
        return custom_response({'error': 'permission denied'}, 400)

    # get data from request body
    updated_data = request.get_json()
    course.update(updated_data)

    return custom_response({'message': 'course updated'}, 201)

@professor_api.route('/courses/<course_id>/code', methods=['GET'])
@Auth.professor_token_required
def get_enrollment_code(current_user, course_id):
    """
    gives course an enrollment code
    """
    course = CourseModel.get_course_by_uuid(course_id)

    if not course:
        return custom_response({'error': 'course_id does not exist'}, 400)
    # check permissions
    if not current_user in course.professors:
        return custom_response({'error': 'permission denied'}, 400)

    enroll_code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
    updated_data = {'enroll_code' : enroll_code}
    course.update(updated_data)

    return custom_response(updated_data, 200)

@professor_api.route('/courses/<course_id>/students', methods=['GET'])
@Auth.professor_token_required
def get_students(current_user, course_id):
    """
    gets list of students enrolled in courses
    """
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
@Auth.professor_token_required
def enroll_student(current_user, course_id):
    """
    manually enrolls student
    """
    req_data = request.get_json()
    netId = req_data.get("netId")
    student = StudentModel.get_student_by_netId(netId)

    if not student:
        return custom_response({'error': 'student netId does not exist'}, 400)

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
@Auth.professor_token_required
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

    # add the course to the student's list of courses
    student.courses.remove(course) 
    db.session.commit()

    # prepare response
    course_data = course_schema.dump(course).data
    return custom_response({'message': 'student removed',
                            'id': course_data.get('id'),
                            'netId': student_netId}, 200)

@professor_api.route('/courses/<course_id>/lectures', methods=['GET'])
@Auth.professor_token_required
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
    lecture_data = lecture_schema.dump(lectures, many=True).data
    return custom_response(lecture_data, 200)

@professor_api.route('/courses/<course_id>/lectures', methods=['POST'])
@Auth.professor_token_required
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

    # prepare response
    lecture_data = lecture_schema.dump(lecture).data
    return custom_response({'message': 'lecture created',
                            'id': lecture_data['id'],
                            'course_id': lecture_data['course_id']}, 200)

@professor_api.route('/lectures/<lecture_id>', methods=['GET'])
@Auth.professor_token_required
def get_lecture_info(current_user, lecture_id):
    # retrieve lecture and check if valid
    lecture = LectureModel.get_lecture_by_uuid(lecture_id)
    if not lecture:
        return custom_response({'error': 'lecture_id does not exist'}, 400)

    # retrieve course and check permissions
    course = lecture.course
    if not current_user in course.professors:
        return custom_response({'error': 'permission denied'}, 400)

    lecture_data = lecture_schema.dump(lecture).data
    return custom_response(lecture_data, 200)

@professor_api.route('/lectures/<lecture_id>', methods=['PATCH'])
@Auth.professor_token_required
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

    return custom_response({'message': 'lecture updated'}, 201)

@professor_api.route('/lectures/<lecture_id>/questions', methods=['GET'])
@Auth.professor_token_required
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
@Auth.professor_token_required
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

    # prepare response
    question_data = question_schema.dump(question).data
    return custom_response({'message': 'question created',
                            'id': question_data['id'],
                            'lecture_id': question_data['lecture_id'],
                            'question_type': question_data['question_type']}, 201)

@professor_api.route('/questions/<question_id>', methods=['GET'])
@Auth.professor_token_required
def get_question_info(current_user, question_id):
    # retrieve question and check if valid
    question = QuestionModel.get_question_by_uuid(question_id)
    if not question:
        return custom_response({'error': 'question_id does not exist'}, 400)

    # retrieve course and check permissions
    course = question.lecture.course
    if not course:
        return custom_response({'error': 'course_id does not exist'}, 400)
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

@professor_api.route('/questions/<question_id>', methods=['POST'])
@Auth.professor_token_required
def handle_question_action(current_user, question_id):
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
@Auth.professor_token_required
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

    return custom_response({'message': 'question updated'}, 201)

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

    return custom_response({'message': 'question closed'}, 200)

@professor_api.route('/login', methods=['POST'])
def login():
    """
    Does not provide authentication at the moment!
    Its only purpose is to obtain a jwt token for a prof, which is used to identify the user in subsequent API calls.
    """
    # for testing purposes, the user only needs to supply his netId (no password required)
    req_data = request.get_json()
    netId = req_data['netId']

    # check if prof exists in DB
    professor = ProfessorModel.get_professor_by_netId(netId)
    if not professor:
        return custom_response({'error': 'invalid user'}, 400)

    token = Auth.generate_token(netId, 'professor')
    return custom_response({'x-access-token': token}, 200)

def custom_response(res, status_code):
    """
    Custom Response Function
    """
    return Response(
        mimetype="application/json",
        response=json.dumps(res),
        status=status_code
    )
