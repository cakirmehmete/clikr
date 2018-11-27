import { observable, action } from "mobx";
import CourseObj from '../models/CourseObj';
import LectureObj from '../models/LectureObj';
import { QuestionObj } from "../models/QuestionObj";

export default class ProfessorStore {
    constructor(course_id, lecture_id) {
        this.course_id = course_id;
        this.lecture_id = lecture_id;
    }

    @observable
    courses = []; // CourseObj[]

    @observable
    lectures = []; // LectureObj[]

    @observable
    questions = []; // QuestionObj[]

    @action
    updateAllCourses(courses) {
        this.courses = []

        courses.forEach(element => {
            // id: any, title: any, num: any, dept: any, description: any, term: any, joinCode: any, year: any
            this.courses.push(new CourseObj(element.id, element.title, element.coursenum,
                element.dept, element.description, element.term, element.enroll_code, element.year))
        })
    }

    getCourseWithId(course_id) {
        console.log(course_id)
        console.log(this.courses.find(x => x.id === course_id))
        return this.courses.find(x => x.id === course_id)
    }

    @action
    updateAllLectures(lectures) {
        this.lectures = []

        lectures.forEach(element => {
            // course_id: any, date: any, description: any, id: any, title: any
            this.lectures.push(new LectureObj(element.title, null))
        })
    }

    @action
    updateAllQuestions(questions) {
        this.questions = []

        questions.forEach(element => {
            this.questions.push(new QuestionObj(element.id, element.lecture_id,
                element.question_type, element.question_title, element.question_text,
                element.correct_answer, element.creator_id, element.is_open, element.opened_at,
                element.closed_at, element.created_at, element.modified_at))
        });
    }
}