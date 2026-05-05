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
  tabsList.innerHTML = "";

  tabs.forEach((tab, index) => {
    tabsList.innerHTML += `
      <div class="tab-card">
        <p><strong>Reason:</strong> ${tab.reason}</p>
        <p><strong>Category:</strong> ${tab.category}</p>
        <p><strong>Reminder:</strong> ${tab.reminder}</p>
        <p><strong>Status:</strong> ${tab.done ? "Done" : "Pending"}</p>
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