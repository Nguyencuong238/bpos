// import Cf from '../config/Config';
import { AsyncStorage } from 'react-native';

export function storageGetItem(key, callback) {
    AsyncStorage.getItem(key, (e, r) => {
        if (callback) callback(e, r);
    });
}

export const _retrieveData = async (key) => await AsyncStorage.getItem(key);

// export async function _retrieveData(key) {
//     try {
//         const value = await AsyncStorage.getItem(key);
//         return value;
//     } catch (error) {
//         // Error retrieving data
//     }
// };

export async function _storeData(key, value) {
    try {
        return await AsyncStorage.setItem(key, value);
    } catch (error) {

    }
};

export function storageSetItem(key, value, callback) {
    AsyncStorage.setItem(key, value, (e, r) => {
        if (callback) callback(e, r);
    });
}
export function storageGetMulti(keys, callback) {
    AsyncStorage.multiGet(keys, (e, r) => {
        if (callback) callback(e, r);
    });
}
export function storageClear(callback) {
    AsyncStorage.clear((e, r) => {
        if (callback) callback(e, r);
    });
}
export function storageRemove(key, callback) {
    AsyncStorage.removeItem(key, (e, r) => {
        if (callback) callback(e, r);
    });
}
