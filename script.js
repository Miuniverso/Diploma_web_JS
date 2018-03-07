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

inputFile.addEventListener('change', sendFile);

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
};



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
  sendFile(myPhoto);
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
let w = canvasBody.width;
let h = canvasBody.height;
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
    let posX = evt.pageX;
    let posY = evt.pageY;
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

  canvasBody.addEventListener('dblclick',  (evt) => {
    evt.preventDefault();
    canvas.clearRect(0, 0, w, h);

  });



  // процесс рисования

  canvasBody.addEventListener("mousemove", function(evt) {
    // let posX = evt.pageX;
    // let posY = evt.pageY;
    // если рисуем

    if(painting) {
      ++tick;

      // если пошла итерация

      if(newTick) {
        canvas.beginPath();
        canvas.moveTo(lastX, lastY);
        canvas.lineTo( evt.pageX, evt.pageY);
//         console.log('Ширина',w,'Высота',h,'ОТ сюда',lastX, lastY,'Сюда',evt.pageX, evt.pageY)
        canvas.stroke();
        [lastX, lastY] = [evt.pageX, evt.pageY];
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
  sendFile(canvasDraw);
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
  const formData = new FormData();
  formData.append('file', file);
  console.log('Перед запросом');
  const xhr = new XMLHttpRequest();
  xhr.open('POST', 'https://neto-api.herokuapp.com/picchat', true);
  console.log('Открываю запрос');
  xhr.addEventListener('load', () => {
    if (xhr.status === 200) {
      console.log(`Файл ${formData.file.name} отправлен.`);
  } else {
     console.log('Ошибка соединения');
  }
  });
  xhr.send(formData);
};


let timestamp = Date.now();

function timeString(timestamp) {
	const date = new Date(timestamp)
	const hour = date.getHours() % 24
	let min = date.getMinutes()
	min = min < 10 ? `0${min}` : min
	
	return `${hour}:${min}`
}



const connection = new WebSocket('wss://neto-api.herokuapp.com/picchat');

connection.addEventListener('message', event => {
let resImage
  try {
    resImage = JSON.parse(event.data)
  } catch(error) {
    console.log(error)
  }
    addFile(resImage.data)
});


function addFile(file) {
  const row = document.createElement('div');
  row.className = 'row';

  const col = document.createElement('div');
  col.className = 'col s6';

  const card = document.createElement('card');
  card.className = 'card';

  const imgContainer = document.createElement('div');
  imgContainer.className = 'card-image';

  const img = document.createElement('div');
  img.src = URL.createObjectURL(file.image);

  img.addEventListener('load', event => {
  URL.revokeObjectURL(event.target.src);
  });
  
  const timeWrapper = document.createElement('div');
  timeWrapper.className = 'card-content';
  
  const time = document.createElement('p');
  time.className = 'col s6 right-align grey-text text-darken-4';
  p.innerText = timeString(timestamp);


  timeWrapper.appendChild(time);

  imgContainer.appendChild(img);

  card.appendChild(imgContainer);
  card.appendChild(timeWrapper);

  col.appendChild(card);

  row.appendChild(col);

  container.appendChild(row);

};





  
