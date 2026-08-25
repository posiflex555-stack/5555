/*==================================================
        PRINT.JS V4
        مطاعم ومطابخ سحايب ديرتي
==================================================*/

print80Btn.addEventListener("click", print80);
printA4Btn.addEventListener("click", printA4);


/*==================================================
        طباعة A4
==================================================*/

function printA4(){

    const monthSelect = document.getElementById("month");
    const year = document.getElementById("year").value;

    const monthName =
        monthSelect.options[monthSelect.selectedIndex].text;

    const monthNumber = Number(monthSelect.value);

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

@page{
    size:A4 landscape;
    margin:8mm;
}

body{
    direction:rtl;
    font-family:Cairo,Tahoma,Arial,sans-serif;
    margin:0;
    padding:0;
}

h1{
    margin:0;
    text-align:center;
    font-size:24px;
}

h2{
    margin:8px 0;
    text-align:center;
    font-size:18px;
}

.info{
    display:flex;
    justify-content:space-between;
    margin:15px 0;
    font-size:14px;
    font-weight:bold;
}

table{
    width:100%;
    border-collapse:collapse;
}

th{
    background:#e9e9e9;
}

th,
td{
    border:1px solid #000;
    text-align:center;
    padding:3px;
    font-size:10px;
}

.driver{
    min-width:110px;
    font-weight:bold;
}

.day{
    width:34px;
    line-height:1.2;
}

.total{
    background:#fafafa;
    font-weight:bold;
}

tfoot td{
    font-size:12px;
    font-weight:bold;
    background:#f5f5f5;
}


/*==============================
    ملخص الإجماليات
==============================*/

.summary{
    margin-top:15px;
    width:100%;
    display:flex;
    justify-content:center;
    gap:15px;
}

.summary-box{
    border:2px solid #000;
    min-width:180px;
    padding:8px 15px;
    text-align:center;
    font-size:15px;
    font-weight:bold;
}

.summary-box.final{
    font-size:17px;
}

.summary-title{
    display:block;
    margin-bottom:4px;
}

</style>

</head>

<body>

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


/*==============================
    أعمدة الأيام
==============================*/

for(let day = 1; day <= daysInMonth; day++){

    html += `
        <th class="day">
            ${day}
        </th>
    `;

}

html += `

<th class="total">
🥩 مجموع الذبائح
</th>

<th class="total">
🛵 مجموع التوصيل
</th>

<th class="total">
💰 الإجمالي
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

        const data = driver.days[day] || {};

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
        نهاية الجدول
==================================================*/

const grandTotal =
    totalMeatAll + totalOrdersAll;


html += `

</tbody>

<tfoot>

<tr>

<td>
الإجمالي العام
</td>
`;


/* الخانات اليومية */

for(let day = 1; day <= daysInMonth; day++){

    html += `
        <td></td>
    `;

}


html += `

<td>
${totalMeatAll.toFixed(2)}
</td>

<td>
${totalOrdersAll.toFixed(2)}
</td>

<td>
${grandTotal.toFixed(2)}
</td>

</tr>

</tfoot>

</table>


<!--========================================
        ملخص آخر الفاتورة
=========================================-->

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


<script>

window.onload = function(){

    window.print();

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
