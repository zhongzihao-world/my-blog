# Object 和 map

| -    | Object                                    | Map           |
| ---- | ----------------------------------------- | ------------- |
| key  | 简单数据类型（整数，字符串或者是 symbol） | 所有数据类型  |
| 顺序 | 无序                                      | 遵循插入顺序  |
| 继承 | -                                         | 继承自 Object |

---

| -    | Object           | Map                                      |
| ---- | ---------------- | ---------------------------------------- |
| 构造 | new Object()，{} | new Map(), new Map(Arrany<entry object>) |
| 取值 | . []             | get(key)                                 |

---

# 简单实用

## 1. 创建

```bash
# Object
let obj = {};
let obj = {name:'小豪', age:24}

# Map
let map = new Map();
let map = new Map([['name', '小豪'],['age', 24]]);
```

## 2. 添加属性

```bash
# Object
obj.name = '小豪';
obj.age = 24;

# Map
map.set("name",'小豪');
map.set("age",'24');
```

## 3. 获取长度

```bash
# Object
Object.keys(obj).length;

# Map
map.size;
```

## 4. 取值

```bash
# Object
obj.name;

# Map
map.get('age');

```

## 5. 遍历

```bash
# Object
Object.keys(obj).forEach(key=> {});

# Map
map.forEach(value=> {});
```

## 6. 删除属性

```bash
# Object
delete obj.name

# Map
map.delete('name')
```

## 7. 判断 key 是否在对象中

```bash
# Object
'name' in obj

# Map
map.has('name')
```

## 8. 清空

```bash
# Object
obj = {};

# Map
map.clear();
```

# 何时使用 Map ，何时使用 Object

- 当所要存储的是简单数据类型，并且 key 都为字符串或者整数或者 Symbol 的时候，优先使用 Object ，因为 Object 可以使用 字符变量 的方式创建，更加高效
- 当需要在单独的逻辑中访问属性或者元素的时候，应该使用 Object
- JSON 直接支持 Object，但不支持 Map
- Map 是纯粹的 hash， 而 Object 还存在一些其他内在逻辑，所以在执行 delete 的时候会有性能问题。所以写入删除密集的情况应该使用 Map
- Map 会按照插入顺序保持元素的顺序，而 Object 做不到
- Map 在存储大量元素的时候性能表现更好，特别是在代码执行时不能确定 key 的类型的情况
