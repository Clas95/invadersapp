/**
 * Created by clasj on 12.08.2016.
 */
    // Variablen

//Aufrufen der Jquery Library
$(document).ready(function () {
    //Spiel starten Button
    $("#buttonStart").click(function () {
        // Werte Zurücksetzen
        var canvasTL = document.getElementById("timeLine");
        var ctxTL = canvasTL.getContext("2d");
        currMun = 8;
        treffer = 0;
        schusse = 0;
        missed = 0;
        //Zeitleiste Canvas leeren
        ctxTL.clearRect(0, 0, 900, 30);
        //Alienposition zurücksetzen
        for (i = 0; i <= 7; i++) {
            active[i] = 0;
            determ[i] = 0;
            if (i < 4) {
                alienX[i] = -50;
            } else {
                alienX[i] = 770;
            }
        }
        //Munitionsbilder aktualisieren
        munAkt();
        // Werte Zurücksetzen
        document.getElementById("missedAliens").innerHTML = missed;
        document.getElementById("shots").innerHTML = schusse;
        document.getElementById("hits").innerHTML = treffer;
        document.getElementById("kD").innerHTML = "0";
        // Startseite ausblenden und Spiel einblenden
        $("#startseiteSection").fadeOut(500);
        $("#spielSection").delay(510).fadeIn(500);
    });

    //Anleitung Button
    $("#buttonStartBack").click(function () {
        $("#spielSection").fadeOut(500);
        $("#startseiteSection").delay(510).fadeIn(500);
    });
    
    //Anleitung Button
    $("#buttonAnlei").click(function () {
        $("#startseiteSection").fadeOut(500);
        $("#anleitungSection").delay(510).fadeIn(500);
    });

    //Anleitung zurück
    $("#buttonAnleiBack").click(function () {
        $("#anleitungSection").fadeOut(500);
        $("#startseiteSection").delay(510).fadeIn(500);
    });

    //Scoreboard Button
    $("#buttonScore").click(function () {
        rankTable();
        $("#startseiteSection").fadeOut(500);
        $("#scoreboardSection").delay(510).fadeIn(500);
    });

    //Scoreboard zurück
    $("#buttonScoreBack").click(function () {
        $("#scoreboardSection").fadeOut(500);
        $("#startseiteSection").delay(510).fadeIn(500);
    });

    //Spielende Zurück
    $("#buttonEndeBack").click(function () {
        $("#spielendeSection").fadeOut(500);
        $("#startseiteSection").delay(510).fadeIn(500);
        document.getElementById("buttonStartBack").disabled = false;
        document.getElementById("startButton").disabled = false;
        //Song stummschalten und zurücksetzen
        song.pause();
        song.currentTime = 0;
        //Werte als Localstorage speichern
        setScore();
    });
})


//  +++
//  Standart-Funktionen
//  +++

//Zufallszahlen Generator zwischen zwei Zahlen
function zahlZw(kleiner, groesser) {
    return Math.round(Math.random()*(groesser-kleiner)+kleiner);
}

//Timer jede Sekunde Zeit um 1 erhöhen
var currTime = 0;
function timeActual() {
    if (currTime <= levelDur) {
        currTime++;
        counterTrigger = setTimeout(timeActual, 1000);
    }
}


//  +++
//  Definierung globaler Variablen und Konstanten
//  +++

// Array mit Img-Quellen
// Aliens, die nach rechts fliegen
var nachRechts = ["raumschiff1.png", "raumschiff2.png", "raumschiff3.png", "raumschiff4.png"];
// Aliens, die nach links fliegen
var nachLinks = ["raumschiff1l.png", "raumschiff2l.png", "raumschiff3l.png", "raumschiff4l.png"];
// Array mit Anleitungs-Bildwuellen
const anleitungArr = ["anleitung0.png", "anleitung1.png", "anleitung2.png", "anleitung3.png", "anleitung4.png"];

// Audioeinbindung
const song = new Audio("The Prodigy - Invaders Must Die.mp3");
song.volume = 0.7;
const techExplosion1 = new Audio("techexplosion.mp3");
techExplosion1.volume = 0.3;
const techExplosion2 = new Audio("techexplosion.mp3");
techExplosion2.volume = 0.3;
const techExplosion3 = new Audio("techexplosion.mp3");
techExplosion3.volume = 0.3;
const blasterSound1 = new Audio("blaster.mp3");
const blasterSound2 = new Audio("blaster.mp3");
const blasterSound3 = new Audio("blaster.mp3");
const reloadSound = new Audio("Reload.mp3");

