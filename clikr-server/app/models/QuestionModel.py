# src/models/QuestionModel.py
# Uses sqlalchemy's single table inheritance for the subclasses of QuestionModel

from marshmallow import fields, Schema
import datetime
from .. import db
import uuid

class QuestionModel(db.Model):
    """
    Question Model
    """

    # table name
    __tablename__ = 'questions'

    # columns
    id = db.Column(db.String(36), primary_key=True) # uuid
    lecture_id = db.Column(db.String(36), db.ForeignKey('lectures.id')) # TODO: on update, on delete behavior
    question_type = db.Column(db.String(32), nullable=False)
    question_title = db.Column(db.String(256), nullable=True)
    question_text = db.Column(db.String(1024), nullable=True)
    correct_answer = db.Column(db.String(1024), nullable=True)
    creator_id = db.Column(db.String(36), db.ForeignKey('professors.id'))  # TODO: on update, on delete behavior
    is_open = db.Column(db.Boolean, nullable=False, default=False)
    opened_at = db.Column(db.DateTime, nullable=True)
    closed_at = db.Column(db.DateTime, nullable=True)
    created_at = db.Column(db.DateTime)
    modified_at = db.Column(db.DateTime)

    # for inheritance
    __mapper_args__ = {
        'polymorphic_on': question_type,
        'polymorphic_identity': 'question'
    }

    # class constructor
    def __init__(self, data):
        """
        Constructor for the base QuestionModel class; should never be called directly
        """
        self.id = str(uuid.uuid4())
        self.lecture_id = data.get('lecture_id')
        self.question_type = data.get('question_type')
        self.question_title = data.get('question_title')
        self.question_text = data.get('question_text')
        self.creator_id = data.get('creator_id')
        self.is_open = False
        self.opened_at = None
        self.closed_at = None
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
    def get_all_questions():
        return QuestionModel.query.all()

    @staticmethod
    def get_question_by_uuid(value):
        return QuestionModel.query.filter_by(id=value).first()

    def __repr__(self):
        return '<Question(id {})>'.format(self.id)

class MultipleChoiceModel(QuestionModel):
    # TODO: maybe use sqlalchemy.dialects.postgresql.ARRAY instead?
    option1 = db.Column(db.String(1024), nullable=True)
    option2 = db.Column(db.String(1024), nullable=True)
    option3 = db.Column(db.String(1024), nullable=True)
    option4 = db.Column(db.String(1024), nullable=True)
    option5 = db.Column(db.String(1024), nullable=True)
    # TODO: how can I add a not null constraint below, but still allow other question types to be inserted into the DB?
    number_of_options = db.Column(db.Integer, nullable=True)

    __mapper_args__ = {
        'polymorphic_identity': 'multiple_choice'
    }

    def __init__(self, data):
        super().__init__(data)

        self.option1 = data.get('option1')
        self.option2 = data.get('option2')
        self.option3 = data.get('option3')
        self.option4 = data.get('option4')
        self.option5 = data.get('option5')
        self.number_of_options = data.get('number_of_options')

class FreeTextModel(QuestionModel):
    word_limit = db.Column(db.Integer, nullable=True)

    __mapper_args__ = {
        'polymorphic_identity': 'free_text'
    }

    def __init__(self, data):
        super().__init__(data)

        self.word_limit = data.get('word_limit')

class QuestionSchema(Schema):
    """
    Question Schema
    """
    id = fields.Str(dump_only=True)
    lecture_id = fields.Str(required=True)
    question_type = fields.Str(required=True)
    question_title = fields.Str()
    question_text = fields.Str()
    creator_id = fields.Str()
    is_open = fields.Bool(dump_only=True)
    opened_at = fields.DateTime(dump_only=True)
    closed_at = fields.DateTime(dump_only=True)
    created_at = fields.DateTime(dump_only=True)
    modified_at = fields.DateTime(dump_only=True)

class MultipleChoiceSchema(QuestionSchema):
    option1 = fields.Str()
    option2 = fields.Str()
    option3 = fields.Str()
    option4 = fields.Str()
    option5 = fields.Str()
    number_of_options = fields.Integer(required=True)

class FreeTextSchema(QuestionSchema):
    word_limit = fields.Integer()