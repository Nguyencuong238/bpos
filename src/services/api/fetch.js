import { GET, POST, UPLOAD } from '../../core/network/index';

export async function requestResetPasswordApi(params) {
    const result = await POST('/forgot/req', params);
    return result;
}
export async function resetPasswordApi(params) {
    const result = await POST('/forgot/reset', params);
    return result;
}
export async function getInfoApi(params) {
    const result = await POST('/common/user', params);
    return result;
}

export async function updateInfoApi(params) {
    const result = await POST('/common/user', params);
    return result;
}

export async function editInfoApi(params) {
    const result = await POST('/profile/edit', params);
    return result;
}
export async function editPassword(params) {
    const result = await POST('/profile/password', params);
    return result;
}
export async function createStaff(params) {
    const result = await POST('/staff/create', params);
    return result;
}
export async function listStaff() {
    const result = await POST('/staff/list', {});
    return result;
}
export async function editStaff(params) {
    const result = await POST('/staff/edit', params);
    return result;
}
export async function resetPasswordStaff(params) {
    const result = await POST('/staff/reset-password', params);
    return result;
}
export async function getInfoWeb(params) {
    const result = await GET('/web/info', params);
    return result;
}
export async function editInfoWeb(params) {
    const result = await POST('/web/edit', params);
    return result;
}
export async function getWebSetting(params) {
    const result = await GET('/visitor/setting', params);
    return result;
}
export async function editWebSettings(params) {
    const result = await POST('/setting/create', params);
    return result;
}
export async function getInfoCustomer(params) {
    const result = await POST('/customer/get-info', params);
    return result;
}


/*API FIX */

// export async function node_check_exist_api(params) {
//     params.mtype = 'node_exist';
//     const result = await POST('/common/node', params);
//     return result;
// }

export async function validation_api(params) {
    const result = await POST('/common/validation', params);
    return result;
}

export async function getCustomer(params) {
    const result = await POST('/crm/customer', params);
    return result;
}

export async function getTags(params) {
    const result = await POST('/crm/customer_tag', params);
    return result;
}

export async function user_api(params) {
    const result = await POST('/common/user', params);
    return result;
}

export async function createCaptchaApi() {
    const result = await GET('/common/captcha', { mtype: 'create' });
    return result;
}

export async function node_info(params) {
    const result = await POST('/common/node', params);
    return result;
}

export async function listChat(params) {
    const result = await POST('/chat/conversation', params);
    return result;
}

export async function chatMessage(params) {
    const result = await POST('/chat/message', params);
    return result;
}

export async function chatHistory(params) {
    const result = await POST('/chat/history', params);
    return result;
}

// Cài đặt box chat
export async function boxChatSetting(params) {
    if (params.mtype === 'getAll') {
        const result = await GET('/chat/setting', params);
        return result;
    }
    const results = await POST('/chat/setting', params);
    return results;
}

// export async function loginApi(params) {
//     const result = await POST('/login', params);
//     return result;
// }

//Gắn thẻ tag
export async function tag_api(params) {
    const result = await POST('/crm/tag', params);
    return result;
}

export async function getListTag() {
    const result = await POST('/tag/lists', {});
    return result;
}
export async function createListTag(params) {
    const result = await POST('/tag/create', params);
    return result;
}

//Deparment
export async function department_api(params) {
    const result = await POST('/crm/department', params);
    return result;
}
export async function personnel_api(params) {
    const result = await POST('/crm/personnel', params);
    return result;
}
// address
export async function getAddress_api(params) {
    const result = await GET('/common/address', params);
    return result;
}


// export async function editTag(params) {
//     const result = await POST('/tag/edit', params);
//     return result;
// }
// export async function deleteTag(params) {
//     const result = await POST('/tag/delete', params);
//     return result;
// }

// Bpos setting
export async function getShop_api(params) {
    const result = await POST('/pos/shop', params);
    return result;
}
//API setting
export async function getSetting_api(params) {
    const result = await POST('/pos/setting', params);
    return result;
}
//API setting SMS
export async function getSettingSms_api(params) {
    const result = await POST('/pos/setting-sms', params);
    return result;
}
//API setting Email
export async function getSettingEmail_api(params) {
    const result = await POST('/pos/setting-email', params);
    return result;
}
//API setting mẫu in
export async function getSettingPrinted_api(params) {
    const result = await POST('/pos/setting-printed-form', params);
    return result;
}

