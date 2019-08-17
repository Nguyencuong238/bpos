import React, { Component } from 'react';
import { Text, View, FlatList, TouchableOpacity, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import moment from 'moment';
import { filter } from 'lodash';
import NumberFormat from 'react-number-format';
import Icon from 'react-native-vector-icons/Ionicons';
import NavigatorService from '../../services/NavigatorService';

export default class BillDetail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            refreshing: true,
        }
    }

    componentDidMount() {
        setTimeout(() => this.setState({ refreshing: false }), 500);
    }

    onRefresh = () => {
        this.setState({ refreshing: true });
        setTimeout(() => this.setState({ refreshing: false }), 500)
    }

    render() {
        const { refreshing } = this.state;
        const { navigation } = this.props;
        const { data } = navigation.state.params;
        const discount = data.type === 'HD' ? (data.tong_chietkhau + data.tong_diem_amount) : (data.tong_th_chietkhau + data.tong_th_diem_amount);
        const total_price = data.type === 'HD' ? data.tong_banhang : data.tong_th;
        const products = filter(data.products, (o) => parseFloat(o.quantity) > 0);

        return (
            <ScrollView
                style={styles.container}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={this.onRefresh}
                    />
                }
            >
                {!refreshing && (
                    <View>
                        <View style={{ marginBottom: 20, backgroundColor: '#fff', padding: 10, paddingRight: 5 }}>
                            <View style={{ marginBottom: 10 }}>
                                <Text style={{ textAlign: 'right' }}>{data.type === 'HD' ? 'Hoàn thành' : 'Đã trả'}</Text>
                            </View>

                            <View style={styles.space_between}>
                                <TouchableOpacity
                                    onPress={() => data.customer_id > 0 ? navigation.navigate('InfoCustomer', {item: {customer_id: data.customer_id}}) : null}
                                    style={{ flexDirection: 'row', alignItems: 'center' }}
                                >
                                    <Icon
                                        name='ios-person'
                                        size={17}
                                        color='#000'
                                    />
                                    <Text style={{ marginLeft: 5, marginRight: 10, fontWeight: 'bold', fontSize: 16 }}>{data.customer || 'Khách vãng lai'}</Text>
                                    <Icon
                                        name='ios-arrow-forward'
                                        size={17}
                                        color='#000'
                                    />
                                </TouchableOpacity>
                                <Text>{data.personnel}</Text>
                            </View>

                            <View style={styles.space_between}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Icon
                                        name='md-pricetag'
                                        size={17}
                                        color='#000'
                                    />
                                    <Text style={{ marginLeft: 5 }}>Bảng giá chung</Text>
                                </View>
                                <Text>{moment(data.created_at, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY HH:mm')}</Text>
                            </View>

                            <View style={styles.space_between}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Icon
                                        name='ios-basket'
                                        size={17}
                                        color='#000'
                                    />
                                    <Text style={{ marginLeft: 5 }}>Bán trực tiếp</Text>
                                </View>
                                <Text>{data.depot}</Text>
                            </View>
                        </View>

                        <View style={{ marginBottom: 20, backgroundColor: '#fff' }}>
                            <FlatList
                                data={products}
                                ItemSeparatorComponent={() => <View style={{ height: 1, width: "100%", backgroundColor: "#eee", }} />}
                                renderItem={({ item, index }) => (
                                    <TouchableOpacity
                                        onPress={() => NavigatorService.navigate('itemGood', {itemId: item.product_id, sku: item.sku})}
                                        activeOpacity={0.4}
                                    >
                                        <View style={{ padding: 10, flexDirection: 'row' }}>
                                            <View style={{ flex: 1.8 }}>
                                                <Text style={{ fontSize: 16 }}>{item.name}</Text>
                                                <Text style={{ color: '#a69d94' }}>{item.sku}</Text>
                                                <View style={{ flexDirection: 'row' }}>
                                                    <Text>
                                                        <NumberFormat
                                                            thousandSeparator={'.'}
                                                            decimalSeparator={','}
                                                            value={parseInt(item.price)}
                                                            displayType={'text'}
                                                            suffix={'đ'}
                                                            renderText={value => <Text>{value} x</Text>}
                                                        />
                                                    </Text>
                                                    <Text style={{ color: '#0b9cb3', marginLeft: 5 }}>{parseFloat(item.quantity)}</Text>
                                                </View>
                                            </View>
                                            <View style={{ flex: 1 }}>
                                                <Text style={{ textAlign: 'right', fontSize: 16 }}>
                                                    <NumberFormat
                                                        thousandSeparator={'.'}
                                                        decimalSeparator={','}
                                                        value={parseInt(item.quantity * item.price)}
                                                        displayType={'text'}
                                                        suffix={'đ'}
                                                        renderText={value => <Text>{value}</Text>}
                                                    />
                                                </Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                )}
                            />
                        </View>

                        <View style={{ backgroundColor: '#fff', }}>
                            <View style={{ padding: 10, flexDirection: 'row' }}>
                                <Text style={{ flex: 1.5, textAlign: 'right', fontSize: 16 }}>{data.type === 'HD' ? 'Tổng tiền hàng' : 'Tổng tiền hàng trả'}</Text>
                                <View style={{ flex: 1, flexDirection: 'row' }}>
                                    <Text style={{
                                        flex: 1,
                                        textAlign: 'center',
                                        borderRadius: 4,
                                        borderWidth: 0.8,
                                        borderColor: '#d6d7da',
                                        marginRight: 10,
                                        marginLeft: 10
                                    }}>
                                        {data.type === 'HD' ? data.tong_sl : data.tong_th_sl}
                                    </Text>
                                    <Text style={{ textAlign: 'right', flex: 5 }}>
                                        <NumberFormat
                                            thousandSeparator={'.'}
                                            decimalSeparator={','}
                                            value={parseInt(total_price)}
                                            displayType={'text'}
                                            suffix={'đ'}
                                            renderText={value => <Text>{value}</Text>}
                                        />
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.separator} />

                            <View style={{ padding: 10, flexDirection: 'row' }}>
                                <Text style={{ flex: 1.5, textAlign: 'right', fontSize: 16 }}>Giảm giá hóa đơn</Text>
                                <Text style={{ flex: 1, textAlign: 'right' }}>
                                    <NumberFormat
                                        thousandSeparator={'.'}
                                        decimalSeparator={','}
                                        value={parseInt(discount)}
                                        displayType={'text'}
                                        suffix={'đ'}
                                        renderText={value => <Text>{value}</Text>}
                                    />
                                </Text>
                            </View>

                            <View style={styles.separator} />

                            <View style={{ padding: 10, flexDirection: 'row' }}>
                                <Text style={{ flex: 1.5, textAlign: 'right', fontSize: 16 }}>{data.type === 'HD' ? 'Khách cần trả' : 'Cần trả khách'}</Text>
                                <Text style={{ flex: 1, textAlign: 'right' }}>
                                    <NumberFormat
                                        thousandSeparator={'.'}
                                        decimalSeparator={','}
                                        value={parseInt(total_price - discount)}
                                        displayType={'text'}
                                        suffix={'đ'}
                                        renderText={value => <Text>{value}</Text>}
                                    />
                                </Text>
                            </View>

                            <View style={styles.separator} />

                            <View style={{ padding: 10, flexDirection: 'row' }}>
                                <Text style={{ flex: 1.5, textAlign: 'right', fontSize: 16 }}>{data.type === 'HD' ? 'Khách đã trả' : 'Tiền trả khách'}</Text>
                                <Text style={{ flex: 1, textAlign: 'right' }}>
                                    <NumberFormat
                                        thousandSeparator={'.'}
                                        decimalSeparator={','}
                                        value={parseInt(data.paying_amount)}
                                        displayType={'text'}
                                        suffix={'đ'}
                                        renderText={value => <Text>{value}</Text>}
                                    />
                                </Text>
                            </View>
                        </View>

                        <View style={{ padding: 10, flexDirection: 'row', backgroundColor: '#ebe1e1' }}>
                            <Text>Người tạo: </Text>
                            <Text style={{ fontWeight: 'bold' }}>{data.personnel}</Text>
                        </View>
                    </View>
                )}
            </ScrollView>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E5E5E5',
    },
    separator: {
        width: '100%',
        height: 1,
        backgroundColor: "#eee",
    },
    space_between: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    }
});