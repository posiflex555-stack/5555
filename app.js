const STORAGE_KEY = "deerty_drivers_settlement_v2";

const defaultData = {
  businessName: "مطاعم ومطابخ سحايب ديرتي",
  date: new Date().toISOString().slice(0,10),

  drivers: [
    { name:"فؤاد", account:"", extra:"", network:"", fuel:"", apartments:"", expense:"" },
    { name:"الجابر", account:"", extra:"", network:"", fuel:"", apartments:"", expense:"" },
    { name:"مجاهد", account:"", extra:"", network:"", fuel:"", apartments:"", expense:"" }
  ],

  debts: [],

  income: {
    cashIncome:"",
    networkIncome:"",
    appsIncome:"",
    deliveryExpense:"",
    debtOne:"",
    debtTwo:""
  }
};

let data = loadData();

function loadData(){
  try{
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return saved || structuredClone(defaultData);
  }catch(e){
    return structuredClone(defaultData);
  }
}

function saveData(){
  data.businessName =
    document.getElementById("businessName")?.innerText.trim()
    || defaultData.businessName;

  data.date =
    document.getElementById("settlementDate")?.value
    || defaultData.date;

  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function num(v){
  return parseFloat(v) || 0;
}

function money(v){
  return num(v).toFixed(2);
}

function showValue(v){
  return num(v) === 0 ? "" : v;
}

function escapeHtml(str){
  return String(str).replace(/[&<>"']/g, s => ({
    '&':'&amp;',
    '<':'&lt;',
    '>':'&gt;',
    '"':'&quot;',
    "'":'&#39;'
  }[s]));
}

function render(){
  document.getElementById("businessName").innerText =
    data.businessName || defaultData.businessName;

  document.getElementById("settlementDate").value =
    data.date || defaultData.date;

  renderDrivers();
  renderDebts();
  renderIncome();
  updateTotals();
  saveData();
}

