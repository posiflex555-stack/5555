/*==================================================
        DRIVER PRO V2
        مطاعم ومطابخ سحايب ديرتي
==================================================*/

//==============================
// عناصر الصفحة
//==============================

const driversBody = document.getElementById("driversBody");
const yearSelect = document.getElementById("year");
const addDriverBtn = document.getElementById("addDriverBtn");

const dayModal = document.getElementById("dayModal");
const modalTitle = document.getElementById("modalTitle");

const meatValue = document.getElementById("meatValue");
const orderValue = document.getElementById("orderValue");
const notes = document.getElementById("notes");

const saveDay = document.getElementById("saveDay");
const closeModal = document.getElementById("closeModal");

//==============================
// التخزين
//==============================

const STORAGE_KEY = "deerty_driver_monthly_v2";

let drivers = [];

let currentDriver = -1;
let currentDay = -1;

//==============================
// حفظ البيانات
//==============================

function saveData(){

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(drivers)
    );

}

//==============================
// تحميل البيانات
//==============================

function loadData(){

    const data = localStorage.getItem(STORAGE_KEY);

    if(data){

        drivers = JSON.parse(data);

    }else{

        drivers = [];

    }

}
//==============================
// إنشاء السنوات
//==============================

const currentYear = new Date().getFullYear();

for(let y = currentYear - 5; y <= currentYear + 5; y++){

    const option = document.createElement("option");

    option.value = y;
    option.textContent = y;

    if(y === currentYear){

        option.selected = true;

    }

    yearSelect.appendChild(option);

}

//==============================
// إنشاء سائق جديد
//==============================

function createDriver(name){

    return{

        name:name,

        days:Array.from({length:31},()=>({

            meat:0,

            orders:0,

            notes:""

        }))

    };

}
//==============================
// رسم الجدول
//==============================

function renderTable(){

    driversBody.innerHTML = "";

    drivers.forEach((driver, driverIndex)=>{

        const tr = document.createElement("tr");

        // اسم السائق
        const tdName = document.createElement("td");
        tdName.textContent = driver.name;
        tr.appendChild(tdName);

        let meatTotal = 0;
        let ordersTotal = 0;

        // أيام الشهر
        driver.days.forEach((day, dayIndex)=>{

            meatTotal += Number(day.meat);
            ordersTotal += Number(day.orders);

            const td = document.createElement("td");

            td.className = "day";

            td.dataset.driver = driverIndex;
            td.dataset.day = dayIndex;

            td.innerHTML = `
                <div>${day.meat == 0 ? "" : day.meat}</div>
                <div>${day.orders == 0 ? "" : day.orders}</div>
            `;

            tr.appendChild(td);

        });

        // مجموع الذبائح
        const tdMeat = document.createElement("td");
        tdMeat.className = "total";
        tdMeat.textContent = meatTotal.toFixed(2);
        tr.appendChild(tdMeat);

        // مجموع الطلبات
        const tdOrders = document.createElement("td");
        tdOrders.className = "total";
        tdOrders.textContent = ordersTotal.toFixed(2);
        tr.appendChild(tdOrders);

        // الإجمالي
        const tdGrand = document.createElement("td");
        tdGrand.className = "total";
        tdGrand.textContent = (meatTotal + ordersTotal).toFixed(2);
        tr.appendChild(tdGrand);

        // زر الحذف
        const tdDelete = document.createElement("td");

        const btn = document.createElement("button");
        btn.textContent = "🗑️";

        btn.onclick = function(){

            if(confirm("هل تريد حذف السائق؟")){

                drivers.splice(driverIndex,1);

                saveData();

                renderTable();

            }

        };

        tdDelete.appendChild(btn);

        tr.appendChild(tdDelete);

        driversBody.appendChild(tr);

    });

}
//==============================
// إضافة سائق
//==============================

addDriverBtn.onclick = function(){

    const name = prompt("أدخل اسم السائق");

    if(!name || name.trim() === "") return;

    drivers.push(createDriver(name.trim()));

    saveData();

    renderTable();

};

//==============================
// تشغيل البرنامج
//==============================

loadData();

if(drivers.length === 0){

    drivers.push(createDriver("فؤاد"));

    saveData();

}

renderTable();

//==============================
// فتح نافذة إدخال اليوم
//==============================

document.addEventListener("click",function(e){

    const cell = e.target.closest(".day");

    if(!cell) return;

    currentDriver = Number(cell.dataset.driver);
    currentDay = Number(cell.dataset.day);

    const data = drivers[currentDriver].days[currentDay];

    modalTitle.textContent = "اليوم " + (currentDay + 1);

    meatValue.value = data.meat || "";
    orderValue.value = data.orders || "";
    notes.value = data.notes || "";

    dayModal.style.display = "flex";

});

//==============================
// حفظ بيانات اليوم
//==============================

saveDay.onclick = function(){

    drivers[currentDriver].days[currentDay].meat =
        parseFloat(meatValue.value) || 0;

    drivers[currentDriver].days[currentDay].orders =
        parseFloat(orderValue.value) || 0;

    drivers[currentDriver].days[currentDay].notes =
        notes.value;

    saveData();

    dayModal.style.display = "none";

    renderTable();

};

//==============================
// إغلاق النافذة
//==============================

closeModal.onclick = function(){

    dayModal.style.display = "none";

};
