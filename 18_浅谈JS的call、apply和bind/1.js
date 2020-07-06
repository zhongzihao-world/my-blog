class Man {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
  print() {
    console.log(this.name, this.age);
  }
  extend = {
    name: 'inside',
    age: 99,
    print: function print() {
      console.log(this.name, this.age);
    }.bind(this),
  };
}

const man = new Man('小明', 18);
console.log(man.print()); // 小明 18
console.log(man.extend.print()); // inside 99