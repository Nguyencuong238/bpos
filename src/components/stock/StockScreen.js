import qs from 'qs';
import React, { Component } from 'react';
import { StyleSheet, ActionSheetIOS, Text, View, StatusBar, TouchableOpacity, Platform, FlatList, Alert, Picker, Item, RefreshControl, ScrollView, ActivityIndicator, TouchableHighlight, TextInput } from 'react-native';
import axios from 'axios';
import moment from 'moment';
import Icon from "react-native-vector-icons/Ionicons";
import { Input, CheckBox, Button} from 'react-native-elements';
import { isEmpty, debounce } from 'lodash';
import { stock_api } from '../../services/api/fetch'
import ScrollableTabView, { DefaultTabBar } from 'react-native-scrollable-tab-view';
import DateTimePicker from "react-native-modal-datetime-picker";
import Modal from "react-native-modal";
import DateTimePickerCT from "../library/DateTimePickerCT";
import { stocktakesCss } from '../../styles/stock';
import { Main } from '../../styles/main';
import { goodsCss } from '../../styles/goods';

class StockScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            date: 'MONTHNOW',
            selectedLabel: 'Hôm nay',
            animating: true,
            modalVisible: false,
            listStock: [],
            listStock_Search: [],
            refreshing: false,
            page: 1,
            limit: 10,
            page_search: 1,
            loading: false,
            total: null,
            datef: '',
            datet: '',
            text: '',
            visible_check: {
                cb: false,
                pt: false,
                h: false,
            },
            visible_tab: false,
            refreshing_test: false,
            visible_tab1: false,
            // test
            isDateTimePickerVisibleform: false,
            isDateTimePickerVisibleto: false,
            date_picker: null,
            date_picker_type: 'from',
        };
    }

    componentWillReceiveProps() {
        const { listStock } = this.state;
        const { navigation } = this.props;
        const loadStock = navigation.getParam('loadStock', 'load');
        console.log(loadStock);
        // this.getListStock();
        if (!isEmpty(loadStock)) {
            this.setState({ listStock: [], animating: true, page: 1 }, () => {
                this.getListStock();
            })
        }
    }

    setModalVisible(visible) {
        this.setState({ modalVisible: visible });
    }

    onShowType = () => {
        this.props.navigation.navigate("CreateStockTake");
    }

    componentDidMount() {
        this.getListStock();
    }

    getListStock = async () => {
        const { page, limit, refreshing, listStock, total, loading, datef, datet, text } = this.state;
        // this.setState({loading:true,refreshing_test:false});
        this.setState({ loading: true });
        const offset = (page - 1) * limit;
        const params = {
            mtype: 'listInventory',
            type: 'KK',
            depot_id: 1,
            limit,
            offset,
            keyword: text,
        };
        console.log(params)
        console.log('xxxxxx')
        stock_api(params).then((data) => {
            if (isEmpty(data.listOrder) && page == 1) {
                this.setState({ listStock: [], refreshing: false, loading: false, animating: false, refreshing_test: false });
            } else {
                this.setState({ listStock: [...listStock, ...data.listOrder], refreshing: false, loading: false, animating: false, refreshing_test: false });
            }

        })
    }

    getListStockSearch = async () => {
        const { page, limit, datef, datet, text, listStock } = this.state;
        // this.setState({loading:true,refreshing_test:false});
        this.setState({ loading: true });
        const offset = (page - 1) * 10;
        const params = {
            mtype: 'listInventory',
            type: 'KK',
            depot_id: 1,
            limit,
            offset,
            datef,
            datet,
            keyword: text,
        };
        stock_api(params).then((data) => {
            if (isEmpty(data.listOrder) && page == 1) {
                this.setState({ listStock: [], refreshing: false, loading: false, animating: false, refreshing_test: false });
                // this.setState({animating:false})
            } else {
                this.setState({ listStock: [...listStock, ...data.listOrder], refreshing: false, loading: false, animating: false, refreshing_test: false });
            }
            // this.setState({listStock : [...listStock, ...data.listOrder],refreshing:false,loading:false,animating:false,refreshing_test:false},()=>{
            // });

        })

    }



    _renderItem = (item, index) => {
        return (
            <TouchableOpacity
                onPress={() => this.props.navigation.navigate('StockScreenDetail', {
                    itemId: item
                })}
            >
                <View>
                    <View style={stocktakesCss.stocktakesCss_list_box}>
                        <View style={stocktakesCss.stocktakesCss_list_left}>
                            <Text style={stocktakesCss.stocktakesCss_list_code}>{item.invoice}</Text>
                            <Text style={stocktakesCss.stocktakesCss_list_time}>{item.created_at}</Text>
                            <Text style={stocktakesCss.stocktakesCss_list_time}>{item.create_time}</Text>
                        </View>
                        <View >
                            <Text style={stocktakesCss.stocktakesCss_list_status}>
                                {item.status === 0 && 'Phiếu tạm'}
                                {item.status === 1 && 'Đã cân bằng kho'}
                            </Text>
                            <View style={stocktakesCss.stocktakesCss_list_user} >
                                <Icon
                                    name='ios-person'
                                    size={14}
                                    color='#28af6b'
                                />
                                <Text style={stocktakesCss.stocktakesCss_list_user_name}>{item.user.full_name}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{
                        height: 1,
                        backgroundColor: '#ddd'
                    }}>
                    </View>
                </View>
            </TouchableOpacity>

        );
    };

    _onRefresh = () => {
        this.setState({ refreshing: true, page: 1, animating: true, listStock: [], text: '', datet: '', datef: '', refreshing_test: false }, () => {
            this.getListStock();
        });

    }

    renderSeparator = () => {
        return (
            <View
            />
        );
    };

    // renderFooter = () => {
    //     if (!this.state.refreshing) return null;
    //      return (
    //         <ActivityIndicator
    //          size="large" color="#0000ff"
    //         />
    //      );
    // };

    renderFooter = () => {
        if (this.state.refreshing_test) return null;
        return (
            <ActivityIndicator
                size="large" color="#0000ff"
            />
        );
    };

    handleLoadMore = () => {
        if (!this.onEndReachedCalledDuringMomentum) {
            const { page, total, datet, datef, keyword } = this.state;
            this.setState({ refreshing_test: true, page: page + 1 }, () => {
                if (!isEmpty(datet) || !isEmpty(datef) || !isEmpty(keyword)) {
                    this.getListStockSearch();
                } else {
                    this.getListStock();
                }

            })
            this.onEndReachedCalledDuringMomentum = true;
        }
    };

    onValueChangePicker = () => {
        const { date } = this.state;
        let datestart = '';
        let datetend = '';
        if (date == 'MONTHNOW') {
            datestart = moment().startOf('month').format("YYYY-MM-DD");
            datetend = moment().endOf("month").format("YYYY-MM-DD");
        } else if (date == 'NOW') {
            datestart = moment().startOf('day').format("YYYY-MM-DD");
            datetend = moment().endOf("day").format("YYYY-MM-DD");
        } else if (date == 'AGO') {
            datestart = moment().subtract(1, 'days').format("YYYY-MM-DD");
            datetend = moment().subtract(1, 'days').format("YYYY-MM-DD");
        } else if (date == 'WEEK') {
            datestart = moment().startOf('week').format("YYYY-MM-DD");
            datetend = moment().endOf("week").format("YYYY-MM-DD");
        } else if (date == 'MONTHAGO') {
            datestart = moment().subtract(1, 'months').startOf('month').format('YYYY-MM-DD');
            datetend = moment().subtract(1, 'months').endOf('month').format('YYYY-MM-DD');
        } else if (date == 'ALL') {
            // return this.getListStock();  
        } else if (date == 'OPTION') {
            // this.setState({visible_tab:true});
        }
        this.setState({ datef: datestart, datet: datetend, listStock_Search: [], listStock: [], page: 1, animating: true }, () => {
            this.getListStockSearch();
        })
    }



    visible_check = (type) => {
        const { visible_check } = this.state;
        visible_check.pt = false;
        visible_check.cb = false;
        visible_check.h = false;
        visible_check[type] = !visible_check[type];
        this.setState({ visible_check });
    }

    onVisibleLocal = (data) => {
        console.log(data);
        const { visible_tab1 } = this.state;
        this.setState({ visible_tab1: !visible_tab1 });
    }

    onVisibleLocalConfirm = () => {
        const { visible_tab1 } = this.state;
        this.setState({ visible_tab1: !visible_tab1, animating: true, listStock: [], page: 1 }, () => {
            this.getListStockSearch();
        });
    }

    renderDateOptions(options) {
        const htm = options.map((v, k) => {
            const idx = k + 1;
            return (
                <Item key={idx} label={v.label} value={v.value} />
            );
        });
        return htm;
    }

    onChangePicker(v) {
        if (v === 'OPTION') {
            this.onVisibleLocal();
            // this.showDateTimePicker();
        } else {
            this.setState({ date: v }, () => {
                this.onValueChangePicker()
            });
        }
    }

    showDateTimePicker = (type = null) => {
        const { isDateTimePickerVisibleform, isDateTimePickerVisibleto } = this.state;
        this.setState({

            isDateTimePickerVisibleform: !isDateTimePickerVisibleform,
            isDateTimePickerVisibleto: !isDateTimePickerVisibleto
        });
    };

    onConfirmForm = (date) => {
        this.setState({ isDateTimePickerVisibleform: false, datef: moment(date).format('YYYY-MM-DD') });
    };

    onConfirmTo = (date) => {
        this.setState({ isDateTimePickerVisibleto: false, datet: moment(date).format('YYYY-MM-DD') });
    };

    hideDateTimePickerTo = (date) => {
        this.setState({ isDateTimePickerVisibleto: false });
    };
    hideDateTimePickerFrom = (date) => {
        this.setState({ isDateTimePickerVisibleform: false });
    };

    showDateIOS(options) {
        const tmp = ['Hủy'];
        options.map((v) => tmp.push(v.label));
        ActionSheetIOS.showActionSheetWithOptions(
            { options: tmp, cancelButtonIndex: 0 }, (index) => {
                if (index !== 0) {
                    if (options[index - 1].value === 'OPTION') {
                        // this.showDateTimePicker();
                        this.onVisibleLocal();
                        this.showDateTimePicker();
                    } else {
                        // this.setState({ selectedValue: options[index - 1].value, selectedLabel: tmp[index] });
                        // this.setState({ selectedLabel: tmp[index] });
                        this.setState({ selectedLabel: tmp[index], date: options[index - 1].value }, () => {
                            this.onValueChangePicker()
                        });
                    }
                }
            },
        );
    }

    render() {
        const options = [
            { value: 'MONTHNOW', label: 'Tháng này' },
            { value: 'ALL', label: 'Toàn thời gian' },
            { value: 'NOW', label: 'Hôm nay' },
            { value: 'AGO', label: 'Hôm qua' },
            { value: 'WEEK', label: 'Tuần này' },
            { value: 'MONTHAGO', label: 'Tuần trước' },
            { value: 'OPTION', label: 'Tùy chọn' },
        ];
        const { selectedLabel, listStock, datef, datet, visible_check, animating, listStock_Search, visible_tab, visible_tab1, isDateTimePickerVisibleform, isDateTimePickerVisibleto } = this.state;
        if (animating) {
            return <ActivityIndicator
                size="large" color="#0000ff"
            />
        }
        return (
            <View>
                <StatusBar
                    backgroundColor="blue"
                    barStyle="light-content"
                />
                <View style={Main.select_box_main}>
                    {/* <TouchableOpacity style={Main.select_box_item}>
                        <Text style={Main.select_box_icon} >
                            <Icon
                                name='ios-calendar'
                                size={18}
                                color="#545454"
                            />  
                        </Text>
                        <Picker
                            selectedValue={this.state.date}
                            style={{height: 50, width: 100}}
                            onValueChange={(v) => this.onChangePicker(v)}
                        >
                            {this.renderDateOptions(options)}
                        </Picker>
                    </TouchableOpacity> */}
                    <TouchableOpacity style={Main.select_box_item}>
                        <View style={Main.select_box_icon} >
                            <Icon
                                name='ios-calendar'
                                size={20}
                                color="#545454"
                            />
                        </View>

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
                                    selectedValue={this.state.date}
                                    style={{ height: 50, width: 100 }}
                                    onValueChange={(v) => this.onChangePicker(v)}
                                >
                                    {this.renderDateOptions(options)}
                                </Picker>
                            )
                        }
                    </TouchableOpacity>
                    <View style={Main.select_box_item} >
                        <TouchableOpacity style={Main.select_box_item_action_icon} onPress={this._onPressSearch} >
                            <Icon
                                name='ios-search'
                                size={20}
                                color="#545454"
                                onPress={() => {
                                    this.setModalVisible(true);
                                }}
                            />
                        </TouchableOpacity>
                        <View style={{marginLeft:15}}>
                            <Icon
                                name="ios-add"
                                size={23}
                                color="#545454"
                                onPress={this.onShowType}
                            />
                        </View>
                    </View>
                </View>
                {!isEmpty(listStock)
                    && (

                        <View style={stocktakesCss.stocktakesCss_list} onPress={() => this.props.navigation.navigate('StockDetail')} >
                            {/* <ScrollView> */}
                            <FlatList
                                data={listStock}
                                refreshControl={
                                    <RefreshControl
                                        refreshing={this.state.refreshing}
                                        onRefresh={this._onRefresh}
                                    />
                                }
                                renderItem={({ item, index }) => {
                                    return (this._renderItem(item, index));
                                }}
                                keyExtractor={(item, index) => index.toString()}
                                ItemSeparatorComponent={this.renderSeparator}
                                ListFooterComponent={this.renderFooter}
                                onEndReachedThreshold={0.01}
                                onEndReached={this.handleLoadMore}
                                onMomentumScrollBegin={() => { this.onEndReachedCalledDuringMomentum = false; }}
                            >
                            </FlatList>
                            {/* </ScrollView> */}
                        </View>

                    )
                }
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
                                        <TextInput
                                            style={{ height: 40}}
                                            placeholder="Nhập từ khoá"
                                            onChangeText={(text) => this.setState({ text })}                                                value={this.state.txtName}
                                        />
                                    </View>
                                </View>
                                <View>
                                    <Text style={goodsCss.goods_search_title}>Trạng thái</Text>
                                </View>
                                <View style={{paddingHorizontal:7.5}}>
                                    <CheckBox
                                        title='Phiếu tạm'
                                        checked={visible_check.pt}
                                        onPress={() => {
                                            this.visible_check('pt')
                                        }}
                                    />
                                    <CheckBox
                                        title='Đã cân bằng kho'
                                        checked={visible_check.cb}
                                        onPress={() => {
                                            this.visible_check('cb')
                                        }}
                                    />
                                    <CheckBox
                                        title='Đã hủy'
                                        checked={visible_check.h}
                                        onPress={() => {
                                            this.visible_check('h')
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
                                    // this.setModalVisible(!this.state.modalVisible);
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
                                    this.setState({ page: 1, listStock_Search: [], listStock: [], page: 1, animating: true }, () => {
                                        this.getListStockSearch();
                                    })

                                }}
                                buttonStyle={[Main.btn_submit_button, Main.btn_submit_button_success]}
                                containerStyle={Main.btn_submit_button_box}
                                titleStyle={Main.btn_submit_button_title}
                            />
                        </View>
                    </View> 
                </Modal>

                <DateTimePickerCT
                    isVisible={visible_tab1}
                    date_to=''
                    date_from=''
                    onConfirm={(data) => this.onVisibleLocal(data)}
                    onCancel={() => this.onVisibleLocal()}
                />

                <Modal
                    isVisible={false}
                    onBackdropPress={() => this.onVisibleLocal()}
                >
                    <View style={styles.content}>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ flex: 1 }}>
                                <Text onPress={() => this.showDateTimePicker('from')}>Từ ngày:{datef}</Text>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text onPress={() => this.showDateTimePicker('to')}>Đến ngày:{datet}</Text>
                            </View>
                        </View>

                        <DateTimePicker
                            isVisible={this.state.isDateTimePickerVisibleform}
                            onConfirm={this.onConfirmForm}
                            onCancel={this.hideDateTimePickerFrom}
                        />
                        <DateTimePicker
                            isVisible={this.state.isDateTimePickerVisibleto}
                            onConfirm={this.onConfirmTo}
                            onCancel={this.hideDateTimePickerTo}
                        />

                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ flex: 1 }}>
                                <Button
                                    title="Bỏ qua"
                                    onPress={() => this.onVisibleLocal()}
                                />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Button
                                    title="Đồng ý"
                                    onPress={() => this.onVisibleLocalConfirm()}
                                />
                            </View>
                        </View>
                    </View>

                    {/* <ScrollableTabView
                        initialPage={0}
                        tabBarUnderlineStyle={{ backgroundColor: '#28af6b', height: 3 }}
                        tabBarActiveTextColor={{ color: 'red', backgroundColor: '#28af6b' }}
                        tabBarInactiveTextColor={{ color: 'red', backgroundColor: '#28af6b' }}
                        tabBarBackgroundColor={{ color: 'red', backgroundColor: '#28af6b' }}
                        tabBarTextStyle={{ color: '#000' }}

                    >
                        <ScrollView tabLabel='Từ'>

                            <DateTimePicker
                                isVisible={this.state.isDateTimePickerVisibleform}
                                onConfirm={this.onConfirmForm}
                                onCancel={this.hideDateTimePickerFrom}
                            />
                            <Text>Ngày bắt đầu :{datef}</Text>
                            <Button
                                title="Chọn thời gian"
                                onPress={() => this.showDateTimePicker()}
                            />

                        </ScrollView>
                        <ScrollView tabLabel='Đến'>
                            <Button
                                title="Chọn thời gian"
                                onPress={() => this.showDateTimePicker()}
                            />
                            <DateTimePicker
                                isVisible={this.state.isDateTimePickerVisibleto}
                                onConfirm={this.onConfirmTo}
                                onCancel={this.hideDateTimePickerTo}
                            />
                            <Text>Ngày bắt đầu :{datet}</Text>
                        </ScrollView>
                    </ScrollableTabView>
                    <Button
                        title="Bỏ qua"
                        onPress={() => this.onVisibleLocal()}
                    />
                    <Button
                        title="Đồng ý"
                        onPress={() => this.onVisibleLocalConfirm()}
                    /> */}
                </Modal>
            </View>
        );
    }
}

export default StockScreen;

StockScreen.navigationOptions = {
    title: 'Kiểm kho',
};

const styles = StyleSheet.create({
});