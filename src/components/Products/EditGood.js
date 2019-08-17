import React, { Component } from 'react';
import { connect } from 'react-redux';
import { isEmpty, filter, find, split, forEach } from 'lodash';
import waterfall from 'async/waterfall';
import { Button } from "react-native-elements"
import { View, ScrollView, Text, TextInput, Image, RefreshControl, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { product_api, productCategory_api, upload_api } from '../../services/api/fetch';
import NumberFormat from 'react-number-format';
import { goodsCss } from '../../styles/goods';
import { Main } from '../../styles/main';
import NavigatorService from '../../services/NavigatorService';
import { showMessage } from "react-native-flash-message";
import Icon from "react-native-vector-icons/Ionicons";
import * as ImagePicker from 'expo-image-picker'
import * as Permissions from 'expo-permissions';
import MultiSelect from '../library/MultiSelect/react-native-multi-select';
import { R_FORM_PRODUCT } from '../../reducers/actions';
import uid from 'uuid/v4';

class EditGood extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            data: [],
            refreshing: false,
            value: '',
            itemId: null,
            txtName: '',
            txtSku: '',
            txtBarcode: '',
            txtPrice: '',
            txtPriceMarket: '',
            txtQuantity: '',
            txtInventoryMax: '',
            txtInventoryMin: '',
            avatar: [],
            category: '',
            category_id: '',
            photo: '',
            imageBrowserOpen: false,
            photos: [],
            selectedItems: [],
            categoryArr: [],
        };
    }

    async componentDidMount() {
        await this.getListCategory();
        this.setState({loading: true});
        await this.getList();
        const { navigation } = this.props;
        navigation.setParams({
            dispatch: this.submitForm.bind(this)
        });
    }

    getListCategory() {
        productCategory_api({ mtype: 'getAll' }).then(({ category }) => {
            if (category) {
                const options = [];
                forEach(category, (v, k) => {
                    const tmp = {
                        id: v.id,
                        name: v.name
                    }
                    options.push(tmp);
                })
                this.setState({ category, categoryArr: options });
            };
        })
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
                this.renderList(data);
                this.setState({ data: data, refreshing: false, loading: false })
            });
    }

    renderList(data) {
        const { product_info } = data;
        const { selectedItems } = this.state;
        if (!isEmpty(product_info)) {
            selectedItems.push(parseInt(product_info.category_id));
            this.setState({
                txtName: product_info.properties[0].name,
                txtSku: product_info.properties[0].sku,
                txtBarcode: product_info.properties[0].barcode,
                txtPrice: product_info.properties[0].price.toString(),
                txtPriceMarket: product_info.properties[0].price_market.toString(),
                txtQuantity: product_info.properties[0].quantity.toString(),
                txtInventoryMax: product_info.inventory_max,
                txtInventoryMin: product_info.inventory_min,
                avatar: product_info.images,
                selectedItems,
            });
        }
    }

    _onRefresh = () => {
        this.setState({ refreshing: true });
        this.getListCategory();
        this.getList();
    }

    askPermissionsAsync = async () => {
        await Permissions.askAsync(Permissions.CAMERA);
        await Permissions.askAsync(Permissions.CAMERA_ROLL);
    };

    _pickImage = async () => {
        const { avatar } = this.state;
        await this.askPermissionsAsync();
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
        });
        if (!result.cancelled) {
            const file = {
                uri: result.uri,
                name: uid() + '.jpg',
                type: 'image/jpg'
            }
            const body = new FormData()
            body.append('mtype', 'upload');
            body.append('file_upload', file)
            upload_api(body).then((data) => {
                if (data) {
                    if (data.status === true) {
                        const tmp = {
                            url: data.message,
                            avatar: 0,
                        };
                        avatar.push(tmp);
                        this.setState({ avatar });
                    } else {
                        showMessage({
                            message: "Lỗi không tải được ảnh",
                            description: "",
                            type: "danger",
                        });
                    }
                } else {
                    showMessage({
                        message: "Dung lượng ảnh quá lớn",
                        description: "",
                        type: "danger",
                    });
                }
            });
        }
    };

    onSelectedItemsChange = (selectedItems) => {
        this.setState({ selectedItems });
    };

    submitForm(key = false) {
        const { selectedItems, photos, data, txtName, txtSku, txtBarcode, txtPrice, txtPriceMarket, txtQuantity, txtInventoryMax, txtInventoryMin, category, avatar } = this.state;
        const { depot_current, navigation } = this.props;
        const { str_id } = find(category, (o) => (o.id === parseInt(selectedItems[0]) || ''));
        const str_ids = filter(split(str_id, '|'), (o) => !isEmpty(o));
        str_ids.push(selectedItems[0]);
        const itemId = navigation.getParam('itemId');

        //Bắt đầu validate
        waterfall([
            (callback) => {
                if (txtName.length >= 1) {
                    callback(null, 'next');
                } else {
                    showMessage({
                        message: "Tên sản phẩm không được để trống.",
                        description: "",
                        type: "danger",
                    });
                }
            },
            (next, callback) => {
                if (txtPrice >= 1) {
                    callback(null, 'next');
                } else {
                    showMessage({
                        message: "Giá sản phẩm không được để trống.",
                        description: "",
                        type: "danger",
                    });
                }
            },
            (next, callback) => {
                if (txtQuantity >= 0) {
                    callback(null, 'next');
                } else {
                    showMessage({
                        message: "Số lượng sản phẩm phải lớn hơn 0",
                        description: "",
                        type: "danger",
                    });
                }
            },
        ], () => {
            const params = {
                mtype: 'create_edit',
                product_id: itemId,
                name: txtName,
                sku: txtSku,
                barcode: txtBarcode,
                inventory_min: !isEmpty(txtInventoryMin) ? txtInventoryMin : 0.00,
                inventory_max: !isEmpty(txtInventoryMax) ? txtInventoryMax : 0.0,
                // status: 1,
                product_category: str_ids,
                depot_id: depot_current,
                quantity: txtQuantity,
                price: txtPrice,
                price_market: txtPriceMarket,
                depot_id: parseFloat(depot_current),
                product_image: avatar,
                key,
            };
            this.editTest(params);
        }
        );
    }

    editTest(params) {
        product_api(params).then((data) => {
            this.setState({ loading: false });
            if (data.status === true) {
                showMessage({
                    message: "Cập nhật thành công.",
                    description: "",
                    type: "success",
                });
                !params.key ? NavigatorService.navigate('Goods') : NavigatorService.navigate('itemGood');
            } else {
                showMessage({
                    message: "Cập nhật không thành công thành công.",
                    description: "",
                    type: "warning",
                });
            }
        });
    }

    handleInputChange = (type, e) => {
        if (type === 'price') {
            if (/^\d+$/.test(e) || e === '') {
                this.setState({
                    txtPrice: e
                });
            }
        } else if (type === 'quantity') {
            if (/^\d+$/.test(e) || e === '') {
                this.setState({
                    txtQuantity: e
                });
            }
        }
    }

    renderImage(avatar) {
        const options = [];
        avatar.map((v) => options.push(v.url));
        const htm = options.map((v, k) => {
            const num = k + 1;
            return (
                <View style={Main.col_3}>
                    <View style={{ borderColor: '#ddd', borderWidth: 1, height: 100,width:'100%',borderRadius: 4 }}>
                        <Image
                            key={num}
                            style={{ width: '100%', height: '100%', resizeMode: 'cover', borderRadius: 4 }}
                            source={{ uri: `https:${v}` }}
                        />
                        <View style={{ position: 'absolute', top: -12, right: -10, zIndex: 1000 }}>
                            <Icon
                                // onPress={() => this.removeItem(k)}
                                onPress={() => Alert.alert(
                                    'Xóa',
                                    'Bạn chắc chắn muốn xóa hình ảnh này',
                                    [
                                        { text: 'Hủy', onPress: () => console.log('Cancel Pressed!') },
                                        { text: 'Đồng ý', onPress: () => this.removeItem(k) },
                                    ],
                                    { cancelable: false }
                                )}
                                name="ios-close-circle"
                                size={30}
                                color="#000"
                            />
                        </View>
                    </View>
                </View>
            );
        });
        return htm;
    }

    async removeItem(key) {
        const { avatar } = this.state;
        if (!isNaN(key)) {
            avatar.splice(key, 1);
            await this.setState({ avatar });
        }
    }

    renderItem() {
        const { selectedItems, categoryArr, avatar, product_info } = this.state;
        return (
            <View>
                <View>
                    <View>
                        {!isEmpty(avatar) ? (
                            // <ScrollView
                            //     horizontal
                            //     pagingEnabled
                            //     showsHorizontalScrollIndicator={true}
                            //     style={{backgroundColor:'red'}}
                            // >
                            //     {this.renderImage(avatar)}
                            // </ScrollView>
                            <View style={{flex:1,padding:15,paddingBottom:0}}>
                                <View style={Main.row}>
                                    {this.renderImage(avatar)}
                                </View>
                            </View>
                        ) : (
                            <View style={{flex:1,padding:15}}>
                                <View style={Main.row}>
                                    <View style={Main.col_6}>
                                        <View style={{ borderColor: '#ddd', borderWidth: 1, height: 100,width:'100%',borderRadius: 4 }}>
                                            <Image
                                                style={{ width: '100%', height: '100%', resizeMode:'cover',borderRadius: 4 }}
                                                source={{ uri: 'https://c1.staticflickr.com/9/8112/8477434985_5f637b7d84_z.jpg' }}
                                            />
                                        </View>
                                    </View>
                                </View>
                            </View>    
                            )}
                        {
                            avatar.length < 4 && (
                                <View style={{flex:1,padding:15}}>
                                    <View style={Main.row}>
                                        <View style={Main.col_6}>
                                            <View style={{ borderColor: '#ddd', borderWidth: 1, height: 100,borderRadius: 4 }}>
                                                <Button
                                                    onPress={this._pickImage}
                                                    buttonStyle={{ backgroundColor: '#EE7C6B' }}
                                                     icon={
                                                        <Icon
                                                            name="md-images"     
                                                            size={80}
                                                            color="#fff"
                                                        />
                                                    }
                                                />
                                            </View>
                                        </View>
                                    </View>
                                </View> 
                            )
                        }
                    </View>
                </View>

                <View>
                    <View style={goodsCss.goods_details_list}>
                        <View style={{ flex: 50, alignSelf: 'center' }}>
                            <Text> Tên sản phẩm:</Text>
                        </View>
                        <View style={{ flex: 50 }}>
                            <TextInput
                                style={{ height: 40, backgroundColor: '#ddd', paddingHorizontal: 15, borderRadius: 3 }}
                                placeholder="Tên sản phẩm"
                                onChangeText={(txtName) => this.setState({ txtName })}
                                value={this.state.txtName}
                            />
                        </View>
                    </View>
                    <View style={goodsCss.goods_details_list}>
                        <View style={{ flex: 50, alignSelf: 'center' }}>
                            <Text> Danh mục sản phẩm:</Text>
                        </View>
                        <View style={{ flex: 50, alignSelf: 'center' }}>
                            <MultiSelect
                                single
                                items={categoryArr}
                                uniqueKey="id"
                                onSelectedItemsChange={this.onSelectedItemsChange}
                                selectedItems={selectedItems}
                                selectText="Chọn danh mục"
                                searchInputPlaceholderText="Tìm kiếm..."
                                // displayKey="name"
                                // submitButtonText="Xác nhận"
                                animationType='fade'
                                style={{ padding: 10, }}
                            />
                        </View>
                    </View>
                    <View style={goodsCss.goods_details_list}>
                        <View style={{ flex: 50, alignSelf: 'center' }}>
                            <Text> Mã SKU:</Text>
                        </View>
                        <View style={{ flex: 50 }}>
                            <TextInput
                                style={{ height: 40, backgroundColor: '#ddd', paddingHorizontal: 15, borderRadius: 3 }}
                                placeholder="Mã SKU"
                                onChangeText={(txtSku) => this.setState({ txtSku })}
                                value={this.state.txtSku}
                            />
                        </View>
                    </View>
                    <View style={goodsCss.goods_details_list}>
                        <View style={{ flex: 50, alignSelf: 'center' }}>
                            <Text> Mã barcode:</Text>
                        </View>
                        <View style={{ flex: 50 }}>
                            <TextInput
                                style={{ height: 40, backgroundColor: '#ddd', paddingHorizontal: 15, borderRadius: 3 }}
                                placeholder="Mã Barcode"
                                onChangeText={(txtBarcode) => this.setState({ txtBarcode })}
                                value={this.state.txtBarcode}
                            />
                        </View>
                    </View>
                    <View style={goodsCss.goods_details_list}>
                        <View style={{ flex: 50, alignSelf: 'center' }}>
                            <Text> Giá bán:</Text>
                        </View>
                        <View style={{ flex: 50 }}>
                            <TextInput
                                style={{ height: 40, backgroundColor: '#ddd', paddingHorizontal: 15, borderRadius: 3 }}
                                placeholder="Giá bán"
                                onChangeText={(e) => this.handleInputChange('price', e)}
                                value={this.state.txtPrice}
                            />
                        </View>
                    </View>
                    <View style={goodsCss.goods_details_list}>
                        <View style={{ flex: 50, alignSelf: 'center' }}>
                            <Text> Giá vốn:</Text>
                        </View>
                        <View style={{ flex: 50 }}>
                            <View {...product_info ? pointerEvents = "none" : ''}>
                                <TextInput
                                    style={{ height: 40, backgroundColor: '#ddd', paddingHorizontal: 15, borderRadius: 3 }}
                                    placeholder="Giá vốn"
                                    onChangeText={(txtPriceMarket) => this.setState({ txtPriceMarket })}
                                    value={this.state.txtPriceMarket}
                                />
                            </View>
                        </View>
                    </View>
                    <View style={goodsCss.goods_details_list}>
                        <View style={{ flex: 50, alignSelf: 'center' }}>
                            <Text>Tồn kho:</Text>
                        </View>
                        <View style={{ flex: 50 }}>
                            <TextInput
                                style={{ height: 40, backgroundColor: '#ddd', paddingHorizontal: 15, borderRadius: 3 }}
                                placeholder="Tồn kho"
                                onChangeText={(e) => this.handleInputChange('quantity', e)}
                                value={this.state.txtQuantity}
                            />
                        </View>
                    </View>
                    <View style={goodsCss.goods_details_list}>
                        <View style={{ flex: 50, alignSelf: 'center' }}>
                            <Text>  Tồn tối đa:</Text>
                        </View>
                        <View style={{ flex: 50 }}>
                            <TextInput
                                style={{ height: 40, backgroundColor: '#ddd', paddingHorizontal: 15, borderRadius: 3 }}
                                placeholder="Tồn tối đa"
                                onChangeText={(txtInventoryMax) => this.setState({ txtInventoryMax })}
                                value={this.state.txtInventoryMax}
                            />
                        </View>
                    </View>
                    <View style={goodsCss.goods_details_list}>
                        <View style={{ flex: 50, alignSelf: 'center' }}>
                            <Text>  Tồn tối thiểu:</Text>
                        </View>
                        <View style={{ flex: 50 }}>
                            <TextInput
                                style={{ height: 40, backgroundColor: '#ddd', paddingHorizontal: 15, borderRadius: 3 }}
                                placeholder="Tồn tối thiểu"
                                onChangeText={(txtInventoryMin) => this.setState({ txtInventoryMin })}
                                value={this.state.txtInventoryMin}
                            />
                        </View>
                    </View>
                </View>
            </View>
        )
    }


    render() {
        const { loading } = this.state;
        return (
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this._onRefresh}
                    />
                }>
                {
                    loading ?
                        <ActivityIndicator style={{ marginTop: 150 }} size="large" color="#28af6b" />
                        :
                        <View>
                            {this.renderItem()}
                        </View>
                }

            </ScrollView>
        );
    }
}

const mapStateToProps = ({ persist, state }) => ({
    depot_current: persist.depot_current,
    form_product: state.form_product,
});

export default connect(mapStateToProps)(EditGood);

