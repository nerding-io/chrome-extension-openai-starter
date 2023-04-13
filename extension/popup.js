document.getElementById("save-key").addEventListener("click", function () {
  const apiKey = document.getElementById("api-key").value;
  chrome.storage.sync.set({ openaiApiKey: apiKey }, function () {
    console.log("API key saved");
  });
});

document.getElementById("fill-form").addEventListener("click", function () {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { action: "fill_form" });
  });
});
