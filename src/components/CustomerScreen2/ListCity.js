import React, { Component } from 'react';
import { StyleSheet, View,  ActivityIndicator, FlatList, Text } from 'react-native';
import {  ListItem, SearchBar } from 'react-native-elements';
import { getAddress_api } from '../../services/api/fetch';


export default class ListCity extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: true,
			page: 1,
			seed: 1,
			refreshing: false,
			query: '',
			deletedRowKey: null,
            listProvince: null,
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

	getProvince() {
        this.setState({ loading: true });
        getAddress_api({
            mtype: 'listProvince',
        }).then((data) => {
            this.setState({
                listProvince: data.provinces,
				loading: false,
			});
        });
    }
	
	componentDidMount() {
		this.getProvince();
		this.props.navigation.setParams({
            ma: this._submitForm.bind(this)
		});
	
	}

	_submitForm = () => {
		alert('Save Details');
		console.log('quang ke');
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

	renderHeader = () => {
		const { query } = this.state;
		return (
			<SearchBar
				containerStyle = {styles.fixed}
				placeholder = "Type Here..."
				lightTheme round
				onChangeText = {this.handSearch}
				value={query}
			/>
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
		const { listProvince } = this.state;
		console.log(listProvince);
		return (
			<View style={styles.container}>
				<FlatList
					data={listProvince}
					renderItem={({ item, index }) => (
                        <ListItem
                            title={item.name}
                            containerStyle={{ borderBottomWidth: 0 }}
							onPress={() => this.props.navigation.navigate('Edit',{address:item})}
                        />
					)}
					keyExtractor={item => item.provinceid}
					ItemSeparatorComponent={this.renderSeparator}
					ListHeaderComponent={this.renderHeader}
					ListFooterComponent={this.renderFooter}
					stickyHeaderIndices={[0]}
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
});