//API danh mục sản phẩm
export async function productCategory_api(params) {
    const result = await POST('/pos/product-category', params);
    return result;
}

//API properties
export async function productProperties_api(params) {
    const result = await POST('/pos/product-properties', params);
    return result;
}

//API nhà sản xuất
export async function manufacturer_api(params) {
    const result = await POST('/pos/manufacturer', params);
    return result;
}

//API nhà cung cấp
export async function supplier_api(params) {
    const result = await POST('/pos/supplier', params);
    return result;
}

//API depot
export async function depot_api(params) {
    const result = await POST('/pos/depot', params);
    return result;
}

//API unit - đơn vị tính
export async function unit_api(params) {
    const result = await POST('/pos/unit', params);
    return result;
}
// API bảo hành
export async function guarantee_api(params) {
    const result = await POST('/pos/guarantee', params);
    return result;
}

// API Khách hàng
export async function customer_api(params) {
    const result = await POST('/crm/customer', params);
    return result;
}

// API phân quyền
export async function permission_api(params) {
    const result = await POST('/common/permission', params);
    return result;
}

export async function role_api(params) {
    const result = await POST('/common/role', params);
    return result;
}

// API Upload
export async function upload_api(params) {
    const result = await UPLOAD('/common/upload', params);
    return result;
}

// API thẻ ngân hàng
export async function bankaccount_api(params) {
    const result = await POST('/pos/bank-account', params);
    return result;
}


// API phiếu thu chi
export async function receipts_api(params) {
    const result = await POST('/pos/cash-flow', params);
    return result;
}

//API Sản phẩm
export async function product_api(params, query_string = null) {
    let url = '/pos/product';
    if (query_string !== null) url += `?query_string=${query_string}`;
    const result = await POST(url, params);
    return result;
}
// API loai thu chi
export async function receiptsType_api(params) {
    const result = await POST('/pos/category-cash-flow', params);
    return result;
}

//API setting email
export async function settingEmail_api(params) {
    const result = await POST('/pos/setting-email', params);
    return result;
}
//API setting sms
export async function settingSMS_api(params) {
    const result = await POST('/pos/setting-sms', params);
    return result;
}


//API khuyến mại
export async function promotionDiscount_api(params) {
    const result = await POST('/pos/promotion-discount', params);
    return result;
}

export async function promotionCoupon_api(params) {
    const result = await POST('/pos/promotion-coupon', params);
    return result;
}

//API Total Email And SMS
export async function logistic_api(params) {
    const result = await POST('/logistics/calculate', params);
    return result;
}

//API nhập kho
export async function purchase_order_api(params) {
    const result = await POST('/pos/purchase-order', params);
    return result;
}
//API trả hàng nhập
export async function purchase_return_api(params) {
    const result = await POST('/pos/purchase-return', params);
    return result;
}
//API Chuyển kho
export async function stock_api(params) {
    const result = await POST('/pos/stock', params);
    return result;
}

//API sửa node
export async function change_node_api(params) {
    const result = await POST('/common/node', params);
    return result;
}

//API tạo hóa đơn
export async function order_api(params) {
    const result = await POST('/pos/order', params);
    return result;
}
//API tạo hóa đơn sendo
export async function ordersendo_api(params) {
    const result = await POST('/pos/sendo-order', params);
    return result;
}
//API tạo setting vận chuyển
export async function setting_transport_api(params) {
    const result = await POST('/logistics/transport', params);
    return result;
}

//API change log
export async function change_log_api(params) {
    const result = await POST('/pos/change-log', params);
    return result;
}

//API Ecommerce Lazada
export async function ecommerce_api(params) {
    const result = await POST('/logistics/ecommerce', params);
    return result;
}

//API  Setting Ecommerce
export async function ecommerce_common_api(params) {
    const result = await POST('/ecommerce/common', params);
    return result;
}

// //API  Setting Ecommerce Lazada
export async function ecommercelazada_setting_api(params) {
    const result = await POST('/ecommerce/lazada-setting', params);
    return result;
}

