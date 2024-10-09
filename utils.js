export function getPinnedDiscussions() {
	console.log("call: GET PINNED DISCUSSIONS");
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

export function showPinnedDiscussions(discussions) {
	const discussionsContainer = document.getElementById("pinned-container");

	if (discussionsContainer) {
		console.log("call: SHOW PINNED DISCUSSIONS");
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

export async function getCurrentTab() {
	let queryOptions = { active: true, currentWindow: true };
	let [tab] = await chrome.tabs.query(queryOptions);
	console.log("call: GET CURRENT TAB");
	return tab;
}

export async function sendPinNewDiscussionRequest() {
	let currentTab = "";
	currentTab = await getCurrentTab();
	chrome.tabs.sendMessage(currentTab.id, {
		action: "PIN_NEW_DISCUSSION",
	});
	console.log("call: SEND PIN NEW DISCUSSION REQUEST");
}
