const data = require('./data');

/**
 * 堆排序
 *
 * @param {Array} list
 *
 */

const heap_sort = (list) => {
  const len = list.length;
  for (let i = Math.floor(len - 1 / 2); i >= 0; i--) {
    maxheap_down(list, i, len - 1);
  }
  console.log(list);
};

const maxheap_down = (list, start, end) => {
  let c = start;
  let l = c * 2 + 1;
  let tmp = list[c];

  for (; l <= end; c = l, l = 2 * l + 1) {
    if (l < end && list[l] < list[l + 1]) {
      l++;
      if (tmp >= list[l]) {
        break;
      }
      else {
        list[c] = list[l];
        list[l] = tmp;
      }
    }

  }

};





console.log(data);
console.log('---------------------');
console.log(heap_sort(data, data.length));


