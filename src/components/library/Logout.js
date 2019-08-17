import { SET_PROFILE, SET_WEB_ID, SET_PAGE_KEY, TXT_PASSWORD, TXT_USERNAME } from '../../redux/actiontypes';
import { storageRemove } from '../../helpers/Common';
import { ActionSheetIOS } from 'react-native';


export function Logout(dispatch, navigator) {
    ActionSheetIOS.showActionSheetWithOptions({
        options: ['Hủy', 'Đăng xuất'],
        destructiveButtonIndex: 1,
        cancelButtonIndex: 0,
    }, (buttonIndex) => {
        if (buttonIndex === 1) {
            dispatch({ type: SET_PROFILE, payload: {} });
            dispatch({ type: SET_WEB_ID, payload: null });
            dispatch({ type: SET_PAGE_KEY, payload: null });
            dispatch({ type: TXT_PASSWORD, payload: '' });
            dispatch({ type: TXT_USERNAME, payload: '' });
            storageRemove('token', () => {
                navigator.resetTo({
                    screen: 'screen.Login'
                });
            });
        }
    });
}
