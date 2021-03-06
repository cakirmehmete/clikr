#/src/views/ProfessorView

from flask import request, Response, Blueprint, session, render_template, redirect, send_from_directory
import uuid
from datetime import datetime, timezone, date
import random, string, os
import csv
from ..models.ProfessorModel import ProfessorModel, ProfessorSchema
from ..models.StudentModel import StudentModel, StudentSchema
from ..models.CourseModel import CourseModel, CourseSchema
from ..models.LectureModel import LectureModel, LectureSchema
from ..models.QuestionModel import QuestionModel, QuestionSchema, MultipleChoiceModel, MultipleChoiceSchema, FreeTextModel, FreeTextSchema, SliderModel, SliderSchema
from ..models.AnswerModel import AnswerModel, AnswerSchema
from .. import db, cas
from ..shared.Authentication import Auth
from ..shared.Util import custom_response, get_timestamp_string
from ..shared.SocketIOUtil import emit_question_statistics, compute_question_statistics
from ..shared.MarshmallowUtil import dump_questions, dump_one_question, load_one_question

from flask_socketio import emit, join_room
from .. import socketio

professor_api = Blueprint('professors', __name__)
professor_schema = ProfessorSchema()
student_schema = StudentSchema()
course_schema = CourseSchema()
lecture_schema = LectureSchema()

@socketio.on('subscribe professor')
def on_join(question_id):
    # authenticate the user
    current_user = Auth.authenticate_professor()
    if not current_user:
        emit('server message', 'permission denied')
        return

    # retrieve question and check if valid
    question = QuestionModel.get_question_by_uuid(question_id)
    if not question:
        emit('server message', 'invalid question_id')
        return

    # check permission
    if not question.lecture.course in current_user.courses:
        emit('server message', 'permission denied')
        return

    # join room and broadcast previous statistics
    join_room(question_id)
    emit('server message', 'you joined the room (question) ' + question_id)
    emit_question_statistics(question)

@professor_api.route('/data', methods=['GET'])
@Auth.professor_auth_required
def get_data(current_user):
    """
    returns all courses, lectures, and questions of the current prof
    """
    result = []
    courses = current_user.courses

    # process each course
    for course in courses:
        course_data = course_schema.dump(course).data

        lectures_data = []
        lectures = course.lectures
        lectures.sort(key=lambda lecture: lecture.created_at)

        # process each lecture within the course
        for lecture in lectures:
            lecture_data = lecture_schema.dump(lecture).data

            questions = lecture.questions
            questions_data = dump_questions(questions)
            lecture_data['questions'] = questions_data

            lectures_data.append(lecture_data)

        course_data['lectures'] = lectures_data
        result.append(course_data)

    return custom_response(result, 200)

@professor_api.route('/name', methods=['GET'])
@Auth.professor_auth_required
def get_name(current_user):
    """
    Returns name of the current prof
    """
    full_name = f'{current_user.netId}'
    return custom_response({'name': full_name}, 200)

@professor_api.route('/courses', methods=['GET'])
@Auth.professor_auth_required
def get_courses(current_user):
    """
    Returns all courses of the current prof
    """
    courses = current_user.courses
    courses.sort(key=lambda x: x.created_at)
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
    
    req_data['creator_id'] = current_user.id
    data, error = course_schema.load(req_data)

    if error:
        return custom_response(error, 400)

    data['enroll_code'] = _generate_course_enroll_code()
    
    course = CourseModel(data)

    # generate enrollment code and save to database
    enroll_code = _generate_course_enroll_code()
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

