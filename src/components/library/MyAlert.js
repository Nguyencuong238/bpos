import { Platform, Alert, AlertIOS } from 'react-native';

export function MyAlert(title, desc) {
    // if (Platform.OS === 'ios') return AlertIOS.alert(title, desc);
    return Alert.alert(title, desc);
}
