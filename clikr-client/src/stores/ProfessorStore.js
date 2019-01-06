import { observable, action } from "mobx";

export default class ProfessorStore {
    @observable
    courses = [];

    set courses(value) {
        value.sort(function (a, b) {
            if (a.created_at < b.created_at) {
                return -1;
            }
            if (a.created_at > b.created_at) {
                return 1;
            }
            // a must be equal to b
            return 0;
        });
        this._courses = value;
    }

    getCourseWithId(course_id) {
        return this.courses.find(x => x.id === course_id)
    }

    getLectureWithId(lecture_id) {
        if (lecture_id === 0)
            return { question: [] };

        const lectures = this.courses.find(course => course.lectures.find(lecture => lecture.id === lecture_id)).lectures
        return lectures.find(lecture => lecture.id === lecture_id)
    }

    @action
    getCourseLectures(course_id) {
        return this.courses.find(x => x.id === course_id).lectures;
    }

    getQuestionWithId(lecture, question_id) {
        if (lecture.questions === undefined)
            return { questions: [] };

        if (lecture.questions.find(x => x.id === question_id) === undefined)
            return { questions: [] };

        return this.courses.find(course => course.lectures.find(lec => lec.id === lecture.id)).lectures
            .find(lec => lec.id === lecture.id).questions.find(x => x.id === question_id)
    }

    @action
    updateData(data) {
        this.courses = data;
    }

    @action
    addCourse(courses, course) {
        course.enroll_code = courses.find(x => x.id === course.id).enroll_code
        this.courses.push(course);
        this.courses.sort(function (a, b) {
            if (a.created_at < b.created_at) {
                return -1;
            }
            if (a.created_at > b.created_at) {
                return 1;
            }
            // a must be equal to b
            return 0;
        });
    }

    @action
    updateCourse(course) {
        const oldCourse = this.courses.find(x => x.id === course.id);
        oldCourse.title = course.title
    }

    @action
    deleteCourse(course_id) {
        this.courses.remove(this.courses.find(x => x.id === course_id));
    }

    @action
    addLecture(lecture) {
        this.courses.find(x => x.id === lecture.course_id).lectures.push(lecture)
        this.courses.find(x => x.id === lecture.course_id).sort(function (a, b) {
            if (a.created_at < b.created_at) {
                return -1;
            }
            if (a.created_at > b.created_at) {
                return 1;
            }
            // a must be equal to b
            return 0;
        });
    }
    @action
    removeCourse(course_id) {
        this.courses.remove(this.courses.find(x => x.id === course_id));
    }

    @action
    removeLecture(lecture_id, course_id) {
        const lectures = this.courses.find(x => x.id === course_id).lectures;
        lectures.remove(lectures.find(x => x.id === lecture_id));
    }

    @action
    removeQuestion(question_id) {
        this.questions.remove(this.course.find(x => x.id === question_id));
    }

    @action
    addQuestion(question) {
        this.courses.find(course => course.lectures.find(lecture => lecture.id === question.lecture_id)).lectures
            .find(lecture => lecture.id === question.lecture_id).questions.push(question);
        this.courses.find(course => course.lectures.find(lecture => lecture.id === question.lecture_id)).lectures
            .find(lecture => lecture.id === question.lecture_id).questions.sort(function (a, b) {
                if (a.created_at < b.created_at) {
                    return -1;
                }
                if (a.created_at > b.created_at) {
                    return 1;
                }
                // a must be equal to b
                return 0;
            });
    }

    @action
    openQuestion(question_id, lecture_id) {
        this.courses.find(course => course.lectures.find(lecture => lecture.id === lecture_id)).lectures
            .find(lecture => lecture.id === lecture_id).questions.find(x => x.id === question_id).is_open = true;
    }

    @action
    closeQuestion(question_id, lecture_id) {
        this.courses.find(course => course.lectures.find(lecture => lecture.id === lecture_id)).lectures
            .find(lecture => lecture.id === lecture_id).questions.find(x => x.id === question_id).is_open = false;
    }

    @action
    closeAllQuestionsForLecture(lecture_id) {
        var questions = this.courses.find(course => course.lectures.find(lecture => lecture.id === lecture_id)).lectures
            .find(lecture => lecture.id === lecture_id).questions;
        
        for (var question of questions) {
            question.is_open = false;
        }
    }
}