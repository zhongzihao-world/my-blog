const data = require('./data');

/**
 * 插入排序
 *
 * @param {Array} list
 */

function insertSort(list) {
  const arr = JSON.parse(JSON.stringify(list));
  for (let i = 1, len = arr.length; i < len; i++) {
    const temp = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > temp) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = temp;
  }
  return arr;
}

console.log(data);
console.log('---------------------');
console.log(insertSort(data));