//Alien X-Position
var alienX = [];
//Alien Y-Position
var alienY = [];
// Aliens, die Aktiv sind
var active = [];
// Alien Spawnlevel
var level = 1;
// Alien Timeout: bestimmt, wann der Alien spätestens deaktiviert werden muss
var determ = [0, 0, 0, 0, 0, 0, 0, 0];
//Länge des Spiels in Sekunden
var levelDur = 146;//146;
// Zähler für Schusssound 1-3
var shotNr = 0;

var currMun = 7; //aktuelle Munition als wert
var treffer = 0; //zählt getroffene Ziele
var schusse = 0; //zählt abgefeuerte Schüsse
var moveSpeed = 1; //faktor für geschwindigkeit der Alienschiffe
var missed = 0; // durchgekommenen Aliens

//arrays für den Localstorage
var nameArray = [];
var dateArray = [];
var scoreArray = [];


var remainTime = function () { //verbleibende Zeit in Min und Sek
    var tMin = Math.floor(((levelDur + 1 - currTime)/60));
    var tSec = Math.floor((levelDur + 1 - currTime) - (tMin * 60));
    if (tSec <10){ //damit zahlen unter 10 nicht einstellig ausgegeben werden
        tSec = "0"+tSec;
    }
    document.getElementById("timeRemaining").innerHTML = tMin+":"+tSec;
    setTimeout(remainTime, 1000);
}


//  +++
//  Funktionen, die während des Spiels aufgerufen werden
//  +++

//Starten des Spiels
function startButton () {
    song.play();
    document.getElementById("startButton").disabled = true;
    document.getElementById("buttonStartBack").disabled = true;
    currTime = 0;
    munAkt();
    timeActual();
    setTimeout("alienSpawn()",  4000);
    remainTime();
    timeLineRender(5);
    render();



    // Initialisieren der Leveländerungen während des spiels
    level = 1;
    setTimeout("setSpawnLevel(" + 2 + ")", (31*1000));
    setTimeout("setSpawnLevel(" + 1 + ")", (59*1000));
    setTimeout("setSpawnLevel(" + 2 + ")", (62*1000));
    setTimeout("setSpawnLevel(" + 3 + ")", (75*1000));
    setTimeout("setSpawnLevel(" + 2 + ")", (82*1000));
    setTimeout("setSpawnLevel(" + 3 + ")", (89*1000));
    setTimeout("setSpawnLevel(" + 1 + ")", (117*1000));
    setTimeout("setSpawnLevel(" + 2 + ")", (120*1000));
    // Nach dem Spiel: auf nächste Section überblenden, Werte in dieser ändern
    setTimeout("endStats()", (levelDur*1000));
    $("#spielSection").delay(levelDur*1000).fadeOut(1000);
    $("#spielendeSection").delay((levelDur*1000)+1000).fadeIn(500);
}

function setSpawnLevel(lvl) { // Setzen des Spawnlevels
    level = lvl;
}


//Funktion zum Spawnen der Raumschiffe
function alienSpawn() {
    if (currTime <= levelDur) {
        var j = zahlZw(0, 7);
        i=0;
        while ((i < level) && (alienInUse() == true)) {
            while (active[j] == 1) {
                j = zahlZw(0, 7);
            }
            active[j] = 1;
            alienY[j] = zahlZw(20, 500);

            i++;
        } i=0;
        setTimeout(alienSpawn, 1000);
    }
}

//checkt, ob ein Alienslot frei ist
function alienInUse(){
    var checker = 1;
    for (k=0; k < 8; k++)
        if (active[k] == 0) {
            checker = 0;
        }
    if (checker == 0){
        return true
    } else {
        return false
    }
}

