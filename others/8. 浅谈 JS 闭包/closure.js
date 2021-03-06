var a = 10;
function fn() {
  a = 0;
  return function (b) {
    return b + a++;
  };
}

const f = fn();
console.log(f);
console.log(f(5)); // 5
console.log(fn()(5)); // 5
console.log(f(5)); // 6
console.log(a); // 2