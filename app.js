const STORAGE_KEY = "deerty_drivers_settlement_v1";

const defaultData = {
  businessName: "مطاعم ومطابخ سحايب ديرتي",
  date: new Date().toISOString().slice(0,10),

  drivers: [
    {
      name:"فؤاد",
      account:"",
      extra:"",
      network:"",
      fuel:"",
      apartments:"",
      expense:""
    },

    {
      name:"الجابر",
      account:"",
      extra:"",
      network:"",
      fuel:"",
      apartments:"",
      expense:""
    },

    {
      name:"مجاهد",
      account:"",
      extra:"",
      network:"",
      fuel:"",
      apartments:"",
      expense:""
    }
  ]
};

let data = loadData();

function loadData(){

  try{
    return JSON.parse(localStorage.getItem(STORAGE_KEY))
    || defaultData;

  }catch(e){

    return defaultData;
  }
}

function saveData(){

  data.businessName =
    document.getElementById("businessName").innerText.trim()
    || defaultData.businessName;

  data.date =
    document.getElementById("settlementDate").value
    || defaultData.date;

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(data)
  );
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

function render(){

  document.getElementById("businessName").innerText =
    data.businessName || defaultData.businessName;

  document.getElementById("settlementDate").value =
    data.date || defaultData.date;

  const body =
    document.getElementById("driversBody");

  body.innerHTML = "";

  data.drivers.forEach((d,i)=>{

    const net =
      num(d.account)
      + num(d.extra)
      - num(d.network)
      - num(d.fuel)
      - num(d.apartments)
      - num(d.expense);

    const tr =
      document.createElement("tr");

    tr.innerHTML = `

      <td>
        <input
          class="nameInput"
          value="${escapeHtml(d.name)}"
          oninput="updateField(${i}, 'name', this.value)"
        >
      </td>

      <td>
        <input
          type="text"
          inputmode="decimal"
          value="${showValue(d.account)}"
          oninput="updateField(${i}, 'account', this.value)"
        >
      </td>

      <td>
        <input
          type="text"
          inputmode="decimal"
          value="${showValue(d.extra)}"
          oninput="updateField(${i}, 'extra', this.value)"
        >
      </td>

      <td>
        <input
          type="text"
          inputmode="decimal"
          value="${showValue(d.network)}"
          oninput="updateField(${i}, 'network', this.value)"
        >
      </td>

      <td>
        <input
          type="text"
          inputmode="decimal"
          value="${showValue(d.fuel)}"
          oninput="updateField(${i}, 'fuel', this.value)"
        >
      </td>

      <td>
        <input
          type="text"
          inputmode="decimal"
          value="${showValue(d.apartments)}"
          oninput="updateField(${i}, 'apartments', this.value)"
        >
      </td>

      <td>
        <input
          type="text"
          inputmode="decimal"
          value="${showValue(d.expense)}"
          oninput="updateField(${i}, 'expense', this.value)"
        >
      </td>

      <td class="netCell ${net >= 0 ? 'positive' : 'negative'}" style="color: ${net >= 0 ? '#166534' : '#b91c1c'}; background-color: ${net >= 0 ? '#ecfdf5' : '#fef2f2'};">


        ${Math.abs(net).toFixed(2)}

        <div class="netLabel">
          ${net >= 0 ? 'للسواق' : 'على السواق'}
        </div>

      </td>

      <td class="no-print">

        <button
          class="iconBtn deleteBtn"
          onclick="deleteDriver(${i})"
        >
          حذف
        </button>

      </td>
    `;

    body.appendChild(tr);
  });

  updateTotals();

  saveData();
}

function updateField(i, field, value){

  if(field === "name"){

    data.drivers[i][field] = value;

  }else{

    data.drivers[i][field] = value.trim();
  }

  updateTotals();

  saveData();

  const d = data.drivers[i];

  const currentNet =
    num(d.account)
    + num(d.extra)
    - num(d.network)
    - num(d.fuel)
    - num(d.apartments)
    - num(d.expense);

  const netCell = document.querySelectorAll(".netCell")[i];
if (currentNet >= 0) {
  netCell.className = "netCell positive";
  netCell.style.color = "#166534";
  netCell.style.backgroundColor = "#ecfdf5";
} else {
  netCell.className = "netCell negative";
  netCell.style.color = "#b91c1c";
  netCell.style.backgroundColor = "#fef2f2";
}
netCell.innerHTML = `
  ${Math.abs(currentNet).toFixed(2)}
  <div class="netLabel">
    ${currentNet >= 0 ? 'للسواق' : 'على السواق'}
  </div>
`;

}

function addDriver(){

  const input =
    document.getElementById("driverName");

  const name =
    input.value.trim();

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

  if(!confirm("تصفير مبالغ اليوم مع بقاء أسماء السواقين؟"))
    return;

  data.drivers = data.drivers.map(d => ({

    ...d,

    account:"",
    extra:"",
    network:"",
    fuel:"",
    apartments:"",
    expense:""
  }));

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
    totals.network
    + totals.fuel
    + totals.apartments
    + totals.expense;

  const net =
    totals.account
    + totals.extra
    - deductions;

  document.getElementById("sumAccount").innerText =
    money(totals.account);

  document.getElementById("sumExtra").innerText =
    money(totals.extra);

  document.getElementById("sumDeductions").innerText =
    money(deductions);

  document.getElementById("sumNet").innerText =
    money(net);

  document.getElementById("tAccount").innerText =
    money(totals.account);

  document.getElementById("tExtra").innerText =
    money(totals.extra);

  document.getElementById("tNetwork").innerText =
    money(totals.network);

  document.getElementById("tFuel").innerText =
    money(totals.fuel);

  document.getElementById("tApartments").innerText =
    money(totals.apartments);

  document.getElementById("tExpense").innerText =
    money(totals.expense);

  document.getElementById("tNet").innerText =
    money(net);
}

function exportJSON(){

  saveData();

  const blob = new Blob(

    [JSON.stringify(data,null,2)],

    {
      type:"application/json"
    }
  );

  const a =
    document.createElement("a");

  a.href =
    URL.createObjectURL(blob);

  a.download =
    "backup-drivers-settlement.json";

  a.click();
}

document
.getElementById("importFile")

.addEventListener("change", async (e)=>{

  const file = e.target.files[0];

  if(!file) return;

  data =
    JSON.parse(await file.text());

  render();
});

document
.getElementById("businessName")
.addEventListener("input", saveData);

document
.getElementById("settlementDate")
.addEventListener("change", saveData);

function escapeHtml(str){

  return String(str).replace(/[&<>"']/g, s => ({

    '&':'&amp;',
    '<':'&lt;',
    '>':'&gt;',
    '"':'&quot;',
    "'":'&#39;'

  }[s]));
}

if("serviceWorker" in navigator){

  window.addEventListener("load",()=>{

    navigator
    .serviceWorker
    .register("service-worker.js");
  });
}

render();
