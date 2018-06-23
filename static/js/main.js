var teamOneScore = 0;
var teamTwoScore = 0;
var finalScore = 7;
var inRound = false;
var sounds = [];

var hostIP = document.getElementById("ip-address").innerHTML;

// Connect to the WS
const ws = new WebSocket("ws://"+hostIP.trim()+":5001");

// Define a handler for 'Open' event
ws.addEventListener("open", (e) => {
    console.log("Established WebSocket connection");
})

// Define a handler for 'Message' event
ws.addEventListener("message", (e) => {
    console.log("Recvd:", e);
    // Parse the response
    resp = JSON.parse(e.data);
    // Handle it
    if(resp.type == "NEW_WORD"){
        document.getElementById("word-box").innerHTML = resp.word;     
    }else if(resp.type == "AUDIO"){
        let audio_wav = "data:audio/wav;base64," + resp.sound.value;
        $("#audio-content").append("<audio id='"+resp.sound.name+"-audio'><source src='"+audio_wav+"' type='audio/wav'/></audio>")
        // Check for endgame sounds
        if(resp.sound.name != "timer" && resp.sound.name != "littycity"){
            sounds.push(resp.sound.name);
        }
        // Check for timer audio
        if(resp.sound.name == "timer"){
            document.getElementById("next-word-button").innerHTML = "Start";
            document.getElementById("next-word-button").disabled = false;
        }
    }
});

function roundEnd(){
    let randSong = sounds[Math.floor(Math.random()*sounds.length)];
    document.getElementById(randSong+"-audio").play();
    enableScoreButtons();
    document.getElementById("next-word-button").innerHTML = "Start";
    document.getElementById("next-word-button").disabled = true;
    inRound = false;
}

function updateWord(){
    if(!inRound){
        startNewRound();
    }
    ws.send("NEW_WORD");
}

function startNewRound(){
    console.log("Starting a new round");
    document.getElementById("next-word-button").innerHTML = "Skip";
    document.body.style.backgroundColor = "white";
    inRound = true;
    console.log("Playing timer from:", document.getElementById("timer-audio"));
    document.getElementById("timer-audio").play();
    disableScoreButtons();
    setTimeout(roundEnd, 59450);
}

function increment(obj){
    // Renenable the button
    document.getElementById("next-word-button").disabled = false;
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

    document.getElementById("littycity-audio").play();
    StartConfetti();
    setTimeout(DeactivateConfetti, 15000);
    disableScoreButtons();
    teamOneScore = 0;
    teamTwoScore = 0;
    document.getElementById("team-1-score").innerHTML = 0;
    document.getElementById("team-2-score").innerHTML = 0;
}
