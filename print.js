/*==================================================
        PRINT.JS V5
        مطاعم ومطابخ سحايب ديرتي
==================================================*/

print80Btn.addEventListener("click", print80);
printA4Btn.addEventListener("click", printA4);


/*==================================================
        طباعة A4
        الورقة A4 بالطول
        التقرير يدور 90 درجة
        ليأخذ عرض الصفحة بالكامل
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

<title>كشف نسبة السواقين الشهري</title>

<style>

/*==================================================
        إعداد الصفحة
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

    font-family:
        Cairo,
        Tahoma,
        Arial,
        sans-serif;

    color:#000;

    direction:rtl;
}


/*==================================================
        التقرير

        أبعاد المحتوى:
        297mm × 210mm

        ثم تدوير 90°
==================================================*/

.sheet{

    position:absolute;

    width:297mm;
    height:210mm;

    left:50%;
    top:50%;

    transform:
        translate(-50%, -50%)
        rotate(90deg);

    transform-origin:center center;

    padding:7mm;

    background:#fff;

    overflow:hidden;
}


/*==================================================
        رأس التقرير
==================================================*/

.header{

    width:100%;

    text-align:center;

    margin-bottom:4mm;
}

.header h1{

    margin:0;

    font-size:22px;

    font-weight:900;

    line-height:1.2;
}

.header h2{

    margin:1.5mm 0;

    font-size:16px;

    font-weight:800;

    line-height:1.2;
}

.header .year{

    font-size:13px;

    font-weight:700;
}


/*==================================================
        معلومات التقرير
==================================================*/

.info{

    width:100%;

    display:flex;

    justify-content:space-between;

    align-items:center;

    border-top:1.5px solid #000;

    border-bottom:1.5px solid #000;

    padding:2mm 3mm;

    margin-bottom:3mm;

    font-size:11px;

    font-weight:800;
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

    padding:1px;

    font-size:7.5px;

    line-height:1.1;

    overflow:hidden;
}


/*==================================================
        رأس الجدول
==================================================*/

thead th{

    background:#eeeeee;

    font-weight:900;

    height:10mm;
}


/*==================================================
        اسم السائق
==================================================*/

.driver{

    width:62px;

    min-width:62px;

    max-width:62px;

    font-size:9px;

    font-weight:900;

    white-space:nowrap;

    overflow:hidden;

    text-overflow:ellipsis;
}


/*==================================================
        أعمدة الأيام
==================================================*/

.day{

    width:auto;

    font-size:7px;

    padding:1px;
}


/*==================================================
        أرقام الذبائح والتوصيل داخل اليوم
==================================================*/

.day div{

    height:8px;

    line-height:8px;

    white-space:nowrap;

    overflow:hidden;
}


/*==================================================
        أعمدة الإجماليات
==================================================*/

.total{

    width:55px;

    min-width:55px;

    max-width:55px;

    background:#fafafa;

    font-size:8px;

    font-weight:900;
}


/*==================================================
        الإجمالي العام
==================================================*/

tfoot td{

    background:#e8e8e8;

    font-size:9px;

    font-weight:900;

    height:9mm;
}

tfoot .driver{

    font-size:9px;
}


/*==================================================
        ملخص الإجماليات
==================================================*/

.summary{

    width:100%;

    display:flex;

    flex-direction:row;

    justify-content:center;

    align-items:stretch;

    gap:7mm;

    margin-top:5mm;
}


/*==================================================
        مربعات الإجماليات
==================================================*/

.summary-box{

    flex:1;

    border:2px solid #000;

    padding:3.5mm 3mm;

    text-align:center;

    font-size:16px;

    font-weight:900;

    line-height:1.2;

    min-height:22mm;
}


.summary-title{

    display:block;

    margin-bottom:2mm;

    font-size:11px;

    font-weight:900;
}


.summary-box.final{

    font-size:18px;

    border-width:2.5px;
}


/*==================================================
        الطباعة
==================================================*/

@media print{

    @page{

        size:A4 portrait;

        margin:0;
    }

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


<div class="sheet">


<!--==================================================
        رأس التقرير
==================================================-->

<div class="header">

    <h1>
        مطاعم ومطابخ سحايب ديرتي
    </h1>

    <h2>
        كشف نسبة السواقين الشهري
    </h2>

    <div class="year">
        السنة : ${year}
    </div>

</div>


<!--==================================================
        معلومات التقرير
==================================================-->

<div class="info">

    <div>
        الشهر : ${monthName}
    </div>

    <div>
        عدد السواقين : ${drivers.length}
    </div>

</div>


<!--==================================================
        الجدول
==================================================-->

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
    الذبائح
</th>

<th class="total">
    🛵
    <br>
    التوصيل
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
        خلايا الأيام في الإجمالي
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
        الملخص النهائي
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

    },700);

};


