import { observable, action } from "mobx";
import CourseObj from '../models/CourseObj';

export default class StudentStore {
  @observable
  courses = []; // CourseObj[]

  @action
  updateAllCourses(courses) {
    this.courses = []

    courses.forEach(element => {
      // id: any, title: any, num: any, dept: any, description: any, term: any, joinCode: any, year: any
      this.courses.push(new CourseObj(element.id, element.title, element.coursenum,
        element.dept, element.description, element.term, element.enroll_code, element.year))
    })
  }
}