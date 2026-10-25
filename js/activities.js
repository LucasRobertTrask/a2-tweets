function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}
	
	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	//TODO: create a new array or manipulate tweet_array to create a graph of the number of tweets containing each type of activity.

	// Parse all the tweets into js objects that the Vega Lite can use
	let graphData = [];
	tweet_array.forEach(function (tweet) {
		if (tweet.source == 'completed_event') {
            graphData.push({activityType: tweet.activityType, distance: tweet.distance, weekday: tweet.time.toLocaleDateString(
			"en-US", {
				weekday: "short"
			})});
        }

	})

	// Graph for # of tweets per activity type
	activity_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "A graph of the number of Tweets containing each type of activity.",
	  "data": {
	    "values": graphData
	  },
	  "mark": "bar",
	  "encoding" : {
		"x": {
			"field": "activityType",
			"type": "nominal" , // categorical
			"sort": "-y", // largest to smallest
			"axis": {
				"title": "Activity Types"
			}
		},
		"y": {
			"aggregate": "count",
			"type": "quantitative",
			"axis": {
				"title": "# of tweets"
			}
		}
	  }
	};
	// tells the page to load the graph onto the div with the class tag
	vegaEmbed('#activityVis', activity_vis_spec, {actions:false});

	//TODO: create the visualizations which group the three most-tweeted activities by the day of the week.
	//Use those visualizations to answer the questions about which activities tended to be longest and when.

	// filter the data to only the entries within the top three (hard coded)
	graphDataTopThree = graphData.filter(function(dataPoint) {
		return dataPoint.activityType == "run"
		|| dataPoint.activityType == "walk"
		|| dataPoint.activityType == "bike";
	})

	// graph for the all activities and their distances
	distanceVis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "A graph of the distances by day of the week for all of the three most tweeted-about activities.",
	  "data": {
	    "values": graphDataTopThree
	  },
	  "mark": "point",
	  "encoding" : {
		"x": {
			"field": "weekday",
			"type": "ordinal" , // doesn't have to be ordinal but it makes more sense
			"sort": ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], //same order as directions; has to match exactly to work
			"axis": {
				"title": "Day of the Week"
			}
		},
		"y": {
			"field": "distance",
			"type": "quantitative",
			"axis": {
				"title": "Distance (miles)"
			}
		},
		"color": {
			"field": "activityType",
			"type": "nominal",
			"scale": {
				"domain": ["run", "walk", "bike"] // default colors
			}
		}
	  }
	};
	vegaEmbed('#distanceVis', distanceVis_spec, {actions:false});

	// graph for the means
	distanceVisAggregated_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "A graph of the distances by day of the week for all of the three most tweeted-about activities aggregates by the mean.",
	  "data": {
	    "values": graphDataTopThree
	  },
	  "mark": "point",
	  "encoding" : {
		"x": {
			"field": "weekday",
			"type": "ordinal" ,
			"sort": ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
			"axis": {
				"title": "Day of the Week"
			}
		},
		"y": {
			"aggregate": "mean", // only change just graphs the means
			"field": "distance",
			"type": "quantitative",
			"axis": {
				"title": "Average Distance (miles)"
			}
		},
		"color": {
			"field": "activityType",
			"type": "nominal",
			"scale": {
				"domain": ["run", "walk", "bike"]
			}
		}
	  }
	};
	vegaEmbed('#distanceVisAggregated', distanceVisAggregated_spec, {actions:false});

	// map of type to the number of times it shows up
	let activityTypes = {};
	// counts the number of times each activityType is shown
	graphData.forEach(function (dataPoint) {
		if (!activityTypes[dataPoint.activityType]) activityTypes[dataPoint.activityType] = 1;
		else activityTypes[dataPoint.activityType]++;
	});

	// changes the display and gets the number of types
	let numberOfActivityTypes = Object.keys(activityTypes).length // Object.keys() to get a list of keys since there is no .keys property
	document.getElementById("numberActivities").innerText = numberOfActivityTypes;

	// represents the top three activity types as pairs with their total number of appearances
	let topThree = [["1st", -1], ["2nd", -2], ["3rd", -3]]
	Object.keys(activityTypes).forEach(function(key) {
		if (activityTypes[key] > topThree[0][1]) { // most popular
			topThree[0][0] = key;
			topThree[0][1] = activityTypes[key];
			return;
		}
		else if (activityTypes[key] > topThree[1][1]) { // second most popular
			topThree[1][0] = key;
			topThree[1][1] = activityTypes[key];
			return;
		}
		else if (activityTypes[key] > topThree[2][1]) { // third most popular
			topThree[2][0] = key;
			topThree[2][1] = activityTypes[key];
			return;
		}
	});

	// update the elements with the information
	document.getElementById("firstMost").innerText = topThree[0][0];
	document.getElementById("secondMost").innerText = topThree[1][0];
	document.getElementById("thirdMost").innerText = topThree[2][0];

	// I wrote all this then read that it can be hard coded .-.
	// guess I should read the directions

	// hard coded
	document.getElementById("longestActivityType").innerText = "bike";
	document.getElementById("shortestActivityType").innerText = "walk";

	// holds the sums of each activities distanct per day
	let distancesPerDaySum = {
		"Sun": [0, 0],
		"Mon": [0, 0],
		"Tue": [0, 0],
		"Wed": [0, 0],
		"Thu": [0, 0],
		"Fri": [0, 0],
		"Sat": [0, 0]
	}
	// adds each activities distance to its corresponding day
	graphData.forEach(function(dataPoint) {
		if (dataPoint.activityType == topThree[0][0] || dataPoint.activityType == topThree[1][0] || dataPoint.activityType == topThree[2][0]) {
		distancesPerDaySum[dataPoint.weekday][0] += dataPoint.distance;
		distancesPerDaySum[dataPoint.weekday][1]++;
		}
	});
	console.log(distancesPerDaySum)
	let distancesPerDayMean = {};
	Object.keys(distancesPerDaySum).forEach(function(key) {
		distancesPerDayMean[key] = distancesPerDaySum[key][0] / distancesPerDaySum[key][1];
	});
	console.log(distancesPerDayMean)
	console.log(distancesPerDayMean)

	// I wrote all this thikning the text wanted the day not weekend or weekday ...
	// initialize max and min vars
	let max = ["max", -1];
	let min = ["min", 9999999]; // min for fun

	Object.keys(distancesPerDayMean).forEach(function(key) {
		if (distancesPerDayMean[key] > max[1]) {
			max[1] = distancesPerDayMean[key];
			max[0] = key;
		}
		if (distancesPerDayMean[key] < min[1]) {
			min[1] = distancesPerDayMean[key];
			min[0] = key;
		}
	});

	// hard coded cause I already wasted so much time
	document.getElementById("weekdayOrWeekendLonger").innerText = "weekends";
	

}


//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);

	// store the elements and hide them on page opening
	let distanceVis = document.getElementById("distanceVis");
	let distanceVisAggregated = document.getElementById("distanceVisAggregated");
	distanceVis.style.display = "none";
	distanceVisAggregated.style.display = "none";

	
	const button = document.getElementById("aggregate"); // store the button in a var
	let graphShowing = false; // for the intial button press
	let graphState = 0; // represents which graph is showing; could be bool but if there were more in the future this holds better
	button.addEventListener("click", function () {
		if (!graphShowing) { // first time its pressed
			graphState = 1;
			distanceVisAggregated.style.display = "block";
			button.textContent = "Show all activities";
			graphShowing = true; // always goes to the else branch now
		} else {
			// updates the values and the page according the instructions
			if (graphState == 1) { 
				distanceVis.style.display = "block";
				distanceVisAggregated.style.display = "none";
				button.textContent = "Show means";
				graphState = 2;
			} else if (graphState == 2) {
				distanceVisAggregated.style.display = "block";
				distanceVis.style.display = "none";
				button.textContent = "Show all activities";
				graphState = 1;
			}
		}
	})
});