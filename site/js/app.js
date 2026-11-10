import { fromMRS } from "./mrs-converter.bundle.js";

const theme = document.documentElement.getAttribute("data-theme");
document.getElementById("theme-btn").textContent =
	theme === "dark" ? "☾" : "☀";

function handleBuffer(rawBytes) {
	try {
		const { behavior, payload } = fromMRS(rawBytes);
		renderResult(behavior, payload);
	} catch (e) {
		alert(`Error: ${e}`);
	}
}

document.getElementById("url-btn").addEventListener("click", () => {
	const url = document.getElementById("url-input").value.trim();
	if (!url) return;
	fetch(url)
		.then((r) => r.arrayBuffer())
		.then((rawBytes) => handleBuffer(rawBytes))
		.catch((e) => alert(`Error: ${e}`));
});
document.getElementById("url-input").addEventListener("keydown", (e) => {
	if (e.key === "Enter") document.getElementById("url-btn").click();
});

document.getElementById("file-input").addEventListener("change", (e) => {
	const file = e.target.files[0];
	if (!file) return;

	file.arrayBuffer().then((buf) => handleBuffer(buf));
});

const zone = document.getElementById("drop-zone");
zone.addEventListener("dragover", (e) => {
	e.preventDefault();
	zone.classList.add("over");
});
zone.addEventListener("dragleave", () => {
	zone.classList.remove("over");
});
zone.addEventListener("drop", (_e) => {
	zone.classList.remove("over");
});

document.getElementById("theme-btn").addEventListener("click", () => {
	const isDark = document.documentElement.getAttribute("data-theme") === "dark";
	const next = isDark ? "light" : "dark";
	document.documentElement.setAttribute("data-theme", next);
	document.getElementById("theme-btn").textContent =
		next === "dark" ? "☾" : "☀";
	localStorage.setItem("theme", next);
});

function renderResult(behavior, payload) {
	let behaviorName;
	switch (behavior) {
		case 0:
			behaviorName = "Domain";
			payload = payload.sort();
			break;
		case 1:
			behaviorName = "IP-CIDR";
			break;
		default:
			throw new Error("Invalid behavior!");
	}

	const section = document.getElementById("result");
	section.classList.remove("hidden");
	section.innerHTML = "";

	const info = document.createElement("div");
	info.className = "result-info";
	info.innerHTML = `
<div class="result-stat">
    <div class="result-stat-label">Behavior</div>
    <div class="result-stat-value">${behaviorName}</div>
</div>
<div class="result-stat">
    <div class="result-stat-label">Payload</div>
    <div class="result-stat-value">${payload.length}</div>
</div>
`;
	section.appendChild(info);

	const controls = document.createElement("div");
	controls.className = "result-controls";

	const searchInput = document.createElement("input");
	searchInput.type = "text";
	searchInput.placeholder = "Search...";

	const downloadBtn = document.createElement("button");
	downloadBtn.textContent = "Download .txt";
	downloadBtn.addEventListener("click", () => downloadTxt(payload));

	controls.appendChild(searchInput);
	controls.appendChild(downloadBtn);
	section.appendChild(controls);

	const listWrap = document.createElement("div");
	listWrap.className = "result-list";
	section.appendChild(listWrap);

	let current = payload;
	renderList(listWrap, current);

	let timer;
	searchInput.addEventListener("input", () => {
		clearTimeout(timer);
		timer = setTimeout(() => {
			const q = searchInput.value.trim().toLowerCase();
			current = q
				? payload.filter((r) => r.toLowerCase().includes(q))
				: payload;
			renderList(listWrap, current);
		}, 200);
	});
}

function renderList(wrap, items) {
	wrap.innerHTML = "";
	const CHUNK = 100;
	let offset = 0;
	function nextChunk() {
		const frag = document.createDocumentFragment();
		const end = Math.min(offset + CHUNK, items.length);
		for (let i = offset; i < end; i++) {
			const el = document.createElement("div");
			el.className = "result-item";
			el.textContent = items[i];
			frag.appendChild(el);
		}
		offset = end;
		wrap.appendChild(frag);
		if (offset < items.length) {
			const sentinel = document.createElement("div");
			sentinel.className = "sentinel";
			wrap.appendChild(sentinel);
			const obs = new IntersectionObserver(([entry]) => {
				if (entry.isIntersecting) {
					obs.disconnect();
					sentinel.remove();
					nextChunk();
				}
			});
			obs.observe(sentinel);
		}
	}
	nextChunk();
}

function downloadTxt(payload) {
	const blob = new Blob([payload.join("\n")], { type: "text/plain" });
	const a = document.createElement("a");
	a.href = URL.createObjectURL(blob);
	a.download = "payload.txt";
	a.click();
	URL.revokeObjectURL(a.href);
}
