const today = document.querySelector(".today-js"),
    todayOfTheWeek = document.querySelector(".todayDayOfTheWeek-js");

function getToday() {
    const currentTime = new Date();
    const currentMonth = currentTime.getMonth();
    const currentDay = currentTime.getDate();
    const currentDayOfTheWeek = currentTime.toDateString();

    today.innerText = `${currentMonth}.${currentDay}`;
    todayOfTheWeek.innerText = `(${currentDayOfTheWeek.slice(0, 3)})`;
}

function init() {
    getToday();
}
init();