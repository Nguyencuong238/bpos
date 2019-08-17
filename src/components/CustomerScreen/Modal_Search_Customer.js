import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity,Dimensions, Text,FlatList, Modal, Button,ActivityIndicator } from 'react-native';
import { ListItem, SearchBar, Avatar, Input } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome5';
import moment from 'moment';
import { connect } from 'react-redux';
import { goodsCss } from '../../styles/goods';
import { order_api, customer_api } from '../../services/api/fetch';
import { isEmpty, find, sumBy } from 'lodash';
import ActionSheet from 'react-native-actionsheet';
import FlashMessage from "react-native-flash-message";
import NumberFormat from 'react-number-format';
import { showMessage}  from "react-native-flash-message";
import DateTimePicker from "react-native-modal-datetime-picker";
import Spinner from 'react-native-loading-spinner-overlay';
import waterfall from 'async/waterfall';

const { width } = Dimensions.get('window');

class Modal_Search_Customer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            customer_id: null,
            debt: {
                amount: 0,
                note_order: '',
                create_time: moment().format('YYYY-MM-DD H:mm'),
            },
        }
    }

    render() {
        const { modalVisible, onVisible,SearchList,SearchCustomer} = this.props;
        return (
            <View style={Main.select_box_main}>
				<TouchableOpacity style={Main.select_box_item_action_icon} onPress={this._onPressSearch} >
					<Icon
						name='search'
						size={23}
						color="#545454"
						onPress={() => {
							onVisible();
						}}
					/>
				</TouchableOpacity>
        
				<Modal
					animationType="slide"
					transparent={false}
					visible={modalVisible}
					onRequestClose={() => {
						Alert.alert('Modal has been closed.');
					}}>
					<View style={{marginTop: 10,marginLeft: 10}}>
						<Text>KeyWord</Text>
						<Input
							placeholder="KeyWord"
							style={{ marginTop: 50 }}
							// onChangeText={(text) => this.setState({text})}
							onChangeText={(text) => SearchCustomer(text)}
						/>
						
					</View>
					<View>
						<Button
							style={Main.select_box_item_action_icon}
							title="Áp dụng "
							onPress={ () => {
                                onVisible(spinner = true);   
                            }}
						/>
						<View>
							<Button
								style={Main.select_box_item_action_icon}
                                title="Trở về"
								onPress={() => {
									onVisible();
								}}
                            />
						</View>
					</View>
				</Modal>
			</View>

        );
    }
}

const mapStateToProps = ({ state, persist }) => ({
    info_customer: state.info_customer,
    depot_current: persist.depot_current,
});

export default connect(mapStateToProps)(Modal_Search_Customer);

const Main = StyleSheet.create({
	color_link: {
		color: '#0084cc',
	},
	color_error: {
		color: 'red',
	},
	no_bg: {
		backgroundColor: 0,
	},
	padding_15: {
		padding: 15,
	},
	margin_15: {
		margin: 15,
	},
	table_container: {
		padding: 10,
		backgroundColor: '#FFF',
		height: 230
	},
	table_scroll: {
		height: 120
	},
	table_head: {
		height: 40,
		backgroundColor: '#f1f8ff'
	},
	table_total: {
		height: 40,
		backgroundColor: '#FFF'
	},
	table_wrapper: {
		flexDirection: 'row'
	},
	table_title: {
		flex: 1,
		backgroundColor: '#f6f8fa'
	},
	table_row: {
		height: 30,
		backgroundColor: '#f9f9f9'
	},
	table_text: {
		textAlign: 'center'
	},
	select_box_main: {
		backgroundColor: '#efefef',
		padding: 15,
		height: 60,
		flexDirection: 'row',
		justifyContent: 'space-between',
		borderBottomWidth: 1,
		borderBottomColor: '#ddd'
	},
	select_box_main1: {
		backgroundColor: '#39b54a',
		padding: 15,
		height: 60,
		flexDirection: 'row',
		justifyContent: 'space-between',
		borderBottomWidth: 1,
		borderBottomColor: '#ddd'
	},
	select_box_item: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	select_box_item_action_icon: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	select_box_item_action_add: {
		alignItems: 'center',
		flexDirection: 'row',
	},
	btn_fixed: {
		position: 'absolute',
		bottom: 0,
		width: '100%',
		flexDirection: 'row',
		backgroundColor: '#ddd',
		justifyContent: 'space-around',
		padding: 20,
		paddingHorizontal: 0,
	},
	btn_fixed_box: {
		flex: 50,
		width: '50%',
		paddingHorizontal: 15,
	},
	btn_submit_button: {
		width: '100%',
	},
	btn_submit_button_title: {
		fontSize: 15,
	},
	btn_submit_button_success: {
		backgroundColor: '#28af6b',
	},
	title:{
		fontSize:20,
		marginTop:6,
		color:'white',
	}
});

const styles = StyleSheet.create({
	modalBackground: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'space-around',
        backgroundColor: '#00000040'
    },
    activityIndicatorWrapper: {
        backgroundColor: '#FFFFFF',
        height: 100,
        width: 100,
        borderRadius: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around'
    },

});

const styles1 = StyleSheet.create({
	spinnerTextStyle: {
		color: '#FFF'
	  },
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
