import React, { Component } from 'react';
import { View, Text, Picker, Dimensions, TouchableOpacity } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Callout, Marker } from 'react-native-maps';

import style from '../styles/style';
import NavigationService from '../services/NavigationService';

const screen = Dimensions.get('window');
const ASPECT_RATIO = screen.width / screen.height;
const LATITUDE_DELTA = 0.01;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const WEATHER_ID = '';

export default class AfterActivity extends Component {

	static navigationOptions = {
		title: 'Start Activity'
	}
	
	constructor(props) {
		super(props);
		this.state = {
			activity: "Run",
			region: {
				latitude: 51.7,
				longitude: -111.8,
				latitudeDelta: LATITUDE_DELTA,
				longitudeDelta: LONGITUDE_DELTA
			},
			userLocation: {
				latitude: 51.7,
				longitude: -111.8,
			},
			weather: "Retrieving weather",
			temperature: 0,
			elevation: -1
		}
	}

	componentDidMount() {
		navigator.geolocation.getCurrentPosition(
			(position) => {
				this.setState({
					region: {
						latitude: position.coords.latitude,
						longitude: position.coords.longitude,
						latitudeDelta: LATITUDE_DELTA,
						longitudeDelta: LONGITUDE_DELTA
					},
					userLocation: {
						latitude: position.coords.latitude,
						longitude: position.coords.longitude,
					},
					elevation: position.coords.altitude
				});
				this.getWeather(position.coords.longitude, position.coords.latitude);
			},
			(error) => console.log("ERROR OBTAINING USER POSITION IN STARTACTIVITY.JS", error.message),
			{ timeout: 20000, maximumAge: 1000, enableHighAccuracy: true }
		)
	}

	onRegionChange(newRegion) {
		this.setState({ region: newRegion });
	}

	getWeather(longitude, latitude) {
		fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&APPID=${WEATHER_ID}&units=imperial`)
		.then(res => res.json())
		.then(json => this.setState({weather: json.weather[0].description, temperature: json.main.temp}))
		.catch(e => {
			console.log("Failed to grab weather");
			console.log(e);
			reject(e);
		})
	}

	// 41.737, -111.834
	render() {
		return (
			<View style={[style.container, {justifyContent: 'flex-end'}]}>
				<MapView
					provider={PROVIDER_GOOGLE}
					style={style.map}
					region= {this.state.region}
				>
					<Marker
						coordinate={{
							latitude: this.state.userLocation.latitude,
							longitude: this.state.userLocation.longitude
						}}
					>
						<Callout>
							<View>
								<Text>
									You are here
								</Text>
							</View>
						</Callout>
					</Marker>
				</MapView>
				<View style={{backgroundColor: 'rgba(240, 240, 240, 0.5)', width: '100%'}}>
					<View style={{backgroundColor: 'rgba(200, 200, 200, 0.5)', borderWidth: 1, borderColor: 'rgba(0, 0, 0, 0.5)',}}>
						<Text style={{fontSize: 16, fontWeight: '400', color: 'black', padding: 5, textAlign: 'center'}}>
							Weather: {this.state.weather}           Temperature: {this.state.temperature}
						</Text>
					</View>
					<View style={{flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'center'}}>
					<View style={{margin: 5, borderWidth: 1, borderColor: 'rgba(0, 0, 0, 0.5)', backgroundColor: 'rgba(200, 200, 200, 0.5)'}}>
						<Picker
							selectedValue={this.state.activity}
							style={{height: 33, width: 130, borderWidth: 1, borderColor: 'rgba(0, 0, 0, 0.5)'}}
							itemStyle={style.pickerItem}
							onValueChange={(itemValue, itemIndex) => {
								this.setState({activity: itemValue})
							}}
						>
							<Picker.Item label="Run" value="Run" />
							<Picker.Item label="Walk" value="Walk" />
							<Picker.Item label="Bike Ride" value="Bike Ride" />
						</Picker>
					</View>
						<TouchableOpacity style={style.opaqueButton} onPress={
							() => {
								NavigationService.navigate('LiveActivity', {
									storage: this.props.navigation.getParam('storage'),
									updateStorage: this.props.navigation.getParam('updateStorage'),
									lat: this.state.userLocation.latitude,
									lng: this.state.userLocation.longitude,
									type: this.state.activity,
									weather: this.state.weather,
									temperature: this.state.temperature,
									oldElevation: this.state.elevation
								}
							)}}
						>
							<Text style={style.blackFont}>
								Begin
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		);
	}
}
