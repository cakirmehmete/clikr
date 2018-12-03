
export default class LectureObj {
    constructor(title, description, date, id, course_id) {
        this.course_id = course_id;
        this.date = date;
        this.description = description;
        this.id = id;
        this.title = title;
    }
}