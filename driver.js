// ===============================
// DRIVER.JS - PART 1
// ===============================

const STORAGE_KEY = "drivers_app_v1";

const drivers = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

const currentIndex = Number(localStorage.getItem("currentDriver"));

const driver = drivers[currentIndex];

document.getElementById("driverTitle").textContent = driver.name;

//----------------------------
// الأصناف
//----------------------------

const menu = {

chicken:[

{name:"ربع شواية",price:8},
{name:"ربع مندي",price:8},
{name:"ربع مضغوط",price:8},
{name:"نصف شواية",price:16},
{name:"نصف مع الرز",price:18},
{name:"رز سادة",price:5}

],

edamat:[

{name:"ملوخية",price:4},
{name:"بامية",price:4},
{name:"مسقعة",price:4}

],

drinks:[

{name:"ببسي كبير",price:5},
{name:"ببسي وسط",price:4},
{name:"ببسي صغير",price:3},
{name:"ماء",price:1}

],

starters:[

{name:"سلطة",price:4},
{name:"مشكل خضار",price:4},
{name:"طحينة",price:2},
{name:"شطة",price:1}

]

};

//----------------------------
// تحميل الطلبات السابقة
//----------------------------

if(!driver.orders){

driver.orders={};

}

let total=0;

//----------------------------
// إنشاء الأصناف
//----------------------------

function buildItems(list,containerId){

const box=document.getElementById(containerId);

box.innerHTML="";

list.forEach(item=>{

const qty=driver.orders[item.name]||0;

box.innerHTML+=`

<div class="item">

<div>

<b>${item.name}</b>

<br>

${item.price} ريال

</div>

<div class="counter">

<button onclick="minus('${item.name}',${item.price})">

-

</button>

<span id="${item.name}">

${qty}

</span>

<button onclick="plus('${item.name}',${item.price})">

+

</button>

</div>

</div>

`;

total+=qty*item.price;

});

}

buildItems(menu.chicken,"chickenSection");

buildItems(menu.edamat,"edamatSection");

buildItems(menu.drinks,"drinkSection");

buildItems(menu.starters,"starterSection");

document.getElementById("totalPrice").innerHTML=total+" ريال";
// ===============================
// DRIVER.JS - PART 2
// ===============================

function updateTotal(){

    total = 0;

    Object.keys(driver.orders).forEach(name=>{

        let price = 0;

        [...menu.chicken,...menu.edamat,...menu.drinks,...menu.starters].forEach(item=>{

            if(item.name===name){

                price=item.price;

            }

        });

        total += driver.orders[name] * price;

    });

    document.getElementById("totalPrice").innerHTML = total + " ريال";

}

function plus(name){

    if(!driver.orders[name]){

        driver.orders[name]=0;

    }

    driver.orders[name]++;

    document.getElementById(name).innerHTML=driver.orders[name];

    updateTotal();

}

function minus(name){

    if(!driver.orders[name]) return;

    driver.orders[name]--;

    if(driver.orders[name]<0){

        driver.orders[name]=0;

    }

    document.getElementById(name).innerHTML=driver.orders[name];

    updateTotal();

}

//========================
// حفظ الفاتورة
//========================

document.getElementById("saveInvoice").onclick=function(){

    drivers[currentIndex]=driver;

    localStorage.setItem(STORAGE_KEY,JSON.stringify(drivers));

    alert("تم حفظ الفاتورة بنجاح");

}
//========================
// فتح قسم وإغلاق البقية
//========================

function toggleSection(id){

    const sections=[
        "chickenSection",
        "edamatSection",
        "drinkSection",
        "starterSection"
    ];

    sections.forEach(section=>{

        const element=document.getElementById(section);

        if(section===id){

            element.style.display=
                element.style.display==="block" ? "none" : "block";

        }else{

            element.style.display="none";

        }

    });

}

// عند فتح الصفحة يكون قسم الدجاج مفتوح
toggleSection("chickenSection");
