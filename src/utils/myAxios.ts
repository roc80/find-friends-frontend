import axios from "axios";

const myAxios = axios.create({
    baseURL: "http://localhost:8080/api",
    headers: {
        "Content-Type": "application/json",
    },
});

myAxios.interceptors.request.use(config => {
    console.log(`request interceptor: url=${config.baseURL}${config.url}`);
    return config;
}, error => {
    return Promise.reject(error);
});

myAxios.interceptors.response.use(response => {
    console.log(`response interceptor: response=${response}`);
    return response;
}, function (error) {
    return Promise.reject(error);
});

export default myAxios;