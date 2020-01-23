import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image, FlatList, ImageBackground } from 'react-native';

import style from '../styles/style';

export default class AfterActivity extends Component {

	static navigationOptions = {
		title: 'Activity Detail'
	}
	
	constructor(props) {
		super(props);
		this.activity = this.props.navigation.getParam('activity');
	}

	del(date) {
		this.props.navigation.getParam('del')(date);
		this.props.navigation.goBack();
	}

	renderItem(item) {
		return (
			<View style={{backgroundColor: 'rgba(240, 240, 240, 0.5)', borderWidth: 2, borderColor: 'black', margin: 5, padding: 5}}>
				<View style={{flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1}}>
					<Text style={[style.blackFont, {textAlign: 'center'}]}>{item.item.str}</Text>
				</View>
			</View>
		);
	}

	render() {
		return (
			<ImageBackground source={require('../resources/defaultrainy.jpg')} style={{width: '100%', height: '100%'}}>
				<View style={{flex: 1, alignItems: 'center', margin: 5}}>
					<View style={{flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1}}>
						<View style={{backgroundColor: 'rgba(200, 200, 200, 0.5)', borderWidth: 2, borderColor: 'rgba(0, 0, 0, 0.5)', padding: 5}}>
							<Text style={[style.blackFont, {fontSize: 24}]}>{new Date(this.activity.date).toDateString() + ' ' + this.activity.type}</Text>
							<Text style={style.blackFont}>Duration: {this.activity.duration} seconds</Text>
							<Text style={style.blackFont}>Distance: {this.activity.distance.toFixed(3)} miles</Text>
							<Text style={style.blackFont}>Pace: {this.activity.pace.toFixed(3)} mph</Text>
							<Text style={style.blackFont}>Begin Weather: {this.activity.oldWeather}</Text>
							<Text style={style.blackFont}>End Weather: {this.activity.newWeather}</Text>
							<Text style={style.blackFont}>Begin Temperature: {this.activity.oldTemp} degrees</Text>
							<Text style={style.blackFont}>End Temperature: {this.activity.newTemp} degrees</Text>
							<Text style={style.blackFont}>Begin Elevation: {this.activity.oldElevation.toFixed(1)} meters</Text>
							<Text style={style.blackFont}>End Elevation: {this.activity.newElevation.toFixed(1)} meters</Text>
							<Text style={style.blackFont}>Note: {this.activity.note}</Text>
						</View>
						<FlatList
							data={this.activity.rewards}
							keyExtractor={(item, index) => item.str}
							renderItem={this.renderItem}
						/>
						<View style={{flexDirection: 'row', justifyContent: 'center'}}>
							<Image
								source={{uri: this.activity.pic}}
								style={{height: 160, width: 240, margin: 5}}
							/>
							<TouchableOpacity style={[style.smallOpaqueButton, {width: 'auto', height: 'auto', padding: 5, margin: 5}]}
								onPress={() => this.del(this.activity.date)}>
								<Text style={style.blackFont}>
									Delete Activity
								</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</ImageBackground>
		);
	}
}
