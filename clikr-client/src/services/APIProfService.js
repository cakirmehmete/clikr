import { getProfDataAPI, getProfAnswers, postNewCourseAPI, postNewQuestionAPI, postNewLectureAPI, postOpenQuestionAPI, postCloseQuestionAPI, getLogoutProfAPI, patchUpdateCourseAPI, patchUpdateLectureAPI, deleteCourseAPI, getProfCoursesAPI, deleteLecturesAPI, postCloseAllQuestionsAPI } from '../utils/api-facade';


export default class APIProfService {
    constructor(professorStore) {
        this.professorStore = professorStore;
    }

    loadData() {
        if (!this.professorStore.dataLoaded) {
            return getProfDataAPI()
                .then(res => {
                    this.professorStore.updateData(res.data)
                })
                .catch(error => {
                    console.log(error);
                    this._checkAuth(error);
                })
        }
        return new Promise(function () {
            return true
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

    loadAnswers(question_id) {
        return getProfAnswers(question_id)
            .then(res => {
                return res.data
            })
            .catch(error => {
                console.log(error);
                this._checkAuth(error);
                return [];
            })
    }

    openQuestion(question_id, lecture_id) {
        postOpenQuestionAPI(question_id)
            .then(res => {
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
                this.professorStore.closeQuestion(question_id, lecture_id)
            })
            .catch(error => {
                console.log(error);
                this._checkAuth(error);
            })
    }

    closeAllQuestions(lecture_id) {
        postCloseAllQuestionsAPI(lecture_id)
            .then(res => {
                this.professorStore.closeAllQuestionsForLecture(lecture_id)
            })
            .catch(error => {
                console.log(error);
                this._checkAuth(error);
            })
    }

    addLecture(lecture) {
        postNewLectureAPI(lecture)
            .then(res => {
                const newLec = res.data.lectures.find(lecture => lecture.id === res.data.id)
                newLec.questions = []
                this.professorStore.addLecture(newLec)
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
                const newCourse = res.data.courses.find(course => course.id === res.data.id)
                newCourse.lectures = []
                this.professorStore.addCourse(res.data.courses, newCourse)
            })
            .catch(error => {
                console.log(error);
                this._checkAuth(error);
            })
    }

    // remove courses
    deleteCourses(courses) {
        courses.map(id => {
            return (
                deleteCourseAPI(id)
                    .then(() => {
                        this.professorStore.removeCourse(id)
                        this.loadData()
                    })
                    .catch(error => {
                        console.log(error);
                        this._checkAuth(error);
                    })
            )
        })
    }

    changeCourseTitle(courseId, courseTitle) {
        patchUpdateCourseAPI(courseId, courseTitle)
            .then(res => {
                this.professorStore.updateCourse(courseId, courseTitle)
            })
            .catch(error => {
                console.log(error);
                this._checkAuth(error);
            })
    }

    // change lecture title
    changeLectureTitle(lectureId, lectureTitle) {
        patchUpdateLectureAPI(lectureId, lectureTitle)
            .then(res => {
                this.professorStore.updateLecture(lectureId, lectureTitle)
            })
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
                const newQ = res.data.questions.find(q => q.id === res.data.id)
                newQ.id = res.data.id
                this.professorStore.addQuestion(newQ)
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