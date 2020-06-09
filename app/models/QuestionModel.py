# src/models/QuestionModel.py
# Uses sqlalchemy's single table inheritance for the subclasses of QuestionModel

from marshmallow import fields, Schema
import datetime
from .. import db
from ..shared.Util import CustomStringField, CustomIntegerField, CustomDateTimeField, CustomBoolField
import uuid

class QuestionModel(db.Model):
    """
    Question Model
    """

    # table name
    __tablename__ = 'questions'

    # columns
    id = db.Column(db.String(36), primary_key=True) # uuid
    lecture_id = db.Column(db.String(36), db.ForeignKey('lectures.id', onupdate='CASCADE', ondelete='CASCADE'))
    question_type = db.Column(db.String(32), nullable=False)
    question_title = db.Column(db.String(256), nullable=True)
    question_text = db.Column(db.String(1024), nullable=True)
    correct_answer = db.Column(db.String(1024), nullable=True)
    creator_id = db.Column(db.String(36), db.ForeignKey('professors.id', onupdate='CASCADE', ondelete='SET NULL'))
    is_open = db.Column(db.Boolean, nullable=False, default=False)
    opened_at = db.Column(db.DateTime, nullable=True)
    closed_at = db.Column(db.DateTime, nullable=True)
    created_at = db.Column(db.DateTime)
    modified_at = db.Column(db.DateTime)

    # relationships
    answers = db.relationship('AnswerModel', backref='question', lazy=True, passive_deletes=True)

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
        self.correct_answer = data.get('correct_answer')
        self.creator_id = data.get('creator_id')
        self.is_open = False
        self.opened_at = None
        self.closed_at = None
        timestamp = datetime.datetime.utcnow()
        self.created_at = timestamp
        self.modified_at = timestamp

    def is_correct(self, answer_text):
        """
        returns true if the given answer_text string is a correct answer to this question or if no correct answer was specified for the question;
        by default, compares answer_text to correct_answer; subclasses need to override this method if further processing is required
        """
        return self.correct_answer == None or self.correct_answer == '' or answer_text == self.correct_answer

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

        print("HELLO")
        self.word_limit = data.get('word_limit')

class SliderModel(QuestionModel):
    lower_label = db.Column(db.String(32), nullable=True)
    upper_label = db.Column(db.String(32), nullable=True)

    __mapper_args__ = {
        'polymorphic_identity': 'slider'
    }

    def __init__(self, data):
        super().__init__(data)

        self.lower_label = data.get('lower_label')
        self.upper_label = data.get('upper_label')
    
    def _check_expression(self, student_answer, operator, correct_answer):
        
        if operator == '<':
            return student_answer < correct_answer
        elif operator == '<=':
            return student_answer <= correct_answer
        elif operator == '>':
            return student_answer > correct_answer
        elif operator == '>=':
            return student_answer >= correct_answer
        else:
            return student_answer == correct_answer

    def is_correct(self, answer_text):
        """
        Method override for slider question
        """
        if self.correct_answer == None or self.correct_answer == '':
            return True
        
        expression_parts = self.correct_answer.split(' ')

        expr1 = self._check_expression(int(answer_text), expression_parts[0], int(expression_parts[1]))
        if len(expression_parts) == 2:
            return expr1
        else:
            expr2 = self._check_expression(int(answer_text), expression_parts[3], int(expression_parts[4]))
            if (expression_parts[2] == '&&'):
                return expr1 and expr2
            else:
                return expr1 or expr2



class DragAndDropModel(QuestionModel):
    # answer1 is the correct match for opttion1, etc.
    question1 = db.Column(db.String(1024), nullable=True)
    question2 = db.Column(db.String(1024), nullable=True)
    question3 = db.Column(db.String(1024), nullable=True)
    question4 = db.Column(db.String(1024), nullable=True)
    question5 = db.Column(db.String(1024), nullable=True)
    answer1 = db.Column(db.String(1024), nullable=True)
    answer2 = db.Column(db.String(1024), nullable=True)
    answer3 = db.Column(db.String(1024), nullable=True)
    answer4 = db.Column(db.String(1024), nullable=True)
    answer5 = db.Column(db.String(1024), nullable=True)
    # TODO: how can I add a not null constraint below, but still allow other question types to be inserted into the DB?
    number_of_questions = db.Column(db.Integer, nullable=True)

    __mapper_args__ = {
        'polymorphic_identity': 'drag_and_drop'
    }

    def __init__(self, data):
        super().__init__(data)

        self.question1 = data.get('question1')
        self.question2 = data.get('question2')
        self.question3 = data.get('question3')
        self.question4 = data.get('question4')
        self.question5 = data.get('question5')
        self.answer1 = data.get('answer1')
        self.answer2 = data.get('answer2')
        self.answer3 = data.get('answer3')
        self.answer4 = data.get('answer4')
        self.answer5 = data.get('answer5')
        self.number_of_questions = data.get('number_of_questions')

class QuestionSchema(Schema):
    """
    Question Schema
    """
    id = CustomStringField(dump_only=True)
    lecture_id = CustomStringField(required=True)
    question_type = CustomStringField(required=True)
    question_title = CustomStringField()
    question_text = CustomStringField(required=False)
    correct_answer = CustomStringField()
    creator_id = CustomStringField()
    is_open = CustomBoolField(dump_only=True)
    opened_at = CustomDateTimeField(dump_only=True)
    closed_at = CustomDateTimeField(dump_only=True)
    created_at = CustomDateTimeField(dump_only=True)
    modified_at = CustomDateTimeField(dump_only=True)

class MultipleChoiceSchema(QuestionSchema):
    option1 = CustomStringField()
    option2 = CustomStringField()
    option3 = CustomStringField()
    option4 = CustomStringField()
    option5 = CustomStringField()
    number_of_options = CustomIntegerField()

class FreeTextSchema(QuestionSchema):
    word_limit = CustomIntegerField()

class SliderSchema(QuestionSchema):
    lower_label = CustomStringField()
    upper_label = CustomStringField()

class DragAndDropSchema(QuestionSchema):
    question1 = CustomStringField()
    question2 = CustomStringField()
    question3 = CustomStringField()
    question4 = CustomStringField()
    question5 = CustomStringField()
    answer1 = CustomStringField()
    answer2 = CustomStringField()
    answer3 = CustomStringField()
    answer4 = CustomStringField()
    answer5 = CustomStringField()
    number_of_questions = CustomIntegerField(required=True)
