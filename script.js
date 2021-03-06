// Declaring variables
//calender
var body = document.getElementsByTagName('body')
const monthList = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
// const monthList = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const dayList = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

var firstDay;
var daysInMonth;

var today = new Date();
var currentDate = today.getDate();
var currentMonth = today.getMonth()
var currentYear = today.getFullYear();
var currentDay = today.getDay();
var tbl = document.getElementById('tbl')

var prevYear = document.getElementById("prevYearBtn");
var yearDisplay = document.getElementById("yearDisplay");
var nextYear = document.getElementById("nextYearBtn");
var prevMonth = document.getElementById("prevMonthBtn");
var monthDisplay = document.getElementById("monthDisplay");
var nextMonth = document.getElementById("nextMonthBtn");

var todayBtn = document.getElementById("todayBtn")

var cellArray;
var dayTodo = document.getElementById("dayClicked");

//todo
var taskInput = document.getElementById("taskInput")
var addBtn = document.getElementById("addBtn")
var taskList = document.getElementById("taskList")

//local Storage
var listLocal;
if (localStorage.getItem("todoLocal") == null) {
    var listLocal = []
} else {
    listLocal = JSON.parse(localStorage.getItem("todoLocal"));
}

//clock
function currentTime() {
    today = new Date();
    var day = today.getDate();
    var month = today.getMonth();
    var year = today.getFullYear();

    var hour = today.getHours();
    var min = today.getMinutes();
    var sec = today.getSeconds();
    var midday;
    //Assigning AM/PM
    if (hour > 11) {
        midday = "PM"
    } else {
        midday = "AM"
    }

    //Making a 12 hour format clock
    if (hour == 0) {
        hour = 12;
    } else if (hour > 12) {
        hour = hour - 12
    } else {
        hour = hour;
    }

    hour = updateTime(hour);
    min = updateTime(min);
    sec = updateTime(sec);
    document.getElementById("clock-day").innerHTML = "Today - " + day + " " + monthList[month] + " " + year;
    document.getElementById("clock-time").innerHTML = "Time - " + hour + ":" + min + ":" + sec + " " + midday;
    setTimeout(currentTime, 1000); /* setting timer */
}
function updateTime(k) {
    if (k < 10) {
        return "0" + k;
    }
    else {
        return k;
    }
}
currentTime();

//calender
function renderDate() {
    if (currentMonth === 12) {
        currentYear = currentYear + 1;
        currentMonth = 0
    }
    if (currentMonth === -1) {
        currentYear = currentYear - 1;
        currentMonth = 11
    }

    firstDay = (new Date(currentYear, currentMonth, 1)).getDay();
    if (firstDay === 0) {
        firstDay = 6
    } else {
        firstDay = firstDay - 1
    }

    daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    monthDisplay.innerHTML = monthList[currentMonth];
    yearDisplay.innerHTML = currentYear;

    cellFill();
}
renderDate();
dayTodo.innerHTML = today.getDate() + " " + monthList[currentMonth] + " " + currentYear;

//Event Listeners
nextMonth.addEventListener('click', () => {
    document.getElementById("tbl").remove();
    currentMonth = currentMonth + 1;
    renderDate();
})
prevMonth.addEventListener('click', () => {
    document.getElementById("tbl").remove();
    currentMonth = currentMonth - 1;
    renderDate();
})
nextYear.addEventListener('click', () => {
    document.getElementById("tbl").remove();
    currentYear = currentYear + 1
    renderDate();
})
prevYear.addEventListener('click', () => {
    document.getElementById("tbl").remove();
    currentYear = currentYear - 1
    renderDate();
})
todayBtn.addEventListener('click', () => {
    document.getElementById("tbl").remove();
    currentMonth = today.getMonth()
    currentYear = today.getFullYear();
    renderDate();
    dayTodo.innerHTML = today.getDate() + " " + monthList[currentMonth] + " " + currentYear;
    loadList();
})

