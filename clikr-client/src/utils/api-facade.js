import axios from 'axios';
import { baseURL } from '../constants/api'

axios.defaults.withCredentials = true;

export function getCoursesAPI() {
    return axios.get(baseURL + 'professor/courses');
}

export function getLecturesAPI(course_id) {
    return axios.get(baseURL + 'professor/courses/' + course_id + '/lectures');
}

export function getQuestionsAPI(lecture_id) {
    return axios.get(baseURL + 'professor/lectures/' + lecture_id + '/questions');
}

export function getStudentCoursesAPI() {
    return axios.get(baseURL + 'student/courses');
}

export function hasStudentQuestions(course_id) {
    return Promise.all(axios.get(baseURL + 'student/courses/' + course_id + '/questions'));
}

export function getStudentQuestionsByCourseAPI(course_id) {
    return axios.get(baseURL + 'student/courses/' + course_id + '/questions');
}

export function postOpenQuestionAPI(question_id) {
    return axios.post(baseURL + 'professor/questions/' + question_id, {
        action: "open"
    });
}

export function postCloseQuestionAPI(question_id) {
    return axios.post(baseURL + 'professor/questions/' + question_id, {
        action: "close"
    });
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

// lecture: LectureObj
export function postNewLectureAPI(lecture) {
    return axios.post(baseURL + 'professor/courses/' + lecture.course_id + '/lectures', {
        title: lecture.title,
        description: lecture.description,
        date: lecture.date,
    });
}

export function postEnrollStudentAPI(code) {
    return axios.post(baseURL + 'student/courses', {
        enroll_code: code
    });
}

export function postAnswerQuestionAPI(answer, question_id) {
    return axios.post(baseURL + 'student/questions/' + question_id, {
        answer: answer
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

export function getLogoutStudent() {
    return axios.get(baseURL + 'student/logout');
}

