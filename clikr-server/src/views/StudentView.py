#/src/views/StudentView

from flask import request, json, Response, Blueprint
from ..models.StudentModel import StudentModel, StudentSchema

student_api = Blueprint('students', __name__)
student_schema = StudentSchema()

@student_api.route('/', methods=['POST'])
def create():
  """
  Create Student Function
  """
  req_data = request.get_json()
  data, error = student_schema.load(req_data)

  if error:
    return custom_response(error, 400)
  
  # check if student already exist in the db
  student_in_db = StudentModel.get_student_by_netId(data.get('netId'))
  if student_in_db:
    message = {'error': 'Student already exist, please supply another net Id'}
    return custom_response(message, 400)
  
  student = StudentModel(data)
  student.save()

  student_data = student_schema.dump(student).data

  return custom_response({'id': student_data.get('id')}, 201)

@student_api.route('/', methods=['GET'])
def get_all():
  students = StudentModel.get_all_students()
  students_data = student_schema.dump(students, many=True).data
  return custom_response(students_data, 200)

def custom_response(res, status_code):
  """
  Custom Response Function
  """
  return Response(
    mimetype="application/json",
    response=json.dumps(res),
    status=status_code
  )