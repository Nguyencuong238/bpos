import React from 'react';
import { ScrollView, StyleSheet,RefreshControl,ActivityIndicator,Text,View,TouchableOpacity ,TextInput,Picker,FlatList,TouchableHighlight,Alert,ActionSheetIOS, Platform} from 'react-native';
import ReportRevenue from './ReportRevenue';
import Modal_DateOptions from './Modal_DateOptions';
import moment from 'moment';
import { report_api,standard_test_api } from '../../services/api/fetch';
import Icon from "react-native-vector-icons/Ionicons";
import DateTimePicker from "react-native-modal-datetime-picker";
import DateTimePickerCT from "../library/DateTimePickerCT";
import waterfall from 'async/waterfall';
import { StackedBarChart, XAxis, Grid, YAxis } from 'react-native-svg-charts';
import { Text as TextSVG } from 'react-native-svg';
import { showMessage } from "react-native-flash-message";
import * as scale from 'd3-scale';
import { isEmpty,isNumber,forEach } from 'lodash';
export default class Report extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            animating: true,
            refreshing: false,
            depot_id: 1,
            datef: moment().startOf('isoweek').format('YYYY-MM-DD'),
            datet: moment().format('YYYY-MM-DD'),
            get_total_thu:0,
            get_total_chi :0,
            get_tm :0,
            get_ck :0,
            total_order_sell:0,
            total_order_return:0,
            total_product:0,
            total_price_sell:0,
            total_price_sell_khac:0,
            total_price_return:0,
            total_price_return_khac:0,
            total_product_sell : 0,
            total_product_return : 0,
            //test
            date: new Date(),
            selectedValue: 'thisweek',
            selectedLabel: 'Tuần này',
            isDateTimePickerVisible: false,
            visible_tab1: false,
            // loading:false,

            colors: ['#28af6b'],
            checked: true,
            selectedColumn: { key: '', value: 0 },
            space:0,
            label :'',
            listReport:'',
            type:'',

        };
    }

    componentDidMount() {
        waterfall([
            (callback) => {
                this.getData(() => {
                    callback(null, 'next');
                });
            },
            (next, callback) => {
                this.getOrder(() => {
                    callback(null, 'next');
                });
            },
            (next, callback) => {
                this.getTotalProduct(() => {
                    callback(null, 'next');
                });
            },
        ], () => {
            this.renderChart();
        });
    }

    getOrder(cb = null) {
        const { datef, datet, depot_id } = this.state;
        // this.setState({ refreshing: true }, () => {
        this.setState({}, () => {
            report_api({ mtype: 'reportOrder', datef, datet, depot_id: 1,is_mobile:1 }).then((data) => {
                if(!isEmpty(data)){
                    let total_order_sell = 0;
                    let total_order_return = 0;
                    let total_price_sell = 0;
                    let total_price_sell_khac = 0;
                    let total_price_return = 0;
                    let total_price_return_khac = 0;
                    Object.values(data).forEach((v,k) => {
                        total_order_sell= total_order_sell+v.tong_sl;
                        total_order_return= total_order_return+v.tong_th_sl;
                        total_price_sell = total_price_sell +parseFloat(v.tong_banhang) -parseFloat(v.tong_chietkhau)-parseFloat(v.tong_diem_amount)+parseFloat(v.tong_vat)+parseFloat(v.tong_phikhac);
                        total_price_sell_khac = parseFloat(total_price_sell_khac) +parseFloat(v.tong_vat)+parseFloat(v.tong_phikhac);
                        total_price_return = total_price_return +parseFloat(v.tong_th)-parseFloat(v.tong_th_chietkhau)-parseFloat(v.tong_th_diem_amount)+parseFloat(v.tong_th_vat)+parseFloat(v.tong_th_phikhac);
                        total_price_sell_khac = total_price_sell_khac +parseFloat(v.tong_th_vat)+parseFloat(v.tong_th_phikhac);
                    });
                    this.setState({total_order_return,total_order_sell,total_price_sell,total_price_sell_khac,total_price_return,total_price_sell_khac},()=>{
                        if (cb) cb(null, 'done');
                    })
                }
            });
        });
    }

    getTotalProduct(cb = null) {
        const { datef, datet, depot_id } = this.state;
        // this.setState({ refreshing: true }, () => {
        this.setState({}, () => {
            report_api({ mtype: 'reportProduct', datef, datet, depot_id: 1,is_mobile:1 }).then((data) => {
                if(!isEmpty(data)){
                    let total_product_sell = 0;
                    let total_product_return = 0;
                    Object.values(data).forEach((v,k) => {
                        total_product_sell= total_product_sell+v.hd_soluong;
                        total_product_return= total_product_return+v.th_soluong;
                       
                    });
                    this.setState({total_product_return,total_product_sell},()=>{
                        if (cb) cb(null, 'done');
                    })
                }
            });
        });
    }
    
    getData(cb = null) {
        const { datef, datet, depot_id } = this.state;
        this.setState({ refreshing: true,animating:true }, () => {
            report_api({ mtype: 'reportCashFlow', datef, datet, depot_id, is_mobile: 1 }).then((response) => {
                const options = [];
                const data = Object.values(response);
                const data_key = Object.keys(response);
                let i = 0;
                let a= 0;
                let tm = 0;
                let ck = 0;
                data.forEach((v,k) => {
                    let date = {date:data_key[k]};
                    let total_thu = {total_thu:parseFloat(v['thu_ck'])+ parseFloat(v['thu_tm'])};
                    let total_chi = {total_chi:parseFloat(v['chi_ck'])+ parseFloat(v['chi_tm'])};
                    let totalAll = {totalAll:parseFloat(v['thu_ck'])+ parseFloat(v['thu_tm'])-parseFloat(v['chi_ck'])- parseFloat(v['chi_tm'])};
                    v1 = {...v, ...date,...total_thu,...total_chi,...totalAll}
                    options.push(v1);
                    i= i+ parseInt(v.thu_tm + v.thu_ck);
                    a= a+ parseInt(v.chi_tm) + parseInt(v.chi_ck);
                    tm = tm + parseInt(v.thu_tm - v.chi_tm);
                    ck = ck + parseInt(v.thu_ck - v.chi_ck);

                });
                this.setState({data:options,refreshing: false,get_total_thu:i,get_total_chi:a,get_tm:tm,get_ck:ck},()=>{
                    if (cb) cb(null, 'done');
                });
            });
        });
    }

    getDate1 = (key) =>{
        if(!isEmpty(key)){
            this.setState({ datef:key.datef, datet:key.datet,data:[],refreshing:true}, () => {
                waterfall([
                    (callback) => {
                        this.getData(() => {
                            callback(null, 'next');
                        });
                    },
                    (next, callback) => {
                        this.getOrder(() => {
                            callback(null, 'next');
                        });
                    },
                    (next, callback) => {
                        this.getTotalProduct(() => {
                            callback(null, 'next');
                        });
                    },
                ], () => {
                    this.renderChart();
                });
            });
        }
    }
    getDate = (key) => {
        let datet, datef;
        if (key === '7days') {
            datef = moment().subtract(6, 'days').format('YYYY-MM-DD');
            datet = moment().format('YYYY-MM-DD');
        } else if (key === 'today') {
            datef = moment().format('YYYY-MM-DD');
            datet = moment().format('YYYY-MM-DD');
        } else if (key === 'yesterday') {
            datef = moment().subtract(1, 'days').format('YYYY-MM-DD');
            datet = moment().subtract(1, 'days').format('YYYY-MM-DD');
        } else if (key === 'thisweek') {
            datef = moment().startOf('isoweek').format('YYYY-MM-DD');
            datet = moment().format('YYYY-MM-DD');
        } else if (key === 'lastweek') {
            datef = moment().subtract(1, 'weeks').startOf('isoweek').format('YYYY-MM-DD');
            datet = moment().subtract(1, 'weeks').endOf('isoweek').format('YYYY-MM-DD');
        } else if (key === 'thismonth') {
            datef = moment().startOf('month').format('YYYY-MM-DD');
            datet = moment().format('YYYY-MM-DD');
        } else if (key === 'lastmonth') {
            datef = moment().subtract(1, 'months').startOf('month').format('YYYY-MM-DD');
            datet = moment().subtract(1, 'months').endOf('month').format('YYYY-MM-DD');
        } else{  
        }
        this.setState({ datef, datet,data:[],refreshing:true }, () => {
            waterfall([
                (callback) => {
                    this.getData(() => {
                        callback(null, 'next');
                    });
                },
                (next, callback) => {
                    this.getOrder(() => {
                        callback(null, 'next');
                    });
                },
                (next, callback) => {
                    this.getTotalProduct(() => {
                        callback(null, 'next');
                    });
                },
            ], () => {
                this.renderChart();
            });
        });
    }


    // test
    onChangePicker(v) {
        if (v === 'options') {
            // this.showDateTimePicker();
            this.onVisibleLocal1()
        } else {
            this.setState({ selectedValue: v });
            this.getDate(v);
        }
    }

    showDateTimePicker = () => {
        this.setState({ isDateTimePickerVisible: true });
    };

    hideDateTimePicker = () => {
        this.setState({ isDateTimePickerVisible: false });
    };

    onConfirm = (date) => {
        this.setState({})
        this.hideDateTimePicker();
    };

    showDateIOS(options) {
        const tmp = ['Hủy'];
        options.map((v) => tmp.push(v.label));
        ActionSheetIOS.showActionSheetWithOptions(
            { options: tmp, cancelButtonIndex: 0 }, (index) => {
                if (index !== 0) {
                    if (options[index - 1].value === 'options') {
                        this.showDateTimePicker();
                    } else {
                        this.setState({ selectedValue: options[index - 1].value, selectedLabel: tmp[index] });
                        this.getDate(options[index - 1].value);
                    }
                }
            },
        );
    }

    onVisibleLocal1 = () => {
        const { visible_tab1 } = this.state;
        this.setState({ visible_tab1: !visible_tab1 });
    }

    onVisibleLocal = (data) => {
        const { visible_tab1 } = this.state ;
        this.getDate1(data)
        this.setState({ visible_tab1: !visible_tab1 }) ;

    }

    // ensd test


    // tesst chart

    renderChart= ()=>{
        const { datet, datef,data } = this.state;
        if(!isEmpty(data)){
            let numberdatef = parseFloat(moment(datef,'YYYY-MM-DD').format('M'));
            let numberdatet = parseFloat(moment(datet,'YYYY-MM-DD').format('M'));
            let numberdayf = parseFloat(moment(datef,'YYYY-MM-DD').format('DD'));
            let numberdayt = parseFloat(moment(datet,'YYYY-MM-DD').format('DD'));
            if(numberdatef===numberdatet) {
                let space_day = numberdayt - numberdayf;
                let space ='';
                if(space_day >=0 && space_day <=7){
                    space = 0
                } else if(space_day >=8 && space_day <=14){
                    space = 1
                // this.setState({space});
                } else if(space_day >=15 && space_day <=21){
                    space = 2
                } else if(space_day >=22 && space_day <=27){
                    space = 3
                } else if(space_day >=28 ){
                    space = 4
                }
                let info1 = [];
                if(!isEmpty(data)&& isNumber(space)){
                    forEach(data, (v, k) => {
                        if(space ==0 || space ==1){
                            info1.push(v);
                        }else{
                            if(k%space == 0){
                                info1.push(v);
                            }
                        }  
                    });
                } 
                this.setState({space,label:info1,listReport:data,type:''});
            }else{
                let numberdatef = parseFloat(moment(datef,'YYYY-MM-DD').format('M'));
                let numberdatet = parseFloat(moment(datet,'YYYY-MM-DD').format('M'));
                let numberyearf = parseFloat(moment(datef,'YYYY-MM-DD').format('YYYY'));
                let numberyeart = parseFloat(moment(datet,'YYYY-MM-DD').format('YYYY'));
                let listMonth =[];
                let options = [];
                let listTotal = [];
                forEach(data, (v, k) => {
                    let a = parseFloat(moment(v['date'],'YYYY-MM-DD').format('M'));
                    // let b = (moment(v['date'],'YYYY-MM-DD').format('YYYY-MM'));
                    // let c = parseFloat(moment(v['date'],'YYYY-MM-DD').format('YYYY'));
                    let b = (moment(v['date'],'DD/MM/YYYY').format('YYYY-MM'));
                    let c = parseFloat(moment(v['date'],'DD/MM/YYYY').format('YYYY'));
                    let object1 = {month:a};
                    let object2 = {year_month:b};
                    let object3 = {year:c};
                    v1 = {...object1, ...v,...object2,...object3};
                    options.push(v1);
                });
                if(numberyearf > numberyeart){
                    this.setState({listReport:[]});
                }else if(numberyearf == numberyeart){
                    if(numberdatef>numberdatet){
                        this.setState({listReport:[]});
                    }else if(numberdatef<numberdatet){
                        for (i = numberdatef; i <= numberdatet; i++) { 
                            listMonth.push(i) 
                        }
                        if(!isEmpty(listMonth)){
                            forEach(listMonth, (v, k) => {
                                let getTotal= options.reduce(function(sum, record){
                                    if(record.month == v) return sum + record.totalAll;
                                    else return sum;
                                }, 0);
                                let month_year = `${v}-${numberyeart}`;
                                let object4 = {totalAll:getTotal,date:month_year}
                                listTotal.push(object4);
                            });
                        }
                        this.setState({label:listTotal,listReport:listTotal,type:'month'});
                    }
                }else if(numberyearf < numberyeart){
                    let listMonthf =[];
                    let listMontht =[];
                    if(numberyearf+1 == numberyeart ){
                        for (i = numberdatef; i <= 12; i++) { 
                            listMonthf.push(i) 
                        }
                        for (i = 1; i <= numberdatet; i++) { 
                            listMontht.push(i) 
                        }
                        if(!isEmpty(listMonthf)){
                            forEach(listMonthf, (v, k) => {
                                let getTotal= options.reduce(function(sum, record){
                                    if(record.month == v && record.year == numberyearf) return sum + record.totalAll;
                                    else return sum;
                                }, 0);
                                let month_year = `${v}-${numberyeart}`;
                                let object4 = {totalAll:getTotal,date:month_year}
                                listTotal.push(object4);
                            });
                        }
                        if(!isEmpty(listMontht)){
                            forEach(listMontht, (v, k) => {
                                let getTotal= options.reduce(function(sum, record){
                                    if(record.month == v && record.year == numberyeart) return sum + record.totalAll;
                                    else return sum;
                                }, 0);
                                let month_year = `${v}-${numberyeart}`;
                                let object4 = {totalAll:getTotal,date:month_year}
                                listTotal.push(object4);
                            });
                        }
                    
                        this.setState({label:listTotal,listReport:listTotal,type:'month'});
                    }else{
                        this.setState({listReport:[],type:'month'});
                        showMessage({
                            message: "Bạn phải lựa chọn khoảng cách nho hơn 2 năm",
                            description: "",
                            type: "error",
                        });
                    }
                }           
            }
        }
        this.setState({animating:false})
    }

    // end chart
    render() {
        const { animating,selectedValue, selectedLabel,visible_tab1, total_product_sell,total_product_return, datef, datet, depot_id, refreshing, data,get_total_chi,get_total_thu,get_tm,get_ck,total_order_return,total_order_sell,total_price_return,total_price_return_khac,total_price_sell,total_price_sell_khac } = this.state;
        const { checked, colors, selectedColumn,space,label,listReport,type } = this.state;
        const { key, value } = selectedColumn;
        const { navigation } = this.props;
        const options = [
            { value: '7days', label: '7 ngày qua' },
            { value: 'today', label: 'Hôm nay' },
            { value: 'yesterday', label: 'Hôm qua' },
            { value: 'thisweek', label: 'Tuần này' },
            { value: 'lastweek', label: 'Tuần trước' },
            { value: 'thismonth', label: 'Tháng này' },
            { value: 'lastmonth', label: 'Tháng trước' },
            { value: 'options', label: 'Tùy chọn...' },
        ];
        //test 
        let info;
        if (!isEmpty(listReport)) {
            info = listReport.map((v,k) => ({
                ...v,
                totalAll: {
                    value: v.totalAll,
                    svg: {
                        onPress: () => {
                            if (key === k) {
                                this.setState({ selectedColumn: { key: '', value: 0 } })
                            } else {
                                this.setState({ selectedColumn: { key: k, value: v.totalAll } })
                            }
                        }
                    }
                }
            }))

        }
        const Labels = (props) => {
            const { x, y, data } = props;
            if (!isEmpty(listReport)) {
                return data.map((value, index) => {
                    const sum = value.totalAll.value;
                    const pX = x(index) + x.bandwidth() / 2;
                    const pY = y(sum) - 10;
                    return (
                        <TextSVG
                            key={index}
                            x={pX}
                            y={pY}
                            fontSize={13}
                            fill='red'
                            alignmentBaseline={'middle'}
                            textAnchor={'middle'}
                        >
                            {key === index ? parseFloat(sum / 1000000).toFixed(2) : null}
                        </TextSVG>
                    )
                });
            }
        }
        // end
        if (animating) {
            return <ActivityIndicator
                size="large" color="#0000ff"
            />
        }
        return (
            <ScrollView
                style={{ flex: 1 ,flexDirection: 'column',}}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={() => this.getData()}
                    />
                }
            >
                <View>
                <View style={{ marginLeft: 0 }}>
                    {Platform.OS === 'ios'
                        ? (
                            <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => this.showDateIOS(options)}>
                                <Text style={{ marginRight: 10 }}>{selectedLabel}</Text>
                                <Icon
                                    name='ios-arrow-down'
                                    size={17}
                                    color="#000"
                                />
                            </TouchableOpacity>
                        )
                        : (
                            <Picker
                                selectedValue={selectedValue}
                                style={{ height: 50, width: 200, textAlign: 'center' }}
                                onValueChange={(v) => this.onChangePicker(v)}
                            >
                                {options.map((v, k) => <Picker.Item key={k} label={v.label} value={v.value} />)}
                            </Picker>
                        )
                    }
                </View>
                <DateTimePickerCT
                    isVisible={visible_tab1}
                    date_to=''
                    date_from=''
                    onConfirm={(data) => this.onVisibleLocal(data)}
                    onCancel={() => this.onVisibleLocal1()}
                />
                <DateTimePicker
                    isVisible={this.state.isDateTimePickerVisible}
                    onConfirm={this.onConfirm}
                    onCancel={this.hideDateTimePicker}
                />
                {/* <Modal_DateOptions getDate={this.getDate}  getDate1={this.getDate1} /> */}
                {/* <ReportRevenue {...this.props} data={data} refreshing={refreshing} datef={datef} datet={datet} depot_id={depot_id} /> */}
                {/* test */}

                <View style={styles.container}>
                    <TouchableOpacity onPress={() => navigation.navigate('RevenueDetailEndDay', { depot_id, datet, datef })}>
                        <View style={{ flexDirection: 'row', marginLeft: 10, marginRight: 10, marginTop: 10 }}>
                        <Text style={{ flex: 1 }}>Tổng (Thu-Chi)</Text>
                            <Text style={{ flex: 1, textAlign: 'right' }}>
                                <Icon
                                    name='ios-arrow-forward'
                                    size={17}
                                    color='#000'
                                />
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <View style={{ height: 300, flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        {(!isEmpty(listReport) && !refreshing && isNumber(space)) && !isEmpty(label)  && isEmpty(type)? (
                            <View style={styles.chart}>
                                <YAxis
                                    style={{ marginBottom: 20 }}
                                    data={info}
                                    formatLabel={(value) => parseFloat(value / 1000000) + 'tr'}
                                    yAccessor={({ item }) => item.totalAll.value}
                                    contentInset={{ top: 20, bottom: 10 }}
                                    svg={{ fontSize: 10, fill: 'grey' }}
                                />
                                <View style={{ flex: 1, marginLeft: 5 }}>
                                    <StackedBarChart
                                        style={{ flex: 1 }}
                                        keys={['totalAll']}
                                        colors={colors}
                                        data={info}
                                        spacingInner={0.5}
                                        spacingOuter={0.5}
                                        contentInset={{ top: 20 }}
                                        valueAccessor={({ item, key }) => item[key].value}
                                    >
                                        <Labels />
                                        <Grid />
                                    </StackedBarChart>
                                    <View style={styles.line} />
                                    <XAxis
                                        style={{ marginTop: 10 }}
                                        data={label}
                                        formatLabel={(index) => {
                                            if(space == 0){
                                                return (parseInt(moment(info[index].date, 'DD/MM/YYYY').format('DD')))
                                            }else{
                                                return ((parseInt(moment(info[index].date, 'DD/MM/YYYY').format('DD'))-1)*space+1)
                                            }
                                        
                                        }}
                                        scale={scale.scaleBand}
                                        spacingInter={0.05}
                                        spacingOuter={0.05}
                                        contentInset={{ left: 10, right: 10 }}
                                        svg={{ fontSize: 13, fill: 'black' }}
                                    />
                                </View>
                            </View>
                        ) : (
                                <Text style={{ color: '#b06a13' }}>Chưa có dữ liệu</Text>
                            )}
                        {!isEmpty(listReport) && !isEmpty(label) && !isEmpty(type) && !refreshing ? (
                            <View style={styles.chart}>
                                <YAxis
                                    style={{ marginBottom: 20 }}
                                    data={info}
                                    formatLabel={(value) => parseFloat(value / 1000000) + 'tr'}
                                    yAccessor={({ item }) => item.totalAll.value}
                                    contentInset={{ top: 20, bottom: 10 }}
                                    svg={{ fontSize: 10, fill: 'grey' }}
                                />
                                <View style={{ flex: 1, marginLeft: 5 }}>
                                    <StackedBarChart
                                        style={{ flex: 1 }}
                                        keys={['totalAll']}
                                        colors={colors}
                                        data={info}
                                        spacingInner={0.5}
                                        spacingOuter={0.5}
                                        contentInset={{ top: 20 }}
                                        valueAccessor={({ item, key }) => item[key].value}
                                    >
                                        <Labels />
                                        <Grid />
                                    </StackedBarChart>
                                    <View style={styles.line} />
                                    <XAxis
                                        style={{ marginTop: 10 }}
                                        data={label}
                                        formatLabel={(index) => {
                                            return (info[index].date)
                                        }}
                                        scale={scale.scaleBand}
                                        spacingInter={0.05}
                                        spacingOuter={0.05}
                                        contentInset={{ left: 10, right: 10 }}
                                        svg={{ fontSize: 13, fill: 'black' }}
                                    />
                                </View>
                            </View>
                        ) : (
                                <Text style={{ color: '#b06a13' }}>Chưa có dữ liệu</Text>
                            )}
                    </View>
                </View>
                {/* end */}
                <View style={{ flex: 3 ,flexDirection: 'column',}}>
                    <View >
                        <View style={{height: 40, backgroundColor: '#ccbdbd'}} >
                            <View style={{flex: 1, flexDirection: 'row',marginLeft:5}}>
                                <View style={{width: 100}} >
                                    <Text style={{fontSize:13}}>Tổng kết thu chi</Text> 
                                </View>
                            </View>
                        </View>
                        <View style={{height: 40, backgroundColor: 'white'}} >
                            <View style={{flex: 1, flexDirection: 'row',marginLeft:5}}>
                                <View style={{width: 100}} >
                                    <Text style={{fontSize:15}}>Tổng thu</Text> 
                                </View>
                                <View style={{width: 170}} >
                                    <Text style={{fontSize:15}}></Text> 
                                </View>
                                <View style={{width: 100,fontSize:20}} >
                                    <Text style={{fontSize:15}}>{get_total_thu.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")} </Text>
                                </View>
                            </View>
                        </View>
                        <View style={{height: 40, backgroundColor: 'white'}} >
                            <View style={{flex: 1, flexDirection: 'row',marginLeft:5}}>
                                <View style={{width: 100}} >
                                    <Text style={{fontSize:15}}>Tổng chi</Text> 
                                </View>
                                <View style={{width: 170}} >
                                    <Text style={{fontSize:15}}></Text> 
                                </View>
                                <View style={{width: 100,fontSize:20}} >
                                    <Text style={{fontSize:15}}>{get_total_chi.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")} </Text>
                                </View>
                            </View>
                        </View>
                        <View style={{height: 60, backgroundColor: 'white'}} >
                            <View style={{flex: 1, flexDirection: 'row',marginLeft:5}}>
                                <View style={{width: 100}} >
                                    <Text style={{fontSize:15}}>Thu-chi</Text> 
                                </View>
                                <View style={{width: 100}} >
                                    <Text style={{fontSize:15}}></Text> 
                                </View>
                                <View style={{width: 100,fontSize:20}} >
                                    <Text style={{fontSize:15}}>{(get_total_thu-get_total_chi).toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")}</Text>
                                </View>
                                <View style={{width: 30,fontSize:20}} >
                                    <Icon
                                        name="ios-arrow-forward"
                                        size={20}
                                        color="red"
                                        onPress={() => navigation.navigate('RevenueDetailEndDay', { depot_id, datet, datef })}
                                    />
                                </View>
                            </View>
                        </View>
                    </View>
                    <View >
                        <View style={{height: 40, backgroundColor: '#ccbdbd'}} >
                            <View style={{flex: 1, flexDirection: 'row',marginLeft:5}}>
                                <View style={{width: 200}} >
                                    <Text style={{fontSize:13}}>Phương thức thanh toán</Text> 
                                </View>
                            </View>
                        </View>
                        <View style={{height: 40, backgroundColor: 'white'}} >
                            <View style={{flex: 1, flexDirection: 'row',marginLeft:5}}>
                                <View style={{width: 100}} >
                                    <Text style={{fontSize:15}}>Tiền mặt</Text> 
                                </View>
                                <View style={{width: 170}} >
                                    <Text style={{fontSize:15}}></Text> 
                                </View>
                                <View style={{width: 100,fontSize:20}} >
                                    <Text style={{fontSize:15}}>{get_tm.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")}</Text>
                                </View>
                            </View>
                        </View>
                        <View style={{height: 40, backgroundColor: 'white'}} >
                            <View style={{flex: 1, flexDirection: 'row',marginLeft:5}}>
                                <View style={{width: 100}} >
                                    <Text style={{fontSize:15}}>Chuyển khoản</Text> 
                                </View>
                                <View style={{width: 170}} >
                                    <Text style={{fontSize:15}}></Text> 
                                </View>
                                <View style={{width: 100,fontSize:20}} >
                                    <Text style={{fontSize:15}}>{get_ck.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")} </Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View >
                        <View style={{height: 40, backgroundColor: '#ccbdbd'}} >
                            <View style={{flex: 1, flexDirection: 'row',marginLeft:5}}>
                                <View style={{width: 200}} >
                                    <Text style={{fontSize:13}}>Tổng kết bán hàng</Text> 
                                </View>
                            </View>
                        </View>
                        <View style={{height: 60, backgroundColor: 'white'}} >
                            <View style={{flex: 1, flexDirection: 'row',marginLeft:5}}>
                                <View style={{width: 100}} >
                                    <Text style={{fontSize:15}}>Hóa đơn</Text> 
                                </View>
                                <View style={{width: 150}} >
                                    <Text style={{fontSize:15}}></Text> 
                                </View>
                                <View style={{width: 80,fontSize:20}} >
                                    <Text style={{fontSize:15}}>{total_order_sell} </Text>
                                </View>
                                <View style={{width: 20,fontSize:20}} >
                                    <Icon
                                        name="ios-arrow-forward"
                                        size={20}
                                        color="red"
                                        onPress={() => navigation.navigate('RevenueDetail', { depot_id, datet, datef })}
                                    />
                                </View>
                            </View>
                        </View>
                        <View style={{height: 40, backgroundColor: 'white'}} >
                            <View style={{flex: 1, flexDirection: 'row',marginLeft:5}}>
                                <View style={{width: 100}} >
                                    <Text style={{fontSize:15}}>Số lượng sản phẩm</Text> 
                                </View>
                                <View style={{width: 150}} >
                                    <Text style={{fontSize:15}}></Text> 
                                </View>
                                <View style={{width: 80,fontSize:20}} >
                                    <Text style={{fontSize:15}}>{total_product_sell}</Text>
                                </View>
                                <View style={{width: 20,fontSize:20}} >
                                    <Icon
                                        name="ios-arrow-forward"
                                        size={20}
                                        color="red"
                                        onPress={() => navigation.navigate('List_Product', { depot_id, datet, datef,tottalProduct:total_product_sell })}
                                    />
                                </View>
                            </View>
                        </View>
                        <View style={{height: 60, backgroundColor: 'white'}} >
                            <View style={{flex: 1, flexDirection: 'row',marginLeft:5}}>
                                <View style={{width: 100}} >
                                    <Text style={{fontSize:15}}>Doanh thu</Text> 
                                </View>
                                <View style={{width: 170}} >
                                    <Text style={{fontSize:15}}></Text> 
                                </View>
                                <View style={{width: 100,fontSize:20}} >
                                    <Text style={{fontSize:15}}>{total_price_sell.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")}</Text>
                                </View>
                            </View>
                        </View>
                        <View style={{height: 60, backgroundColor: 'white'}} >
                            <View style={{flex: 1, flexDirection: 'row',marginLeft:5}}>
                                <View style={{width: 100}} >
                                    <Text style={{fontSize:15}}>Thu khác</Text> 
                                </View>
                                <View style={{width: 170}} >
                                    <Text style={{fontSize:15}}></Text> 
                                </View>
                                <View style={{width: 100,fontSize:20}} >
                                    <Text style={{fontSize:15}}>{total_price_sell_khac}</Text>
                                </View>
                            </View>
                        </View>
                        <View style={{height: 60, backgroundColor: 'white'}} >
                            <View style={{flex: 1, flexDirection: 'row',marginLeft:5}}>
                                <View style={{width: 100}} >
                                    <Text style={{fontSize:15}}> Thực thu</Text> 
                                </View>
                                <View style={{width: 170}} >
                                    <Text style={{fontSize:15}}></Text> 
                                </View>
                                <View style={{width: 100,fontSize:20}} >
                                    <Text style={{fontSize:15}}>{total_price_sell-total_price_sell_khac}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View >
                        <View style={{height: 40, backgroundColor: '#ccbdbd'}} >
                            <View style={{flex: 1, flexDirection: 'row',marginLeft:5}}>
                                <View style={{width: 200}} >
                                    <Text style={{fontSize:13}}>Trả hàng</Text> 
                                </View>
                            </View>
                        </View>
                        <View style={{height: 60, backgroundColor: 'white'}} >
                            <View style={{flex: 1, flexDirection: 'row',marginLeft:5}}>
                                <View style={{width: 100}} >
                                    <Text style={{fontSize:15}}>Hóa đơn</Text> 
                                </View>
                                <View style={{width: 150}} >
                                    <Text style={{fontSize:15}}></Text> 
                                </View>
                                <View style={{width: 80,fontSize:20}} >
                                    <Text style={{fontSize:15}}>{total_order_return} </Text>
                                </View>
                                <View style={{width: 20,fontSize:20}} >
                                    <Icon
                                        name="ios-arrow-forward"
                                        size={20}
                                        color="red"
                                        // onPress={() => navigation.navigate('RevenueDetailTH', { depot_id, datet, datef,type:'TH' })}
                                        onPress={() => navigation.navigate('RevenueDetail', { depot_id, datet, datef,type:'TH' })}
                                    />
                                </View>
                            </View>
                        </View>
                        <View style={{height: 40, backgroundColor: 'white'}} >
                            <View style={{flex: 1, flexDirection: 'row',marginLeft:5}}>
                                <View style={{width: 100}} >
                                    <Text style={{fontSize:15}}>Số lượng sản phẩm</Text> 
                                </View>
                                <View style={{width: 150}} >
                                    <Text style={{fontSize:15}}></Text> 
                                </View>
                                <View style={{width: 80,fontSize:20}} >
                                    <Text style={{fontSize:15}}>{total_product_return}</Text>
                                </View>
                                <View style={{width: 20,fontSize:20}} >
                                    <Icon
                                        name="ios-arrow-forward"
                                        size={20}
                                        color="red"
                                        onPress={() => navigation.navigate('List_Product', { depot_id, datet, datef,type:'TH',tottalProduct:total_product_return })}
                                    />
                                </View>
                            </View>
                        </View>
                        <View style={{height: 60, backgroundColor: 'white'}} >
                            <View style={{flex: 1, flexDirection: 'row',marginLeft:5}}>
                                <View style={{width: 100}} >
                                    <Text style={{fontSize:15}}>Tổng tiền hàng trả</Text> 
                                </View>
                                <View style={{width: 170}} >
                                    <Text style={{fontSize:15}}></Text> 
                                </View>
                                <View style={{width: 100,fontSize:20}} >
                                    <Text style={{fontSize:15}}>{total_price_return.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")}</Text>
                                </View>
                            </View>
                        </View>
                        <View style={{height: 60, backgroundColor: 'white'}} >
                            <View style={{flex: 1, flexDirection: 'row',marginLeft:5}}>
                                <View style={{width: 100}} >
                                    <Text style={{fontSize:15}}>Hoàn trả thu khác</Text> 
                                </View>
                                <View style={{width: 170}} >
                                    <Text style={{fontSize:15}}></Text> 
                                </View>
                                <View style={{width: 100,fontSize:20}} >
                                    <Text style={{fontSize:15}}>{total_price_return_khac.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")}</Text>
                                </View>
                            </View>
                        </View>
                        {/* <View style={{height: 60, backgroundColor: 'white'}} >
                            <View style={{flex: 1, flexDirection: 'row',marginLeft:5}}>
                                <View style={{width: 100}} >
                                    <Text style={{fontSize:15}}> Phí trả hàng</Text> 
                                </View>
                                <View style={{width: 170}} >
                                    <Text style={{fontSize:15}}></Text> 
                                </View>
                                <View style={{width: 100,fontSize:20}} >
                                    <Text style={{fontSize:15}}>0</Text>
                                </View>
                            </View>
                        </View> */}
                        <View style={{height: 60, backgroundColor: 'white'}} >
                            <View style={{flex: 1, flexDirection: 'row',marginLeft:5}}>
                                <View style={{width: 100}} >
                                    <Text style={{fontSize:15}}> Thực trả</Text> 
                                </View>
                                <View style={{width: 170}} >
                                    <Text style={{fontSize:15}}></Text> 
                                </View>
                                <View style={{width: 100,fontSize:20}} >
                                    <Text style={{fontSize:15}}>{(total_price_return-total_price_return_khac).toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>   
                </View>       
            </ScrollView>
        )
    }
}

Report.navigationOptions = {
    title: 'Báo cáo cuối ngày',
};

const stocktakesCss = StyleSheet.create({
    menu_action:{
        backgroundColor:'#ddd',
        padding:10,
        justifyContent: 'flex-end',
        flexDirection: 'row',
    },
    stocktakesCss_list_right:{
        textAlign:'right',
    },
    stocktakesCss_list_code:{
        fontWeight:'700',
        fontSize:15,
        marginBottom: 5,
    },
    stocktakesCss_list_time:{
        fontSize:12,
        fontStyle:'italic',
        color:'#545454'
    },
    stocktakesCss_list_status:{
        fontSize:13,
        marginTop:5,
        color:'#545454'
    },
    stocktakesCss_list_user:{
        fontSize:12,
        color:'#28af6b',
        textAlign:'right',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'flex-end'
    },
    stocktakesCss_list_link:{
        paddingLeft: 5,
    },
    stocktakesCss_list_box:{
        flex:1,
        padding:10,
        flexDirection:'row',
        alignItems:'center',
        justifyContent: 'space-between',
        //backgroundColor: this.props.index % 2  == 0 ? 'red' : 'yellow'
    },
    stocktakesCss_list:{
        marginBottom:150,
        paddingBottom: 150,
    },
    createStockTake_box:{
        flex:1,
    },
    createStockTake_main:{
        paddingVertical:10,
        alignItems:'center'
    },
    search_form_control:{
        backgroundColor:'#fff',
        flex:30,
        padding:0,
    },
    search_form_input:{
        fontSize:14,
        paddingHorizontal: 10,
    },
    search_icon:{
        marginLeft:0,
    }
});

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    chart: {
        marginTop: 10,
        marginLeft: 10,
        marginRight: 10,
        height: 300,
        flexDirection: 'row'
    },
    line: {
        borderBottomWidth: 1,
        borderColor: '#d1cfcf'
    },
    hline: {
        borderLeftWidth: 1,
        borderColor: '#f48a92',
        marginLeft: 5,
        marginBottom: 30,
        marginTop: 10,
    },
});