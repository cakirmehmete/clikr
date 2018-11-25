import axios from 'axios';
import { baseURL } from '../constants/api'

export default class APIService {
    async login(netId) {
        return axios.post(baseURL + '/api/v1/professor/login', {
            netId: netId
        })
            .then(function (response) {
                console.log(response);
                // Update axios with the proper token
                axios.defaults.headers.common['x-access-token'] = response['x-access-token']
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    async getClassesAPI() {
        // TODO: Find a better way to handle this login
        axios.defaults.withCredentials = true;
        // Call Server to get classes
        return await axios.get(baseURL + 'professor/courses')
            .then(function (response) {
                // Update axios with the proper token
                return response.data
            })
            .catch(function (error) {
                console.log(error);
                window.location.replace('/login-prof')
                return [];
            });
    }

    async addCourse(course) {
        // Call Server to get classes
        const res = await axios.post(baseURL + 'professor/courses', {
            coursenum: course.num,
            title: course.name,
            dept: course.dept
        })

        return await res.data;
    }
}