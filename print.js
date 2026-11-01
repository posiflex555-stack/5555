/*==================================================
   PRINT.JS V6
   مطاعم ومطابخ سحايب ديرتي
   إصلاح أزرار الطباعة
   A4 + حراري 80mm
==================================================*/

"use strict";

/*==================================================
   ربط أزرار الطباعة
==================================================*/

(function () {

    function connectPrintButtons() {

        const print80Btn = document.getElementById("print80Btn");
        const printA4Btn = document.getElementById("printA4Btn");

        if (print80Btn) {
            print80Btn.addEventListener("click", function () {
                printReport("80mm");
            });
        }

        if (printA4Btn) {
            printA4Btn.addEventListener("click", function () {
                printReport("A4");
            });
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", connectPrintButtons);
    } else {
        connectPrintButtons();
    }


    /*==================================================
       أدوات مساعدة
    ==================================================*/

    function escapeHTML(value) {
        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
    }


    function money(value) {
        return Number(value || 0).toFixed(2);
    }


    function getDrivers() {

        /*
          قراءة متغير السائقين الموجود في script.js
          سواء كان معرفًا باستخدام let أو const أو var.
        */

        if (typeof drivers !== "undefined" && Array.isArray(drivers)) {
            return drivers;
        }

        if (Array.isArray(window.drivers)) {
            return window.drivers;
        }

        return [];
    }


    /*==================================================
       تجهيز بيانات التقرير
    ==================================================*/

    function getReportData() {

        const monthSelect = document.getElementById("month");
        const yearSelect = document.getElementById("year");

        if (!monthSelect || !yearSelect) {
            alert("تعذر العثور على اختيار الشهر أو السنة.");
            return null;
        }

        const monthNumber = Number(monthSelect.value);
        const year = Number(yearSelect.value);

        if (!monthNumber || !year) {
            alert("يرجى تحديد الشهر والسنة أولًا.");
            return null;
        }

        const monthName =
            monthSelect.options[monthSelect.selectedIndex].text;

        const daysInMonth = new Date(year, monthNumber, 0).getDate();

        const allDrivers = getDrivers();

        let totalMeatAll = 0;
        let totalOrdersAll = 0;

        const driverRows = allDrivers.map(function (driver) {

            let meatTotal = 0;
            let ordersTotal = 0;

            const dailyCells = [];

            for (let day = 0; day < daysInMonth; day++) {

                const data =
                    driver.days && driver.days[day]
                        ? driver.days[day]
                        : {};

                const meat = Number(data.meat || 0);
                const orders = Number(data.orders || 0);

                meatTotal += meat;
                ordersTotal += orders;

                dailyCells.push({
                    meat: meat,
                    orders: orders
                });
            }

            totalMeatAll += meatTotal;
            totalOrdersAll += ordersTotal;

            return {
                name: driver.name || "بدون اسم",
                dailyCells: dailyCells,
                meatTotal: meatTotal,
                ordersTotal: ordersTotal,
                grandTotal: meatTotal + ordersTotal
            };
        });

        return {
            monthName: monthName,
            monthNumber: monthNumber,
            year: year,
            daysInMonth: daysInMonth,
            drivers: driverRows,
            totalMeatAll: totalMeatAll,
            totalOrdersAll: totalOrdersAll,
            grandTotal: totalMeatAll + totalOrdersAll
        };
    }


    /*==================================================
       إنشاء خلايا أيام الشهر
    ==================================================*/

    function buildDayHeaders(data) {

        let html = "";

        for (let day = 1; day <= data.daysInMonth; day++) {
            html += `<th class="day">${day}</th>`;
        }

        return html;
    }


    /*==================================================
       إنشاء صفوف السائقين
    ==================================================*/

    function buildDriverRows(data) {

        let html = "";

        data.drivers.forEach(function (driver) {

            html += `
                <tr>
                    <td class="driver">
                        ${escapeHTML(driver.name)}
                    </td>
            `;

            driver.dailyCells.forEach(function (cell) {

                html += `
                    <td class="day">
                        <div>${cell.meat ? "ذ:" + money(cell.meat) : ""}</div>
                        <div>${cell.orders ? "ط:" + money(cell.orders) : ""}</div>
                    </td>
                `;
            });

            html += `
                    <td class="total">
                        ${money(driver.meatTotal)}
                    </td>

                    <td class="total">
                        ${money(driver.ordersTotal)}
                    </td>

                    <td class="total">
                        ${money(driver.grandTotal)}
                    </td>
                </tr>
            `;
        });

        return html;
    }


    /*==================================================
       صف الإجمالي العام
    ==================================================*/

    function buildGrandTotalRow(data) {

        let html = `
            <tr>
                <td class="driver">الإجمالي العام</td>
        `;

        for (let day = 1; day <= data.daysInMonth; day++) {
            html += `<td class="day"></td>`;
        }

        html += `
                <td class="total">${money(data.totalMeatAll)}</td>
                <td class="total">${money(data.totalOrdersAll)}</td>
                <td class="total">${money(data.grandTotal)}</td>
            </tr>
        `;

        return html;
    }


    /*==================================================
       ملخص الإجماليات
    ==================================================*/

    function buildSummary(data, mode) {

        if (mode === "A4") {

            return `
                <div class="summary">

                    <div class="summary-box">
                        <span class="summary-title">🥩 إجمالي الذبائح</span>
                        ${money(data.totalMeatAll)}
                    </div>

                    <div class="summary-box">
                        <span class="summary-title">🛵 إجمالي التوصيل</span>
                        ${money(data.totalOrdersAll)}
                    </div>

                    <div class="summary-box final">
                        <span class="summary-title">💰 الإجمالي النهائي</span>
                        ${money(data.grandTotal)}
                    </div>

                </div>
            `;
        }

        return `
            <div class="summary">

                <div class="summary-row">
                    <span>🥩 إجمالي الذبائح</span>
                    <span>${money(data.totalMeatAll)}</span>
                </div>

                <div class="summary-row">
                    <span>🛵 إجمالي التوصيل</span>
                    <span>${money(data.totalOrdersAll)}</span>
                </div>

                <div class="summary-row final">
                    <span>💰 الإجمالي النهائي</span>
                    <span>${money(data.grandTotal)}</span>
                </div>

            </div>
        `;
    }


    /*==================================================
       تنسيق A4
       الورقة بالطول والتقرير يدور 90 درجة
    ==================================================*/

    function getA4CSS() {

        return `
            @page {
                size: A4 portrait;
                margin: 0;
            }

            * {
                box-sizing: border-box;
            }

            html, body {
                width: 210mm;
                height: 297mm;
                margin: 0;
                padding: 0;
                overflow: hidden;
                background: #fff;
            }

            body {
                font-family: Tahoma, Arial, sans-serif;
                color: #000;
                direction: rtl;
            }

            .sheet {
                position: absolute;
                width: 297mm;
                height: 210mm;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%) rotate(90deg);
                transform-origin: center center;
                padding: 7mm;
                background: #fff;
                overflow: hidden;
            }

            .header {
                width: 100%;
                text-align: center;
                margin-bottom: 4mm;
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

            .header .year {
                font-size: 13px;
                font-weight: 700;
            }

            .info {
                width: 100%;
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
                max-width: 100%;
                border-collapse: collapse;
                table-layout: fixed;
                margin: 0;
            }

            th, td {
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
                html, body {
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
        `;
    }


    /*==================================================
       تنسيق الطابعة الحرارية 80mm
       التقرير يدور 90 درجة
    ==================================================*/

    function getThermalCSS() {

        return `
            @page {
                size: 80mm auto;
                margin: 0;
            }

            * {
                box-sizing: border-box;
            }

            html, body {
                margin: 0;
                padding: 0;
                width: 80mm;
                background: #fff;
            }

            body {
                font-family: Tahoma, Arial, sans-serif;
                direction: rtl;
                color: #000;
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

            .info {
                display: flex;
                justify-content: space-between;
                font-size: 7px;
                font-weight: 900;
                margin-bottom: 2mm;
            }

            table {
                width: 100%;
                border-collapse: collapse;
                table-layout: fixed;
            }

            th, td {
                border: 1px solid #000;
                text-align: center;
                vertical-align: middle;
                padding: 1px;
                font-size: 5px;
                line-height: 1.1;
                overflow: hidden;
            }

            thead th {
                background: #eee;
                font-weight: 900;
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
                overflow: hidden;
            }

            .total {
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
                html, body {
                    width: 80mm;
                    margin: 0;
                    padding: 0;
                }

                .sheet {
                    width: 80mm;
                }
            }
        `;
    }


    /*==================================================
       إنشاء صفحة التقرير
    ==================================================*/

    function buildReportHTML(data, mode) {

        const css =
            mode === "A4"
                ? getA4CSS()
                : getThermalCSS();

        const tableBody = buildDriverRows(data);
        const totalRow = buildGrandTotalRow(data);
        const summary = buildSummary(data, mode);

        return `
<!DOCTYPE html>
<html lang="ar" dir="rtl">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>كشف السواقين الشهري - ديرتي</title>

    <style>
        ${css}
    </style>
</head>

<body>

    <div class="sheet">

        <div class="header">
            <h1>مطاعم ومطابخ سحايب ديرتي</h1>
            <h2>كشف نسبة السواقين الشهري</h2>
            ${
                mode === "A4"
                    ? `<div class="year">السنة : ${data.year}</div>`
                    : `<h3>${escapeHTML(data.monthName)} - ${data.year}</h3>`
            }
        </div>

        ${
            mode === "A4"
                ? `
                    <div class="info">
                        <div>الشهر : ${escapeHTML(data.monthName)}</div>
                        <div>عدد السواقين : ${data.drivers.length}</div>
                    </div>
                `
                : `
                    <div class="info">
                        <span>الشهر: ${escapeHTML(data.monthName)}</span>
                        <span>السائقون: ${data.drivers.length}</span>
                    </div>
                `
        }

        <table>
            <thead>
                <tr>
                    <th class="driver">السائق</th>

                    ${buildDayHeaders(data)}

                    <th class="total">
                        🥩<br>الذبائح
                    </th>

                    <th class="total">
                        🛵<br>التوصيل
                    </th>

                    <th class="total">
                        💰<br>الإجمالي
                    </th>
                </tr>
            </thead>

            <tbody>
                ${tableBody}
            </tbody>

            <tfoot>
                ${totalRow}
            </tfoot>
        </table>

        ${summary}

    </div>

    <script>
        window.onload = function () {
            setTimeout(function () {
                window.focus();
                window.print();
            }, 700);
        };

        window.onafterprint = function () {
            setTimeout(function () {
                window.close();
            }, 300);
        };
    <\/script>

</body>
</html>
        `;
    }


    /*==================================================
       تشغيل الطباعة
    ==================================================*/

    function printReport(mode) {

        try {

            const data = getReportData();

            if (!data) {
                return;
            }

            const printWindow = window.open("", "_blank");

            if (!printWindow) {
                alert(
                    "تعذر فتح صفحة الطباعة. يرجى السماح بالنوافذ المنبثقة للتطبيق."
                );
                return;
            }

            const html = buildReportHTML(data, mode);

            printWindow.document.open();
            printWindow.document.write(html);
            printWindow.document.close();

            /*
              لا نستدعي printWindow.print() هنا؛
              لأن صفحة التقرير تستدعي الطباعة بنفسها
              عند اكتمال التحميل، لمنع ظهور نافذتي طباعة.
            */

        } catch (error) {

            console.error("خطأ في الطباعة:", error);

            alert(
                "حدث خطأ أثناء تجهيز التقرير للطباعة. راجع وحدة التحكم لمعرفة التفاصيل."
            );
        }
    }

})();
