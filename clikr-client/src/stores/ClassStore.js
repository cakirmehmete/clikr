import { observable, action, decorate } from "mobx";
import ClassObj from '../models/ClassObj';

export default class ClassStore {
    classes = [new ClassObj("Test", "adasdasd")];

    addClass(classObj) {
      this.classes.push(classObj)
    }
  }
  decorate(ClassStore, {
    classes: observable,
    addClass: action
  });