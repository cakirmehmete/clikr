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

    async enrollCourse(code) {
        axios.defaults.withCredentials = true;
        // Call Server to get classes
        const res = await axios.post(baseURL + 'student/courses', {
            enroll_code: code,
        })

        return await res.data;
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