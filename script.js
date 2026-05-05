let tabs = JSON.parse(localStorage.getItem("tabs")) || [];

function saveTab() {
  let link = document.getElementById("linkInput").value;
  let reason = document.getElementById("reasonInput").value;
  let category = document.getElementById("categoryInput").value;
  let priority = document.getElementById("priorityInput").value;
  let reminder = document.getElementById("reminderInput").value;
  try {
    new URL(link);
  } catch {
    alert("Please enter a valid URL like https://example.com");
    return;
  }

  if (link === "" || reason === "") {
    alert("Please enter at least a link and reason.");
    return;
  }

  let newTab = {
    website: new URL(link).hostname,
    link: link,
    reason: reason,
    category: category,
    priority: priority,
    reminder: reminder,
    done: false
  };

  tabs.push(newTab);
  localStorage.setItem("tabs", JSON.stringify(tabs));

  document.getElementById("linkInput").value = "";
  document.getElementById("reasonInput").value = "";
  document.getElementById("categoryInput").value = "";
  document.getElementById("priorityInput").value = "low";
  document.getElementById("reminderInput").value = "";

  displayTabs();
}

function displayTabs() {
  let tabsList = document.getElementById("tabsList");
  let overdueList = document.getElementById("overdueList");
  let todayList = document.getElementById("todayList");
  let searchValue = document
  .getElementById("searchInput")
  .value.toLowerCase();
  let statusFilter = document.getElementById("statusFilter").value;
  let today = new Date().toISOString().split("T")[0];
  tabsList.innerHTML = "";
  overdueList.innerHTML = "";
  todayList.innerHTML = "";

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

    let reminderDate = tab.reminder.split("T")[0];

    let targetList = tabsList;

    if (reminderDate < today && !tab.done) {
      targetList = overdueList;
    } else if (reminderDate === today && !tab.done) {
      targetList = todayList;
    }

    targetList.innerHTML += `
      <div class="tab-card ${tab.done ? 'done-tab' : 'pending-tab'}">
        <p><strong>Reason:</strong> ${tab.reason}</p>
        <div class="card-header">
          <h3>${tab.website}</h3>
          <a href="${tab.link}" target="_blank" class="open-btn">
            Open ↗
          </a>
        </div>
        <p><strong>Category:</strong> ${tab.category}</p>
        <p><strong>Priority:</strong> ${tab.priority}</p>
        <p><strong>Reminder:</strong> ${tab.reminder}</p>
        <p>
        <strong>Status:</strong>
        <span class="${tab.done ? 'done-text' : 'pending-text'}">
          ${tab.done ? "Done" : "Pending"}
        </span>
        </p>
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