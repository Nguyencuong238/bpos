import React, { Component } from 'react';
import { StyleSheet, View,  ActivityIndicator, FlatList, Modal } from 'react-native';
import {  ListItem, SearchBar } from 'react-native-elements';
import { getAddress_api } from '../../services/api/fetch';
import { isEmpty } from 'lodash';


export default class ListWards extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: true,
			page: 1,
			seed: 1,
			refreshing: false,
			query: '',
			deletedRowKey: null,
            data: [
                'Dĩnh Kế',
                'Dĩnh Trì',
                'Song Mai',
                'Xương Giang',
                'Bắc Từ Liêm',
			],
			listWard:null
		};
	}

	componentDidMount() {
		const { navigation } = this.props;
		const district_id = navigation.getParam('district_id', 'NO-ITEM');
		console.log(district_id,'xã');
		this.getWard(district_id);
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

	getWard(district_id) {
        this.setState({ loading: true });
        getAddress_api({
            mtype: 'listWard',
            district_id,
        }).then(({ wards }) => {
            if (isEmpty(wards)) {
                this.setState({ listWard: null, loading: false });
            } else {
                this.setState({ listWard: wards, loading: false });
            }
        });
    }


	handSearch = (text) => {
		this.setState({ query: text });
	}

	static navigationOptions = {
		title: 'Chọn Quận/Huyện',
	}

	render() {
		const { listWard ,loading} = this.state;
		console.log(listWard);
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
					data={listWard}
					renderItem={({ item, index }) => (
                        <ListItem
                            title={item.name}
                            containerStyle={{ borderBottomWidth: 0 }}
							onPress={() => this.props.navigation.navigate('EditCustomer', {address:item})}
                        />
					)}
					keyExtractor={item => item.wardid}
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
