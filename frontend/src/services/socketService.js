import io from 'socket.io-client';

const BASE_URL =
  process.env.NODE_ENV === 'production' ? '/' : '//localhost:3030';

let socket;

export default {
  setup,
  terminate,
  on,
  off,
  emit
};

window.io = io
function setup() {
  if(!socket) socket = io(BASE_URL);
}

function terminate() {
  socket = null;
}

function on(eventName, cb) {
  // console.log('FE service - socket on',eventName)
  socket.on(eventName, cb);
}

function off(eventName, cb) {
  socket.off(eventName, cb);
}

function emit(eventName, data) {
  // console.log('FE service - emit',eventName)
  socket.emit(eventName, data);
}


