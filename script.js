/*==================================================
    DRIVER PRO V1
==================================================*/

const driversBody = document.getElementById("driversBody");
const yearSelect = document.getElementById("year");
const addDriverBtn = document.getElementById("addDriverBtn");
const STORAGE_KEY = "deerty_driver_monthly_v1";
// إنشاء السنوات
const currentYear = new Date().getFullYear();

for(let y=currentYear-5; y<=currentYear+5; y++){

    const option=document.createElement("option");

    option.value=y;

    option.textContent=y;

    if(y===currentYear){
        option.selected=true;
    }

    yearSelect.appendChild(option);

}

let drivers=[];

// إنشاء سائق جديد
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

// رسم الجدول
function renderTable(){

    driversBody.innerHTML="";

    drivers.forEach((driver,index)=>{

        const tr=document.createElement("tr");

        // اسم السائق
        const tdName=document.createElement("td");

        tdName.textContent=driver.name;

        tr.appendChild(tdName);

        let meatTotal=0;

        let ordersTotal=0;

        // الأيام
        driver.days.forEach((day,dayIndex)=>{

            meatTotal+=Number(day.meat);

            ordersTotal+=Number(day.orders);

            const td=document.createElement("td");

            td.className="day";

            td.dataset.driver=index;

            td.dataset.day=dayIndex;

            td.innerHTML=`
                <div>${day.meat || ""}</div>
                <div>${day.orders || ""}</div>
            `;

            tr.appendChild(td);

        });

        // مجموع الذبائح
        const tdMeat=document.createElement("td");
        tdMeat.className="total";
        tdMeat.textContent=meatTotal.toFixed(2);
        tr.appendChild(tdMeat);

        // مجموع الطلبات
        const tdOrders=document.createElement("td");
        tdOrders.className="total";
        tdOrders.textContent=ordersTotal.toFixed(2);
        tr.appendChild(tdOrders);

        // الإجمالي
        const tdGrand=document.createElement("td");
        tdGrand.className="total";
        tdGrand.textContent=(meatTotal+ordersTotal).toFixed(2);
        tr.appendChild(tdGrand);

        // زر حذف
        const tdDelete=document.createElement("td");

        const btn=document.createElement("button");

        btn.textContent="🗑️";

        btn.onclick=()=>{

            if(confirm("حذف السائق؟")){

                drivers.splice(index,1);

saveData();

renderTable();
            }

        };

        tdDelete.appendChild(btn);

        tr.appendChild(tdDelete);

        driversBody.appendChild(tr);

    });

}

// إضافة سائق
addDriverBtn.onclick=function(){

    const name=prompt("اسم السائق");

    if(!name) return;

    drivers.push(createDriver(name));

saveData();

renderTable();

// أول سائق تجريبي
loadData();

renderTable();
// ===============================
// فتح نافذة الإدخال
// ===============================

const dayModal = document.getElementById("dayModal");
const modalTitle = document.getElementById("modalTitle");

const meatValue = document.getElementById("meatValue");
const orderValue = document.getElementById("orderValue");
const notes = document.getElementById("notes");

const saveDay = document.getElementById("saveDay");
const closeModal = document.getElementById("closeModal");

let currentDriver = -1;
let currentDay = -1;

// عند الضغط على أي يوم
document.addEventListener("click", function(e){

    if(!e.target.closest(".day")) return;

    const cell = e.target.closest(".day");

    currentDriver = Number(cell.dataset.driver);
    currentDay = Number(cell.dataset.day);

    const data = drivers[currentDriver].days[currentDay];

    modalTitle.textContent = "اليوم " + (currentDay + 1);

    meatValue.value = data.meat;
    orderValue.value = data.orders;
    notes.value = data.notes;

    dayModal.style.display = "flex";

});

// حفظ
saveDay.onclick = function(){

    drivers[currentDriver].days[currentDay].meat =
        parseFloat(meatValue.value) || 0;

    drivers[currentDriver].days[currentDay].orders =
        parseFloat(orderValue.value) || 0;

    drivers[currentDriver].days[currentDay].notes =
        notes.value;

    dayModal.style.display = "none";

    renderTable();

};

// إغلاق
closeModal.onclick = function(){

    dayModal.style.display = "none";

};
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

        drivers = [
            createDriver("فؤاد")
        ];

    }

}
