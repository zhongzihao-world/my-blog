const data = require('./data');

/**
 * 快速排序
 *
 * @param {Array} list
 *
 */
const quickSort = (list) => {
  if (list.length <= 1) return list;
  // 基准点
  const basic = list.splice(Math.floor(list.length / 2), 1);
  const left_arr = [];
  const right_arr = [];
  for (let i = 0, len = list.length; i < len; i++) {
    if (list[i] <= basic) {
      left_arr.push(list[i]);
    } else {
      right_arr.push(list[i]);
    }
  }
  return quickSort(left_arr).concat(basic, quickSort(right_arr));
};


console.log(data);
console.log('---------------------');
console.log(quickSort(data));