@professor_api.route('/courses/<course_id>/duplicate', methods=['POST'])
@Auth.professor_auth_required
def duplicate_course(current_user, course_id):
    # retrieve course and check if valid, permissions
    req_data = request.get_json()

    new_term = req_data['term']
    new_year = req_data['year']

    course = CourseModel.get_course_by_uuid(course_id)
    if not course:
        return custom_response({'error': 'course_id does not exist'}, 400)
    if not current_user in course.professors:
        return custom_response({'error': 'permission denied'}, 400)

    course_data = course_schema.dump(course).data
    course_data['term'] = new_term
    course_data['year'] = new_year
    course_data['enroll_code'] = _generate_course_enroll_code()

    new_course = CourseModel(course_data)
    new_course.save()

    # add the course to the prof's list of courses
    current_user.courses.append(new_course)
    db.session.commit()

    all_lectures = course.lectures
    all_lectures.sort(key=lambda x: x.created_at)
    for lecture in all_lectures:
        lecture_data = lecture_schema.dump(lecture).data
        lecture_data['course_id'] = new_course.id
        
        new_lecture = LectureModel(lecture_data)
        new_lecture.save()

        # add the lecture to this course's list of lectures
        new_course.lectures.append(new_lecture)
        db.session.commit()

        for question in lecture.questions:
            question_data = dump_one_question(question)
            question_data['lecture_id'] = new_lecture.id

            question_data = fix_dictionary(question_data)

            try:
                new_question = load_one_question(question_data)
            except Exception as e:
                return custom_response({'error': str(e)}, 400)

            new_question.save()

            # add the question to this lecture's list of questions
            new_lecture.questions.append(new_question)
            db.session.commit()

    return custom_response(course_data, 200)

def fix_dictionary(data):
    return {key: val for key, val in data.items() if val is not None}

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

@professor_api.route('/courses/<course_id>/archive', methods=['POST'])
@Auth.professor_auth_required
def archive_course(current_user, course_id):
    # retrieve course and check if valid, permissions
    course = CourseModel.get_course_by_uuid(course_id)
    if not course:
        return custom_response({'error': 'course_id does not exist'}, 400)
    if not current_user in course.professors:
        return custom_response({'error': 'permission denied'}, 400)

    # get data from request body
    message = ""
    if course.is_current:
        course.is_current = False
        message = "course archived"
    else:
        course.is_current = True
        message = "course unarchived"
    course.save()

    course_data = course_schema.dump(course).data
    return custom_response({'message': message, 'id': course.id, 'course': course_data}, 200)

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

@professor_api.route('/courses/<course_id>/code', methods=['POST'])
@Auth.professor_auth_required
def reset_enrollment_code(current_user, course_id):
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

    enroll_code = _generate_course_enroll_code()
    updated_data = {'enroll_code' : enroll_code}
    course.update(updated_data)

    return custom_response({'message': 'code created', 'enroll_code': enroll_code}, 200)

ENROLL_CODE_VALID_CHARACTERS = "ABCDEFGHIJKLMNPQRSTUVWXYZ123456789"

def _generate_course_enroll_code():
    """
    generate an enrollment code and check that it isn't a duplicate
    """
    enroll_code = ''.join(random.choices(ENROLL_CODE_VALID_CHARACTERS, k=6))
    course = CourseModel.get_course_by_code(enroll_code)

    while course:
        enroll_code = ''.join(random.choices(ENROLL_CODE_VALID_CHARACTERS, k=6))
        course = CourseModel.get_course_by_code(enroll_code)
    return enroll_code

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

@professor_api.route('/courses/<course_id>/exportstudents', methods=['GET'])
@Auth.professor_auth_required
def export_students(current_user, course_id):
    """
    returns a csv file with grades
    """
    # retrieve course and check if valid
    course = CourseModel.get_course_by_uuid(course_id)
    if not course:
        return custom_response({'error': 'course_id does not exist'}, 400)

    # check permissions
    if not current_user in course.professors:
        return custom_response({'error': 'permission denied'}, 400)

    # build csv file
    headers = ['username']
    student_netIds = []

    students = course.students
    for student in students:
        student_netIds.append(student.netId)

    # note that heroku discards dynamically generated files on dyno restart!
    now = get_timestamp_string()
    filename = f'students_{course_id}_on_{now}.csv'
    with open('app/views/dynamic_content/students/' + filename, 'w') as f:
        csv.register_dialect('quote all', quoting=csv.QUOTE_ALL)
        writer = csv.writer(f, dialect='quote all')
        writer.writerow(headers)
        for student_netId in student_netIds:
            writer.writerow([student_netId])

    dirname = os.path.dirname(__file__)
    path = os.path.join(dirname, "dynamic_content/students/", filename)
    if os.path.exists(path):
        try:
            return send_from_directory('views/dynamic_content/students', filename, as_attachment=True)
        finally:
            os.remove(path)
    else:
        return custom_response({'error': 'something is wrong'}, 500)

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


