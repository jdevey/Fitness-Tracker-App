import React, { Component } from 'react';
import { View, Text, FlatList, TouchableOpacity, ImageBackground } from 'react-native';

import style from '../styles/style';
import NavigationService from '../services/NavigationService';

export default class AfterActivity extends Component {

	static navigationOptions = {
		title: 'Rewards'
	}
	
	constructor(props) {
		super(props);
		this.state = {
			rewards: this.props.navigation.getParam('storage').rewards,
			activities: this.props.navigation.getParam('storage').activities,
		}
		this.renderItem = this.renderItem.bind(this);
		this.delActivity = this.delActivity.bind(this);
	}

	delReward(str) {
		this.setState(prevState => {
			return {
				rewards: prevState.rewards.filter(b => b.str != str),
			};
		});
		this.props.navigation.getParam('delRew')(str);
	}

	delActivity(date) {
		this.setState({
			activities: this.state.activities.filter(b => b.date != date),
			rewards: this.state.rewards.concat() // force update
		});
		this.props.navigation.getParam('delAct')(date);
	}

	activityExists(date) {
		for (let i = 0; i < this.state.activities.length; ++i) {
			if (this.state.activities[i].date == date) {
				return true;
			}
		}
		return false;
	}

	getActivity(date) {
		for (let i = 0; i < this.state.activities.length; ++i) {
			if (this.state.activities[i].date == date) {
				return this.state.activities[i];
			}
		}
		return null;
	}

	renderItem(item) {
		return (
			<View style={{backgroundColor: 'rgba(240, 240, 240, 0.5)', borderWidth: 2, borderColor: 'black', margin: 5}}>
				<View style={{flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1}}>
					<Text style={[style.blackFont, {textAlign: 'center'}]}>{item.item.str}</Text>
					<TouchableOpacity style={[this.activityExists(item.item.activity) ? style.smallOpaqueButton : style.smallOpaqueButtonDisabled,
						{width: 'auto', height: 'auto', padding: 5, margin: 5}]}
						onPress={() => NavigationService.navigate('HistoryDetail',
							{activity: this.getActivity(item.item.activity), del: this.delActivity})}
						disabled={!this.activityExists(item.item.activity)}>
						<Text style={style.blackFont}>
							View Activity
						</Text>
						</TouchableOpacity>
					<TouchableOpacity style={[style.smallOpaqueButton, {width: 'auto', height: 'auto', padding: 5, margin: 5}]}
						onPress={() => this.delReward(item.item.str)}>
						<Text style={style.blackFont}>
							Delete Reward
						</Text>
					</TouchableOpacity>
				</View>
			</View>
		);
	}

	renderEmpty() {
		return (
			<Text style={{textAlign: 'center', color: 'black', fontSize: 20}}> No rewards to display</Text>
		)
	}

	render() {
		return (
			<ImageBackground source={require('../resources/defaultrainy.jpg')} style={{width: '100%', height: '100%'}}>
				<FlatList
					data={this.state.rewards}
					keyExtractor={(item, index) => item.str}
					renderItem={this.renderItem}
					renderEmpty={this.renderEmpty}
				/>
			</ImageBackground>
		);
	}
}
