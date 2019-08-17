import React, { Component } from 'react';
import { connect } from 'react-redux';
import { isEmpty, forEach, filter, sum,split, find, } from 'lodash';
import {  Button } from "react-native-elements"
import { View, ScrollView, ActivityIndicator,  Text,   StyleSheet,  RefreshControl, TouchableOpacity } from 'react-native';
import { reportdetail_api} from '../../../services/api/fetch';
import Icon from "react-native-vector-icons/Ionicons";
import RNPickerSelect from 'react-native-picker-select';
import { Table,  Row, Rows } from 'react-native-table-component';
import moment from 'moment';
import { Main } from '../../../styles/main';
import Modal from 'react-native-modal';
import { goodsCss } from '../../../styles/goods';
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "react-native-modal-datetime-picker" ;

class Report extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            data: [],
            page: 1,
            limit: 20,
            total_page: 0,
            currentPage: 1,
            refreshing: false,
            value: '',
            sort: 'id_desc',
            selectedValue: 'id_desc',
            selectedLabel: 'Mới nhất',
            productSearch: null,
            tableHead: [ 'Mã NCC','Tên NCC', 'SL nhập', 'Tổng tiền hàng', 'Giảm giá PN', 'Chi phí khác', 'SL trả', 'Giá trị trả', 'Giá trị Thuần'],
            widthArr: [100, 80, 100, 100, 100, 100, 100, 100, 100],
            datef: moment().startOf('isoWeek').format('YYYY-MM-DD'),
            datet: moment().format('YYYY-MM-DD'),
            visibleModal: false,
            depotSearch: null,

            visible: false,
            modalVisible:false,
            isDateTimePickerVisibleF:false,
            isDateTimePickerVisibleT:false,
            depot:'',
            animating: true,
        };
    }

    componentDidMount() {
        this.getList();
        // this.changeScreenOrientation();
    }


    // async changeScreenOrientation() {
    //     await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_LEFT);
    // }

    getList() {
        const { currentPage, limit, searchAll, search, total_page, datef, datet, depot } = this.state;
        const { depot_current } = this.props;
        this.setState({animating:true})
        const params = {
            mtype: 'reportSaleBySupplierInfoMobile',
            limit,
            offset: 0,
            datef: datef,
            datet: datet,
            isDownload: 0,
            depot_id: (depot !== null && depot !=='') ? depot : parseFloat(depot_current),
        };
        reportdetail_api(params).then((data) => {
            if (data.status) {
                this.setState({ data: data.data, refreshing: false,animating:false})
            }else{
                this.setState({ data:[],refreshing: false,animating:false})
            }
        });
    }

    async onChangePiker(itemValue) {
        await this.setState({ sort: itemValue });
        this.getList();
    }

    _onRefresh = () => {
        const {depot_current} = this.state;
        this.setState({ refreshing: true ,depot:depot_current});
        this.getList();
    }



    renderColum() {
        const { data } = this.state;
        const tableHead = ['STT', 'Mã phiếu'];
        const widthArr = [50, 100];
        const tableData = [];
        const rowData = [];
        forEach(data, (v, k) => {
            const num = k + 1;
            const tmp = [num, v.invoice];
            rowData.push(tmp);
        })
        tableData.push(rowData);
        const test1 = [['[1]', '[2]'],];
        const test = [['', ''],];
        return (
            <View style={styles.table}>
                <Table borderStyle={{ borderColor: '#C1C0B9' }}>
                    <Row data={tableHead} widthArr={widthArr} style={styles.header1} textStyle={styles.textHeader} />
                </Table>
                <ScrollView
                    style={styles.dataWrapper}
                >
                    <Table borderStyle={{ borderColor: '#C1C0B9' }}>
                        <Rows
                            data={test1}
                            style={[styles.row]}
                            textStyle={styles.text}
                            widthArr={widthArr}
                        />
                        <Rows
                            data={test}
                            style={[styles.row]}
                            textStyle={styles.text}
                            widthArr={widthArr}
                        />
                        <Rows
                            data={tableData[0]}
                            style={[styles.row]}
                            textStyle={styles.text}
                            widthArr={widthArr}
                        />
                    </Table>
                </ScrollView>
            </View>
        )
    }


    renderItem() {
        const state = this.state;
        const { data } = this.state;
        const tableData = [];
        const rowData = [];
        const total_product = [];
        const sub_total = [];
        const special_amount = [];
        const pk = [];
        const total_product_th = [];
        const total_th = [];
        const total_dt = [];
    
        if(!isEmpty(data)){
            forEach(data, (v, k) => {
                const total1 = ((v.total_product!==null && v.total_product!=='' ) ? parseInt(v.total_product):0);
                const total2 = ((v.sub_total !==null && v.sub_total!=='') ?parseInt(v.sub_total) :0);
                const total3 = ((v.special_amount !==null && v.special_amount!=='') ?parseInt(v.special_amount):0);
                const total4 = ((v.pk !==null && v.pk!=='') ?parseInt(v.pk) :0);
                const total5 = ((v.total_product_th !==null && v.total_product_th!=='') ?parseInt(v.total_product_th)*(-1):0);
                const total6 = ((v.total !==null && v.total!=='') ?parseInt(v.total) :0) ;
                const total7 = (parseInt(total2) -parseInt(total3)+parseInt(total4)+parseInt(total6));
                const tmp = [v.code, v.name,(v.total_product!==null ?v.total_product:0), (v.sub_total !==null?v.sub_total.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"):0), (v.special_amount !==null ?v.special_amount.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"):0),v.pk.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"),v.total_product_th,v.total.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"),(total7).toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") ];
                rowData.push(tmp);
                total_product.push(total1);
                sub_total.push(total2);
                special_amount.push(total3);
                pk.push(total4);
                total_product_th.push(total5);
                total_th.push(total6);
                total_dt.push(total7);
            })
        }
        tableData.push(rowData);
        const test = [['[3]', '[4]', '[5]', '[6]', '[7]', '[8]', '[9]', '[10]', '[11 =6-7+8+10]'],];
        const test2 = [['','',sum(total_product), sum(sub_total).toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")+'đ', sum(special_amount).toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")+'đ',sum(pk).toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")+'đ',sum(total_product_th).toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")+'đ',sum(total_th)+'đ',sum(total_dt).toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")+'đ'],];
        return (
            <View style={styles.table}>
                <ScrollView horizontal={true}>
                    <View>
                        <Table borderStyle={{ borderColor: '#C1C0B9' }} >
                            <Row data={state.tableHead} widthArr={state.widthArr} style={styles.header1} textStyle={styles.textHeader} />
                        </Table>
                        {/* <TableWrapper style={{flexDirection: 'row'}}>
                            <Col data={['Tên nhà cung cấp']} widthArr={[100]} style={styles.header1} textStyle={styles.textHeader} />
                            <TableWrapper style={{flexDirection: 'row'}}>
                                <Row data={state.tableHead} widthArr={state.widthArr} style={styles.header} textStyle={styles.textHeader} />
                            </TableWrapper>
                        </TableWrapper> */}


                        {/* <Table borderStyle={{ borderColor: '#C1C0B9' }} >
                            <Row data={state.tableHead} widthArr={state.widthArr} style={styles.header} textStyle={styles.textHeader} />
                        </Table> */}
                        <ScrollView
                            style={styles.dataWrapper}
                        >
                            <Table borderStyle={{ borderColor: '#C1C0B9' }}>
                                <Rows
                                    data={test}
                                    style={[styles.row]}
                                    textStyle={styles.text}
                                    widthArr={state.widthArr}
                                />
                                <Rows
                                    data={test2}
                                    style={[styles.row]}
                                    textStyle={styles.text}
                                    widthArr={state.widthArr}
                                />
                                {!isEmpty(tableData) &&(

                                    tableData[0].map((rowData,index) => (
                                        <Row
                                            key={index}
                                            data={rowData}
                                            widthArr={state.widthArr}
                                            style={[styles.row]}
                                            textStyle={styles.text}
                                        />
                                    ))
                                )}
                            </Table>
                        </ScrollView>
                    </View>
                </ScrollView>
            </View>
        )
    }

    
    setModalVisible(visible) {
        this.setState({ modalVisible: visible });
    }

    onChangeDepot(value) {
        const depot = parseInt(value);
        if (depot > 0) {
            this.setState({ depot });
        }
    }

    listDepot() {
        const { depots, profile, userRole } = this.props;
        const { depot } = profile;
        let items = [
            {
                label: 'Chọn kho...',
                value: 0,
            }
        ];
        let depots_perm = filter(split(depot, ','), (v) => !isEmpty(v));
        let listDepots = filter(depots, (v) => depots_perm.includes(v.id));
        if (find(userRole, (o) => o.role_id === 1)) {
            listDepots = depots;
        }
        if (!isEmpty(listDepots)) {
            items = [];
            forEach(listDepots, (v) => {
                items.push({
                    label: v.name,
                    value: v.id,
                })
            });
        }
        return items;
    }

    hideDateTimePickerF = () => {
        this.setState({ isDateTimePickerVisibleF: false });
    };

    hideDateTimePickerT = () => {
        this.setState({ isDateTimePickerVisibleT: false });
    };

    showDateTimePickerF = () => {
        this.setState({ isDateTimePickerVisibleF: true });
    };

    showDateTimePickerT = () => {
        this.setState({ isDateTimePickerVisibleT: true });
    };

    handleDatePicked = (type, date) => {
        if (type === 'from') {
            this.setState({ datef: moment(date).format('YYYY-MM-DD') });
            this.hideDateTimePickerF();
        } else if (type === 'to') {
            this.setState({ datet: moment(date).format('YYYY-MM-DD') });
            this.hideDateTimePickerT();
        }
    };

    submit = () =>{
        const { datef,datet,depot} = this.state;
        this.getList();
    }

    render() {
        const { refreshing, visibleModal,datef,datet ,visible,modalVisible,animating} = this.state;
        if (animating) {
            return <ActivityIndicator
                size="large" color="#0000ff"
            />
        }
        return (
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={this._onRefresh}
                    />
                }>
                <View style={Main.select_box_main}>
                    <View style={Main.select_box_item} >
                        <TouchableOpacity style={Main.select_box_item_action_icon} onPress={this._onPressSearch} >
                            <Icon
                                name='ios-funnel'
                                size={20}
                                color="#545454"
                                onPress={() => {
                                    this.setModalVisible(true);
                                }}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
                <View>
                    <Text style={{ fontSize: 15 }} > Từ ngày {datef} đến ngày {datet} </Text>
                </View>
                <View style={{ flex: 1, flexDirection: 'row',marginTop:20 }}>
                    <View style={{ flex: 0.4 }}>
                        {this.renderColum()}
                    </View>
                    <View style={{ flex: 0.6 }}>
                        {this.renderItem()}
                    </View>
                </View>
                <Modal
                    // animationType="slide"
                    // transparent={false}
                    visible={this.state.modalVisible}
                    // style={{margin:0}}
                    onRequestClose={() => {
                        Alert.alert('Modal has been closed.');
                    }}>
                    <View style={styles.modalContent}>
                        <ScrollView>
                            <View>
                                <View>
                                    <Text style={goodsCss.goods_search_title}>Từ khoá</Text>
                                </View>
                                <View style={{paddingHorizontal:15}}>
                                    <View style={goodsCss.goods_search_input}>
                                        <Text onPress={this.showDateTimePickerF} >Ngày bắt đầu : {datef}</Text>
                                        <DateTimePicker
                                            isVisible={this.state.isDateTimePickerVisibleF}
                                            onConfirm={(date) => this.handleDatePicked('from', date)}
                                            onCancel={this.hideDateTimePickerF}
                                            date={new Date(datef)}
                                        />
                                    </View>
                                </View>
                                <View style={{paddingHorizontal:15}}>
                                    <View style={goodsCss.goods_search_input}>
                                        <Text onPress={this.showDateTimePickerT} >Ngày kết thúc : {datet}</Text>
                                        <DateTimePicker
                                            isVisible={this.state.isDateTimePickerVisibleT}
                                            onConfirm={(date) => this.handleDatePicked('to', date)}
                                            onCancel={this.hideDateTimePickerT}
                                            date={new Date(datet)}
                                        />
                                    </View>
                                </View>
                                <View>
                                    <Text style={goodsCss.goods_search_title}>Chọn kho</Text>
                                    <RNPickerSelect
                                        placeholder={{
                                            label: 'Chọn kho...',
                                            value: null,
                                        }}
                                        items={this.listDepot()}
                                        onValueChange={(value) => this.onChangeDepot(value)}
                                        style={{
                                            flex: 60,
                                            // ...pickerSelectStyles,
                                            iconContainer: {
                                                top: 10,
                                                right: 12,
                                            },
                                        }}
                                        value={parseInt(this.state.depot)}
                                        Icon={() => {
                                            return <Ionicons name="md-arrow-dropdown" size={24} color="gray" />;
                                        }}
                                    />
                                </View>
                                
                            </View>
                        </ScrollView>
                    </View>
                    <View style={Main.btn_fixed}>
                        <View style={Main.btn_fixed_box}>
                            <Button
                                title="Hủy"
                                onPress={() => {
                                    this.setState({ text: '' }, () => {
                                        this.setModalVisible(!this.state.modalVisible);
                                    })
                                }}
                                buttonStyle={Main.btn_submit_button}
                                containerStyle={Main.btn_submit_button_box}
                                titleStyle={Main.btn_submit_button_title}
                            />
                        </View>
                        <View style={Main.btn_fixed_box}>
                            <Button
                                title="Áp dụng"
                                onPress={() => {
                                    this.setModalVisible(!this.state.modalVisible);
                                    this.submit();
                                }}
                                buttonStyle={[Main.btn_submit_button, Main.btn_submit_button_success]}
                                containerStyle={Main.btn_submit_button_box}
                                titleStyle={Main.btn_submit_button_title}
                            />
                        </View>
                    </View> 
                </Modal>

            </ScrollView>
        );
    }
}

const mapStateToProps = ({ persist }) => ({
    depot_current: persist.depot_current,
    depots: persist.depots,
    profile: persist.profile,
    userRole: persist.userRole,
});

export default connect(mapStateToProps)(Report);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 5,
    },
    modalContent: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'white',
        borderRadius: 4,
        borderColor: 'rgba(0, 0, 0, 0.1)',
        overflow: 'hidden'
    },
    table: { flex: 1, backgroundColor: '#fff' },
    header: { height: 50, backgroundColor: '#28af6b' },
    header1: { height: 100, backgroundColor: '#28af6b' },
    text: { textAlign: 'center', fontWeight: '600' },
    dataWrapper: { marginTop: -1 },
    row: { height: 40, backgroundColor: '#E7E6E1' },
    textHeader: { textAlign: 'center', fontWeight: '600', color: '#fff' },
});