def convert_date(old_date):
    date = datetime.strptime(old_date[:-5], '%Y-%m-%dT%H:%M:%S')
    date.replace(tzinfo=timezone.utc).astimezone(tz=None)
    return date.strftime('%Y-%m-%d')

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

@professor_api.route('/lectures/<lecture_id>', methods=['POST'])
@Auth.professor_auth_required
def handle_question_action_for_lecture(current_user, lecture_id):
    # retrieve lecture and check if valid
    lecture = LectureModel.get_lecture_by_uuid(lecture_id)
    if not lecture:
        return custom_response({'error': 'lecture_id does not exist'}, 400)

    # retrieve course and check permissions
    course = lecture.course
    if not current_user in course.professors:
        return custom_response({'error': 'permission denied'}, 400)

    # get data from request body
    req_data = request.get_json()

    # open or close all questions
    questions = lecture.questions
    try:
        action = req_data['action']
    except:
        return custom_response({'error': 'action required'}, 400)
    if action == 'open':
        for question in questions:
            _open_question(question, course)
        return custom_response({'message': 'all questions opened'}, 200)
    elif action == 'close':
        for question in questions:
            _close_question(question, course)
        return custom_response({'message': 'all questions closed'}, 200)
    else:
        return custom_response({'error': 'invalid action'}, 400)

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

    lecture_data = lecture_schema.dump(lecture).data
    lecture_data['num_questions'] = len(lecture.questions)

    return custom_response({'message': 'lecture updated', 'id': lecture.id, 'lecture': lecture_data}, 200)

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
    question_data = dump_questions(questions)
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

    # try to load the appropriate schema and create new question
    try:
        question = load_one_question(req_data)
    except Exception as e:
        return custom_response({'error': str(e)}, 400)

    question.save()

    # add the question to this lecture's list of questions
    lecture.questions.append(question)
    db.session.commit()

    all_questions = lecture.questions
    all_questions_data = dump_questions(all_questions)
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

    # dump using appropriate schema and return
    question_data = dump_one_question(question)
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
    answer_data = AnswerSchema().dump(question.answers, many=True).data
    return custom_response(answer_data, 200)

@professor_api.route('/courses/<course_id>/exportgrades', methods=['GET'])
@Auth.professor_auth_required
def export_course_grades(current_user, course_id):
    """
    returns a csv file with grades
    """
    # retrieve course and check if valid
    course = CourseModel.get_course_by_uuid(course_id)
    if not course:
        return custom_response({'error': 'course_id does not exist'}, 400)

    # check permissions
    if not current_user in course.professors:
        return custom_response({'error': 'permission denied'}, 400)

    # call helper function to create the export file
    return _export_grades(course=course)

@professor_api.route('/lectures/<lecture_id>/exportgrades', methods=['GET'])
@Auth.professor_auth_required
def export_lecture_grades(current_user, lecture_id):
    """
    returns a csv file with grades
    """
    # retrieve lecture and check if valid
    lecture = LectureModel.get_lecture_by_uuid(lecture_id)
    if not lecture:
        return custom_response({'error': 'lecture_id does not exist'}, 400)

    # check permissions
    if not current_user in lecture.course.professors:
        return custom_response({'error': 'permission denied'}, 400)

    # call helper function to create the export file
    return _export_grades(lecture=lecture, course=None)

