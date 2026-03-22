export async function checkWeather(city) {
    const res = await fetch(`https://wttr.in/${city.toLowerCase()}?format=%C+%t`);
    const weather = await res.text();

    return {
        content: [
            {
                type: "text",
                text: `The weather in ${city.charAt(0).toUpperCase() + city.slice(1)} is ${weather}"`
            }
        ]
    }
}