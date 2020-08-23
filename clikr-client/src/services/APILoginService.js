import { loginProfessorAPI, createProfessorAPI, loginStudentAPI, createStudentAPI } from '../utils/api-facade'

export default class APILoginService {
   
   async loginProfessor(username, password) {
      return loginProfessorAPI(username, password)
         .then(res => {
            return res.json().data.valid_login;
         })
         .catch(error => {
            console.log(error)
            this._checkAuth(error)
            return []
         })
   }

   async createProf(username, password, firstName, lastName) {
      return createProfessorAPI(username, password, firstName, lastName)
         .then(res => {
            return res.data.message
         })
         .catch(error => {
            console.log(error)
            this._checkAuth(error)
            return []
         })
   }

   async loginStudent(username, password) {
      return loginStudentAPI(username, password)
         .then(res => {
            return res.json().data.valid_login;
         })
         .catch(error => {
            console.log(error)
            this._checkAuth(error)
            return []
         })
   }

   async createStudent(username, password, firstName, lastName) {
      return createStudentAPI(username, password, firstName, lastName)
         .then(res => {
            return res.data.message
         })
         .catch(error => {
            console.log(error)
            this._checkAuth(error)
            return []
         })
   }

   _checkAuth(error) {
      if (error.response !== undefined) {
          if (error.response.status === 401)
              window.location.replace('/')
      }
   }
}
