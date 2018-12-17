import axios from 'axios';
import { baseURL } from '../constants/api'

axios.defaults.withCredentials = true;

export function getProfDataAPI() {
    return axios.get(baseURL + 'professor/data');
}

export function getStudentCoursesAPI() {
    return axios.get(baseURL + 'student/courses');
}

export function hasStudentQuestions(course_id) {
    return Promise.all(axios.get(baseURL + 'student/courses/' + course_id + '/questions'));
}

export function getProfCoursesAPI() {
    return axios.get(baseURL + 'professor/courses');
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
        title: course.title
    });
}

// lecture: LectureObj
export function postNewLectureAPI(lecture) {
    return axios.post(baseURL + 'professor/courses/' + lecture.course_id + '/lectures', {
        title: lecture.title,
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
export function getLogoutStudentAPI() {
    return axios.get(baseURL + 'student/logout');
}
export function getLogoutProfAPI() {
    return axios.get(baseURL + 'professor/logout');
}

// course: CourseObj
export function patchUpdateCourseAPI(course) {
    return axios.patch(baseURL + 'professor/courses/' + course.id, {
        title: course.title
    });
}
// delete the course 
export function deleteCourseAPI(course_id) {
    return axios.delete(baseURL + 'professor/courses/' + course_id);
}
// drop = delete for studnet
export function deleteDropCourseAPI(course_id) {
    return axios.delete(baseURL + 'student/courses/' + course_id);
}

export function postNewQuestionAPI(question) {
    return axios.post(baseURL + 'professor/lectures/' + question.lecture_id + '/questions', {
        lecture_id: question.lecture_id,
        question_type: question.question_type,
        question_title: question.question_title,
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
