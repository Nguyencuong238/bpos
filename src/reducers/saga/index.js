import { fork, all } from 'redux-saga/effects';
import SagaDemo from './actions/SagaDemo';
// import SagaRate from './actions/SagaRate';
// import SagaOnSound from './actions/SagaOnSound';
// import SagaFirst from './actions/SagaFirst';
// import SagaSaveClientInfo from './actions/SagaSaveClientInfo';
// import SagaDisconnect from './actions/SagaDisconnect';
// import SagaSendInbox from './actions/SagaSendInbox';

export default function* rootSaga() {
    yield all([
        fork(SagaDemo),
        // fork(SagaRate),
        // fork(SagaOnSound),
        // fork(SagaFirst),
        // fork(SagaSaveClientInfo),
        // fork(SagaDisconnect),
        // fork(SagaSendInbox)
    ]);
}