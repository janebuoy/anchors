import wtf from "wtf_wikipedia";

export function replaceWikiLinks(value) {
	if (Array.isArray(value)) {
		let result = [];
		for (let i = 0; i < value.length; i++) {
			result.push(replaceWikiLink(value[i]));
		}
		return result.join("\n");
	} else {
		return replaceWikiLink(value);
	}
}

function replaceWikiLink(value) {
	const links = wtf(value).links();
	let text = [];
	let result = [];
	text[0] = wtf(value).text();
	if (links.length === 0) {
		return text[0];
	} else {
		for (let i = 0; i < links.length; i++) {
			if (links[i].data.text) {
				const URL =
					"<a href='https://en.wikipedia.org/wiki/" +
					links[i].data.page.split(" ").join("_") +
					"'>" +
					links[i].data.text +
					"</a>";
				text[i] = text[i].replace(links[i].data.text, URL);
				text[i + 1] = text[i].split("</a>").pop();
				result.push(text[i].split("</a>").shift() + "</a>");
				if (i == links.length - 1) {
					result.push(text.pop());
				}
			} else {
				const URL =
					"<a href='https://en.wikipedia.org/wiki/" +
					links[i].data.page.split(" ").join("_") +
					"'>" +
					links[i].data.page +
					"</a>";
				text[i] = text[i].replace(links[i].data.page, URL);
				text[i + 1] = text[i].split("</a>").pop();
				result.push(text[i].split("</a>").shift() + "</a>");
				if (i == links.length - 1) {
					result.push(text.pop());
				}
			}
		}
	}
	return result.join("");
}