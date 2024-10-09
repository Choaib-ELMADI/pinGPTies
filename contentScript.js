(() => {
	let currentDiscussionId = "";
	let pinnedDiscussions = [];

	//! ---- ---- ---- ---- ---- ---- ---- ---- ---- !//

	chrome.runtime.onMessage.addListener((obj, sender, response) => {
		const { type, value, discussionId, action } = obj;

		if (type === "NEW") {
			console.log("NEW");

			currentDiscussionId = discussionId;
			// pinnedDiscussions = await getPinnedDiscussions();
		}

		if (action === "PIN_NEW_DISCUSSION") {
			console.log("PIN_NEW_DISCUSSION");

			// pinNewDiscussionHandler();
		}
	});

	//! ---- ---- ---- ---- ---- ---- ---- ---- ---- !//

	async function pinNewDiscussionHandler() {
		if (!currentDiscussionId) {
			return;
		}

		//! CHECK IF ALREADY EXISTS

		const title = getDiscussionTitle(currentDiscussionId);
		const newDiscussion = {
			time: new Date().getTime(),
			id: currentDiscussionId,
			title: title,
			link: `https://chatgpt.com/c/${currentDiscussionId}`,
		};

		pinnedDiscussions = await getPinnedDiscussions();

		chrome.storage.sync.set({
			userPinnedDiscussions: JSON.stringify(
				[...pinnedDiscussions, newDiscussion].sort((a, b) => b.time - a.time)
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

	function getPinnedDiscussions() {
		return new Promise((resolve) => {
			chrome.storage.sync.get("userPinnedDiscussions", (obj) => {
				resolve(
					obj["userPinnedDiscussions"]
						? JSON.parse(obj["userPinnedDiscussions"])
						: []
				);
			});
		});
	}
})();
