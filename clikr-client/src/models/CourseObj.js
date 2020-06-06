export default class CourseObj {
    constructor(title, num, dept, year, term, description, joinCode, id) {
        this.title = title;
        this.id = id;
        this.num = num;
        this.dept = dept;
        this.description = description;
        this.term = term;
        this.joinCode = joinCode;
        this.year = year;
    }
}