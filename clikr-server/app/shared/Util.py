from flask import Response, json
from marshmallow import fields

def custom_response(res, status_code):
    """
    Custom Response Function
    """
    return Response(
        mimetype="application/json",
        response=json.dumps(res),
        status=status_code
    )

def validate_user_exists(netId: str):
    in_professor_database = ProfessorModel.get_professor_by_netId(netId)
    if in_professor_database:
        message = {'error': 'User already exists in professor database, please supply another netId'}
        return custom_response(message, 400)

    in_student_database = StudentModel.get_student_by_netId(netId)
    if in_student_database:
        message = {'error': 'User already exists in student database, please supply another netId'}
        return custom_response(message, 400)

# Use these custom fields to treat the empty string as None when loading marshmallow schemas
class NoneMixin(object):
    def _deserialize(self, value, attr, obj):
        if value == '':
            return None
        return super(NoneMixin, self)._deserialize(value, attr, obj)

class CustomStringField(NoneMixin, fields.String):
    pass

class CustomIntegerField(NoneMixin, fields.Integer):
    pass

class CustomDateField(NoneMixin, fields.Date):
    pass

class CustomDateTimeField(NoneMixin, fields.DateTime):
    pass

class CustomBoolField(NoneMixin, fields.Bool):
    pass