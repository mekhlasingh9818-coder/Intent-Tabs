let currentTabData = null;

chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  currentTabData = tabs[0];

  document.getElementById("currentTab").innerText =
    currentTabData.title + "\n" + currentTabData.url;
});

document.getElementById("saveBtn").addEventListener("click", function () {
  let reason = document.getElementById("reasonInput").value;
  let category = document.getElementById("categoryInput").value;
  let reminder = document.getElementById("reminderInput").value;

  if (reason === "") {
    alert("Please enter a reason.");
    return;
  }

  let savedTab = {
    website: new URL(currentTabData.url).hostname,
    link: currentTabData.url,
    title: currentTabData.title,
    reason: reason,
    category: category,
    priority: "medium",
    reminder: reminder,
    done: false,
    pinned: false,
    notified: false
  };

  chrome.storage.local.get(["tabs"], function (result) {
    let tabs = result.tabs || [];

    tabs.push(savedTab);

    chrome.storage.local.set({ tabs: tabs }, function () {
        alert("Current tab saved!");
        console.log(tabs);
    });
  });
});