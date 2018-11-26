import { observable, action } from "mobx";
import LectureObj from '../models/LectureObj';

export default class QuestionsStore {
    constructor(lecture_id) {
        this.lecture_id = lecture_id;
    }

    @observable
    lectures = []; // LectureObj[]

    @action
    updateAllQuestions(lectures) {
        this.lectures = []

        lectures.forEach(element => {
            this.lectures.push(new LectureObj(element.title, null))
        })
    }
}