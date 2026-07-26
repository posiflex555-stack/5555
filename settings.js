/*==================================================
        Settings.js V2
        مطاعم ومطابخ سحايب ديرتي
==================================================*/

//==============================
// عناصر الصفحة
//==============================

const restaurantName =
document.getElementById("restaurantName");

const cashierPhone =
document.getElementById("cashierPhone");

const currency =
document.getElementById("currency");

const logoInput =
document.getElementById("logoInput");

const logoPreview =
document.getElementById("logoPreview");

const saveSettingsBtn =
document.getElementById("saveSettingsBtn");

const menuCategory =
document.getElementById("menuCategory");

const menuItemsList =
document.getElementById("menuItemsList");

const itemModal =
document.getElementById("itemModal");

const itemModalTitle =
document.getElementById("itemModalTitle");

const itemName =
document.getElementById("itemName");

const itemPrice =
document.getElementById("itemPrice");

const saveItemBtn =
document.getElementById("saveItemBtn");

const cancelItemBtn =
document.getElementById("cancelItemBtn");

const deleteItemModal =
document.getElementById("deleteItemModal");

const confirmDeleteItemBtn =
document.getElementById("confirmDeleteItemBtn");

const cancelDeleteItemBtn =
document.getElementById("cancelDeleteItemBtn");

const addItemBtn =
document.getElementById("addItemBtn");

const settingsToast =
document.getElementById("settingsToast");

const loadingScreen =
document.getElementById("loadingScreen");

//==============================
// متغيرات
//==============================

let settings =
loadStorage(
STORAGE_KEYS.settings,
DEFAULT_SETTINGS
);

let editingCategory = "";

let editingIndex = -1;

let deletingIndex = -1;
/*==================================================
        تحميل بيانات المطعم
==================================================*/

function loadSettings() {

    restaurantName.value = settings.restaurantName || "";

    cashierPhone.value = settings.cashierPhone || "";

    currency.value = settings.currency || "ر.س";

    if (settings.logo) {

        logoPreview.src = settings.logo;
        logoPreview.style.display = "block";

    } else {

        logoPreview.style.display = "none";

    }

}

/*==================================================
        حفظ بيانات المطعم
==================================================*/

saveSettingsBtn.addEventListener("click", () => {

    settings.restaurantName = restaurantName.value.trim();

    settings.cashierPhone = cashierPhone.value.trim();

    settings.currency = currency.value;

    saveStorage(
        STORAGE_KEYS.settings,
        settings
    );

    settingsToast.classList.add("show");

    setTimeout(() => {

        settingsToast.classList.remove("show");

    }, 2000);

});
/*==================================================
        رفع شعار المطعم
==================================================*/

logoInput.addEventListener("change", function () {

    const file = this.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (e) {

        settings.logo = e.target.result;

        logoPreview.src = settings.logo;

        logoPreview.style.display = "block";

        saveStorage(
            STORAGE_KEYS.settings,
            settings
        );

    };

    reader.readAsDataURL(file);

});
/*==================================================
        عرض أصناف المنيو
==================================================*/

function renderMenuItems() {

    const category = menuCategory.value;

    menuItemsList.innerHTML = "";

    const items = MENU[category] || [];

    if (items.length === 0) {

        menuItemsList.innerHTML = `
            <div class="empty">
                لا توجد أصناف
            </div>
        `;

        return;

    }

    items.forEach((item, index) => {

        const card = document.createElement("div");

        card.className = "menu-item-card";

        card.innerHTML = `

            <div class="item-info">

                <strong>${item.name}</strong>

                <span>${formatPrice(item.price)}</span>

            </div>

            <div class="item-actions">

                <button
                    class="green-btn"
                    onclick="editItem(${index})">

                    ✏️ تعديل

                </button>

                <button
                    class="danger-btn"
                    onclick="deleteItem(${index})">

                    🗑 حذف

                </button>

            </div>

        `;

        menuItemsList.appendChild(card);

    });

}
/*==================================================
        تغيير القسم
==================================================*/

menuCategory.addEventListener("change", renderMenuItems);

/*==================================================
        إضافة صنف جديد
==================================================*/

addItemBtn.addEventListener("click", () => {

    editingIndex = -1;

    itemModalTitle.textContent = "إضافة صنف جديد";

    itemName.value = "";

    itemPrice.value = "";

    itemModal.classList.add("active");

});

/*==================================================
        تعديل صنف
==================================================*/

function editItem(index) {

    editingIndex = index;

    editingCategory = menuCategory.value;

    const item = MENU[editingCategory][index];

    itemModalTitle.textContent = "تعديل الصنف";

    itemName.value = item.name;

    itemPrice.value = item.price;

    itemModal.classList.add("active");

}
/*==================================================
        حفظ الصنف (إضافة / تعديل)
==================================================*/

saveItemBtn.addEventListener("click", saveMenuItem);

function saveMenuItem() {

    const category = menuCategory.value;

    const name = itemName.value.trim();

    const price = Number(itemPrice.value);

    if (name === "") {

        alert("يرجى إدخال اسم الصنف");

        return;

    }

    if (isNaN(price) || price < 0) {

        alert("يرجى إدخال سعر صحيح");

        return;

    }

    const item = {

        id: Date.now().toString(),

        name: name,

        price: price

    };

    if (editingIndex === -1) {

        MENU[category].push(item);

    } else {

        MENU[category][editingIndex].name = name;

        MENU[category][editingIndex].price = price;

    }

    saveStorage("menu_data", MENU);

    renderMenuItems();

    itemModal.classList.remove("active");

    settingsToast.classList.add("show");

    setTimeout(() => {

        settingsToast.classList.remove("show");

    }, 2000);

}
/*==================================================
        حذف صنف
==================================================*/

function deleteItem(index) {

    deletingIndex = index;

    deleteItemModal.classList.add("active");

}

confirmDeleteItemBtn.addEventListener("click", () => {

    if (deletingIndex === -1) return;

    const category = menuCategory.value;

    MENU[category].splice(deletingIndex, 1);

    saveStorage("menu_data", MENU);

    renderMenuItems();

    deletingIndex = -1;

    deleteItemModal.classList.remove("active");

});

cancelDeleteItemBtn.addEventListener("click", () => {

    deletingIndex = -1;

    deleteItemModal.classList.remove("active");

});

cancelItemBtn.addEventListener("click", () => {

    itemModal.classList.remove("active");

});
/*==================================================
        تحميل المنيو المحفوظ
==================================================*/

const savedMenu = loadStorage("menu_data", null);

if (savedMenu) {

    Object.keys(savedMenu).forEach(category => {

        if (MENU[category]) {

            MENU[category] = savedMenu[category];

        }

    });

}

/*==================================================
        إغلاق النوافذ
==================================================*/

window.addEventListener("click", (e) => {

    if (e.target === itemModal) {

        itemModal.classList.remove("active");

    }

    if (e.target === deleteItemModal) {

        deleteItemModal.classList.remove("active");

    }

});

/*==================================================
        تشغيل الصفحة
==================================================*/

window.addEventListener("load", () => {

    try {

        loadSettings();

        renderMenuItems();

    } catch (error) {

        console.error(error);

        alert("حدث خطأ أثناء تحميل الإعدادات.");

    }

    if (loadingScreen) {

        loadingScreen.style.display = "none";

    }

});
