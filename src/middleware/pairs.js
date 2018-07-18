'use strict';

function randomPairs(classArr, code) {
  for (var i = 0; i < classArr.length - 1; i++) {
    var j = i + Math.floor(Math.random() * (classArr.length - i));
    var temp = classArr[j];
    classArr[j] = classArr[i];
    classArr[i] = temp;
  } 

  let pairs = [];

  for(let i = 0; i < classArr.length-1; i +=2) {
    pairs.push([classArr[i] + ', ' + classArr[i+1]]);
  }

  if(classArr.length %2 === 1) {
    let extra;
    extra = classArr.pop();
    pairs[pairs.length -1 ].push(extra);
  }

  var newArr = [];
  for (let k = 0; k < pairs.length; k ++ ){
    newArr.push(pairs[k].join().split(','));
  }

  let count = pairs.length;

  return {
    count,
    results:  newArr,
    classCode: code,
  };
}

export default randomPairs;
