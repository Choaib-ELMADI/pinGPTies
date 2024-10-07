(() => {
	let currentDiscussionId = "";
	let pinnedDiscussions = [];

	chrome.runtime.onMessage.addListener((obj, sender, response) => {
		const { type, value, discussionId } = obj;

		if (type === "NEW") {
			currentDiscussionId = discussionId;
			newDiscussionLoaded();
		}
	});

	const newDiscussionLoaded = () => {
		if (!currentDiscussionId) {
			return;
		}

		console.log(`Your ID: ${currentDiscussionId}`);
	};

	const pinNewDiscussionHandler = () => {
		const newDiscussion = {
			id: currentDiscussionId,
			link: `https://chatgpt.com/c/${currentDiscussionId}`,
		};

		chrome.storage.sync.set({
			userPinnedDiscussions: JSON.stringify(
				[...pinnedDiscussions, newDiscussion].sort((a, b) => a.id - b.id)
			),
		});
	};

	newDiscussionLoaded();
})();
