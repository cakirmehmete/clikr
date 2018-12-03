import { observable, action } from "mobx";
import CourseObj from '../models/CourseObj';
import { MultipleChoiceQuestionObj } from "../models/QuestionObj";
import { FreeTextQuestionObj } from "../models/QuestionObj";

export default class StudentStore {
  @observable
  courses = []; // CourseObj[]

  @observable
  questions = []; // QuestionObj[]



  @action
  updateAllCourses(courses) {
    this.courses = []

    courses.forEach(element => {
      // id: any, title: any, num: any, dept: any, description: any, term: any, joinCode: any, year: any
      this.courses.push(new CourseObj(element.title, element.id, element.coursenum,
        element.dept, element.description, element.term, element.enroll_code, element.year))
    })
  }

  @action
  updateAllQuestions(questions) {
      this.questions = []

      questions.forEach(element => {
        if (element.question_type === 'multiple_choice') {
          this.questions.push(new MultipleChoiceQuestionObj(element.id, element.lecture_id,
            element.question_type, element.question_title, element.question_text,
            element.correct_answer, element.creator_id, element.is_open, element.opened_at,
            element.closed_at, element.created_at, element.modified_at, element.option1, 
            element.option2, element.option3, element.option4, element.option5, element.number_of_options))
        }
        else {
          this.questions.push(new FreeTextQuestionObj(element.id, element.lecture_id,
            element.question_type, element.question_title, element.question_text,
            element.correct_answer, element.creator_id, element.is_open, element.opened_at,
            element.closed_at, element.created_at, element.modified_at, element.word_limit))
        }
          
      });
  }
  
}