import React, { Component } from 'react';
import { YellowBox, Alert } from 'react-native';
import {PermissionsAndroid} from 'react-native';

import NavigationService from './services/NavigationService';

export default class App extends Component {

	componentDidMount() {
		requestAudioPermission();
		requestCameraPermission();
		requestLocationPermission();
		requestExternalStoragePermission();
		Alert.alert(
			'Extra Credit Alert',
			'I have implemented draggable / deleteable final map points, elevation tracking, and a 30-second subpace tracker.' +
			' See README for more details.',
			[
			  {text: 'OK'},
			],
			{cancelable: false},
		  );
	}

	render() {
		YellowBox.ignoreWarnings(['Warning: Async Storage has been extracted from react-native core']);
		return (
			NavigationService.getTopNavigator()
		);
	}
}

async function requestCameraPermission() {
	try {
		const granted = await PermissionsAndroid.request(
			PermissionsAndroid.PERMISSIONS.CAMERA,
			{
				title: 'Fitness App Camera Permission',
				message:
				'This app needs access to your camera.',
				buttonNeutral: 'Ask Me Later',
				buttonNegative: 'Cancel',
				buttonPositive: 'OK',
			},
		);
		if (granted === PermissionsAndroid.RESULTS.GRANTED) {
			console.log('You can use the camera');
		}
		else {
			console.log('Camera permission denied');
		}
	} catch (err) {
		console.warn(err);
	}
}

async function requestLocationPermission() {
	try {
		const granted = await PermissionsAndroid.request(
			PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
			{
				'title': 'Location Permissions',
				'message': 'This app requires your location'
			}
		)
		if (granted === PermissionsAndroid.RESULTS.GRANTED) {
			console.log("You can now use locations.");
		}
		else {
			console.log("Location permissions have been denied.");
		}
	} catch(e) {
		console.warn(e);
	}
}

async function requestAudioPermission() {
	try {
		const granted = await PermissionsAndroid.request(
			PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
			{
				'title': 'Audio Permissions',
				'message': 'This app requires audio recording'
			}
		)
		if (granted === PermissionsAndroid.RESULTS.GRANTED) {
			console.log("You can now use audio.");
		}
		else {
			console.log("Audio permissions have been denied.");
		}
	} catch(e) {
		console.warn(e);
	}
}

async function requestExternalStoragePermission() {
	try {
		const granted = await PermissionsAndroid.request(
			PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
			{
				'title': 'External Storage Permissions',
				'message': 'This app requires external storage'
			}
		)
		if (granted === PermissionsAndroid.RESULTS.GRANTED) {
			console.log("You can now use external storage.");
		}
		else {
			console.log("External storage permissions have been denied.");
		}
	} catch(e) {
		console.warn(e);
	}
}
