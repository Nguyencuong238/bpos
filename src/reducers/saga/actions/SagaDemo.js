/* eslint-disable require-yield,no-console,no-undef */
import { call, put, takeLatest } from 'redux-saga/effects';
// import { sendInboxApi } from '../../../api/fetch';

function* progressE(action) {
    let { params, cb } = action.payload;
    console.log('===================================');
    console.log(cb());
    console.log('===================================');
    // try {
    //     yield call(sendInboxApi, { params });

    //     yield put({ type: 'WS_CLOSE', payload: true });
    //     yield put({ type: 'START_WS', payload: false });
    //     yield put({ type: 'MAX_WIN', payload: false });
    // } catch (e) {
    //     yield put({ type: 'ERROR', message: e.message });
    // }
}

function* SagaDemo() {
    yield takeLatest('SAGA_DEMO', progressE);
}


export default SagaDemo;
