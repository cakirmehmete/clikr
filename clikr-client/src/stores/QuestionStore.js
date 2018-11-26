import { observable, action } from "mobx";
import { QuestionObj } from "../models/QuestionObj";

export default class QuestionsStore {
    constructor(lecture_id) {
        this.lecture_id = lecture_id;
    }

    @observable
    questions = []; // QuestionObj[]

    @action
    updateAllQuestions(questions) {
        this.questions = []

        questions.forEach(element => {
            this.questions.push(new QuestionObj(element.id, element.lecture_id, element.question_type, element.question_title, element.question_text, element.correct_answer, element.creator_id, element.is_open, element.opened_at, element.closed_at, element.created_at, element.modified_at))
        });
    }
}