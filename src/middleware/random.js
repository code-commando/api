'use strict';


function randomStudent(arr, model) {
  for (var i = 0; i < arr.length - 1; i++) {
    var j = i + Math.floor(Math.random() * (arr.length - i));

    var temp = arr[j];
    arr[j] = arr[i];
    arr[i] = temp;
  }
  let pickedStudent = arr[0];


  // pickedStudent.update(pickedStudent, {$set: {picked: true}});
  model.findByOneAndUpdate({_id: pickedStudent._id}, {$set: {picked: true}}, {new: true});

  return {
    count: 1,
    results: pickedStudent.name,
    classCode: pickedStudent.classCode,
  };
}

export default randomStudent;

