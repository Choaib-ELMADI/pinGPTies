(() => {
	let currentDiscussionId = "";
	let pinnedDiscussions = [];

	//! ---- ---- ---- ---- ---- ---- ---- ---- ---- !//

	chrome.storage.sync.get("userPinnedDiscussions", (result) => {
		if (result.userPinnedDiscussions) {
			pinnedDiscussions = JSON.parse(result.userPinnedDiscussions);
			console.log("contentScript.js ==> Get discussions");
		} else {
			pinnedDiscussions = [];
			console.log("contentScript.js ==> Get discussions []");
		}

		console.table(pinnedDiscussions);
	});

	chrome.runtime.onMessage.addListener((obj, sender, response) => {
		const { type, value, discussionId, action } = obj;

		if (type === "NEW") {
			currentDiscussionId = discussionId;
			console.log(currentDiscussionId);
		}

		if (action === "PIN_NEW_DISCUSSION") {
			pinNewDiscussionHandler();
		}
	});

	//! ---- ---- ---- ---- ---- ---- ---- ---- ---- !//

	function pinNewDiscussionHandler() {
		if (!currentDiscussionId) {
			return;
		}

		const title = getDiscussionTitle(currentDiscussionId);
		const newDiscussion = {
			time: new Date().getTime(),
			id: currentDiscussionId,
			title: title,
			link: `https://chatgpt.com/c/${currentDiscussionId}`,
		};

		console.log("New discussion to pin");

		chrome.storage.sync.set({
			userPinnedDiscussions: JSON.stringify(
				[...pinnedDiscussions, newDiscussion].sort((a, b) => b.time - a.time) // Newest first
			),
		});
	}

	function getDiscussionTitle(discussionId) {
		const hrefValue = `/c/${discussionId}`;
		const anchorElement = document.querySelector(`a[href="${hrefValue}"]`);

		if (anchorElement) {
			const titleElement = anchorElement.querySelector("div[dir='auto']");
			const title = titleElement
				? titleElement.textContent.trim()
				: "Discussion";

			return title;
		}

		return "Discussion";
	}
})();
