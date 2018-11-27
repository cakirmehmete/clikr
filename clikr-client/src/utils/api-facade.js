import axios from 'axios';
import { baseURL } from '../constants/api'

axios.defaults.withCredentials = true;

export function getCoursesAPI() {
    return axios.get(baseURL + 'professor/courses');
}

export function getLecturesAPI(course_id) {
    return axios.get(baseURL + 'professor/courses/' + course_id + '/lectures');
}

export function getStudentCoursesAPI() {
    return axios.get(baseURL + 'student/courses');
}

// course: CourseObj
export function postNewCourseAPI(course) {
    return axios.post(baseURL + 'professor/courses', {
        coursenum: course.num,
        title: course.title,
        dept: course.dept,
        description: course.description,
        term: course.term,
        year: course.year
    });
}

export function postEnrollStudentAPI(code) {
    return axios.post(baseURL + 'student/courses', {
        enroll_code: code
    });
}

export function postNewQuestionAPI(question) {
    return axios.post(baseURL + 'professor/lectures/' + question.lecture_id + '/questions', {
        lecture_id: question.lecture_id,
        question_type: question.question_type,
        question_title: question.question_title,
        question_text: question.question_text,
        correct_answer: question.correct_answer,
        creator_id: question.creator_id,
        option1: question.option1,
        option2: question.option2,
        option3: question.option3,
        option4: question.option4,
        option5: question.option5,
        number_of_options: question.number_of_options,
        word_limit: question.word_limit
    });
}

