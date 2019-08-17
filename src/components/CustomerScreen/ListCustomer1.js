import React, { Component } from "react";
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity, Modal, Button,Dimensions,Image, Alert } from "react-native";
import { ListItem, SearchBar ,Input } from 'react-native-elements';
import Row from './Row';
import { customer_api, getTags } from '../../services/api/fetch';
// import Icon from "react-native-vector-icons/Ionicons";
import Icon from 'react-native-vector-icons/FontAwesome5';
import NavigatorService from '../../services/NavigatorService';
import { isEmpty, findIndex } from 'lodash';
import { connect } from 'react-redux';
import Swipeout from 'react-native-swipeout';
import Spinner from 'react-native-loading-spinner-overlay';
import Modal_Search_Customer from "./Modal_Search_Customer";

const { width } = Dimensions.get('window');


class ListCustomer extends Component {
	constructor(props) {
		super(props);
		this.props.navigation.addListener('willFocus', () => {
			console.log(this.props.edit_customer,'kkkk');
			// console.log(this.props.edit_customer,'hhh');
			// if (this.state.editcustomer !== this.props.edit_customer) {
				this.getInfo();
			// }
		});
		this.state = {
			loading: false,
			editcustomer:0,
			loadingModal: false,
			data: [],
			page: 1,
			limit: 10,
			refreshing: false,
			modalVisible: false,
			value: '',
			text:'',
			spinner: false,
			changeData:0,
			a:[],
			activeRowKey: null, //set item active
            numberOfRefresh: 0,
            rowIndex:null,
		};
		// this.reRenderSomething = this.props.navigation.addListener('willFocus', () => {
		// 	const {changeData} = this.state;
		// 	this.setState({changeData:changeData +1});
		// 	console.log(this.state.changeData);
        // });
		this.arrayholder = [];
	}

	// componentWillUnmount() {
	// 	this.reRenderSomething;
	// 	console.log('me kiep');
	// }
	

	componentDidMount() {
		this.makeRemoteRequest();
	}

	getInfo () {
		const {edit_customer} = this.props;
		const { data ,a} = this.state;
	    console.log('chaygetinfo');
		if(edit_customer !== 0) {
			this.setState({spinner:true});
			customer_api({
				mtype: 'getInfo',
				customer_id: edit_customer,
			}).then(({ customer }) => {
				if (!isEmpty(customer)) {
					const find_index = findIndex(data, function(o) { return o.customer_id == edit_customer; }); // Tìm chỉ số thông tin khách hàng thay đổi
					if (find_index !== -1) { // khác -1 có id edit khách hàng tồn tại trong danh sách
						data[find_index] = customer;
						this.setState({
							data,
							spinner:false,
							editcustomer:edit_customer,
						})
					} else { // === -1 là thêm mới khách hàng
						const customer_arr = []; //Tạo arr mới
						customer_arr.push(customer); // push khách hàng vào mảng
						this.setState({
							// loadingModal:false,
							spinner:false,
							data:[...customer_arr,...data],
						});
				
					}
				}				
			});
		}
		
	}

	_submitForm = () => {
		alert('Save Details');
		console.log('quang ke');
	};

	makeRemoteRequest = () => {
		const { page, limit,text } = this.state;
		const offset = (page - 1) * limit;
		const params = {
			mtype: 'getCustomers',
			limit,
			offset,
			kw:text,
		};
		this.setState({ loading: true });
		customer_api(params).then(data => {
			this.setState({
				data: page === 1 ? data.customer : [...this.state.data, ...data.customer],
				loading: false,
				refreshing: false,
				loadingModal:false,
			});
			// this.arrayholder = page === 1 ? data.customer : [...this.state.data, ...data.customer];
		})
	};


	makeRemoteSearch (){
		const {page, limit,text } = this.state;
		const offset = (page - 1) * limit;
		const params = {
			mtype: 'getCustomers',
			limit,
			offset,
			kw:text,
		};
		// this.setState({spinner:true});
			customer_api(params).then(({customer}) => {
				console.log('quan vl');
					this.setState({
						spinner:false,
						data:customer,
					})
				
			});	
		
	};

	SearchList = () => {
		
        this.setState(
            {
                page: 1,
                // spinner: true,
            },
            () => {
				
                this.makeRemoteSearch();
    
            }
        );
    } 

	handleRefresh = () => {
		this.setState(
			{
				page: 1,
				refreshing: true,
				text:''
			},
			() => {
				this.makeRemoteRequest();
			}
		);
	};

	handleLoadMore = () => {
		if (this.state.text === '' && this.state.loading === false) {
			this.setState(
				{
					page: this.state.page + 1,
					loading: true,
				},
				() => {
					this.makeRemoteRequest();
				}
			);
		}
	};

	renderSeparator = () => {
		return (
			<View
				style={{
					height: 1,
					width: "86%",
					backgroundColor: "#CED0CE",
					marginLeft: "14%"
				}}
			/>
		);
	};

	onVisible = (spinner) => {
        
         this.onVisibleLocal(spinner);
    }

