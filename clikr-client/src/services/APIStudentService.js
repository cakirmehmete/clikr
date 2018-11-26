import { getStudentCoursesAPI, postEnrollStudentAPI } from '../utils/api-facade';

export default class APIService {
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
                this._checkAuth();
            })
    }

    async enrollCourse(code) {
        postEnrollStudentAPI(code)
            .then(res => {
                return res.data
            })
            .catch(error => {
                console.log(error);
                this._checkAuth();
            })
    }

    _checkAuth() {
        window.location.replace('/login-student')
    }
}