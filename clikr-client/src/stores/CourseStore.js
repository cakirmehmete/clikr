import { observable, action } from "mobx";
import CourseObj from '../models/CourseObj';

export default class CourseStore {
  @observable
  courses = []; // CourseObj[]

  @action
  updateAllCourses(courses) {
    this.courses = []

    courses.forEach(element => {
      this.courses.push(new CourseObj(element.title, null))
    })
  }
}