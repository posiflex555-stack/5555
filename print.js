/*==================================================
        PRINT.JS V3
        مطاعم ومطابخ سحايب ديرتي
==================================================*/

//==============================
// طباعة A4
//==============================
const print80Btn = document.getElementById("print80Btn");

print80Btn.addEventListener("click", print80);
printA4Btn.addEventListener("click", printA4);

function printA4(){

    const monthSelect = document.getElementById("month");
    const year = document.getElementById("year").value;

    const monthName =
        monthSelect.options[monthSelect.selectedIndex].text;

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

</style>

</head>

<body>

<h1>

مطاعم ومطابخ سحايب ديرتي

</h1>

<h2>

كشف السواقين الشهري

</h2>

<div class="info">

<div>

الشهر :
${monthName}

</div>

<div>

السنة :
${year}

</div>

<div>

عدد السواقين :
${drivers.length}

</div>

</div>

<table>

<thead>

<tr>

<th class="driver">

السائق

</th>
`;
  // إنشاء أعمدة الأيام

for (let day = 1; day <= daysInMonth; day++) {

    html += `
        <th class="day">
            ${day}
        </th>
    `;

}

html += `

<th class="total">

مجموع الذبائح

</th>

<th class="total">

مجموع الطلبات

</th>

<th class="total">

الإجمالي

</th>

</tr>

</thead>

<tbody>

`;

//==============================
// بيانات السواقين
//==============================

drivers.forEach(driver => {

    let meatTotal = 0;
    let ordersTotal = 0;

    html += `
    <tr>

    <td class="driver">

    ${driver.name}

    </td>
    `;

    for (let day = 0; day < daysInMonth; day++) {

        const data = driver.days[day] || {};

        const meat =
            Number(data.meat || 0);

        const orders =
            Number(data.orders || 0);

        meatTotal += meat;
        ordersTotal += orders;

        html += `
        <td class="day">

        <div>ذ:${meat || ""}</div>

        <div>ط:${orders || ""}</div>

        </td>
        `;

    }

    totalMeatAll += meatTotal;
    totalOrdersAll += ordersTotal;

    html += `

    <td class="total">

    ${meatTotal.toFixed(2)}

    </td>

    <td class="total">

    ${ordersTotal.toFixed(2)}

    </td>

    <td class="total">

    ${(meatTotal + ordersTotal).toFixed(2)}

    </td>

    </tr>

    `;

});
  //==============================
// صف الإجماليات العامة
//==============================

html += `

</tbody>

<tfoot>

<tr>

<td>

الإجمالي العام

</td>

`;

for (let day = 1; day <= daysInMonth; day++) {

    html += `<td></td>`;

}

html += `

<td>

${totalMeatAll.toFixed(2)}

</td>

<td>

${totalOrdersAll.toFixed(2)}

</td>

<td>

${(totalMeatAll + totalOrdersAll).toFixed(2)}

</td>

</tr>

</tfoot>

</table>

<script>

window.onload=function(){

    window.print();

};

window.onafterprint=function(){

    window.close();

};

</script>

</body>

</html>

`;

const printWindow = window.open("", "_blank");

printWindow.document.open();

printWindow.document.write(html);

printWindow.document.close();

}
function print80(){

    alert("طباعة 80mm");

}
