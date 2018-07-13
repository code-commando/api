'use strict';

function randomPairs(classArr) {
  for (var i = 0; i < classArr.length - 1; i++) {
    var j = i + Math.floor(Math.random() * (classArr.length - i));

    var temp = classArr[j];
    classArr[j] = classArr[i];
    classArr[i] = temp;
  }
  let pairs = [];
  for(let i = 0; i < classArr.length-1; i +=2) {
    pairs.push(classArr[i] + ', ' + classArr[i+1]);
  }
  return pairs;

}

export default randomPairs;