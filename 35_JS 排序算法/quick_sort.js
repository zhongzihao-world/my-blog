const data = require('./data');

/**
 * 快速排序
 *
 * @param {Array} arr
 *
 */
function quickSort(list) {
  let arr = JSON.parse(JSON.stringify(list));
  if (arr.length <= 1) return arr;
  const basic = arr.splice(Math.floor(arr.length / 2), 1); // 基准点
  const left_arr = [];
  const right_arr = [];
  for (let i = 0, len = arr.length; i < len; i++) {
    if (arr[i] <= basic) {
      left_arr.push(arr[i]);
    } else {
      right_arr.push(arr[i]);
    }
  }
  return quickSort(left_arr).concat(basic, quickSort(right_arr));
}

console.log(data);
console.log('---------------------');
console.log(quickSort(data));
