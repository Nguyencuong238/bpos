import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import createSagaMiddleware from 'redux-saga';
import thunk from 'redux-thunk';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { TYPE } from '../../constants/config';
import  routerReducers  from '../reducers/routerReducers';
import  routerReducersStatic  from '../reducers/routerReducersStatic';
import rootSaga from '../saga/index';
// import rootSaga from '../saga/index';



const composeEnhancers = compose;

const config = { key: `bpos_${TYPE}`, storage };

const sagaMiddleware = createSagaMiddleware();

const reducersStorage = combineReducers({
    state: routerReducers,
    persist: persistReducer(config, routerReducersStatic),
});

const store = createStore(
    reducersStorage,
    composeEnhancers(applyMiddleware(sagaMiddleware), applyMiddleware(thunk)),
);

sagaMiddleware.run(rootSaga);


const persistor = persistStore(store, null, () => { });
export { persistor, store };
