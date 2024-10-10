export async function getCurrentTab() {
	let queryOptions = { active: true, currentWindow: true };
	let [tab] = await chrome.tabs.query(queryOptions);
	return tab;
}

export function handleNotDiscussionTab() {
	const discussionsContainer = document.getElementById("pinned-container");

	discussionsContainer.innerHTML = "";

	const noDiscussionContainer = document.createElement("div");
	noDiscussionContainer.className = "no-discussion-container";

	const noDiscussionContent = document.createElement("h1");
	noDiscussionContent.className = "no-discussion-content";
	noDiscussionContent.innerText =
		"This is not a chatGPT discussion tab! Please select a valid one.";
	noDiscussionContainer.appendChild(noDiscussionContent);

	discussionsContainer.appendChild(noDiscussionContainer);
}

export function handleShowPinButton() {
	const pinNewDiscussionBtn = document.getElementById("pin-new-discussion");
	pinNewDiscussionBtn.classList.add("show");
}
