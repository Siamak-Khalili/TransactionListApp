const loadBtn = document.getElementById("load-btn");
const loader = document.getElementById("loader");
const transactionList = document.getElementById("transaction-list");
const searchInput = document.getElementById("search");
const wrappers = document.querySelectorAll(".select-wrapper");
const searchField = searchInput.querySelector("input");

// Global state to manage data

let allTransactions = [];
let filteredTransactions = [];
let currentSort = {
  key: null,
  order: null
};

// Loading Data

loadBtn.addEventListener("click", async () => {
  loadBtn.style.display = "none";
  loader.style.display = "block";

  try {
    const res = await axios.get("http://localhost:3000/transactions");
    allTransactions = res.data;
    filteredTransactions = [...allTransactions];

    setTimeout(() => {
      renderTable(filteredTransactions);
      loader.style.display = "none";
      transactionList.style.display = "block";
      searchInput.style.display = "block";
    }, 1000);
  } catch (error) {
    console.error("Loading failed:", error);
    loader.style.display = "none";
    loadBtn.style.display = "block";
  }
});

// Date conversion

function toJalali(timestamp) {
  const date = new Date(timestamp);

  const jalaliDate = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);

  const hour = date.getHours().toString().padStart(2, "0");
  const minute = date.getMinutes().toString().padStart(2, "0");
  const time = `${hour}:${minute}`.replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[d]);

  return `
    <span>${jalaliDate}</span>
    <span style="margin: 0 3px;">ساعت</span>
    <span>${time}</span>
  `;
}

// Format price

function formatPrice(price) {
  return Number(price).toLocaleString("en-US").replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[d]);
}

// Render table

function renderTable(data) {
  const tbody = document.querySelector("#transaction-list tbody");
  tbody.innerHTML = "";

  data.forEach((item) => {
    let typeClass = "";
    if (item.type === "افزایش اعتبار") {
      typeClass = "deposit";
    } else if (item.type === "برداشت از حساب") {
      typeClass = "withdraw";
    }

    const formattedDate = toJalali(item.date);
    const formattedPrice = formatPrice(item.price);

    tbody.innerHTML += `
      <tr>
        <td>${item.id.toString().replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[d])}</td>
        <td class="${typeClass}">${item.type}</td>
        <td class="price">${formattedPrice}</td>
        <td>${item.refId.toString().replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[d])}</td>
        <td>${formattedDate}</td>
      </tr>
    `;
  });
}

// Search function

function performSearch(query) {
  if (!query.trim()) {
    filteredTransactions = [...allTransactions];
  } else {
    filteredTransactions = allTransactions.filter(transaction => {
      return (
        transaction.refId.toString().includes(query) ||
        transaction.type.includes(query) ||
        transaction.id.toString().includes(query)
      );
    });
  }
  
  if (currentSort.key && currentSort.order) {
    applySorting(currentSort.key, currentSort.order);
  } else {
    renderTable(filteredTransactions);
  }
}

// Sort function

function applySorting(sortKey, order) {
  let sortedData = [...filteredTransactions];

  sortedData.sort((a, b) => {
    let valueA, valueB;

    switch (sortKey) {
      case 'price':
        valueA = parseFloat(a.price);
        valueB = parseFloat(b.price);
        break;
      case 'date':
        valueA = new Date(a.date).getTime();
        valueB = new Date(b.date).getTime();
        break;
      case 'id':
        valueA = parseInt(a.id);
        valueB = parseInt(b.id);
        break;
      default:
        valueA = a[sortKey];
        valueB = b[sortKey];
    }

    if (order === 'asc') {
      return valueA > valueB ? 1 : -1;
    } else {
      return valueA < valueB ? 1 : -1;
    }
  });

  renderTable(sortedData);
}

// Search event listener

searchField.addEventListener("input", (e) => {
  const query = e.target.value.trim();
  performSearch(query);
});

// Sort & Rotating icons

wrappers.forEach((wrapper) => {
  const select = wrapper.querySelector(".select");
  const arrow = wrapper.querySelector(".arrow");

  select.addEventListener("click", () => {
    arrow.classList.toggle("rotated");
  });

  document.addEventListener("click", (e) => {
    if (!wrapper.contains(e.target)) {
      arrow.classList.remove("rotated");
    }
  });

  // Sort functionality

  select.addEventListener("change", (e) => {
    arrow.classList.remove("rotated");

    const order = e.target.value;
    const sortKey = select.getAttribute("data-sort");

    if (order && sortKey) {
      currentSort.key = sortKey;
      currentSort.order = order;
      applySorting(sortKey, order);
    } else {
      currentSort.key = null;
      currentSort.order = null;
      renderTable(filteredTransactions);
    }
  });
});

// Reset all filters

function resetFilters() {
  searchField.value = '';
  
  wrappers.forEach(wrapper => {
    const select = wrapper.querySelector(".select");
    select.selectedIndex = 0;
  });
  
  filteredTransactions = [...allTransactions];
  currentSort.key = null;
  currentSort.order = null;
  
  renderTable(filteredTransactions);
}