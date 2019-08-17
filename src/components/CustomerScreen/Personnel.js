import React, { Component } from 'react';
import { StyleSheet, View,  ActivityIndicator, FlatList, Modal } from 'react-native';
import {  ListItem, SearchBar } from 'react-native-elements';
import { personnel_api } from '../../services/api/fetch';
import moment from 'moment';
import { connect } from 'react-redux';
import { isEmpty } from 'lodash';
import { R_BANK_ACCOUNT_LIST } from '../../reducers/actions/index';

 class Personnel extends Component {
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
            typeReceipts: [],
            current_id: 0,
            forms: {
                name: { value: '', validate: true, msg: null },
                number: { value: '', validate: true, msg: null },
                idType: { value: 0, validate: true, msg: null },
                depot: { value: '', validate: true, msg: null },
                bankaccount: { value: '', validate: true, msg: null },
                tags: { value: '', validate: true, msg: null },
                note: { value: '', validate: true, msg: null },
                amount: { value: '', validate: true, msg: null },
                type: { value: '', validate: true, msg: null },
                type_payment: { value: 1, validate: true, msg: null },
                account_name: { value: '', validate: true, msg: null },
                is_accounting: { value: true, validate: true, msg: null },
                created_time: { value: moment().format('YYYY/MM/DD H:mm'), validate: true, msg: null },
                group_people: { value: 1, validate: true, msg: null },
                person_info: { value: false, validate: true, msg: null },
                person_info_select: '',
                personnel_id: { value: props.profile.personnel_id, validate: true, msg: null },
                personnel_id_select: '',
            },
		};
	}

	componentDidMount() {
        this.getPersonnel();
	}
	
	getPersonnel = (inputValue) => {
        this.setState({loading:true});
        personnel_api({ mtype: 'getAll', name: inputValue }).then(({ personnels }) => {
            if (personnels !== undefined && !isEmpty(personnels)) {
                this.setState({personnels, loading:false});
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
		const { personnels, loading } = this.state;
		const { bankaccount } = this.props;
		console.log(bankaccount,'bank');
		return (
			<View style={styles.container}>
				<FlatList
					data={personnels}
					renderItem={({ item, index }) => (
                        <ListItem
                            title={item.full_name}
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

export default connect(mapStateToProps)(Personnel);

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


