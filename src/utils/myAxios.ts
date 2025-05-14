import axios from "axios";

const myAxios = axios.create({
    baseURL: "http://localhost:8080/api",
    withCredentials: true,
});

myAxios.interceptors.request.use(config => {
    console.log(`request interceptor: url=${config.baseURL}${config.url}`);
    return config;
}, error => {
    return Promise.reject(error);
});

myAxios.interceptors.response.use(response => {
    // 直接返回axios包装的后端返回的res，只关注业务层面包装的响应。
    console.log(`response interceptor: response payload=${response.data}`)
    return response.data;
}, function (error) {
    return Promise.reject(error);
});

export default myAxios;