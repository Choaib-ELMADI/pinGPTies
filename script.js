import { getCurrentTab, handleNotDiscussionTab } from "./utils.js";

document.addEventListener("DOMContentLoaded", async () => {
	const pinNewDiscussionBtn = document.getElementById("pin-new-discussion");
	let pinnedDiscussions = [];
	let currentTab = "";

	//! ---- ---- ---- ---- ---- ---- ---- ---- ---- !//

	currentTab = await getCurrentTab();

	if (!currentTab.url || !currentTab.url.includes("chatgpt.com/c")) {
		handleNotDiscussionTab();
		return;
	}

	chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
		chrome.tabs.sendMessage(tabs[0].id, {
			type: "NEW",
			discussionId: currentTab.url.split("/c/")[1],
		});
	});

	pinnedDiscussions = await getPinnedDiscussions();
	showPinnedDiscussions(pinnedDiscussions);

	pinNewDiscussionBtn.addEventListener("click", () => {
		// Step 1: Get the active tab and send a message to the content script
		chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
			chrome.tabs.sendMessage(
				tabs[0].id,
				{
					action: "PIN_NEW_DISCUSSION",
				},
				async (response) => {
					// Step 2: Add the new discussion to storage after getting response
					if (response && response.newDiscussion) {
						const newDiscussion = response.newDiscussion;

						// Retrieve the current pinned discussions from chrome.storage.sync
						const { userPinnedDiscussions } = await chrome.storage.sync.get(
							"userPinnedDiscussions"
						);

						let pinnedDiscussions = userPinnedDiscussions
							? JSON.parse(userPinnedDiscussions)
							: [];

						// Add the new discussion to the list and sort by time
						pinnedDiscussions = [...pinnedDiscussions, newDiscussion].sort(
							(a, b) => b.time - a.time
						);

						// Step 3: Save the updated list back to chrome.storage.sync and update the UI
						chrome.storage.sync.set(
							{
								userPinnedDiscussions: JSON.stringify(pinnedDiscussions),
							},
							() => {
								// Update the display after saving
								showPinnedDiscussions(pinnedDiscussions);
								console.log("New discussion pinned successfully!");
							}
						);
					} else {
						console.log("No discussion was provided to pin.");
					}
					// console.log(response);
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
