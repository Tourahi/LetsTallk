const socket = io();


// Elements
const $messageForm = document.querySelector('#message-form');
const $messageFormInput = $messageForm.querySelector('input');
const $messageFormButton = $messageForm.querySelector('button');
const $sendLocationButton = document.querySelector('#send-location');
const $messages = document.querySelector('#messages');
const $sidebare = document.querySelector('.chat__sidebar');

//Templates
const messageTemplate = document.querySelector('#message-template').innerHTML;
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML;
//Options
const {username,room} = Qs.parse(location.search, { ignoreQueryPrefix: true });

const autoscroll = () => {
    const $lastMsg = $messages.lastElementChild;
    const lastMsgStyles = getComputedStyle($lastMsg);
    const lastMsgHeight = $lastMsg.offsetHeight + parseInt(lastMsgStyles.marginBottom);
    //Vasible height
    const visibleH = $messages.offsetHeight;
    //Height of messages container
    const containerH = $messages.scrollHeight;
    //How far is the current scroll?
    const scrollOffset = $messages.scrollTop + visibleH;
    if((containerH - lastMsgHeight) <= scrollOffset){
      $messages.scrollTop = $messages.scrollHeight;
    }


};

socket.on('message', (message) => {
    console.log(message)
    const html = Mustache.render(messageTemplate, {
        name : message.name,
        message: message.txt,
        createdAt: moment(message.createdAt).format('h:mm a')
    });
    $messages.insertAdjacentHTML('beforeend', html);
    autoscroll();
});

socket.on('roomData', ({room , users}) => {
  $sidebare.innerHTML = "";
  const html = Mustache.render(sidebarTemplate, {
      room :room,
      users : users
  });
  $sidebare.insertAdjacentHTML('beforeend', html);
});

$messageForm.addEventListener('submit', (e) => {
      e.preventDefault();
      $messageFormButton.setAttribute('disabled', 'disabled');
      const message = e.target.elements.message.value;
      socket.emit('sendMessage', message, (error) => {
      $messageFormButton.removeAttribute('disabled');
      $messageFormInput.value = '';
      $messageFormInput.focus();
      if (error) {
          return console.log(error);
      }
      console.log('Message delivered!');
    });
});

socket.emit('join', { username, room }, (error) => {
    if (error) {
        alert(error);
        location.href = '/';
    }
});
