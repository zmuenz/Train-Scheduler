var config = {
    apiKey: "AIzaSyDLc2glXLej450BKiwDa1fkuXl_jry40nM",
    authDomain: "train-scheduler-17c45.firebaseapp.com",
    databaseURL: "https://train-scheduler-17c45.firebaseio.com",
    projectId: "train-scheduler-17c45",
    storageBucket: "train-scheduler-17c45.appspot.com",
    messagingSenderId: "918501319221"
};

firebase.initializeApp(config);

var database = firebase.database();

var trainName = "";
var trainDestination = "";
var trainTime = "";
var trainFrequency = 0;

$("#submit").on("click", function (event) {
    // Prevent form from submitting
    event.preventDefault();

    // Get the input values
    trainName = $("#train-name").val().trim();
    trainDestination = $("#destination").val().trim();
    trainTime = $("#train-time").val().trim();
    trainFrequency = $("#train-frequency").val().trim();

    // Save the new price in Firebase
    database.ref().push({
        name: trainName,
        destination: trainDestination,
        time: trainTime,
        frequency: trainFrequency,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
    });

    $("#train-name").val("");
    $("#destination").val("");
    $("#train-time").val("");
    $("#train-frequency").val("");

});

database.ref().on("child_added", function (snapshot) {
    var sv = snapshot.val();

    var newRow = $("<tr>");
    // name 
    var nameCell = $("<td>");
    nameCell.text(sv.name);
    newRow.append(nameCell);
  
    // destination
    var destinationCell = $("<td>");
    destinationCell.text(sv.destination);
    newRow.append(destinationCell);
  
    // frequency
    var frequencyCell = $("<td>");
    frequencyCell.text(sv.frequency);
    newRow.append(frequencyCell);
  
    // next arrival
    var trainTimeConverted = moment(sv.time, "HH:mm").subtract(1, "days");
    var currentTime = moment();
    var diffTime = moment().diff(moment(trainTimeConverted), "minutes");
    var tRemainder = diffTime % sv.frequency;
    var minutesTillTrain = sv.frequency - tRemainder;
    var nextTrain = moment().add(minutesTillTrain, "minutes");
    var nextArrivalCell = $("<td>");
    nextArrivalCell.text(moment(nextTrain).format("hh:mm A"));
    newRow.append(nextArrivalCell);
  
    // minutes away
    var minutesAwayCell = $("<td>");
    minutesAwayCell.text(minutesTillTrain);
    newRow.append(minutesAwayCell);
  
    $("#train-container").append(newRow);
  
  }, function(errorObject) {
    console.log("Errors handled: " + errorObjecxt.code);

});

