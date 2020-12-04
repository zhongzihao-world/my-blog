
const drawWaterMark = (text = '小豪看世界') => {
  const sin = Math.sin(Math.PI / 4.5);
  const cos = Math.cos(Math.PI / 4.5);
  const canvas = document.createElement('canvas')
  canvas.width = 200;
  canvas.height = 100;
  const ctx = canvas.getContext('2d');
  ctx.transform(cos, -sin, sin, cos, 0, 0);
  ctx.font = '16px';
  ctx.fillStyle = 'rgba(0,0,0,.4)';
  ctx.fillText(text, 80, 140);
  ctx.fillText(text, -30, 100);
  return canvas.toDataURL('image/png')
};

(() => {
  const wrap = document.querySelector('.wrap2');
  // wrap.style.backgroundImage = `url(${drawWaterMark()})`;

  const style = document.createElement('style');
  style.type = 'text/css';
  style.innerHTML = `
    .wrap2 {
      background-image: url(${drawWaterMark()});
    }
  `;
  document.body.appendChild(style);
})();

