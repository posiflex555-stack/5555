const STORAGE_KEY = "drivers_app_v1";

let drivers = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

const driversList = document.getElementById("driversList");
const modal = document.getElementById("driverModal");

const addDriverBtn = document.getElementById("addDriverBtn");
const cancelDriver = document.getElementById("cancelDriver");
const saveDriver = document.getElementById("saveDriver");

const driverName = document.getElementById("driverName");
const driverPhone = document.getElementById("driverPhone");

let editIndex = -1;

function saveData(){
    localStorage.setItem(STORAGE_KEY, JSON.stringify(drivers));
}

function renderDrivers(){

    driversList.innerHTML = "";

    drivers.forEach((driver,index)=>{

        const card = document.createElement("div");
        card.className="driverCard";

        card.innerHTML=`

        <div class="driverHeader">

            <div>

                <div class="driverName">${driver.name}</div>

                <div class="driverPhone">${driver.phone}</div>

            </div>

        </div>

        <div class="driverButtons">

            <button class="openBtn" onclick="openDriver(${index})">
            فتح
            </button>

            <button class="editBtn" onclick="editDriver(${index})">
            تعديل
            </button>

            <button class="deleteBtn" onclick="deleteDriver(${index})">
            حذف
            </button>

        </div>

        `;

        driversList.appendChild(card);

    });

}

addDriverBtn.onclick=()=>{

    editIndex=-1;

    driverName.value="";
    driverPhone.value="";

    modal.style.display="flex";

}

cancelDriver.onclick=()=>{

    modal.style.display="none";

}

saveDriver.onclick=()=>{

    if(driverName.value.trim()==""){

        alert("اكتب اسم السائق");

        return;

    }

    const obj={

        name:driverName.value,

        phone:driverPhone.value,

        orders:{},

        total:0

    };

    if(editIndex==-1){

        drivers.push(obj);

    }else{

        drivers[editIndex]=obj;

    }

    saveData();

    renderDrivers();

    modal.style.display="none";

}

function deleteDriver(index){

    if(confirm("حذف السائق؟")){

        drivers.splice(index,1);

        saveData();

        renderDrivers();

    }

}

function editDriver(index){

    editIndex=index;

    driverName.value=drivers[index].name;

    driverPhone.value=drivers[index].phone;

    modal.style.display="flex";

}

function openDriver(index){

    localStorage.setItem("currentDriver",index);

    location.href="driver.html";

}

renderDrivers();
