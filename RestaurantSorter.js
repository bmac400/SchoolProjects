 class FluentRestaurants {
   constructor(jsonData) {
     this.data = jsonData;
     
   }
    fromState(stateStr) {
     let ret = this.data.filter(function (ob) {
       return lib220.getProperty(ob, 'state').found && lib220.getProperty(ob, 'state').value === stateStr;
     });
     return new FluentRestaurants(ret);
   }
   ratingLeq(rating) {
     let ret = this.data.filter(function (ob) {
       return lib220.getProperty(ob, 'stars').found && lib220.getProperty(ob, 'stars').value <= rating;
     });
    return new FluentRestaurants(ret);
   }
   ratingGeq(rating) {
     let ret = this.data.filter(function (ob) {
       return lib220.getProperty(ob, 'stars').found && lib220.getProperty(ob, 'stars').value >= rating;
     });
     return new FluentRestaurants(ret);
   }
   //Categories is a array... Need to check each element for category
   category(categoryStr) {
     let ret = this.data.filter(function (ob) {
      //Make sure it has a categories section 
      if(lib220.getProperty(ob, 'categories').found) {
        //Go through all elements in categories. If element is found, return true.
        let arr = lib220.getProperty(ob, 'categories').value;
        if(arr.filter(function(val) {
          if(val === categoryStr) {
            return true;
          }
        }).length !== 0) {
          return true;
       }
      }
       
     });
     return new FluentRestaurants(ret);
   }
   hasAmbience(searchamb) {
     let ret = this.data.filter(function (ob) {
      //Make sure it has a attributes section 
      if(lib220.getProperty(ob, 'attributes').found) {
        let arr = lib220.getProperty(ob, 'attributes').value;

        //Check that there is a ambience in the attributes
        if(lib220.getProperty(arr,'Ambience').found) {
          let amb = lib220.getProperty(arr, 'Ambience').value;
          //Check if amb has value we are looking for
          if(lib220.getProperty(amb, searchamb).found) {
            return lib220.getProperty(amb,searchamb).value;
          }
        }
      }
       
     });
     return new FluentRestaurants(ret);
   }
   bestPlace() {
     //Current max is the restaurant object.
     if(this.data.length !== 0) {
     return this.data.reduce(function(currentMax, testVal){
       //Ensure both have a rating. If one doesn't have rating return one with rating.
       //If both no rating, return first
      let maxStars = -1;
      let testStars = -1;
      if(lib220.getProperty(currentMax, 'stars').found) {
        maxStars = lib220.getProperty(currentMax, 'stars').value;
      }
      if(lib220.getProperty(testVal, 'stars').found) {
        testStars = lib220.getProperty(testVal, 'stars').value;
      }
      if(maxStars === -1 || testStars === -1) {
        if(maxStars === -1 && testStars === -1) {
          return currentMax;
        } else if (maxStars === -1) {
          return testVal;
        } else {
          return currentMax;
        }
      }
      //Check if rating one is better than other rating.

       //If not equal return bigger
      if(maxStars > testStars) {
        return currentMax;
      }
      if(testStars > maxStars) {
        return testStars;
      }
      //If equal, check number of ratings
      let currNum = lib220.getProperty(currentMax, 'review_count').value;
      let testNum = lib220.getProperty(testVal, 'review_count').value; 
      //Return bigger number of ratings
      if(currNum > testNum) {
        return currentMax;
      }
      if(testNum > currNum) {
        return testVal;
      }
      //If both have same. Return current max.
      return currentMax;


 
       

     }, this.data[0]);
    } 
    return [];
     //Filter to find largest element?
     //Tie breaker - More reviews then first element
   }
     
 }
 const testData = [
{
 name: "Applebee's",
 state: "NC",
 stars: 4,
 attributes: {
    Ambience: {
      test: "true"
    }
  },
 review_count: 6,
 },
 {
 name: "China Garden",
 state: "NC",
 stars: 4,
 review_count: 10,
  categories: [
 "Chinese",
 "Restaurants"
 ]
 },
 {
 name: "Beach Ventures Roofing",
 state: "AZ",
 stars: 3,
 review_count: 30,
 },
 {
 name: "Alpaul Automobile Wash",
 state: "NC",
 stars: 3,
 review_count: 30,
 }
]
test('fromState filters correctly', function() {
 let tObj = new FluentRestaurants(testData);
 let list = tObj.fromState('NC').data;
 let amb = tObj.hasAmbience('test').data;
 console.log(amb);
 assert(list.length === 3);
 assert(list[0].name === "Applebee's");
 assert(list[1].name === "China Garden");
 assert(amb[0].name ==="Applebee's");
});
test('bestPlace tie-breaking', function() {
 let tObj = new FluentRestaurants(testData);
 let place = tObj.fromState('NC').bestPlace();
 assert(place.name === 'China Garden');
});
