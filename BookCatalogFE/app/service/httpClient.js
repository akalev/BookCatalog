// import {AxiosInstance as axios} from "axios";
//
// const get = async (path, params) => {
//     try {
//         return await axios.get(`${API_URL}${path}`, { params });
//     } catch (e) {
//         console.log(e.message);
//     }
// };
//
// const post = async (path, data, config) => {
//     const formData = new FormData();
//
//     if (data) {
//         Object.entries(data).forEach(([key, value]) => formData.set(key, value));
//     }
//
//     try {
//         return await axios.post(`${API_URL}${path}`, formData, { ...config });
//     } catch (e) {
//         console.log(e.message);
//     }
// };
//
// const put = async (path, data, config) => {
//     const formData = new FormData();
//
//     if (data) {
//         Object.entries(data).forEach(([key, value]) => formData.set(key, value));
//     }
//
//     try {
//         return await axios.put(`${API_URL}${path}`, formData, { ...config });
//     } catch (e) {
//         console.log(e.message);
//     }
// };
//
// const remove = async (path, config) => {
//     try {
//         return await axios.delete(`${API_URL}${path}`, { ...config });
//     } catch (e) {
//         console.log(e.message);
//     }
// };
//
// export default { get, post, put, remove };

import {ENDPOINT_BOOK} from "../common/constants";

angular.module('myApp.service',[])

    .service('bookService',['config', function(config){

        return {
            getAll: () => axios.get(`${config.apiUrl}${ENDPOINT_BOOK}`),
            save: book => axios.post(`${config.apiUrl}${ENDPOINT_BOOK}`),
            update: book => axios.put(`${config.apiUrl}${ENDPOINT_BOOK}`),
            delete: book => axios.delete(`${config.apiUrl}${ENDPOINT_BOOK}`)
        }
    }]);