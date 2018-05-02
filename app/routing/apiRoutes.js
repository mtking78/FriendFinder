var friends = require("../data/friends.js");
var path = require("path");

// Routes
// =============================================================
module.exports = function(app){
    // A GET route with the url /api/friends. This will be used to display a JSON of all possible friends.
    app.get("/api/friends", function(req, res) {
        res.json(friends);
    });

    // A POST routes /api/friends. This will be used to handle incoming survey results. This route will also be used to handle the compatibility logic.
    app.post("/api/friends", function(req, res){
        var newsurvey = req.body;
        // console.log(newsurvey);
        // console.log(friends);
        var bestMatch;
        var surveyDifference = [];
        var varianceArray = [];

        // Loop through each of the surveys other than the current one from the user
        for (var i = 0; i < friends.length; i++) {
            // Loop through the scores from each survey from parent loop
            for (var j = 0; j < 10; j++) {
                var questionDifference = newsurvey.scores[j] - friends[i].scores[j];
                surveyDifference.push(Math.abs(questionDifference));
            }

             // Get the sum of question differences for each survey to survey comparison
            var totalDifference = surveyDifference.reduce(getSum);
            console.log("surveyDifference: " + surveyDifference);
            console.log("totalDifference: " + totalDifference);

            // Store the sum of question differences as a variable
            surveyDifference = [];
            // Store all the sums in a new array to be used for the best match search
            varianceArray.push(totalDifference);
            console.log(varianceArray);

            // Find the minimum sum of differences
            function indexOfMinimum(varianceArray) {
                if (varianceArray === 0) {
                    return -1;
                }
                var min = varianceArray[0];
                var minIndex = 0;

                for (var i = 1; i < varianceArray.length; i++) {
                    if (varianceArray[i] < min) {
                        minIndex = i;
                        min = varianceArray[i];
                    }
                }
                // Send off the "best match" data to be used after the survey.js post.
                // console.log(friends[minIndex]);
                res.json(friends[minIndex]);
            }
        };

        // Call the function after comparing all surveys, when varianceArray has been filled.
        indexOfMinimum(varianceArray);

        function getSum(total, num) {
            return total + num;
        };
        // Add the new survey object after all comparisons have been made.
        friends.push(newsurvey);
    });
}