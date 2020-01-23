import React, { Component } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, Picker, ImageBackground } from 'react-native';

import style from '../styles/style';
import NavigationService from '../services/NavigationService';

const filters = {
	Types: ['All', 'Run', 'Walk', 'Bike Ride'],
	Sort: ['Date', 'Duration', 'Pace'],
	Range: ['Minute', 'Hour', 'Day', 'Week', 'Month', 'Year']
}

export default class AfterActivity extends Component {

	static navigationOptions = {
		title: 'Activity History'
	}
	
	constructor(props) {
		super(props);
		this.state = {
			activities: this.props.navigation.getParam('storage').activities,
			curr: this.props.navigation.getParam('storage').activities,
			picker1: 'Types',
			picker2: 'All'
		}
		this.renderItem = this.renderItem.bind(this);
		this.delActivity = this.delActivity.bind(this);
	}

	delActivity(date) {
		this.setState(prevState => {
			return {
				activities: prevState.activities.filter(b => b.date != date),
				curr: prevState.activities.filter(b => b.date != date)
			};
		});
		this.props.navigation.getParam('del')(date);
	}

	filterActivities(itemValue) {
		const millisInDay = 1000 * 3600 * 24;
		switch(itemValue) {
			case 'All':
				return this.state.activities;
			case 'Run':
				return this.state.activities.filter(a => a.type == 'Run');
			case 'Walk':
				return this.state.activities.filter(a => a.type == 'Walk');
			case 'Bike Ride':
				return this.state.activities.filter(a => a.type == 'Bike Ride');
			case 'Date':
				return this.state.activities.sort((e1, e2) => {return e1.date < e2.date ? -1 : 1}).concat()
			case 'Duration':
				return this.state.activities.sort((e1, e2) => {return e1.duration < e2.duration ? -1 : 1}).concat()
			case 'Pace':
				return this.state.activities.sort((e1, e2) => {return e1.pace < e2.pace ? -1 : 1}).concat()
			case 'Minute':
				return this.state.activities.filter(a => a.date > Date.now() - 1000 * 60);
			case 'Hour':
				return this.state.activities.filter(a => a.date > Date.now() - 1000 * 3600);
			case 'Day':
				return this.state.activities.filter(a => a.date > Date.now() - millisInDay);
			case 'Week':
				return this.state.activities.filter(a => a.date > Date.now() - millisInDay * 7);
			case 'Month':
				return this.state.activities.filter(a => a.date > Date.now() - millisInDay * 30);
			case 'Year':
				return this.state.activities.filter(a => a.date > Date.now() - millisInDay * 365);
			default:
				console.log("ERROR: DEFAULT CASE REACHED WHILE FILTERING ACTIVITIES");
				return this.state.activities;
		}
	}

	renderItem(item) {
		return (
			<View style={{backgroundColor: 'rgba(240, 240, 240, 0.5)', borderWidth: 2, borderColor: 'black', margin: 5, flexDirection: 'row'}}>
				<View style={{flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1}}>
					<Text style={style.blackFont}>{new Date(item.item.date).toDateString() + ' ' + item.item.type}</Text>
					<Text style={style.blackFont}>Duration: {item.item.duration} seconds</Text>
					<Text style={style.blackFont}>Distance: {item.item.distance.toFixed(3)} miles</Text>
					<Text style={style.blackFont}>Pace: {item.item.pace.toFixed(3)} mph</Text>
					<View style={{flexDirection: 'row', justifyContent: 'center'}}>
						<TouchableOpacity style={[style.smallOpaqueButton, {width: 'auto', height: 'auto', padding: 5, margin: 5}]}
							onPress={() => NavigationService.navigate('HistoryDetail', {activity: item.item, del: this.delActivity})}>
							<Text style={style.blackFont}>
								View
							</Text>
						</TouchableOpacity>
						<TouchableOpacity style={[style.smallOpaqueButton, {width: 'auto', height: 'auto', padding: 5, margin: 5}]}
							onPress={() => this.delActivity(item.item.date)}>
							<Text style={style.blackFont}>
								Delete
							</Text>
						</TouchableOpacity>
					</View>
				</View>
				<Image
					source={{uri: item.item.pic}}
					style={{height: 90, width: 150, margin: 15}}
				/>
			</View>
		);
	}

	renderEmpty() {
		return (
			<Text style={{textAlign: 'center', color: 'black', fontSize: 20}}> No activities to display</Text>
		)
	}

	render() {
		console.log("bbb"); console.log(this.state.curr);
		return (
			<ImageBackground source={require('../resources/defaultrainy.jpg')} style={{width: '100%', height: '100%'}}>
				<View>
					<View style={{backgroundColor: 'rgb(240, 240, 240)', width: '100%', flexDirection: 'row',
						justifyContent: 'center', borderWidth: 2, borderColor: 'rgb(128, 128, 128)'}}>
						<Picker
							selectedValue={this.state.picker1}
							style={{height: 33, width: 130, borderWidth: 1, borderColor: 'rgba(0, 0, 0, 0.5)'}}
							itemStyle={style.pickerItem}
							onValueChange={(itemValue, itemIndex) => {
								this.setState({picker1: itemValue})
							}}
						>
							<Picker.Item label="Types" value="Types" />
							<Picker.Item label="Sort" value="Sort" />
							<Picker.Item label="Range" value="Range" />
						</Picker>
						<Picker
							selectedValue={this.state.picker2}
							style={{height: 33, width: 130, borderWidth: 1, borderColor: 'rgba(0, 0, 0, 0.5)'}}
							itemStyle={style.pickerItem}
							onValueChange={(itemValue, itemIndex) => {
								this.setState({picker2: itemValue, curr: this.filterActivities(itemValue)})
							}}
						>
							{filters[this.state.picker1].map(f => {
								return (<Picker.Item label={f} value={f} key={f}/>);
							})}
						</Picker>
					</View>
					<FlatList
						data={this.state.curr}
						keyExtractor={(item, index) => item.date.toString()}
						renderItem={this.renderItem}
						ListEmptyComponent={this.renderEmpty}
					/>
				</View>
			</ImageBackground>
		);
	}
}
