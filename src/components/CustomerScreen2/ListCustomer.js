import React, { Component } from "react";
import { View, Text, FlatList, ActivityIndicator, Image, TouchableOpacity, Dimensions, StyleSheet } from "react-native";
import { ListItem, SearchBar } from 'react-native-elements';
import Row from './Row';
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

	renderItem = (item) => {
		return (
			<View>
				<TouchableOpacity onPress ={() => NavigatorService.navigate('InfoCustomer',{item})}>
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
			</View>
		)	
	}

	render() {
		const {navigation} = this.props;
		return (
			<View containerStyle={{ borderTopWidth: 0, borderBottomWidth: 0 }}>
				<FlatList
					data={this.state.data}
					extraData={this.state.data}
					renderItem={({ item, index }) => (
						this.renderItem(item)
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

