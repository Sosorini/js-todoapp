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
    CAN_LS = "CAN",
    CONFIRMED_LS = "CONFIRMED";
let mustList,
    canList,
    confirmedList = [],
    category = "MUST",
    id = 0;

function saveToDos(targetCategory) {
    if (targetCategory === MUST_LS) {
        localStorage.setItem(MUST_LS, JSON.stringify(mustList));
    } else {
        localStorage.setItem(CAN_LS, JSON.stringify(canList));
    }
}

function saveConfirm() {
    localStorage.setItem(CONFIRMED_LS, JSON.stringify(confirmedList));
}

function findMatch(targetCategory, targetId) {
    if (targetCategory === MUST_LS) {
        return mustList.find(must => must.id === targetId);
    } else {
        return canList.find(can => can.id === targetId);
    }
}

function findNotMatch(targetCategory, targetId) {
    if (targetCategory === MUST_LS) {
        mustList = mustList.filter(function (must) {
            return must.id !== targetId;
        });
    } else {
        canList = canList.filter(function (can) {
            return can.id !== targetId
        });
    }
    saveToDos(targetCategory);
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
    id = "";
    for (let i = 0; i < 6; i++) {
        const number = Math.floor(Math.random() * 15 + 1); // 1~ 15
        id += number.toString(16);
    }
}

function updateText(e) {
    const span = e.target.parentNode.parentElement;
    const targetCategory = e.target.attributes[2].nodeValue;
    const targetId = e.target.id;
    const obj = findMatch(targetCategory, targetId);
    const toDoInput = document.querySelector(".toDoList input");
    obj.text = toDoInput.value;
    toDoInput.readOnly = true;
    const spanBtn = paintBtn(obj);
    span.parentNode.appendChild(spanBtn);
    span.parentNode.removeChild(span);
    saveToDos(targetCategory);
}

function updateToDo(e) {
    e.target.readOnly = false;
    const obj = e.target.nextElementSibling.childNodes[0].childNodes[0];
    const objId = obj.attributes[1].nodeValue;
    const objCategory = obj.attributes[2].nodeValue;
    const parentDiv = e.target.parentNode;
    const span = document.createElement("span");
    span.innerHTML = `<i class="fas fa-check-circle" id="${objId}" category="${objCategory}"></i>`;
    parentDiv.childNodes[1].innerHTML = "";
    parentDiv.childNodes[1].appendChild(span);
    span.addEventListener("click", updateText);

}

function deleteToDo(e) {
    const span = e.target.parentNode.parentElement.parentElement;
    span.parentNode.removeChild(span); // html delete
    const targetCategory = e.target.attributes[2].value;
    const targetId = e.target.attributes[1].value;
    findNotMatch(targetCategory, targetId);
}

function confirmedToDo(e) {
    const span = e.target.parentNode.parentElement.parentElement;
    span.parentNode.removeChild(span); // html delete
    const targetCategory = e.target.attributes[2].value;
    const targetId = e.target.attributes[1].value;
    findNotMatch(targetCategory, targetId);
    if (targetCategory === MUST_LS) {
        const targetObject = mustList.find(must => must.id === targetId);
        confirmedList.push(targetObject);
    } else {
        const targetObject = canList.find(can => can.id === targetId);
        confirmedList.push(targetObject);
    }
    saveConfirm();
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
        saveMust();
    } else {
        canList.push(obj);
        saveCan();
    }
    paintDiv(obj);
    showInput();
    inputText.value = "";
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

function paintBtn(obj) {
    const span = document.createElement("span");
    const del = document.createElement("span");
    const confirm = document.createElement("span");
    del.innerHTML = `<i class="far fa-trash-alt" id="${obj.id}" category="${obj.category}"></input>`;
    confirm.innerHTML = `<i class="far fa-check-circle" id="${obj.id}" category="${obj.category}"></i>`;
    del.addEventListener("click", deleteToDo);
    confirm.addEventListener("click", confirmedToDo);
    span.classList.add("nonclick");
    span.appendChild(del);
    span.appendChild(confirm);
    return span;
}

function paintDiv(obj) {
    const div = document.createElement("div");
    const input = document.createElement("input");
    input.classList.add = "toDoList__text";
    input.type = "text";
    input.value = obj.text;
    input.readOnly = true;
    div.appendChild(input);
    input.addEventListener("click", updateToDo);
    const span = paintBtn(obj);
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