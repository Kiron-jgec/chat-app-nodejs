const socket = io();

// Elements

const $messageForm = document.querySelector("#messageform");
const $messageFormInput = $messageForm.querySelector("input");
const $messageFormButton = $messageForm.querySelector("button");
const $sendLocationButon = document.querySelector("#send-location");
const $messages = document.querySelector("#messages");

// templates

const messageTemlate = document.querySelector("#message-template").innerHTML;
const lasctionmessageTemlate = document.querySelector("#location-message-template").innerHTML;
const sidebarTempalte = document.querySelector("#sidebar-template").innerHTML
// optins

const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

// auto scroll 

const autoscroll = () => {
  //new nassege element

  const $newMessage = $messages.lastElementChild
  // height of the last message
  const newMessageStyle = getComputedStyle($newMessage)
  const newMessageMargin = parseInt(newMessageStyle.marginBottom)
  const newMessageHeighe = $newMessage.offsetHeight + newMessageMargin
  //visible height

  const visibleHeight = $messages.offsetHeight
  // height of messages container 
  const containerHeight = $messages.scrollHeight
  // how far have I scrolled 

  const scrollOffset = $messages.scrollTop + visibleHeight


  if (containerHeight - newMessageHeighe <= scrollOffset) {
    $messages.scrollTop = $messages.scrollHeight
  }

}

// send Message
socket.on("massage", (massage) => {

  const html = Mustache.render(messageTemlate, {
    username: massage.username,
    massage: massage.text,
    ceatedAt: moment(massage.createdAt).format('hh:mm a')
  })
  $messages.insertAdjacentHTML('beforeend', html)
  autoscroll()
});


// location mesage
socket.on('locaionMassage', (message) => {

  const html = Mustache.render(lasctionmessageTemlate, {
    username: message.username,
    url: message.url,
    ceatedAt: moment(message.createdAt).format('hh:mm a')
  })
  $messages.insertAdjacentHTML('beforeend', html)
  autoscroll()
})

// user listing 

socket.on('roomData', ({ room, users }) => {
  const html = Mustache.render(sidebarTempalte, {
    room, users
  })
  document.querySelector("#sidebar").innerHTML = html
})




$messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  //disable form
  $messageFormButton.setAttribute("disabled", "disabled");

  const message = e.target.elements.message.value;

  socket.emit("sendMessage", message, (error) => {
    $messageFormButton.removeAttribute("disabled");
    $messageFormInput.value = "";
    $messageFormInput.focus();
    // eneble form
    if (error) {

      return alert(error)

    }
    console.log("Message delivered !");
  });
});

// send Location
$sendLocationButon.addEventListener("click", (e) => {
  if (!navigator.geolocation) {
    return alert("Geolocation is not supported by your browser");
  }

  $sendLocationButon.setAttribute("disabled", "disabled");

  navigator.geolocation.getCurrentPosition((position) => {
    socket.emit(
      "sendLocation",
      {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      },
      () => {
        $sendLocationButon.removeAttribute("disabled");
        console.log("Location shared !");
      }
    );
  });
});



socket.emit('join', { username, room }, (error) => {
  if (error) {
    alert(error)
    location.href = "/"
  }
})
