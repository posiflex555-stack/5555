<script>
// ====================== تسوية السواقين - الإصدار النهائي ======================
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
    cashIncome:"", networkIncome:"", appsIncome:"",
    deliveryExpense:"", debtOne:"", debtTwo:""
  }
};

let data = loadData();

function loadData(){
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : structuredClone(defaultData);
  } catch(e) {
    return structuredClone(defaultData);
  }
}

function saveData(){
  try {
    data.businessName = document.getElementById("businessName")?.innerText.trim() || defaultData.businessName;
    data.date = document.getElementById("settlementDate")?.value || defaultData.date;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch(e) {}
}

// ====================== دوال مساعدة ======================
function num(v){ return parseFloat(v) || 0; }
function money(v){ return num(v).toFixed(2); }
function showValue(v){ return num(v) === 0 ? "" : v; }

function escapeHtml(str){
  return String(str).replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s]));
}

// ====================== الرندر الرئيسي ======================
function render(){
  document.getElementById("businessName").innerText = data.businessName || defaultData.businessName;
  document.getElementById("settlementDate").value = data.date || defaultData.date;

  renderDrivers();
  renderDebts();
  renderIncome();
  updateAllTotals();
  saveData();
}

// ====================== السواقين ======================
function renderDrivers(){
  const body = document.getElementById("driversBody");
  if(!body) return;
  body.innerHTML = "";

  data.drivers.forEach((d, i) => {
    const net = calculateDriverNet(d);
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><input class="nameInput" value="\( {escapeHtml(d.name)}" oninput="updateField( \){i}, 'name', this.value)"></td>
      <td><input type="text" inputmode="decimal" value="\( {showValue(d.account)}" oninput="updateField( \){i}, 'account', this.value)"></td>
      <td><input type="text" inputmode="decimal" value="\( {showValue(d.extra)}" oninput="updateField( \){i}, 'extra', this.value)"></td>
      <td><input type="text" inputmode="decimal" value="\( {showValue(d.network)}" oninput="updateField( \){i}, 'network', this.value)"></td>
      <td><input type="text" inputmode="decimal" value="\( {showValue(d.fuel)}" oninput="updateField( \){i}, 'fuel', this.value)"></td>
      <td><input type="text" inputmode="decimal" value="\( {showValue(d.apartments)}" oninput="updateField( \){i}, 'apartments', this.value)"></td>
      <td><input type="text" inputmode="decimal" value="\( {showValue(d.expense)}" oninput="updateField( \){i}, 'expense', this.value)"></td>
      <td class="netCell \( {net >= 0 ? 'positive' : 'negative'}" style="color: \){net >= 0 ? '#166534' : '#b91c1c'};background:${net >= 0 ? '#ecfdf5' : '#fef2f2'};">
        ${Math.abs(net).toFixed(2)}
        <div class="netLabel">${net > 0 ? 'للمطعم' : net < 0 ? 'للسواق' : 'متوازن'}</div>
      </td>
      <td class="no-print"><button class="iconBtn deleteBtn" onclick="deleteDriver(${i})">حذف</button></td>
    `;
    body.appendChild(tr);
  });
}

function calculateDriverNet(d){
  return num(d.account) + num(d.extra) - num(d.network) - num(d.fuel) - num(d.apartments) - num(d.expense);
}

function updateField(i, field, value){
  if(field === "name") {
    data.drivers[i][field] = value;
  } else {
    data.drivers[i][field] = value.trim();
  }
  updateAllTotals();
  saveData();
}

function addDriver(){
  const input = document.getElementById("driverName");
  const name = input?.value.trim();
  if(!name) return alert("اكتب اسم السواق أولاً");
  
  data.drivers.push({ name, account:"", extra:"", network:"", fuel:"", apartments:"", expense:"" });
  input.value = "";
  render();
}

function deleteDriver(i){
  if(confirm("حذف هذا السواق؟")) {
    data.drivers.splice(i,1);
    render();
  }
}

// ====================== الديون ======================
function renderDebts(){
  const body = document.getElementById("debtsBody");
  if(!body) return;
  body.innerHTML = "";

  let total = 0;
  data.debts.forEach((item, index) => {
    total += num(item.amount);
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${escapeHtml(item.name)}</td>
      <td><input type="number" step="0.01" value="\( {item.amount}" onchange="updateDebt( \){index}, this.value)"></td>
      <td class="no-print"><button onclick="deleteDebt(${index})">حذف</button></td>
    `;
    body.appendChild(tr);
  });

  document.getElementById("debtsTotal").textContent = money(total);
}

