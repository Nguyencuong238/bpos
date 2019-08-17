import qs from 'qs';
import React, {Component} from 'react';
import { ScrollView,  Text,View, Button,Picker,FlatList} from 'react-native';
import axios from 'axios';
import { isEmpty, debounce, reduce as _reduce,reduce,sumBy,isNumber } from 'lodash';
import { stock_api,purchase_order_api } from '../../services/api/fetch'
import { goodsCss } from '../../styles/goods';
import { DataTable } from 'react-native-paper';
import { Main } from '../../styles/main';

class StockScreenDetail extends Component{
    constructor(props) {
        super(props);
        this.state = {
            order_info :null,
            total:'',
        };
    }

    static navigationOptions = {
        // headerTitle: <LogoTitle />,
        headerRight: (
          <Button
            onPress={() => alert('This is a button!')}
            title="Info"
            color="#fff"
          />
        ),
    };

    componentDidMount() {
        this.getlistProduct();
        // this.loadPrint();
    }

    getlistProduct = async () => {
        const { navigation } = this.props;
        const itemId = navigation.getParam('itemId','xxxx');
        const params = {
            mtype: 'getProductByOrder',
            id: itemId.id,
            limit:100,
            offset:0,
        };
        // try {
        //     const res = await axios('https://wdevapi.bpos.vn/api/pos/purchase-order', {
        //         method: 'post',
        //         headers: {
        //             authcode: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE1NjE5NjQxMjQsImV4cCI6MTU5MzU4NjUyNCwidWlkIjoxLCJhdXRoX2NvZGUiOiJmZjNjMWUxODBiNTIzNjQxZGQxODIyYWY1YmYwZjk4MyIsIm5vZGVfaWQiOjMwMSwiY2xhaW1zIjp7Im5vZGVfaWQiOiIzMDEifX0.X0HrLbSaWKa5BZGyyTJVreDf2wr12AHQYGJic0jIdJECS7Egm0-a6Nd07koiMNrAXR4NvAJEUn4DLYo2c0aNiLCsKfIZyBHsVmOMylogJoYZUeqhXh8nTgWrpsKkK_R_nJY7_IOr1dtNSZ-wEWGtUaIfBBgYMfsxtRqhA6OmFEO-iSmAscPx9t8jUWQcvmo9uw-wjvV-nGke8bIUZB7yT4W8IsOENrRIOAtXBegu8I4V72cl2TcSqhraOT2D97L2EilSj5TeuXat9QZjr3NQfbHLESVFmqFaNn_Zl7NWzXKQv9MCLFh9WcRyQM41_ajtAA8DKo5GUo_aNMHGR-MR1Q',
        //         },
        //         data: qs.stringify(params),
        //     });
        //     //console.log(res.data.data.order_info);
        //     this.setState({ order_info: res.data.data.order_info});
        // } catch (error) {
        // }

        purchase_order_api(params).then((data) => {
            this.setState({ order_info: data.order_info,});
        })
    }

    // _renderItem = (item,index) => {
    //     const number_unmatch = parseFloat(item.quantity, 10) - parseFloat(item.quantity_before, 10);
    //     const price_unmatch = number_unmatch * parseFloat(item.price_market, 10);
    //     // console.log(item);
    //     return (
    //         <View style={{height: 50, backgroundColor: 'steelblue'}} >
    //             <View style={{flex: 1, flexDirection: 'row'}}>
    //                 <View style={{width: 80}} >
    //                     <Text>{item.barcode}</Text>
    //                 </View>
    //                 <View style={{width: 80}} >
    //                     <Text>{item.name}</Text>
    //                 </View>
    //                 <View style={{width: 80}} >
    //                     <Text>{parseInt(item.quantity_before)}</Text>
    //                 </View>
    //                 <View style={{width: 80}} >
    //                     <Text>{parseInt(item.quantity)}</Text>
    //                 </View>
    //                 <View style={{width: 80}} >
    //                     <Text>{number_unmatch}</Text>
    //                 </View>
    //             </View>
    //         </View>     
    //     );
    // };

