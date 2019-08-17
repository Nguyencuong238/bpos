import React, { Component } from 'react';
import { connect } from 'react-redux';
import { isEmpty, filter } from 'lodash';
import { View, ScrollView, Text, Image, RefreshControl, TouchableOpacity, Dimensions, StyleSheet, ActivityIndicator } from 'react-native';
import { product_api, productCategory_api } from '../../services/api/fetch';
import NumberFormat from 'react-number-format';
import { goodsCss } from '../../styles/goods';
import NavigatorService from '../../services/NavigatorService';

class ItemGood extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            data: [],
            refreshing: false,
            value: '',
            itemId: null,
            category: '',
            photo: '',
        };
    }

    componentDidMount() {
        this.getList();
        this.getListCategory();
    }

    getList() {
        const { depot_current, navigation } = this.props;
        const itemId = navigation.getParam('itemId');
        const params = {
            mtype: 'getbyid_edit',
            product_id: itemId,
            depot_id: parseFloat(depot_current),
        };
        product_api(params)
            .then((data) => {
                this.setState({ data: data, refreshing: false })
            });
    }

    getListCategory() {
        productCategory_api({ mtype: 'getAll' }).then(({ category }) => {
            this.setState({ category });
        });
    }

    _onRefresh = () => {
        this.setState({ refreshing: true });
        this.getList();
    }

    upLoadImage() {
        const options = {
            noData: true,
        }

        ImagePicker.launchImageLibraryAsync(options, res => {
            if (res.uri) {
                this.setState({ photo: res })
            }
        });
    }

    renderImage(product_info) {
        const options = [];
        product_info.images.map((v) => options.push(v.url));
        const htm = options.map((v, k) => {
            const num = k + 1;
            return (
                <View style={{ borderColor: '#ddd', borderWidth: 1, height: 100, width: '100%' }}>
                    <Image
                        key={num}
                        style={{ width: '100%', height: 100, resizeMode: 'contain', borderRadius: 4 }}
                        source={{ uri: `https:${v}` }}
                    />
                </View>
            );
        });
        return htm;
    }

    renderItem(product_info) {
        const { category } = this.state;
        const nameCate = filter(category, (o) => (o.id === parseInt(product_info.category_id)));
        const options = [];
        product_info.images.map((v) => options.push(v.url));
        return (
            <View>
                <View style={goodsCss.goods_details_avatar}>
                    {!isEmpty(product_info.images[0])
                        ? (
                            // <ScrollView
                            //     horizontal
                            //     pagingEnabled
                            //     showsHorizontalScrollIndicator={true} >
                            //     {this.renderImage(product_info)}
                            // </ScrollView>
                            <View style={{ flex: 1 }}>{this.renderImage(product_info)}</View>
                        ) : (
                            <View style={{ flex: 1 }}>
                                <View style={{ borderColor: '#ddd', borderWidth: 1, height: 100, width: '100%' }}>
                                    <Image
                                        style={{ width: 100, height: 100, padding: 5, resizeMode: 'contain', borderRadius: 4 }}
                                        source={{ uri: 'https://c1.staticflickr.com/9/8112/8477434985_5f637b7d84_z.jpg' }}
                                    />
                                </View>
                            </View>
                        )}
                </View>
                <View>
                    <View style={goodsCss.goods_details_list}>
                        <View style={{ flex: 50 }}>
                            <Text> Tên sản phẩm:</Text>
                        </View>
                        <View style={{ flex: 50 }}>
                            <Text style={{ fontWeight: '600' }}>{product_info.name}</Text>
                        </View>
                    </View>
                    <View style={goodsCss.goods_details_list}>
                        <View style={{ flex: 50 }}>
                            <Text> Danh mục:</Text>
                        </View>
                        <View style={{ flex: 50 }}>
                            <Text>{!isEmpty(nameCate[0]) ? nameCate[0].name : ''}</Text>
                        </View>
                    </View>
                    <View style={goodsCss.goods_details_list}>
                        <View style={{ flex: 50 }}>
                            <Text> Mã SKU:</Text>
                        </View>
                        <View style={{ flex: 50 }}>
                            <Text>{product_info.properties[0].sku}</Text>
                        </View>
                    </View>
                    <View style={goodsCss.goods_details_list}>
                        <View style={{ flex: 50 }}>
                            <Text> Mã barcode:</Text>
                        </View>
                        <View style={{ flex: 50 }}>
                            <Text>{product_info.properties[0].barcode}</Text>
                        </View>
                    </View>
                    <View style={goodsCss.goods_details_list}>
                        <View style={{ flex: 50 }}>
                            <Text> Giá bán:</Text>
                        </View>
                        <View style={{ flex: 50 }}>
                            <Text>
                                <NumberFormat
                                    value={product_info.properties[0].price}
                                    displayType={'text'}
                                    thousandSeparator={true}
                                    suffix={'đ'}
                                    renderText={value => <Text>{value}</Text>}
                                />
                            </Text>
                        </View>
                    </View>
                    <View style={goodsCss.goods_details_list}>
                        <View style={{ flex: 50 }}>
                            <Text> Giá vốn:</Text>
                        </View>
                        <View style={{ flex: 50 }}>
                            <Text>
                                <NumberFormat
                                    value={product_info.properties[0].price_market}
                                    displayType={'text'}
                                    thousandSeparator={true}
                                    suffix={'đ'}
                                    renderText={value => <Text>{value}</Text>}
                                />
                            </Text>
                        </View>
                    </View>
                    <View style={goodsCss.goods_details_list}>
                        <View style={{ flex: 50 }}>
                            <Text>Tồn kho:</Text>
                        </View>
                        <View style={{ flex: 50 }}>
                            <Text>{product_info.properties[0].quantity}</Text>
                        </View>
                    </View>
                    <View style={goodsCss.goods_details_list}>
                        <View style={{ flex: 50 }}>
                            <Text> Định mức tồn:</Text>
                        </View>
                        <View style={{ flex: 50 }}>
                            <Text>{product_info.inventory_max}>{product_info.inventory_min}</Text>
                        </View>
                    </View>
                </View>
                {/* </TouchableOpacity > */}
            </View>
        )
    }


    render() {
        const { data } = this.state;
        const { product_info } = data;
        return (
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this._onRefresh}
                    />
                }>
                <View>
                    {!isEmpty(product_info)
                        ? this.renderItem(product_info)
                        : (
                            <View>
                                {/* <ActivityIndicator size="large" color="#00ff00" /> */}
                                <ActivityIndicator style={{ marginTop: 150 }} size="large" color="#28af6b" />
                            </View>
                        )}
                </View>
            </ScrollView>
        );
    }
}

const { width } = Dimensions.get('window');
const height = width * 0.8;

const mapStateToProps = ({ persist }) => ({
    depot_current: persist.depot_current,
});

export default connect(mapStateToProps)(ItemGood);

const styles = StyleSheet.create({
    // container: {
    //     position: 'absolute',
    //     left: 0,
    //     right: 0,
    //     top: 0,
    //     bottom: 0,
    //     alignItems: 'center',
    //     justifyContent: 'center',
    //     backgroundColor: 'blue',
    // },
})