    onVisibleLocal(spinner) {
		const { modalVisible } = this.state;
			if (spinner) {
				this.setState({
					modalVisible: !modalVisible,
					spinner,
				},() =>{
					this.SearchList();
				});
			} else {
				this.setState({
					modalVisible: !modalVisible,
				});
			}
            
    }

	SearchCustomer = (text) => {
		this.setState({ text }, () => {
			console.log(this.state.text,'text search');
		});
	}

	renderHeader = () => {
		const {modalVisible,spinner} = this.state;
		return (
			<View>
				<Spinner
					visible={this.state.spinner}
					textStyle={styles.spinnerTextStyle}
				/>
				<Modal_Search_Customer 
				onVisible={this.onVisible} 
				modalVisible = {modalVisible} 
				SearchList={this.SearchList}
				SearchCustomer = {this.SearchCustomer}
				/>
			</View>	
		);
	};

	renderFooter = () => {
		if (this.state.text !=='') return null;
		if (!this.state.loading) return null;
		return (
			<View
				style={{
					paddingVertical: 20,
					borderTopWidth: 1,
					borderColor: "#CED0CE"
				}}
			>
				<ActivityIndicator animating size="large" />
			</View>
		);
	};

	

	onSwipeOpen = (rowIndex) => {
        this.setState({
            rowIndex,
        });  
    }

    onSwipeClose = (rowIndex) => {
        if (rowIndex === this.state.rowIndex) {
            this.setState({ rowIndex: null });
        }
	}
	
	confirmDelete(customer_id,index) {
		const {data} = this.state;
		data.splice(index, 1);
		this.setState({data});
        // const { depot_current } = this.props;
        customer_api({
            mtype: 'edit',
            customer_id,
            is_delete: 1,
            // depot_id: depot_current,
        }).then();
    }

	render() {
		const {loadingModal} = this.state;
		console.log(this.state.spinner,'spiner');
		console.log(this.state.data.length,'data1');
		return (
			<View containerStyle={{ borderTopWidth: 0, borderBottomWidth: 0 }}>
				<FlatList
					data={this.state.data}
					extraData={this.state}
					renderItem={({ item, index }) => (
						<View>
							<Swipeout
								autoClose= {true} //sẽ tự động đóng khi ta click vào buton nào đó trong item được swipe
								onOpen={()=>(this.onSwipeOpen(index))}
								// onOpen: this.onOpen, //khi open swipe thì nên set row nào được active để tránh nhầm lẫn khi ta click sự kiện bên trong các item.
								// onClose: this.onClose, //xóa row active
								onClose={()=>(this.onSwipeClose(index))}
								close={this.state.rowIndex !== index}
								right= {[
									{
										onPress : () => NavigatorService.navigate('EditCustomer',{item}),
										component : (
											<View style={styles1.item}>
												<Icon name="edit" style={styles1.icon} />
											</View>
										),
										backgroundColor : 'white'
									},
									{
										onPress : () => NavigatorService.navigate('InfoCustomer',{item}),
										component: (
											<View style={styles1.item}>
												<Icon name="user" style={styles1.icon} />
											</View>
										),
										backgroundColor: 'white'
									},
									{
										onPress: () => {
											const deletingRow = item.customer_id;
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
															this.confirmDelete(deletingRow,index);
														},
													},
												],
												{cancelable: true}   
											);
										},
										component: (
											<View style={styles1.item}>
												<View style={[styles1.inItem, { backgroundColor: '#E94B3C' }]}>
													<Icon name="trash" style={[styles1.icon, { color: 'white' }]} />
												</View>
											</View>
										),
										backgroundColor: 'white',
									}
								]}
								rowId={index}
								sectionId = {1}
								backgroundColor={'white'}
							>
								{/* <TouchableOpacity> */}
									<View style={styles1.container}>
										<Image source={{ uri: 'https://pbs.twimg.com/profile_images/1073187548812345345/8o7zXjNE_400x400.jpg' }} style={styles1.photo} />
										<View style={styles1.info}>
											<Text style={styles1.text}>
												{item.full_name}
												{/* {item.name.first} */}
											</Text>
											<Text style={styles1.text1}>
												{item.mobile_phone}
												{/* {item.email} */}
											</Text>
										</View>
									</View>
								{/* </TouchableOpacity> */}
							</Swipeout>
						</View>
					)}
					keyExtractor={item => item.customer_id}
					ItemSeparatorComponent={this.renderSeparator}
					ListHeaderComponent={this.renderHeader}
					ListFooterComponent={this.renderFooter}
					onRefresh={this.handleRefresh}
					refreshing={this.state.refreshing}
					onEndReached={this.handleLoadMore}
					onEndReachedThreshold={0}
					stickyHeaderIndices={[0]}
				/>
			</View>
		);
	}
}

const mapStateToProps = ({ state, persist }) => ({
    edit_customer: state.edit_customer,
    depot_current: persist.depot_current,
});
export default connect(mapStateToProps)(ListCustomer);

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
