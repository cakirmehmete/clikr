
export default class LectureObj {
    constructor(title, date, id, course_id, description, scheduled, openDate, closeDate) {
        this.course_id = course_id;
        this.date = date;
        this.id = id;
        this.title = title;
        // this.description = description;
        this.scheduled = scheduled;
        this.openDate = openDate;
        this.closeDate = closeDate;
    }
}