
const data = require('./data');

/**
 * 选择排序
 *
 * @param {Array} list
 */

function selectSort(list) {
  const arr = JSON.parse(JSON.stringify(list));
  let len = arr.length;
  let min = 0;
  let temp;
  for (let i = 0; i < len - 1; i++) {
    min = i;
    for (let j = i + 1; j < len; j++) {
      if (arr[min] > arr[j]) {
        min = j;
      }
    }
    temp = arr[i];
    arr[i] = arr[min];
    arr[min] = temp;
  }
  return arr;
}


console.log(data);
console.log('---------------------');
console.log(selectSort(data));