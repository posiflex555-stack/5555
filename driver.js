/*==================================================
        Driver.js V2
        مطاعم ومطابخ سحايب ديرتي
==================================================*/

//==============================
// عناصر الصفحة
//==============================

const driverTitle = document.getElementById("driverTitle");
const invoiceDate = document.getElementById("invoiceDate");
const invoiceNumber = document.getElementById("invoiceNumber");

const grandTotal = document.getElementById("grandTotal");
const bottomGrandTotal = document.getElementById("bottomGrandTotal");

const notesInput = document.getElementById("invoiceNotes");

const chickenSection = document.getElementById("chickenSection");
const edamatSection = document.getElementById("edamatSection");
const drinksSection = document.getElementById("drinksSection");
const startersSection = document.getElementById("startersSection");

const saveBtn = document.getElementById("saveInvoiceBtn");
const whatsappBtn = document.getElementById("whatsappBtn");
const printBtn = document.getElementById("printInvoiceBtn");
const clearBtn = document.getElementById("clearInvoiceBtn");
const checkoutBtn = document.getElementById("checkoutBtn");
const historyBtn = document.getElementById("historyBtn");
const toast = document.getElementById("saveToast");
const loadingScreen = document.getElementById("loadingScreen");

//==============================
// متغيرات الفاتورة
//==============================

let currentDriver = null;

let invoiceItems = [];

let invoiceTotal = 0;

//==============================
// تحميل السائق الحالي
//==============================
function loadCurrentDriver(){

    const id = Number(localStorage.getItem("current_driver_id"));

    if(!id){

        alert("لم يتم اختيار سائق.");

        location.href = "index.html";

        return;

    }

    const drivers = loadStorage(
        STORAGE_KEYS.drivers,
        []
    );

    currentDriver = drivers.find(driver => driver.id === id);

    if(!currentDriver){

        alert("السائق غير موجود.");

        location.href = "index.html";

        return;

    }

    driverTitle.textContent = currentDriver.name;

    invoiceDate.textContent = currentDateTime();

    const savedInvoice = loadStorage(
    "invoice_" + currentDriver.id,
    null
);

if (savedInvoice && savedInvoice.invoiceNumber) {

    invoiceNumber.textContent = savedInvoice.invoiceNumber;

} else {

    invoiceNumber.textContent = generateInvoiceNumber();

}
}
/*==================================================
        إنشاء أصناف المنيو
==================================================*/

function renderMenu() {

    renderSection(chickenSection, MENU.chicken);
    renderSection(edamatSection, MENU.edamat);
    renderSection(drinksSection, MENU.drinks);
    renderSection(startersSection, MENU.starters);

}

function renderSection(container, items) {

    container.innerHTML = "";

    items.forEach(item => {

        const row = document.createElement("div");

        row.className = "menu-item";

        row.innerHTML = `

        <div class="item-info">

            <div class="item-name">
                ${item.name}
            </div>

            <div class="item-price">
                ${formatPrice(item.price)}
            </div>

        </div>

        <div class="item-qty">

            <input
                type="number"
                min="0"
                value="0"
                class="qty-input"
                data-id="${item.id}"
                data-name="${item.name}"
                data-price="${item.price}"
            >

        </div>

        `;

        container.appendChild(row);

    });

}
/*==================================================
        متابعة تغيير الكميات
==================================================*/

function bindQuantityEvents(){

    document.querySelectorAll(".qty-input").forEach(input=>{

        input.addEventListener("input",updateInvoice);

    });

}
/*==================================================
        تحديث الفاتورة والإجمالي
==================================================*/

function updateInvoice() {

    invoiceItems = [];

    invoiceTotal = 0;

    document.querySelectorAll(".qty-input").forEach(input => {

        const qty = Number(input.value) || 0;

        if (qty <= 0) return;

        const price = Number(input.dataset.price);

        const total = qty * price;

        invoiceItems.push({
            id: input.dataset.id,
            name: input.dataset.name,
            qty: qty,
            price: price,
            total: total
        });

        invoiceTotal += total;

    });

    grandTotal.textContent = formatPrice(invoiceTotal);
    bottomGrandTotal.textContent = formatPrice(invoiceTotal);

    autoSave();

}
/*==================================================
        الحفظ التلقائي
==================================================*/

function autoSave() {

    if (!currentDriver) return;

    const invoiceData = {

        invoiceNumber: invoiceNumber.textContent,

        date: invoiceDate.textContent,

        notes: notesInput.value,

        items: invoiceItems,

        total: invoiceTotal

    };

    let invoices = loadStorage(
        "invoices_" + currentDriver.id,
        []
    );

    const index = invoices.findIndex(
        inv => inv.invoiceNumber === invoiceData.invoiceNumber
    );

    if (index >= 0) {

        invoices[index] = invoiceData;

    } else {

        invoices.push(invoiceData);

    }

    saveStorage(
        "invoices_" + currentDriver.id,
        invoices
    );

}
/*==================================================
        استرجاع آخر فاتورة محفوظة
==================================================*/

