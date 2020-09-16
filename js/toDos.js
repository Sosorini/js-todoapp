const must = document.querySelector(".mustToDo"),
    mustToDoList = must.querySelector(".mustToDoList"),
    can = document.querySelector(".canToDo"),
    canToDoList = can.querySelector(".canToDoList"),
    btnDiv = document.querySelector(".buttons"),
    addBtn = document.querySelector(".add"),
    delBtn = document.querySelector(".delete"),
    form = document.querySelector(".inputToDo"),
    inputText = form.querySelector(".input-js-text"),
    submit = form.querySelector(".input-js-submit"),
    categoryBtn = form.querySelectorAll(".categoryBtn");

const MUST_LS = "MUST",
    CAN_LS = "CAN";
let mustList,
    canList,
    category = "MUST",
    id = 0;

function saveToDos() {
    localStorage.setItem(MUST_LS, JSON.stringify(mustList));
    localStorage.setItem(CAN_LS, JSON.stringify(canList));
}

function showInput() {
    const result = form.classList.contains("invisible");
    if (result) { // toggle이 두개이상의 항목에서는 잘 안먹는다
        form.classList.add("showing");
        btnDiv.classList.remove("showing");
        btnDiv.classList.add("invisible");
    } else {
        form.classList.remove("showing");
        form.classList.add("invisible");
        btnDiv.classList.add("showing");
    }
    categoryBtn.forEach(function (btn) {
        btn.addEventListener("click", categorySwitch);
    });
}

function categorySwitch(e) {
    e.preventDefault();
    if (e.target.value === MUST_LS) {
        categoryBtn[0].classList.add("deep");
        categoryBtn[1].classList.remove("deep");
    }
    if (e.target.value === CAN_LS) {
        categoryBtn[0].classList.remove("deep");
        categoryBtn[1].classList.add("deep");
    }
    category = e.target.value;
}

// random()
function getId() {
    for (let i = 0; i < 6; i++) {
        const number = Math.floor(Math.random() * 15 + 1); // 1~ 15
        id += number.toString(16);
    }
}

function createToDo(e) {
    e.preventDefault();
    const currentValue = inputText.value;
    getId();
    const obj = {
        id,
        text: currentValue,
        category
    }
    if (category === MUST_LS) {
        mustList.push(obj);
    } else {
        canList.push(obj);
    }
    saveToDos();
    paintDiv(obj);
    showInput();
    inputText.value = "";
}

function deleteToDo(e) {
    e.preventDefault();
    console.dir(e.target.parentNode.className);
}

function loadState() {
    // 이렇게 초기값[]을 넣어주면 없어서 forEach못돌린다는 에러가 안뜬다
    mustList = JSON.parse(localStorage.getItem(MUST_LS)) || [];
    canList = JSON.parse(localStorage.getItem(CAN_LS)) || [];
}

function paintList() {
    mustList.forEach(function (must) {
        paintDiv(must);
    });
    canList.forEach(function (can) {
        paintDiv(can);
    });
}

function paintDiv(obj) {
    const div = document.createElement("div");
    const span = document.createElement("span");
    const del = document.createElement("span");
    const confirm = document.createElement("span");
    div.innerText += obj.text;
    del.innerHTML = `<i class="far fa-trash-alt"></i>`;
    confirm.innerHTML = `<i class="far fa-check-circle"></i>`;
    // 해당 element ID저장
    const objId = obj.id;
    del.classList.add(objId);
    confirm.classList.add(objId);
    del.addEventListener("click", deleteToDo);
    span.classList.add("nonclick");
    span.appendChild(del);
    span.appendChild(confirm);
    div.appendChild(span);
    div.classList.add("toDoList");
    if (obj.category === MUST_LS) {
        mustToDoList.appendChild(div);
    } else {
        canToDoList.appendChild(div);
    }


}

function init() {
    addBtn.addEventListener("click", showInput);
    form.addEventListener("submit", createToDo);
    submit.addEventListener("click", createToDo);
    loadState();
    paintList();
    category = "MUST"; // 초기화
}
init();