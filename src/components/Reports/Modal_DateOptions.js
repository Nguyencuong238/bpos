import React, { Component } from 'react';
import { View, TouchableOpacity, Text, Picker, ActionSheetIOS, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import DateTimePicker from "react-native-modal-datetime-picker";
import moment from 'moment';

export default class Modal_DateOptions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            date: new Date(),
            selectedValue: '7days',
            selectedLabel: '7 ngày qua',
            isDateTimePickerVisible: false,
        };
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
        const { getDate } = this.props;
        if (v === 'options') {
            this.showDateTimePicker();
        } else {
            this.setState({ selectedValue: v });
            if (getDate) getDate(v);
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
        const { getDate } = this.props;
        const tmp = ['Hủy'];
        options.map((v) => tmp.push(v.label));
        ActionSheetIOS.showActionSheetWithOptions(
            { options: tmp, cancelButtonIndex: 0 }, (index) => {
                if (index !== 0) {
                    if (options[index - 1].value === 'options') {
                        this.showDateTimePicker();
                    } else {
                        this.setState({ selectedValue: options[index - 1].value, selectedLabel: tmp[index] });
                        if (getDate) getDate(options[index - 1].value);
                    }
                }
            },
        );
    }

    render() {
        const { selectedValue, selectedLabel, isDateTimePickerVisible } = this.state;
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
        return (
            <View>
                <View style={{ marginLeft: 7 }}>
                    {Platform.OS === 'ios' ? (
                        <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => this.showDateIOS(options)}>
                            <Text style={{ marginRight: 10 }}>{selectedLabel}</Text>
                            <Icon
                                name='ios-arrow-down'
                                size={17}
                                color="#000"
                            />
                        </TouchableOpacity>
                    ) : (
                            <Picker
                                selectedValue={selectedValue}
                                style={{ height: 50, width: 200, textAlign: 'center' }}
                                onValueChange={(v) => this.onChangePicker(v)}
                            >
                                {options.map((v, k) => <Picker.Item key={k} label={v.label} value={v.value} />)}
                            </Picker>
                        )}
                </View>

                <DateTimePicker
                    isVisible={isDateTimePickerVisible}
                    onConfirm={this.onConfirm}
                    onCancel={this.hideDateTimePicker}
                />
            </View>
        );
    }
}
