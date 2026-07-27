/*==================================================
        PRINT.JS
        مطاعم ومطابخ سحايب ديرتي
==================================================*/

//==============================
// زر طباعة A4
//==============================

printA4Btn.addEventListener("click", printA4);

//==============================
// طباعة A4
//==============================

function printA4() {

    const month = document.getElementById("month");
    const monthName = month.options[month.selectedIndex].text;
    const year = document.getElementById("year").value;

    let html = `
<!DOCTYPE html>
<html lang="ar" dir="rtl">

<head>

<meta charset="UTF-8">

<title>كشف السائقين</title>

<style>

body{

    font-family:Tahoma,Arial,sans-serif;
    direction:rtl;
    margin:20px;

}

h1,h2,h3{

    text-align:center;
    margin:5px;

}

table{

    width:100%;
    border-collapse:collapse;
    margin-top:20px;

}

th,td{

    border:1px solid #000;
    padding:5px;
    font-size:12px;
    text-align:center;

}

th{

    background:#eeeeee;

}

</style>

</head>

<body>

<h1>مطاعم ومطابخ سحايب ديرتي</h1>

<h2>كشف السائقين الشهري</h2>

<h3>الشهر : ${monthName} / ${year}</h3>

html += `

<table>

<thead>

<tr>

<th style="min-width:120px">السائق</th>

`;

for(let day=1; day<=31; day++){

    html += `<th>${day}</th>`;

}

html += `

<th>🥩 الذبائح</th>

<th>🛵 الطلبات</th>

<th>💰 الإجمالي</th>

</tr>

</thead>

<tbody>

`;

    drivers.forEach(driver=>{

        let meat = 0;
        let orders = 0;

        driver.days.forEach(day=>{

            meat += Number(day.meat);
            orders += Number(day.orders);

        });

        html += `<tr>`;

html += `<td>${driver.name}</td>`;

// بيانات الأيام
driver.days.forEach(day=>{

    html += `
    <td style="font-size:9px;line-height:1.3">

    ذ:${day.meat || ""}

    <br>

    ط:${day.orders || ""}

    </td>
    `;

});

// المجاميع
html += `<td>${meat.toFixed(2)}</td>`;

html += `<td>${orders.toFixed(2)}</td>`;

html += `<td>${(meat+orders).toFixed(2)}</td>`;

html += `</tr>`;

    });

    html += `
</table>

<br><br>

<table>

<tr>

<td style="height:80px;">توقيع السائق</td>

<td>توقيع المحاسب</td>

<td>اعتماد الإدارة</td>

</tr>

</table>

<script>

window.onload=function(){

    window.print();

}

</script>

</body>

</html>
`;

    const win = window.open("", "_blank");

    win.document.open();

    win.document.write(html);

    win.document.close();

}
