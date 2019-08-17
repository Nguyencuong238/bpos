import React, { Component } from 'react';
import { StyleSheet, View,  ActivityIndicator, FlatList, Modal } from 'react-native';
import {  ListItem, SearchBar } from 'react-native-elements';
import { personnel_api,supplier_api,customer_api,receipts_api } from '../../services/api/fetch';
import moment from 'moment';
import { connect } from 'react-redux';
import { isEmpty } from 'lodash';
import { R_BANK_ACCOUNT_LIST } from '../../reducers/actions/index';

 class Submitter extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: true,
			loadingModal:false,
			page: 1,
			seed: 1,
			refreshing: false,
			query: '',
            idType: 0,
            personnels:null,
            submitter:[],
            typeReceipts: [],
            current_id: 0,
		};
	}

	componentDidMount() {
        const group_people= this.props.navigation.getParam('group_people', 'NO-GROUP_PEOPLE');
        if (group_people !== 'NO-GROUP_PEOPLE' ) {
            switch (group_people) {
                case 1:
                    this.getCustomer();
                    break;
                case 2:
                    this.getSupplier();
                    break;
                case 3:
                    this.getPerson();
                    break;
                case 4:
                    this.getUserOther();            
            }
        }   
	}
	
	getCustomer = (inputValue) => {
        customer_api({ mtype: 'getCustomers', full_name: inputValue }).then(({ customer }) => {
            if (customer !== undefined && !isEmpty(customer)) {
                const submitter = customer.map((v,k) =>{
                    return {
                        value: v.customer_id,
                        label:v.full_name
                    }
                });
                this.setState({submitter,loading:false});
            }  else {
                this.setState({submitter:[],loading:false});
            } 
        });
    }

    getSupplier = (inputValue) => {
        supplier_api({ mtype: 'getall', name: inputValue }).then(({ listSupplier }) => {
            if (listSupplier !== undefined && !isEmpty(listSupplier)) {
                const submitter = listSupplier.map((v,k) =>{
                    return {
                        value: v.id,
                        label:v.name
                    }
                });
                this.setState({submitter,loading:false});
            }  else {
                this.setState({submitter:[],loading:false});
            } 
        });
    }

    getPerson = (inputValue) => {
        personnel_api({ mtype: 'getAll', name: inputValue }).then(({ personnels }) => {
            if (personnels !== undefined && !isEmpty(personnels)) {
                const submitter = personnels.map((v,k) =>{
                    return {
                        value: v.personnel_id,
                        label:v.full_name
                    }
                });
                this.setState({submitter,loading:false});
            }  else {
                this.setState({submitter:[],loading:false});
            } 
        });
    }

    getUserOther = (inputValue) => {
        receipts_api({ mtype: 'getallUserOther', full_name: inputValue }).then(({ listUser }) => {
            if (listUser !== undefined && !isEmpty(listUser)) {
                const submitter = listUser.map((v,k) =>{
                    return {
                        value: v.id,
                        label:v.full_name
                    }
                });
                this.setState({submitter,loading:false});
            } else {
                this.setState({submitter:[],loading:false});
            } 
        });
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

	render() {
		const { submitter, loading } = this.state;
		return (
			<View style={styles.container}>
				<FlatList
					data={submitter}
					renderItem={({ item, index }) => (
                        <ListItem
                            title={item.label}
                            containerStyle={{ borderBottomWidth: 0 }}
							onPress={() => this.props.navigation.navigate('Receipts',{type:item})}
                        />
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

export default connect(mapStateToProps)(Submitter);

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


