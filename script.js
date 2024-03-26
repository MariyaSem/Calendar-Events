var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
var weekdays=['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

var currentEvents;
var key;

var currentDate = new Date();
var currentDay = currentDate.getDate();
var currentMonthNumber = currentDate.getMonth();
var currentYear = currentDate.getFullYear();

var thisMonth=currentDate.getMonth();
var thisYear=currentDate.getFullYear();

var dates = document.getElementById('dates');
var month = document.getElementById('month');
var year = document.getElementById('year');

var prevMonth = document.getElementById('prev-month');
var nextMonth = document.getElementById('next-month');

var isDaySelected=false;
var selectedDate=document.getElementsByClassName("today");

var selectedDay=document.getElementById("selected-day");
selectedDay.innerHTML=currentDay;

var selectedWeekDay=document.getElementById("day-of-week");
selectedWeekDay.innerHTML=getDayOfWeek(currentDay);
month.textContent = monthNames[currentMonthNumber];
year.textContent = currentYear.toString();


nextMonth.addEventListener('click', forthcomingMonth);
prevMonth.addEventListener('click', lastMonth);


var listOfNotes=document.getElementById('eventsList');

writeMonth(currentMonthNumber);


var addNote=document.getElementById('add-note-but');
var noteText=document.getElementsByClassName("add-event-day-field");
addNote.addEventListener('click', addNewNote);

var currentElement=document.getElementsByClassName("today")[0];


function writeMonth(month) {
    for(var i= startDay(); i>0; i--){
        dates.innerHTML+= ` <div class="calendar-date last-days">${getTotalDays(currentMonthNumber-1)-(i-1)}</div> `;
    }
    
    for(var i=1; i<=getTotalDays(month); i++){
           dates.innerHTML+= ` <div class="calendar-date" id="day${i}" onmouseover="highlightDay(this)" onmouseout="unhighlightDay(this)"
onclick=" writeSelectedDay(this), showSelectedElem(this) ">${i}</div> `;
    }
    
    setToday();
    setNoEvent();
    markEventedDays();
}


function getTotalDays(month){
    if(month ===-1) month=11;
    
    if(month == 0 || month == 2 || month == 4 || month == 6 || month == 7 || month == 9 || month == 11){
        return 31;
    }
    else if(month == 3 || month == 5 || month == 8 || month == 10){
        return 30;
    }
    else{
        return isLeap() ? 29:28; 
    }
}

function isLeap(){
    return ((currentYear % 100 !== 0) && (currentYear % 4 === 0) ||
        ( currentYear % 400 === 0));
}

function startDay(){
    var start =new Date(currentYear, currentMonthNumber, 1);
    return ((start.getDay()-1) === -1)? 6 : start.getDay()-1;
}

function getDayOfWeek(currentDay){
    var day=new Date(currentYear, currentMonthNumber, currentDay);
       var dayNumber= ((day.getDay()-1) === -1)? 6 : day.getDay()-1;
return weekdays[dayNumber];
}

function lastMonth(){
    if(currentMonthNumber !==0 ){
        currentMonthNumber--;
    }
    else{
        currentMonthNumber=11;
        currentYear--;
    }
        setNewDate();
}

function forthcomingMonth(){
    if(currentMonthNumber !==11){
        currentMonthNumber++;
    }
    else{
        currentMonthNumber=0;
        currentYear++;
    }
    setNewDate();
}


function setToday(){
    if(thisMonth===currentMonthNumber && thisYear===currentYear){
        var today=document.getElementById("day"+currentDay);
        today.classList.add("today");
    }
}

function setNewDate(){
    
    month.textContent=monthNames[currentMonthNumber];
    year.textContent=currentYear.toString();
    dates.textContent="";
    
    writeMonth(currentMonthNumber);
}

function highlightDay(selectedElement){
    selectedElement.classList.add("hovered-day");
}
function unhighlightDay(selectedElement){
    selectedElement.classList.remove("hovered-day");
}

function showSelectedElem(selectedElement){
    
   selectedElement.classList.add("highlighted-day"); 
    selectedWeekDay.innerHTML=getDayOfWeek(selectedElement.innerHTML);
    selectedDate=selectedElement;
}

function writeSelectedDay(selectedElement){
selectedDay.innerHTML = selectedElement.innerHTML;
    key=selectedDay.innerHTML+currentMonthNumber+currentYear;
    
    if(isDaySelected === true){
        selectedDate.classList.remove("highlighted-day");
    }
    else{
        isDaySelected=true;
       selectedElement.classList.add("highlighted-day");
    }
    currentElement=selectedElement;
    currentEvents=new Array();
    var eventsFromLocalStorage=getFromLocalStorage(key);
    if(eventsFromLocalStorage){
        currentEvents=eventsFromLocalStorage;
        writeOlderEvents(eventsFromLocalStorage);
    }
    else{
       setNoEvent();
    }
       }

function writeOlderEvents(eventsFromLocalStorage){
    if(eventsFromLocalStorage.length){
        removeAnotherEvents();
    for(var i=0; i<eventsFromLocalStorage.length; i++){
          listOfNotes.innerHTML+= ` <li class="addedEvent">${eventsFromLocalStorage[i]}</li> `;
    }
    }
    else{
        setNoEvent();
    }
}

function addNewNote(){
    
    var text=document.getElementsByClassName("add-event-day-field")[0].value;
    if(text !== "" && text !== " "){
    var elem = document.getElementById("noEvents");
    if(elem){
      elem.remove();
    }
    
    listOfNotes.innerHTML+= ` <li class="addedEvent">${text}</li> `;
    
        writeEventToLocalStorage(text);

   document.getElementById("customText").value = " ";
   }
}


function writeEventToLocalStorage(event){

    currentEvents[currentEvents.length]=event;
    
    setToLocalStorage(currentEvents);
    markDay();

}


function setNoEvent(){
   removeAnotherEvents();
    var elem0 = document.getElementById("noEvents");
   
    if(!elem0){
          listOfNotes.innerHTML+= ` <li id="noEvents">${"There is not any events."}</li> `;

    }
}

function removeAnotherEvents(){
     var elem = document.getElementsByClassName("addedEvent");
        var elem0 = document.getElementById("noEvents");
    if(elem.length){
    for(var i=elem.length-1; i>=0; i--){
      elem[i].remove();
    }
    }
    if(elem0){
        elem0.remove();
    }
    
}

function setToLocalStorage(eventsArray){
    var key=selectedDay.innerHTML+currentMonthNumber+currentYear;

    var serializedDateObj=JSON.stringify(eventsArray);
    localStorage.setItem(key, serializedDateObj);
    getFromLocalStorage(key);
    
}

function getFromLocalStorage(key){
    var deserializedDateObj=JSON.parse(localStorage.getItem(key));
    
    if (!deserializedDateObj) return null;
    
    else
    return deserializedDateObj;
}


function markDay(){
    currentElement.classList.add("marked");
}

function markEventedDays(){
    var totalDays=getTotalDays(currentMonthNumber);
    var dayId;
    var eventedDayId;
    for(var i=1; i<=totalDays; i++){
        dayId=i.toString()+currentMonthNumber+currentYear;
if(getFromLocalStorage(dayId)){
    eventedDayId=document.getElementById("day"+i);
        eventedDayId.classList.add("marked");
}
        
    }
}