def _export_grades(course=None, lecture=None):
    """
    helper function that creates a csv file with grades for either an entire course or a single lecture
    """

    # build csv file
    headers = ['Student', 'Total Correct', 'Lectures Attended', 'Questions Answered']
    score_dict = {}    # dictionary with student id's as keys, dictionaries as values (which in turn have question ids as keys and scores as values)
    export_course = False

    if course:
        lectures = course.lectures
        lectures.sort(key=lambda x: x.created_at)
        course_title = course.title.replace(' ', '_')
        file_id = course_title
        export_course = True
    elif lecture:
        course = lecture.course
        course_title = course.title.replace(' ', '_')
        lectures = [lecture]
        lecture_title = lecture.title.replace(' ', '_')
        file_id = f'{lecture_title}_of_{course_title}'
    else:
        raise Exception('must pass either course or lecture')

    # fill score_dict with empty dicts for enrolled students
    for student in course.students:
        score_dict[student.id] = {'Total Correct': 0, 'Lectures Attended': 0, 'Questions Answered': 0}
    
    if export_course:
        for lecture in lectures:
            lecture_header = f'Total for {lecture.title}'
            headers.append(lecture_header)
            for student in course.students:
                score_dict[student.id][lecture_header] = 0

    num_lectures = 0
    num_questions = 0

    # process all questions
    for lecture in lectures:
        num_lectures += 1
        questions = lecture.questions
        attending_students = set()
        for question in questions:
            num_questions += 1
            col_header = f'{lecture.title}: {question.question_title}'
            headers.append(col_header)
            answers = question.answers

            # process each answer to this question
            for answer in answers:
                student_id = answer.student_id
                attending_students.add(student_id)
                score = 1 if question.is_correct(answer.answer) else 0

                # add score to the student's list (if enrolled)
                if student_id in score_dict:
                    score_dict[student_id]['Total Correct'] += score
                    score_dict[student_id]['Questions Answered'] += 1
                    score_dict[student_id][col_header] = score
                    if export_course:
                        score_dict[student_id][lecture_header] += score
        
        for student_id in attending_students:
            score_dict[student_id]['Lectures Attended'] += 1

    # note that heroku discards dynamically generated files on dyno restart!
    today = date.today().strftime("%b-%d-%Y")
    filename = f'grades_for_{file_id}_on_{today}.csv'
    dirname = os.path.dirname(__file__)
    with open(os.path.join(dirname, 'dynamic_content/grades/', filename), 'w') as f:
        csv.register_dialect('quote all', quoting=csv.QUOTE_ALL)
        writer = csv.DictWriter(f, headers, restval=0, dialect='quote all')
        writer.writeheader()
        for student_id, inner_dict in score_dict.items():
            netId = StudentModel.get_student_by_uuid(student_id).netId
            inner_dict['Student'] = netId
            writer.writerow(inner_dict)
        
        f.write('\n\n')
        summary_writer = csv.DictWriter(f, ['Summary Statistics', 'Total Lectures', 'Total Questions'], restval=0, dialect='quote all')
        summary_writer.writeheader()
        summary_writer.writerow({
            'Summary Statistics': '',
            'Total Lectures': num_lectures,
            'Total Questions': num_questions
        })

    with open(os.path.join(dirname, 'dynamic_content/grades/', filename), 'r') as f:
        file_data = f.read()

    path = os.path.join(dirname, "dynamic_content/grades/", filename)
    if os.path.exists(path):
        try:
            return custom_response({
                'fileData': file_data,
                'fileName': filename
            }, 200)
        finally:
            os.remove(path)
    else:
        return custom_response({'error': 'something is wrong'}, 500)

