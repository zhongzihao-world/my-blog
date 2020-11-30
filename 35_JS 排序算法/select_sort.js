
const data = require('./data');

/**
 * 选择排序
 *
 * @param {Array} list
 */

const selectSort = (list) => {
  let len = list.length;
  let min = 0;
  for (let i = 0; i < len - 1; i++) {
    min = i;
    for (let j = i + 1; j < len; j++) {
      if (list[min] > list[j]) {
        min = j;
      }
    }
    // 每一轮比较完，交换 i 和 min 位置
    [list[i], list[min]] = [list[min], list[i]];
  }
  return list;
}


console.log(data);
console.log('---------------------');
console.log(selectSort(data));