function renderDrivers(){
  const body = document.getElementById("driversBody");
  body.innerHTML = "";

  data.drivers.forEach((d,i)=>{
    const net =
      num(d.account)
      + num(d.extra)
      - num(d.network)
      - num(d.fuel)
      - num(d.apartments)
      - num(d.expense);

    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>
        <input class="nameInput" value="${escapeHtml(d.name)}"
          oninput="updateField(${i}, 'name', this.value)">
      </td>

      <td>
        <input type="text" inputmode="decimal" value="${showValue(d.account)}"
          oninput="updateField(${i}, 'account', this.value)">
      </td>

      <td>
        <input type="text" inputmode="decimal" value="${showValue(d.extra)}"
          oninput="updateField(${i}, 'extra', this.value)">
      </td>

      <td>
        <input type="text" inputmode="decimal" value="${showValue(d.network)}"
          oninput="updateField(${i}, 'network', this.value)">
      </td>

      <td>
        <input type="text" inputmode="decimal" value="${showValue(d.fuel)}"
          oninput="updateField(${i}, 'fuel', this.value)">
      </td>

      <td>
        <input type="text" inputmode="decimal" value="${showValue(d.apartments)}"
          oninput="updateField(${i}, 'apartments', this.value)">
      </td>

      <td>
        <input type="text" inputmode="decimal" value="${showValue(d.expense)}"
          oninput="updateField(${i}, 'expense', this.value)">
      </td>

      <td class="netCell ${net >= 0 ? 'positive' : 'negative'}"
        style="color:${net >= 0 ? '#166534' : '#b91c1c'};background:${net >= 0 ? '#ecfdf5' : '#fef2f2'};">
        ${Math.abs(net).toFixed(2)}
        <div class="netLabel">
          ${net > 0 ? 'للمطعم' : net < 0 ? 'للسواق' : 'متوازن'}
        </div>
      </td>

      <td class="no-print">
        <button class="iconBtn deleteBtn" onclick="deleteDriver(${i})">حذف</button>
      </td>
    `;

    body.appendChild(tr);
  });
}

function updateField(i, field, value){
  if(field === "name"){
    data.drivers[i][field] = value;
  }else{
    data.drivers[i][field] = value.trim();
  }

  updateTotals();
  updateDriverNet(i);
  saveData();
}

function updateDriverNet(i){
  const d = data.drivers[i];

  const currentNet =
    num(d.account)
    + num(d.extra)
    - num(d.network)
    - num(d.fuel)
    - num(d.apartments)
    - num(d.expense);

  const netCell = document.querySelectorAll(".netCell")[i];

  if(!netCell) return;

  if(currentNet >= 0){
    netCell.className = "netCell positive";
    netCell.style.color = "#166534";
    netCell.style.backgroundColor = "#ecfdf5";
  }else{
    netCell.className = "netCell negative";
    netCell.style.color = "#b91c1c";
    netCell.style.backgroundColor = "#fef2f2";
  }

  netCell.innerHTML = `
    ${Math.abs(currentNet).toFixed(2)}
    <div class="netLabel">
      ${currentNet > 0 ? 'للمطعم' : currentNet < 0 ? 'للسواق' : 'متوازن'}
    </div>
  `;
}

function addDriver(){
  const input = document.getElementById("driverName");
  const name = input.value.trim();

  if(!name){
    alert("اكتب اسم السواق أولاً");
    return;
  }

  data.drivers.push({
    name,
    account:"",
    extra:"",
    network:"",
    fuel:"",
    apartments:"",
    expense:""
  });

  input.value = "";
  render();
}

function deleteDriver(i){
  if(confirm("حذف هذا السواق؟")){
    data.drivers.splice(i,1);
    render();
  }
}

function resetDay(){
  if(!confirm("تصفير مبالغ اليوم مع بقاء أسماء السواقين؟")) return;

  data.drivers = data.drivers.map(d => ({
    ...d,
    account:"",
    extra:"",
    network:"",
    fuel:"",
    apartments:"",
    expense:""
  }));

  data.income = {
    cashIncome:"",
    networkIncome:"",
    appsIncome:"",
    deliveryExpense:"",
    debtOne:"",
    debtTwo:""
  };

  render();
}

function updateTotals(){
  const totals = data.drivers.reduce((a,d)=>{
    a.account += num(d.account);
    a.extra += num(d.extra);
    a.network += num(d.network);
    a.fuel += num(d.fuel);
    a.apartments += num(d.apartments);
    a.expense += num(d.expense);
    return a;
  },{
    account:0,
    extra:0,
    network:0,
    fuel:0,
    apartments:0,
    expense:0
  });

  const deductions =
    totals.network + totals.fuel + totals.apartments + totals.expense;

  const net =
    totals.account + totals.extra - deductions;

  document.getElementById("sumAccount").innerText = money(totals.account);
  document.getElementById("sumExtra").innerText = money(totals.extra);
  document.getElementById("sumDeductions").innerText = money(deductions);
  document.getElementById("sumNet").innerText = money(net);

  document.getElementById("tAccount").innerText = money(totals.account);
  document.getElementById("tExtra").innerText = money(totals.extra);
  document.getElementById("tNetwork").innerText = money(totals.network);
  document.getElementById("tFuel").innerText = money(totals.fuel);
  document.getElementById("tApartments").innerText = money(totals.apartments);
  document.getElementById("tExpense").innerText = money(totals.expense);
  document.getElementById("tNet").innerText = money(net);
}

/* ديون السواقين */

function addDebt(){
  const name = document.getElementById("debtDriver").value.trim();
  const amount = num(document.getElementById("debtAmount").value);

  if(!name || amount <= 0){
    alert("اكتب اسم السواق والمبلغ");
    return;
  }

  data.debts.push({ name, amount });

  document.getElementById("debtDriver").value = "";
  document.getElementById("debtAmount").value = "";

  renderDebts();
  saveData();
}

function deleteDebt(i){
  if(confirm("حذف الدين؟")){
    data.debts.splice(i,1);
    renderDebts();
    saveData();
  }
}

function renderDebts(){
  const body = document.getElementById("debtsBody");
  if(!body) return;

  body.innerHTML = "";

  let total = 0;

  data.debts.forEach((item,index)=>{
    total += num(item.amount);

    body.innerHTML += `
      <tr>
        <td>${escapeHtml(item.name)}</td>
        <td><input type="number" value="${item.amount}" onchange="updateDebt(${index}, this.value)"></td>
        <td class="no-print">
          <button onclick="deleteDebt(${index})">حذف</button>
        </td>
      </tr>
    `;
  });

  document.getElementById("debtsTotal").textContent = money(total);
}

/* إيراد التوصيل */

function saveIncome(){
  data.income = {
    cashIncome: document.getElementById("cashIncome").value.trim(),
    networkIncome: document.getElementById("networkIncome").value.trim(),
    appsIncome: document.getElementById("appsIncome").value.trim(),
    deliveryExpense: document.getElementById("deliveryExpense").value.trim(),
    debtOne: document.getElementById("debtOne").value.trim(),
    debtTwo: document.getElementById("debtTwo").value.trim()
  };

  renderIncomeTotal();
  saveData();
}

function renderIncome(){
  const ids = [
    "cashIncome",
    "networkIncome",
    "appsIncome",
    "deliveryExpense",
    "debtOne",
    "debtTwo"
  ];

  ids.forEach(id=>{
    const el = document.getElementById(id);
    if(el) el.value = data.income?.[id] || "";
  });

  renderIncomeTotal();
}

function renderIncomeTotal(){
  const income = data.income || {};

  const total =
    num(income.cashIncome)
    + num(income.networkIncome)
    + num(income.appsIncome)
    - num(income.deliveryExpense)
    - num(income.debtOne)
    - num(income.debtTwo);

  const box = document.getElementById("incomeTotal");
  if(box) box.textContent = money(total);
}

/* الطباعة الحرارية */

function printThermal(){
  document.body.classList.add("thermal-print");
  window.print();

  setTimeout(()=>{
    document.body.classList.remove("thermal-print");
  },500);
}

/* النسخة الاحتياطية */

function exportJSON(){
  saveData();

  const blob = new Blob(
    [JSON.stringify(data,null,2)],
    { type:"application/json" }
  );

  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "backup-drivers-settlement.json";
  a.click();
}

document.getElementById("importFile").addEventListener("change", async (e)=>{
  const file = e.target.files[0];
  if(!file) return;

  try{
    data = JSON.parse(await file.text());

    if(!data.debts) data.debts = [];
    if(!data.income){
      data.income = {
        cashIncome:"",
        networkIncome:"",
        appsIncome:"",
        deliveryExpense:"",
        debtOne:"",
        debtTwo:""
      };
    }

    render();
    alert("تم الاسترجاع بنجاح");
  }catch(err){
    alert("الملف غير صالح");
  }
});

document.getElementById("businessName").addEventListener("input", saveData);
document.getElementById("settlementDate").addEventListener("change", saveData);

if("serviceWorker" in navigator){
  window.addEventListener("load",()=>{
    navigator.serviceWorker.register("service-worker.js");
  });
}

render();
/* دالة طباعة الإيراد فقط */
function printIncomeOnly() {
  document.body.classList.add("print-income-only");
  window.print();
  setTimeout(() => {
    document.body.classList.remove("print-income-only");
  }, 500);
}
function updateDebt(index, newValue) {
  data.debts[index].amount = num(newValue);
  renderDebts();
  saveData();
}
