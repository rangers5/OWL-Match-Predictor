const brain = require('brain.js');  //Import the NN package
let matchData = require('./csvjson.json');

const network = new brain.NeuralNetwork(); //Set up a NN objest

const team_array = ["Boston Uprising", "London Spitfire", "New York Excelsior", "Paris Eternal", "Toronto Defiant", "Atlanta Reign", "Florida Mayhem", "Houston Outlaws", "Philadelphia Fusion", "Washington Justice", "Chengdu Hunters", "Guangzhou Charge", "Hangzhou Spark", "Seoul Dynasty", "Shanghai Dragons", "Dallas Fuel", "Los Angeles Gladiators", "Los Angeles Valiant", "San Francisco Shock", "Vancouver Titans"]
let matchIds = []

const config = {
   iterations: 100000,
  errorThresh: 0.005
}

const team1 = team_array.indexOf("Dallas Fuel")
const team2 = team_array.indexOf("Houston Outlaws")

matchData.forEach(element => {
   if (matchIds.includes(element.match_id))
   {
      //Do nothing
   }
   else
   {
      matchIds.push(element.match_id); //Make an array of all of the match ids
   }
   element.team_one_name = team_array.indexOf(element.team_one_name); //Replace team names with a number
   element.team_two_name = team_array.indexOf(element.team_two_name);
   element.match_winner = team_array.indexOf(element.match_winner);
   element.map_winner = team_array.indexOf(element.map_winner);
   if(element.team_one_name == element.match_winner) //Sets match winner to 1 iff team 1 won
   {
      element.match_winner = 1
   }
   else
   {
      element.match_winner = 0
   }
});


let mapDifferential = matchIds.slice(0) //Making a copy of match ids for future reference
matchData = matchData.filter((value, index, arr) => { //Filters out all duplicate match ids
   if (matchIds.includes(value.match_id))
   {
      matchIds.splice(matchIds.indexOf(value.match_id) , 1);
      
      return true;
   }
   else
   {
      return false;
   }
})



console.log(`The size of the data set is ${mapDifferential.length}`)

//convert the match data to training data
const trainingData = matchData.map(item => ({
   input:[item.team_one_name/team_array.length,item.team_two_name/team_array.length],
   output:[item.match_winner]
}));

console.log(network.train(trainingData, config)) //Train the NN
const output = network.run([team1/team_array.length,team2/team_array.length]); //Use the NN

console.log(`The probability of the ${team_array[team1]} winning against the ${team_array[team2]} is: ${output}`);