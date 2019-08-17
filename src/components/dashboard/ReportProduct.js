import React, { PureComponent } from 'react';
import { isEmpty } from 'lodash';
import { stock_api } from '../../services/api/fetch';
import { View, Text, Image, FlatList, TouchableOpacity, Platform, Picker, Item, 
    ActionSheetIOS } from 'react-native';
import { dashboardCss } from '../../styles/dashboard';
import { Main } from '../../styles/main';
import NumberFormat from 'react-number-format';
import Icon from "react-native-vector-icons/Ionicons";

export default class ReportProduct extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            // check_date: 2,
            // label: 'Tuần này',
            sort: 'quantity',
            dataSource: [],
            selectedValue: 2,
            selectedLabel: 'Hôm nay',
        };
    }

    componentDidMount() {
        this.getList();
    }

    getList() {
        const { selectedValue, sort } = this.state;
        const { depots } = this.props;
        const params = {
            mtype: 'DashboardChart',
            chart_by: selectedValue,
            depots,
            chart_type: 'product',
            sort,
        };
        this.setState({ loading: true });
        stock_api(params).then(({ chart }) => {
            this.setState({ loading: false, dataSource: chart });
        });
    }

    renderDateOptions(options) {
        const htm = options.map((v, k) => {
            const idx = k + 1;
            return (
                <Picker.Item key={idx} label={v.label} value={v.value} />
            );
        });
        return htm;
    }

    onChangePicker(v) {
        this.setState({ selectedValue: v }, () => {
            this.getList();
        });
    }

    showDateIOS(options) {
        const tmp = ['Hủy'];
        options.map((v) => tmp.push(v.label));
        ActionSheetIOS.showActionSheetWithOptions(
            { options: tmp, cancelButtonIndex: 0 }, (index) => {
                if (index !== 0) {
                    this.setState({ selectedValue: options[index - 1].value, selectedLabel: tmp[index] }, () => {
                        this.getList();
                    });
                }
            },
        );
    }

    renderList() {
        const { dataSource } = this.state;
        const dummy_image = "../../../assets/images/dummy-image-1.jpg";
        return (
            <FlatList
                data={dataSource}
                renderItem={({ item, index }) => {
                    return (
                        <View key={index}>
                            <View style={{
                                flex: 1,
                                paddingVertical: 10,
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between'
                                //backgroundColor: this.props.index % 2  == 0 ? 'red' : 'yellow'
                            }}
                            >
                                <View style={dashboardCss.dashboard_selling_top_ten_list_img}>
                                    {!isEmpty(item.image) ? (
                                        <Image
                                            style={{ width: 50, height: 50, resizeMode: 'contain', marginRight: 10, borderRadius: 4 }}
                                            source={{ uri: item.image }}
                                        />
                                    ) : (
                                            <Image
                                                style={{ width: 50, height: 50, resizeMode: 'contain', marginRight: 10, borderRadius: 4 }}
                                                source={require(dummy_image)}
                                            />
                                        )}
                                </View>
                                <View style={dashboardCss.dashboard_selling_top_ten_list_info}>
                                    <View style={dashboardCss.dashboard_selling_top_ten_list_info_top}>
                                        <Text style={[dashboardCss.dashboard_selling_top_ten_list_name, Main.font_bold]}>{item.name}</Text>
                                        <Text style={dashboardCss.dashboard_selling_top_ten_list_amount}>{parseFloat(item.total)}</Text>
                                    </View>
                                    <View style={dashboardCss.dashboard_selling_top_ten_list_info_top}>
                                        <Text style={dashboardCss.dashboard_selling_top_ten_list_amount}>{item.sku}</Text>
                                        <Text style={[dashboardCss.dashboard_selling_top_ten_list_price, Main.text_success]}>
                                            <NumberFormat
                                                value={parseFloat(item.price_doanhthu)}
                                                displayType={'text'}
                                                thousandSeparator={true}
                                                suffix={' đ'}
                                                renderText={value => <Text>{value}</Text>}
                                            />
                                        </Text>
                                    </View>
                                </View>
                            </View>
                            <View style={{
                                height: 1,
                                backgroundColor: '#ebebeb',
                            }}
                            />
                        </View>
                    );
                }}
            >
            </FlatList>
        );
    }

    render() {
        const { selectedValue, selectedLabel } = this.state;

        const options = [
            { value: 0, label: 'Hôm nay' },
            { value: 1, label: 'Hôm qua' },
            { value: 2, label: 'Tuần này' },
            { value: 5, label: 'Tuần trước' },
            { value: 3, label: 'Tháng này' },
            { value: 4, label: 'Tháng trước' },
        ];

        return (
            <View style={[dashboardCss.dashboard_total_revenue_main, dashboardCss.dashboard_box]}>
                <View style={dashboardCss.dashboard_total_revenue_top}>
                    <Text style={[dashboardCss.dashboard_title, Main.font_bold]}>Sản phẩm bán chạy</Text>
                    {Platform.OS === 'ios'
                        ? (
                            <TouchableOpacity style={[Main.select_box_item, dashboardCss.dashboard_total_revenue_select]} onPress={() => this.showDateIOS(options)}>
                                <Text style={{ paddingRight: 5, fontSize: 14 }}>{selectedLabel}</Text>
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
                                style={{ height: 50, width: 150 }}
                                onValueChange={(v) => this.onChangePicker(v)}
                            >
                                {this.renderDateOptions(options)}
                            </Picker>
                        )
                    }
                </View>
                <View style={dashboardCss.dashboard_selling_top_ten_list}>
                    {this.renderList()}
                </View>
                {/* <TouchableOpacity style={dashboardCss.dashboard_selling_top_ten_view_all}>
                    <Text style={{ paddingRight: 5, fontSize: 15, color: '#28af6b' }}>Tất cả</Text>
                    <Text style={Main.select_box_icon}>
                        <Icon
                            name='ios-arrow-round-forward'
                            size={25}
                            color="#28af6b"
                        />
                    </Text>
                </TouchableOpacity> */}
            </View>
        );
    }
}