function addDebt(){
  const name = document.getElementById("debtDriver").value.trim();
  const amount = num(document.getElementById("debtAmount").value);
  if(!name || amount <= 0) return alert("اكتب اسم السواق والمبلغ");

  data.debts.push({ name, amount });
  document.getElementById("debtDriver").value = "";
  document.getElementById("debtAmount").value = "";
  renderDebts();
  updateAllTotals();
  saveData();
}

function updateDebt(index, newValue){
  data.debts[index].amount = num(newValue);
  renderDebts();
  updateAllTotals();
  saveData();
}

function deleteDebt(i){
  if(confirm("حذف الدين؟")){
    data.debts.splice(i,1);
    renderDebts();
    updateAllTotals();
    saveData();
  }
}

// ====================== الإيراد ======================
function renderIncome(){
  const fields = ["cashIncome","networkIncome","appsIncome","deliveryExpense","debtOne","debtTwo"];
  fields.forEach(id => {
    const el = document.getElementById(id);
    if(el) el.value = data.income?.[id] || "";
  });
}

function saveIncome(){
  data.income = {
    cashIncome: document.getElementById("cashIncome")?.value.trim() || "",
    networkIncome: document.getElementById("networkIncome")?.value.trim() || "",
    appsIncome: document.getElementById("appsIncome")?.value.trim() || "",
    deliveryExpense: document.getElementById("deliveryExpense")?.value.trim() || "",
    debtOne: document.getElementById("debtOne")?.value.trim() || "",
    debtTwo: document.getElementById("debtTwo")?.value.trim() || ""
  };
  updateAllTotals();
  saveData();
}

// ====================== الحسابات الكلية ======================
function updateAllTotals(){
  // حساب السواقين
  const totals = data.drivers.reduce((a, d) => {
    a.account += num(d.account);
    a.extra += num(d.extra);
    a.network += num(d.network);
    a.fuel += num(d.fuel);
    a.apartments += num(d.apartments);
    a.expense += num(d.expense);
    return a;
  }, {account:0, extra:0, network:0, fuel:0, apartments:0, expense:0});

  const driversNet = totals.account + totals.extra - (totals.network + totals.fuel + totals.apartments + totals.expense);

  // تحديث جداول السواقين
  document.getElementById("sumAccount").innerText = money(totals.account);
  document.getElementById("sumExtra").innerText = money(totals.extra);
  document.getElementById("sumDeductions").innerText = money(totals.network + totals.fuel + totals.apartments + totals.expense);
  document.getElementById("sumNet").innerText = money(driversNet);

  document.getElementById("tAccount").innerText = money(totals.account);
  document.getElementById("tExtra").innerText = money(totals.extra);
  document.getElementById("tNetwork").innerText = money(totals.network);
  document.getElementById("tFuel").innerText = money(totals.fuel);
  document.getElementById("tApartments").innerText = money(totals.apartments);
  document.getElementById("tExpense").innerText = money(totals.expense);
  document.getElementById("tNet").innerText = money(driversNet);

  // إيراد التوصيل
  const incomeTotal = 
    num(data.income.cashIncome) + num(data.income.networkIncome) + num(data.income.appsIncome) -
    num(data.income.deliveryExpense) - num(data.income.debtOne) - num(data.income.debtTwo);

  document.getElementById("incomeTotal").textContent = money(incomeTotal);

  // الصافي النهائي
  const debtsTotal = data.debts.reduce((sum, d) => sum + num(d.amount), 0);
  const finalNet = driversNet + incomeTotal - debtsTotal;

  const finalEl = document.getElementById("finalNet");
  if(finalEl){
    finalEl.textContent = money(finalNet);
    finalEl.style.color = finalNet >= 0 ? '#166534' : '#b91c1c';
  }
}

// ====================== دوال أخرى ======================
function resetDay(){
  if(!confirm("تصفير كل مبالغ اليوم؟")) return;
  data.drivers = data.drivers.map(d => ({...d, account:"", extra:"", network:"", fuel:"", apartments:"", expense:""}));
  data.income = {...defaultData.income};
  data.debts = [];
  render();
}

function exportJSON(){
  saveData();
  const blob = new Blob([JSON.stringify(data, null, 2)], {type:"application/json"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `تسوية-سواقين-${data.date}.json`;
  a.click();
}

// إضافة مستمعين للحفظ التلقائي
document.getElementById("businessName")?.addEventListener("input", saveData);
document.getElementById("settlementDate")?.addEventListener("change", saveData);

// حفظ تلقائي للإيراد
["cashIncome","networkIncome","appsIncome","deliveryExpense","debtOne","debtTwo"].forEach(id => {
  const el = document.getElementById(id);
  if(el) el.addEventListener("input", saveIncome);
});

render();
</script>
