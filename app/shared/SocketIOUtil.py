from sqlalchemy import func
from flask_socketio import emit
from ..models.AnswerModel import AnswerModel
from .. import socketio

# SocketIO shared functions
def emit_question_statistics(question_id):
    """
    computes answer statistics for the question and broadcasts them in the question room (i.e., to the professor)
    """

    print("in the util function")

    # compute statistics
    results_raw = AnswerModel.query.filter_by(question_id=question_id).with_entities(AnswerModel.answer, func.count(AnswerModel.answer)).group_by(AnswerModel.answer).all()

    answers = {}
    count = 0
    for one_answer in results_raw:
        answers[one_answer[0]] = one_answer[1]
        count += one_answer[1]

    results = {}
    results['answers'] = answers
    results['count'] = count

    socketio.emit('new results', results, room=question_id)