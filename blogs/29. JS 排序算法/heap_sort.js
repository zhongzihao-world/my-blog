const data = require('./data');

/**
 * 堆排序
 *
 * @param {Array} list
 *
 */

const heap_sort = (list) => {
  let len = list.length;
  for (let i = Math.floor(len - 1 / 2); i >= 0; i--) {
    max_heap_down(list, i, len - 1);
  }
  for (let i = len - 1; i >= 0; i--) {
    swap(list, 0, i);
    len--;
    max_heap_down(list, 0, len);
  }
  return list;
};

const max_heap_down = (list, i, len) => {

  let left = i * 2 + 1; // 左子节点
  let ritght = i * 2 + 2; // 右子节点
  let largest = i;

  if (left < len && list[left] > list[largest]) {
    largest = left;
  }
  if (ritght < len && list[ritght] > list[largest]) {
    largest = ritght;
  }

  if (largest !== i) {
    swap(list, i, largest);
    max_heap_down(list, largest, len);
  }

};

const swap = (list, i, j) => {
  [list[i], list[j]] = [list[j], list[i]];
}


console.log(data);
console.log('---------------------');
console.log(heap_sort(data, data.length));


