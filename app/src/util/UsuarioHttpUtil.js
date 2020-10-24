const API_URL_ALL = "http://localhost:3000/user/all"
const API_URL = "http://localhost:3000/user"

import axios from "axios";

export default {
    async buscarTodos(){
        return axios.get(API_URL_ALL).then((response) => response.data)
    },
    async adicionar(user){
        return axios.post(API_URL, user).then((response) => response)
    },
    async editar(user){
        return axios.put(API_URL + "/" + user._id, user).then((response) => response)
    }
}