window.onafterprint = function(){

    setTimeout(function(){

        window.close();

    },300);

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
/*==================================================
        طباعة حرارية 80mm
        الاتجاه: تدوير 90 درجة
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

<title>كشف السواقين</title>

<style>

/*==================================================
        إعداد الطباعة الحرارية
==================================================*/

@page{
    size:80mm auto;
    margin:0;
}

*{
    box-sizing:border-box;
}

html,
body{

    margin:0;
    padding:0;

    width:80mm;

    background:#fff;
}

body{

    font-family:
        Cairo,
        Tahoma,
        Arial,
        sans-serif;

    direction:rtl;

    color:#000;
}


/*==================================================
        ورقة التقرير
        تدوير 90 درجة
==================================================*/

.sheet{

    width:80mm;

    padding:2mm;

    background:#fff;

    overflow:hidden;

    transform:rotate(90deg);

    transform-origin:top left;

    margin-left:80mm;

    margin-top:0;
}


/*==================================================
        العنوان
==================================================*/

.header{

    text-align:center;

    margin-bottom:3mm;
}

.header h1{

    margin:0;

    font-size:13px;

    font-weight:900;
}

.header h2{

    margin:1mm 0;

    font-size:11px;

    font-weight:800;
}

.header h3{

    margin:0;

    font-size:10px;

    font-weight:700;
}


/*==================================================
        الجدول
==================================================*/

table{

    width:100%;

    border-collapse:collapse;

    table-layout:fixed;
}

th,
td{

    border:1px solid #000;

    text-align:center;

    vertical-align:middle;

    padding:1px;

    font-size:5px;

    line-height:1.1;

    overflow:hidden;
}


/*==================================================
        اسم السائق
==================================================*/

.driver{

    width:35px;

    min-width:35px;

    max-width:35px;

    font-size:6px;

    font-weight:900;

    white-space:nowrap;

    overflow:hidden;
}


/*==================================================
        الأيام
==================================================*/

.day{

    font-size:5px;

    padding:1px;
}

.day div{

    height:6px;

    line-height:6px;

    white-space:nowrap;
}


/*==================================================
        الإجماليات
==================================================*/

.sum{

    width:35px;

    min-width:35px;

    max-width:35px;

    font-size:6px;

    font-weight:900;

    background:#f5f5f5;
}


/*==================================================
        الإجمالي العام
==================================================*/

tfoot td{

    font-size:6px;

    font-weight:900;

    background:#e5e5e5;
}


/*==================================================
        ملخص الإجماليات
==================================================*/

.summary{

    width:100%;

    margin-top:4mm;

    border-top:2px solid #000;

    padding-top:2mm;
}

.summary-row{

    display:flex;

    justify-content:space-between;

    align-items:center;

    border-bottom:1px solid #000;

    padding:2mm 1mm;

    font-size:8px;

    font-weight:900;
}

.summary-row.final{

    border-top:2px solid #000;

    font-size:10px;

    padding-top:3mm;
}


/*==================================================
        الطباعة
==================================================*/

@media print{

    html,
    body{

        width:80mm;

        margin:0;

        padding:0;
    }

    .sheet{

        width:80mm;
    }
}

</style>

</head>

<body>


<div class="sheet">


<!--==================================================
        رأس التقرير
==================================================-->

<div class="header">

    <h1>
        مطاعم ومطابخ سحايب ديرتي
    </h1>

    <h2>
        كشف نسبة السواقين الشهري
    </h2>

    <h3>
        ${monthName} - ${year}
    </h3>

</div>


<!--==================================================
        الجدول
==================================================-->

<table>

<thead>

<tr>

<th class="driver">
السائق
</th>
`;


/*==================================================
        الأيام
==================================================*/

for(let day = 1; day <= daysInMonth; day++){

    html += `
        <th class="day">
            ${day}
        </th>
    `;

}


html += `

<th class="sum">
🥩
<br>
ذبائح
</th>

<th class="sum">
🛵
<br>
توصيل
</th>

<th class="sum">
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


/*==================================================
        الإجمالي العام
==================================================*/

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
        <td class="day">-</td>
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


<!--==================================================
        الملخص النهائي
==================================================-->

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


</div>


<script>

window.onload = function(){

    setTimeout(function(){

        window.print();

    },700);

};


window.onafterprint = function(){

    setTimeout(function(){

        window.close();

    },300);

};

</script>


</body>

</html>

`;


    const win =
        window.open("", "_blank");


    if(!win){

        alert(
            "يرجى السماح بفتح النوافذ المنبثقة للطباعة"
        );

        return;
    }


    win.document.open();

    win.document.write(html);

    win.document.close();

    win.focus();


    setTimeout(() => {

        win.print();

    },700);

}
