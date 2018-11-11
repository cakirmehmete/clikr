import {observable, action} from 'mobx-react';
import {ClassObj} from '../models/ClassObj';

export default class ClassStore {
    @observable classes = [new ClassObj("Test", "adasdasd")];

    @action
    addClass(classObj) {
      this.classes.push(classObj)
    }
  }