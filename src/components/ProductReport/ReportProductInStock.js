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
class ReportProductInStock extends Component {
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
            tableHead: [ 'Sản phẩm','Tổng bán', 'Tổng trả', 'Tổng tặng', 'Giao dịch'],
            tableHead1: [ 'Tên','Vốn', 'Bán', 'SL', 'Thu dự kiến','SL','Chi dự kiến', 'SL', 'Chi dự kiến', 'Doanh thu TCK','Chiết khấu', 'Doanh thu', 'Vốn', 'Lợi nhuận','Tỷ suất'],
            widthArr: [300, 200, 200, 200, 600],
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
            mtype: 'reportProduct',
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
                        <Cell data="STT" style={{width: 50, height: 200, backgroundColor: '#c8e1ff'}}/>
                        <Cell data="MS" style={{width: 100, height: 200, backgroundColor: '#c8e1ff'}}/>
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
        let price_market = [];
        let price = [];
        let hd_soluong = [];
        let tdk = [];
        let th_soluong = [];
        let cdk = [];
        let qt_soluong = [];
        let ttcdk= [];
        let dttck= [];
        let ck = [];
        let dt = [];
        let von = [];
        let ln = [];
        let ts = [];
        let time = 1;
        if(!isEmpty(data)){
            time = Object.values(data).length;
        }else{
            time =1;
        }
        forEach(data, (v, k) => {
            let total4 =parseInt(v.price_market);
            let total5 =parseInt(v.price);
            let total6 = (parseInt(v.hd_soluong));
            let total7 = (parseInt(v.price)*parseInt(v.hd_soluong));
            let total8= (parseInt(v.th_soluong));
            let total9 = (parseInt(v.price)*parseInt(v.th_soluong));
            let total10= (parseInt(v.qt_soluong));
            let total11= total4*total10;
            let total12= total7-total9;
            let total13= (parseInt(v.chiet_khau)-parseInt(v.th_special_amount));
            let total14= total7-total9-total11-total13;
            let total15= (total6-total8+total10)*total4;
            let total16= total14-total15;
            let total17 = (total16/total14)*100;
            // const tmp = [v.fullname, v.price_market,v.price,v.hd_soluong,v.hd_soluong*v.price,v.th_soluong,v.th_soluong*v.price,v.qt_soluong,v.qt_soluong*v.price_market,v.hd_soluong*v.price-v.th_soluong*v.price_market, v.chiet_khau-v.th_special_amount,1000000,200000,300000,20 ];
            const tmp = [v.fullname, total4,total5,total6,total7,total8,total9,total10,total11,total12, total13,total14,total15,total16,total17.toFixed(2)];
            rowData.push(tmp);
            price_market.push(total4)
            price.push(total5)
            hd_soluong.push(total6)
            tdk.push(total7)
            th_soluong.push(total8)
            cdk.push(total9)
            qt_soluong.push(total10)
            ttcdk.push(total11)
            dttck.push(total12)
            ck.push(total13)
            dt.push(total14)
            von.push(total15)
            ln.push(total16)
            ts.push(parseFloat(total17.toFixed(2)));           
        })
        tableData.push(rowData);
        const test = [['[3]', '[4]', '[5]', '[6]', '[7=5*6]','[8]', '[9=8*5]', '[10]', '[11=10*5]', '[12=7-9-11]','[13]', '[14=7-9-11-13]', '[15=(6-8+10)*4]', '[16=14-15]', '[17=16/14*100]'],];
        const test2 = [['Tổng', sum(price_market),sum(price), sum(hd_soluong), sum(tdk), sum(th_soluong), sum(cdk), sum(qt_soluong), sum(ttcdk), sum(dttck), sum(ck), sum(dt), sum(von), sum(ln), sum(ts)/time ],];
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
                                {
                                    tableData[0].map((rowData,index) => (
                                        <Row
                                            key={index}
                                            data={rowData}
                                            widthArr={state.widthArr1} style={styles.header2}  textStyle={styles.textHeader1}
                                        />
                                    ))
                                }
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

export default connect(mapStateToProps)(ReportProductInStock);

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
