const historyBtn = document.querySelector(".history-js"),
    historyList = document.querySelector(".history__list");

function paintHistory() {
    console.log("hi");
    confirmedList.forEach(one => {
        const tr = document.createElement("tr");
        tr.classList.add(one.id);
        const td1 = document.createElement("td");
        const td2 = document.createElement("td");
        td1.innerText = one.category;
        td2.innerText = one.text;
        tr.appendChild(td1);
        tr.appendChild(td2);
        historyList.appendChild(tr);
    })
}

function loadState() {
    confirmedList = JSON.parse(localStorage.getItem(CONFIRMED_LS)) || [];
    if (confirmedList) {
        paintHistory();
    }
}

function init() {
    historyBtn.addEventListener("click", loadState);
}
init();