@professor_api.route('/questions/<question_id>/statistics', methods=['GET'])
@Auth.professor_auth_required
def get_answer_statistics(current_user, question_id):
    """
    returns a summary of the answers to this question (count of answers per answer option and total count)
    """
    question = QuestionModel.get_question_by_uuid(question_id)
    if not question:
        return custom_response({'error': 'question does not exist'}, 400)

    # retrieve course and check permissions
    course = question.lecture.course
    if not current_user in course.professors:
        return custom_response({'error': 'permission denied'}, 400)

    results = compute_question_statistics(question)
    return custom_response(results, 200)

@professor_api.route('/lectures/<lecture_id>/statistics', methods=['GET'])
@Auth.professor_auth_required
def get_answer_statistics_for_lecture(current_user, lecture_id):
    """
    Returns the answer statistics for all questions in a lecture
    """
    # retrieve lecture and check if valid
    lecture = LectureModel.get_lecture_by_uuid(lecture_id)
    if not lecture:
        return custom_response({'error': 'lecture does not exist'}, 400)

    # retrieve course and check permissions
    course = lecture.course
    if not current_user in course.professors:
        return custom_response({'error': 'permission denied'}, 400)

    result = {}
    questions = lecture.questions
    for question in questions:
        question_id = question.id
        result[question_id] = compute_question_statistics(question)

    return custom_response(result, 200)

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
    lecture = question.lecture
    course = lecture.course
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
        lecture.date = date.today().strftime('%Y-%m-%d')
        lecture.save()

        success = _open_question(question, course)
        if success:
            return custom_response({'message': 'question opened'}, 200)
        else:
            return custom_response({'message': 'question is already open'}, 400)
    elif action == 'close':
        success = _close_question(question, course)
        if success:
            return custom_response({'message': 'question closed'}, 200)
        else:
            return custom_response({'message': 'question is not open'}, 400)
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

def _open_question(question, course):
    """
    opens the question and broadcasts it via SocketIO
    returns true if the question was successfully opened, false if it was already open
    """
    # check if question is opened already
    if question.is_open:
        return False

    # check if lecture is scheduled
    if question.lecture.scheduled:
        return False

    # open the question (note that that questions can be opened and closed multiple times)
    updated_data = {
        'is_open': True,
        'opened_at': datetime.utcnow(),
        'closed_at': None
    }
    question.update(updated_data)

    # push question to students using socketIO
    response_data = {}
    response_data['question'] = dump_one_question(question, exclude=['correct_answer'])
    response_data['message'] = 'question opened'
    socketio.emit('question opened', response_data, room=course.id)

    return True

def _close_question(question, course):
    """
    closes the question and broadcasts it (incl. correct answer) via SocketIO
    returns true if the question was successfully closed, false if it was already closed
    """
    # check if question is open
    if not question.is_open:
        return False

    # close the question
    updated_data = {
        'is_open': False,
        'closed_at': datetime.utcnow()
    }
    question.update(updated_data)

    # push question data (incl. correct answer) to students
    response_data = {}
    response_data['question'] = dump_one_question(question)
    response_data['message'] = 'question closed'

    socketio.emit('question closed', response_data, room=course.id)

    return True

@professor_api.route('/login', methods=['GET'])
@cas.cas_required
def login():
    """
    Redirects the user to the CAS login page, which after succesful cas login redirects back here.
    This page then redirects again to the page specified in the service parameter (or to the login page if none specified)
    """
    netId = session['username']
    
    # check if this user exists in the database, otherwise create it
    current_user = ProfessorModel.get_professor_by_netId(netId)
    
    if not current_user:
        # create new professor
        current_user = ProfessorModel({'netId': netId})
        current_user.save()

    # set role (username is set by CASClient)
    session['role'] = 'professor'

    # check if there is a redirect url
    service_url = request.args.get('service')
    if service_url:
        print('redirecting to' + service_url)
        return redirect(service_url)
    else:
        return 'logged in as instructor ' + session['username']

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
        return 'logged out'

# endpoint for socketIO testing; comment out before deployment
# @professor_api.route('/socketio', methods=['GET'])
# def socketIO_test():
#     return render_template('socketIO_professor.html')