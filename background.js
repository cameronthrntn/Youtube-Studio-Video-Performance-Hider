chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.url.startsWith("https://studio.youtube.com")) {
    chrome.scripting.executeScript({
      target: { tabId },
      function: () => {
        const toggleTab = (isShowingPerformance) => {
          const performanceBox = document.getElementById(
            "align-experimental-badge"
          );
          performanceBox.style.display = isShowingPerformance
            ? "block"
            : "none";
        };

        chrome.storage.onChanged.addListener((changes) =>
          toggleTab(changes.isShowingPerformance.newValue)
        );

        chrome.storage.sync.get(
          "isShowingPerformance",
          ({ isShowingPerformance }) => toggleTab(isShowingPerformance)
        );
      },
    });
  }
});
