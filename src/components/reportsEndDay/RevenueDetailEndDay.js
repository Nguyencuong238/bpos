import React, { Component } from 'react';
import { Text, View, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import moment from 'moment';
// import { sumBy, isEmpty } from 'lodash';
import { sumBy,forEach, isEmpty, find } from 'lodash';
import NumberFormat from 'react-number-format';
import { reportdetail_api,purchase_order_api } from '../../services/api/fetch';

export default class RevenueDetailEndDay extends Component {
    constructor(props) {
        super(props)
        this.state = {
            refreshing: false,
            data:null,
            count_bill:0,
            total:0,
        }
    }

    componentDidMount() {
        this.getData();
    }
    
    getData() {
        const { datef, datet, depot_id } = this.props.navigation.state.params;
        this.setState({ refreshing: true }, () => {
            reportdetail_api({ mtype: 'reportCashFlowMobile', datef, datet, depot_id, is_mobile: 1 }).then((response) => {
                // if(!isEmpty(response.listOrders)){
                //     let total_get = 0;
                //     forEach(response.listOrders, (v) => {
                //         total_get= total_get+ parseInt(v.thu_tm + v.thu_ck - v.chi_tm - v.chi_ck)
                //     });
                //     this.setState({total:total_get})
                // }
                // this.setState({ data:response.listOrders, refreshing: false,count_bill: response.listOrders.length});
                if(!isEmpty(response)){
                    let total_get = 0;
                    forEach(response, (v) => {
                        total_get= total_get+ parseInt(v.thu_tm + v.thu_ck - v.chi_tm - v.chi_ck)
                    });
                    this.setState({total:total_get})
                }
                this.setState({ data:response, refreshing: false,count_bill: response.length});
            });
        });
    }

    renderType=(invoice)=>{
        if(invoice.indexOf("TT") !== -1){
            return 'Chi trả hóa đơn';
        } else if (invoice.indexOf("PT") !== -1){
            return 'Phiếu thu hóa đơn';
        } else if (invoice.indexOf("PC") !== -1){
            return 'Phiếu chi hóa đơn';
        }
    }

    render() {
        const { count_bill,refreshing,data,total} = this.state;
        return (
            <View style={styles.container}>
                <View>
                    <Text style={{ marginBottom: 10, paddingLeft: 10, paddingRight: 10 }}>Tổng số {count_bill} đơn</Text>
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
                                        <Text style={{ flex: 1, fontWeight: 'bold' }}>{this.renderType(item.invoice)}</Text>
                                        <Text style={{ textAlign: 'right', fontWeight: 'bold' }}>
                                            <NumberFormat
                                                thousandSeparator={'.'}
                                                decimalSeparator={','}
                                                // value={(parseInt(item.thu_tm + item.thu_ck - item.chi_tm - item.chi_ck)).toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")}
                                                value={(parseInt(item.thu_tm + item.thu_ck - item.chi_tm - item.chi_ck))}
                                                displayType={'text'}
                                                suffix={'đ'}
                                                renderText={value => <Text>{value}</Text>}
                                            />
                                        </Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                                        <Text style={{ fontWeight: 'bold' }}>{item.invoice}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', marginBottom: 59  }}>
                                        {/* <Text style={{ flex: 1, }}>{moment(item.date, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY HH:mm')}</Text> */}
                                        <Text style={{ flex: 1, }}>{item.date}</Text>
                                        <Text style={{ flex: 1, textAlign: 'right' }}>{item.name}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        )}
                    />
                </View>
                <View style={styles.net_revenue}>
                    <Text style={{ color: '#fff' }}>Doanh thu thuần: </Text>
                    <Text style={{ color: '#fff', fontSize: 16 }}>
                        <NumberFormat
                            thousandSeparator={'.'}
                            decimalSeparator={','}
                            // value={parseInt(net_revenue)}
                            value={total}
                            displayType={'text'}
                            suffix={'đ'}
                            renderText={value => <Text>{value}</Text>}
                        />
                    </Text>
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