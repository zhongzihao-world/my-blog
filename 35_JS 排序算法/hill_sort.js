const data = require('./data');

/**
 * 希尔排序
 *
 * @param {Array} list
 *
 */

const hill_sort = (list) => {
  const len = list.length;
  let gap = 1;
  while (gap < len / 3) {
    gap = gap * 3 + 1;
  }
  while (gap >= 1) {
    for (let i = gap; i < len; i++) {
      const temp = list[i];
      let j = i - gap;
      while (j >= 0 && list[j] > temp) {
        list[j + gap] = list[j];
        j = j - gap;
      }
      list[j + gap] = temp;
    }
    // 重新设置 gap ，向下取整
    gap = Math.floor(gap / 3);
  }
  return list;
}


console.log(data);
console.log('---------------------');
console.log(hill_sort(data));


