// takes in a className and value and sets the text of all classes on the page with that name to the value
// not necessary but it makes the code cleaner
function setClassText(className, value) {
	document.querySelectorAll('.' + className).forEach(function (element) {
		element.innerText = value;
	});
}

function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});
	
	//This line modifies the DOM, searching for the tag with the numberTweets ID and updating the text.
	//It works correctly, your task is to update the text of the other tags in the HTML file!

	// simple updates
	document.getElementById('numberTweets').innerText = tweet_array.length;	
	document.getElementById('firstDate').innerText = tweet_array[tweet_array.length - 1].time.toLocaleDateString("en-US", {
		// follow the expected format
		year: "numeric",
		month: "long",
		day: "numeric",
		weekday: "long"
	});
	document.getElementById('lastDate').innerText = tweet_array[0].time.toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
		weekday: "long"
	});

	// set up the vars
	var completedEvents = 0;
	var liveEvents = 0;
	var achievements = 0;
	var miscellaneous = 0;
	var written = 0;

	//updates the vars according to the tweets.source in tweet_array
	for (let i = 0; i < tweet_array.length; i++) {
		if (tweet_array[i].source == "completed_event") {
			completedEvents++;
			if (tweet_array[i].written == true) written++;
		}
		else if (tweet_array[i].source == "achievement") achievements++;
		else if (tweet_array[i].source == "live_event") liveEvents++;
		else miscellaneous++;
	}

	// updates the text on the page
	setClassText('completedEvents', completedEvents);
	setClassText('liveEvents', liveEvents);
	setClassText('achievements', achievements);
	setClassText('miscellaneous', miscellaneous);
	setClassText('written', written);

	// calculate the percentages
	var pctComp = math.format((completedEvents / tweet_array.length) * 100, { notation: 'fixed', precision: 2 });
	var pctLive = math.format((liveEvents / tweet_array.length) * 100, { notation: 'fixed', precision: 2 });
	var pctAchv = math.format((achievements / tweet_array.length) * 100, { notation: 'fixed', precision: 2 });
	var pctMisc = math.format((miscellaneous / tweet_array.length) * 100, { notation: 'fixed', precision: 2 });
	var pctWrit = math.format((written / completedEvents) * 100, { notation: 'fixed', precision: 2 });

	// updates the percentages
	setClassText('completedEventsPct', pctComp + '%');
	setClassText('liveEventsPct', pctLive + '%');
	setClassText('achievementsPct', pctAchv + '%');
	setClassText('miscellaneousPct', pctMisc + '%');
	setClassText('writtenPct', pctWrit + '%');
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});