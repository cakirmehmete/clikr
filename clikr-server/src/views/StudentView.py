#/src/views/StudentView

from flask import request, json, Response, Blueprint
import uuid
from ..models.StudentModel import StudentModel, StudentSchema
from ..models.CourseModel import CourseModel, CourseSchema
from ..models import db
from ..shared.Authentication import Auth

student_api = Blueprint('students', __name__)
student_schema = StudentSchema()
course_schema = CourseSchema()

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
    course_id = req_data.get("course_id")

    # retrieve course and check if valid
    course = CourseModel.get_course_by_uuid(course_id)
    if not course:
        return custom_response({'error': 'course_id does not exist'}, 400)
    if course in current_user.courses:
        return custom_response({'error': 'already enrolled in this course'}, 400)

    # add the course to the student's list of courses
    current_user.courses.append(course)
    db.session.commit()

    # prepare response
    course_data = course_schema.dump(course).data
    return custom_response({'message': 'student enrolled', 'id': course_data.get('id')}, 201)

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
    return custom_response({'api-token': token}, 200)

def custom_response(res, status_code):
    """
    Custom Response Function
    """
    return Response(
        mimetype="application/json",
        response=json.dumps(res),
        status=status_code
    )