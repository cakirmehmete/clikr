import axios from 'axios';
import { baseURL } from '../constants/api'

export default class APIService {
    login(netId) {
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
}