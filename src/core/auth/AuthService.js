
// import connectFirebase from '../firebase/connectFirebase';
import moment from 'moment';
import qs from 'qs';
import { isEmpty } from 'lodash';
import { user_api, getInfoApi } from '../../services/api/fetch';
import { AsyncStorage } from 'react-native';
import { storageGetItem, storageSetItem, _retrieveData } from '../../helpers/Common';
import { POST } from '../../core/network/index';
import NavigatorService from '../../services/NavigatorService';

moment().utcOffset(7);
export default class AuthService {
    async login(params_source) {
        const params = { ...params_source };
        params.mtype = 'login';
        const res = await POST('/common/user', params);
        if (res.token !== undefined) {
            const exp = moment().add(1, 'hours').toString();
            storageSetItem('token_exp', exp, () => {
                return Promise.resolve(res);
            });
        };
        return Promise.resolve(res);
    }

    async getInfo(params) {
        return this.getToken().then(() => getInfoApi(params).then(({ user_info }) => {
            return user_info;
        }));
    }

    async loggedIn() {
        return await this.getToken();
    }

    // async setProfile(profile) {
    //     // Saves profile data to localStorage
    //     return localforage.setItem('profile', profile).then(() => {
    //         return true;
    //     });
    // }

    // async getProfile() {
    //     return localforage.getItem('profile').then((profile) => {
    //         return profile;
    //     });
    // }

    setToken(idToken, cb) {
        storageSetItem('id_token', idToken, () => {
            if (cb) cb(null, idToken);
        });
    }

    async getToken() {
        return _retrieveData('id_token');
    }

    getTokenCb(cb) {
        storageGetItem('id_token', idToken, (id_token) => {
            if (cb) { cb(null, id_token); }
        });
    }

    logout(cb) {
        AsyncStorage.clear();
        // AsyncStorage.removeItem('token_exp');
        // if (cb) cb();
        NavigatorService.navigate('Auth');
    }
}
