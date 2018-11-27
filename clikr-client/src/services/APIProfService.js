import { getCoursesAPI, postNewCourseAPI, postNewQuestionAPI, getLecturesAPI, postNewLectureAPI } from '../utils/api-facade';

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
                this._checkAuth(error);
            })
    }

    loadLecturesForCourse(course_id) {
        getLecturesAPI(course_id)
            .then(res => {
                this.professorStore.updateAllLectures(res.data)
            })
            .catch(error => {
                console.log(error);
                this._checkAuth(error);
            })
    }

    addLecture(lecture) {
        postNewLectureAPI(lecture)
            .then(res => {
                this.professorStore.updateAllLectures(res.data.lectures)
            })
            .catch(error => {
                console.log(error);
                this._checkAuth(error);
            })
    }

    addCourse(course) {
        postNewCourseAPI(course)
            .then(res => {
                this.professorStore.updateAllCourses(res.data.courses)
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
                this.professorStore.updateAllQuestions(res.data.questions)
            })
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