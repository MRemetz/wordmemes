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
    inRound = true;
    song = songs[Math.floor(Math.random()*songs.length)];
    var timer_sound = new Audio("../static/sounds/"+song+".wav");
    timer_sound.play();
    disableScoreButtons();
    setTimeout(roundEnd, 1000);
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

    // globals
    var canvas;
    var ctx;
    var W;
    var H;
    var mp = 150; //max particles
    var particles = [];
    var angle = 0;
    var tiltAngle = 0;
    var confettiActive = true;
    var animationComplete = true;
    var deactivationTimerHandler;
    var reactivationTimerHandler;
    var animationHandler;

    // objects
    var particleColors = {
        colorOptions: ["DodgerBlue", "OliveDrab", "Gold", "pink", "SlateBlue", "lightblue", "Violet", "PaleGreen", "SteelBlue", "SandyBrown", "Chocolate", "Crimson"],
        colorIndex: 0,
        colorIncrementer: 0,
        colorThreshold: 10,
        getColor: function () {
            if (this.colorIncrementer >= 10) {
                this.colorIncrementer = 0;
                this.colorIndex++;
                if (this.colorIndex >= this.colorOptions.length) {
                    this.colorIndex = 0;
                }
            }
            this.colorIncrementer++;
            return this.colorOptions[this.colorIndex];
        }
    }

    function confettiParticle(color) {
        this.x = Math.random() * W; // x-coordinate
        this.y = (Math.random() * H) - H; //y-coordinate
        this.r = RandomFromTo(10, 30); //radius;
        this.d = (Math.random() * mp) + 10; //density;
        this.color = color;
        this.tilt = Math.floor(Math.random() * 10) - 10;
        this.tiltAngleIncremental = (Math.random() * 0.07) + .05;
        this.tiltAngle = 0;

        this.draw = function () {
            ctx.beginPath();
            ctx.lineWidth = this.r / 2;
            ctx.strokeStyle = this.color;
            ctx.moveTo(this.x + this.tilt + (this.r / 4), this.y);
            ctx.lineTo(this.x + this.tilt, this.y + this.tilt + (this.r / 4));
            return ctx.stroke();
        }
    }

    $(document).ready(function () {
        SetGlobals();
        InitializeConfetti();

        $(window).resize(function () {
            W = window.innerWidth;
            H = window.innerHeight;
            canvas.width = W;
            canvas.height = H;
        });

    });

    function SetGlobals() {
        canvas = document.getElementById("canvas");
        ctx = canvas.getContext("2d");
        W = window.innerWidth;
        H = window.innerHeight;
        canvas.width = W;
        canvas.height = H;
    }

    function InitializeConfetti() {
        particles = [];
        animationComplete = false;
        for (var i = 0; i < mp; i++) {
            var particleColor = particleColors.getColor();
            particles.push(new confettiParticle(particleColor));
        }
    }

    function Draw() {
        ctx.clearRect(0, 0, W, H);
        var results = [];
        for (var i = 0; i < mp; i++) {
            (function (j) {
                results.push(particles[j].draw());
            })(i);
        }
        Update();

        return results;
    }

    function RandomFromTo(from, to) {
        return Math.floor(Math.random() * (to - from + 1) + from);
    }


    function Update() {
        var remainingFlakes = 0;
        var particle;
        angle += 0.01;
        tiltAngle += 0.1;

        for (var i = 0; i < mp; i++) {
            particle = particles[i];
            if (animationComplete) return;

            if (!confettiActive && particle.y < -15) {
                particle.y = H + 100;
                continue;
            }

            stepParticle(particle, i);

            if (particle.y <= H) {
                remainingFlakes++;
            }
            CheckForReposition(particle, i);
        }

        if (remainingFlakes === 0) {
            StopConfetti();
        }
    }

    function CheckForReposition(particle, index) {
        if ((particle.x > W + 20 || particle.x < -20 || particle.y > H) && confettiActive) {
            if (index % 5 > 0 || index % 2 == 0) //66.67% of the flakes
            {
                repositionParticle(particle, Math.random() * W, -10, Math.floor(Math.random() * 10) - 20);
            } else {
                if (Math.sin(angle) > 0) {
                    //Enter from the left
                    repositionParticle(particle, -20, Math.random() * H, Math.floor(Math.random() * 10) - 20);
                } else {
                    //Enter from the right
                    repositionParticle(particle, W + 20, Math.random() * H, Math.floor(Math.random() * 10) - 20);
                }
            }
        }
    }
    function stepParticle(particle, particleIndex) {
        particle.tiltAngle += particle.tiltAngleIncremental;
        particle.y += (Math.cos(angle + particle.d) + 3 + particle.r / 2) / 2;
        particle.x += Math.sin(angle);
        particle.tilt = (Math.sin(particle.tiltAngle - (particleIndex / 3))) * 15;
    }

    function repositionParticle(particle, xCoordinate, yCoordinate, tilt) {
        particle.x = xCoordinate;
        particle.y = yCoordinate;
        particle.tilt = tilt;
    }

    function StartConfetti() {
        W = window.innerWidth;
        H = window.innerHeight;
        canvas.width = W;
        canvas.height = H;
        (function animloop() {
            if (animationComplete) return null;
            animationHandler = requestAnimFrame(animloop);
            return Draw();
        })();
    }

    function ClearTimers() {
        clearTimeout(reactivationTimerHandler);
        clearTimeout(animationHandler);
    }

    function DeactivateConfetti() {
        confettiActive = false;
        ClearTimers();
    }

    function StopConfetti() {
        animationComplete = true;
        if (ctx == undefined) return;
        ctx.clearRect(0, 0, W, H);
    }

    function RestartConfetti() {
        ClearTimers();
        StopConfetti();
        reactivationTimerHandler = setTimeout(function () {
            confettiActive = true;
            animationComplete = false;
            InitializeConfetti();
        }, 100);

    }

    window.requestAnimFrame = (function () {
        return window.requestAnimationFrame || 
        window.webkitRequestAnimationFrame || 
        window.mozRequestAnimationFrame || 
        window.oRequestAnimationFrame || 
        window.msRequestAnimationFrame || 
        function (callback) {
            return window.setTimeout(callback, 1000 / 60);
        };
    })();
