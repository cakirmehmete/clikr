import { observable, action } from "mobx";

export default class ProfessorStore {
    @observable
    courses = [];

    getCourseWithId(course_id) {
        return this.courses.find(x => x.id === course_id)
    }

    getLectureWithId(lecture_id) {
        const lectures = this.courses.find(course => course.lectures.find(lecture => lecture.id === lecture_id)).lectures
        return lectures.find(lecture => lecture.id === lecture_id)
    }

    getQuestionWithId(lecture, question_id) {
        if (lecture.questions === undefined)
            return { questions: [] };

        if (lecture.questions.find(x => x.id === question_id) === undefined)
            return { questions: [] };

        return lecture.questions.find(x => x.id === question_id)
    }

    @action
    updateData(data) {
        this.courses = data;
    }

    @action
    addCourse(course) {
        this.courses.push(course);
    }

    @action
    updateCourse(course) {
        this.courses.remove(this.courses.find(x=> x.id === course.id));
        this.courses.push(course);
    }

    @action
    addLecture(lecture) {
        this.courses.find(x => x.id === lecture.course_id).lectures.push(lecture)
    }
    @action
    removeCourse(course_id) {
        this.courses.remove(this.courses.find(x=> x.id === course_id));
    }

    @action
    removeLecture(lecture_id) {
        this.lectures.remove(this.course.find(x => x.id === lecture_id));
    }

    @action
    removeQuestion(question_id) {
        this.questions.remove(this.course.find(x => x.id === question_id));
    }
    @action
    addQuestion(question) {
        this.courses.find(course => course.lectures.find(lecture => lecture.id === question.lecture_id)).lectures
            .find(lecture => lecture.id === question.lecture_id).questions.push(question);
    }
}