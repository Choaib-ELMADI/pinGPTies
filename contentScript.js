(() => {
	let currentDiscussionId = "";
	let pinnedDiscussions = [];

	chrome.runtime.onMessage.addListener((obj, sender, response) => {
		const { type, value, discussionId, action } = obj;

		if (type === "NEW") {
			currentDiscussionId = discussionId;
			newDiscussionLoaded();
		}

		if (action === "PIN_NEW_DISCUSSION") {
			pinNewDiscussionHandler();
		}
	});

	const newDiscussionLoaded = () => {
		if (!currentDiscussionId) {
			return;
		}

		console.log(`Discussion ID: ${currentDiscussionId}`);
	};

	const pinNewDiscussionHandler = () => {
		if (!currentDiscussionId) {
			return;
		}

		const newDiscussion = {
			time: new Date().getTime(),
			id: currentDiscussionId,
			link: `https://chatgpt.com/c/${currentDiscussionId}`,
		};

		chrome.storage.sync.get("userPinnedDiscussions", (result) => {
			if (result.userPinnedDiscussions) {
				pinnedDiscussions = JSON.parse(result.userPinnedDiscussions);
			} else {
				pinnedDiscussions = [];
			}
		});

		chrome.storage.sync.set({
			userPinnedDiscussions: JSON.stringify(
				[...pinnedDiscussions, newDiscussion].sort((a, b) => b.time - a.time) // Newest first
			),
		});
	};

	newDiscussionLoaded();
})();