//  Rendern des Zeitbalkens
function timeLineRender (xTL) {
    if (currTime <= levelDur){
        var canvasTL = document.getElementById("timeLine");
        var ctxTL = canvasTL.getContext("2d");
        //Farbe des Füllelements abhängig von Abschussrate
        ctxTL.fillStyle = "rgba("+ (255 - Math.round(500 * ( (Math.round((treffer / (schusse + missed)) * 1000) / 1000) - 0.5))) +", "+ Math.round(0 + (500 * ( (Math.round((treffer / (schusse + missed)) * 1000) / 1000) - 0.5))) +", 0, 0.2)";
        ctxTL.fillRect(xTL, 7, 1, 16);
        ctxTL.restore();
        xTL += ((canvasTL.width+8)/(levelDur*20));
        setTimeout("timeLineRender( "+ xTL +" )", 50);
    }
}

//  Neurendern des Canvas
function render() {
    if (currTime <= levelDur){
        var canvas = document.getElementById("canvas");
        var ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, 720, 570);
        for (i=0; i<8; i++){
            if (active[i] == 1) {
                alienAni(i);
            }
        }
        ctx.restore();
        setTimeout("render()", 35);
    }
}

//  Positionierung eines bestimmten Aliens im Canvas
function alienAni(id) {
    if (determ[id] < 5.5)  { // determ bestimmt, wann der Alien spätestens deaktiviert wird
        active[id] = 1;
        determ[id] = determ[id] + 0.055 * moveSpeed;
        x = alienX[id];
        y = alienY[id];
        var canvas = document.getElementById("canvas");
        var ctx = canvas.getContext("2d");
        var img = document.getElementById("alien" + id);
        ctx.drawImage(img, x, y, 70, 70);
        if (id < 4) { // prüft, ob alien nach links oder rechts fliegt und gibt entsprechende Bewegung
            alienX[id] = alienX[id] + 8 * moveSpeed;
        } else {
            alienX[id] = alienX[id] - 8 * moveSpeed;
        }
    } else { // deaktivieren des aliens, wenn dieser detern erreicht hat
        missed++;
        moveAct();
        document.getElementById("missedAliens").innerHTML = missed; // Missed Wert aktualisieren
        document.getElementById("kD").innerHTML = Math.round((treffer / (schusse + missed)) * 100) / 100 // Abschussrate aktualisieren
        active[id] = 0; // Alien deaktivieren
        determ[id] = 0; // Alien determ Zurücksetzen
        if (id < 4) { // Alienposition zurücksetzen
            alienX[id] = -50;
        } else {
            alienX[id] = 770;
        }

    }
}



// Schuss funktion
function shot () {
    if (currMun > (-1) && (currTime > 0) && (currTime <= levelDur)) { // bedingungen: munition da und während des spiels
        if (shotNr == 0) {
            blasterSound1.play();
        }else if (shotNr == 1){
            blasterSound2.play();
        }else {
            blasterSound3.play();
        }
        lastShotFun(0); // Zurücksetzen des Wertes, der info über letzten treffer gibt
        schusse++; // abgegebene Schüsse +1
        currMun = currMun - 1; // Munition abziehen
        document.getElementById("shots").innerHTML = schusse;
        moveAct(); // Aliengeschwindigkeit aktualisieren
        var spielDiv = document.getElementById("spielDiv");
        var mouseX = event.clientX - spielDiv.offsetLeft;
        var mouseY = event.clientY - 30//canvasDiv.offsetTop;
        for (i = 0; i <= 7; i++) {
            // Bedingung, dass Mauskoordinate zwischen Anfang der Alienkoordinate und dessen Ende(Größe der Alien 70) liegt. jeweils plus 5 für bessere Handhabung
            if (((alienX[i] - 5) < mouseX )
                && (mouseX < (alienX[i] + 75))
                && ((alienY[i] + + 5) < mouseY)
                && (mouseY < (alienY[i] + 74))) {
                // desktivieren des aliens und zurücksetzen seiner position
                active[i] = 0;
                determ[i] = 0;
                if (i < 4) {
                    alienX[i] = -50;
                } else {
                    alienX[i] = 770;
                }
                lastShotFun(1); // letzter schuss = Treffer
                currMun = currMun + 2; // hinzufügen von munition durch abschuss
                treffer++;
                document.getElementById("hits").innerHTML = treffer;
                if (shotNr == 0) { //Treffer Sound
                    techExplosion1.play();
                }else if (shotNr == 1){
                    techExplosion2.play();
                }else {
                    techExplosion3.play();
                }
            }
        }
        // Werte Aktualisieren
        document.getElementById("kD").innerHTML = Math.round((treffer / (schusse + missed)) * 100) / 100;
        munAkt();
        shotNr++;
        if (shotNr > 2) {
            shotNr = 0;
        }
    }
}


