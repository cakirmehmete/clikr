import { observable, action } from "mobx";
import LectureObj from '../models/LectureObj';

export default class CourseStore {
  constructor(course_id) {
    this.course_id = course_id;
  }
  
  @observable
  lectures = []; // LectureObj[]

  @action
  updateAllLectures(lectures) {
    this.lectures = []

    lectures.forEach(element => {
      this.lectures.push(new LectureObj(element.title, null))
    })
  }
}