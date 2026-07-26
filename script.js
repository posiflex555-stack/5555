/*==================================================
        إدارة السواقين
==================================================*/

let drivers = loadStorage(STORAGE_KEYS.drivers, []);

let selectedDriver = null;

let selectedIndex = -1;

/*==================================================
        عناصر الصفحة
==================================================*/

const driverName = document.getElementById("driverName");

const driverPhone = document.getElementById("driverPhone");

const addDriverBtn = document.getElementById("addDriverBtn");

const driversList = document.getElementById("driversList");

const searchDriver = document.getElementById("searchDriver");

const sendAllBtn = document.getElementById("sendAllBtn");

const settingsBtn = document.getElementById("settingsBtn");

const editModal = document.getElementById("editModal");

const editDriverName = document.getElementById("editDriverName");

const editDriverPhone = document.getElementById("editDriverPhone");

const saveEditBtn = document.getElementById("saveEditBtn");

const cancelEditBtn = document.getElementById("cancelEditBtn");

const deleteModal = document.getElementById("deleteModal");

const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");

const cancelDeleteBtn = document.getElementById("cancelDeleteBtn");

/*==================================================
        بداية التطبيق
==================================================*/

renderDrivers();

addDriverBtn.onclick = addDriver;

searchDriver.oninput = renderDrivers;

settingsBtn.onclick = () => {

location.href = "settings.html";

};
/*==================================================
        إضافة سائق جديد
==================================================*/

function addDriver(){

const name = driverName.value.trim();

const phone = driverPhone.value.trim();

if(name === ""){

alert("يرجى إدخال اسم السائق");

driverName.focus();

return;

}

if(phone === ""){

alert("يرجى إدخال رقم الجوال");

driverPhone.focus();

return;

}

// التحقق من عدم تكرار الاسم

const exists = drivers.some(driver =>

driver.name === name

);

if(exists){

alert("هذا السائق موجود مسبقاً");

return;

}

// إنشاء السائق

const newDriver = {

id: Date.now(),

name: name,

phone: phone,

createdAt: currentDateTime(),

invoiceNumber: "",

total: 0,

orders: []

};

// إضافته للقائمة

drivers.push(newDriver);

// حفظ

saveStorage(

STORAGE_KEYS.drivers,

drivers

);

// تنظيف الحقول

driverName.value = "";

driverPhone.value = "";

driverName.focus();

// تحديث القائمة

renderDrivers();

}

/*==================================================
        تحديث القائمة
==================================================*/

function saveDrivers(){

saveStorage(

STORAGE_KEYS.drivers,

drivers

);

}
/*==================================================
        عرض السواقين
==================================================*/

function renderDrivers(){

const keyword = searchDriver.value.trim().toLowerCase();

driversList.innerHTML = "";

let list = drivers;

if(keyword){

list = drivers.filter(driver =>
driver.name.toLowerCase().includes(keyword)
);

}

if(list.length === 0){

driversList.innerHTML = `
<div class="empty">
<span>🚚</span>
لا يوجد سواقين
</div>
`;

return;

}

list.forEach(driver=>{

const card=document.createElement("div");

card.className="driver-card";

card.innerHTML=`

<div class="driver-name">
${driver.name}
</div>

<div class="driver-phone">
📱 ${driver.phone}
</div>

<div class="driver-actions">

<button class="primary-btn"
onclick="openDriver(${driver.id})">

🧾 فتح الفاتورة

</button>

<button class="green-btn"
onclick="editDriver(${driver.id})">

✏️ تعديل

</button>

<button class="danger-btn"
onclick="deleteDriver(${driver.id})">

🗑 حذف

</button>

</div>

`;

driversList.appendChild(card);

});

}
/*==================================================
        فتح فاتورة السائق
==================================================*/

function openDriver(id){

const driver = drivers.find(d=>d.id===id);

if(!driver) return;

localStorage.setItem(

"current_driver",

JSON.stringify(driver)

);

location.href="driver.html";

}
/*==================================================
        تعديل بيانات السائق
==================================================*/

function editDriver(id){

selectedDriver = drivers.find(driver => driver.id === id);

selectedIndex = drivers.findIndex(driver => driver.id === id);

if(selectedIndex === -1) return;

editDriverName.value = selectedDriver.name;

editDriverPhone.value = selectedDriver.phone;

editModal.classList.add("active");

}

saveEditBtn.onclick = function(){

const name = editDriverName.value.trim();

const phone = editDriverPhone.value.trim();

if(name === ""){

alert("يرجى إدخال اسم السائق");

return;

}

drivers[selectedIndex].name = name;

drivers[selectedIndex].phone = phone;

saveDrivers();

renderDrivers();

editModal.classList.remove("active");

};

cancelEditBtn.onclick = function(){

editModal.classList.remove("active");

};
/*==================================================
        حذف السائق
==================================================*/

function deleteDriver(id){

selectedIndex = drivers.findIndex(driver => driver.id === id);

if(selectedIndex === -1) return;

deleteModal.classList.add("active");

}

confirmDeleteBtn.onclick = function(){

drivers.splice(selectedIndex,1);

saveDrivers();

renderDrivers();

deleteModal.classList.remove("active");

};

cancelDeleteBtn.onclick = function(){

deleteModal.classList.remove("active");

};
/*==================================================
        إرسال جميع الفواتير للكاشير
==================================================*/

sendAllBtn.onclick = function(){

if(drivers.length===0){

alert("لا يوجد سواقين");

return;

}

const settings = loadStorage(
    STORAGE_KEYS.settings,
    DEFAULT_SETTINGS
);

let message = "";

message += settings.restaurantName + "\n";
message += "📋 جميع فواتير السواقين\n\n";

let grandTotal=0;

drivers.forEach(driver=>{

message+="━━━━━━━━━━━━━━\n";

message+="👤 "+driver.name+"\n";

message+="📱 "+driver.phone+"\n";

message+="💰 الإجمالي : "+formatPrice(driver.total||0)+"\n\n";

grandTotal+=Number(driver.total||0);

});

message+="━━━━━━━━━━━━━━\n";

message+="💵 الإجمالي الكلي : "+formatPrice(grandTotal);

const phone = (settings.cashierPhone || "").replace(/\D/g, "");

if(phone===""){

alert("رقم الكاشير غير موجود");

return;

}

window.open(

`https://wa.me/966${phone.replace(/^0/,"")}?text=${encodeURIComponent(message)}`,

"_blank"

);

};
/*==================================================
        إغلاق النوافذ عند الضغط خارجها
==================================================*/

window.onclick=function(e){

if(e.target===editModal){

editModal.classList.remove("active");

}

if(e.target===deleteModal){

deleteModal.classList.remove("active");

}

};

/*==================================================
        تحديث تلقائي للقائمة
==================================================*/

renderDrivers();

/*==================================================
        نهاية الملف
==================================================*/
