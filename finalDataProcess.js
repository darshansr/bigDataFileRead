var fs = require('fs');
require('es6-promise').polyfill();
require('isomorphic-fetch');
var finalValue={}
var pos=[]
var wordsArray =[]


function splitByWords (text) {
    // split string by spaces 
    var wordsArray = text.split(/\s+/);
    return wordsArray;
}

  function createWordMap (wordsArray) {
    // create map for word counts
    var wordsMap = {};
    wordsArray.forEach(function (key) {
      if (wordsMap.hasOwnProperty(key)) {
        wordsMap[key]++;
      } else {
        wordsMap[key] = 1;
      }
    });
    return wordsMap;
  }
  
  
  function sortByCount (wordsMap) {
    // sort by count in descending order
    var finalWordsArray = [];
    finalWordsArray = Object.keys(wordsMap).map(function(key) {
      return {
        name: key,
        total: wordsMap[key]
      };
    });
    finalWordsArray.sort(function(a, b) {
      return b.total - a.total;
    });
    return finalWordsArray;
  }
  

  function getTopTenOcurrance(finalWordsArray){
      // get the top Ocurrance of the word
    finalWordsArray.slice(0,10).forEach(function(data) {
         searchInDic(data.name,data.total)
    });
  }

  function searchInDic(text,count){
      //fetch the POS and SYS and display the occurance of the word
   var output={}
   return fetch('https://dictionary.yandex.net/api/v1/dicservice.json/lookup?key=dict.1.1.20170610T055246Z.0f11bdc42e7b693a.eefbde961e10106a4efa7d852287caa49ecc68cf&lang=en-ru&text='+text)
    .then(data=>{return data.json()})
    .then(res=>{
        pos=[];
        res.def.forEach(function(response){
            output={};
            if(response.pos!=null)
            pos.push(response.pos);
            output={
                        pos:pos,
                        count:count
                    };
            })
            finalValue={word:text,
                output:output};
        return console.log(JSON.stringify(finalValue));
        })
    };

fetch("http://norvig.com/big.txt").then(function(response) {
    response.text().then(function(text) {
      //use createWriteStream for big size data then 
        const wstream = fs.createWriteStream('big.txt',{encoding: 'utf8'});
        wstream.on('finish', function () {
            console.log('file has been written');
        });
        wstream.write(text);
        wstream.end(function () { console.log('reading file and counting the occurance'); 
            const stream = fs.createReadStream('big.txt', {encoding: 'utf8'});
            //better to create the createReadStream for big size data then readFile method 
            stream.on('data',data =>{
                //read the file data as a Stream 
                var newwordsArray = splitByWords(data);
                wordsArray = wordsArray.concat(newwordsArray);
            })
            stream.on('close', () => {
                //close the Stream  
                var wordsMap = createWordMap(wordsArray);
                var finalWordsArray = sortByCount(wordsMap);
                getTopTenOcurrance(finalWordsArray)
            });
        });
    }).catch(function(err){
        console.log('error in reading and writting ',err);
    });
  });