//  +++
//  Funktionen für die Anzeigewerte
//  +++

// Schlusstabelle
    function endStats() {
        document.getElementById("kD2").innerHTML = Math.round((treffer / (schusse + missed)) * 100) / 100;
        document.getElementById("missedAliens2").innerHTML = missed;
        document.getElementById("shots2").innerHTML = schusse;
        document.getElementById("hits2").innerHTML = treffer;

    }


function lastShotFun(x) { // Anzeige Letzter Treffer
    if (x == 1) {
        document.getElementById("lastShot").innerHTML = "Treffer!";
    } else {
        document.getElementById("lastShot").innerHTML = "Verfehlt!";
    }
}

function munAkt() { //Aktualisieren der Munitionsanzeige
    if (currMun < (-1)) {
        currMun = (-1);
    }
    if (currMun > 7) {
        currMun = 7;
    }
    for (i=0; i<(8-currMun); i++){ //Löschen der verschossenen Kugeln
        var bullSetInactive = document.getElementById("bulSlot"+i);
        bullSetInactive.src = "munition2.png";
    }
    for (i=0; i<=currMun; i++){ //Auffüllen der Kugeln
        var aktuell = 7- i;
        var bullSetActive = document.getElementById("bulSlot"+aktuell);
        bullSetActive.src = "munition1.png";
    }
}

function reloadBtn() { // Ausfühern des Nachladebuttons
    var knopf = document.getElementById("ladeStatus");
    knopf.innerHTML = "Wird geladen...";
    knopf.disabled = true ;
    setTimeout(munAdd, 3000);
}

function munAdd() { // Munition hinzufügen für nachladebutton mit sound
    reloadSound.play();
    currMun++;
    munAkt();
    var knopf = document.getElementById("ladeStatus");
    knopf.innerHTML = "Nachladen";
    knopf.disabled = false ;
}


var moveAct = function () {//Geschwindigkeit der aliens innerhlb 20 sek relativ zur Abschussrate setzen
    if (currTime <= 10) {
        moveSpeed = ((1 - ((currTime-4) * 0.1)) + ((0.5 + (treffer / (schusse + missed))) * (currTime * 0.1)));
    } else {moveSpeed = 0.5 + treffer/(schusse + missed)}
}



// +++
// Ändern des Themes
// +++


