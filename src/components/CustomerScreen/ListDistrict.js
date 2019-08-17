import React, { Component } from 'react';
import { StyleSheet, View,  ActivityIndicator, FlatList, Modal } from 'react-native';
import {  ListItem, SearchBar } from 'react-native-elements';
import { getAddress_api } from '../../services/api/fetch';

export default class ListDistrict extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: true,
			page: 1,
			seed: 1,
			refreshing: false,
			query: '',
			deletedRowKey: null,
           
			listDistrict: null,
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
		const { navigation } = this.props;
		const province_id = navigation.getParam('province_id', 'NO-ITEM');
		this.getDistrict(province_id);
	}

	getDistrict(province_id) {
		console.log(province_id);
        this.setState({ loading: true });
        getAddress_api({
            mtype: 'listDistrict',
            province_id,
        }).then(({ districts }) => {
			console.log(districts);
            this.setState({ listDistrict: districts, loading: false });
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

	handSearch = (text) => {
		this.setState({ query: text });
	}


	render() {
		const { listDistrict, loading } = this.state;
		console.log(ListDistrict);
		return (
			<View style={styles.container}>
				<Modal
					transparent={true}
					animationType={'none'}
					visible={loading}
					onRequestClose={() => { console.log('close modal') }}>
					<View style={styles.modalBackground}>
						<View style={styles.activityIndicatorWrapper}>
							<ActivityIndicator
								animating={loading} 
								size='large'
							/>
						</View>
					</View>
				</Modal>
				<FlatList
					data={listDistrict}
					renderItem={({ item, index }) => (
                        <ListItem
                            title={item.name}
                            containerStyle={{ borderBottomWidth: 0 }}
							onPress={() => this.props.navigation.navigate('EditCustomer', {address:item})}
                        />
					)}
					keyExtractor={item => item.districtid}
					ItemSeparatorComponent={this.renderSeparator}
				/>
			</View>
		);
	}
}

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
