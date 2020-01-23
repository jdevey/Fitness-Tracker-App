import React, { Component } from 'react';
import { View, Text, TouchableOpacity, ImageBackground } from 'react-native';

import style from '../styles/style';
import NavigationService from '../services/NavigationService';

export default class AfterActivity extends Component {

	static navigationOptions = {
		title: 'Live Activity'
	}
	
	constructor(props) {
		super(props);
		this.state = {
			time: 0,
			distance: 0,
			pace: 0,
			subpace: 0,
			subarray: [],
			userLocation: {
				latitude: this.props.navigation.getParam('lat'),
				longitude: this.props.navigation.getParam('lng')
			},
			live: true,
			over: false,
			points: [],
			weather: "Retrieving weather",
			temperature: 0,
			elevation: -1
		}
	}

    componentDidMount() {
		this.timer = setInterval(() => this.tick1s(), 1000);
		this.updateLocation();
	}

	componentWillUnmount() {
		clearInterval(this.timer);
	}

	tick1s() {
		this.setState((prevState) => {
				return ({
					time: prevState.time + 1
				})
			},
			() => this.tick5s()
		)
	}
	
	tick5s() {
		// Only update every five seconds
		if (this.state.time % 5 != 4) {
			return;
		}
		navigator.geolocation.getCurrentPosition(
			(position) => this.updateStats(position),
			(error) => console.log("ERROR OBTAINING USER POSITION IN LIVEACTIVITY.JS PT1", error.message),
			{ timeout: 20000, maximumAge: 0, enableHighAccuracy: true }
		)
	}

	// Source of function: https://www.geodatasource.com/developers/javascript
	// Returns distance in MILES
	distanceBetweenPoints(lat1, lon1, lat2, lon2) {
		if (lat1 == lat2 && lon1 == lon2) return 0;
		var radlat1 = Math.PI * lat1/180;
		var radlat2 = Math.PI * lat2/180;
		var theta = lon1 - lon2;
		var radtheta = Math.PI * theta/180;
		var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
		if (dist > 1) dist = 1;
		dist = Math.acos(dist);
		dist = dist * 180 / Math.PI;
		dist = dist * 60 * 1.1515;
		return dist;
	}
	
	updateStats(position) {
		this.setState((prevState) => {
			let d = this.distanceBetweenPoints(prevState.userLocation.latitude, prevState.userLocation.longitude,
				position.coords.latitude, position.coords.longitude);
			let s = prevState.subarray.length > 5 ? [...prevState.subarray.slice(1, 6), d] : [...prevState.subarray, d];
			return ({
				distance: prevState.distance + d,
				pace: (prevState.distance + d) / Math.max(5, prevState.time) * 3600,
				subpace: s.reduce((sm, elem) => {return sm + elem}) / s.length / 5 * 3600,
				subarray: s.concat(),
				userLocation: {
					latitude: position.coords.latitude,
					longitude: position.coords.longitude,
				},
				points: [...prevState.points, {
					latitude: position.coords.latitude,
					longitude: position.coords.longitude,
				}],
				elevation: position.coords.altitude
			})
		});
	}

	updateLocation() {
		navigator.geolocation.getCurrentPosition(
			(position) => {
				this.setState(prevState => {
					return ({
						userLocation: {
							latitude: position.coords.latitude,
							longitude: position.coords.longitude,
						},
						points: [...prevState.points, {
							latitude: position.coords.latitude,
							longitude: position.coords.longitude,
						}],
						elevation: position.coords.altitude
					})
				})
			},
			(error) => console.log("ERROR OBTAINING USER POSITION IN LIVEACTIVITY.JS PT2", error.message),
			{ timeout: 20000, maximumAge: 0, enableHighAccuracy: true }
		)
	}

	toggleLiveState() {
		if (this.state.live) {
			clearInterval(this.timer);
			this.setState({live: false});
		}
		else {
			this.updateLocation();
			this.timer = setInterval(() => this.tick1s(), 1000);
			this.setState({live: true});
		}
	}

	completeActivity() {
		clearInterval(this.timer);
		this.setState({over: true});
		this.updateLocation();
		NavigationService.navigate('AfterActivity', {
			storage: this.props.navigation.getParam('storage'),
			updateStorage: this.props.navigation.getParam('updateStorage'),
			lat: this.state.userLocation.latitude,
			lng: this.state.userLocation.longitude,
			time: this.state.time,
			distance: this.state.distance,
			pace: this.state.pace,
			points: this.state.points,
			type: this.props.navigation.getParam('type'),
			oldWeather: this.props.navigation.getParam('weather'),
			oldTemperature: this.props.navigation.getParam('temperature'),
			newWeather: this.state.weather,
			newTemperature: this.state.temp,
			oldElevation: this.props.navigation.getParam('oldElevation'),
			newElevation: this.state.elevation
		});
	}
	
	render() {
		return (
			<ImageBackground source={require('../resources/defaultrainy.jpg')} style={{width: '100%', height: '100%'}}>
				<View style={style.container}>
					<View style={{backgroundColor: 'rgba(200, 200, 200, 0.5)', borderWidth: 2, borderColor: 'rgba(0, 0, 0, 0.5)', padding: 4}}>
						<Text style={style.blackFont}>
							Duration: {this.state.time} seconds
						</Text>
						<Text style={style.blackFont}>
							Distance: {this.state.distance.toFixed(3)} miles
						</Text>
						<Text style={style.blackFont}>
							Pace: {this.state.pace.toFixed(3)} mph
						</Text>
						<Text style={style.blackFont}>
							30 Second Subpace: {this.state.subpace.toFixed(3)} mph
						</Text>
						<Text style={style.blackFont}>
							Elevation: {this.state.elevation.toFixed(1)} meters
						</Text>
					</View>
					<TouchableOpacity
						disabled={this.state.over}
						style={this.state.over ? style.disabledButton : style.button}
						onPress={() => this.toggleLiveState()}>
						<Text style={style.blackFont}>
							{this.state.live ? "Pause" : "Resume"}
						</Text>
					</TouchableOpacity>
					<TouchableOpacity style={style.button} onPress={() => this.completeActivity()}>
						<Text style={style.blackFont}>
							Stop
						</Text>
					</TouchableOpacity>
				</View>
			</ImageBackground>
		);
	}
}
