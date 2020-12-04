document.querySelector('#app').style.color = 'yellow';

Promise.resolve().then(() => {
  document.querySelector('#app').style.color = 'red';
});

setTimeout(() => {
  document.querySelector('#app').style.color = 'blue';
  Promise.resolve().then(() => {
    for (let i = 0; i < 99999; i++) {
      console.log(i);
    }
  });
  // 60HZ刷新频率，保证在下一次渲染之后再执行该宏任务
}, 17);