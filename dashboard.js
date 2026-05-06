let tabs = [];

chrome.storage.local.get(["tabs"], function (result) {
  tabs = result.tabs || [];
  displayTabs();
});

function displayTabs() {
  let tabsList = document.getElementById("tabsList");
  document.getElementById("totalTabs").textContent = tabs.length;
  document.getElementById("pendingTabs").textContent = tabs.filter(tab => !tab.done).length;
  document.getElementById("doneTabs").textContent = tabs.filter(tab => tab.done).length;
  document.getElementById("pinnedTabs").textContent = tabs.filter(tab => tab.pinned).length;
  tabsList.innerHTML = "";

  if (tabs.length === 0) {
    tabsList.innerHTML = "<p>No saved tabs yet.</p>";
    return;
  }

  tabs.forEach((tab, index) => {
  tabsList.innerHTML += `
    <div class="tab-card ${tab.done ? 'done-tab' : 'pending-tab'}">
      ${tab.pinned ? "<p>📌 Pinned</p>" : ""}

      <div class="card-header">
        <h3>${tab.website}</h3>
        <a href="${tab.link}" target="_blank" class="open-btn">Open ↗</a>
      </div>

      <p><strong>Title:</strong> ${tab.title}</p>
      <p><strong>Reason:</strong> ${tab.reason}</p>
      <p><strong>Category:</strong> ${tab.category}</p>
      <p><strong>Priority:</strong> ${tab.priority}</p>
      <p><strong>Reminder:</strong> ${tab.reminder}</p>

      <p>
        <strong>Status:</strong>
        <span class="${tab.done ? 'done-text' : 'pending-text'}">
          ${tab.done ? "Done" : "Pending"}
        </span>
      </p>
      <div class="card-actions">
        <button class="done-btn" data-index="${index}">
        ${tab.done ? "Mark Pending" : "Mark Done"}
        </button>

        <button class="pin-btn" data-index="${index}">
        ${tab.pinned ? "Unpin" : "Pin"}
        </button>

        <button class="delete-btn" data-index="${index}">
        Delete
        </button>
      </div>
    </div>
  `;
});
document.querySelectorAll(".done-btn").forEach(btn => {
  btn.addEventListener("click", function () {
    const index = this.dataset.index;
    markDone(index);
  });
});

document.querySelectorAll(".pin-btn").forEach(btn => {
  btn.addEventListener("click", function () {
    const index = this.dataset.index;
    togglePin(index);
  });
});

document.querySelectorAll(".delete-btn").forEach(btn => {
  btn.addEventListener("click", function () {
    const index = this.dataset.index;
    deleteTab(index);
  });
});
}
function saveTabs() {
  chrome.storage.local.set({ tabs: tabs }, function () {
    displayTabs();
  });
}

function markDone(index) {
  tabs[index].done = !tabs[index].done;
  saveTabs();
}

function togglePin(index) {
  tabs[index].pinned = !tabs[index].pinned;
  saveTabs();
}

function deleteTab(index) {
  tabs.splice(index, 1);
  saveTabs();
}

  const darkModeBtn = document.getElementById("darkModeBtn");

darkModeBtn.addEventListener("click", function () {
  document.body.classList.toggle("dark-mode");

  if (document.body.classList.contains("dark-mode")) {
    localStorage.setItem("theme", "dark");
  } else {
    localStorage.setItem("theme", "light");
  }
});

if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark-mode");
}

document.getElementById("searchInput").addEventListener("keyup", displayTabs);
document.getElementById("statusFilter").addEventListener("change", displayTabs);

document.getElementById("importFile").addEventListener("change", function (event) {
  const file = event.target.files[0];

  if (!file) return;

  const reader = new FileReader();

  reader.onload = function (e) {
    try {
      const importedTabs = JSON.parse(e.target.result);

      if (!Array.isArray(importedTabs)) {
        alert("Invalid backup file.");
        return;
      }

      tabs = importedTabs;

      chrome.storage.local.set({ tabs: tabs }, function () {
        alert("Tabs imported successfully!");
        displayTabs();
      });
    } catch {
      alert("Could not import file.");
    }
  };

  reader.readAsText(file);
});

document.getElementById("exportBtn").addEventListener("click", function () {
  const data = JSON.stringify(tabs, null, 2);
  const blob = new Blob([data], { type: "application/json" });

  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "too-many-tabs-backup.json";
  link.click();
});
