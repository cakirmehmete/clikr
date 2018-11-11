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
        axios.defaults.headers.common['x-access-token'] = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6ImF3ZXNvbWVwcm9mIiwicm9sZSI6InByb2Zlc3NvciIsImV4cCI6MTU0MTk5Nzc0MH0.jvoDM5yLj0qePZQ5w__JWs-u3npZNgFzhJFtQmv18lU'
        // Call Server to get classes
        const res = await axios.get(baseURL + '/api/v1/professor/courses')
        
        return await res.data;
    }
}