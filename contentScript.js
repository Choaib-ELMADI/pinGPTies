(() => {
	let currentDiscussionId = "";
	let pinnedDiscussions = [];

	//! ---- ---- ---- ---- ---- ---- ---- ---- ---- !//

	chrome.runtime.onMessage.addListener((obj, sender, response) => {
		const { type, value, discussionId, action } = obj;

		if (type === "NEW") {
			console.log("NEW");
			currentDiscussionId = discussionId;
			console.log(currentDiscussionId);
		}

		if (action === "PIN_NEW_DISCUSSION") {
			console.log("PIN_NEW_DISCUSSION");
			pinNewDiscussionHandler(response);
		}
	});

	//! ---- ---- ---- ---- ---- ---- ---- ---- ---- !//

	// async function pinNewDiscussionHandler() {
	// 	if (!currentDiscussionId) {
	// 		let tab = getCurrentTab();
	// 		currentDiscussionId = tab.url.split("/c/")[1];
	// 	}

	// 	//! CHECK IF ALREADY EXISTS

	// 	const title = getDiscussionTitle(currentDiscussionId);
	// 	const newDiscussion = {
	// 		time: new Date().getTime(),
	// 		id: currentDiscussionId,
	// 		title: title,
	// 		link: `https://chatgpt.com/c/${currentDiscussionId}`,
	// 	};

	// 	console.table(newDiscussion);

	// 	pinnedDiscussions = await getPinnedDiscussions();

	// 	chrome.storage.sync.set({
	// 		userPinnedDiscussions: JSON.stringify(
	// 			[...pinnedDiscussions, newDiscussion].sort((a, b) => b.time - a.time)
	// 		),
	// 	});
	// }

	function pinNewDiscussionHandler(response) {
		const newDiscussion = {
			id: currentDiscussionId, // Use the currentDiscussionId set previously
			title: document.title, // Current page title
			link: window.location.href, // Current page URL
			time: Date.now(), // Timestamp for sorting
		};

		// Send the new discussion back to the sender (popup)
		response({ newDiscussion });
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

	async function getCurrentTab() {
		let queryOptions = { active: true, currentWindow: true };
		let [tab] = await chrome.tabs.query(queryOptions);
		console.log("call: GET CURRENT TAB");

		if (tab.url && tab.url.includes("chatgpt.com/c")) {
			return tab;
		}
	}
})();
