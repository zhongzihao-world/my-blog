const addAttributes = (el, attributes) => {
  Object.keys(attributes).forEach(attr => {
    el.style[attr] = attributes[attr];
  });
};
const createWaterMarkElement = (text = '小豪看世界') => {
  const div = document.createElement('div');
  div.innerText = text;
  addAttributes(div, {
    position: 'absolute',
    fontSize: `16px`,
    color: '#000000',
    opacity: 0.2,
    transform: `rotate(-30deg)`,
    userSelect: 'none',
  });
  return div;
};

(() => {
  const wrap = document.querySelector('.wrap1');
  const { clientWidth, clientHeight } = wrap;
  const waterHeight = 100;
  const waterWidth = 180;
  // 能放下几行几列
  const [columns, rows] = [Math.ceil(clientWidth / waterWidth), Math.ceil(clientHeight / waterHeight)]
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j <= rows; j++) {
      // 生成水印块
      const watcerMarkElement = createWaterMarkElement();
      // 动态设置偏移值
      addAttributes(watcerMarkElement, {
        width: `${waterWidth}px`,
        height: `${waterHeight}px`,
        left: `${waterWidth + (i - 1) * waterWidth + 10}px`,
        top: `${waterHeight + (j - 1) * waterHeight + 10}px`,
      });
      wrap.appendChild(watcerMarkElement)
    }
  }
})();

