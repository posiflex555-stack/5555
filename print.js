/*==================================================
        PRINT.JS V4
        مطاعم ومطابخ سحايب ديرتي
==================================================*/

print80Btn.addEventListener("click", print80);
printA4Btn.addEventListener("click", printA4);

/*==================================================
        طباعة A4
        نفس الشكل المطلوب:
        A4 بالطول + التقرير مدور 90 درجة
==================================================*/

function printA4(){

    const monthSelect =
        document.getElementById("month");

    const year =
        document.getElementById("year").value;

    const monthName =
        monthSelect.options[
            monthSelect.selectedIndex
        ].text;

    const monthNumber =
        Number(monthSelect.value);

    const daysInMonth =
        new Date(year, monthNumber, 0).getDate();


    let totalMeatAll = 0;
    let totalOrdersAll = 0;


    let html = `
<!DOCTYPE html>

<html lang="ar" dir="rtl">

<head>

<meta charset="UTF-8">

<title>كشف نسبة السواقين</title>

<style>

/*==================================================
        الورقة الأصلية A4 بالطول
==================================================*/

@page{
    size:A4 portrait;
    margin:0;
}

*{
    box-sizing:border-box;
}

html,
body{
    width:210mm;
    height:297mm;

    margin:0;
    padding:0;

    overflow:hidden;

    background:#fff;
}

body{
    direction:rtl;
    font-family:Cairo,Tahoma,Arial,sans-serif;
    color:#000;
}


/*==================================================
        التقرير الداخلي

        حجمه Landscape
        ثم يتم تدويره 90 درجة
==================================================*/

.sheet{

    position:absolute;

    width:297mm;
    height:210mm;

    left:50%;
    top:50%;

    transform:
        translate(-50%,-50%)
        rotate(-90deg);

    transform-origin:center center;

    overflow:hidden;

    padding:7mm;

}


/*==================================================
        العنوان
==================================================*/

h1{

    margin:0;

    text-align:center;

    font-size:22px;

    line-height:1.2;

}

h2{

    margin:4px 0 7px;

    text-align:center;

    font-size:17px;

    line-height:1.2;

}


/*==================================================
        معلومات التقرير
==================================================*/

.info{

    width:100%;

    display:flex;

    justify-content:space-between;

    align-items:center;

    margin:6px 0;

    font-size:12px;

    font-weight:bold;

}


/*==================================================
        الجدول
==================================================*/

table{

    width:100%;

    max-width:100%;

    border-collapse:collapse;

    table-layout:fixed;

    margin:0;

}


/*==================================================
        جميع الخلايا
==================================================*/

th,
td{

    border:1px solid #000;

    text-align:center;

    vertical-align:middle;

    padding:2px;

    font-size:8px;

    line-height:1.1;

    overflow:hidden;

}


/*==================================================
        رأس الجدول
==================================================*/

th{

    background:#e9e9e9;

    font-weight:bold;

}


/*==================================================
        عمود السائق
==================================================*/

.driver{

    width:70px;

    min-width:70px;

    max-width:70px;

    font-weight:bold;

    white-space:nowrap;

    overflow:hidden;

    text-overflow:ellipsis;

}


/*==================================================
        أيام الشهر

        لا نحدد عرض ثابت
        حتى يتوزع الـ 31 يوم
        بالتساوي على كامل الجدول
==================================================*/

.day{

    width:auto;

    font-size:7px;

    padding:2px 1px;

    line-height:1.1;

}


/*==================================================
        أعمدة الإجماليات
==================================================*/

.total{

    width:62px;

    min-width:62px;

    max-width:62px;

    background:#fafafa;

    font-weight:bold;

    font-size:8px;

}


/*==================================================
        إجمالي الجدول
==================================================*/

tfoot td{

    background:#f5f5f5;

    font-size:10px;

    font-weight:bold;

}


/*==================================================
        مربعات الإجماليات
==================================================*/

.summary{

    width:100%;

    display:flex;

    justify-content:center;

    align-items:stretch;

    gap:12px;

    margin-top:9px;

}


.summary-box{

    width:190px;

    min-width:190px;

    border:2px solid #000;

    padding:7px 10px;

    text-align:center;

    font-size:14px;

    font-weight:bold;

}


.summary-box.final{

    font-size:16px;

}


.summary-title{

    display:block;

    margin-bottom:3px;

    font-size:12px;

}


/*==================================================
        منع أي تغيير عند الطباعة
==================================================*/

@media print{

    html,
    body{

        width:210mm;

        height:297mm;

        margin:0;

        padding:0;

        overflow:hidden;

    }

    .sheet{

        width:297mm;

        height:210mm;

    }

}

</style>

</head>

<body>


<!--==================================================
        الورقة المدورة
==================================================-->

<div class="sheet">


<h1>
مطاعم ومطابخ سحايب ديرتي
</h1>


<h2>
كشف نسبة السواقين الشهري
</h2>


<div class="info">

<div>
الشهر : ${monthName}
</div>

<div>
السنة : ${year}
</div>

<div>
عدد السواقين : ${drivers.length}
</div>

</div>


<table>

<thead>

<tr>

<th class="driver">
السائق
</th>
`;


/*==================================================
        أيام الشهر
==================================================*/

for(let day = 1; day <= daysInMonth; day++){

    html += `
        <th class="day">
            ${day}
        </th>
    `;

}


html += `

<th class="total">
🥩
<br>
مجموع الذبائح
</th>

<th class="total">
🛵
<br>
مجموع التوصيل
</th>

<th class="total">
💰
<br>
الإجمالي
</th>

</tr>

</thead>

<tbody>
`;


/*==================================================
        بيانات السواقين
==================================================*/

drivers.forEach(driver => {

    let meatTotal = 0;

    let ordersTotal = 0;


    html += `

<tr>

<td class="driver">
${driver.name}
</td>

`;


    for(let day = 0; day < daysInMonth; day++){

        const data =
            driver.days[day] || {};


        const meat =
            Number(data.meat || 0);


        const orders =
            Number(data.orders || 0);


        meatTotal += meat;

        ordersTotal += orders;


        html += `

<td class="day">

<div>
${meat ? "ذ:" + meat : ""}
</div>

<div>
${orders ? "ط:" + orders : ""}
</div>

</td>

`;

    }


    totalMeatAll += meatTotal;

    totalOrdersAll += ordersTotal;


    const driverTotal =
        meatTotal + ordersTotal;


    html += `

<td class="total">
${meatTotal.toFixed(2)}
</td>

<td class="total">
${ordersTotal.toFixed(2)}
</td>

<td class="total">
${driverTotal.toFixed(2)}
</td>

</tr>

`;

});


/*==================================================
        الإجمالي العام
==================================================*/

const grandTotal =
    totalMeatAll + totalOrdersAll;


html += `

</tbody>

<tfoot>

<tr>

<td class="driver">
الإجمالي العام
</td>
`;


/*==================================================
        الخانات اليومية
==================================================*/

for(let day = 1; day <= daysInMonth; day++){

    html += `
        <td class="day"></td>
    `;

}


html += `

<td class="total">
${totalMeatAll.toFixed(2)}
</td>

<td class="total">
${totalOrdersAll.toFixed(2)}
</td>

<td class="total">
${grandTotal.toFixed(2)}
</td>

</tr>

</tfoot>

</table>


<!--==================================================
        مربعات الإجماليات
==================================================-->

<div class="summary">


<div class="summary-box">

<span class="summary-title">
🥩 إجمالي الذبائح
</span>

${totalMeatAll.toFixed(2)}

</div>


<div class="summary-box">

<span class="summary-title">
🛵 إجمالي التوصيل
</span>

${totalOrdersAll.toFixed(2)}

</div>


<div class="summary-box final">

<span class="summary-title">
💰 الإجمالي النهائي
</span>

${grandTotal.toFixed(2)}

</div>


</div>


</div>


<script>

window.onload = function(){

    setTimeout(function(){

        window.print();

    },500);

};


window.onafterprint = function(){

    window.close();

};

</script>


</body>

</html>
`;


    const printWindow =
        window.open("", "_blank");


    if(!printWindow){

        alert(
            "يرجى السماح بفتح النوافذ المنبثقة للطباعة"
        );

        return;

    }


    printWindow.document.open();

    printWindow.document.write(html);

    printWindow.document.close();

}
/*==================================================
        طباعة حرارية 80mm
==================================================*/

