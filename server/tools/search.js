export async function searchWeb(query) {
    const url = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`;
    const res = await fetch(url);
    const data = await res.json();

    const answer = data.AbstractText || data.Answer || "No instant answer found.";
    const source = data.AbstractSource || "";
    const sourceURL = data.AbstractURL || "";

    return {
        content: [
            {
                type: "text",
                text: `${answer}${source ? `\n\nSource: ${source} — ${sourceURL}` : ""}`
            }
        ]
    }
}