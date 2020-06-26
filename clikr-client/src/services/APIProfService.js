import { getProfDataAPI, patchUpdateLectureAPI, duplicateCourseAPI, archiveCourseAPI, exportGradesCourseAPI, exportGradesLectureAPI, patchUpdateCourseDataAPI, getProfNameAPI, getProfAnswers, postNewCourseAPI, postNewQuestionAPI, postNewLectureAPI, postOpenQuestionAPI, postCloseQuestionAPI, getLogoutProfAPI, patchUpdateCourseAPI, deleteCourseAPI, getProfCoursesAPI, deleteLecturesAPI, getQuestionsForLectureAPI, postCloseAllQuestionsAPI, deleteQuestionsAPI, patchUpdateQuestionAPI } from '../utils/api-facade';


export default class APIProfService {
    constructor(professorStore) {
        this.professorStore = professorStore;
    }
    
    async getName() {
        return getProfNameAPI()
            .then(res => {
                return res.data.name
            })
            .catch(error => {
                console.log(error)
                this._checkAuth(error)
                return []
            })
    }

    archiveCourse(course_id) {
        return archiveCourseAPI(course_id)
            .then(res => {
                this.professorStore.updateCourseData(res.data.id, res.data.course)
                return res.data.message
            })
            .catch(error => {
                console.log(error)
                this._checkAuth(error)
                return []
            })
    }

    duplicateCourse(course_id, year, term) {
        return duplicateCourseAPI(course_id, year, term)
            .then(res => {
                return res.data
            })
            .catch(error => {
                console.log(error)
                this._checkAuth(error)
                return []
            })
    }

    exportGradesLecture(lecture_id) {
        return exportGradesLectureAPI(lecture_id)
            .then(res => {
                return res.data
            })
            .catch(error => {
                console.log(error)
                this._checkAuth(error)
                return []
            })
    }

    exportGradesCourse(course_id) {
        return exportGradesCourseAPI(course_id)
            .then(res => {
                return res.data
            })
            .catch(error => {
                console.log(error)
                this._checkAuth(error)
                return []
            })
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

    loadQuestions(lecture_id) {
        return getQuestionsForLectureAPI(lecture_id)
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
                        this.professorStore.dataLoaded = false
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

    changeCourseData(courseId, course) {
        patchUpdateCourseDataAPI(courseId, course)
            .then(res => {
                this.professorStore.updateCourseData(courseId, course)
            })
            .catch(error => {
                console.log(error);
                this._checkAuth(error);
            })
    }

    editLecture(lectureObj) {
        return patchUpdateLectureAPI(lectureObj)
        .then(res => {
            this.professorStore.updateLecture(lectureObj);
        })
        .catch(error => {
            console.log(error);
            this._checkAuth(error);
        })
    }

    editQuestion(questionObj) {
        patchUpdateQuestionAPI(questionObj)
        .then(res => {
            this.professorStore.updateQuestion(questionObj);
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

    // remove lectures- input is array of lecture ids
    deleteQuestions(questions, parentLectureId) {
        questions.map(id => {
            return (
                deleteQuestionsAPI(id)
                    .then(() => {
                        this.professorStore.removeQuestion(id, parentLectureId)
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
                window.location.replace('/login/prof')
        }
    }
}