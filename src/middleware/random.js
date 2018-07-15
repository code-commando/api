'use strict';


function randomStudent(arr, code) {
  for (var i = 0; i < arr.length - 1; i++) {
    var j = i + Math.floor(Math.random() * (arr.length - i));

    var temp = arr[j];
    arr[j] = arr[i];
    arr[i] = temp;
  }
  let results = [arr[0]];
  let count = results.length;

  return {
    count,
    results: results,
    classCode: code,
  };
}

export default randomStudent;

