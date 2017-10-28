var teamOneScore = 0;
var teamTwoScore = 0;
var inRound = false;

var hostIP = document.getElementById("ip-address").innerHTML;

function roundEnd(){
    enableScoreButtons();
    document.getElementById("next-word-button").innerHTML = "Start";
    inRound = false;
}

function updateWord(){
    if(inRound == false){
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
    inRound = true;
    var timer_sound = new Audio("../static/sounds/bazinga.wav");
    timer_sound.play();
    disableScoreButtons();
    setTimeout(roundEnd, 64000);
}

function increment(obj){
    if(obj.id == "team-1-plus"){
        document.getElementById("team-1-score").innerHTML = ++teamOneScore;
        document.getElementById("team-1-minus").disabled = false;
        if(teamOneScore == 7){
            endGame();
        }
    }
    else if(obj.id == "team-2-plus"){
        document.getElementById("team-2-score").innerHTML = ++teamTwoScore;
        document.getElementById("team-2-minus").disabled = false;
        if(teamTwoScore == 7){
            endGame();
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

function endGame(){
    var timer_sound = new Audio("../static/sounds/litty_city.wav");
    timer_sound.play();
    disableScoreButtons();
    teamOneScore = 0;
    teamTwoScore = 0;
    document.getElementById("team-1-score").innerHTML = 0;
    document.getElementById("team-2-score").innerHTML = 0;
}

function preLoad(){
    var x = null;
    x = new Audio("../static/sounds/bazinga.wav");
    x = new Audio("../static/sounds/oohbaby.wav");
    x = new Audio("../static/sounds/suhdude.wav");
    x = new Audio("../static/sounds/littycity.wav");
}
