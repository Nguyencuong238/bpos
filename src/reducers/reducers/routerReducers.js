import * as Types from '../actions';

const initialState = {
    version: 1,
    category: [],
    product_stock:[],
    list_stocktakes: [],
    list_stocktakes_save: [],
    edit_customer:0,
    tags: [],
    bankaccount: [],
    info_customer: {
        customer_id: { value: 0, validate: true, msg: null },
        full_name: { value: '', validate: true, msg: null },
        mobile_phone: { value: '', validate: true, msg: null },
        email: { value: '', validate: true, msg: null },
        address: { value: '', validate: true, msg: null },
        province_id: { value: 0, validate: true, msg: null },
        province: { value: '', validate: true, msg: null },
        district_id: { value: 0, validate: true, msg: null },
        district: { value: '', validate: true, msg: null },
        ward_id: { value: 0, validate: true, msg: null },
        ward: { value: '', validate: true, msg: null },
        address_id: { value: 0, validate: true, msg: null },
        gender: { value: 1, validate: true, msg: null },
        birthday: { value: '', validate: true, msg: null },
        avatar: { value: '', validate: true, msg: null },
        position: { value: '', validate: true, msg: null },
        tagCustomerId:[],
        type: { value: 1, validate: true, msg: null },
        receipeint_id: { value: '', validate: true, msg: null },
        debt: [],
    },
};

const routerReducers = (state = initialState, { type, payload } = {}) => {
    let states = state;
    switch (type) {
        case Types.R_VERSION:
            states = { ...state, version: payload }; break;
        case Types.R_CATEGORY_LIST:
            states = { ...state, category: payload }; break;
        case Types.R_PRODUCT_STOCK:
            states = { ...state, product_stock: payload }; break;
        case Types.R_STOCK_TAKES:
            states = { ...state, list_stocktakes: payload }; break;
        case Types.R_CUSTOMER_FORM:
            states = { ...state, info_customer: payload }; break;
        case Types.R_CUSTOMER_EDIT:
            states = { ...state, edit_customer: payload }; break;
        case Types.R_BANK_ACCOUNT_LIST:
            states = { ...state, bankaccount: payload }; break;        
        case Types.R_TAG:
            states = { ...state, tags: payload }; break;     
        case Types.R_EDIT_STOCKTAKES:
            states = { ...state, list_stocktakes_save: payload }; break;
        default:
            states = state;
            break;
    }
    return states;
};

export default routerReducers;