// //API  Setting Ecommerce Zalo
export async function ecommercezalo_setting_api(params) {
    const result = await POST('/ecommerce/zalo-setting', params);
    return result;
}
export async function ecommerce_setting_api(params) {
    const result = await POST('/ecommerce/sendo-setting', params);
    return result;
}

//API  Connect Ecommerce Sendo
export async function ecommerce_connect_api(params) {
    const result = await POST('/ecommerce/sendo-connect', params);
    return result;
}
//API  Connect Ecommerce Lazada
export async function ecommercelazada_connect_api(params) {
    const result = await POST('/ecommerce/lazada-connect', params);
    return result;
}

//API  Connect Ecommerce Zalo
export async function ecommercezalo_connect_api(params) {
    const result = await POST('/ecommerce/zalo-connect', params);
    return result;
}

//API Vận chuyển
export async function logistics_setting_api(params) {
    const result = await POST('/logistics/logistics-setting', params);
    return result;
}

//API affiliate
export async function affiliate_api(params) {
    const result = await POST('/common/affiliate', params);
    return result;
}

//API thẻ tích điểm
export async function customer_card_api(params) {
    const result = await POST('/crm/customer-card', params);
    return result;
}

//API EMAIL EDITER
export async function email_editer_api(params) {
    const result = await POST('/pos/email-editor', params);
    return result;
}

//API Log
export async function log_api(params) {
    const result = await POST('/log/excel', params);
    return result;
}

//API trả góp
export async function installment_api(params) {
    const result = await POST('/pos/installment', params);
    return result;
}

//API cấp độ khách hàng
export async function customer_level_api(params) {
    const result = await POST('/crm/customer-level', params);
    return result;
}

//API imei sản phẩm
export async function product_imei_api(params) {
    const result = await POST('/pos/imei', params);
    return result;
}

//API lô sản phẩm
export async function product_batch_api(params) {
    const result = await POST('/pos/product-batch', params);
    return result;
}

//API shopfacebook
export async function shopfacebook_api(params) {
    const result = await POST('/pos/shop-facebook', params);
    return result;
}

//API báo cáo
export async function report_api(params) {
    const result = await POST('/report/standard', params);
    return result;
}

export async function reportdetail_api(params) {
    const result = await POST('/report/standard-detail', params);
    return result;
}

export async function reportdetail_api_download(params) {
    const result = await POST_DOWNLOAD('/report/standard-detail', params);
    return result;
}

export async function report_api_download(params) {
    const result = await POST_DOWNLOAD('/report/standard', params);
    return result;
}

//API định mức tồn kho
export async function inventory_api(params) {
    const result = await POST('/pos/inventory', params);
    return result;
}

//API định mức tồn kho
export async function systemAnnouncement_api(params) {
    const result = await POST('/pos/system-announcement', params);
    return result;
}

//API nguồn hàng
export async function order_source_api(params) {
    const result = await POST('/pos/order-source', params);
    return result;
}

//API vị trí sản phẩm kho hàng
export async function order_warehouselocation_api(params) {
    const result = await POST('/pos/warehouse-location', params);
    return result;
}

//API sản phẩm lỗi
export async function error_product_api(params) {
    const result = await POST('/pos/error-product', params);
    return result;
}

//API yêu cầu nhập kho
export async function warehouse_request_api(params) {
    const result = await POST('/pos/warehouse-request', params);
    return result;
}

//API yêu cầu chuyển kho
export async function warehouse_transfer_api(params) {
    const result = await POST('/pos/warehouse-transfer', params);
    return result;
}

//API yêu cầu chuyển kho
export async function notifycation_api(params) {
    const result = await POST('/pos/notify', params);
    return result;
}

//API báo cáo khách hàng
export async function reportCutomer_api(params) {
    const result = await POST('/report/standard-customer', params);
    return result;
}

export async function reportCutomer_api_download(params) {
    const result = await POST_DOWNLOAD('/report/standard-customer', params);
    return result;
}
//API báo cáo khách theo hàng bán
export async function standard_test_api(params) {
    const result = await POST('/report/standard-test', params);
    return result;
}

export async function report_test_api_download(params) {
    const result = await POST_DOWNLOAD('/report/standard-test', params);
    return result;
}
