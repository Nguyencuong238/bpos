import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, Alert } from 'react-native';
import Swipeout from 'react-native-swipeout';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { customer_api } from '../../services/api/fetch';
import NavigatorService from '../../services/NavigatorService';

const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 12,
        flexDirection: 'row',
        alignItems: 'center',
    },
    text: {
        marginLeft: 12,
        fontSize: 16,
    },
    text1: {
        marginLeft: 12,
        fontSize: 12,
    },
    photo: {
        height: 40,
        width: 40,
        borderRadius: 20,
    },
    info : {
        flex: 1,
        flexDirection: 'column',
    },
    separator: {
        flex: 1,
        height: StyleSheet.hairlineWidth,
        backgroundColor: '#8E8E8E',
    },
    item: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 100
    },
    inItem: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 36,
        height: 36,
        borderRadius: 18
    },
    icon: {
        fontSize: width * 6 / 100,
    }
});

class Row extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeRowKey: null, //set item active
            numberOfRefresh: 0,
        };
    }

    setModalVisible(visible) {
        this.setState({ visible: visible });
    }

    onOpen = () => {
        this.setState({
            activeRowKey: this.props.item.customer_id
        });
    }

    onClose = () => {
        if (this.state.activeRowKey != null) {
            this.setState({
                activeRowKey: null
            });
        }
    }

    confirmDelete(customer_id) {
        this.props.data.splice(this.props.index, 1);
        this.props.parentFlatList(customer_id);
        // const { depot_current } = this.props;
        customer_api({
            mtype: 'edit',
            customer_id,
            is_delete: 1,
            // depot_id: depot_current,
        }).then();
    }

    render() {
        const { item, data } = this.props;
        const { customer_id } = item;
        const swipeSettings = {
            autoClose: true, //sẽ tự động đóng khi ta click vào buton nào đó trong item được swipe
            onOpen: this.onOpen, //khi open swipe thì nên set row nào được active để tránh nhầm lẫn khi ta click sự kiện bên trong các item.
            onClose: this.onClose, //xóa row active
            right: [
                {
                    onPress : () => this.props.navigation.navigate('EditCustomer',{item}),
                    component: (
                        <View style={styles.item}>
                            <Icon name="edit" style={styles.icon} />
                        </View>
                    ),
                    backgroundColor: 'white'
                },
                {
                    onPress: () => { console.log('Ke') },
                    component: (
                        <View style={styles.item}>
                            <Icon name="user" style={styles.icon} />
                        </View>
                    ),
                    backgroundColor: 'white'
                },
                {
                    onPress: () => {
                        const deletingRow = this.state.activeRowKey;
                        Alert.alert(
                            'Cảnh báo',
                            'Bạn chắc chắn muốn xóa ',
                            [
                                {
                                    text: 'Hủy',
                                    onPress: () => console.log('Cancel Pressed'),
                                    style: 'cancel',
                                },
                                {
                                    text: 'Có',
                                    onPress: () => {
                                        this.confirmDelete(deletingRow);
                                    },
                                },
                            ],
                            {cancelable: true}   
                        );
                    },
                    component: (
                        <View style={styles.item}>
                            <View style={[styles.inItem, { backgroundColor: '#E94B3C' }]}>
                                <Icon name="trash" style={[styles.icon, { color: 'white' }]} />
                            </View>
                        </View>
                    ),
                    backgroundColor: 'white',
                }
            ],
            rowId: this.props.index,
            sectionId: 1
        };
        return (
            <View>
                <Swipeout
                    {...swipeSettings}
                    backgroundColor='white'
                >
                    <TouchableOpacity>
                        <View style={styles.container}>
                            <Image source={{ uri: 'https://pbs.twimg.com/profile_images/1073187548812345345/8o7zXjNE_400x400.jpg' }} style={styles.photo} />
                            <View style={styles.info}>
                                <Text style={styles.text}>
                                    {item.full_name}
                                    {/* {item.name.first} */}
                                </Text>
                                <Text style={styles.text1}>
                                    {item.mobile_phone}
                                    {/* {item.email} */}
                                </Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </Swipeout>
            </View>
        )
    }
}

export default Row

