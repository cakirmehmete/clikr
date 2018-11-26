import { getCoursesAPI, postNewCourseAPI, postEnrollStudentAPI } from '../utils/api-facade';

export default class APIService {
    constructor(courseStore) {
        this.courseStore = courseStore;
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

    _checkAuth() {
        window.location.replace('/login-prof')
    }
}