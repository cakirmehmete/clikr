import { getStudentCoursesAPI, postEnrollStudentAPI } from '../utils/api-facade';

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
        if (error.response.status === 401)
            window.location.replace('/login-student')
    }
}