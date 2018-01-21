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
	console.log("Please be patient...");

	// pass a string to count its words
	async function countWords(string){
		string = string.replace(/(^\s*)|(\s*$)/gi,"");
		string = string.replace(/[ ]{2,}/gi," ");
		string = string.replace(/\n /,"\n");
		string = string.split(' ').length;
		// return Promise.resolve(string); // returns an object
		return string;
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

		// for each post call the countWords function
		for (var post of allPosts){
			// open the post
			await page.goto(post);
			// DOM manipulation to get extract the text from an article
			var textContent = await page.evaluate( async () => {
			// fetch the text content
				var text = document.getElementsByTagName("article")[0].innerText;
				return Promise.resolve(text);
			});

			// count the words
			currentCount = countWords(textContent);
			console.log(typeof currentCount, currentCount);

			// calculate the max
			if (currentCount.valueOf > max) {
				max = currentCount;
				console.log("Max is ", max);
			}
		}

	}
    // close the browser
})();

































// to get the text of an article
// var text = document.getElementsByTagName("article")[0].innerText
// countWords('hi my name is mahsa').then(number => console.log(number));
// await page.waitForNavigation({waitUntil: 'load'}).then(() =>console.log('Test'));
// linkToAllPosts.push(linkToPost);
// findLongestBlog().then(mahsa => console.log(mahsa));

// go to the link
// await page.goto(linkToPost);
// wait untill dom is loaded
// await page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 0 });
// // get the text of the article
//  var string = document.getElementsByTagName("article")[0].innerText;
// string = string.replace(/(^\s*)|(\s*$)/gi,"");
// string = string.replace(/[ ]{2,}/gi," ");
// string = string.replace(/\n /,"\n");
// length = string.split(' ').length;
// console.log(length);
