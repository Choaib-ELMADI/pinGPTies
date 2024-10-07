chrome.tabs.onUpdated.addListener((tabId, tab) => {
	if (tab.url && tab.url.includes("chatgpt.com/c")) {
		const discussionId = tab.url.split("/c/")[1];

		chrome.tabs.sendMessage(tabId, {
			type: "NEW",
			discussionId,
		});
	}
});
