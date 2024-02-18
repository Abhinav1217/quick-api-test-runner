import ApiRunner from "./core/ApiRunner.js";

const base_url = "https://deckofcardsapi.com/api/deck";

const token = "";
const apiRunner = new ApiRunner(base_url, token);
apiRunner.setMethod("GET")
apiRunner.setScope("Cards")
const drawCount = [2,3,4,5]




drawCount.forEach(async count => {
	let url = `${base_url}/new/draw/?count=${count}`;
	apiRunner.setURL(url);
	await apiRunner.makeRequest(); // currently it can log from within the function.

});
