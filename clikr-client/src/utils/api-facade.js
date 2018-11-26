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