var theme = "default";

 function ajaxPost() {
     var request = new XMLHttpRequest();
    request.open("GET", "myList.json", true);
    request.setRequestHeader("Content-Type", "application/json", true);
     request.onreadystatechange = function () {
        if (request.readyState == 4 && request.status == 200) {
            var data = JSON.parse(request.responseText);
            // Ändern der entsprechenden Elemente, wenn die json datie fertig geladen ist
            if (theme == "default") {
                document.getElementById("canvas").style.backgroundImage = "url("+ data.bit.styles.canvasbg + ")";
                document.getElementById("canvas").style.backgroundColor = "#0d0d0d";
                document.getElementById("spielDiv").style.borderColor = data.bit.styles.bordercolor;
                document.getElementById("scoreDiv").style.borderColor = data.bit.styles.bordercolor;
                document.getElementById("spielendeDiv").style.borderColor = data.bit.styles.bordercolor;
                document.getElementById("anleitungDiv").style.borderColor = data.bit.styles.bordercolor;
                document.getElementById("startbild").src = data.bit.styles.logo;
                document.getElementById("startbild").style.width = data.bit.styles.imgheight;
                document.getElementById("bodytag").style.background = "url("+ data.bit.styles.htmlbg + ") no-repeat center center fixed";
                document.getElementById("bodytag").style.backgroundColor = "#0d0d0d";

                //Ändern der bilddateien der aliens
                nachRechts = [data.bit.styles.spaceship1, data.bit.styles.spaceship2, data.bit.styles.spaceship3, data.bit.styles.spaceship4];
                nachLinks = [data.bit.styles.spaceship1, data.bit.styles.spaceship2, data.bit.styles.spaceship3, data.bit.styles.spaceship4];

                // Anwenden der änderungen
                for (i = 0; i < 4; i++) {
                    document.getElementById("alien" + i).src = nachRechts[i]
                }
                for (i = 0; i < 4; i++) {
                    document.getElementById("alien" + (i+4)).src = nachRechts[i]
                }
                theme = "bit";
            } else {

                document.getElementById("bodytag").style.background = "url("+ data.default.styles.htmlbg + ") no-repeat center center fixed";
                document.getElementById("bodytag").style.backgroundSize = "cover";
                document.getElementById("bodytag").style.backgroundColor = "#0d0d0d";
                document.getElementById("spielDiv").style.borderColor = data.default.styles.bordercolor;
                document.getElementById("scoreDiv").style.borderColor = data.default.styles.bordercolor;
                document.getElementById("spielendeDiv").style.borderColor = data.default.styles.bordercolor;
                document.getElementById("anleitungDiv").style.borderColor = data.default.styles.bordercolor;
                document.getElementById("startbild").src = data.default.styles.logo;
                document.getElementById("startbild").style.width = data.default.styles.imgheight;
                document.getElementById("canvas").style.background = "url("+ data.default.styles.canvasbg + ")";
                document.getElementById("canvas").style.backgroundColor = "#0d0d0d";

                nachRechts = [data.default.styles.spaceship1, data.default.styles.spaceship2, data.default.styles.spaceship3, data.default.styles.spaceship4];
                nachLinks = [data.default.styles.spaceship1l, data.default.styles.spaceship2l, data.default.styles.spaceship3l, data.default.styles.spaceship4l];


                for (i = 0; i < 4; i++) {
                    document.getElementById("alien" + i).src = nachRechts[i]
                }
                for (i = 0; i < 4; i++) {
                    document.getElementById("alien" + (i+4)).src = nachLinks[i]
                }
                

                theme = "default";
            }
        }
    }
    request.send(null);
}


// +++
// Funktionen für die Ranglistenanzeige
// +++

// Werte in Localstorage lagern
function setScore () {
    function getDate() {
        var datum = new Date();
        return(datum.getDate() + "." + (datum.getMonth()+1) + "." + datum.getFullYear());
    }
    nameArray.push(document.getElementById("nameInput").value);
    dateArray.push(getDate());
    scoreArray.push((Math.round((treffer / (schusse + missed)) * 100) / 100));
    localStorage.setItem("userName", JSON.stringify(nameArray));
    localStorage.setItem("userDate", JSON.stringify(dateArray));
    localStorage.setItem("userScore", JSON.stringify(scoreArray));
}


// Sortieren der Rangliste nach Abschussrate
function rankTable() {
    nameArray = JSON.parse(localStorage.getItem("userName"));
    dateArray = JSON.parse(localStorage.getItem("userDate"));
    scoreArray = JSON.parse(localStorage.getItem("userScore"));
    for(i=0; i<(scoreArray.length-1); i++) {
        if ((scoreArray[(scoreArray.length - 1) - i])>scoreArray[(scoreArray.length - 2) - i]) {
            var localSave = scoreArray[(scoreArray.length - 1) - i];
            scoreArray[(scoreArray.length - 1) - i] = scoreArray[(scoreArray.length - 2) - i];
            scoreArray[(scoreArray.length - 2) - i] = localSave;
            localSave = dateArray[(dateArray.length - 1) - i];
            dateArray[(dateArray.length - 1) - i] = dateArray[(dateArray.length - 2) - i];
            dateArray[(dateArray.length - 2) - i] = localSave;
            localSave = nameArray[(nameArray.length - 1) - i];
            nameArray[(nameArray.length - 1) - i] = nameArray[(nameArray.length - 2) - i];
            nameArray[(nameArray.length - 2) - i] = localSave;
        }
    }
    for (i=0; (i<(scoreArray.length)) && (i < 5); i++) {
        document.getElementById("td" + ( i + 1 ) + "1").innerHTML = nameArray[i];
        document.getElementById("td" + ( i + 1 ) + "2").innerHTML = dateArray[i];
        document.getElementById("td" + ( i + 1 ) + "3").innerHTML = scoreArray[i];
    }
}

