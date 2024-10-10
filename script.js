import {
	getCurrentTab,
	handleNotDiscussionTab,
	handleShowPinButton,
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

	//! ---- ---- ---- ---- ---- ---- ---- ---- ---- !//

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

	function showPinnedDiscussions(discussions) {
		const discussionsContainer = document.getElementById("pinned-container");
		console.log("Show discussions");

		discussionsContainer.innerHTML = "";

		if (discussions.length < 1) {
			const emptyDiscussionsContainer = document.createElement("div");
			emptyDiscussionsContainer.className = "empty-discussions-container";

			const emptyDiscussionsContent = document.createElement("h1");
			emptyDiscussionsContent.className = "empty-discussions-content";
			emptyDiscussionsContent.innerText = "No pinned discussions!";
			emptyDiscussionsContainer.appendChild(emptyDiscussionsContent);

			discussionsContainer.appendChild(emptyDiscussionsContainer);

			return;
		}

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
			deleteBtn.dataset.index = discussion.id;
			deleteBtn.title = "Delete discussion";
			deleteBtn.addEventListener("click", function () {
				const indexToDelete = this.dataset.index;
				deleteDiscussionById(indexToDelete);
			});

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

	function deleteDiscussionById(id) {
		chrome.storage.sync.get("userPinnedDiscussions", function (result) {
			if (result.userPinnedDiscussions) {
				let pinnedDiscussions = JSON.parse(result.userPinnedDiscussions);

				pinnedDiscussions = pinnedDiscussions.filter(
					(discussion) => discussion.id !== id
				);

				chrome.storage.sync.set(
					{
						userPinnedDiscussions: JSON.stringify(pinnedDiscussions),
					},
					function () {
						showPinnedDiscussions(pinnedDiscussions);
					}
				);
			}
		});
	}
});
