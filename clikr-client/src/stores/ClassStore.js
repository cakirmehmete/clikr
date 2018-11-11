import { observable, action, decorate } from "mobx";
import ClassObj from '../models/ClassObj';
import axios from 'axios';
import { baseURL } from '../constants/api'

export default class ClassStore {
  classes = [];

  addClass(classObj) {
    this.classes.push(classObj)
  }

  loadClasses() {
    // TODO: Find a better way to handle this login
    axios.defaults.headers.common['x-access-token'] = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6ImF3ZXNvbWVwcm9mIiwicm9sZSI6InByb2Zlc3NvciIsImV4cCI6MTU0MTk5Nzc0MH0.jvoDM5yLj0qePZQ5w__JWs-u3npZNgFzhJFtQmv18lU'
    // Call Server to get classes
    axios.get(baseURL + '/api/v1/professor/courses')
      .then(function (response) {
        console.log(response);
        // Updated the classes
        (response.data).forEach(element => {
          this.addClass(new ClassObj(element.title, null))
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }
}
decorate(ClassStore, {
  classes: observable,
  addClass: action,
  loadClasses: action
});