function cellFill() {
    let date = 1;
    var calenderDiv = document.getElementById("calender-container")
    var table = document.createElement("table");
    table.id = "tbl";
    calenderDiv.appendChild(table);
    for (let i = 0; i < 7; i++) {
        // creates a table row
        let row = document.createElement("tr");
        table.appendChild(row);
        //creating individual cells, filing them up with data.
        for (let j = 0; j < 7; j++) {
            if (i === 0) {
                cell = document.createElement("td");
                cellText = document.createTextNode(dayList[j]);
                cell.classList.add("days")
                cell.appendChild(cellText);
                row.appendChild(cell);
            } else if (i === 1 && j < firstDay) {
                cell = document.createElement("td");
                cellText = document.createTextNode("");
                cell.appendChild(cellText);
                row.appendChild(cell);
            } else if (date > daysInMonth) {
                cell = document.createElement("td");
                cellText = document.createTextNode("");
                cell.classList.add("cell")
                cell.appendChild(cellText);
            } else {
                cell = document.createElement("td");
                cellText = document.createTextNode(date);
                cell.id = date;
                cell.classList.add("cell")
                span = document.createElement("span");
                span.id = "indicator" + date

                // highlight today's date
                if (date === today.getDate() && currentYear === today.getFullYear() && currentMonth === today.getMonth()) {
                    cell.classList.add("today-bg");
                    cell.classList.add("dayClicked");
                }

                cell.appendChild(cellText);
                cell.appendChild(span)
                row.appendChild(cell);
                date++;
            }
        }
    }
    indicatorFunc();
    clickCell();
}

function clickCell() {
    cellArray = document.querySelectorAll(".cell");
    cellArray = Array.from(cellArray)
    for (let i = 0; i < cellArray.length; i++) {
        cellArray[i].addEventListener('click', () => {
            if (document.getElementsByClassName('dayClicked').length == 0) {
            } else {
                document.getElementsByClassName('dayClicked')[0].classList.remove("dayClicked")
            }
            cellArray[i].classList.add("dayClicked")
            // console.log(cellArray[i].textContent);
            // console.log(`${cellArray[i].textContent}/${currentMonth + 1}/${currentYear}`)
            dayTodo.innerHTML = `${cellArray[i].textContent} ${monthList[currentMonth]} ${currentYear}`
            loadList();
        })
    }
}

//todo
function loadList() {
    while (taskList.firstChild) {
        taskList.removeChild(taskList.firstChild);
    }
    for (let i = 0; i < listLocal.length; i++) {
        if (listLocal[i].date == `${document.getElementsByClassName("dayClicked")[0].textContent}/${currentMonth + 1}/${currentYear}`) {
            var task = listLocal[i].text
            // console.log(task);
            if (listLocal[i].checked == true) {
                var checked = "checked"
                var completed = "completed"
            } else {
                checked = ""
                completed = ""
            }
            if (listLocal[i].trash == true) {
                var trash = "hide";
            } else {
                trash = ""
            }
            var item =
                `<div class="itemDiv"><li class="item ${trash}">
            <input type="checkbox" class="checkbox" ${checked}>
            <span class="text ${completed}">${task}</span>
            <img class="delete" src="delete.png">
            </li></div>`;

            taskList.insertAdjacentHTML('beforeend', item);
            taskInput.value = ""

        }
    }
    indicatorFunc();
    checkboxWorking();
    deleteWorking();
}
loadList();

function indicatorFunc() {
    for (let i = 0; i < listLocal.length; i++) {
        for (let j = 0; j < daysInMonth; j++) {
            if (listLocal[i].date == `${j + 1}/${currentMonth + 1}/${currentYear}`) {
                document.getElementById("indicator" + (j + 1)).classList.add("indicatorTrue")
            }
        }
    }
}
indicatorFunc();

addBtn.addEventListener('click', () => {
    if (taskInput.value == "") {
    } else {
        var task = taskInput.value
        // console.log(task);
        var item =
            `<div class="itemDiv"><li class="item">
            <input type="checkbox" class="checkbox">
            <span class="text">${task}</span>
            <img class="delete" src="delete.png">
            </li></div>`;

        taskList.insertAdjacentHTML('beforeend', item);
        taskInput.value = ""

        listLocal.push({
            id: `${document.getElementsByClassName("dayClicked")[0].textContent}${currentMonth + 1}${currentYear}${task}`,
            date: `${document.getElementsByClassName("dayClicked")[0].textContent}/${currentMonth + 1}/${currentYear}`,
            text: task,
            checked: false,
            trash: false
        });
        localStorage.setItem("todoLocal", JSON.stringify(listLocal))
        indicatorFunc();
        checkboxWorking();
        deleteWorking();
    }
})

