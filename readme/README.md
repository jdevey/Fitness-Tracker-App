# FITNESS APP

## Extra Credit
I did the following for extra credit:

* Draggable points on final map
* Deleteable points on final map
* Distances and pace are updated accordingly
* Starting point is red; intermediate points are yellow; ending point is green. However, points often overlap due to requests that happen close together, so you may sometimes have to drag them apart.
* Drag points via a long click; delete points via a short click.
* 20 points

* Elevation is tracked. It shows up during live activites and in subsequent places where statistics are usually shown.
* 10 points

* Subpace is tracked. It shows the average pace over the last 30 second during live activities.
* 10 points

## How The App Works
The 3 rewards I am tracking are:
* Every three activities, you level up. You start at level zero.
* New distance records
* New duration records

Reset storage is provided as a convenience. It clears all async storage. While viewing activites, filtering by last minute, hour, etc. is also provided as a testing convenience.

React Native geolocation's altitude tracker is broken for emulators but works for real phones.

You won't see the splash screen unless you close the app, then pull up the list of apps on the phone and open the app again.

## Cognitive Walkthrough
You'll find them in the readme directory (right here).
