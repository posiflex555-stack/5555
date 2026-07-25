const STORAGE_KEY = "drivers_app_v1";

const drivers = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

const index = localStorage.getItem("currentDriver");

const driver = drivers[index];

document.getElementById("driverTitle").textContent = driver.name;

const chickenSection = document.getElementById("chickenSection");

const drinkSection = document.getElementById("drinkSection");

const extraSection = document.getElementById("extraSection");

const totalPrice = document.getElementById("totalPrice");

const menu = {

chicken:[

{name:"ربع شواية",price:8},

{name:"ربع مندي",price:8},

{name:"ربع مضغوط",price:8},

{name:"نصف شواية",price:16},

{name:"نصف مع الرز",price:18},

{name:"رز سادة",price:5}

],

drinks:[

{name:"ببسي كبير",price:5},

{name:"ببسي وسط",price:4},

{name:"ببسي صغير",price:3}

],

extras:[

{name:"مشكل خضار",price:4},

{name:"مسقعة",price:4},

{name:"بامية",price:4},

{name:"ملوخية",price:4}

]

};

function draw(section,data){

section.innerHTML="";

data.forEach(item=>{

section.innerHTML+=`

<div class="item">

<div>${item.name}</div>

<div>${item.price} ريال</div>

</div>

`;

});

}

draw(chickenSection,menu.chicken);

draw(drinkSection,menu.drinks);

draw(extraSection,menu.extras);
