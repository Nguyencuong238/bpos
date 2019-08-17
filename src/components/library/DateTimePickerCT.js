import React, { Component } from "react";
import { Text, View, StyleSheet } from "react-native";
import { Button } from 'react-native-elements';
import DateTimePicker from "react-native-modal-datetime-picker";
import PropTypes from "prop-types";
import moment from 'moment';
import Modal from "react-native-modal";

export default class DateTimePickerCT extends Component {
    static propTypes = {
        isVisible: PropTypes.bool,
        date_to: PropTypes.string,
        date_from: PropTypes.string,
        onConfirm: PropTypes.object,
        onCancel: PropTypes.object,
    }

    static defaultProps = {

    }

    constructor(props) {
        super(props);
        this.state = {
            isVisibleDate: false,
            datef: moment().format('YYYY-MM-DD'),
            datet: moment().format('YYYY-MM-DD'),
            date_type: '',
        };
    }

    onConfirmDate(type) {
        if (type === 'to') {
            this.setState({ datet: '' });
        } else if (type === 'from') {
            this.setState({ datef: '' });
        }
    }

    onConfirmDate = date => {
        const { date_type } = this.state;
        // console.log("A date has been picked: ", date);
        if (date_type === 'to') {
            this.setState({ datet: moment(date).format('YYYY-MM-DD') });
        } else if (date_type === 'from') {
            this.setState({ datef: moment(date).format('YYYY-MM-DD') });
        }
        this.showDateTimePicker();
    };

    onCancelDate() {

    }

    showDateTimePicker(type) {
        const { isVisibleDate } = this.state;
        this.setState({ isVisibleDate: !isVisibleDate, date_type: type });
    }

    render() {
        const { isVisible, date_to, date_from, onCancel, onConfirm } = this.props;
        const { isVisibleDate, datef, datet, date_type } = this.state;
        return (
            <Modal
                isVisible={isVisible}
                onBackdropPress={() => onCancel()}
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
                        isVisible={isVisibleDate}
                        onConfirm={this.onConfirmDate}
                        onCancel={this.onCancelDate}
                        node="date"
                        date={date_type === 'to' ? new Date(datet) : new Date(datef)}
                    />
                    {/* <DateTimePicker
                        isVisible={this.state.isDateTimePickerVisibleto}
                        onConfirm={this.onConfirmTo}
                        onCancel={this.hideDateTimePickerTo}
                    /> */}

                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ flex: 1 }}>
                            <Button
                                title="Bỏ qua"
                                onPress={() => onCancel()}
                            />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Button
                                title="Đồng ý"
                                onPress={() => onConfirm({ datef, datet })}
                            />
                        </View>
                    </View>
                </View>
            </Modal>
        )
    }
}

const styles = StyleSheet.create({
    content: {
        backgroundColor: 'white',
        padding: 22,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        borderColor: 'rgba(0, 0, 0, 0.1)',
    },
});