import { getCoursesAPI, postNewCourseAPI, postNewQuestionAPI } from '../utils/api-facade';

export default class APIService {
    constructor(courseStore, questionStore) {
        this.courseStore = courseStore;
        this.questionStore = questionStore;
    }

    loadAllCourses() {
        getCoursesAPI()
            .then(res => {
                this.courseStore.updateAllCourses(res.data)
            })
            .catch(error => {
                console.log(error);
                this._checkAuth();
            })
    }

    addCourse(course) {
        postNewCourseAPI(course)
            .then(res => {
                this.courseStore.updateAllCourses(res.data.courses)
            })
            .catch(error => {
                console.log(error);
                this._checkAuth();
            })
    }

    addQuestion(question) {
        // post new question
        postNewQuestionAPI(question)
            .then(res => {
                this.questionStore.updateAllQuestions(res.data.questions)
            })
            .catch(error => {
                console.log(error);
                this._checkAuth();
            })
    }

    _checkAuth() {
        window.location.replace('/login-prof')
    }
}