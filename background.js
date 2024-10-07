chrome.tabs.onUpdated.addListener((tabId, tab) => {
	if (tab.url && tab.url.includes("chatgpt.com/c")) {
		const queryParameters = tab.url.split("/")[-1]; // -1 or 2
		const urlParameters = new URLSearchParams(queryParameters);

		chrome.tabs.sendMessage(tabId, {
			type: "NEW",
			videoId: urlParameters.get("v"),
		});
	}
});
