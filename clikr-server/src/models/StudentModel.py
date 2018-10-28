# src/models/StudentModel.py
from marshmallow import fields, Schema
import datetime
from . import db

class StudentModel(db.Model):
  """
  Student Model
  """

  # table name
  __tablename__ = 'students'

  id = db.Column(db.Integer, primary_key=True)
  netId = db.Column(db.String(128), nullable=False)
  firstName = db.Column(db.String(128), nullable=False)
  lastName = db.Column(db.String(128), nullable=False)
  created_at = db.Column(db.DateTime)
  modified_at = db.Column(db.DateTime)

  # class constructor
  def __init__(self, data):
    """
    Class constructor
    """
    self.netId = data.get('netId')
    self.firstName = data.get('firstName')
    self.lastName = data.get('lastName')
    self.created_at = datetime.datetime.utcnow()
    self.modified_at = datetime.datetime.utcnow()

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
  def get_all_students():
    return StudentModel.query.all()

  @staticmethod
  def get_student_by_netId(value):
    return StudentModel.query.filter_by(netId=value).first()

  def __repr(self):
    return '<id {}>'.format(self.id)

class StudentSchema(Schema):
  """
  Student Schema
  """
  id = fields.Int(dump_only=True)
  netId = fields.Str(required=True)
  firstName = fields.Str(required=True)
  lastName = fields.Str(required=True)
  created_at = fields.DateTime(dump_only=True)
  modified_at = fields.DateTime(dump_only=True)