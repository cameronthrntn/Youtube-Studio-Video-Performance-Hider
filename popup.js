const toggleButton = document.getElementById("performanceToggle");
const statusText = document.getElementById("status");
const toggleText = document.getElementById("toggleText");

chrome.tabs.query({ active: true, currentWindow: true }, async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab.url.startsWith("https://studio.youtube.com")) {
    toggleText.innerHTML =
      "Please navigate to your studio dashboard to make changes.";
    toggleButton.style.display = "none";
    statusText.style.display = "none";
  }
});

chrome.storage.sync.get("isShowingPerformance", ({ isShowingPerformance }) => {
  setButton(isShowingPerformance);
});

chrome.storage.onChanged.addListener((changes) =>
  setButton(changes.isShowingPerformance.newValue)
);

toggleButton.addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: setShowingPerformance,
  });
});

const setButton = (isShowingPerformance) => {
  const image = document.createElement("img");
  image.src = chrome.runtime.getURL(
    isShowingPerformance ? "images/icon.png" : "images/icon-open.png"
  );
  statusText.textContent = `Currently ${
    isShowingPerformance ? "showing" : "hiding"
  } the video performance tab`;
  document.getElementsByTagName("button")[0].replaceChildren(image);
};

const setShowingPerformance = () => {
  chrome.storage.sync.get(
    "isShowingPerformance",
    ({ isShowingPerformance }) => {
      const performanceBox = document.getElementById(
        "align-experimental-badge"
      );
      performanceBox.style.display = isShowingPerformance ? "block" : "none";
      chrome.storage.sync.set({
        isShowingPerformance: !!!isShowingPerformance,
      });
    }
  );
};
