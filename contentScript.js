(() => {
	let chatgptDiscussionHeader = "";
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
		const chatgptDiscussionHeader = document.getElementsByClassName(
			"draggable no-draggable-children sticky top-0 p-3 mb-1.5 flex items-center justify-between z-10 h-header-height font-semibold bg-token-main-surface-primary max-md:hidden"
		)[0];

		if (!chatgptDiscussionHeader) {
			setTimeout(newDiscussionLoaded(), 10);
		}

		const pinDiscussionBtnExists =
			document.getElementsByClassName("pin-discussion-btn")[0];
		console.log(`Button exists?: ${pinDiscussionBtnExists}`);

		if (!pinDiscussionBtnExists) {
			const pinDiscussionBtn = document.createElement("img");

			pinDiscussionBtn.src = chrome.runtime.getURL("Images/pin.png");
			pinDiscussionBtn.className = "absolute top-0 left-0 w-9 h-9 z-[999]";
			pinDiscussionBtn.title = "Click to pin current discussion";

			console.log(`Header: ${chatgptDiscussionHeader}`);

			chatgptDiscussionHeader?.append(pinDiscussionBtn);
			// bookmarkBtn.addEventListener("click", addNewBookmarkEventHandler);
		}
	};

	// const addNewBookmarkEventHandler = () => {
	// 	const currentTime = youtubePlayer.currentTime;
	// 	const newBookmark = {
	// 		time: currentTime,
	// 		desc: "Bookmark at " + getTime(currentTime),
	// 	};
	// 	console.log(newBookmark);

	// 	chrome.storage.sync.set({
	// 		[currentVideo]: JSON.stringify(
	// 			[...currentVideoBookmarks, newBookmark].sort((a, b) => a.time - b.time)
	// 		),
	// 	});
	// };

	newDiscussionLoaded();
})();
