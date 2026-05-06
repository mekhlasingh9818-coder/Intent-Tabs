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

  tabs.forEach((tab) => {
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
    </div>
  `;
});
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