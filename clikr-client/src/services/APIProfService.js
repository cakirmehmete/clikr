import { getProfDataAPI, postNewCourseAPI, postNewQuestionAPI, postNewLectureAPI, postOpenQuestionAPI, postCloseQuestionAPI, getLogoutProfAPI } from '../utils/api-facade';

export default class APIProfService {
    constructor(professorStore) {
        this.professorStore = professorStore;
    }

    loadData() {
        return getProfDataAPI()
            .then(res => {
                this.professorStore.updateData(res.data)
            })
            .catch(error => {
                console.log(error);
                this._checkAuth(error);
            })
    }

    openQuestion(question_id) {
        postOpenQuestionAPI(question_id)
            .then(res => {
                console.log(res)
            })
            .catch(error => {
                console.log(error);
                this._checkAuth(error);
            })
    }

    closeQuestion(question_id) {
        postCloseQuestionAPI(question_id)
            .then(res => {
                console.log(res)
            })
            .catch(error => {
                console.log(error);
                this._checkAuth(error);
            })
    }
    
    addLecture(lecture) {
        postNewLectureAPI(lecture)
            .then(res => {
                lecture.id = res.data.id
                this.professorStore.addLecture(lecture)
            })
            .catch(error => {
                console.log(error);
                this._checkAuth(error);
            })
    }

    addCourse(course) {
        postNewCourseAPI(course)
            .then(res => {
                course.id = res.data.id
                this.professorStore.addCourse(course)
            })
            .catch(error => {
                console.log(error);
                this._checkAuth(error);
            })
    }

    addQuestion(question) {
        // post new question
        postNewQuestionAPI(question)
            .then(res => {
                question.id = res.data.id
                this.professorStore.addQuestion(question)
            })
            .catch(error => {
                console.log(error);
                this._checkAuth(error);
            })
    }
    async getLogoutProf() {
        getLogoutProfAPI()
        .catch(error => {
            console.log(error);
            this._checkAuth(error);
        })
    }

    _checkAuth(error) {
        if (error.response !== undefined) {
            if (error.response.status === 401)
                window.location.replace('/login-prof')
        }
    }
}