'use strict';

const btnFile = document.querySelector('.file');
const btnCamera = document.querySelector('.camera');
const drawCanvas = document.querySelector('.brush');
const inputFile = document.querySelector("input[type=file]");
const container = document.querySelectorAll('.container')[0];
const sendCanvas = document.querySelector('.send-canvas');
const video = document.querySelector('video');
const image = document.querySelector('.photo-camera');
const takePhotoBtn = document.querySelector('.take-photo');
const deletePhotoBtn = document.querySelector('.delete-photo');
const sendPhotoBtn = document.querySelector('.send-photo');

// загрузка файла
inputFile.addEventListener('change', addFile);

// камера
btnCamera.addEventListener('click', useWebCamera);

takePhotoBtn.addEventListener('click', takePhoto);
deletePhotoBtn.addEventListener('click', deletePhoto);
sendPhotoBtn.addEventListener('click', sendPhoto);

// рисование на хослте
drawCanvas.addEventListener('click', draw);
sendCanvas.addEventListener('click', sendCns)

// перетаскивание файла
container.addEventListener('drop', onFilesDrop);
container.addEventListener('dragover', event => {
  event.preventDefault();
  container.style.border = '2px dashed grey';
  });


function useWebCamera() {
  document.getElementById('photo').classList.remove('hidden');
  navigator.mediaDevices
    .getUserMedia({video: true, audio: false})
    .then((stream) => {
      video.src = URL.createObjectURL(stream);
      video.play();
    })
    .catch(err => console.log("There was an error with accessing the camera stream: " + err.name, err.message));
};


function takePhoto() {
   sendPhotoBtn.classList.remove("disabled");
   deletePhotoBtn.classList.remove("disabled");
   video.pause();
};

function deletePhoto() {
  sendPhotoBtn.classList.add("disabled");
  deletePhotoBtn.classList.add("disabled");
  video.play();
}

// момент снимка (canvas)
function catchPhoto() {
  const photoCanvas = document.getElementById('photo-canvas');
  const ctx = photoCanvas.getContext('2d');
  const width = video.videoWidth;
  const height = video.videoHeight;

  if (width && height) {
    photoCanvas.width = width;
    photoCanvas.height = height;
    ctx.drawImage(video, 0, 0, width, height);
    console.log('Захват снимка');
    return photoCanvas.toDataURL('image/png');
  }
};

// отправка фото на сервер
function sendPhoto() {
  const myPhoto = catchPhoto();
  // sendFile(myPhoto);
  video.pause();
  sendPhotoBtn.classList.add("disabled");
  deletePhotoBtn.classList.add("disabled");
  document.getElementById('photo').classList.add('hidden');

}


// рисование
function draw() {
  console.log('draw');
  document.querySelector('#draw').classList.remove('hidden');
};

const canvasBody = document.getElementById("draw-canvas");
const canvas = canvasBody.getContext("2d");
const canvasDraw = canvasBody.toDataURL('image/png');
const w = canvasBody.width = canvas.width = window.innerWidth;
const h = canvasBody.height = canvas.height = window.innerHeight;
let tick = 0;
let newTick = tick + 1;
let painting = false;
let lastX = 0;
let lastY = 0;
canvas.lineJoin = 'round';
canvas.lineCap = 'round';
canvas.lineWidth = 20;
canvas.strokeStyle = "blue";

  // рисуем
  // при нажатии левой клавиши ловим положение курсора, чтобы с этой точки рисовать линию (изначально координаты (0, 0) )
  canvasBody.onmousedown = function(evt) {
    const posX = evt.pageX;
    const posY = evt.pageY;
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
    const posX = evt.pageX;
    const posY = evt.pageY;

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
      }
    }
});


let colorBtns = document.querySelectorAll('.draw');

Array.from(colorBtns).forEach(btn => {
  btn.addEventListener('click', changeColor);
  });

// СМЕНА ЦВЕТА
function changeColor() {
  let color = getComputedStyle(event.currentTarget);
  canvas.strokeStyle = color.backgroundColor;
  console.log(color.backgroundColor)
};

let widths = document.querySelectorAll('.line-width');

Array.from(widths).forEach(width => {
  width.addEventListener('click', changeWidth);
  });

// СМЕНА ТОЛЩИНЫ ЛИНИИ
function changeWidth() {
  let width = event.currentTarget.textContent;
  canvas.lineWidth = width;
  console.log(width)
}


// отправка холста
function sendCns() {
  // sendFile(canvasDraw);
  canvas.clearRect(0, 0, w, h);
  console.log('send canvas!');
  document.querySelector('#draw').classList.add('hidden');
  };


function onFilesDrop(event) {
  container.style.border = none;
  event.preventDefault();
  // Загрузка фото
  const files = Array.from(event.dataTransfer.files);
  files.forEach(file => {
    console.log(file.name)
    sendFile(file);
  });
};


// отправка файла на сервер
function sendFile(file) {
  console.log('Пошло на отправку',file);
  const xhr = new XMLHttpRequest();
  xhr.open('POST', '/api/files', true);
  xhr.addEventListener('load', () => {
  if (xhr.status === 200) {
  console.log(`Файл ${file.name} сохранен.`);
  }
  });
  xhr.send(file);
}

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
