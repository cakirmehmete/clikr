export class QuestionObj {
    constructor(id, lecture_id, question_type, question_title, question_image, correct_answer, creator_id, is_open, opened_at, closed_at, created_at, modified_at, answer) {

        this.id = id;
        this.lecture_id = lecture_id;
        this.question_type = question_type;
        this.question_title = question_title;
        this.question_image = question_image;
        this.correct_answer = correct_answer;
        this.creator_id = creator_id;
        this.is_open = is_open;
        this.opened_at = opened_at;
        this.closed_at = closed_at;
        this.created_at = created_at;
        this.modified_at = modified_at;
        this.answer = answer;
    }

}

export class MultipleChoiceQuestionObj extends QuestionObj {

    constructor(id, lecture_id, question_type, question_title, question_image, correct_answer, creator_id, is_open, opened_at, closed_at, created_at, modified_at, answer, option1, option2, option3, option4, option5, number_of_options) {

        super(id, lecture_id, question_type, question_title, question_image, correct_answer, creator_id, is_open, opened_at, closed_at, created_at, modified_at, answer);

        this.option1 = option1;
        this.option2 = option2;
        this.option3 = option3;
        this.option4 = option4;
        this.option5 = option5;
        this.number_of_options = number_of_options;
    }
}

export class SliderQuestionObj extends QuestionObj {

    constructor(id, lecture_id, question_type, question_title, question_image, correct_answer, creator_id, is_open, opened_at, closed_at, created_at, modified_at, answer, lower_label, upper_label) {

        super(id, lecture_id, question_type, question_title, question_image, correct_answer, creator_id, is_open, opened_at, closed_at, created_at, modified_at, answer);

        this.lower_label = lower_label;
        this.upper_label = upper_label;
    }
}

export class FreeTextQuestionObj extends QuestionObj {

    constructor(id, lecture_id, question_type, question_title, question_image, correct_answer, creator_id, is_open, opened_at, closed_at, created_at, modified_at, answer, word_limit) {

        super(id, lecture_id, question_type, question_title, question_image, correct_answer, creator_id, is_open, opened_at, closed_at, created_at, modified_at, answer);

        this.word_limit = word_limit;
    }
}