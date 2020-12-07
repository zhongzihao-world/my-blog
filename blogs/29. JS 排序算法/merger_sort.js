const data = require('./data');

/**
 * 归并排序
 *
 * @param {Array} arr
 *
 */
const merger_sort = (list) => {
  if (list.length <= 1) return list;

  // 基准，切割为左右两半
  const middle_pointer = Math.floor(list.length / 2);
  const left_list = list.slice(0, middle_pointer);
  const right_list = list.slice(middle_pointer, list.length);

  return merge(merger_sort(left_list), merger_sort(right_list));
};

const merge = (left_list, right_list) => {
  // 新数组，长度为左、右序列长度之和
  const result = new Array(left_list.length + right_list.length);
  let k = 0; // 新数组指针

  let i = 0; // 左序列指针
  let j = 0; // 右序列指针
  while (i < left_list.length && j < right_list.length) {
    // 左边比右边大，塞入新数组
    if (left_list[i] <= right_list[j]) {
      result[k++] = left_list[i++];
    } else {
      result[k++] = right_list[j++]
    }
  }
  
  // 若左或者右序列指针还没指到对应的尾部，全部塞入新数组即可
  while (i < left_list.length) {
    result[k++] = left_list[i++];
  }
  while (j < right_list.length) {
    result[k++] = right_list[j++];
  }

  return result;
};


console.log(data);
console.log('---------------------');
console.log(merger_sort(data));
