/**
 *  To get started, make sure you have Node version >8 installed
 * `npm install` or `yarn install` to install dependencies
 * `npm start` to run the app
 **/

const puppeteer = require("puppeteer");
const HOMEPAGE = "https://www.propelleraero.com";

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

	// wait for 4 seconds (because this fixed a bug!!!!)
	setTimeout(() => { findLongestBlog()},4000);
	console.log("Please be patient :) ...");

	// pass a string to count its words
	async function countWords(someString){

		someString = someString.replace(/(^\s*)|(\s*$)/gi,"");
		someString = someString.replace(/[ ]{2,}/gi," ");
		someString = someString.replace(/\n /,"\n");
		someString = someString.split(' ').length;
		return someString;

	}

	// retreive all links to all the blog posts
	async function findLongestBlog(){

		// DOM manipulation happens in page.evaluate
	 	var allPosts = await page.evaluate( async () => {
			// create an empty array to add links to posts
			var linkToAllPosts = [];
			// create an empty array to add all the word counts
			var elements = document.getElementsByClassName('read-more');
			// loop through all the post previews
			for (let i = 0 ; i < elements.length ; i++){
				// get the href value of all posts
				const linkToPost = elements[i].getAttribute('href');
				// store them in a pre-defined array
				linkToAllPosts.push(linkToPost);
			}
			return Promise.resolve(linkToAllPosts);

		});

		var max = 0;
		var finalTitle;

		console.log("There are ", allPosts.length , " posts to be visited.");

		// for each post call the countWords function
		for (var post of allPosts){
			// open the post
			await page.goto(post);
			// DOM manipulation to get extract the text from an article
			var textContent = await page.evaluate( async () => {
			// extract the text content
			var text = document.getElementsByTagName("article")[0].innerText;
			// extract the title
			var title = document.getElementsByTagName("h1")[0].innerText;
			return {text, title};

		});

			var currentTitle = Object.values(textContent)[1];
			// count the words and calculate the max word counts
			var currentCount = countWords(Object.values(textContent)[0]).then((wCount)=>{
				// update the max value every time.
				if(wCount.valueOf() > max){
					// update max and finalTitle
					max = wCount;
					finalTitle = currentTitle;
				};
			});
		}
		console.log('Article ', '"' ,finalTitle, '"' ,'has the highest word count with ', max, ' words.');

	}
    // close the browser
	browser.close();
})();