    _renderItem = (item) => {
        if(!isEmpty(item)){
            const htm = item.map((v, k) => {
                const number_unmatch = parseFloat(v.quantity, 10) - parseFloat(v.quantity_before, 10);
                const price_unmatch = number_unmatch * parseFloat(v.price_market, 10);
                return (
                    <DataTable.Row>
                        <DataTable.Cell>{v.barcode}</DataTable.Cell>
                        <DataTable.Cell numeric>{v.name}</DataTable.Cell>
                        <DataTable.Cell numeric>{parseInt(v.quantity_before)}</DataTable.Cell>
                        <DataTable.Cell numeric>{parseInt(v.quantity)}</DataTable.Cell>
                        <DataTable.Cell numeric>{number_unmatch}</DataTable.Cell>
                    </DataTable.Row>
                );
            });
            return htm;
        }
        
    };

    render() {
        const { navigation } = this.props;
        const { order_info } = this.state;
        const itemId = navigation.getParam('itemId','xxxxx');
        let products=''
        if(!isEmpty(order_info)){
            products = order_info.products;
        }
        return (
            <ScrollView>
                <View>
                    <View>
                        <View style={goodsCss.goods_details_list}>
                            <View style={{ flex: 50 }}>
                                <Text> Mã chuyển hàng :</Text>
                            </View>
                            <View style={{ flex: 50 }}>
                                <Text style={{ fontWeight: '600' }}>{itemId.invoice}</Text>
                            </View>
                        </View>
                        <View style={goodsCss.goods_details_list}>
                            <View style={{ flex: 50 }}>
                                <Text> Người cân bằng :</Text>
                            </View>
                            <View style={{ flex: 50 }}>
                                <Text style={{ fontWeight: '600' }}>{itemId.user.full_name}</Text>
                            </View>
                        </View>
                        <View style={goodsCss.goods_details_list}>
                            <View style={{ flex: 50 }}>
                                <Text> Thời gian :</Text>
                            </View>
                            <View style={{ flex: 50 }}>
                                <Text>{itemId.created_at}</Text>
                            </View>
                        </View>
                        <View style={goodsCss.goods_details_list}>
                            <View style={{ flex: 50 }}>
                                <Text>Người tạo : </Text>
                            </View>
                            <View style={{ flex: 50 }}>
                                <Text style={{ fontWeight: '600' }}>{itemId.user.full_name}</Text>
                            </View>
                        </View>
                        <View style={goodsCss.goods_details_list}>
                            <View style={{ flex: 50 }}>
                                <Text>Ngày cân bằng :</Text>
                            </View>
                            <View style={{ flex: 50 }}>
                                <Text>{itemId.create_time}</Text>
                            </View>
                        </View>
                        <View style={goodsCss.goods_details_list}>
                            <View style={{ flex: 50 }}>
                                <Text>Ghi chú:</Text>
                            </View>
                            <View style={{ flex: 50 }}>
                                <Text>{itemId.note_order}</Text>
                            </View>
                        </View>
                    </View>
                    {/* { order_info != null
                        &&(
                            <View>
                                <FlatList
                                    data={order_info.products}
                                    renderItem={({item, index})=>{
                                        return( this._renderItem(item, index));
                                    }}
                                >
                                </FlatList>
                            </View>
                        )
                    } */}
                    <DataTable style={{marginTop:0}}>
                        <DataTable.Header style={{backgroundColor:'#28af6b'}}>
                        <DataTable.Title style={Main.dataTable_title}><Text style={Main.dataTable_title}>Mã hàng</Text></DataTable.Title>
                        <DataTable.Title numeric style={Main.dataTable_title}><Text style={Main.dataTable_title}>Tên hàng</Text></DataTable.Title>
                        <DataTable.Title numeric style={Main.dataTable_title}><Text style={Main.dataTable_title}>Tồn kho</Text></DataTable.Title>
                        <DataTable.Title numeric style={Main.dataTable_title}><Text style={Main.dataTable_title}>Thực tế</Text></DataTable.Title>
                        <DataTable.Title numeric style={Main.dataTable_title}><Text style={Main.dataTable_title}>SL lệch</Text></DataTable.Title>
                        </DataTable.Header>
                        { order_info != null
                            &&(
                                <View>
                                    {this._renderItem(order_info.products)}
                                </View>
                            )
                        }
                        <DataTable.Pagination
                        page={1}
                        numberOfPages={3}
                        onPageChange={(page) => { console.log(page); }}
                        label="1-2 of 6"
                        />
                    </DataTable>
                </View>
        
            </ScrollView>
        );
    }
}

export default StockScreenDetail;

StockScreenDetail.navigationOptions = {
    title: 'Kiểm kho',
    drawerLabel: () => null,
};


