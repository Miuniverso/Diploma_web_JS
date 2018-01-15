const btnFile = document.querySelector('.file');
const btnCamera = document.querySelector('.camera');
const inputFile = document.querySelector("input[type=file]");
const container = document.querySelector('.container')

inputFile.addEventListener('change', addFile);

container.addEventListener('drop', onFilesDrop);
container.addEventListener('dragover', event => {
  event.preventDefault();
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


//
//
// // ------------------
//
// var wsUri = "wss://echo.websocket.org/";
//   var output;
//
//   function init()
//   {
//     output = document.getElementById("output");
//     testWebSocket();
//   }
//
//   function testWebSocket()
//   {
//     websocket = new WebSocket(wsUri);
//     websocket.onopen = function(evt) { onOpen(evt) };
//     websocket.onclose = function(evt) { onClose(evt) };
//     websocket.onmessage = function(evt) { onMessage(evt) };
//     websocket.onerror = function(evt) { onError(evt) };
//   }
//
//   function onOpen(evt)
//   {
//     writeToScreen("CONNECTED");
//     doSend("WebSocket rocks");
//   }
//
//   function onClose(evt)
//   {
//     writeToScreen("DISCONNECTED");
//   }
//
//   function onMessage(evt)
//   {
//     writeToScreen('<span style="color: blue;">RESPONSE: ' + evt.data+'</span>');
//     websocket.close();
//   }
//
//   function onError(evt)
//   {
//     writeToScreen('<span style="color: red;">ERROR:</span> ' + evt.data);
//   }
//
//   function doSend(message)
//   {
//     writeToScreen("SENT: " + message);
//     websocket.send(message);
//   }
//
//   function writeToScreen(message)
//   {
//     var pre = document.createElement("p");
//     pre.style.wordWrap = "break-word";
//     pre.innerHTML = message;
//     output.appendChild(pre);
//   }
//
//   window.addEventListener("load", init, false);
