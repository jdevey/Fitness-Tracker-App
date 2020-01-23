import React, { Component } from 'react';
import { View, Text, TouchableOpacity, CameraRoll, Image } from 'react-native';
import { RNCamera } from 'react-native-camera';

import style from '../styles/style';

export default class AfterActivity extends Component {

	static navigationOptions = {
		title: 'Take a Picture'
	}
	
	constructor(props) {
		super(props);
		this.updatePicture = this.props.navigation.getParam('updatePicture');
		this.defaultPic = 'http://www.inimco.com/wp-content/themes/consultix/images/no-image-found-360x260.png';
		this.state = {
			front: false,
			pic: this.defaultPic
		}
	}

	takePhoto() {
		if (this.camera) {
			this.camera.takePictureAsync({quality: 0.5, base64: true})
				.then(result => {
					this.setState({pic: result.uri});
				})
				.catch(e => {
					console.log("ERROR TAKING PICTURE: ");
					console.log(e);
				})
		}
	}

	toggleFrontBack() {
		this.setState({front: !this.state.front});
	}

	savePhoto() {
		if (this.state.pic) {
			CameraRoll.saveToCameraRoll(this.state.pic).catch((e) => {
				console.log("ERROR SAVING PIC TO CAMERA ROLL");
				console.log(e);
			})
		}
		this.props.navigation.getParam('updatePicture')(this.state.pic);
		this.props.navigation.goBack();
	}

	cancelPhoto() {
		this.setState({pic: this.defaultPic});
	}

	render() {
		return (
			<View style={[style.container, {justifyContent: 'flex-end'}]}>
				<RNCamera
					ref={ref => {this.camera = ref}}
					style={style.map}
					flashMode={RNCamera.Constants.FlashMode.off}
					type={this.state.front ? RNCamera.Constants.Type.front : RNCamera.Constants.Type.back}
				/>
				<View style={{backgroundColor: 'rgba(200, 200, 200, 0.5)', borderWidth: 1, borderColor: 'rgba(0, 0, 0, 0.5)',
					alignItems: 'center', justifyContent: 'center', width: '100%', flexDirection: 'row'}}>
					<View style={{flexDirection: 'column', justifyContent: 'center'}}>
						<TouchableOpacity style={style.smallOpaqueButton} onPress={() => this.toggleFrontBack()}>
							<Text>Toggle Front/Back</Text>
						</TouchableOpacity>
						<TouchableOpacity style={style.smallOpaqueButton} onPress={() => this.takePhoto()}>
							<Text>Take Picture</Text>
						</TouchableOpacity>
						<TouchableOpacity style={style.smallOpaqueButton} onPress={() => this.savePhoto()}>
							<Text>Save</Text>
						</TouchableOpacity>
						<TouchableOpacity style={style.smallOpaqueButton} onPress={() => this.cancelPhoto()}>
							<Text>Cancel</Text>
						</TouchableOpacity>
					</View>
					<Image
						source={{uri: this.state.pic}}
						style={{height: 150, width: 250}}
					/>
				</View>
			</View>
		);
	}
}
