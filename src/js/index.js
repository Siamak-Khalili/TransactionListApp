const loadBtn = document.getElementById("load-btn");
const loader = document.getElementById("loader");
const transactionList = document.getElementById("transaction-list");
const searchInput = document.getElementById("search");
const wrappers = document.querySelectorAll(".select-wrapper");
const searchField = searchInput.querySelector("input");

// Loading Data

loadBtn.addEventListener("click", async () => {
  loadBtn.style.display = "none";
  loader.style.display = "block";

  try {
    const res = await axios.get("http://localhost:3000/transactions");
    const transactions = res.data;

    setTimeout(() => {
      renderTable(transactions);
      loader.style.display = "none";
      transactionList.style.display = "block";
      searchInput.style.display = "block";
    }, 1000);
  } catch (error) {
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

//

function formatPrice(price) {
  return Number(price).toLocaleString("en-US");
}

// Table

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
        <td>${item.id}</td>
        <td class="${typeClass}">${item.type}</td>
        <td class="price">${formattedPrice}</td>
        <td>${item.refId}</td>
        <td>${formattedDate}</td>
      </tr>
    `;
  });
}

// Search

searchField.addEventListener("input", async (e) => {
  const query = e.target.value.trim();

  try {
    const res = await axios.get(
      `http://localhost:3000/transactions?refId_like=${query}`
    );
    renderTable(res.data);
  } catch (error) {
    console.error("Search failed", error);
  }
});

// Sort & Rotating icons

wrappers.forEach((wrapper) => {
  const select = wrapper.querySelector(".select");
  const arrow = wrapper.querySelector(".arrow");

  // Sort & Rotating icons

  select.addEventListener("click", () => {
    arrow.classList.toggle("rotated");
  });

  document.addEventListener("click", (e) => {
    if (!wrapper.contains(e.target)) {
      arrow.classList.remove("rotated");
    }
  });

  // Sort
  select.addEventListener("change", async (e) => {
    arrow.classList.remove("rotated");

    const order = e.target.value;
    const sortKey = select.getAttribute("data-sort");

    let url = "http://localhost:3000/transactions";

    try {
      if (order && sortKey) {
        url += `?_sort=${sortKey}&_order=${order}`;
      } else {
        url += `?_sort=id&_order=asc`;
      }

      const res = await axios.get(url);
      renderTable(res.data);
    } catch (error) {
      console.error("Sorting failed", error);
    }
  });
});
