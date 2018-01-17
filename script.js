const btnFile = document.querySelector('.file');
const btnCamera = document.querySelector('.camera');
const drawCanvas = document.querySelector('.brush');
const inputFile = document.querySelector("input[type=file]");
const container = document.querySelectorAll('.container')[0];
const sendCanvas = document.querySelector('.send-canvas');
const video = document.querySelector('video');

inputFile.addEventListener('change', addFile);
btnCamera.addEventListener('click', useWebCamera);
drawCanvas.addEventListener('click', draw)
container.addEventListener('drop', onFilesDrop);
sendCanvas.addEventListener('click', sendCns)
container.addEventListener('dragover', event => {
  event.preventDefault();
  });



function useWebCamera() {
  document.getElementById('photo').classList.remove('hidden');

  navigator.mediaDevices
    .getUserMedia({video: true, audio: false})
    .then((stream) => {
      video.src = URL.createObjectURL(stream);
      video.play();
    })
    .catch(err => console.warn('oh noes'));
};



function draw() {
  console.log('draw');
  document.querySelector('#draw').classList.remove('hidden');
};

function sendCns() {
  console.log('send canvas!');
  document.querySelector('#draw').classList.add('hidden');
  };


let canvasBody = document.getElementById("draw-canvas"),
    canvas = canvasBody.getContext("2d"),

    w = canvasBody.width = canvas.width = window.innerWidth,
    h = canvasBody.height = canvas.height = window.innerHeight,
    tick = 0,
    newTick = tick + 1,
    painting = false;
    lastX = 0,
    lastY = 0,
    canvas.lineJoin = 'round';
    canvas.lineCap = 'round';
    canvas.lineWidth = 20;
    canvas.strokeStyle = "blue";


  // рисуем
  // при нажатии левой клавиши ловим положение курсора, чтобы с этой точки рисовать линию (изначально координаты (0, 0) )
  canvasBody.onmousedown = function(evt) {
    const posX = evt.pageX,
          posY = evt.pageY;
    [lastX, lastY] = [posX, posY]
    painting = true;
  };

  // не рисуем
  canvasBody.onmouseup = function() {
    painting = false;
  };


  // курсор за гранью полотна
  canvasBody.addEventListener("mouseleave", (evt) => {
    painting = false;
  });

  // чистим холст
  canvasBody.addEventListener('dblclick',  function() {
    canvas.clearRect(0, 0, w, h);
  });

  // процесс рисования
  canvasBody.addEventListener("mousemove", function(evt) {
    const posX = evt.pageX,
          posY = evt.pageY;

    // если рисуем
    if(painting) {
      ++tick;

      // если пошла итерация
      if(newTick) {
        canvas.beginPath();
        canvas.moveTo(lastX, lastY);
        canvas.lineTo(posX, posY);
        canvas.stroke();
        [lastX, lastY] = [posX, posY];
        console.log('Пошла рисовка!', canvas.lineWidth);
      }
    }
});


function onFilesDrop(event) {
  event.preventDefault();
  // Загрузка фото
  const files = Array.from(event.dataTransfer.files);
  files.forEach(file => {
    console.log(file.name)
  });
};


function addFile(event) {
  const files = Array.from(event.target.files);

  files.forEach(file => {


    // const row = document.createElement('div');
    // row.className = 'row';
    //
    // const col = document.createElement('div');
    // col.className = 'col s6';
    //
    // const card = document.createElement('card');
    // card.className = 'card';
    //
    // const imgContainer = document.createElement('div');
    // imgContainer.className = 'card-image';
    //
    // const img = document.createElement('div');
    // img.src = URL.createObjectURL(file);
    // console.log(img.src)
    //
    // img.addEventListener('load', event => {
    // URL.revokeObjectURL(event.target.src);
    // });
    //
    // imgContainer.appendChild(img);
    // card.appendChild(imgContainer);
    // col.appendChild(card);
    // row.appendChild(col);
    // container.appendChild(row);
    console.log(file.name)
  })

  // files.forEach(file => {
  //   console.log(file.name)
  // });
}
