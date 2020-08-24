#/src/views/AdminView
# This module is meant for development/testing purposes (no authentication). It allows for creation of new users.

from flask import request, Response, Blueprint
import uuid
from ..models.StudentModel import StudentModel, StudentSchema
from ..models.ProfessorModel import ProfessorModel, ProfessorSchema
from ..models.CourseModel import CourseModel, CourseSchema
from ..models.LectureModel import LectureModel, LectureSchema
from ..models.QuestionModel import QuestionModel, QuestionSchema
from .. import db
from ..shared.Authentication import Auth
from ..shared.Util import custom_response

admin_api = Blueprint('admins', __name__)
student_schema = StudentSchema()
professor_schema = ProfessorSchema()
course_schema = CourseSchema()
lecture_schema = LectureSchema()
question_schema = QuestionSchema()

@admin_api.route('/professors', methods=['POST'])
def create_professor():
    """
    Create Professor Function
    """
    req_data = request.get_json()
    try:
        data = professor_schema.load(req_data)
    except ValidationError as error:
        return custom_response(error, 400)

    # check if professor already exists in the db
    user_exists_error = validate_user_exists(data.get('netId'))
    if user_exists_error:
        return user_exists_error

    professor = ProfessorModel(data)
    professor.save()

    professor_data = professor_schema.dump(professor).data

    return custom_response({'message': 'professor created', 'id': professor_data.get('id')}, 201)

@admin_api.route('/professors', methods=['GET'])
def get_professors():
    professors = ProfessorModel.get_all_professors()
    professor_data = professor_schema.dump(professors, many=True).data
    return custom_response(professor_data, 200)

@admin_api.route('/students', methods=['POST'])
def create_student():
    """
    Create Student Function
    """
    req_data = request.get_json()
    try:
        data = student_schema.load(req_data)
    except ValidationError as error:
        return custom_response(error, 400)

    # check if student already exists in the db
    user_exists_error = validate_user_exists(data.get('netId'))
    if user_exists_error:
        return user_exists_error

    student = StudentModel(data)
    student.save()

    student_data = student_schema.dump(student).data

    return custom_response({'message': 'student created', 'id': student_data.get('id')}, 201)

@admin_api.route('/students', methods=['GET'])
def get_students():
    students = StudentModel.get_all_students()
    students_data = student_schema.dump(students, many=True).data
    return custom_response(students_data, 200)

def validate_user_exists(netId: str):
    in_professor_database = ProfessorModel.get_professor_by_netId(netId)
    if in_professor_database:
        message = {'error': 'User already exists in professor database, please supply another netId'}
        return custom_response(message, 400)

    in_student_database = StudentModel.get_student_by_netId(netId)
    if in_student_database:
        message = {'error': 'User already exists in student database, please supply another netId'}
        return custom_response(message, 400)