function loadSavedInvoice() {

    if (!currentDriver) return;

    const invoices = loadStorage(
    "invoices_" + currentDriver.id,
    []
);

if (invoices.length === 0) return;

const invoice = invoices[invoices.length - 1];
    // الملاحظات
    notesInput.value = invoice.notes || "";

    // تعبئة الكميات
    if (Array.isArray(invoice.items)) {

        invoice.items.forEach(item => {

            const input = document.querySelector(
                `.qty-input[data-id="${item.id}"]`
            );

            if (input) {

                input.value = item.qty;

            }

        });

    }

    updateInvoice();

}
/*==================================================
        حفظ يدوي
==================================================*/

saveBtn.addEventListener("click", () => {

    autoSave();

    toast.classList.add("show");

    setTimeout(() => {

        toast.classList.remove("show");

    }, 2000);

});

// حفظ الملاحظات مباشرة عند الكتابة
notesInput.addEventListener("input", autoSave);
/*==================================================
        إرسال الفاتورة عبر واتساب
==================================================*/

whatsappBtn.addEventListener("click", sendWhatsAppInvoice);

function sendWhatsAppInvoice() {

    if (!currentDriver) {
        alert("لم يتم اختيار السائق.");
        return;
    }

    if (invoiceItems.length === 0) {
        alert("الفاتورة فارغة.");
        return;
    }

    let message = "";

    message += "📄 " + APP.name + "\n";
    message += "━━━━━━━━━━━━━━━━━━\n";
    message += "👤 السائق : " + currentDriver.name + "\n";
    message += "🧾 رقم الفاتورة : " + invoiceNumber.textContent + "\n";
    message += "📅 التاريخ : " + invoiceDate.textContent + "\n";
    message += "━━━━━━━━━━━━━━━━━━\n\n";

    invoiceItems.forEach(item => {

        message += "• " + item.name + "\n";
        message += "الكمية : " + item.qty + "\n";
        message += "السعر : " + formatPrice(item.price) + "\n";
        message += "الإجمالي : " + formatPrice(item.total) + "\n\n";

    });

    message += "━━━━━━━━━━━━━━━━━━\n";

    if (notesInput.value.trim() !== "") {

        message += "📝 الملاحظات\n";
        message += notesInput.value.trim() + "\n";
        message += "━━━━━━━━━━━━━━━━━━\n";

    }

    message += "💰 إجمالي الفاتورة : ";
    message += formatPrice(invoiceTotal);

    let phone = currentDriver.phone.replace(/\D/g, "");

    if (phone.startsWith("0")) {
        phone = "966" + phone.substring(1);
    }

    if (!phone.startsWith("966")) {
        phone = "966" + phone;
    }

    window.open(
        "https://wa.me/" + phone + "?text=" + encodeURIComponent(message),
        "_blank"
    );

}
/*==================================================
        مسح الفاتورة
==================================================*/

clearBtn.addEventListener("click", clearInvoice);

function clearInvoice() {

    if (!confirm("هل تريد مسح الفاتورة؟")) {
        return;
    }

    document.querySelectorAll(".qty-input").forEach(input => {
        input.value = 0;
    });

    notesInput.value = "";

    invoiceItems = [];
    invoiceTotal = 0;

    grandTotal.textContent = formatPrice(0);
    bottomGrandTotal.textContent = formatPrice(0);

    localStorage.removeItem("invoice_" + currentDriver.id);

    toast.textContent = "🗑️ تم مسح الفاتورة";
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
        toast.textContent = "✅ تم حفظ الفاتورة";
    }, 2000);

}

/*==================================================
        طباعة الفاتورة
==================================================*/

printBtn.addEventListener("click", () => {

    window.print();

});

/*==================================================
        اعتماد الفاتورة
==================================================*/

checkoutBtn.addEventListener("click", () => {

    autoSave();

    const drivers = loadStorage(STORAGE_KEYS.drivers, []);

    const index = drivers.findIndex(
        d => d.id === currentDriver.id
    );

    if (index !== -1) {

        drivers[index].total = invoiceTotal;

        saveStorage(
            STORAGE_KEYS.drivers,
            drivers
        );

    }

    alert("تم اعتماد الفاتورة بنجاح.");
invoiceNumber.textContent = generateInvoiceNumber();

document.querySelectorAll(".qty-input").forEach(input => {
    input.value = 0;
});

notesInput.value = "";

invoiceItems = [];
invoiceTotal = 0;

grandTotal.textContent = formatPrice(0);
bottomGrandTotal.textContent = formatPrice(0);

});
/*==================================================
        الرجوع للرئيسية
==================================================*/

function goBack() {

    location.href = "index.html";

}

/*==================================================
        فتح وإغلاق الأقسام
==================================================*/

function toggleSection(element) {

    const section = element.nextElementSibling;

    document.querySelectorAll(".section-content").forEach(item => {

        if (item !== section) {

            item.style.display = "none";

        }

    });

    if (section.style.display === "block") {

        section.style.display = "none";

    } else {

        section.style.display = "block";

    }

}

/*==================================================
        تشغيل الصفحة
==================================================*/

window.addEventListener("load", () => {

    try {

        loadCurrentDriver();

        renderMenu();

        bindQuantityEvents();

        loadSavedInvoice();

    } catch (error) {

        console.error(error);

        alert("حدث خطأ أثناء تحميل الفاتورة.");

    }

    if (loadingScreen) {

        loadingScreen.style.display = "none";

    }

});
