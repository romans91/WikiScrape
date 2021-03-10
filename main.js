const { getCategories, getPages } = require('./wiki-scrape.js');

main();

async function main() {
    const regions = await getCategories('https://en.wikipedia.org/wiki/Category:Regions_of_New_Zealand', [ 'Auckland' ]);

    const regionCategories = [];
    for (let i = 0; i < regions.length; i++) {
        regionCategories.push(await getCategories(`https://en.wikipedia.org${regions[i]}`, [ 'Tourist' ]));
    }

    const regionLocationTypes = [];
    for (let i = 0; i < regionCategories.length; i++) {
        regionLocationTypes.push(await getCategories(`https://en.wikipedia.org${regionCategories[i]}`, [ 'Beaches' ]));
    }

    const regionLocationPages = [];
    for (let i = 0; i < regionLocationTypes.length; i++) {
        regionLocationPages.push(await getPages(`https://en.wikipedia.org${regionLocationTypes[i]}`, [ 'Category' ]));
    }

    console.log(regionLocationPages);
}