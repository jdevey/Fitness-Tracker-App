export class Activity {
	constructor (oldWeather, oldTemp, newWeather, newTemp, type, duration, distance, pace, note, pic, date, rewards, oldElevation, newElevation) {
		this.oldWeather = oldWeather;
		this.oldTemp = oldTemp;
		this.newWeather = newWeather;
		this.newTemp = newTemp;
		this.type = type;
		this.duration = duration;
		this.distance = distance;
		this.pace = pace;
		this.note = note;
		this.pic = pic;
		this.date = date;
		this.rewards = rewards;
		this.oldElevation = oldElevation;
		this.newElevation = newElevation;
	}
}
