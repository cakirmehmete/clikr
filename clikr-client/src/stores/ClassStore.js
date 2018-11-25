import { observable, action } from "mobx";
import ClassObj from '../models/ClassObj';
import APIService from "../services/APIService";

export default class ClassStore {
  constructor() {
    this.apiService = new APIService()
  }

  @observable
  classes = [];

  @action
  addClass(classObj) {
    this.classes.push(classObj)
  }

  @action
  async loadClasses() {
    const data = await this.apiService.getClassesAPI();
    this.classes = [];
    (data).forEach(element => {
      this.addClass(new ClassObj(element.title, null))
    });
  }
}