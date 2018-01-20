/**
 *  To get started, make sure you have Node version >8 installed
 * `npm install` or `yarn install` to install dependencies
 * `npm start` to run the app
 **/

const puppeteer = require("puppeteer");
const HOMEPAGE = "https://www.propelleraero.com";

//ASYNC START
(async () => {
    // launch puppeteer ({headless: true} runs without opening chrome)
    const browser = await puppeteer.launch({ headless: false });
    // create a new page
    const page = await browser.newPage();
    // navigate to the homepage
    await page.goto(HOMEPAGE);

	// click on the burger menu
	await page.click('.navbar-toggler-right');

	// click the blog link and navigate to the blog page
	page.click('#menu-item-38');
	await page.waitForNavigation({waitUntil: 'load', timeout: 0});

	// set a timeout after visiting the page
	setTimeout(() => { getBlogPosts() },10000);

	// retreive all links to all the blog posts
	async function getBlogPosts(){

		let result = await page.evaluate(() => {
			// create an empty array to add links to posts
			let linkToAllPosts = [];
			// select all elements from the read-more class
			let elements = document.getElementsByClassName('read-more');
			// loop through all the posts
			for (let i = 0 ; i < elements.length ; i++){
				const linkToPost = elements[i].getAttribute('href');
				linkToAllPosts.push(linkToPost);
			}
		});

	}

	// report the blog post with the highest word count

    // close the browser
})();

//ASYNC END



// // launch puppeteer
// puppeteer.launch({ headless: false }).then(browser => {
// 	// create a new page
// 	browser.newPage()
// 		 // navigate to homepage
//          .then(page => page.goto(HOMEPAGE))
// 		 // click on burger menu
// 		 .then(page => page.click('.navbar-toggler-right'))
// 		 // click on the blog link
//          .then(page => page.click('#menu-item-38'))
// 		 // wait for the blog page to be loaded
//          .then(page => page.waitForNavigation({waitUntil: 'load'}));
// });


// await page.waitForNavigation({waitUntil: 'load'}).then(() =>console.log('Test'));
