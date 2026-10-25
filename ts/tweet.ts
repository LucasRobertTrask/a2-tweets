class Tweet {
	private text:string;
	time:Date;

	constructor(tweet_text:string, tweet_time:string) {
        this.text = tweet_text;
		this.time = new Date(tweet_time);//, "ddd MMM D HH:mm:ss Z YYYY"
	}

	//returns either 'live_event', 'achievement', 'completed_event', or 'miscellaneous'
    get source():string {
        //TODO: identify whether the source is a live event, an achievement, a completed event, or miscellaneous.

        if (this.text.includes("completed") || this.text.includes("posted")) return "completed_event";
        if (this.text.startsWith("Achieved")) return "achievement";
        if (this.text.startsWith("Watch")) return "live_event";

        return "miscellaneous";
    }

    //returns a boolean, whether the text includes any content written by the person tweeting.
    get written():boolean {
        if (this.text.includes(" - ")) return true;
        return false;
    }

    get writtenText():string {
        if(!this.written) {
            return "";
        }
        let startpos:number = this.text.indexOf(" - ") + 3;
        let firstCut = this.text.substring(startpos);
        let endpos:number = firstCut.indexOf(" https:");
        return firstCut.substring(startpos, endpos);
    }

    // helper function to get only the auto-generated text from the tweet
    get generatedText():string {
        let runkeeperIndex:number = this.text.indexOf("@Runkeeper"); // index with no written text
        let dashIndex:number = this.text.indexOf(" - "); // index if there is written text
        let index:number;

        // find out which one to use
        if (runkeeperIndex != -1 && dashIndex != -1) { index = runkeeperIndex < dashIndex ? runkeeperIndex : dashIndex; }
        else if (runkeeperIndex == -1 && dashIndex == -1) { index = this.text.length; }
        else if (runkeeperIndex == -1) { index = dashIndex; }
        else { index = runkeeperIndex; }
        return this.text.substring(0, index);
    }

    get activityType():string {
        if (this.source != 'completed_event') {
            return "unknown";
        }

        // all the categories I could find there are more since others is not empty but its a small amount
        let information:string = this.generatedText;
        if (information.includes("nordic")) return "nordic walk";
        if (information.includes("walk")) return "walk";
        if (information.includes("ski")) return "ski run";
        if (information.includes("run")) return "run";
        if (information.includes("mtn")) return "mtn bike";
        if (information.includes("bike")) return "bike";
        if (information.includes("circuit")) return "circuit workout";
        if (information.includes("elliptical")) return "elliptical workout";
        if (information.includes("CrossFit")) return "CrossFit workout";
        if (information.includes("strength")) return "strength workout";
        if (information.includes("activity")) return "activity";
        if (information.includes("swim")) return "swim";
        if (information.includes("pilates")) return "pilates session";
        if (information.includes("spinning")) return "spinning workout";
        if (information.includes("hike")) return "hike";
        if (information.includes("row")) return "row";
        if (information.includes("chair")) return "chair ride";
        if (information.includes("skate")) return "skate";
        if (information.includes("bootcamp")) return "bootcamp";
        if (information.includes("dance")) return "dance";
        if (information.includes("MySports")) return "MySports Freestyle";
        if (information.includes("sports")) return "sports";
        if (information.includes("yoga")) return "yoga";
        return "other";
    }

    get distance():number {
        if(this.source != 'completed_event') {
            return 0;
        }
        let information:string = this.generatedText;
        let indexBeforeDecimal:number;
        let km:boolean = false;
        if (information.includes("mi ")) indexBeforeDecimal = information.indexOf("mi ") - 5; // decimal is always 5 before
        else if (information.includes("km ")) {indexBeforeDecimal = information.indexOf("km ") - 5; km = true; }
        else return 0;
        
        // find the index where the number starts
        let startIndex = indexBeforeDecimal;
        while (!isNaN(parseInt(information.charAt(startIndex)))) {
            startIndex--;
        }
        let distance:number = parseFloat(information.substring(startIndex)); //only parses the first word which
        if (km) distance *=  0.621371; // convert to miles
        distance = Math.round(distance * 100) / 100;
        return distance;
    }

    getHTMLTableRow(rowNumber:number):string {
        //TODO: return a table row which summarizes the tweet with a clickable link to the RunKeeper activity
        return "<tr></tr>";
    }
}