import React, { Component } from 'react';
import { StyleSheet, View,  ActivityIndicator, FlatList, Modal } from 'react-native';
import {  ListItem, SearchBar } from 'react-native-elements';
import { bankaccount_api } from '../../services/api/fetch';
import moment from 'moment';
import { connect } from 'react-redux';
import { R_BANK_ACCOUNT_LIST } from '../../reducers/actions/index';

 class BankAccount extends Component {
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
            typeReceipts: [],
            current_id: 0,
		};
	}

	componentDidMount() {
        this.listBankAccount();
	}
	
	listBankAccount() {
		const { dispatch } = this.props;
		this.setState({loading:true});
        bankaccount_api({ mtype: 'getall' }).then(({ listBankAccount }) => {
            if (listBankAccount !== undefined) {
                dispatch({ type: R_BANK_ACCOUNT_LIST, payload: listBankAccount });
            } else {
                dispatch({ type: R_BANK_ACCOUNT_LIST, payload: [] });
			}
			this.setState({loading:false});
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
		const { typeReceipts, loading } = this.state;
		const { bankaccount } = this.props;
		console.log(bankaccount,'bank');
		return (
			<View style={styles.container}>
				<FlatList
					data={bankaccount}
					renderItem={({ item, index }) => (
                        <ListItem
                            title={item.account_branch}
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

export default connect(mapStateToProps)(BankAccount);

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


