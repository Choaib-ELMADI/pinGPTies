document.addEventListener("DOMContentLoaded", () => {
	const pinNewDiscussionBtn = document.getElementById("pin-new-discussion");
	let pinnedDiscussions = [];

	//! ---- ---- ---- ---- ---- ---- ---- ---- ---- !//

	getPinnedDiscussions();

	if (pinNewDiscussionBtn) {
		pinNewDiscussionBtn.addEventListener("click", () => {
			chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
				chrome.tabs.sendMessage(tabs[0].id, { action: "PIN_NEW_DISCUSSION" });
			});
			console.log("script.js ==> Send query");
			getPinnedDiscussions();
		});
	}

	//! ---- ---- ---- ---- ---- ---- ---- ---- ---- !//

	function getPinnedDiscussions() {
		chrome.storage.sync.get("userPinnedDiscussions", (result) => {
			if (result.userPinnedDiscussions) {
				pinnedDiscussions = JSON.parse(result.userPinnedDiscussions);
				console.log("script.js ==> Get discussions");
			} else {
				pinnedDiscussions = [];
				console.log("script.js ==> Get discussions []");
			}

			showPinnedDiscussions(pinnedDiscussions);
			console.table(pinnedDiscussions);
		});
	}

	function showPinnedDiscussions(discussions) {
		const discussionsContainer = document.getElementById("pinned-container");
		console.log("script.js ==> discussionsContainer" + discussionsContainer);

		if (discussionsContainer) {
			discussionsContainer.innerHTML = "";

			discussions.forEach((discussion) => {
				const pinnedDiscussion = document.createElement("div");
				pinnedDiscussion.className = "pinned";

				const pinnedTitle = document.createElement("p");
				pinnedTitle.className = "pinned-title";
				pinnedTitle.innerText = `${
					discussion?.title ? discussion?.title : "Discussion"
				}`;
				pinnedDiscussion.appendChild(pinnedTitle);

				const pinnedButtons = document.createElement("div");
				pinnedButtons.className = "pinned-buttons";

				const viewLink = document.createElement("a");
				viewLink.href = `${discussion.link}`;
				viewLink.target = "_blank";
				viewLink.className = "view-link";
				viewLink.title = "View discussion";

				const viewLinkImage = document.createElement("img");
				viewLinkImage.src = "Images/link_16x16.png";
				viewLinkImage.alt = "Link";
				viewLinkImage.draggable = "false";
				viewLink.appendChild(viewLinkImage);

				pinnedButtons.appendChild(viewLink);

				const deleteBtn = document.createElement("button");
				deleteBtn.className = "delete";
				deleteBtn.title = "Delete discussion";

				const deleteBtnImage = document.createElement("img");
				deleteBtnImage.src = "Images/delete_16x16.png";
				deleteBtnImage.alt = "Delete";
				deleteBtnImage.draggable = "false";
				deleteBtn.appendChild(deleteBtnImage);

				pinnedButtons.appendChild(deleteBtn);

				pinnedDiscussion.appendChild(pinnedButtons);

				discussionsContainer.appendChild(pinnedDiscussion);
			});
		}
	}
});
