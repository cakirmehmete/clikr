# src/models/AnswerModel.py

from marshmallow import fields, Schema
import datetime
from .. import db
from ..shared.Util import CustomStringField, CustomDateTimeField
import uuid

class AnswerModel(db.Model):
    """
    Answer Model
    """

    # table name
    __tablename__ = 'answers'

    # columns
    id = db.Column(db.String(36), primary_key=True) # uuid
    student_id = db.Column(db.String(36), db.ForeignKey('students.id', onupdate='CASCADE', ondelete='CASCADE'))
    question_id = db.Column(db.String(36), db.ForeignKey('questions.id', onupdate='CASCADE', ondelete='CASCADE'))
    answer = db.Column(db.String(), nullable=False)
    created_at = db.Column(db.DateTime)
    modified_at = db.Column(db.DateTime)

    # class constructor
    def __init__(self, data):
        """
        Class constructor
        """
        self.id = str(uuid.uuid4())
        self.student_id = data.get('student_id')
        self.question_id = data.get('question_id')
        self.answer = data.get('answer')
        timestamp = datetime.datetime.utcnow()
        self.created_at = timestamp
        self.modified_at = timestamp

    def save(self):
        db.session.add(self)
        db.session.commit()

    def update(self, data):
        for key, item in data.items():
            setattr(self, key, item)
            self.modified_at = datetime.datetime.utcnow()
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    @staticmethod
    def get_all_answers():
        return AnswerModel.query.all()

    @staticmethod
    def get_answer_by_uuid(value):
        return AnswerModel.query.filter_by(id=value).first()

    def __repr__(self):
        return '<Answer(id {})>'.format(self.id)

class AnswerSchema(Schema):
    """
    Answer Schema
    """
    id = CustomStringField(dump_only=True)
    student_id = CustomStringField(required=True)
    question_id = CustomStringField(required=True)
    answer = CustomStringField(required=True)
    created_at = CustomDateTimeField(dump_only=True)
    modified_at = CustomDateTimeField(dump_only=True)