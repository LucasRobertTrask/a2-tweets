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
	document.getElementById('numberTweets').innerText = tweet_array.length;	
	document.getElementById('firstDate').innerText = tweet_array[tweet_array.length - 1].time.toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric"
	});
	document.getElementById('lastDate').innerText = tweet_array[0].time.toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric"
	});
	var completedEvents = 0;
	var liveEvents = 0;
	var achievements = 0;
	var miscellaneous = 0;
	for (i = 0; i < tweet_array.length; i++) {
		if (tweet_array[i].source == "completed_event") completedEvents++;
		else if (tweet_array[i].source == "achievement") achievements++;
		else if (tweet_array[i].source == "live_event") liveEvents++;
		else miscellaneous++;
	}

	function setClassText(className, value) {
		document.querySelectorAll('.' + className).forEach(function (element) {
			element.innerText = value;
		});
	}

	setClassText('completedEvents', completedEvents);
	setClassText('liveEvents', liveEvents);
	setClassText('achievements', achievements);
	setClassText('miscellaneous', miscellaneous);

	var pctComp = math.format((completedEvents / tweet_array.length) * 100, { notation: 'fixed', precision: 2 });
	var pctLive = math.format((liveEvents / tweet_array.length) * 100, { notation: 'fixed', precision: 2 });
	var pctAchv = math.format((achievements / tweet_array.length) * 100, { notation: 'fixed', precision: 2 });
	var pctMisc = math.format((miscellaneous / tweet_array.length) * 100, { notation: 'fixed', precision: 2 });

	setClassText('completedEventsPct', pctComp + '%');
	setClassText('liveEventsPct', pctLive + '%');
	setClassText('achievementsPct', pctAchv + '%');
	setClassText('miscellaneousPct', pctMisc + '%');
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});