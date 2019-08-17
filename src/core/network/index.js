import qs from 'qs';
import { AsyncStorage } from 'react-native';
import axios from 'axios';
import { isEmpty } from 'lodash';
import { URL_API } from '../../constants/config';
import AuthService from '../auth/AuthService';
import { MyAlert } from '../../components/library/MyAlert';
import NavigatorService from '../../services/NavigatorService';

function serialize(obj) {
    return `?${Object.keys(obj).reduce((a, k) => { a.push(`${k}=${encodeURIComponent(obj[k])}`); return a; }, []).join('&')}`;
}

export async function GET(url, params) {
    try {
        const res = await axios(URL_API + url + serialize(params), {
            method: 'get',
            responseType: 'json',
        });
        if (res.data.data !== undefined) {
            return res.data.data;
        }
    } catch (error) {
        console.log(error);
        MyAlert('Lỗi không xác định', `${error.message}`);
    }
}

export async function POST(url, params) {
    const Auth = new AuthService();
    const token = await Auth.getToken();
    try {
        const res = await axios({
            method: 'post',
            url: URL_API + url,
            // responseType: 'json',
            headers: {
                authcode: token,
            },
            data: qs.stringify(params),
        });
        if (res.data.data !== undefined) {
            return res.data.data;
        }
        else if (res.data !== undefined && res.data.slice(0, 1) !== '') {
            const test = res.data.substring(1);
            const { data } = JSON.parse(test);
            if (data !== undefined) {
                return data;
            }
        } else {
            if (res.data.data !== undefined) {
                return res.data.data;
            }
        }
    } catch (error) {
        try {
            if (!isEmpty(error.response) && error.response.status === 403) {
                AsyncStorage.removeItem('token_exp');
                NavigatorService.navigate('Auth');
                // MyAlert('Lỗi xác thực', `${error.message} - tài khoản bạn hết hạn đăng nhập hoặc đã có ai đó đang sử dụng tài khoản này!`);
            }
        } catch (e) {
            console.log(error);
            MyAlert('Lỗi không xác định', `${error.message}`);
        }
    }
}

export async function UPLOAD(url, params) {
    const Auth = new AuthService();
    const token = await Auth.getToken();
    try {
        const res = await axios(URL_API + url, {
            method: 'post',
            responseType: 'json',
            headers: {
                authcode: token,
            },
            data: params,
        });
        if (res.data.data !== undefined) {
            return res.data.data;
        }
    } catch (error) {
        if (error.response.status === 403) {
            // notification('error', 'Lỗi xác thực', `${error.message} - tài khoản bạn hết hạn đăng nhập hoặc đã có ai đó đang sử dụng tài khoản này!`);
            // window.location.href = '/login';
        } else {
            // notification('error', 'Lỗi xác thực', `${error.message}`);
        }
    }
}
