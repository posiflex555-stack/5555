const historyList = document.getElementById("historyList");
const driverName = document.getElementById("driverName");

const driverId = Number(localStorage.getItem("current_driver_id"));

const drivers = loadStorage(STORAGE_KEYS.drivers, []);
const currentDriver = drivers.find(d => d.id === driverId);

if(currentDriver){
    driverName.textContent = currentDriver.name;
}

const invoices = loadStorage(
    "invoices_" + driverId,
    []
);

if(invoices.length === 0){

    historyList.innerHTML = `
        <div class="empty">
            لا توجد فواتير
        </div>
    `;

}else{

    invoices.sort((a,b)=>b.invoiceNumber-a.invoiceNumber);

    invoices.forEach(invoice=>{

        const card = document.createElement("div");

        card.className = "driver-card";

        card.innerHTML = `
            <div class="driver-name">
                🧾 فاتورة رقم ${invoice.invoiceNumber}
            </div>

            <div class="driver-phone">
                📅 ${invoice.date}
            </div>

            <div class="driver-phone">
                💰 ${formatPrice(invoice.total)}
            </div>

            <div class="driver-actions">

                <button class="primary-btn">
                    📂 فتح الفاتورة
                </button>

            </div>
        `;

        historyList.appendChild(card);

    });

}
