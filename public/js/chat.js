const socket = io();

//Elements
const $form = document.querySelector('#sendMsg');
const $messages = document.querySelector('#messages');


//Templates
const messageTemplate = document.querySelector('#message-template').innerHTML;

socket.on('message',(msg) => {
  console.log(msg);
  const html = Mustache.render(messageTemplate, {
    message : msg.txt,
    createdAt : moment(msg.createdAt).format('h:mm a')
  });
  $messages.insertAdjacentHTML('beforeend',html);
});

$form.addEventListener('submit',(e) => {
  e.preventDefault();
  socket.emit('fromMe', e.target.elements.txt.value);
  e.target.elements.txt.value = '';
  e.target.elements.txt.focus();
});
