import React, { Component } from "react";
import { View, Text, FlatList, ActivityIndicator } from "react-native";
import { ListItem, SearchBar } from 'react-native-elements';
import Row from './Row';
import { customer_api } from '../../services/api/fetch';


export default class ListCustomer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: false,
			data: [],
			page: 1,
			limit: 10,
			refreshing: false,
			value:'',
		};
		this.arrayholder = [];
	}

	componentDidMount() {
		this.makeRemoteRequest();
	}

	_submitForm = () => {
		alert('Save Details');
		console.log('quang ke');
    };

	makeRemoteRequest = () => {
		const { page, limit } = this.state;
		const offset = (page - 1) * limit;
		const params = {
			mtype: 'getCustomers',
			limit,
			offset,
		};
		this.setState({ refreshing: true })
		customer_api(params).then(data => {
			this.setState({
				data: page === 1 ? data.customer : [...this.state.data, ...data.customer],
				loading: false,
				refreshing: false
			});
			this.arrayholder = page === 1 ? data.customer : [...this.state.data, ...data.customer];
		})
	};

	searchFilterFunction = text => {
		this.setState({value: text}, () =>{
			console.log(this.state.value);
		});
		const newData = this.arrayholder.filter(item => {
			const itemData = `${item.full_name.toUpperCase()}`;
			const textData = text.toUpperCase();

			return itemData.indexOf(textData) > -1;
		});
		this.setState({
			data: newData,
		});
	};

	handleRefresh = () => {
		if(this.state.value === '') {
			this.setState(
				{
					page: 1,
					refreshing: true,
				},
				() => {
					this.makeRemoteRequest();
				}
			);
		}
	};

	// static navigationOptions = {
	// 	headerTitle: 'Danh sách khách hàng',
	// }

	handleLoadMore = () => {
		console.log(this.state.value, 'load more');
		console.log(this.state.loading);
		if (!this.state.loading && this.state.value === '') {
			console.log('chay load more');
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

	renderHeader = () => {
		return 	<SearchBar 
					placeholder="Type Here..." 
					lightTheme round 
					onChangeText={text => this.searchFilterFunction(text)}
					autoCorrect={false}
        			value={this.state.value}
				/>;
	};

	renderFooter = () => {
		if (!this.state.loading) return null;
		if(this.state.value === '') {
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
		} else {
			return null;
		}
	};

	render() {
		return (
			<View containerStyle={{ borderTopWidth: 0, borderBottomWidth: 0 }}>
				<FlatList
					data={this.state.data}
					extraData={this.state.data}
					renderItem={({ item, index }) => (
						<Row
							// {...this.props}
							item={item}
							data={this.state.data}
							index={index}
							refreshing={this.props.refreshing}
							parentFlatList={this.refreshFlatList}
						/>
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

