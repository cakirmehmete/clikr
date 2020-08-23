import { getStudentCoursesAPI, getStudentNameAPI, postEnrollStudentAPI, getStudentQuestionsByCourseAPI, getStudentPrevQuestionsByCourseAPI, postAnswerQuestionAPI, getLogoutStudentAPI, deleteDropCourseAPI } from '../utils/api-facade';

export default class APIStudentService {
    constructor(studentStore) {
        this.studentStore = studentStore;
    }

    loadAllCourses() {
        getStudentCoursesAPI()
            .then(res => {
                console.log(res.data)
                this.studentStore.updateAllCourses(res.data)

            })
            .catch(error => {
                console.log(error.response);
                this._checkAuth(error);
            })
        
    }

    async getName() {
        return getStudentNameAPI()
            .then(res => {
                return res.data.name
            })
            .catch(error => {
                console.log(error)
                this._checkAuth(error)
                return []
            })
    }

    loadAllQuestions(course_id) {
        getStudentQuestionsByCourseAPI(course_id)
            .then(res => {
                console.log(res.data)
                this.studentStore.updateAllQuestions(res.data)
            })
            .catch(error => {
                console.log(error.response);
                this._checkAuth(error);
            })
        
    }

    loadAllPrevQuestions(course_id) {
        getStudentPrevQuestionsByCourseAPI(course_id)
            .then(res => {
                console.log(res.data)
                this.studentStore.updateAllPrevQuestions(res.data)

            })
            .catch(error => {
                console.log(error.response);
                this._checkAuth(error);
            })
    }

    // remove the course
    dropCourse(course_id) {
        deleteDropCourseAPI(course_id)
        .then(
            this.studentStore.dropCourse(course_id)
        )
        .catch(error => {
            console.log(error.response);
            this._checkAuth(error);
        })
    }

    async postAnswer(answer, question_id) {
        postAnswerQuestionAPI(answer, question_id)
            .then(res => {
                return res.data
            })
            .catch(error => {
                console.log(error.response);
                this._checkAuth(error);
            })
    }

    async enrollCourse(code) {
        return postEnrollStudentAPI(code)
            .then(res => {
                getStudentCoursesAPI()
                    .then(res => {
                        console.log(res.data)
                        this.studentStore.updateAllCourses(res.data)
        
                    })
                    .catch(error => {
                        console.log(error.response);
                        this._checkAuth(error);
                    })
                return null;
            })
            .catch(error => {
                console.log(error.response);
                this._checkAuth(error);
                return error.response.data;
            })
        // getStudentCoursesAPI()
        //     .then(res => {
        //         this.studentStore.updateAllCourses(res.data)

        //     })
        //     .catch(error => {
        //         console.log(error.response);
        //         this._checkAuth(error);
        //     })
    }

    async getLogoutStudent() {
        getLogoutStudentAPI()
        .catch(error => {
            console.log(error.response);
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