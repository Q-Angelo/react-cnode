import axios from 'axios';

// 客户端调用为空也可以
const baseUrl = process.env.API_BASE || '';

const parseUrl = (url, params) => {
    params = params || {};

    const str = Object.keys(params).reduce((result, key) => {
        result += `${key}=${params[key]}&`;

        return result;
    }, '');

    return `${baseUrl}/api${url}?${str.substr(0, str.length - 1)}`
}

export const get = (url, params) => {
    return new Promise((resolve, reject) => {
        axios.get(parseUrl(url, params)).then(res => {
            const { data } = res;

            if (data && data.success) {
                resolve(data);
            } else {
                reject(data);
            }
        }).catch(err => {
            if (err.response) {
                reject(err.response.data);
            } else {
                reject(new Error({
                    succes: false,
                    err_msg: err.message,
                }));
            }
        })
    })
}

export const post = (url, params, datas) => {
    return new Promise((resolve, reject) => {
        const reqUrl = parseUrl(url, params);

        axios.post(reqUrl, datas).then(res => {
            const { data } = res;

            if (data && data.success) {
                resolve(data);
            } else {
                console.log('post req doc: ', {
                    reqUrl,
                    res,
                });

                reject(data);
            }
        }).catch(err => {
            console.log('post req error: ', {
                reqUrl,
                err,
            });

            if (err.response) {
                reject(err.response.data);
            } else {
                reject(new Error({
                    succes: false,
                    err_msg: err.message,
                }));
            }
        })
    })
}

