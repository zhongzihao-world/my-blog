/**
 * url参数截取
 * @param {String} param_name 参数名
 */
function get_query_param(param_name) {
  const reg = new RegExp(`(?<=${param_name}=)[^&]*`, 'g');
  const result = window.location.search.substr(1).match(reg);
  return result ? result[0] : '';
}

/**
 * 校验正数（不包括0），精确到一位小数点
 * @param {String} check_num
 */
function check_is_positive_integer_one(check_num) {
  const reg = /^(?!0+(\.0+)?$)([1-9]\d*|0)(\.\d{1})?$/g;
  return reg.test(check_num);
}
