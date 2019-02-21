(function () {
  const arrowLeft = document.querySelector('.arrow.left');
  const arrowRight = document.querySelector('.arrow.right');
  const arrowUp = document.querySelector('.arrow.up');
  const arrowDown = document.querySelector('.arrow.down');

  const arrows = document.querySelectorAll('.arrow');
  const deviceId = document.querySelector('input');
  const deviceIdCover = document.querySelector('.input .cover');
  const deviceIdContainer = document.querySelector('.input');

  let lastDeviceTouchDown;
  const onDown = () => lastDeviceTouchDown = + new Date();
  const onUp = e => {
    e.preventDefault();
    if(+ new Date() - lastDeviceTouchDown < 500) return;
    deviceIdContainer.classList.remove('readonly');
    deviceId.focus();
  };

  const getId = () => window.localStorage['id'] || saveId('1');
  const saveId = id => {
    window.localStorage.setItem('id', id);
    return id;
  }

  const ACTIONS = {
    'up': () => fetch('https://192.168.1.1/up'),
    'down': () => fetch('https://192.168.1.1/stop'),
    'left': () => fetch('https://192.168.1.1/left'),
    'right': () => fetch('https://192.168.1.1/right')
  }

  arrows.forEach(arrow => {
    arrow.addEventListener('click', e => {
      const direction = e.target.classList[e.target.classList.length - 1];

      ACTIONS[direction]()
    })
  })


  deviceId.addEventListener('keyup', ({keyCode}) => {
    if(keyCode !== 13) return;
    saveId(deviceId.value);
    deviceIdContainer.classList.add('readonly');
    document.activeElement.blur();
  })
  deviceIdCover.addEventListener('mousedown', onDown);
  deviceIdCover.addEventListener('touchstart', onDown);
  deviceIdCover.addEventListener('mouseup', onUp);
  deviceIdCover.addEventListener('touchend', onUp);
  deviceId.value = getId();

  if('serviceWorker' in navigator) {
    navigator.serviceWorker
             .register('/sw.js')
             .then(function() { console.log("Service Worker Registered"); });
  }
})()
