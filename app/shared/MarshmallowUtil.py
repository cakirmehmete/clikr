from random import shuffle
from ..models.QuestionModel import MultipleChoiceModel, MultipleChoiceSchema, FreeTextModel, FreeTextSchema, SliderModel, SliderSchema, DragAndDropModel, DragAndDropSchema

# functions to facilitate dumping and loading marshmallow schemas
def dump_questions(questions, exclude=[]):
    """
    dumps a list of questions, using the appropriate schema for each question
    """
    questions_data = []

    # process each question
    for question in questions:
        question_data = dump_one_question(question, exclude)
        questions_data.append(question_data)

    return questions_data

def dump_one_question(question, exclude=[]):
    """
    checks the question type and uses the appropriate schema to dump the question
    """
    if question.question_type == 'multiple_choice':
        question_data = MultipleChoiceSchema(exclude=exclude).dump(question).data
    elif question.question_type == 'free_text':
        question_data = FreeTextSchema(exclude=exclude).dump(question).data
    elif question.question_type == 'slider':
        question_data = SliderSchema(exclude=exclude).dump(question).data
    elif question.question_type == 'drag_and_drop':
        question_data = DragAndDropSchema(exclude=exclude).dump(question).data
        if 'correct_answer' in exclude:
            # return a random permutation of the answers
            answers = []
            for i in range(question.number_of_questions):
                answers.append(question_data['answer' + str(i+1)])
            shuffle(answers)
            for i in range(question.number_of_questions):
                question_data['answer' + str(i+1)] = answers[i]
    else:
        raise Exception('invalid question type')

    return question_data

def load_one_question(input_data):
    """
    tries to create a question object of the appropriate question subclass
    raises an exception if the question type is missing or invalid
    """
    # check if question_type is present
    try:
        question_type = input_data['question_type']
    except:
        raise Exception('question_type missing')

    # load the appropriate schema and create object
    if question_type == 'multiple_choice':
        data, error = MultipleChoiceSchema().load(input_data)
        if error:
            raise Exception(error)
        question = MultipleChoiceModel(data)
    elif question_type == 'free_text':
        print(input_data)
        data, error = FreeTextSchema().load(input_data)
        if error:
            print(str(error))
            raise Exception(error)
        question = FreeTextModel(data)
    elif question_type == 'slider':
        data, error = SliderSchema().load(input_data)
        if error:
            raise Exception(error)
        question = SliderModel(data)
    elif question_type == 'drag_and_drop':
        data, error = DragAndDropSchema().load(input_data)
        if error:
            raise Exception(error)
        question = DragAndDropModel(data)
    else:
        raise Exception('invalid question_type')

    return question