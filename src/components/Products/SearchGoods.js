import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button } from "react-native-elements";
import waterfall from 'async/waterfall';
import { View, ScrollView, Text, RefreshControl, TouchableOpacity, TextInput } from 'react-native';
import { product_api } from '../../services/api/fetch';
import NumberFormat from 'react-number-format';
import { goodsCss } from '../../styles/goods';
import NavigatorService from '../../services/NavigatorService';
import Icon from "react-native-vector-icons/Ionicons";

class SearchGoods extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            data: [],
            refreshing: false,
            value: '',
            itemId: null,
            txtName: '',
            txtSerial: '',
            txtDescription: '',
        };
    }

    componentDidMount() {
        const { navigation } = this.props;
        navigation.setParams({
            dispatch: this.submitSearch.bind(this)
        });
    }

    submitSearch() {
        const { depot_current } = this.props;
        const { txtName } = this.state;
        const params = {
            mtype: 'getAll',
            name: txtName,
            limit: 20,
            offset: 0,
            depot_id: parseFloat(depot_current),
        };
        console.log(params)
        product_api(params)
            .then((data) => {
                console.log(data)
                NavigatorService.navigate('Goods', {
                    searchData: data,
                });
                // this.setState({ data: data });
            });
    }

    _onRefresh = () => {
        this.setState({ refreshing: true });
        this.getList();
    }

    onShowBarcode = () => {
        this.props.navigation.navigate("ScannerBarcodeGood");
    }

    renderItem() {
        return (
            <View>
                <ScrollView>
                    <View>
                        <View>
                            <Text style={goodsCss.goods_search_title}>Theo</Text>
                        </View>
                        <View style={{paddingHorizontal:15}}>
                            <View style={goodsCss.goods_search_input}>
                                <TextInput
                                    style={{ height: 40,maxWidth:300 }}
                                    placeholder="Tên hoặc mã hàng"
                                    onChangeText={(txtName) => this.setState({ txtName })}
                                    value={this.state.txtName}
                                />
                                <TouchableOpacity>
                                    <Icon
                                        name="ios-barcode"
                                        size={30}
                                        color="red"
                                        onPress={this.onShowBarcode}
                                    />
                                </TouchableOpacity>
                            </View>
                            <View style={goodsCss.goods_search_input}>
                                <TextInput
                                    style={{ height: 40,maxWidth:300 }}
                                    placeholder="Serial/IMEI"
                                    onChangeText={(txtSerial) => this.setState({ txtSerial })}
                                    value={this.state.txtSerial}
                                />
                                <TouchableOpacity>
                                    <Icon
                                        name="ios-barcode"
                                        size={30}
                                        color="red"
                                        onPress={this.onShowBarcode}
                                    />
                                </TouchableOpacity>
                            </View>
                            <View style={goodsCss.goods_search_input}>
                                <TextInput
                                    style={{ height: 70 }}
                                    placeholder="Mô tả, ghi chú đặt hàng"
                                    onChangeText={(txtDescription) => this.setState({ txtDescription })}
                                    value={this.state.txtDescription}
                                />
                            </View>
                        </View>
                    </View>
                    <View>
                        <View>
                            <Text style={goodsCss.goods_search_title}>Loại hàng hóa</Text>
                        </View>
                        <View style={{paddingHorizontal:15}}>
                            <View style={{flexDirection:'row',flexWrap:'wrap',backgroundColor:'#f5f5f5',borderWidth:1,borderColor:'#eaeaea',padding:15}}>
                                <Button
                                    title="Hàng hóa thường"
                                    buttonStyle={{marginRight:7,marginBottom:7}}
                                    titleStyle={{fontSize:13}}
                                />
                                <Button
                                    title="Hàng hóa - serial/EMEI"
                                    buttonStyle={{marginRight:7,marginBottom:7}}
                                    titleStyle={{fontSize:13}}    
                                />                           
                                <Button
                                    title="Còn hàng trong kho"
                                    buttonStyle={{marginRight:7}} 
                                    titleStyle={{fontSize:13}}        
                                />
                                <Button
                                    title="Hết hàng trong kho"
                                    buttonStyle={{marginRight:7}}
                                    titleStyle={{fontSize:13}}
                                />
                            </View>
                        </View>
                    </View>
                    <View>
                        <View>
                            <Text style={goodsCss.goods_search_title}>Tồn kho</Text>
                        </View>
                        <View style={{paddingHorizontal:15}}>
                            <View style={{flexDirection:'row',flexWrap:'wrap',backgroundColor:'#f5f5f5',borderWidth:1,borderColor:'#eaeaea',padding:15}}>
                                <Button
                                    title="Dưới định mức tồn"
                                    buttonStyle={{marginRight:7,marginBottom:7}}
                                    titleStyle={{fontSize:13}}
                                />
                                <Button
                                    title="Vượt định mức tồn"
                                    buttonStyle={{marginRight:7,marginBottom:7}}
                                    titleStyle={{fontSize:13}}    
                                />                           
                                <Button
                                    title="Dịch vụ"
                                    buttonStyle={{marginRight:7}} 
                                    titleStyle={{fontSize:13}}        
                                />
                                <Button
                                    title="Combo đóng gói"
                                    buttonStyle={{marginRight:7}}
                                    titleStyle={{fontSize:13}}
                                />
                            </View>
                        </View>
                    </View>
                    <View>
                        <View>
                            <Text style={goodsCss.goods_search_title}>Thuộc tính</Text>
                        </View>
                        <View style={{paddingHorizontal:15}}>
                            <View style={{flexDirection:'row',flexWrap:'wrap',backgroundColor:'#f5f5f5',borderWidth:1,borderColor:'#eaeaea',padding:15}}>
                                <Button
                                    title="Tất cả"
                                    buttonStyle={{marginRight:7}}
                                    titleStyle={{fontSize:13}}
                                    type="outline"
                                />
                            </View>
                        </View>
                    </View>
                    <View>
                        <View>
                            <Text style={goodsCss.goods_search_title}>Chọn nhóm hàng</Text>
                        </View>
                        <View style={{paddingHorizontal:15}}>
                            <View style={{flexDirection:'row',flexWrap:'wrap',backgroundColor:'#f5f5f5',borderWidth:1,borderColor:'#eaeaea',padding:15}}>
                                <Button
                                    title="Tất cả"
                                    buttonStyle={{marginRight:7}}
                                    titleStyle={{fontSize:13}}
                                    type="outline"
                                />
                            </View>
                        </View>
                    </View>
                    <View>
                        <View>
                            <Text style={goodsCss.goods_search_title}>Chọn vị trí</Text>
                        </View>
                        <View style={{paddingHorizontal:15}}>
                            <View style={{flexDirection:'row',flexWrap:'wrap',backgroundColor:'#f5f5f5',borderWidth:1,borderColor:'#eaeaea',padding:15}}>
                                <Button
                                    title="Tất cả"
                                    buttonStyle={{marginRight:7}}
                                    titleStyle={{fontSize:13}}
                                    type="outline"
                                />
                            </View>
                        </View>
                    </View>
                    <View>
                        <View>
                            <Text style={goodsCss.goods_search_title}>Lựa chọn hiển thị</Text>
                        </View>
                        <View style={{paddingHorizontal:15}}>
                            <View style={{flexDirection:'row',flexWrap:'wrap',backgroundColor:'#f5f5f5',borderWidth:1,borderColor:'#eaeaea',padding:15}}>
                                <Button
                                    title="Tất cả"
                                    buttonStyle={{marginRight:7,marginBottom:7}}
                                    titleStyle={{fontSize:13}}
                                    type="outline"
                                />
                                <Button
                                    title="Hàng ngừng kinh doanh"
                                    buttonStyle={{marginRight:7,marginBottom:7}}
                                    titleStyle={{fontSize:13}}
                                    type="outline"
                                />
                                <Button
                                    title="Hàng đang kinh doanh"
                                    buttonStyle={{marginRight:7}}
                                    titleStyle={{fontSize:13}}
                                />
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </View>
        )
    }


    render() {
        return (
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this._onRefresh}
                    />
                }>
                <View>
                    {this.renderItem()}
                </View>
            </ScrollView>
        );
    }
}

const mapStateToProps = ({ persist }) => ({
    depot_current: persist.depot_current,
});

export default connect(mapStateToProps)(SearchGoods);
