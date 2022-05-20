const easy = [
  "6------7------5-2------1---362----81--96-----71--9-4-5-2---651---78----345-------",
  "685329174971485326234761859362574981549618732718293465823946517197852643456137298",
];
const medium = [
  "--9-------4----6-758-31----15--4-36-------4-8----9-------75----3-------1--2--3--",
  "619472583243985617587316924158247369926531478734698152891754236365829741472163895",
];
const hard = [
  "-1-5-------97-42----5----7-5---3---7-6--2-41---8--5---1-4------2-3-----9-7----8--",
  "712583694639714258845269173521436987367928415498175326184697532253841769976352841",
];

var timer;
var timeRemaining;
var lives;
var selectedNum;
var selectedTile;
var disableSelect;
let board;

function id(id) {
    return document.getElementById(id);
}
function qs(id) {
    return document.querySelector(id);
}
function qsa(id) {
    return document.querySelectorAll(id);
}

function clearPrev(){
    let tiles=qsa(".tile");
    for(let i=0;i<tiles.length;i++){
        tiles[i].remove();
    }
    if(timer)clearTimeout(timer);
    for(let i=0;i<id("number-container").children.length;i++){
        id("number-container").children[i].classList.remove("selected");
    }
    selectedNum=null;
    selectedTile=null;
}

function updateMove(){
    if(selectedTile && selectedNum){
        selectedTile.textContent=selectedNum.textContent;
        if(checkCorrect(selectedTile)){
            selectedTile.classList.remove("selected");
            selectedNum.classList.remove("selected");
            selectedTile.classList.add("correct");
            setTimeout(()=>{
                selectedTile.classList.remove("correct");
                selectedNum=selectedTile=null;
            },1000);
            if(checkDone()) endGame();
        }else{
            disableSelect=true;
            selectedTile.classList.add("incorrect");
            lives--;
            setTimeout(()=>{
                if(lives==0) endGame();
                else{
                    id("lives").innerText="Lives Remaining: "+lives;
                    disableSelect=false;
                }              
                selectedTile.classList.remove("incorrect");
                selectedTile.classList.remove("selected");
                selectedNum.classList.remove("selected");
                selectedTile.textContent="";
                selectedTile=selectedNum=null;
            },1000);
        }
    }
}

function checkDone(){
    let tiles=qsa(".tile");
    for(let i=0;i<tiles.length;i++){
        if(tiles[i].textContent=="") return false;
    }
    return true;
}

function endGame(){
    disableSelect=true;
    clearTimeout(timer);
    if(lives==0 || timeRemaining==0){
        id("lives").textContent="You Lost";
    }else{
        id("lives").textContent="You Won";
    }
}

function checkCorrect(tile){
    let solution;
    if(id("diff-1").checked) solution=easy[1];
    else if(id("diff-2").checked) solution=medium[1];
    else if(id("diff-3").checked) solution=hard[1];
    console.log(solution[1]+" ",tile.textContent);
    if(solution.charAt(tile.id)==tile.textContent) return true;
    else return false;
}

function generateBoard(board){
    clearPrev();
    let idCount=0;
    for(let i=0;i<81;i++){
        let tile=document.createElement("p");
        if(board.charAt(i)!="-"){
            tile.textContent=board.charAt(i);
        }else{
            tile.addEventListener("click",()=>{
                if(!disableSelect){
                    if(tile.classList.contains("selected")){
                        tile.classList.remove("selected");
                        selectedTile=null;
                    }else{
                        for(let i=0;i<81;i++){
                            qsa(".tile")[i].classList.remove("selected");
                        }
                        tile.classList.add("selected");
                        selectedTile=tile;
                        updateMove();
                    }
                }   
            })
        }
        tile.id=idCount;
        idCount++;
        tile.classList.add("tile");
        if((tile.id>17 && tile.id<27) || (tile.id>44 && tile.id<54)){
            tile.classList.add("bottomBorder");
        }
        if((tile.id+1)%9==3 || (tile.id+1)%9==6){
            tile.classList.add("rightBorder");
        }
        id("board").appendChild(tile);
    }
    
}

function startTimer(){
    if(id("time-1").checked) timeRemaining=180;
    else if(id("time-2").checked) timeRemaining=300;
    else timeRemaining=600;
    id("timer").textContent=timeConversion(timeRemaining);

    timer=setInterval(()=>{
        timeRemaining--;
        if(timeRemaining==0) endGame();
        id("timer").textContent=timeConversion(timeRemaining);
    },1000)
}

function timeConversion(t){
    let min=Math.floor(t/60);
    if(min<10){
        min="0"+min;
    }
    let sec=t%60;
    if(sec<10) sec="0"+sec;
    return min + ":"+sec;
}

function startgame(){
    if(id("diff-1").checked){ board=easy[0]; lives=3;}
    else if(id("diff-2").checked){ board=medium[0]; lives=5;}
    else if(id("diff-3").checked){ board=hard[0]; lives=7;}
    disableSelect=false;
    id("lives").innerText="Lives Remaining: "+lives;
    generateBoard(board);
    startTimer();
    if(id("theme-1").checked){
        qs("body").classList.remove("dark");
    }else{
        qs("body").classList.add("dark");
    }
    id("number-container").classList.remove("hidden");
}

window.onload = () => {
    id("start-btn").addEventListener('click',startgame);
    for(let i=0;i<id("number-container").children.length;i++){
        let temp=id("number-container").children[i];
        temp.addEventListener('click',()=>{
            if(!disableSelect){
                if(temp.classList.contains("selected")){
                    temp.classList.remove("selected");
                    selectedNum=null;
                }else{
                    for(let i=0;i<9;i++){
                        temp.classList.remove("selected");
                    }
                    temp.classList.add("selected");
                    selectedNum=temp;
                    updateMove();
                }
            }
        })
    }
};