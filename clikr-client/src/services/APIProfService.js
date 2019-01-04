import { getProfDataAPI, postNewCourseAPI, postNewQuestionAPI, postNewLectureAPI, postOpenQuestionAPI, postCloseQuestionAPI, getLogoutProfAPI, patchUpdateCourseAPI, patchUpdateLectureAPI, deleteCourseAPI, getProfCoursesAPI, deleteLecturesAPI } from '../utils/api-facade';

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

    loadAllCourses() {
        return getProfCoursesAPI()
            .then(res => {
                this.professorStore.updateAllCourseData(res.data)
            })
            .catch(error => {
                console.log(error);
                this._checkAuth(error);
            })
    }

    openQuestion(question_id, lecture_id) {
        postOpenQuestionAPI(question_id)
            .then(res => {
                console.log(res)
                this.professorStore.openQuestion(question_id, lecture_id)
            })
            .catch(error => {
                console.log(error);
                this._checkAuth(error);
            })
    }

    closeQuestion(question_id, lecture_id) {
        postCloseQuestionAPI(question_id)
            .then(res => {
                console.log(res)
                this.professorStore.closeQuestion(question_id, lecture_id)
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
                this.professorStore.addCourse(res.data.courses, course)
            })
            .catch(error => {
                console.log(error);
                this._checkAuth(error);
            })
    }

    // remove the course
    deleteCourse(course_id) {
        deleteCourseAPI(course_id)
            .then(() => {
                this.professorStore.removeCourse(course_id)
                this.loadData()
            })
            .catch(error => {
                console.log(error);
                this._checkAuth(error);
            })
    }

    changeCourseTitle(courseId, courseTitle) {
        patchUpdateCourseAPI(courseId, courseTitle)
            // .then(res => {
            //     this.professorStore.updateCourse(course)
            // })
            .catch(error => {
                console.log(error);
                this._checkAuth(error);
            })
    }
    // change lecture title
    changeLectureTitle(lectureId, lectureTitle) {
        patchUpdateLectureAPI(lectureId, lectureTitle)
            .catch(error => {
                console.log(error);
                this._checkAuth(error);
            })
    }

    // remove lectures- input is array of lecture ids
    deleteLectures(lectures, courseId) {
        lectures.map(id => {
            return (
                deleteLecturesAPI(id)
                    .then(() => {
                        this.professorStore.removeLecture(id, courseId)
                    })
                    .catch(error => {
                        console.log(error);
                        this._checkAuth(error);
                    })
            )
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