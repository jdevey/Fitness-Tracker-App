import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, Dimensions, Image } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Polyline, Callout, Marker } from 'react-native-maps';

import style from '../styles/style';
import NavigationService from '../services/NavigationService';
import { Activity } from '../models/Activity';

const screen = Dimensions.get('window');
const ASPECT_RATIO = screen.width / screen.height;
const LATITUDE_DELTA = 0.001;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const WEATHER_ID = '';

export default class AfterActivity extends Component {

	static navigationOptions = {
		title: 'Post-Activity Analysis'
	}
	
	constructor(props) {
		super(props);

		this.state = {
			lat: this.props.navigation.getParam('lat'),
			lng: this.props.navigation.getParam('lng'),
			region: this.getRegion(this.props.navigation.getParam('points')),
			time: this.props.navigation.getParam('time'),
			distance: this.props.navigation.getParam('distance'),
			pace: this.props.navigation.getParam('pace'),
			points: this.props.navigation.getParam('points'),
			oldWeather: this.props.navigation.getParam('oldWeather'),
			oldTemperature: this.props.navigation.getParam('oldTemperature'),
			newWeather: this.props.navigation.getParam('newWeather'), // use old for now
			newTemperature: this.props.navigation.getParam('newTemperature'), // use old for now
			oldElevation: this.props.navigation.getParam('oldElevation'),
			newElevation: this.props.navigation.getParam('newElevation'),
			type: this.props.navigation.getParam('type'),
			input: '',
			pic: 'http://www.inimco.com/wp-content/themes/consultix/images/no-image-found-360x260.png',
		}

		this.updatePicture = this.updatePicture.bind(this);
		this.deletePoint = this.deletePoint.bind(this);
		this.reCalcStats = this.reCalcStats.bind(this);
		this.updatePoint = this.updatePoint.bind(this);
	}

	componentDidMount() {
		this.getWeather(this.state.lng, this.state.lat);
	}

	getRegion(points) {
		var left = 1000, top = -1000, right = -1000, bottom = 1000;
		for (let i = 0; i < points.length; ++i) {
			left = Math.min(points[i].longitude, left);
			top = Math.max(points[i].latitude, top);
			right = Math.max(points[i].longitude, right);
			bottom = Math.min(points[i].latitude, bottom);
		}
		return {
			latitude: (bottom + top) / 2,
			longitude: (left + right) / 2,
			latitudeDelta: Math.max((top - bottom) * 1.5, LATITUDE_DELTA),
			longitudeDelta: Math.max((right - left) * 1.5, LONGITUDE_DELTA),
		}
	}

