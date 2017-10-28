var teamOneScore = 0;
var teamTwoScore = 0;
var inRound = false;
var clickedBefore = false;
var finalScore = 7;

var hostIP = document.getElementById("ip-address").innerHTML;
var songs = ["bazinga","suhdude","oohbaby","enemyspotted","fuckherrightinthepussy","hagay","imgay"];

function roundEnd(){
    enableScoreButtons();
    document.getElementById("next-word-button").innerHTML = "Start";
    inRound = false;
}

function updateWord(){
    if(clickedBefore == false){
        console.log("Preloading audio files");
        document.getElementById("next-word-button").innerHTML = "Start";
        preLoad();
        clickedBefore = true;
        return;
    }else if(inRound == false){
        startNewRound();
    }

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            document.getElementById("word-box").innerHTML = "";
            document.getElementById("word-box").innerHTML = this.responseText;
        }
    };
    url = "http://"+hostIP.replace(/ /g,'')+":5000/get_new_word";
    xhttp.open("GET",url,true);
    xhttp.send();
}

function startNewRound(){
    console.log("Starting a new round");
    document.getElementById("next-word-button").innerHTML = "Skip";
    document.body.style.backgroundColor = "white";
    inRound = true;
    song = songs[Math.floor(Math.random()*songs.length)];
    var timer_sound = new Audio("../static/sounds/"+song+".wav");
    timer_sound.play();
    disableScoreButtons();
    setTimeout(roundEnd, 64000);
}

function increment(obj){
    if(obj.id == "team-1-plus"){
        document.getElementById("team-1-score").innerHTML = ++teamOneScore;
        document.getElementById("team-1-minus").disabled = false;
        if(teamOneScore == finalScore){
            endGame(1);
        }
    }
    else if(obj.id == "team-2-plus"){
        document.getElementById("team-2-score").innerHTML = ++teamTwoScore;
        document.getElementById("team-2-minus").disabled = false;
        if(teamTwoScore == finalScore){
            endGame(2);
        }
    }
}

function decrement(obj){
    if(obj.id == "team-1-minus"){
        document.getElementById("team-1-score").innerHTML = --teamOneScore;
        if(teamOneScore == 0)
            document.getElementById("team-1-minus").disabled = true;
    }
    else if(obj.id == "team-2-minus"){
        document.getElementById("team-2-score").innerHTML = --teamTwoScore;
        if(teamTwoScore == 0)
            document.getElementById("team-2-minus").disabled = true;
    }
}

function disableScoreButtons(){
    document.getElementById("team-1-minus").disabled = true;
    document.getElementById("team-2-minus").disabled = true;
    document.getElementById("team-1-plus").disabled = true;
    document.getElementById("team-2-plus").disabled = true;
}

function enableScoreButtons(){
    document.getElementById("team-1-plus").disabled = false;
    document.getElementById("team-2-plus").disabled = false;
    if(teamOneScore > 0)
        document.getElementById("team-1-minus").disabled = false;
    if(teamTwoScore > 0)
        document.getElementById("team-2-minus").disabled = false;
}

function endGame(winningTeam){
    if(winningTeam == 1){
        document.getElementById("word-box").innerHTML = "Team 1 Wins!";
        document.body.style.backgroundColor = "#ff9999";
    }else if(winningTeam == 2){
        document.getElementById("word-box").innerHTML = "Team 2 Wins!";
        document.body.style.backgroundColor = "#b3b3ff";
    }

    var timer_sound = new Audio("../static/sounds/littycity.wav");
    timer_sound.play();
    StartConfetti();
    setTimeout(DeactivateConfetti, 15000);
    disableScoreButtons();
    teamOneScore = 0;
    teamTwoScore = 0;
    document.getElementById("team-1-score").innerHTML = 0;
    document.getElementById("team-2-score").innerHTML = 0;
}

function preLoad(){
    var x = null;
    x = new Audio("../static/sounds/bazinga.wav");
    x.play();
    x.pause();
}
