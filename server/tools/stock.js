import YahooFinance from "yahoo-finance2";

const yahooFinance = new YahooFinance();

export async function getStock(company) {
    const results = await yahooFinance.search(company);
    const symbol = results.quotes[0].symbol;
    const quote = await yahooFinance.quote(symbol);
    
    return {
        content: [
            {
                type: "text",
                text: `\n${quote.longName} (${quote.symbol})
Price: $${quote.regularMarketPrice}
Change: ${quote.regularMarketChange.toFixed(2)} (${quote.regularMarketChangePercent.toFixed(2)}%)
High: $${quote.regularMarketDayHigh}
Low: $${quote.regularMarketDayLow}\n`
            }
        ]
    }
}