	getWeather(longitude, latitude) {
		fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&APPID=${WEATHER_ID}&units=imperial`)
		.then(res => res.json())
		.then(json => this.setState(prevState => {
			return ({
				newWeather: json.weather[0].description,
				newTemperature: json.main.temp
			})
		}))
		.catch(e => {
			console.log("Failed to grab weather");
			console.log(e);
		})
	}

	updatePicture(path) {
		this.setState({pic: path});
	}

	saveActivity() {
		var storage = this.props.navigation.getParam('storage');

		var maxDist = -1, maxTime = -1;
		for (let i = 0; i < storage.activities.length; ++i) {
			maxDist = Math.max(maxDist, storage.activities[i].distance);
			maxTime = Math.max(maxTime, storage.activities[i].duration);
		}

		var date = Date.now();
		var rewards = []

		if (storage.activityCnt % 3 == 2) {
			rewards.push({
				str: "You reached level " + (Math.floor(storage.activityCnt / 3) + 1) + " on " +
					new Date(date).toDateString() + " at " + new Date(date).toLocaleTimeString() + ".",
				activity: date
			})
		}

		if (this.state.time > maxTime) {
			rewards.push({
				str: "You set a new duration record of " + this.state.time + " seconds on " +
					new Date(date).toDateString() + " at " + new Date(date).toLocaleTimeString() + ".",
				activity: date
			})
		}

		if (this.state.distance > maxDist) {
			rewards.push({
				str: "You set a new distance record of " + this.state.distance.toFixed(3) + " miles on " +
					new Date(date).toDateString() + " at " + new Date(date).toLocaleTimeString() + ".",
				activity: date
			})
		}

		var newActivity = new Activity(this.state.oldWeather, this.state.oldTemperature, this.state.newWeather, this.state.newTemperature, this.state.type,
			this.state.time, this.state.distance, this.state.pace, this.state.input, this.state.pic, date, rewards, this.state.oldElevation, this.state.newElevation);

		this.props.navigation.getParam('updateStorage')(newActivity, rewards);

		this.props.navigation.popToTop();
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

	updatePoint(i, point) {
		var arr = this.state.points.concat();
		arr[i] = point.nativeEvent.coordinate;
		this.setState({points: arr.concat()}, () => this.reCalcStats());
	}

	reCalcStats() {
		var distance = 0;
		var pts = this.state.points;
		for (let i = 1; i < pts.length; ++i) {
			distance += this.distanceBetweenPoints(pts[i].latitude, pts[i].longitude, pts[i - 1].latitude, pts[i - 1].longitude);
		}
		this.setState({
			distance: distance,
			pace: this.state.distance / this.state.time * 3600
		})
	}

	deletePoint(i) {
		var arr = this.state.points.concat();
		arr.splice(i, 1);
		this.setState({points: arr.concat()}, () => this.reCalcStats());
	}

	render() {
		return (
			<View style={[style.container, {justifyContent: 'flex-end'}]}>
				<MapView
					provider={PROVIDER_GOOGLE}
					style={style.map}
					region={this.state.region}
				>
					<Polyline 
						coordinates={this.state.points}
						strokeColor={"black"}
						strokeWidth={2}
					/>
					{
						this.state.points.map((p, i) => {
							return (
								<Marker
									draggable
									coordinate={p}
									onDrag={(point) => this.updatePoint(i, point)}
									onPress={() => this.deletePoint(i)}
									key={i}
									pinColor={i == 0 ? 'red' : i == this.state.points.length - 1 ? 'green' : 'yellow'}
								/>
							)
						})
					}
				</MapView>
				<View style={{backgroundColor: 'rgba(200, 200, 200, 0.5)', borderWidth: 2, borderColor: 'rgba(0, 0, 0, 0.5)',
					flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
					<View style={{flexDirection: 'row'}}>
						<Text style={{fontSize: 16, fontWeight: '400', color: 'black', padding: 5, textAlign: 'left', flex: 1, flexDirection: 'column'}}>
							Begin Weather: {this.state.oldWeather} {'\n'}
							Begin Temperature: {this.state.oldTemperature} {'\n'}
							End Weather: {this.state.newWeather} {'\n'}
							End Temperature: {this.state.newTemperature} {'\n'}
							Duration: {this.state.time} seconds {'\n'}
							Distance: {this.state.distance.toFixed(3)} miles {'\n'}
							Average Pace: {this.state.pace.toFixed(3)} mph {'\n'}
							Begin Elevation: {this.state.oldElevation.toFixed(1)} meters {'\n'}
							End Elevation: {this.state.newElevation.toFixed(1)} meters {'\n'}
						</Text>
						<Image source={{uri: this.state.pic}} style={{height: 180, width: 180, margin: 12}} />
					</View>
					<View style={{flexDirection: 'row', margin: 4}}>
						<TouchableOpacity style={[style.opaqueButton, {marginLeft: 4}]} onPress={() => NavigationService.navigate('TakePicture', {updatePicture: this.updatePicture})}>
							<Text>Take Photo</Text>
						</TouchableOpacity>
						<TouchableOpacity style={style.opaqueButton} onPress={() => this.saveActivity()}>
							<Text>Save</Text>
						</TouchableOpacity>
						<TouchableOpacity style={[style.opaqueButton, {marginRight: 4}]} onPress={() => this.props.navigation.popToTop()}>
							<Text>Delete</Text>
						</TouchableOpacity>
					</View>
				</View>
				<View style={{width: '100%', backgroundColor: 'white', borderWidth: 1, borderColor: 'rgba(0, 0, 0, 0.5)', flexDirection: 'row'}}>
					<TextInput style={{height: 44, width: '72%', margin: 8, fontSize: 18}}
						onChangeText={(text) => this.setState({input: text})} maxLength={100} value={this.state.input} placeholder={'How do you feel?'}
					/>
				</View>
			</View>
		);
	}
}
