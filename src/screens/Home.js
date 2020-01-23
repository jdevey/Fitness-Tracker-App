import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Platform, AsyncStorage, ImageBackground } from 'react-native';

import style from '../styles/style';
import NavigationService from '../services/NavigationService';

export default class AfterActivity extends Component {

	static navigationOptions = {
		title: 'Fitness App Homepage'
	}
	
	constructor(props) {
		super(props);
		this.state = {
			storage: null
		}
		this.updateStorage = this.updateStorage.bind(this);
		this.deleteActivity = this.deleteActivity.bind(this);
		this.deleteReward = this.deleteReward.bind(this);
		this.clearAll = this.clealAll.bind(this);
	}

	componentDidMount() {
		this.retrieveData();
	}

	retrieveData() {
		AsyncStorage.getItem('storage')
		.then(result => {
			console.log("DATA HAS BEEN RETRIEVED SUCCESSFULLY");
			if (result !== null) {
				this.setState({
					storage: JSON.parse(result)
				})
			}
			else {
				this.setState({
					storage: {
						activities: [],
						rewards: [],
						activityCnt: 0
					}
				})
			}
		})
		.catch(e => {
			console.log("ERROR RETRIEVING STORAGE");
			console.log(e);
		})
	}

	storeData() {
		AsyncStorage.setItem('storage', JSON.stringify(this.state.storage))
		.then(() => {
			console.log("DATA HAS BEEN STORED SUCCESSFULLY");
		})
		.catch(e => {
			console.log("ERROR STORING STORAGE");
			console.log(e);
		})
	}

	updateStorage(activity, rewards) {
		this.setState(prevState => {
			return ({
				storage: {
					activities: [...prevState.storage.activities, activity],
					rewards: [...prevState.storage.rewards, ...rewards],
					activityCnt: prevState.storage.activityCnt + 1
				}
			})
		}, () => this.storeData());
	}

	deleteActivity(time) {
		this.setState(prevState => {
			return {
				storage: {
					activities: prevState.storage.activities.filter(b => b.date != time),
					rewards: prevState.storage.rewards,
					activityCnt: prevState.storage.activityCnt
				}
			};
		}, () => this.storeData());
	}

	deleteReward(str) {
		this.setState(prevState => {
			return {
				storage: {
					activities: prevState.storage.activities,
					rewards: prevState.storage.rewards.filter(b => b.str != str),
					activityCnt: prevState.storage.activityCnt
				}
			};
		}, () => this.storeData());
	}

	clealAll() {
		this.setState({
			storage: {
				activities: [],
				rewards: [],
				activityCnt: 0
			}
		}, this.storeData());
	}

	render() {
		return (
			<ImageBackground source={require('../resources/defaultrainy.jpg')} style={{width: '100%', height: '100%'}}>
				<View style={[style.container, {backgroundColor: 'rgba(240, 240, 240, 0)'}]}>
					<TouchableOpacity style={style.button} onPress={() => NavigationService.navigate('StartActivity',
						{storage: this.state.storage, updateStorage: this.updateStorage})}>
						<Text>Start Activity</Text>
					</TouchableOpacity>
					<TouchableOpacity style={style.button} onPress={() => NavigationService.navigate('History', {storage: this.state.storage, del: this.deleteActivity})}>
						<Text>View Activity History</Text>
					</TouchableOpacity>
					<TouchableOpacity style={style.button}
						onPress={() => NavigationService.navigate('Rewards', {storage: this.state.storage, delRew: this.deleteReward, delAct: this.deleteActivity})}>
						<Text>View Rewards</Text>
					</TouchableOpacity>
					<TouchableOpacity style={style.button} onPress={() => this.clearAll()}>
						<Text>Reset Storage</Text>
					</TouchableOpacity>
				</View>
			</ImageBackground>
		);
	}
}
