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