import { getCoursesAPI, postNewCourseAPI } from '../utils/api-facade';

export default class APIService {
    constructor(courseStore) {
        this.courseStore = courseStore;
    }

    loadAllCourses() {
        // Call Server to get classes
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
        // Call Server to get classes
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