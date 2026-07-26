/*==================================================
        بيانات التطبيق
==================================================*/

const APP = {

name: "مطاعم ومطابخ سحايب ديرتي",

cashierPhone: "05XXXXXXXX",

currency: "ريال",

version: "1.0"

};

/*==================================================
        قائمة الأصناف
==================================================*/

const MENU = {

chicken: [

{
id:1,
name:"ربع شواية",
price:8
},

{
id:2,
name:"ربع مندي",
price:8
},

{
id:3,
name:"ربع مضغوط",
price:8
},

{
id:4,
name:"ربع مظبي",
price:8
},

{
id:5,
name:"ربع مدفون",
price:8
},

{
id:6,
name:"نصف شواية",
price:16
},

{
id:7,
name:"نصف مندي",
price:16
},

{
id:8,
name:"نصف مضغوط",
price:16
},

{
id:9,
name:"نصف مظبي",
price:16
},

{
id:10,
name:"نصف مدفون",
price:16
},

{
id:11,
name:"حبة شواية",
price:32
},

{
id:12,
name:"حبة مندي",
price:32
},

{
id:13,
name:"حبة مضغوط",
price:32
},

{
id:14,
name:"حبة مظبي",
price:32
},

{
id:15,
name:"حبة مدفون",
price:32
},

{
id:16,
name:"رز سادة",
price:5
}

],
  /*==================================================
        الإيدامات
==================================================*/

edamat:[

{
id:101,
name:"ملوخية",
price:5
},

{
id:102,
name:"بامية",
price:5
},

{
id:103,
name:"مشكل خضار",
price:5
},

{
id:104,
name:"مسقعة",
price:5
},

{
id:105,
name:"فاصوليا",
price:5
},

{
id:106,
name:"بازلاء",
price:5
},

{
id:107,
name:"قرع",
price:5
},

{
id:108,
name:"بطاطس",
price:5
}

],

/*==================================================
        المشروبات
==================================================*/

drinks:[

{
id:201,
name:"ماء صغير",
price:1
},

{
id:202,
name:"ماء كبير",
price:2
},

{
id:203,
name:"بيبسي",
price:3
},

{
id:204,
name:"سفن أب",
price:3
},

{
id:205,
name:"ميرندا برتقال",
price:3
},

{
id:206,
name:"ديو",
price:3
},

{
id:207,
name:"حمضيات",
price:3
},

{
id:208,
name:"شاي مثلج",
price:4
}

],

/*==================================================
        المقبلات
==================================================*/

starters:[

{
id:301,
name:"سلطة خضراء",
price:5
},

{
id:302,
name:"سلطة حارة",
price:5
},

{
id:303,
name:"طحينة",
price:2
},

{
id:304,
name:"شطة",
price:1
},

{
id:305,
name:"كاتشب",
price:1
},

{
id:306,
name:"ثوم",
price:2
},

{
id:307,
name:"ليمون",
price:1
},

{
id:308,
name:"خبز",
price:1
}
],
  /*==================================================
        نهاية قائمة الأصناف
==================================================*/

};

/*==================================================
        مفاتيح التخزين
==================================================*/

const STORAGE_KEYS = {

drivers: "drivers_app_v1",

settings: "drivers_settings_v1",

invoice: "drivers_invoice_v1"

};

/*==================================================
        الإعدادات الافتراضية
==================================================*/

const DEFAULT_SETTINGS = {

restaurantName: APP.name,

cashierPhone: APP.cashierPhone,

currency: APP.currency,

themeColor: "#0d6efd",

printLogo: true,

autoInvoiceNumber: true

};

/*==================================================
        دوال مساعدة
==================================================*/

// قراءة البيانات من التخزين
function loadStorage(key, defaultValue){

try{

const data = localStorage.getItem(key);

return data ? JSON.parse(data) : defaultValue;

}catch(e){

console.error(e);

return defaultValue;

}

}

// حفظ البيانات
function saveStorage(key, value){

localStorage.setItem(

key,

JSON.stringify(value)

);

}

// إنشاء رقم فاتورة
function generateInvoiceNumber(){

return "INV-" + Date.now();

}

// تنسيق السعر
function formatPrice(price){

return `${Number(price).toFixed(2)} ${APP.currency}`;

}

// الحصول على التاريخ والوقت
function currentDateTime(){

const now = new Date();

return now.toLocaleString("ar-SA");

}

/*==================================================
        إنشاء البيانات لأول تشغيل
==================================================*/

if(!localStorage.getItem(STORAGE_KEYS.settings)){

saveStorage(

STORAGE_KEYS.settings,

DEFAULT_SETTINGS

);

}

if(!localStorage.getItem(STORAGE_KEYS.drivers)){

saveStorage(

STORAGE_KEYS.drivers,

[]

);

}

/*==================================================
        نهاية الملف
==================================================*/
