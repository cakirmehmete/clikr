#/src/views/StudentView

from flask import request, json, Response, Blueprint
import uuid
from ..models.StudentModel import StudentModel, StudentSchema
from ..models.CourseModel import CourseModel, CourseSchema
from ..models.QuestionModel import QuestionModel, QuestionSchema
from ..models.AnswerModel import AnswerModel, AnswerSchema
from .. import db
from ..shared.Authentication import Auth

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
@Auth.student_token_required
def get_courses(current_user):
    """
    returns all courses of the current student
    """
    courses = current_user.courses
    course_data = course_schema.dump(courses, many=True).data
    return custom_response(course_data, 200)

@student_api.route('/courses', methods=['POST'])
@Auth.student_token_required
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

@student_api.route('/courses/<course_id>/questions', methods=['GET'])
@Auth.student_token_required
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
    open_questions = QuestionModel.query.filter_by(is_open=True)
    question_data = question_schema.dump(open_questions, many=True).data
    return custom_response(question_data, 200)

@student_api.route('/questions/<question_id>', methods=['GET'])
@Auth.student_token_required
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
@Auth.student_token_required
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
    print(answer)
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

@student_api.route('/login', methods=['POST'])
def login():
    """
    Does not provide authentication at the moment!
    Its only purpose is to obtain a jwt token for a student, which is used to identify the user in subsequent API calls.
    """
    # for testing purposes, the user only needs to supply his netId (no password required)
    req_data = request.get_json()
    netId = req_data['netId']

    # check if student exists in DB
    student = StudentModel.get_student_by_netId(netId)
    if not student:
        return custom_response({'error': 'invalid user'}, 400) # FIXME: returns null token if user doesn't exist

    token = Auth.generate_token(netId, 'student')
    return custom_response({'x-acess-token': token}, 200)

def custom_response(res, status_code):
    """
    Custom Response Function
    """
    return Response(
        mimetype="application/json",
        response=json.dumps(res),
        status=status_code
    )