function statsReset() { // Resetbutton: Löschen der Rangliste
    nameArray = [];
    dateArray = [];
    scoreArray = [];

    localStorage.setItem("userName", JSON.stringify(nameArray));
    localStorage.setItem("userDate", JSON.stringify(dateArray));
    localStorage.setItem("userScore", JSON.stringify(scoreArray));

    for (i=0; i<5; i++) {
            document.getElementById("td" + ( i + 1 ) + "1").innerHTML = "";
            document.getElementById("td" + ( i + 1 ) + "2").innerHTML = "";
            document.getElementById("td" + ( i + 1 ) + "3").innerHTML = "";
    }
}




// +++
// Funktionen für die Anleitung Gallery
// +++

var currImg = 0; // Derzeitiges Anzeigebild in Anleitung


// Array mit Textanleitungen
const beschreibung = [
    "Starten Sie das Spiel mithilfe des Start-Buttons.",
    "Laden Sie Munition durch Abschüsse oder Nachladen auf.",
    "Die Abschussrate bestimmt die Geschwindigkeit der Aliens.",
    "Schiessen Sie auf die Raumschiffe, bevor diese die andere Seite erreicht haben.",
    "Der Zeitbalken gibt Auskunft über den Verlauf der Trefferquote.",
]


function nextImg() { //Funktion für den Button nächstes bild
    currImg = currImg + 1;
    if (currImg > 4) {
        currImg = 0;
    }
    for (i=0; i<=4; i++){
        document.getElementById("nav"+i).disabled = false;
    }
    document.getElementById("nav"+currImg).disabled = true;
  document.getElementById("sliderBeschreibung").innerHTML = beschreibung[currImg];
    document.getElementById("imageSlider").src = anleitungArr[currImg];
}


function prevImg() { // Funktion für den button vorheriges bild
    currImg = currImg - 1;
    if (currImg < 0) {
        currImg = 4;
    }
    for (i=0; i<=4; i++){
        document.getElementById("nav"+i).disabled = false;
    }
    document.getElementById("nav"+currImg).disabled = true;
    document.getElementById("sliderBeschreibung").innerHTML = beschreibung[currImg];
    document.getElementById("imageSlider").src = anleitungArr[currImg];

}

function goToImg (imgNr) { // Funktion für die kleinen Navigationsbuttons
    for (i=0; i<=4; i++){
        document.getElementById("nav"+i).disabled = false;
    }
    document.getElementById("nav"+imgNr).disabled = true;
    currImg = imgNr;
    document.getElementById("imageSlider").src = anleitungArr[currImg];
    document.getElementById("sliderBeschreibung").innerHTML = beschreibung[currImg];

}



//  +++
//  Events, die vor der Interaktion getriggert werden
//  +++

//  Funktionen, die nach dem Laden des Rests ausgeführt werden
window.onload=function() {









    //erstellen der munitionsanzeige
    for (i=0; i<8; i++){
        var newSlot = document.createElement("img");
        newSlot.src = "bulletLoaded.gif";
        newSlot.id = "bulSlot" + i;
        document.getElementById("bulletsDiv").appendChild(newSlot);

    }

    munAkt();

//  Alien DOM Objects erstellen (4 mal) nach rechts
    for (i = 0; i <= 3; i++) {
        var newAlien = document.createElement("img");
        newAlien.src = nachRechts[i];
        newAlien.id = "alien" + i;
        newAlien.class = "alienClass";
        newAlien.hidden = "hidden";
        document.getElementById("mitteDiv").appendChild(newAlien);
        alienX[i] = -50;
        alienY[i] = zahlZw(20, 550);
        active[i] = 0;
    }

//  Alien DOM Objects erstellen (4 mal) nach links
    for (i = 0; i <= 3; i++) {
        var newAlien = document.createElement("img");
        newAlien.src = nachLinks[i];
        newAlien.id = "alien" + (i + 4);
        newAlien.class = "alienClass";
        newAlien.hidden = "hidden";
        document.getElementById("mitteDiv").appendChild(newAlien);
        alienX[i+4] = 700;
        alienY[i+4] = zahlZw(20, 550);
        active[i+4] = 0;
    }



    canvas.addEventListener("click", shot)

}
