import { observable, action } from "mobx";
import CourseObj from '../models/CourseObj';
import { MultipleChoiceQuestionObj } from "../models/QuestionObj";
import { FreeTextQuestionObj } from "../models/QuestionObj";

export default class StudentStore {
  @observable
  courses = []; // CourseObj[]

  @observable
  questions = []; // QuestionObj[]

  @observable
  prevQuestions = []; // QuestionObj[]

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
  dropCourse(course_id) {
      this.courses.remove(this.courses.find(x=> x.id === course_id));
  }

  getQuestionWithId(question_id) {
    return this.questions.find(x => x.id === question_id);
  }

  getPrevQuestionWithId(question_id) {
    return this.prevQuestions.find(x => x.id === question_id);
  }

  @action
  updateAllQuestions(questions) {
      this.questions = []

      questions.forEach(element => {
        if (element.question_type === 'multiple_choice') {
          this.questions.push(new MultipleChoiceQuestionObj(element.id, element.lecture_id,
            element.question_type, element.question_title,
            element.correct_answer, element.creator_id, element.is_open, element.opened_at,
            element.closed_at, element.created_at, element.modified_at, element.answer, element.option1,
            element.option2, element.option3, element.option4, element.option5, element.number_of_options))
        }
        else {
          this.questions.push(new FreeTextQuestionObj(element.id, element.lecture_id,
            element.question_type, element.question_title,
            element.correct_answer, element.creator_id, element.is_open, element.opened_at,
            element.closed_at, element.created_at, element.modified_at, element.answer, element.word_limit))
        }

      });
  }

  @action
  updateAllPrevQuestions(questions) {
    this.prevQuestions = [];

    questions.forEach(element => {
      if (element.question_type === 'multiple_choice') {
        this.prevQuestions.push(new MultipleChoiceQuestionObj(element.id, element.lecture_id,
          element.question_type, element.question_title,
          element.correct_answer, element.creator_id, element.is_open, element.opened_at,
          element.closed_at, element.created_at, element.modified_at, element.answer, element.option1,
          element.option2, element.option3, element.option4, element.option5, element.number_of_options))
      }
      else {
        this.prevQuestions.push(new FreeTextQuestionObj(element.id, element.lecture_id,
          element.question_type, element.question_title,
          element.correct_answer, element.creator_id, element.is_open, element.opened_at,
          element.closed_at, element.created_at, element.modified_at, element.answer, element.word_limit))
      }

    });
  }

  @action
  addOneQuestion(element) {
    if (element.question_type === 'multiple_choice') {
      this.questions.push(new MultipleChoiceQuestionObj(element.id, element.lecture_id,
        element.question_type, element.question_title,
        element.correct_answer, element.creator_id, element.is_open, element.opened_at,
        element.closed_at, element.created_at, element.modified_at, element.answer, element.option1,
        element.option2, element.option3, element.option4, element.option5, element.number_of_options));
    } else if (element.question_type === 'free_text') {
      this.questions.push(new FreeTextQuestionObj(element.id, element.lecture_id,
        element.question_type, element.question_title,
        element.correct_answer, element.creator_id, element.is_open, element.opened_at,
        element.closed_at, element.created_at, element.modified_at, element.answer, element.word_limit));
    } else {
      console.log('unsupported question type');
    }
  }

  @action
  updateOneQuestion(element) {
    var question_id = element.id;
    var oldQuestion = this.questions.find(x => x.id === question_id);
    var index = this.questions.indexOf(oldQuestion);
    if (index <= -1) {
      // not yet in store
      this.addOneQuestion(element);
    } else {
      // update existing
      var updatedQuestion;
      if (element.question_type === 'multiple_choice') {
        updatedQuestion = new MultipleChoiceQuestionObj(element.id, element.lecture_id,
          element.question_type, element.question_title,
          element.correct_answer, element.creator_id, element.is_open, element.opened_at,
          element.closed_at, element.created_at, element.modified_at, element.answer, element.option1,
          element.option2, element.option3, element.option4, element.option5, element.number_of_options);
      } else if (element.question_type === 'free_text') {
        updatedQuestion = new FreeTextQuestionObj(element.id, element.lecture_id,
          element.question_type, element.question_title, 
          element.correct_answer, element.creator_id, element.is_open, element.opened_at,
          element.closed_at, element.created_at, element.modified_at, element.answer, element.word_limit);
      } else {
        console.log('unsupported question type');
        return;
      }
      this.questions[index] = updatedQuestion;
    }
  }

  @action
  removeQuestionById(question_id) {
    var question = this.questions.find(x => x.id === question_id);
    var index = this.questions.indexOf(question);
    if (index > -1) {
      this.questions.splice(index, 1);
    } else {
      console.log('question_id not in the store');
    }
  }

}
