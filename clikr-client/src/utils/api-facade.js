import axios from 'axios';
import { baseURL } from '../constants/api'

axios.defaults.withCredentials = true;

export function getProfDataAPI() {
    return axios.get(baseURL + 'professor/data');
}

export function loginProfessorAPI(username, password) {
    return axios.post(baseURL + 'admin/professorlogin', {
        netId: username,
        password: password
    });
}

export function createProfessorAPI(username, password, firstName, lastName) {
    return axios.post(baseURL + 'admin/professor', {
        netId: username,
        password: password,
        firstName: firstName,
        lastName: lastName
    });
}

export function archiveCourseAPI(course_id) {
    return axios.post(baseURL + 'professor/courses/' + course_id + '/archive');
}

export function duplicateCourseAPI(course_id, year, term) {
    return axios.post(baseURL + 'professor/courses/' + course_id + '/duplicate', {
        year: year,
        term: term
    });
}

export function loginStudentAPI(username, password) {
    return axios.post(baseURL + 'admin/studentlogin', {
        netId: username,
        password: password
    });
}

export function createStudentAPI(username, password, firstName, lastName) {
    return axios.post(baseURL + 'admin/student', {
        netId: username,
        password: password,
        firstName: firstName,
        lastName: lastName
    });
}

export function getProfAnswers(question_id) {
    return axios.get(baseURL + 'professor/questions/' + question_id + '/statistics');
}

export function getProfNameAPI() {
    return axios.get(baseURL + 'professor/name');
}

export function getStudentNameAPI() {
    return axios.get(baseURL + 'student/name');
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

export function getStudentPrevQuestionsByCourseAPI(course_id) {
    return axios.get(baseURL + 'student/courses/' + course_id + '/prevquestions');
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

export function postCloseAllQuestionsAPI(lecture_id) {
    return axios.post(baseURL + 'professor/lectures/' + lecture_id, {
        action: "close"
    });
}

// course: CourseObj
export function postNewCourseAPI(course) {
    return axios.post(baseURL + 'professor/courses', {
        title: course.title,
        dept: course.dept,
        coursenum: course.num,
        description: course.description,
        year: course.year,
        term: course.term
    });
}

// lecture: LectureObj
export function postNewLectureAPI(lecture) {
    return axios.post(baseURL + 'professor/courses/' + lecture.course_id + '/lectures', {
        title: lecture.title,
        date: lecture.date,
        description: lecture.description
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
export function patchUpdateCourseAPI(course_id, course_title) {
    return axios.patch(baseURL + 'professor/courses/' + course_id, {
        title: course_title
    });
}

export function patchUpdateCourseDataAPI(course_id, course) {
    return axios.patch(baseURL + 'professor/courses/' + course_id, {
        title: course.title,
        dept: course.dept,
        coursenum: course.coursenum,
        year: course.year,
        term: course.term,
        description: course.description
    });
}

export function exportGradesLectureAPI(lecture_id) {
    return axios.get(baseURL + 'professor/lectures/' + lecture_id + '/exportgrades')
}

export function exportGradesCourseAPI(course_id) {
    return axios.get(baseURL + 'professor/courses/' + course_id + '/exportgrades')
}

export function patchUpdateLectureTitleAPI(lecture_id, lecture_title) {
    return axios.patch(baseURL + 'professor/lectures/' + lecture_id, {
        title: lecture_title,
    });
}

export function patchUpdateLectureDescriptionAPI(lecture_id, lecture_description) {
    return axios.patch(baseURL + 'professor/lectures/' + lecture_id, {
        description: lecture_description
    });
}

// delete the course 
export function deleteCourseAPI(course_id) {
    return axios.delete(baseURL + 'professor/courses/' + course_id);
}

// delete a question by id
export function deleteQuestionsAPI(question_id) {
    return axios.delete(baseURL + 'professor/questions/' + question_id);
}

// get questions for course by id
export function getQuestionsForLectureAPI(lecture_id) {
    return axios.get(baseURL + 'professor/lectures/' + lecture_id + '/questions');
}

// delete a lecture by id
export function deleteLecturesAPI(lecture_id) {
    return axios.delete(baseURL + 'professor/lectures/' + lecture_id);
}
// drop = delete for studnet
export function deleteDropCourseAPI(course_id) {
    return axios.delete(baseURL + 'student/courses/' + course_id);
}

// update a question:
export function patchUpdateQuestionAPI(question) {
    return axios.patch(baseURL + 'professor/questions/' + question.id, {
        id: question.id,
        lecture_id: question.lecture_id,
        question_type: question.question_type,
        question_title: question.question_title,
        question_image: question.question_image,
        correct_answer: question.correct_answer,
        option1: question.option1,
        option2: question.option2,
        option3: question.option3,
        option4: question.option4,
        option5: question.option5,
        number_of_options: question.number_of_options,
        word_limit: question.word_limit,
        lower_label: question.lower_label,
        upper_label: question.upper_label,
    });
}

export function postNewQuestionAPI(question) {
    return axios.post(baseURL + 'professor/lectures/' + question.lecture_id + '/questions', {
        lecture_id: question.lecture_id,
        question_type: question.question_type,
        question_title: question.question_title,
        question_image: question.question_image,
        correct_answer: question.correct_answer,
        creator_id: question.creator_id,
        option1: question.option1,
        option2: question.option2,
        option3: question.option3,
        option4: question.option4,
        option5: question.option5,
        number_of_options: question.number_of_options,
        word_limit: question.word_limit,
        lower_label: question.lower_label,
        upper_label: question.upper_label,
    });
}
