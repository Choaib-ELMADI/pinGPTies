import {
	handleNotDiscussionTab,
	showPinnedDiscussions,
	getPinnedDiscussions,
	handleShowPinButton,
	getCurrentTab,
} from "./utils.js";

document.addEventListener("DOMContentLoaded", async () => {
	const pinNewDiscussionBtn = document.getElementById("pin-new-discussion");
	let pinnedDiscussions = [];
	let currentTab = "";

	//! ---- ---- ---- ---- ---- ---- ---- ---- ---- !//

	currentTab = await getCurrentTab();

	if (!currentTab.url || !currentTab.url.includes("chatgpt.com")) {
		handleNotDiscussionTab();
		return;
	}

	if (currentTab.url && currentTab.url.includes("chatgpt.com/c")) {
		handleShowPinButton();
	}

	chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
		chrome.tabs.sendMessage(tabs[0].id, {
			type: "NEW",
			discussionId: currentTab.url.includes("chatgpt.com/c")
				? currentTab.url.split("/c/")[1]
				: "",
		});
	});

	pinnedDiscussions = await getPinnedDiscussions();
	showPinnedDiscussions(pinnedDiscussions);

	pinNewDiscussionBtn.addEventListener("click", () => {
		chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
			chrome.tabs.sendMessage(
				tabs[0].id,
				{
					action: "PIN_NEW_DISCUSSION",
				},
				async (response) => {
					if (response && response.newDiscussion) {
						const newDiscussion = response.newDiscussion;

						const { userPinnedDiscussions } = await chrome.storage.sync.get(
							"userPinnedDiscussions"
						);

						let pinnedDiscussions = userPinnedDiscussions
							? JSON.parse(userPinnedDiscussions)
							: [];

						const discussionExists = pinnedDiscussions.some(
							(discussion) => discussion.id === newDiscussion.id
						);

						if (discussionExists) {
							return;
						}

						pinnedDiscussions = [...pinnedDiscussions, newDiscussion].sort(
							(a, b) => b.time - a.time
						);

						chrome.storage.sync.set(
							{
								userPinnedDiscussions: JSON.stringify(pinnedDiscussions),
							},
							() => {
								showPinnedDiscussions(pinnedDiscussions);
							}
						);
					}
				}
			);
		});
	});
});
