import React, { Component } from 'react';
import { Text, View, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import moment from 'moment';
import { sumBy, isEmpty } from 'lodash';
import NumberFormat from 'react-number-format';
import { report_api } from '../../services/api/fetch';

export default class RevenueDetail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            refreshing: false,
            revenue:0,
            return_value: 0,
            net_revenue: 0,
        }
    }

    componentDidMount() {
        this.getData();
    }

    getData() {
        const { datef, datet, depot_id } = this.props.navigation.state.params;
        const { navigation } = this.props;
        this.setState({ refreshing: true }, () => {
            report_api({ mtype: 'reportOrder', datef, datet, depot_id, is_mobile: 1 }).then((response) => {
                let type  = navigation.getParam('type');
                const data = Object.values(response);
                if(type !=='TH'){
                    let revenue1 = sumBy(data, (o) => (parseInt(o.tong_banhang) - parseInt(o.tong_chietkhau) - parseInt(o.tong_diem_amount)+ parseInt(o.tong_vat)+parseInt(o.tong_phikhac)));
                    let return_value1 = sumBy(data, (o) => parseInt(o.tong_vat)+parseInt(o.tong_phikhac));
                    let net_revenue1 = parseInt(revenue1) -parseInt(return_value1);
                    this.setState({ data, refreshing: false,net_revenue:net_revenue1,revenue:revenue1,return_value:return_value1 });
                }else{
                    let revenue1 = sumBy(data, (o) => (parseInt(o.tong_th) -parseInt(o.tong_th_chietkhau) - parseInt(o.tong_th_diem_amount)+parseInt(o.tong_th_vat)+parseInt(o.tong_th_phikhac)));
                    let return_value1 = sumBy(data, (o) => parseInt(o.tong_th_vat)+parseInt(o.tong_th_phikhac));
                    let net_revenue1 =parseInt(revenue1) -parseInt(return_value1);
                    this.setState({ data, refreshing: false,net_revenue:net_revenue1,revenue:revenue1,return_value:return_value1 });
                }
            });
        });
    }

    render() {
        const { refreshing, data,revenue,return_value,net_revenue } = this.state; 
        const { navigation } = this.props;
        let type  = navigation.getParam('type');
        return (
            <View style={styles.container}>
                <View style={styles.thead}>
                    <View style={{ flex: 1.5, flexDirection: 'column', borderRightColor: '#eee', borderRightWidth: 1 }}>
                        {type ==='TH'
                        &&(
                            <Text style={styles.th}>Tổng tiền hàng trả</Text>
                        )}
                        {type !=='TH'
                        &&(
                            <Text style={styles.th}>Tổng doanh thu</Text>
                        )}
                        
                        <Text style={styles.th}>
                            <NumberFormat
                                thousandSeparator={'.'}
                                decimalSeparator={','}
                                value={parseInt(revenue)}
                                displayType={'text'}
                                renderText={value => <Text>{value}</Text>}
                            />
                        </Text>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'column', borderRightColor: '#eee', borderRightWidth: 1 }}>
                        <Text style={styles.th}>Thu khác</Text>
                        <Text style={styles.th}>
                            <NumberFormat
                                thousandSeparator={'.'}
                                decimalSeparator={','}
                                value={parseInt(return_value)}
                                displayType={'text'}
                                renderText={value => <Text>{value}</Text>}
                            />
                        </Text>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'column' }}>
                       
                        {type ==='TH'
                        &&(
                            <Text style={styles.th}>Thực trả</Text>
                        )}
                        {type !=='TH'
                        &&(
                            <Text style={{ textAlign: 'right' }}>DT thuần</Text>
                        )}
                        <Text style={{ textAlign: 'right' }}>
                            <NumberFormat
                                thousandSeparator={'.'}
                                decimalSeparator={','}
                                value={parseInt(net_revenue)}
                                displayType={'text'}
                                renderText={value => <Text>{value}</Text>}
                            />
                        </Text>
                    </View>
                </View>
                {type ==='TH'
                    &&(
                        <FlatList
                    refreshing={refreshing}
                    onRefresh={() => this.getData()}
                    data={data}
                    ItemSeparatorComponent={() => <View style={{ height: 1, width: "100%", backgroundColor: "#eee", }} />}
                    renderItem={({ item, index }) => (
                        <TouchableOpacity
                            onPress={() => this.props.navigation.navigate('List_Bill', {
                                // net_revenue: item.doanhthu_thuan,
                                net_revenue,
                                date: item.date,
                                type:'TH'
                            })}
                        >
                            <View style={styles.tbody}>
                                <View style={{ flex: 0.5 }}>
                                    <Text style={{ color: 'green' }}>{moment(item.date, 'DD/MM/YYYY').format('DD/MM')}</Text>
                                    <Text>{moment(item.date, 'DD/MM/YYYY').format('YYYY')}</Text>
                                </View>
                                <Text style={styles.td}>
                                    <NumberFormat
                                        thousandSeparator={'.'}
                                        decimalSeparator={','}
                                        value={parseInt(item.tong_th) -parseInt(item.tong_th_chietkhau) - parseInt(item.tong_th_diem_amount)+parseInt(item.tong_th_vat)+parseInt(item.tong_th_phikhac)}
                                        displayType={'text'}
                                        renderText={value => <Text>{value}</Text>}
                                    />
                                </Text>
                                <Text style={styles.td}>
                                    <NumberFormat
                                        thousandSeparator={'.'}
                                        decimalSeparator={','}
                                        value={parseInt(item.tong_th_vat)+parseInt(item.tong_th_phikhac)}
                                        displayType={'text'}
                                        renderText={value => <Text>{value}</Text>}
                                    />
                                </Text>
                                <Text style={styles.td}>
                                    <NumberFormat
                                        thousandSeparator={'.'}
                                        decimalSeparator={','}
                                        value={parseInt(item.tong_th) -parseInt(item.tong_th_chietkhau) - parseInt(item.tong_th_diem_amount)}
                                        displayType={'text'}
                                        renderText={value => <Text>{value}</Text>}
                                    />
                                </Text>
                            </View>
                        </TouchableOpacity>
                    )}
                />

                )}
                {type !=='TH'
                    &&(
                        <FlatList
                    refreshing={refreshing}
                    onRefresh={() => this.getData()}
                    data={data}
                    ItemSeparatorComponent={() => <View style={{ height: 1, width: "100%", backgroundColor: "#eee", }} />}
                    renderItem={({ item, index }) => (
                        <TouchableOpacity
                            onPress={() => this.props.navigation.navigate('List_Bill', {
                                // net_revenue: item.doanhthu_thuan,
                                net_revenue,
                                date: item.date,
                            })}
                        >
                            <View style={styles.tbody}>
                                <View style={{ flex: 0.5 }}>
                                    <Text style={{ color: 'green' }}>{moment(item.date, 'DD/MM/YYYY').format('DD/MM')}</Text>
                                    <Text>{moment(item.date, 'DD/MM/YYYY').format('YYYY')}</Text>
                                </View>
                                <Text style={styles.td}>
                                    <NumberFormat
                                        thousandSeparator={'.'}
                                        decimalSeparator={','}
                                        value={parseInt(item.tong_banhang) - parseInt(item.tong_chietkhau) - parseInt(item.tong_diem_amount)+ parseInt(item.tong_vat)+parseInt(item.tong_phikhac)}
                                        displayType={'text'}
                                        renderText={value => <Text>{value}</Text>}
                                    />
                                </Text>
                                <Text style={styles.td}>
                                    <NumberFormat
                                        thousandSeparator={'.'}
                                        decimalSeparator={','}
                                        value={parseInt(item.tong_vat)+parseInt(item.tong_phikhac)}
                                        displayType={'text'}
                                        renderText={value => <Text>{value}</Text>}
                                    />
                                </Text>
                                <Text style={styles.td}>
                                    <NumberFormat
                                        thousandSeparator={'.'}
                                        decimalSeparator={','}
                                        value={parseInt(item.tong_banhang) - parseInt(item.tong_chietkhau) - parseInt(item.tong_diem_amount)}
                                        displayType={'text'}
                                        renderText={value => <Text>{value}</Text>}
                                    />
                                </Text>
                            </View>
                        </TouchableOpacity>
                    )}
                />

                )}
            
                
                
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 10
    },
    thead: {
        flexDirection: 'row',
        marginLeft: 20,
        marginRight: 20,
        marginBottom: 10,
        marginTop: 0,
        alignItems: 'center'
    },
    th: {
        textAlign: 'right',
        marginRight: 10,
    },
    tbody: {
        flexDirection: 'row',
        margin: 20,
        alignItems: 'center'
    },
    td: {
        flex: 1,
        textAlign: 'right',
    }
});