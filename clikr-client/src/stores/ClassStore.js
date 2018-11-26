import { observable, action, decorate } from "mobx";
import ClassObj from '../models/ClassObj';
import APIService from "../services/APIService";

export default class ClassStore {
  constructor() {
    this.apiService = new APIService()
  }
  classes = [];

  addClass(classObj) {
    this.classes.push(classObj)
  }

  async loadClasses() {
    const data = await this.apiService.getClassesAPI();
    this.classes = [];
    (data).forEach(element => {
      this.addClass(new ClassObj(element.title, null))
    });
  }
  async loadClassesStudent() {
    const data = await this.apiService.getClassesAPIStudent();
    this.classes = [];
    (data).forEach(element => {
      this.addClass(new ClassObj(element.title, null))
    });
  }
}


decorate(ClassStore, {
  classes: observable,
  addClass: action,
  loadClasses: action
});