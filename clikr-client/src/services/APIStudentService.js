import { getStudentCoursesAPI, postEnrollStudentAPI, getStudentQuestionsByCourseAPI, postAnswerQuestionAPI, getLogoutStudent } from '../utils/api-facade';

export default class APIStudentService {
    constructor(studentStore) {
        this.studentStore = studentStore;
    }

    loadAllCourses() {
        getStudentCoursesAPI()
            .then(res => {
                this.studentStore.updateAllCourses(res.data)

            })
            .catch(error => {
                console.log(error);
                this._checkAuth(error);
            })
        
    }

    loadAllQuestions(course_id) {
        getStudentQuestionsByCourseAPI(course_id)
            .then(res => {
                console.log(res.data)
                this.studentStore.updateAllQuestions(res.data)

            })
            .catch(error => {
                console.log(error);
                this._checkAuth(error);
            })
        
    }

    async postAnswer(answer, question_id) {
        postAnswerQuestionAPI(answer, question_id)
            .then(res => {
                return res.data
            })
            .catch(error => {
                console.log(error);
                this._checkAuth(error);
            })
    }
    async getLogoutStudentAPI() {
        getLogoutStudent()
        .catch(error => {
            console.log(error);
            this._checkAuth(error);
        })
    }
    async enrollCourse(code) {
        postEnrollStudentAPI(code)
            .then(res => {
                return res.data
            })
            .catch(error => {
                console.log(error);
                this._checkAuth(error);
            })
    }

    _checkAuth(error) {
        if (error.response !== undefined) {
            if (error.response.status === 401)
                window.location.replace('/login-student')
        }
    }
}