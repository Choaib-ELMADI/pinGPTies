(() => {
	let currentDiscussionId = "";

	//! ---- ---- ---- ---- ---- ---- ---- ---- ---- !//

	chrome.runtime.onMessage.addListener((obj, sender, response) => {
		const { type, value, discussionId, action } = obj;

		if (type === "NEW") {
			currentDiscussionId = discussionId;
		}

		if (action === "PIN_NEW_DISCUSSION") {
			pinNewDiscussionHandler(response);
		}
	});

	//! ---- ---- ---- ---- ---- ---- ---- ---- ---- !//

	function pinNewDiscussionHandler(response) {
		if (!currentDiscussionId) {
			return;
		}

		const newDiscussion = {
			id: currentDiscussionId,
			title: document.title,
			link: window.location.href,
			time: Date.now(),
		};

		response({ newDiscussion });
	}
})();
