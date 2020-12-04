const data = [];
let len = 20;
while (len > 0) {
  data.push(Math.floor(Math.random() * 100));
  len--;
}

module.exports = data;
