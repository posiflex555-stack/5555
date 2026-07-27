/*==================================================
    DRIVER PRO V1
==================================================*/

const driversBody = document.getElementById("driversBody");
const yearSelect = document.getElementById("year");
const addDriverBtn = document.getElementById("addDriverBtn");

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

    renderTable();

};

// أول سائق تجريبي
drivers.push(createDriver("فؤاد"));

renderTable();
