import firebase from 'firebase/app';
import { CF_FIREBASE } from '../../constants/config';
import 'firebase/database';
import 'firebase/auth';

export default class connectFirebase {
    constructor() {
        console.log(1122111);
    }

    /**
     * Kết nối tới Firebase
     * @param {*} callback 
     */
    async cFireBase() {
        try {
            firebase.initializeApp(CF_FIREBASE);
            return Promise.resolve(null, firebase);
        } catch (error) {

        }
        return Promise.resolve(null, firebase);
    }

    /**
     * 
     * @param {*} fn 
     * @param {*} params 
     */
    async useFirebase(fnname, params, fn) {
        return this.cFireBase().then(() => {
            switch (fnname) {
                case 'authFireBase': return this.authFireBase(params).then((er, done) => { return Promise.resolve(er, done); });
                case 'listenWebsiteOnline': return this.listenWebsiteOnline(params, fn);
            }
        });
    }

    listenWebsiteOnline(params, fn) {
        const starCountRef = firebase.database().ref('Website/' + params.node_id + '/Online');
        starCountRef.on('value', function (snapshot) {
            fn(null, snapshot.val());
        });
    }

    /**
     * Đăng nhập vào FireStore
     * @param {*} token 
     */
    async authFireBase(token) {
        return firebase.auth().signInWithCustomToken(token).then(() => {
            return Promise.resolve(null, true);
        }).catch(function (error) {
            return Promise.resolve(error, false);
        });
    }

    /**
     * Thoát firebase
     */
    async logoutFireBase() {
        return firebase.auth().signOut().then(function () {
            return true;
        }).catch(function () {
            return false;
        });
    }
}