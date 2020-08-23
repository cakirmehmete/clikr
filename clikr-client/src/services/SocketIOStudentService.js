import { socketioURL } from '../constants/api';
import socketIOClient from 'socket.io-client';

export default class SocketIOStudentService {
    
    constructor(store) {
        this.store = store;
        this.socket = socketIOClient(socketioURL);
        this.timeout = null;
        
        store.setSocketIOStatus(true);  // optimistic approach: assume we're connected, verify later
        setTimeout(() => {
            this.checkConnection();
        }, 1000)
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
        return this.socket.on('all open questions', (data) => {
            this.store.updateAllQuestions(data.questions);
            console.log(data);
        });
    }

    // detect broken connection
    startCheckingConnection() {
        this.timeout = setInterval(() => {
            this.checkConnection();
        }, 1000);
    }

    // clear the timeout
    stopCheckingConnection() {
        clearTimeout(this.timeout);
    }

    // check if connected
    checkConnection() {
        if (this.socket.connected) {
            this.store.setSocketIOStatus(true);
        } else {
            this.store.setSocketIOStatus(false);
        }
    }

}