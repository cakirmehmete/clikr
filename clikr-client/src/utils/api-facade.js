import axios from 'axios';
import { baseURL } from '../constants/api'

axios.defaults.withCredentials = true;

export function getCoursesAPI() {
    return axios.get(baseURL + 'professor/courses');
}

export function postNewCourseAPI(course) {
    return axios.post(baseURL + 'professor/courses', {
        coursenum: course.num,
        title: course.name,
        dept: course.dept
    });
}