import React, { Component } from 'react';
import { connect } from 'react-redux';
import { isEmpty, forEach, filter, sum,split, find, } from 'lodash';
import {  Button } from "react-native-elements"
import { View, ScrollView, ActivityIndicator,  Text,   StyleSheet,  RefreshControl, TouchableOpacity,Dimensions  } from 'react-native';
import { report_api} from '../../services/api/fetch';
import Icon from "react-native-vector-icons/Ionicons";
import RNPickerSelect from 'react-native-picker-select';
import { Table,  Row, Rows,TableWrapper,Cell  } from 'react-native-table-component';
import moment from 'moment';
import { Main } from '../../styles/main';
import Modal from 'react-native-modal';
import { goodsCss } from '../../styles/goods';
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "react-native-modal-datetime-picker";
import HTML from 'react-native-render-html';
class ReportProductInOutStock extends Component {
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
            tableHead: [ 'Sản phẩm','Tồn đầu kỳ', 'Nhập trong kỳ', 'Xuất trong kỳ','', 'Tồn cuối kỳ'],
            tableHead1: [ 'Tên','Vốn', 'Tồn', 'SL', 'Vốn ','Tổng','SL', 'Vốn', 'Tổng', 'SL','Vốn', 'Tổng', 'SL', 'Vốn','Tổng'],
            widthArr: [300, 300, 300, 300,300],
            widthArr1: [100, 100, 100, 100, 100,100, 100, 100, 100, 100,100, 100, 100, 100, 100],
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
            mtype: 'reportProductInStock',
            datef: datef,
            datet: datet,
            isDownload: 0,
            depot_id: (depot !== null && depot !=='') ? depot : parseFloat(depot_current),
            is_mobile:1,
            page:1
        };
        report_api(params).then((data) => {
            this.setState({ data: data, refreshing: false,animating:false})
            // if (data.status) {
            //     this.setState({ data: data, refreshing: false,animating:false,htm:data.htm})
            // }else{
            //     this.setState({ data: [], refreshing: false,animating:false})
            // }
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
        const state = this.state;
        const { data } = this.state;
        const tableHead = ['STT', 'Mã sản phẩm'];
        const widthArr = [50, 100];
        const tableData = [] ;
        const rowData = [];
        let a = 1;
        forEach(data, (v, k) => {
            const num = k + 1;
            a++;
            const tmp = [a, v.sku];
            rowData.push(tmp);
        })
        tableData.push(rowData);
        const test1 = [['[1]', '[2]'],];
        const test = [['', ''],];
        return (
            <View >
               
                <ScrollView style={styles.dataWrapper} >
                    <TableWrapper style={{flexDirection: 'row'}} >
                        <Cell data="STT" style={{width: 50, height: 200, backgroundColor: '#E7E6E1'}}/>
                        <Cell data="Mã Sp" style={{width: 100, height: 200, backgroundColor: '#E7E6E1'}}/>
                    </TableWrapper>
                </ScrollView>
                <ScrollView
                    style={styles.dataWrapper}
                >
                    <Table borderStyle={{ borderColor: '#C1C0B9' }}>
                        <Rows
                            data={test1}
                            widthArr={widthArr} style={styles.header2}  textStyle={styles.textHeader1}
                            
                        />
                        <Rows
                            data={test}
                            widthArr={widthArr} style={styles.header2}  textStyle={styles.textHeader1}
                        />
                        <Rows
                            data={tableData[0]}
                            widthArr={widthArr} style={styles.header2}  textStyle={styles.textHeader1}
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
        let price_current = [];
        let soluong_cuoi = [];
        let soluong_dau = [];
        let giavon_dau = [];
        let tdk = [];
        let soluong_giua_nhap = [];
        let giavon_giua_nhap = [];
        let ntk= [];
        let soluong_giua_xuat= [];
        let giavon_giua_xuat = [];
        let xtk = [];
        let soluong_cuoi1 = [];
        let giavon_cuoi = [];
        let tck = [];
        forEach(data, (v, k) => {
            let total4 =parseInt(v.price_current);
            let total5 =parseInt(v.soluong_cuoi);
            let total6 = (parseInt(v.soluong_dau));
            let total7 = parseInt(v.giavon_dau)
            let total8= total6*total7
            let total9 = (parseInt(v.soluong_giua_nhap));
            let total10= (parseInt(v.giavon_giua_nhap));
            let total11= total9*total10;
            let total12= parseInt(v.soluong_giua_xuat);
            let total13= (parseInt(v.giavon_giua_xuat));
            let total14= total12*total13;
            let total15= parseInt(v.soluong_cuoi);
            let total16= parseInt(v.giavon_cuoi);
            let total17 = total15*total16;
            // const tmp = [v.fullname, v.price_market,v.price,v.hd_soluong,v.hd_soluong*v.price,v.th_soluong,v.th_soluong*v.price,v.qt_soluong,v.qt_soluong*v.price_market,v.hd_soluong*v.price-v.th_soluong*v.price_market, v.chiet_khau-v.th_special_amount,1000000,200000,300000,20 ];
            const tmp = [v.fullname, total4,total5,total6,total7,total8,total9,total10,total11,total12, total13,total14,total15,total16,total17];
            rowData.push(tmp);

            price_current.push(total4)
            soluong_cuoi.push(total5)
            soluong_dau.push(total6)
            giavon_dau.push(total7)
            tdk.push(total8)

            soluong_giua_nhap.push(total9)
            giavon_giua_nhap.push(total10)
            ntk.push(total11)

            soluong_giua_xuat.push(total12)
            giavon_giua_xuat.push(total13)
            xtk.push(total14)

            soluong_cuoi1.push(total15)
            giavon_cuoi.push(total16)
            tck.push(parseFloat(total17));           
        })
        tableData.push(rowData);
        const test = [['[3]', '[4]', '[5]', '[6]', '[7]','[8=7*6]', '[9]', '[10]', '[11=10*9]', '[12]','[13]', '[14=13*12]', '[15]', '[16]', '[17=16*15]'],];
        const test2 = [['Tổng', sum(price_current),sum(soluong_cuoi), sum(soluong_dau), sum(giavon_dau), sum(tdk), 
        sum(soluong_giua_nhap), sum(giavon_giua_nhap), sum(ntk), sum(soluong_giua_xuat), sum(giavon_giua_xuat), sum(xtk), sum(soluong_cuoi), sum(giavon_cuoi), sum(tck) ],];
        return (
            <View style={styles.table}>
                <ScrollView horizontal={true}>
                    <View>
                        <TableWrapper >
                                <Row data={state.tableHead} widthArr={state.widthArr} style={styles.header1}  textStyle={styles.textHeader} />
                                <Row data={state.tableHead1} widthArr={state.widthArr1} style={styles.header1}  textStyle={styles.textHeader} />
                                <Rows
                                    data={test}
                                    widthArr={state.widthArr1} style={styles.header2}  textStyle={styles.textHeader1}
                                />
                                <Rows
                                    data={test2}
                                    widthArr={state.widthArr1} style={styles.header2}  textStyle={styles.textHeader1}
                                />
                                {tableData[0].map((rowData,index) => (
                                    <Row
                                        key={index}
                                        data={rowData}
                                        widthArr={state.widthArr1} style={styles.header2}  textStyle={styles.textHeader1}
                                    />
                                )) }
                                
                        </TableWrapper>
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

export default connect(mapStateToProps)(ReportProductInOutStock);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 5,
    },
    table: { flex: 1, backgroundColor: '#fff' },
    header: { height: 50, backgroundColor: '#28af6b' },
    header1: { height: 100, backgroundColor: '#28af6b' },
    header2: { height: 50, backgroundColor: '#E7E6E1' },
    text: { textAlign: 'center', fontWeight: '600' },
    dataWrapper: { marginTop: -1 },
    row: { height: 40, backgroundColor: '#E7E6E1' },
    textHeader: { textAlign: 'center', fontWeight: '600', color: '#fff' },
    textHeader1: { textAlign: 'center', fontWeight: '600', color: 'black' },
    singleHead: { width: 80, height: 200, backgroundColor: '#c8e1ff' },
});
