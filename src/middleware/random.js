'use strict';


function randomStudent(arr, model) {
  let index = Math.floor(Math.random() * (arr.length -1));

  let pickedStudent = arr[index];

  model.findByIdAndUpdate(pickedStudent._id, {$set:{ picked: true}}, {new: true})
    .then(data => {
      console.log(data);
    });
  
  return {
    count: 1,
    results: pickedStudent.name,
    classCode: pickedStudent.classCode,
  };
}

export default randomStudent;

