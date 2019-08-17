import React, { Component } from 'react';
import { StyleSheet, View,  ActivityIndicator, FlatList, Modal,Alert,Dimensions } from 'react-native';
import {  ListItem, SearchBar } from 'react-native-elements';
import { receiptsType_api } from '../../services/api/fetch';
import Icon from 'react-native-vector-icons/FontAwesome5';
import moment from 'moment';
import { connect } from 'react-redux';
import Swipeout from 'react-native-swipeout';
import { R_TYPE_RECEIPTS } from '../../reducers/actions/index';

const { width } = Dimensions.get('window');

 class TypeReceipts extends Component {
	constructor(props) {
		super(props);
		this.props.navigation.addListener('willFocus', () => {
            this.GettypeReceipts();
        });
		this.state = {
			loading: true,
			loadingModal:false,
			page: 1,
			seed: 1,
			refreshing: false,
			query: '',
            idType: 0,
            typeReceipts: [],
			current_id: 0,
			rowIndex:null,
			forms: {
                name: { value: '', validate: true, msg: null },
                description: { value: '', validate: true, msg: null },
                is_accounting: { value: false, validate: true, msg: null },
            },
		};
	}

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
	
	componentDidMount() {
		this.GettypeReceipts();
    }
    
    GettypeReceipts() {
		const typeReceipts= this.props.navigation.getParam('typeReceipts', 'NO-ADD');
        const myObject = [];
        myObject.type = typeReceipts;
        const params = {
            mtype: 'getall',
            params: myObject,
        };
        this.setState({ Receiptstype:typeReceipts,loading:true });
        receiptsType_api(params).then(({ listCategoryCashflow }) => {
            if (listCategoryCashflow !== undefined) {
                // dispatch({ type: R_TYPE_RECEIPTS, payload: listCategoryCashflow });
                this.setState({ typeReceipts: listCategoryCashflow,loading:false });
            } else {
                // dispatch({ type: R_TYPE_RECEIPTS, payload: [] });
                this.setState({ typeReceipts: [],loading:false });
            }
        });
    }

	renderFooter = () => {
		if (!this.state.loading) return null;
		return (
			<View
				style={{
					paddingVertical: 20,
					borderColor: "#CED0CE"
				}}
			>
				<ActivityIndicator animating size="large" />
			</View>
		);
	};

	renderFooter = () => {
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

	confirmDelete(id,index) {
		const {typeReceipts} = this.state;
		typeReceipts.splice(index, 1);
		this.setState({typeReceipts});
        receiptsType_api({
            mtype: 'delete',
            id,
        }).then();
    }

	render() {
		const { typeReceipts, loading,Receiptstype } = this.state;
		console.log(typeReceipts,'typeReceipts');
		return (
			<View style={styles.container}>
				<FlatList
					data={typeReceipts}
					extraData={this.state}
					renderItem={({ item, index }) => (
						<Swipeout
							autoClose= {true} //sẽ tự động đóng khi ta click vào buton nào đó trong item được swipe
							onOpen={()=>(this.onSwipeOpen(index))}
							// onOpen: this.onOpen, //khi open swipe thì nên set row nào được active để tránh nhầm lẫn khi ta click sự kiện bên trong các item.
							// onClose: this.onClose, //xóa row active
							onClose={()=>(this.onSwipeClose(index))}
							close={this.state.rowIndex !== index}
							right= {[
								{
									onPress : () => {
										const {id} =item;
										const param = {id,Receiptstype}
										this.props.navigation.navigate('EditTypeReceipt',{param})
									},
									component : (
										<View style={styles1.item}>
											<Icon name="edit" style={styles1.icon} />
										</View>
									),
									backgroundColor : 'white'
								},
								{
									onPress: () => {
										const deletingRow = item.id;
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
							<ListItem
								title={item.name}
								containerStyle={{ borderBottomWidth: 0 }}
								onPress={() => this.props.navigation.navigate('Receipts',{type:item})}
							/>
						</Swipeout>	
					)}
					keyExtractor={item => item.id}
					ItemSeparatorComponent={this.renderSeparator}
					ListFooterComponent={this.renderFooter}
				/>
			</View>
		);
	}
}


const mapStateToProps = ({ state, persist }) => ({
    info_customer: state.info_customer,
    depots: persist.depots,
    profile: persist.profile,
    bankaccount: state.bankaccount,
    typereceipts: state.typereceipts,
    depot_current: persist.depot_current,
});

export default connect(mapStateToProps)(TypeReceipts);

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	separator: {
		flex: 1,
		height: StyleSheet.hairlineWidth,
		backgroundColor: '#8E8E8E',
	},
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



