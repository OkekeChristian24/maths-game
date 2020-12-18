//javascript.js
var playing = false;
var score;
var action;
var timeremaining;
var correctAnswer;



//show top scores on windows load
listen("load", window, showTopScores);
hide('notify');

/*document.getElementById("setTime").onchange = function(){
    location.reload();
    timeremaining = this.value;
    
}
*/

//if we click on the start/reset
document.getElementById("startreset").onclick = function(){
    
    //if we are playing
    
    if(playing == true){
        
        location.reload(); //reload page
        
        
    }else{//if we are not playing
        
        //change mode to playing
        
        playing = true;
        
        //set score to 0
        
        score = 0;
        document.getElementById("scorevalue").innerHTML = score;
     
        //show countdown box 
        
        show("timeremaining");
        var timeval = document.getElementById("setTime").value;
        timeremaining = timeval;
        document.getElementById("timeremainingvalue").innerHTML = timeremaining;
        
        //hide game over box
        
        hide("gameOver");
        
        //change button to reset
        document.getElementById("startreset").innerHTML = "Reset Game";
        
        //start countdown
        
        startCountdown();
        
        //show top scores
        //showTopScores();
        
        //generate a new Q&A
        
        generateQA();
    }
    
}

//Clicking on an answer box
for(i=1; i<5; i++){
    document.getElementById("box"+i).onclick = function(){
    //check if we are playing     
    if(playing == true){//yes
        if(this.innerHTML == correctAnswer){
        //correct answer
            
            //increase score by 1
            score++;
            document.getElementById("scorevalue").innerHTML = score;
            //hide wrong box and show correct box
            hide("wrong");
            show("correct");
            setTimeout(function(){
                hide("correct");   
            }, 1000);
            
            //Generate new Q&A
            generateQA();
        }else{
        //wrong answer
            hide("correct");
            show("wrong");
            setTimeout(function(){
                hide("wrong");   
            }, 1000);
        }
    }else{
        show("notify");
        setTimeout(function(){
            hide("notify");   
        }, 2000);
    }
}   
}


//functions

//start counter
function startCountdown(){
    action = setInterval(function(){
        timeremaining -= 1;
        document.getElementById("timeremainingvalue").innerHTML = timeremaining;
        if(timeremaining == 0){// game over
            stopCountdown();
            show("gameOver");
         document.getElementById("gameOver").innerHTML = "<p onclick='closeAlert()'>&#9747;</p><p>!</p><p>Game over</p><p>Your score is " + score + ".</p>";   
            hide("timeremaining");
            hide("correct");
            hide("wrong");
            playing = false;
            showTopScores(score);
            document.getElementById("startreset").innerHTML = "Start Game";
        }
    }, 1000);    
}

//stop counter
function stopCountdown(){
    clearInterval(action);   
}

//hide an element
function hide(Id){
    document.getElementById(Id).style.display = "none";   
}

//show an element
function show(Id){
    document.getElementById(Id).style.display = "block";   
}


//generate question and multiple answers
function generateQA(){
    var x = 1+ Math.round(19*Math.random());
    var y = 1+ Math.round(19*Math.random());
    var operator = 1+ Math.round(3*Math.random());
    
    switch(operator){
        case 1:
            correctAnswer = x + y;
            document.getElementById("question").innerHTML = x + "+" + y;
            break;
        case 2:
            correctAnswer = x * y;
            document.getElementById("question").innerHTML = x + "*" + y;
            break;
        case 3:
            correctAnswer = x - y;
            document.getElementById("question").innerHTML = x + "-" + y;
            break;
        default:
            if(y==0)
                y += 1;
            correctAnswer = x / y;
            correctAnswer = Math.round((correctAnswer + Number.EPSILON)*100)/100;
            document.getElementById("question").innerHTML = x + "/" + y;   
    }
    
    var correctPosition = 1+ Math.round(3*Math.random());
    
    document.getElementById("box"+correctPosition).innerHTML = correctAnswer; //fill one box with the correct answer
    
    //fill other boxes with wrong answers
    var answers = [correctAnswer];
    
    for(i=1; i<5; i++){
        if(i != correctPosition) {
            var wrongAnswer;
            do{
                switch(operator){
                    case 1:
                    case 2:
                        wrongAnswer = (1+ Math.round(9*Math.random()))*(1+ Math.round(19*Math.random()));
                        break;
                    case 3:
                        wrongAnswer = (1+ Math.round(9*Math.random()))-(1+ Math.round(19*Math.random()));
                        break;
                    default:
                        wrongAnswer = (1+ Math.round(9*Math.random()))/(1+ Math.round(19*Math.random()));
                        wrongAnswer = Math.round((wrongAnswer + Number.EPSILON)*100)/100;  
                }
                
            }while(answers.indexOf(wrongAnswer)>-1)
            document.getElementById("box"+i).innerHTML = wrongAnswer;
            answers.push(wrongAnswer);
        }
    }
}

//get and display the top 5 scores
function showTopScores(score=0){
    var topscores = localStorage.getItem('topscores');
    document.getElementById('topscores').innerHTML = '';
    
    if(topscores == null){
        var topscores = [];
        if(score>0){
            topscores.push(score);
            localStorage.setItem('topscores', JSON.stringify(topscores));
            
            document.getElementById('topscores').innerHTML += '<p class="score">'+score+'</p>';
            
        }else{
           
            document.getElementById('topscores').innerHTML += '<p class="score">No Score</p>';
        }
    }else{
        var topscores = JSON.parse(topscores);
        topscores.sort(function(a, b){return b - a});
        
        if(score>0 && topscores.indexOf(score) == -1){
            
            if(topscores.length<5){
                topscores.push(score);
            }else{
                if(topscores[4]<score){
                    topscores.pop();
                    topscores.push(score);  
                }
            }
            topscores.sort(function(a, b){return b - a});
            localStorage.setItem('topscores', JSON.stringify(topscores));
        }
        
        for(var i=0; i<topscores.length; i++){
            document.getElementById('topscores').innerHTML += '<p class="score">'+topscores[i]+'</p>';
        }
    }
}

// delete the top 5 scores
function deleteScores(){
    localStorage.removeItem("topscores");
    showTopScores();
}

function closeAlert(){
    hide("gameOver");
    clearQA();
}

function clearQA(){
    document.getElementById("question").innerHTML = '';
    document.getElementById("scorevalue").innerHTML = 0;
    for(var i=1; i<5; i++){
        document.getElementById("box"+i).innerHTML = '';
    }
}

// on window load
function listen(evnt, elem, func){
    if(elem.addEventListener) //W3C DOM
        elem.addEventListener(evnt, func, false);
    else if(elem.attachEvent){
        var r = elem.attachEvent("on"+evnt, func);
        return r;
    }
    else window.alert("Cannot run the window loading function");
}