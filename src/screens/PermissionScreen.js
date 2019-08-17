import React, { PureComponent } from 'react';
import { createStackNavigator, } from 'react-navigation';
import { View, StyleSheet } from 'react-native';
import Icon from "react-native-vector-icons/Ionicons";
import RNPickerSelect from 'react-native-picker-select';
import { Button } from 'react-native-elements';
import { MenuCss } from '../styles/menu';
import HeaderLeft from '../navigation/HeaderLeft';
import Permission from '../components/Permission/index';
import List_Personnel from '../components/Permission/ListPersonnel/List_Personnel';
import Personnel_Detail from '../components/Permission/ListPersonnel/Personnel_Detail';

export default PermissionScreen = createStackNavigator({
    Permission: {
        screen: Permission,
        navigationOptions: ({ navigation }) => ({
            title: 'Phân quyền',
            headerLeft: <HeaderLeft navigationProps={navigation} />,
            headerStyle: MenuCss.headerStyle,
            headerTintColor: '#fff',
        }),
    },
    
    List_Personnel: {
        screen: List_Personnel,
        navigationOptions: ({ navigation }) => ({
            title: 'Danh sách nhân viên',
            headerStyle: MenuCss.headerStyle,
            headerTintColor: '#fff',
            headerRight: (
                <View style={{flexDirection: 'row'}}>
                    <Button
                        onPress={() => navigation.state.params.dispatch()}
                        color="#fff"
                        style={{ fontSize: '11', flex: 1 }}
                        buttonStyle={{ backgroundColor: 'transparent' }}
                        icon={
                            <Icon
                                name="md-person-add"
                                size={24}
                                color="white"
                            />
                        }
                    />
                    <Button
                        onPress={() => navigation.state.params.dispatch()}
                        color="#fff"
                        style={{ fontSize: '11', flex: 1 }}
                        buttonStyle={{ backgroundColor: 'transparent' }}
                        icon={
                            <Icon
                                name="ios-funnel"
                                size={24}
                                color="white"
                            />
                        }
                    />
                </View>
                
            ),
        }),
    },

    Personnel_Detail: {
        screen: Personnel_Detail,
        navigationOptions: ({ navigation }) => ({
            title: 'Chi tiết nhân viên',
            headerStyle: MenuCss.headerStyle,
            headerTintColor: '#fff',
            headerRight: (
                <View style={{flexDirection: 'row'}}>
                    <Button
                        onPress={() => navigation.state.params.dispatch()}
                        color="#fff"
                        style={{ fontSize: '11', flex: 1 }}
                        buttonStyle={{ backgroundColor: 'transparent' }}
                        icon={
                            <Icon
                                name="md-create"
                                size={24}
                                color="white"
                            />
                        }
                    />
                </View>
            ),
        }),
    },

});