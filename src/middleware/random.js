'use strict';


function randomStudent(arr) {
  for (var i = 0; i < arr.length - 1; i++) {
    var j = i + Math.floor(Math.random() * (arr.length - i));

    var temp = arr[j];
    arr[j] = arr[i];
    arr[i] = temp;
  }
  return {
    results: [arr[0]],
  };
}

export default randomStudent;

