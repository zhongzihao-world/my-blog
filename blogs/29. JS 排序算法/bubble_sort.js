const data = require('./data');

/**
 * 冒泡排序
 *
 * @param {Array} list
 *
 */

const bubbleSort = (list) => {
  const len = list.length;
  let k = len - 1;
  let last_index = 0; // 最后一次交换的位置
  for (let i = 0; i < len - 1; i++) {
    let is_change = false;// 是否有交换
    for (let j = 0; j < k; j++) {
      if (list[j] > list[j + 1]) {
        is_change = true;
        // 交换值
        [list[j], list[j + 1]] = [list[j + 1], list[j]];
        last_index = j;
      }
    }
    k = last_index;
    // 已经排好序了
    if (!is_change) break;
  }
  return list;
}


console.log(data);
console.log('---------------------');
console.log(bubbleSort(data));


