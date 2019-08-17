import * as Types from '../actions/index';

const initialState = {
    profile: {},
    token: '',
    form_login: {
        node_name: { value: '', validate: true, msg: null },
        username: { value: '', validate: true, msg: null },
        password: { value: '', validate: true, msg: null },
    },
    depots: [],
    depot_current: 0,
    userPermission: [],
    userRole: [],
    node_info: null,
    product_stock:[],
    list_stocktakes: [],
    list_stocktakes_save: [],
    list_warehousing: [],
    list_warehousing_save: [],
};

const routerReducersStatic = (state = initialState, { type, payload } = {}) => {
    let states = Object.assign({}, state);
    switch (type) {
        case Types.R_PROFILE:
            states = { ...state, profile: payload }; break;
        case Types.R_LOGIN:
            states = { ...state, form_login: payload }; break;
        case Types.R_TOKEN:
            states = { ...state, token: payload }; break;
        case Types.R_ROLE:
            states = { ...state, userRole: payload }; break;
        case Types.R_PERMISSION:
            states = { ...state, userPermission: payload }; break;
        case Types.R_NODE_INFO:
            states = { ...state, node_info: payload }; break;
        case Types.R_DEPOT_LIST:
            states = { ...state, depots: payload }; break;
        case Types.R_DEPOT_CURRENT:
            states = { ...state, depot_current: payload }; break;
        case Types.R_PRODUCT_STOCK:
            states = { ...state, product_stock: payload }; break;
        case Types.R_STOCK_TAKES:
            states = { ...state, list_stocktakes: payload }; break;
        case Types.R_EDIT_STOCKTAKES:
            states = { ...state, list_stocktakes_save: payload }; break;
        case Types.D_WAREHOUSE_LIST:
            states = { ...state, list_warehousing: payload }; break;
        case Types.R_EDIT_WAREHOUSING:
            states = { ...state, list_warehousing_save: payload }; break;
        case Types.R_WAREHOUSING:
            states = { ...state, list_warehousing: payload }; break;

        default:
            states = state;
            break;
    }
    return states;
};

export default routerReducersStatic;
