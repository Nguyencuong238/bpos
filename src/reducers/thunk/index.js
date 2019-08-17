import * as Types from '../actions';
/* eslint-disable*/
export const CHANGE_FORM_PRODUCT_LOGIC = (params) => (dispatch) => {
    dispatch({
        type: Types.R_FORM_PRODUCT_LOGIC,
        payload: params,
    });
    return Promise.resolve();
};
export const CHANGE_FORM_PRODUCT = (params) => (dispatch) => {
    dispatch({
        type: Types.R_FORM_PRODUCT,
        payload: params,
    });
    return Promise.resolve();
};
export const CHANGE_BILLS = (params) => (dispatch) => {
    dispatch({
        type: Types.R_BILLS,
        payload: params,
    });
    return Promise.resolve();
};
export const CHANGE_PROMOTION = (params) => (dispatch) => {
    dispatch({
        type: Types.R_PROMOTION,
        payload: params,
    });
    return Promise.resolve();
};
export const CHANGE_DEPOT = (params) => (dispatch) => {
    dispatch({
        type: Types.R_DEPOT_CURRENT,
        payload: params,
    });
    return Promise.resolve();
};
export const CHANGE_NODE_ID = (params) => (dispatch) => {
    dispatch({
        type: Types.R_NODE_ID,
        payload: params,
    });
    return Promise.resolve();
};
export const CHANGE_TOKEN = (params) => (dispatch) => {
    dispatch({
        type: Types.R_TOKEN,
        payload: params,
    });
    return Promise.resolve();
};
export const CHANGE_PROFILE = (params) => (dispatch) => {
    dispatch({
        type: Types.R_PROFILE,
        payload: params,
    });
    return Promise.resolve();
};
export const CHANGE_PERMISSION = (params) => (dispatch) => {
    dispatch({
        type: Types.R_PERMISSION,
        payload: params,
    });
    return Promise.resolve();
};
export const CHANGE_ROLE = (params) => (dispatch) => {
    dispatch({
        type: Types.R_ROLE,
        payload: params,
    });
    return Promise.resolve();
};
export const CHANGE_NODE_INFO = (params) => (dispatch) => {
    dispatch({
        type: Types.R_NODE_INFO,
        payload: params,
    });
    return Promise.resolve();
};
