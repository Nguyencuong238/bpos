import React, { Component } from 'react';
import { Text, View, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView, RefreshControl } from 'react-native';
import moment from 'moment';
import { isEmpty } from 'lodash';
import { standard_test_api,report_api } from '../../services/api/fetch';
import NumberFormat from 'react-number-format';
export default class List_Product extends Component {
    constructor(props) {
        super(props)
        this.state = {
            refreshing: false,
            count_bill: 0,
            date: moment(props.navigation.state.params.date, 'DD/MM/YYYY').format('YYYY-MM-DD'),
            type: props.navigation.state.params.type,
        }
    }

    componentDidMount() {
        this.getData();
    }

    getData() {
        const { type } = this.state;
        const { navigation } = this.props;
        const datet = navigation.getParam('datet');
        const datef = navigation.getParam('datef');
        this.setState({ refreshing: true }, () => {
            report_api({ mtype: 'reportProduct', datef, datet, depot_id: 1,is_mobile:1 }).then((data) => {
                let listProduct = [];
                if(!isEmpty(data)){
                    Object.values(data).forEach((v,k) => {
                        if(type==='TH'){
                            if(v.th_soluong !== 0){
                                listProduct.push(v)
                            }
                        }else{
                            if(v.hd_soluong !== 0){
                                listProduct.push(v)
                            }
                        }
                    });
                }
                this.setState({ data:listProduct, count_bill: listProduct.length, refreshing: false });
            }) ;
        });
    }
    render() {
        const { refreshing, count_bill, data,type } = this.state;
        const { navigation } = this.props;
        const { tottalProduct } = navigation.state.params;
        return (
            <View style={styles.container}>
                <View>
                    <Text style={{ marginBottom: 10, paddingLeft: 10, paddingRight: 10 }}>Tổng số {count_bill} sản phẩm</Text>
                    <ScrollView>
                        <FlatList
                            refreshing={refreshing}
                            onRefresh={() => this.getData()}
                            data={data}
                            ItemSeparatorComponent={() => <View style={{ height: 1, width: "100%", backgroundColor: "#eee", paddingLeft: 10, paddingRight: 10 }} />}
                            renderItem={({ item, index }) => (
                                <TouchableOpacity
                                    key={index}
                                    style={{ paddingLeft: 10, paddingRight: 10 }}
                                >
                                    <View style={styles.flatlist}>
                                        <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                                            <Text style={{ flex: 1, fontWeight: 'bold' }}>{item.fullname}</Text>
                                            {type ==='TH'
                                                &&(
                                                    <Text style={{ flex: 1, textAlign: 'right' }}>{item.th_soluong}</Text>
                                                )
                                            }
                                            {type !=='TH'
                                                &&(
                                                    <Text style={{ flex: 1, textAlign: 'right' }}>{item.hd_soluong}</Text>
                                                )
                                            } 
                                        </View>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={{ flex: 1,textAlign: 'right', fontWeight: 'bold' }}>
                                                Mã SKU: {item.sku}
                                            </Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            )}
                        />
                    </ScrollView>
                </View>
                <View style={styles.net_revenue}>
                    <Text style={{ color: '#fff' }}>Tổng số lượng </Text>
                    <Text style={{ color: '#fff', fontSize: 16 }}>{tottalProduct}</Text>
                </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 10,
    },
    flatlist: {
        paddingTop: 10,
        paddingBottom: 10,
    },
    net_revenue: {
        position: 'absolute',
        bottom: 0,
        backgroundColor: '#229c5e',
        color: '#fff',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingTop: 10,
        paddingBottom: 10,
        paddingRight: 10,
        width: '100%',
        alignItems: 'center',
    }
});