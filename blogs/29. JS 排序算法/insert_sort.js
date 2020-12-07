const data = require('./data');

/**
 * 插入排序
 *
 * @param {Array} list
 */

const insertSort = (list) => {
  let len = list.length
  for (let i = 1; i < len; i++) {
    const temp = list[i];
    let j = i - 1;
    while (j >= 0 && list[j] > temp) {
      list[j + 1] = list[j];
      j--;
    }
    list[j + 1] = temp;
  }
  return list;
};


console.log(data);
console.log('---------------------');
console.log(insertSort(data));
