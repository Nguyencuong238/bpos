import React, { Component } from 'react';
import { connect } from 'react-redux';
import { isEmpty, forEach, filter } from 'lodash';
import { List, ListItem, Button } from "react-native-elements";
import { View, ScrollView, Text, ActivityIndicator, ListView, Image, StyleSheet, FlatList, RefreshControl, TouchableOpacity, Picker, ActionSheetIOS, Platform, Item } from 'react-native';
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

class Goods extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            data: [],
            page: 1,
            limit: 20,
            refreshing: false,
            value: '',
            sort: 'id_desc',
            selectedValue: 'id_desc',
            selectedLabel: 'Mới nhất',
            productSearch: null,
            toEnd: false,
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

    async componentWillReceiveProps(nextProps) {
        await this.getResult(nextProps);
    }

    componentWillUnmount() {
        this.willFocusSubscription.remove();
    }

    async changeScreenOrientation() {
        await ScreenOrientation.unlockAsync();

    }

    // async componentWillReceiveProps(nextProps) {
    //     await this.getResult(nextProps);
    // }

    // async changeScreenOrientation() {
    //     await ScreenOrientation.unlockAsync();

    // }

    getResult(nextProps) {
        const { data } = this.state;
        const { navigation } = nextProps;
        const productSearch = navigation.getParam('barcodeProduct');
        const barcodeProduct = filter(data, (v) => (v.barcode === productSearch));
        { !isEmpty(productSearch) ? this.setState({ data: barcodeProduct }) : '' }
    }

    getList() {
        const { page, limit, sort } = this.state;
        const { depot_current } = this.props;
        const params = {
            mtype: 'getAll',
            limit,
            offset: 0,
            depot_id: parseFloat(depot_current),
            sort: !isEmpty(sort) ? [sort] : '',
        };
        this.setState({ loading: true });
        product_api(params).then((data) => {
            this.setState({ data: data.products, refreshing: false });
        });
    }

    getListMore = () => {
        this.setState({ loading: true });
        const { page, limit, sort } = this.state;
        // const limit = 10;
        const { depot_current } = this.props;
        const offset = (page - 1) * limit;
        const params = {
            mtype: 'getAll',
            limit,
            offset,
            depot_id: parseFloat(depot_current),
            sort: !isEmpty(sort) ? [sort] : '',
        };
        product_api(params).then((data) => {
            this.setState({ data: page === 1 ? data.products : [...this.state.data, ...data.products] })
        });
        this.setState({ loading: false, toEnd: true });
        // setTimeout(() => this.refs.flatList.scrollToEnd(), 200);
    }

    async onChangePiker(itemValue) {
        await this.setState({ sort: itemValue });
        this.getList();
    }

    _onRefresh = () => {
        this.setState({ page: 1, refreshing: true, sort: 'id_desc' });
        this.getList();
    }


    renderItem(item) {
        return (
            <TouchableOpacity
                onPress={() => {
                    NavigatorService.navigate('itemGood', {
                        itemId: item.id,
                        sku: item.sku,
                    });
                }}
            >
                <View style={{
                    flex: 1,
                    paddingVertical: 10,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}
                >
                    <View style={dashboardCss.dashboard_selling_top_ten_list_img}>
                        {!isEmpty(item.images) ? (
                            <Image
                                style={{ width: 50, height: 50, resizeMode: 'contain', marginRight: 10, borderRadius: 4 }}
                                source={{ uri: `https:${item.images[0].image}` }}
                            />
                        ) : (
                                <Image
                                    style={{ width: 50, height: 50, resizeMode: 'contain', marginRight: 10, borderRadius: 4 }}
                                    source={{ uri: 'https://c1.staticflickr.com/9/8112/8477434985_5f637b7d84_z.jpg' }}
                                />
                            )}
                    </View>
                    <View style={dashboardCss.dashboard_selling_top_ten_list_info}>
                        <View style={dashboardCss.dashboard_selling_top_ten_list_info_top}>
                            <Text style={[dashboardCss.dashboard_selling_top_ten_list_name, Main.font_bold]}>{item.name}</Text>
                            <Text style={dashboardCss.dashboard_selling_top_ten_list_amount}>{parseFloat(item.quantity)}</Text>
                        </View>
                        <View style={dashboardCss.dashboard_selling_top_ten_list_info_top}>
                            <Text style={dashboardCss.dashboard_selling_top_ten_list_amount}>{item.sku}</Text>
                            <Text style={[dashboardCss.dashboard_selling_top_ten_list_price, Main.text_success]}>
                                <NumberFormat
                                    value={parseFloat(item.price)}
                                    displayType={'text'}
                                    thousandSeparator={true}
                                    suffix={'đ'}
                                    renderText={value => <Text>{value}</Text>}
                                />
                            </Text>
                        </View>
                    </View>
                </View>
                <View style={{
                    height: 1,
                    backgroundColor: '#ebebeb',
                }}
                />
            </TouchableOpacity >
        )
    }

    renderOptions() {
        const options = [
            // { value: 'id_desc', label: 'Mới nhất' },
            { value: 'id_asc', label: 'Cũ nhất' },
            { value: 'price_desc', label: 'Lớn -> nhỏ' },
            { value: 'price_asc', label: 'Nhỏ -> lớn' },
        ];
        let items = [];
        if (!isEmpty(options)) {
            items = [];
            forEach(options, (v) => {
                items.push({
                    label: v.label,
                    value: v.value,
                })
            });
        }

        return items;
    }

    handleLoadMore = () => {
        this.setState({ page: this.state.page + 1, loading: true });
        this.getListMore();
    }

    scrollToEnd = () => {
        this.scrollView.scrollToEnd();
    }

    compFooter = () => {
        const { loading } = this.state;
        if (loading === false) return null;
        return (
            <View
                style={{
                    paddingVertical: 20,
                    borderTopWidth: 1,
                    borderColor: "#CED0CE"
                }}
            >
                {/* {
                    loading
                        ? */}
                <ActivityIndicator animating size="large" />
                {/* :
                        ''
                } */}
            </View>
        );
        // return (
        //     <View style={styles.headerBg}>
        //         <ActivityIndicator animating size="large" />
        //     </View>
        // );
    }

    render() {
        const { navigation } = this.props;
        const { sort, refreshing, loading, toEnd } = this.state;
        let { data } = this.state;
        const searchData = navigation.getParam('searchData');
        { !isEmpty(searchData) ? data = searchData.products : data }
        this.changeScreenOrientation();
        return (
            // <ScrollView
                // refreshControl={
                //     <RefreshControl
                //         refreshing={refreshing}
                //         onRefresh={this._onRefresh}
                //     />
                // }
                // ref={(scrollView) => { this.scrollView = scrollView }}
            // >
                <View style={styles.container}>
                    <View style={Main.row}>
                        <View style={Main.col_6}>
                            <TouchableOpacity>
                                <Button
                                    onPress={() => {
                                        NavigatorService.navigate('searchGood');
                                    }}
                                    icon={
                                        <Icon
                                            name="ios-search"
                                            size={20}
                                            color="white"
                                        />
                                    }
                                    title="Tìm kiếm"
                                    titleStyle={{ fontSize: 15, paddingLeft: 5, paddingTop: 0 }}
                                    buttonStyle={{ alignItems: 'center', padding: 10, backgroundColor: '#28af6b' }}
                                />
                            </TouchableOpacity>
                        </View>
                        <View style={Main.col_6}>
                            <View style={{ flex: 1, alignItems: 'center' }}>
                                <RNPickerSelect
                                    placeholder={{
                                        label: 'Mới nhất',
                                        value: 'id_desc',
                                    }}
                                    items={this.renderOptions()}
                                    onValueChange={(itemValue) => this.onChangePiker(itemValue)}
                                    style={{
                                        ...pickerSelectStyles,
                                        iconContainer: {
                                            top: 10,
                                            right: 12,
                                        },
                                    }}
                                    value={sort}
                                    Icon={() => {
                                        return <Ionicons name="md-arrow-dropdown" size={24} color="gray" />;
                                    }}
                                />
                            </View>
                        </View>
                    </View>
                    <FlatList
                        data={data}
                        renderItem={({ item }) => this.renderItem(item)}
                        // extraData={this.state}
                        refreshing={refreshing}
                        onRefresh={this._onRefresh}
                        ListFooterComponent={this.compFooter}
                        onEndReached={this.handleLoadMore}
                        onEndReachedThreshold={0.05}
                        // stickyHeaderIndices={[1]}
                        ref="flatList"
                    // onContentSizeChange={ toEnd ? () => this.refs.flatList.scrollToEnd(): ''}
                    />
                </View>
            // </ScrollView>
        );
    }
}

const mapStateToProps = ({ persist }) => ({
    depot_current: persist.depot_current,
});

export default connect(mapStateToProps)(Goods);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15,
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