document.addEventListener("keyup", function (event) {
    if (taskInput.value == "") {
    } else {
        if (event.keyCode == 13) {
            var task = taskInput.value
            // console.log(task);
            var item =
                `<div class="itemDiv"><li class="item">
            <input type="checkbox" class="checkbox">
            <span class="text">${task}</span>
            <img class="delete" src="delete.png">
            </li></div>`;

            taskList.insertAdjacentHTML('beforeend', item);
            taskInput.value = ""

            listLocal.push({
                id: `${document.getElementsByClassName("dayClicked")[0].textContent}${currentMonth + 1}${currentYear}${task}`,
                date: `${document.getElementsByClassName("dayClicked")[0].textContent}/${currentMonth + 1}/${currentYear}`,
                text: task,
                checked: false,
                trash: false
            });
            localStorage.setItem("todoLocal", JSON.stringify(listLocal))
            indicatorFunc();
            checkboxWorking();
            deleteWorking();
        }
    }
})

function checkboxWorking() {
    for (let i = 0; i < document.getElementsByClassName("checkbox").length; i++) {
        document.getElementsByClassName("checkbox")[i].addEventListener('click', () => {
            if (document.getElementsByClassName("checkbox")[i].checked) {
                // console.log("true")
                document.getElementsByClassName("text")[i].classList.add("completed")
                // console.log(document.getElementsByClassName("text")[i].textContent)
                listLocal.forEach((element, index) => {
                    // console.log(`${document.getElementsByClassName("dayClicked")[0].textContent}${currentMonth + 1}${currentYear}` + listLocal[i].text)
                    if (element.id === (`${document.getElementsByClassName("dayClicked")[0].textContent}${currentMonth + 1}${currentYear}` + document.getElementsByClassName("text")[i].textContent)) {
                        listLocal[index].checked = true
                        // console.log(listLocal[index])
                    }
                });
            } else {
                // console.log("false")
                listLocal.forEach((element, index) => {
                    if (element.id === (`${document.getElementsByClassName("dayClicked")[0].textContent}${currentMonth + 1}${currentYear}` + document.getElementsByClassName("text")[i].textContent)) {
                        listLocal[index].checked = false
                        // console.log(listLocal[index])
                    }
                });
                document.getElementsByClassName("text")[i].classList.remove("completed")
            }
            localStorage.setItem("todoLocal", JSON.stringify(listLocal))
        })
    }
}
checkboxWorking();

function deleteWorking() {
    for (let i = 0; i < document.getElementsByClassName("delete").length; i++) {
        document.getElementsByClassName("delete")[i].addEventListener('mouseover', () => {
            document.getElementsByClassName("delete")[i].setAttribute('src', 'delete-red.png')
            document.getElementsByClassName("delete")[i].style.width = '25px'
            document.getElementsByClassName("delete")[i].style.height = '25px'
        })
        document.getElementsByClassName("delete")[i].addEventListener('mouseout', () => {
            document.getElementsByClassName("delete")[i].setAttribute('src', 'delete.png')
            document.getElementsByClassName("delete")[i].style.width = '20px'
            document.getElementsByClassName("delete")[i].style.height = '20px'
        })

        document.getElementsByClassName("delete")[i].addEventListener('click', () => {
            document.getElementsByClassName("delete")[i].parentElement.classList.add("hide")
            listLocal.forEach((element, index) => {
                if (element.id === (`${document.getElementsByClassName("dayClicked")[0].textContent}${currentMonth + 1}${currentYear}` + document.getElementsByClassName("text")[i].textContent)) {
                    listLocal[index].trash = true;
                }
            });
            localStorage.setItem("todoLocal", JSON.stringify(listLocal))
        })
    }
}
deleteWorking();