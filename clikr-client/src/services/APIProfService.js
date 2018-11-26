import { getCoursesAPI, postNewCourseAPI, postNewQuestionAPI } from '../utils/api-facade';

export default class APIProfService {
    constructor(professorStore) {
        this.professorStore = professorStore;
    }

    loadAllCourses() {
        getCoursesAPI()
            .then(res => {
                this.professorStore.updateAllCourses(res.data)
            })
            .catch(error => {
                console.log(error);
                this._checkAuth();
            })
    }

    addCourse(course) {
        postNewCourseAPI(course)
            .then(res => {
                this.professorStore.updateAllCourses(res.data.courses)
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
                this.professorStore.updateAllQuestions(res.data.questions)
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