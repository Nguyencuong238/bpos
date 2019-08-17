import React, { Component } from 'react';
import { connect } from 'react-redux';
import { isEmpty, forEach, filter } from 'lodash';
import { List, ListItem, Button } from "react-native-elements";
import { View, ScrollView, Text, ListView, Image, StyleSheet, FlatList, RefreshControl, TouchableOpacity, Picker, ActionSheetIOS, Platform, Item } from 'react-native';
import { product_api } from '../../services/api/fetch';
import NumberFormat from 'react-number-format';
import { dashboardCss } from '../../styles/dashboard';
import { Main } from '../../styles/main';
import Icon from "react-native-vector-icons/Ionicons";
import { Ionicons } from "@expo/vector-icons";
import NavigatorService from '../../services/NavigatorService';
import RNPickerSelect from 'react-native-picker-select';
import { showMessage } from "react-native-flash-message";
import { ScreenOrientation } from 'expo';

class TestFlatlist extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            data: [],
            page: 1,
            limit: 20,
            refreshing: false,
            value: '',
            sort: 'id_desc',
            selectedValue: 'id_desc',
            selectedLabel: 'Mới nhất',
            productSearch: null,
        };
    }

    componentDidMount() {
        this.getList();
        this.willFocusSubscription = this.props.navigation.addListener(
            'willFocus',
            () => {
                this.getList();
            });
    }

    getList() {
        const { page, limit, sort } = this.state;
        const { depot_current } = this.props;
        const offset = (page - 1) * limit;
        const params = {
            mtype: 'getAll',
            limit,
            offset: page === 1 ? 0 : offset,
            depot_id: parseFloat(depot_current),
            sort: !isEmpty(sort) ? [sort] : '',
        };
        product_api(params).then((data) => {
            if (page === 1) {
                this.setState({ data: data.products, refreshing: false });
            }
        });
    }

    renderRow({ item }) {
        console.log(item);
        return (
            <ListItem
                roundAvatar
                title={item.name}
                subtitle={item.subtitle}
                avatar={{ uri: item.avatar_url }}
            />
        )
    }


    render() {
        return (
            <List>
                <FlatList
                    data={this.state.data}
                    renderItem={this.renderRow}
                    keyExtractor={item => item.id}
                />
            </List>
        );
    }
}

const mapStateToProps = ({ persist }) => ({
    depot_current: persist.depot_current,
});

export default connect(mapStateToProps)(TestFlatlist);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15,
    },
    separator: {
        height: 0.5,
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    text: {
        fontSize: 15,
        color: 'black',
    },
    footer: {
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    loadMoreBtn: {
        padding: 10,
        backgroundColor: '#800000',
        borderRadius: 4,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: 14,
        paddingTop: 13,
        paddingHorizontal: 10,
        paddingBottom: 12,
        borderWidth: 1,
        borderColor: '#E5E5E5',
        borderRadius: 4,
        backgroundColor: 'white',
        color: 'black',
    },
});
