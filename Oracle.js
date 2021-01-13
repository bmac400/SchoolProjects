function generateInput(n) {
  let result = [];
  //Each company/ Canidate
  for(let x = 0; x < n; ++x) {
    let prefrences = [];
  
    // Ensures we don't give a company/entity the same prefrence. 
    let foundValues = [];
    for(let j = 0; j < n; ++j) {
      foundValues.push(false);
    }
    for(let i = 0; i < n; ++i) {
      let randomVal = randomInt(0,n);
      while(foundValues[randomVal]){
        randomVal = randomInt(0,n);      
      }
      foundValues[randomVal] = true;
      prefrences.push(randomVal);

    //Set random numbers for prefrences... Can not have same number twice for single entity       
    }
    //Put values found for entity into resultant array
    result.push(prefrences);
  }
  return result;
}
//type Hire = { company: number, candidate: number }
function oracle(f) {
let numTests = 1; // Change this to some reasonably large value
  for (let i = 0; i < numTests; ++i) {
    let n = 6; // Change this to some reasonable size
    let companies = generateInput(n);
    let candidates = generateInput(n);
    let hires = f(companies, candidates);
    test('Hires length is correct', function() {
      assert(companies.length === hires.length);
    });
 // Write your tests here
 // Test hires make sure they each have a valid object and each value is within range of accepted values
    test('Each object has acceptable values', function() {
      for(let x = 0; x < hires.length; ++x) {
        assert(hires[x].company >= 0 && hires[x].company < n);
        assert(hires[x].candidate >= 0 && hires[x].candidate < n);
      }
    });
    test('Each company/Canidate only appears once', function() {
      let result = true;
      for(let x = 0; x < hires.length - 1; ++x) {
        for(let j = x + 1; j < hires.length; ++j) {
          if(hires[x].company === hires[j].company) {

            result = false;
          }
          if(hires[x].candidate === hires[j].candidate) {
            result = false;
          }
        }
      }
      assert(result);
    });
    test('Check Stable Result', function() {
      //Check each matching
      let result = true;
      for(let i = 0; i < hires.length - 1; ++i) {
        for(let j = i + 1; j < hires.length; ++j) {
          let match1 = hires[i];
          let company1 = companies[match1.company];
          let candidate1 = candidates[match1.candidate];
          let match2 = hires[j];
          let company2 = companies[match2.company];
          let candidate2 = candidates[match2.candidate];
          //Check if company1 would prefer to have other canidate... Lower = better
          if(findPrefrence(company1, match1.candidate) >= findPrefrence(company1, match2.candidate)) {
             //Check if candate 2 would prefer to work for other company
             if(findPrefrence(candidate2, match2.company) >= findPrefrence(candidate2, match1.company)) {
               result = false
             }
        }
        if(findPrefrence(company2, match2.candidate) >= findPrefrence(company2, match1.candidate)) {
             //Check if candate 1 would prefer to work for other company
             if(findPrefrence(candidate1, match1.company) >= findPrefrence(candidate1, match2.company)) {
               result = false
             }
        }
      }
    }
      assert(result);

    });
 //Somehow test that prefrences are observed.
 
}

}
function findPrefrence(arr, item) {
  let result = 0;
  for(let x = 0; x < arr.length; ++x) {
    if(arr[x] === item) {
      result = x;

      return result;
    }
  }
}
function runOracle(f) {
  let numTests = 1; // Change this to some reasonably large value
  for (let i = 0; i < numTests; ++i) {
    let n = 6; // Change this to some reasonable size
    let companies = generateInput(n);
    let candidates = generateInput(n);
    let run = f(companies, candidates);
    let hire = run.out;
    let offers = run.trace;
    // console.log(offers);
    // console.log("split here");
    // console.log(hire);
    test('Fuck Oracle', function() {
       let matches = [];
       let matchedCanidates = [];
       let matchedCompanies = [];
      for(let x = 0; x < offers.length; ++x) {
        //Check if Unmatched. If unmatched force offer
        //Result is a array with two numbers. First is company, second is canidate
  
        
        if(offers[x].fromCo) {
          //Check to see if there is already a match with canidate
          if(matchedCanidates.indexOf(offers[x].to) === -1) {
            matches.push([offers[x].from, offers[x].to]);
            matchedCanidates.push(offers[x].to);
            matchedCompanies.push(offers[x].from);
          } 
          else {
            //Matches values;
            let index = matchedCanidates.indexOf(offers[x].to);
            let candnum = matches[index][1];
            if(findPrefrence(candidates[candnum], offers[x].from) < findPrefrence(candidates[candnum], matches[index][0])) {
              matches[index] = [candnum, offers[x].from];
              matchedCanidates[index] = offers[x].to;
              matchedCompanies[index] = offers[x].from;
             }

          }
          //If either one is matched. Check priority
          //If higher priority for person recieving offer, then accept offer
        } else {
           if(matchedCompanies.indexOf(offers[x].to) === -1) {
            matches.push([offers[x].to, offers[x].from]);
            matchedCanidates.push(offers[x].from);
            matchedCompanies.push(offers[x].to);
          } else {
            //Matches values;
            let index = matchedCompanies.indexOf(offer[x].to);
            let compnum = matches[index][1];
            if(findPrefrence(companies[compnum], offers[x].from) < findPrefrence(companies[compnum], matches[index][1])) {
               matches[index] = [offers[x].from, compnum];
               matchedCanidates[index] = (offers[x].from);
               matchedCompanies[index] = (offers[x].to);
             }

          }
          //If either one is matched. Check priority
          //If higher priority for person recieving offer, then accept offer
        }
        
       
        
        
        //Current partner is now unmatched
        //Else do nothing


      }
      for(let x = 0; x < hire.length; ++x) {
        if(matchedCanidates.indexOf(hire[x].candidate) !== matchedCompanies.indexOf(hire[x].company))
        {
          assert(false);
        }
      }
      assert(true);
      //Finds value and returns value of where it is. Returns -1 if not found.
      

           


      });
  test('Ensure offers follow rules', function() {
      //Check offers follow correct order
      let result = true;
      let companiesChecked = [];
      for(let i = 0; i < n; ++i) {
        companiesChecked.push(false);
      }
      //Make array of all offers from single company
      for(let comp = 0; comp < n; ++comp) {
        let offersFromComp = [];
        //Go through and check if element is from company. If it is, then add to index
        for(let index = 0; index < offers.length; ++index) {
          if(offers[index].fromCo && offers[index].from === comp) {
            offersFromComp.push(index);
          }
        }

        //Ensure that companies offers follow prefrences
        for(let j = 0; j < offersFromComp.length; ++j) {
          if(companies[comp][j] !== offers[offersFromComp[j]].to) {
            return false;
          }
        
        }
      }
      assert(result);
      
    });

}
}
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
//oracle(wheat1);
//oracle(chaff1);
const oracleLib = require('oracle');
runOracle(oracleLib.traceWheat1);
runOracle(oracleLib.traceChaff1);