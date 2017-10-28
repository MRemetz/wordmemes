var teamOneScore = 0;
var teamTwoScore = 0;

var hostIP = document.getElementById("ip-address").innerHTML;

function updateWord(){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            document.getElementById("word-box").innerHTML = this.responseText;
        }
    };
    xhttp.open("GET","http://"+hostIP+":5000/get_new_word",true);
    xhttp.send();
}

function increment(obj){
    if(obj.id == "team-1-plus")
        document.getElementById("team-1-score").innerHTML = ++teamOneScore;
    else if(obj.id == "team-2-plus")
        document.getElementById("team-2-score").innerHTML = ++teamTwoScore;
}
