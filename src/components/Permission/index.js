import React, { Component } from 'react';
import { View, ScrollView, Text, TouchableOpacity, StyleSheet } from 'react-native';
import NavigatorService from '../../services/NavigatorService';
import { ScreenOrientation } from 'expo';
import Icon from "react-native-vector-icons/Ionicons";

class Permission extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            refreshing: false,
        };
    }
    componentDidMount() {
        this.willFocusSubscription = this.props.navigation.addListener(
            'willFocus',
            () => {
                this.changeScreenOrientation();
            });
    }

    componentWillUnmount() {
        this.willFocusSubscription.remove();
    }

    async changeScreenOrientation() {
        await ScreenOrientation.unlockAsync();

    }

    render() {
        this.changeScreenOrientation();
        return (
            <View style={styles.container}>
                <View style={styles.info}>
                    <Text style={styles.row}>
                        Phân quyền
                    </Text>
                    <TouchableOpacity onPress={() => NavigatorService.navigate('List_Personnel')}>
                        <View style={styles.row}>
                            <Icon
                                name="md-person"
                                size={20}
                                color="#000"
                            />
                            <Text style={{ marginLeft: 20 }}>Danh sách nhân viên</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => NavigatorService.navigate('Group_Permission')}>
                        <View style={styles.row}>
                            <Icon
                                name="md-people"
                                size={20}
                                color="#000"
                            />
                            <Text style={{ marginLeft: 20 }}>Nhóm quyền</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => NavigatorService.navigate('Role_Permission')}>
                        <View style={styles.row}>
                            <Icon
                                name="md-person"
                                size={20}
                                color="#000"
                            />
                            <Text style={{ marginLeft: 20 }}>Phân quyền nhóm nhân viên</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => NavigatorService.navigate('Personnel_Permission')}>
                        <View style={styles.row}>
                            <Icon
                                name="md-person"
                                size={20}
                                color="#000"
                            />
                            <Text style={{ marginLeft: 20 }}>Phân quyền nhân viên</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

export default Permission;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        borderRadius: 4,
        borderColor: 'rgba(0, 0, 0, 0.1)',
        overflow: 'hidden'
    },
    header: {
        flex: 10,
        height: 10,
    },
    info: {
        flex: 100,
    },
    row: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: '#eaeaea',
        backgroundColor: '#f5f5f5',
        padding: 15,
        alignItems: 'center'
    }
});