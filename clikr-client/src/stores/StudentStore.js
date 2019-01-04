import { observable, action } from "mobx";
import CourseObj from '../models/CourseObj';
import { MultipleChoiceQuestionObj, FreeTextQuestionObj, SliderQuestionObj } from "../models/QuestionObj";

export default class StudentStore {
  @observable
  courses = []; // CourseObj[]

  @observable
  questions = []; // QuestionObj[]

  @observable
  prevQuestions = []; // QuestionObj[]

  @observable
  lastQuestion = null;

  @observable
  lastAnswer = null;  // the submitted answer to the most recently closed question

  /** Call this when the question is closed and the component about to unmount.
   *  DO NOT call it when the student submits an answer!
   */
  @action
  updateLastQuestion(question) {
    this.lastQuestion = question;
  }

  @action
  resetQuestions() {
    this.questions = [];
    this.prevQuestions = [];
    this.lastAnswer = null;
    this.lastQuestion = null;
  }

  @action
  updateLastAnswer(answer) {
    this.lastAnswer = answer;
  }

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
          if (element.question_type === 'free_text') {
            this.questions.push(new FreeTextQuestionObj(element.id, element.lecture_id,
              element.question_type, element.question_title,
              element.correct_answer, element.creator_id, element.is_open, element.opened_at,
              element.closed_at, element.created_at, element.modified_at, element.answer, element.word_limit))
            }
          else {
            this.questions.push(new SliderQuestionObj(element.id, element.lecture_id, element.question_type, 
              element.question_title, element.correct_answer, element.creator_id, element.is_open, element.opened_at, 
              element.closed_at, element.created_at, element.modified_at, element.answer, element.lower_label, element.upper_label))
          }

          }
          

      });
  }

  @action
  updateAllPrevQuestions(questions) {
    this.prevQuestions = [];

    questions.forEach(element => {
      console.log(element.question_title)
      if (element.question_type === 'multiple_choice') {
        this.prevQuestions.push(new MultipleChoiceQuestionObj(element.id, element.lecture_id,
          element.question_type, element.question_title,
          element.correct_answer, element.creator_id, element.is_open, element.opened_at,
          element.closed_at, element.created_at, element.modified_at, element.answer, element.option1,
          element.option2, element.option3, element.option4, element.option5, element.number_of_options))
      }
      else {
        if (element.question_type === 'free_text') {
          this.prevQuestions.push(new FreeTextQuestionObj(element.id, element.lecture_id,
            element.question_type, element.question_title,
            element.correct_answer, element.creator_id, element.is_open, element.opened_at,
            element.closed_at, element.created_at, element.modified_at, element.answer, element.word_limit))
        }
        else {
          this.prevQuestions.push(new SliderQuestionObj(element.id, element.lecture_id, element.question_type, 
            element.question_title, element.correct_answer, element.creator_id, element.is_open, element.opened_at, 
            element.closed_at, element.created_at, element.modified_at, element.answer, element.lower_label, element.upper_label))
        }
      }
    });
  }

  @action
  addOneQuestion(element) {
    if (this.questions.find(x => x.id === element.id) === undefined) {
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
        this.questions.push(new SliderQuestionObj(element.id, element.lecture_id, element.question_type, 
          element.question_title, element.correct_answer, element.creator_id, element.is_open, element.opened_at, 
          element.closed_at, element.created_at, element.modified_at, element.answer, element.lower_label, element.upper_label));
      }

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
        updatedQuestion = new SliderQuestionObj(element.id, element.lecture_id, element.question_type, 
          element.question_title, element.correct_answer, element.creator_id, element.is_open, element.opened_at, 
          element.closed_at, element.created_at, element.modified_at, element.answer, element.lower_label, element.upper_label);
      }
      this.questions[index] = updatedQuestion;
    }
  }

  @action
  removeQuestionById(question_id) {
   
      this.questions.remove(this.questions.find(x => x.id === question_id));
  }

  // get number of open questions for course 
  getNumberOfQuestions() {
    return this.questions.length;  
  }

}
