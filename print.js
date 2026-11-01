/*==================================================
  PRINT.JS V6
  مطاعم ومطابخ سحايب ديرتي
  A4 + حراري 80mm
  تدوير التقرير 90 درجة
==================================================*/

(function () {
    "use strict";

    const print80Btn =
        document.getElementById("print80Btn") ||
        window.print80Btn;

    const printA4Btn =
        document.getElementById("printA4Btn") ||
        window.printA4Btn;

    if (print80Btn) {
        print80Btn.addEventListener("click", print80);
    }

    if (printA4Btn) {
        printA4Btn.addEventListener("click", printA4);
    }


    /*==================================================
        بيانات التقرير
    ==================================================*/

    function getReportData() {

        const monthSelect =
            document.getElementById("month");

        const yearInput =
            document.getElementById("year");

        if (!monthSelect || !yearInput) {
            alert("تعذر العثور على اختيار الشهر أو السنة.");
            return null;
        }

        const year = Number(yearInput.value);
        const monthNumber = Number(monthSelect.value);

        if (
            !year ||
            !monthNumber ||
            monthNumber < 1 ||
            monthNumber > 12
        ) {
            alert("يرجى اختيار الشهر والسنة بشكل صحيح.");
            return null;
        }

        const driverList =
            typeof drivers !== "undefined"
                ? drivers
                : window.drivers;

        if (!Array.isArray(driverList)) {
            alert("تعذر العثور على بيانات السائقين.");
            return null;
        }

        return {
            year,
            monthNumber,

            monthName:
                monthSelect.options[
                    monthSelect.selectedIndex
                ]?.text || "",

            daysInMonth:
                new Date(
                    year,
                    monthNumber,
                    0
                ).getDate(),

            drivers: driverList
        };
    }


    /*==================================================
        حماية النصوص
    ==================================================*/

    function esc(value) {

        return String(value ?? "").replace(
            /[&<>"']/g,
            function (ch) {

                return {
                    "&": "&amp;",
                    "<": "&lt;",
                    ">": "&gt;",
                    '"': "&quot;",
                    "'": "&#39;"
                }[ch];

            }
        );

    }


    /*==================================================
        إنشاء التقرير
    ==================================================*/

    function buildReport(data, mode) {

        let totalMeatAll = 0;
        let totalOrdersAll = 0;

        const isA4 = mode === "a4";

        const pageTitle =
            "كشف نسبة السواقين الشهري";

        let html = `<!DOCTYPE html>
<html lang="ar" dir="rtl">

<head>

<meta charset="UTF-8">

<meta name="viewport"
content="width=device-width, initial-scale=1">

<title>${pageTitle}</title>

<style>

/*==================================================
    إعداد الصفحة
==================================================*/

@page {
    size: ${isA4 ? "A4 portrait" : "80mm auto"};
    margin: 0;
}

* {
    box-sizing: border-box;
}

html,
body {
    margin: 0;
    padding: 0;
    background: #fff;
    color: #000;
}

body {
    font-family: Cairo, Tahoma, Arial, sans-serif;
    direction: rtl;
}


/*==================================================
    إعدادات A4
==================================================*/

${isA4 ? `

html,
body {
    width: 210mm;
    height: 297mm;
    overflow: hidden;
}

.sheet {
    position: absolute;

    width: 297mm;
    height: 210mm;

    left: 50%;
    top: 50%;

    transform:
        translate(-50%, -50%)
        rotate(90deg);

    transform-origin: center center;

    padding: 7mm;

    background: #fff;
    overflow: hidden;
}

.header {
    margin-bottom: 4mm;
    text-align: center;
}

.header h1 {
    margin: 0;
    font-size: 22px;
    font-weight: 900;
    line-height: 1.2;
}

.header h2 {
    margin: 1.5mm 0;
    font-size: 16px;
    font-weight: 800;
    line-height: 1.2;
}

.header .sub {
    font-size: 13px;
    font-weight: 700;
}

.info {
    display: flex;
    justify-content: space-between;
    align-items: center;

    border-top: 1.5px solid #000;
    border-bottom: 1.5px solid #000;

    padding: 2mm 3mm;
    margin-bottom: 3mm;

    font-size: 11px;
    font-weight: 800;
}

table {
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed;
    margin: 0;
}

th,
td {
    border: 1px solid #000;

    text-align: center;
    vertical-align: middle;

    padding: 1px;

    font-size: 7.5px;
    line-height: 1.1;

    overflow: hidden;
}

thead th {
    background: #eee;
    font-weight: 900;
    height: 10mm;
}

.driver {
    width: 62px;
    min-width: 62px;
    max-width: 62px;

    font-size: 9px;
    font-weight: 900;

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.day {
    width: auto;
    font-size: 7px;
    padding: 1px;
}

.day div {
    height: 8px;
    line-height: 8px;

    white-space: nowrap;
    overflow: hidden;
}

.total {
    width: 55px;
    min-width: 55px;
    max-width: 55px;

    background: #fafafa;

    font-size: 8px;
    font-weight: 900;
}

tfoot td {
    background: #e8e8e8;
    font-size: 9px;
    font-weight: 900;
    height: 9mm;
}

.summary {
    width: 100%;

    display: flex;
    flex-direction: row;

    justify-content: center;
    align-items: stretch;

    gap: 7mm;
    margin-top: 5mm;
}

.summary-box {
    flex: 1;

    border: 2px solid #000;

    padding: 3.5mm 3mm;

    text-align: center;

    font-size: 16px;
    font-weight: 900;
    line-height: 1.2;

    min-height: 22mm;
}

.summary-title {
    display: block;
    margin-bottom: 2mm;

    font-size: 11px;
    font-weight: 900;
}

.summary-box.final {
    font-size: 18px;
    border-width: 2.5px;
}

@media print {

    @page {
        size: A4 portrait;
        margin: 0;
    }

    html,
    body {
        width: 210mm;
        height: 297mm;

        margin: 0;
        padding: 0;

        overflow: hidden;
    }

    .sheet {
        width: 297mm;
        height: 210mm;
    }
}

` : `

/*==================================================
    إعداد الطابعة الحرارية 80mm
    التقرير مدوّر 90 درجة
==================================================*/

html,
body {
    width: 80mm;
    margin: 0;
    padding: 0;
}

.sheet {
    width: 80mm;

    padding: 2mm;

    background: #fff;

    overflow: visible;

    transform: rotate(90deg);
    transform-origin: top left;

    margin-left: 80mm;
    margin-top: 0;
}

.header {
    text-align: center;
    margin-bottom: 3mm;
}

.header h1 {
    margin: 0;
    font-size: 13px;
    font-weight: 900;
}

.header h2 {
    margin: 1mm 0;
    font-size: 11px;
    font-weight: 800;
}

.header h3 {
    margin: 0;
    font-size: 10px;
    font-weight: 700;
}

table {
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed;
}

th,
td {
    border: 1px solid #000;

    text-align: center;
    vertical-align: middle;

    padding: 1px;

    font-size: 5px;
    line-height: 1.1;

    overflow: hidden;
}

thead th {
    font-weight: 900;
    background: #eee;
}

.driver {
    width: 35px;
    min-width: 35px;
    max-width: 35px;

    font-size: 6px;
    font-weight: 900;

    white-space: nowrap;
    overflow: hidden;
}

.day {
    font-size: 5px;
    padding: 1px;
}

.day div {
    height: 6px;
    line-height: 6px;
    white-space: nowrap;
}

.sum {
    width: 35px;
    min-width: 35px;
    max-width: 35px;

    font-size: 6px;
    font-weight: 900;

    background: #f5f5f5;
}

tfoot td {
    font-size: 6px;
    font-weight: 900;
    background: #e5e5e5;
}

.summary {
    width: 100%;

    margin-top: 4mm;

    border-top: 2px solid #000;
    padding-top: 2mm;
}

.summary-row {
    display: flex;

    justify-content: space-between;
    align-items: center;

    border-bottom: 1px solid #000;

    padding: 2mm 1mm;

    font-size: 8px;
    font-weight: 900;
}

.summary-row.final {
    border-top: 2px solid #000;

    font-size: 10px;
    padding-top: 3mm;
}

@media print {

    html,
    body {
        width: 80mm;
        margin: 0;
        padding: 0;
    }

    .sheet {
        width: 80mm;
    }
}

`}

</style>

</head>

<body>

<div class="sheet">

<div class="header">

    <h1>
        مطاعم ومطابخ سحايب ديرتي
    </h1>

    <h2>
        كشف نسبة السواقين الشهري
    </h2>

    ${isA4
        ? `<div class="sub">السنة: ${data.year}</div>`
        : `<h3>${esc(data.monthName)} - ${data.year}</h3>`
    }

</div>

${isA4 ? `
<div class="info">

    <div>
        الشهر: ${esc(data.monthName)}
    </div>

    <div>
        عدد السائقين: ${data.drivers.length}
    </div>

</div>
` : ""}

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

        for (
            let day = 1;
            day <= data.daysInMonth;
            day++
        ) {

            html += `
                <th class="day">${day}</th>
            `;

        }


        html += isA4
            ? `
                <th class="total">🥩<br>الذبائح</th>
                <th class="total">🛵<br>التوصيل</th>
                <th class="total">💰<br>الإجمالي</th>
              </tr>
              </thead>
              <tbody>
              `
            : `
                <th class="sum">🥩<br>ذبائح</th>
                <th class="sum">🛵<br>توصيل</th>
                <th class="sum">💰<br>الإجمالي</th>
              </tr>
              </thead>
              <tbody>
              `;


        /*==================================================
            بيانات السائقين
        ==================================================*/

        data.drivers.forEach(driver => {

            let meatTotal = 0;
            let ordersTotal = 0;

            html += `
                <tr>
                    <td class="driver">
                        ${esc(driver.name)}
                    </td>
            `;

            for (
                let day = 0;
                day < data.daysInMonth;
                day++
            ) {

                const dayData =
                    (driver.days && driver.days[day]) || {};

                const meat =
                    Number(dayData.meat || 0);

                const orders =
                    Number(dayData.orders || 0);

                meatTotal +=
                    Number.isFinite(meat) ? meat : 0;

                ordersTotal +=
                    Number.isFinite(orders) ? orders : 0;

                html += `
                    <td class="day">
                        <div>
                            ${meat ? "ذ:" + esc(meat) : ""}
                        </div>

                        <div>
                            ${orders ? "ط:" + esc(orders) : ""}
                        </div>
                    </td>
                `;

            }

            totalMeatAll += meatTotal;
            totalOrdersAll += ordersTotal;

            const totalClass =
                isA4 ? "total" : "sum";

            html += `
                <td class="${totalClass}">
                    ${meatTotal.toFixed(2)}
                </td>

                <td class="${totalClass}">
                    ${ordersTotal.toFixed(2)}
                </td>

                <td class="${totalClass}">
                    ${(meatTotal + ordersTotal).toFixed(2)}
                </td>

                </tr>
            `;

        });


        /*==================================================
            الإجمالي العام
        ==================================================*/

        const grandTotal =
            totalMeatAll + totalOrdersAll;

        const totalClass =
            isA4 ? "total" : "sum";

        html += `
            <tr>
                <td class="${isA4 ? "driver" : "sum"}">
                    الإجمالي العام
                </td>
        `;

        for (
            let day = 1;
            day <= data.daysInMonth;
            day++
        ) {

            html += `
                <td class="day">
                    ${isA4 ? "" : "-"}
                </td>
            `;

        }

        html += `
            <td class="${totalClass}">
                ${totalMeatAll.toFixed(2)}
            </td>

            <td class="${totalClass}">
                ${totalOrdersAll.toFixed(2)}
            </td>

            <td class="${totalClass}">
                ${grandTotal.toFixed(2)}
            </td>

            </tr>

            </tbody>

            </table>
        `;


        /*==================================================
            الملخص النهائي
        ==================================================*/

        if (isA4) {

            html += `
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
            `;

        } else {

            html += `
                <div class="summary">

                    <div class="summary-row">
                        <span>🥩 إجمالي الذبائح</span>
                        <span>${totalMeatAll.toFixed(2)}</span>
                    </div>

                    <div class="summary-row">
                        <span>🛵 إجمالي التوصيل</span>
                        <span>${totalOrdersAll.toFixed(2)}</span>
                    </div>

                    <div class="summary-row final">
                        <span>💰 الإجمالي النهائي</span>
                        <span>${grandTotal.toFixed(2)}</span>
                    </div>

                </div>
            `;

        }


        /*==================================================
            الطباعة التلقائية
            استدعاء واحد فقط
        ==================================================*/

        html += `
            </div>

            <script>

            (function() {

                let didPrint = false;

                function startPrint() {

                    if (didPrint) return;

                    didPrint = true;

                    setTimeout(function() {

                        window.focus();
                        window.print();

                    }, 700);

                }

                if (document.readyState === "complete") {

                    startPrint();

                } else {

                    window.addEventListener(
                        "load",
                        startPrint,
                        { once: true }
                    );

                }

                window.onafterprint = function() {

                    setTimeout(function() {
                        window.close();
                    }, 300);

                };

            })();

            <\/script>

            </body>
            </html>
        `;

        return html;

    }


    /*==================================================
        فتح نافذة الطباعة
    ==================================================*/

    function openPrintWindow(mode) {

        const data = getReportData();

        if (!data) return;

        const win = window.open("", "_blank");

        if (!win) {

            alert(
                "يرجى السماح بفتح النوافذ المنبثقة للطباعة."
            );

            return;

        }

        win.document.open();

        win.document.write(
            buildReport(data, mode)
        );

        win.document.close();

    }


    /*==================================================
        طباعة A4
    ==================================================*/

    function printA4() {

        openPrintWindow("a4");

    }


    /*==================================================
        طباعة حرارية 80mm
    ==================================================*/

    function print80() {

        openPrintWindow("80");

    }


    /*==================================================
        إتاحة الدوال للاستدعاء الخارجي
    ==================================================*/

    window.printA4 = printA4;
    window.print80 = print80;

})();
