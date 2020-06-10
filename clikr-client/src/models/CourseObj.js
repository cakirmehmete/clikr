export default class CourseObj {
    constructor(course) {
        if (course !== undefined) {
            this.title = course.title;
            this.id = course.id;
            this.num = course.num;
            this.dept = course.dept;
            this.description = course.description;
            this.term = course.term;
            this.joinCode = course.joinCode;
            this.year = course.year;
            this.is_current = course.is_current;
        }
    }
}