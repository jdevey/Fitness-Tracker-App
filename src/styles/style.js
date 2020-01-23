import { StyleSheet } from 'react-native';

export default StyleSheet.create({
	map: {
		...StyleSheet.absoluteFillObject
	},
	container: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center'
	},
	button: {
		alignItems: 'center',
		backgroundColor: 'rgba(200, 200, 200, 0.8)',
		padding: 10,
		margin: 10,
		borderWidth: 5,
		borderColor: 'rgba(128, 128, 128, 0.8)',
		width: 180
	},
	disabledButton: {
		alignItems: 'center',
		backgroundColor: 'rgba(128, 128, 128, 0.8)',
		padding: 10,
		margin: 10,
		borderWidth: 5,
		borderColor: 'rgba(100, 100, 100, 0.8)',
		width: 180
	},
	opaqueButton: {
		height: 35,
		width: 126,
		margin: 5,
		padding: 10,
		borderWidth: 1,
		borderColor: 'rgba(0, 0, 0, 0.5)',
		backgroundColor: 'rgba(200, 200, 200, 0.5)',
		alignItems: 'center',
		justifyContent: 'center'
	},
	smallOpaqueButton: {
		height: 35,
		width: 140,
		margin: 2,
		padding: 2,
		borderWidth: 1,
		borderColor: 'rgba(0, 0, 0, 0.5)',
		backgroundColor: 'rgba(200, 200, 200, 0.5)',
		alignItems: 'center',
		justifyContent: 'center'
	},
	smallOpaqueButtonDisabled: {
		height: 35,
		width: 140,
		margin: 2,
		padding: 2,
		borderWidth: 1,
		borderColor: 'rgba(0, 0, 0, 0.5)',
		backgroundColor: 'rgba(120, 120, 120, 0.5)',
		alignItems: 'center',
		justifyContent: 'center'
	},
	pickerItem: {
		fontSize: 6
	},
	blackFont: {
		fontSize: 16,
		fontWeight: '400',
		color: 'black'
	}
})
