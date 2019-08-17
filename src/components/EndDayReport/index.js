import React, { Component } from 'react';
import { connect } from 'react-redux';
import { isEmpty, filter, split, find, forEach } from 'lodash';
import { View, ScrollView, Text, RefreshControl, TouchableOpacity, StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';
import NavigatorService from '../../services/NavigatorService';
import moment from 'moment';
import { ScreenOrientation } from 'expo';
import Icon from "react-native-vector-icons/Ionicons";

class AllReport extends Component {
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
                        Danh sách báo cáo
                    </Text>
                    <TouchableOpacity onPress={() => NavigatorService.navigate('SellReport')}>
                        <View style={styles.row}>
                            <Icon
                                name="md-pulse"
                                size={20}
                                color="#000"
                            />
                            <Text style={{marginLeft: 20}}>Báo cáo bán hàng</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => NavigatorService.navigate('SellDetailReport')}>
                        <View style={styles.row}>
                            <Icon
                                name="md-pulse"
                                size={20}
                                color="#000"
                            />
                            <Text style={{marginLeft: 20}}>Chi tiết bán hàng</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => NavigatorService.navigate('ReceiptsReport')}>
                        <View style={styles.row}>
                            <Icon
                                name="md-pulse"
                                size={20}
                                color="#000"
                            />
                            <Text style={{marginLeft: 20}}>Báo cáo Thu/Chi</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => NavigatorService.navigate('ReceiptsDetailReport')}>
                        <View style={styles.row}>
                            <Icon
                                name="md-pulse"
                                size={20}
                                color="#000"
                            />
                            <Text style={{marginLeft: 20}}>Chi tiết Thu/Chi</Text>
                        </View>
                    </TouchableOpacity>
                    {/*<TouchableOpacity onPress={() => NavigatorService.navigate('SellLineChart')}>
                        <View style={styles.row}>
                            <Icon
                                name="md-pulse"
                                size={20}
                                color="#000"
                            />
                            <Text style={{marginLeft: 20}}>Biểu đồ bán hàng</Text>
                        </View>
                    </TouchableOpacity>*/}
                </View>
            </View>
        );
    }
}

export default AllReport;

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
        // alignSelf: 'center',
        // alignItems: 'center',
        height: 10,
        // padding: 15,
        // overflow: 'hidden'
    },
    info: {
        flex: 100,
        // padding: 15
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