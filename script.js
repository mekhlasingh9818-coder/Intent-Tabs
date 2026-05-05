let tabs = JSON.parse(localStorage.getItem("tabs")) || [];

function saveTab() {
  let link = document.getElementById("linkInput").value;
  let reason = document.getElementById("reasonInput").value;
  let category = document.getElementById("categoryInput").value;
  let reminder = document.getElementById("reminderInput").value;

  if (link === "" || reason === "") {
    alert("Please enter at least a link and reason.");
    return;
  }

  let newTab = {
    link: link,
    reason: reason,
    category: category,
    reminder: reminder,
    done: false
  };

  tabs.push(newTab);
  localStorage.setItem("tabs", JSON.stringify(tabs));

  document.getElementById("linkInput").value = "";
  document.getElementById("reasonInput").value = "";
  document.getElementById("categoryInput").value = "";
  document.getElementById("reminderInput").value = "";

  displayTabs();
}

function displayTabs() {
  let tabsList = document.getElementById("tabsList");
  let searchValue = document
  .getElementById("searchInput")
  .value.toLowerCase();
  let statusFilter = document.getElementById("statusFilter").value;
  tabsList.innerHTML = "";

  tabs.forEach((tab, index) => {
    if (
      !tab.reason.toLowerCase().includes(searchValue) &&
      !tab.category.toLowerCase().includes(searchValue)
    ) {
      return;
    }
    if (statusFilter === "pending" && tab.done === true) {
      return;
    }

    if (statusFilter === "done" && tab.done === false) {
      return;
    }
    tabsList.innerHTML += `
      <div class="tab-card ${tab.done ? 'done-tab' : 'pending-tab'}">
        <p><strong>Reason:</strong> ${tab.reason}</p>
        <p><strong>Category:</strong> ${tab.category}</p>
        <p><strong>Reminder:</strong> ${tab.reminder}</p>
        <p>
        <strong>Status:</strong>
        <span class="${tab.done ? 'done-text' : 'pending-text'}">
          ${tab.done ? "Done" : "Pending"}
        </span>
        </p>
        <a href="${tab.link}" target="_blank">Open Link</a>
        <br><br>
        <button onclick="markDone(${index})">
  ${tab.done ? "Completed" : "Mark Done"}
</button>

<button onclick="deleteTab(${index})">Delete</button>
      </div>
    `;
  });
}
function markDone(index) {
  tabs[index].done = !tabs[index].done;
  localStorage.setItem("tabs", JSON.stringify(tabs));
  displayTabs();
}
function deleteTab(index) {
  tabs.splice(index, 1);
  localStorage.setItem("tabs", JSON.stringify(tabs));
  displayTabs();
}

displayTabs();