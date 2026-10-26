let writtenTweets = [];
function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	//TODO: Filter to just the written tweets
	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});
	tweet_array.forEach(function (tweet) {
		if (tweet.written) writtenTweets.push(tweet);
	})
}

function addEventHandlerForSearch() {
	//add an event to the input
	 textInput = document.getElementById("textFilter"); 
	 textInput.addEventListener("input", function() {
		table = document.getElementById("tweetTable")
		table.innerText = "";
		input = textInput.value;
		if (input != "") {
			filteredTweets = [];
			index = 1;
			writtenTweets.forEach(function(tweet) {
				if (tweet.writtenText.toLowerCase().includes(input.toLowerCase())) {
					filteredTweets.push(tweet);
					table.insertAdjacentHTML("beforeend", tweet.getHTMLTableRow(index));
					index++;
				}
			})
		}
		// set text elements
		if (input == "") document.getElementById("searchCount").innerText = 0;
		else document.getElementById("searchCount").innerText = filteredTweets.length;
		document.getElementById("searchText").innerText = input;
	 })
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	document.getElementById("searchCount").innerText = 0;
	document.getElementById("searchText").innerText = "";
	addEventHandlerForSearch();
	loadSavedRunkeeperTweets().then(parseTweets);
});