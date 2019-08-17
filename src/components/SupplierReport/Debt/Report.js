import React, { Component } from 'react';
import { connect } from 'react-redux';
import { isEmpty, forEach, filter, sum,split, find, } from 'lodash';
import {  Button } from "react-native-elements"
import { View, ScrollView, ActivityIndicator,  Text,   StyleSheet,  RefreshControl, TouchableOpacity,Dimensions  } from 'react-native';
import { reportdetail_api} from '../../../services/api/fetch';
import Icon from "react-native-vector-icons/Ionicons";
import RNPickerSelect from 'react-native-picker-select';
import { Table,  Row, Rows } from 'react-native-table-component';
import moment from 'moment';
import { Main } from '../../../styles/main';
import Modal from 'react-native-modal';
import { goodsCss } from '../../../styles/goods';
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "react-native-modal-datetime-picker";
import HTML from 'react-native-render-html';
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
            tableHead: [ 'Tên nhà cung cấp','Nợ đầu kỳ', 'Tăng trong kỳ', 'Giảm trong kỳ', 'Nợ cuối'],
            widthArr: [100, 100, 100, 100, 100],
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
            htm:''
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
            mtype: 'reportDebtManufacturer',
            limit,
            offset: 0,
            datef: datef,
            datet: datet,
            isDownload: 0,
            depot_id: (depot !== null && depot !=='') ? depot : parseFloat(depot_current),
        };
        reportdetail_api(params).then((data) => {
            if (data.status) {
                this.setState({ data: data.listOrders, refreshing: false,animating:false,htm:data.htm})
            }else{
                this.setState({ data: [], refreshing: false,animating:false})
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
        const tableHead = ['STT', 'Mã NCC'];
        const widthArr = [50, 100];
        const tableData = [];
        const rowData = [];
        forEach(data, (v, k) => {
            const num = k + 1;
            const tmp = [num, v.code];
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
        const totalDK = [];
        const totalHD = [];
        const totalTT = [];
        const totalCk = [];
        forEach(data, (v, k) => {
            const total1 = ((v.nodauky!==null && v.nodauky!=='' ) ? parseInt(v.nodauky):0);
            const total2 = ((v.hoadon !==null && v.hoadon!=='') ?parseInt(v.hoadon) :0);
            const total3 = ((v.tientra !==null && v.tientra!=='') ?parseInt(v.tientra)*(-1):0);
            // const total4 =v.nodauky+v.hoadon-v.tientra;
            const total4 = (parseInt(total1) +parseInt(total2)-parseInt(total3));
            const tmp = [v.name, (v.nodauky!==null && v.nodauky!=='' ?v.nodauky.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"):0), (v.hoadon && v.hoadon!=='' !==null?v.hoadon.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"):0), (v.tientra && v.tientra!=='' !==null ?(v.tientra)*(-1).toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"):0),(total4).toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") ];
            rowData.push(tmp);
            totalDK.push(total1);
            totalHD.push(total2);
            totalTT.push(total3);
            totalCk.push(total4) ;
        })
        tableData.push(rowData);
        const test = [['[3]', '[4]', '[5]', '[6]', '[7=4+5-6]',],];
        const test2 = [['',sum(totalDK).toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")+'đ', sum(totalHD).toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")+'đ', sum(totalTT).toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")+'đ',sum(totalCk).toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")+'đ'],];
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
                                {
                                    tableData[0].map((rowData,index) => (
                                        <Row
                                            key={index}
                                            data={rowData}
                                            widthArr={state.widthArr}
                                            style={[styles.row]}
                                            textStyle={styles.text}
                                        />
                                    ))
                                }
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
        const { refreshing, visibleModal,datef,datet ,visible,modalVisible,animating,htm} = this.state;
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
                    animationType="slide"
                    transparent={false}
                    visible={this.state.modalVisible}
                    style={{margin:0}}
                    onRequestClose={() => {
                        Alert.alert('Modal has been closed.');
                    }}>
                    <View>
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
    table: { flex: 1, backgroundColor: '#fff' },
    header: { height: 50, backgroundColor: '#28af6b' },
    header1: { height: 100, backgroundColor: '#28af6b' },
    text: { textAlign: 'center', fontWeight: '600' },
    dataWrapper: { marginTop: -1 },
    row: { height: 40, backgroundColor: '#E7E6E1' },
    textHeader: { textAlign: 'center', fontWeight: '600', color: '#fff' },
});
