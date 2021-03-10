const request = require('request');
const cheerio = require('cheerio');

async function getCategories(link, filter) {
    const result = cheerio.load(await executeRequest(link));
    const categories = result('.mw-category');

    const categorySubdirectories = [];
    categories.children('.mw-category-group').each((i, elementGroup) => {
        result(elementGroup).find('li').each((j, elementLi) => {
            category = result(elementLi).find('.CategoryTreeItem').find('a').attr('href');
            if (category) {
                if (filter.length > 0) {
                    let categoryWhitelisted = false;

                    filter.forEach(e => {
                        if (category.includes(e)) {
                            categoryWhitelisted = true;
                        }
                    });

                    if (categoryWhitelisted) {
                        categorySubdirectories.push(category);
                    }
                } else {
                    categorySubdirectories.push(category);
                }
            }
        });
    });
    return categorySubdirectories;
}

async function getPages(link, filter) {
    const result = cheerio.load(await executeRequest(link));
    const pages = result('.mw-category-generated');

    const pageTitles = [];
    result(pages).find('li').each((i, element) => {
        const title = result(element).find('a').attr('title');
        if (!title.includes('Category:')) {
            pageTitles.push(title);
        }
    });

    return pageTitles;
}

function executeRequest(url) {
    return new Promise(function (resolve, reject) {
        request(url, function (error, res, body) {
            if (!error && res.statusCode == 200) {
                resolve(body);
            } else {
                reject(error);
            }
        });
    });
}

module.exports = { getCategories, getPages };