function print80(){

    const monthSelect =
        document.getElementById("month");

    const year =
        document.getElementById("year").value;

    const monthName =
        monthSelect.options[
            monthSelect.selectedIndex
        ].text;

    const monthNumber =
        Number(monthSelect.value);

    const daysInMonth =
        new Date(year, monthNumber, 0).getDate();


    let totalMeatAll = 0;
    let totalOrdersAll = 0;


    let html = `

<!DOCTYPE html>

<html lang="ar" dir="rtl">

<head>

<meta charset="UTF-8">

<title>طباعة كشف السواقين</title>

<style>

@page{
    size:80mm auto;
    margin:0;
}

html,
body{
    width:80mm;
    margin:0;
    padding:0;
    font-family:Cairo,Tahoma,Arial;
}

body{
    padding:2mm;
    zoom:1.20;
}

h2{
    margin:0;
    text-align:center;
    font-size:16px;
}

h3{
    margin:4px 0;
    text-align:center;
    font-size:13px;
}

table{
    width:100%;
    border-collapse:collapse;
}

th,
td{
    border:1px solid #000;
    font-size:6px;
    padding:1px;
    text-align:center;
}

.driver{
    font-weight:bold;
    width:45px;
}

.sum{
    font-weight:bold;
}


/*==============================
    ملخص 80mm
==============================*/

.summary{
    margin-top:8px;
    border-top:2px solid #000;
    padding-top:5px;
}

.summary-row{
    display:flex;
    justify-content:space-between;
    border-bottom:1px solid #000;
    padding:3px 2px;
    font-size:10px;
    font-weight:bold;
}

.final{
    font-size:12px;
    border-top:2px solid #000;
    margin-top:3px;
    padding-top:4px;
}

</style>

</head>

<body>

<h2>
مطاعم ومطابخ سحايب ديرتي
</h2>

<h3>
كشف السواقين
</h3>

<h3>
${monthName} ${year}
</h3>

<table>

<thead>

<tr>

<th class="driver">
السائق
</th>
`;


/* الأيام */

for(let day = 1; day <= daysInMonth; day++){

    html += `
        <th>${day}</th>
    `;

}


html += `

<th class="sum">
🥩
</th>

<th class="sum">
🛵
</th>

<th class="sum">
💰
</th>

</tr>

</thead>

<tbody>
`;


/*==============================
    بيانات السواقين
==============================*/

drivers.forEach(driver => {

    let meatTotal = 0;
    let ordersTotal = 0;


    html += `

<tr>

<td class="driver">
${driver.name}
</td>

`;


    for(let day = 0; day < daysInMonth; day++){

        const d =
            driver.days[day] || {};

        const meat =
            Number(d.meat || 0);

        const orders =
            Number(d.orders || 0);

        meatTotal += meat;
        ordersTotal += orders;


        html += `

<td>

${meat || ""}

<br>

${orders || ""}

</td>

`;

    }


    totalMeatAll += meatTotal;
    totalOrdersAll += ordersTotal;


    const driverTotal =
        meatTotal + ordersTotal;


    html += `

<td class="sum">
${meatTotal.toFixed(2)}
</td>

<td class="sum">
${ordersTotal.toFixed(2)}
</td>

<td class="sum">
${driverTotal.toFixed(2)}
</td>

</tr>

`;

});


/*==============================
    الإجمالي العام
==============================*/

const grandTotal =
    totalMeatAll + totalOrdersAll;


html += `

<tr>

<td class="sum">
الإجمالي
</td>
`;


for(let day = 1; day <= daysInMonth; day++){

    html += `
        <td>-</td>
    `;

}


html += `

<td class="sum">
${totalMeatAll.toFixed(2)}
</td>

<td class="sum">
${totalOrdersAll.toFixed(2)}
</td>

<td class="sum">
${grandTotal.toFixed(2)}
</td>

</tr>

</tbody>

</table>


<!--========================================
        التجميع النهائي في آخر الفاتورة
=========================================-->

<div class="summary">

<div class="summary-row">

<span>
🥩 إجمالي الذبائح
</span>

<span>
${totalMeatAll.toFixed(2)}
</span>

</div>


<div class="summary-row">

<span>
🛵 إجمالي التوصيل
</span>

<span>
${totalOrdersAll.toFixed(2)}
</span>

</div>


<div class="summary-row final">

<span>
💰 الإجمالي النهائي
</span>

<span>
${grandTotal.toFixed(2)}
</span>

</div>

</div>


</body>

</html>

`;


    const win =
        window.open("", "_blank");

    win.document.write(html);

    win.document.close();

    win.focus();


    setTimeout(() => {

        win.print();

    }, 500);

}
