import lscache from 'lscache';
import { APP, TYPE } from '../constants/config';

export function cacheSet(name, data, exp) {
    name = APP + TYPE + name;
    return lscache.set(name, data, exp / 60);
}

export function cacheGet(name) {
    name = APP + TYPE + name;
    return lscache.get(name);
}
