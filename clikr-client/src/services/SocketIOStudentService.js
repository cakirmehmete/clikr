import { socketioURL } from '../constants/api';
import socketIOClient from 'socket.io-client';

export default class SocketIOStudentService {
    
    constructor(store) {
        this.store = store;
        this.socket = socketIOClient(socketioURL);
    }

    reset() {
        this.store.resetQuestions();
    }

    // subscribe student for particular class
    // must be called before all other calls
    subscribe(course_id) {
        this.socket.emit('subscribe student', course_id);
    }

    // check for opening of a question
    detectOpenQuestion() {
        this.socket.on('question opened', (data) => {
            this.store.addOneQuestion(data.question);
            console.log(data.question);
        });
    }
    

    // check for closing of a question
    detectCloseQuestion() {
        this.socket.on('question closed', (msg) => {
            this.store.updateLastQuestion(msg.question);
            this.store.removeQuestionById(msg.question.id);
        });
    }
    

    // listen for server messages
    listen() {
        this.socket.on('server message', (msg) => {
            console.log('Received message: ' + msg);
        });
    }

    // get all open questions for a course 
    getAllQuestions() {
        this.socket.on('all open questions', (data) => {
            this.store.updateAllQuestions(data.questions);
        });
    }

    // get number of open questions for course 
    getNumberOfQuestions() {
        return this.store.questions.length;
        
    }


}