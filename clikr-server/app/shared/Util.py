from flask import Response, json
from marshmallow import fields

import datetime

def custom_response(res, status_code):
    """
    Custom Response Function
    """
    return Response(
        mimetype="application/json",
        response=json.dumps(res),
        status=status_code
    )

def get_timestamp_string():
    now = datetime.datetime.now()
    return now.strftime('%Y-%m-%dT%H:$M:$S')

def generate_salt():
    salt = ''.join(random.choices('1234567890abcdef', k=128))

    return salt

def check_valid_login(password, salt, hash):
    check_hash = hashlib.sha256()
    check_hash.update(salt.encode('utf-8'))
    check_hash.update(password.encode('utf-8'))

    return check_hash.hexdigest() == hash

def check_lecture_open(lecture):
    if (lecture.open_date is None or lecture.close_date is None) or not lecture.scheduled:
        return False

    today = datetime.date.today()

    return today >= lecture.open_date and today <= lecture.close_date

def check_lecture_past(lecture):
    if (lecture.open_date is None or lecture.close_date is None) or not lecture.scheduled:
        return False

    today = datetime.date.today()

    return today > lecture.close_date

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