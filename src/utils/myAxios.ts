import axios, {AxiosResponse} from "axios";

interface CustomAxiosInstance {
    get<T = any>(url: string, config?: any): Promise<T>;

    post<T = any>(url: string, data?: any, config?: any): Promise<T>;

    put<T = any>(url: string, data?: any, config?: any): Promise<T>;

    delete<T = any>(url: string, config?: any): Promise<T>;

    patch<T = any>(url: string, data?: any, config?: any): Promise<T>;

    head<T = any>(url: string, config?: any): Promise<T>;

    options<T = any>(url: string, config?: any): Promise<T>;

    // 保留拦截器方法
    interceptors: {
        request: typeof axios.interceptors.request;
        response: typeof axios.interceptors.response;
    };
}

const myAxios = axios.create({
    baseURL: "http://localhost:8080/api",
    withCredentials: true,
}) as CustomAxiosInstance;

myAxios.interceptors.request.use(config => {
    console.log(`request interceptor: url=${config.baseURL}${config.url}`);
    return config;
}, error => {
    return Promise.reject(error);
});

myAxios.interceptors.response.use(
    (response: AxiosResponse<any>) => {
        // 直接返回axios包装的后端返回的res，只关注业务层面包装的响应。
        console.log(`global response interceptor: response payload = ${response.data}`);
        return response.data;
    },
    function (error) {
        return Promise.reject(error);
    }
);

export default myAxios;