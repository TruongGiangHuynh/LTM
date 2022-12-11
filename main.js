function opendStream() {
  const config = {
    audio: true,
    video: true,
  };
  return navigator.mediaDevices.getUserMedia(config);
}

function playStream(idVideoTag, stream) {
  const video = document.getElementById(idVideoTag);
  video.srcObject = stream;
  video.play();
}
var socket = io("http://localhost:3000", {
  transports: ["websocket", "polling", "flashsocket"],
});
socket.on("Danh_sach_online", (arrUserInfo) => {
  $("#chat").show();
  $("#div-dang-ky").hide();

  arrUserInfo.forEach((user) => {
    const { ten, peerId } = user;
    $("#ulUser").append(`<li id="${peerId}">${ten}</li>`);
  });

  socket.on("Co_nguoi_dung_moi", (user) => {
    const { ten, peerId } = user;
    $("#ulUser").append(`<li id="${peerId}">${ten}</li>`);
  });
  socket.on("Ai_do_ngat_ket_noi", (peerId) => {
    $(`#${peerId}`).remove();
  });
});
socket.on("Dang_ky_that_bai", () => alert("Vui long chon username khac"));
const peer = new Peer();
// opendStream().then((stream) => playStream("localStream", stream));
// var conn = peer.connect('another-peers-id');
// on open will be launch when you successfully connect to PeerServer
// conn.on('open', function(){
//   // here you have conn.id
//   conn.send('hi!');
// });
$("#chat").hide();
peer.on("open", (id) => {
  $(`#my-peer`).append(id);
  $(`#btnSignUp`).click(() => {
    const username = document.getElementById("txtUsername").value;

    socket.emit("Nguoi_dung_dang_ky", { ten: username, peerId: id });
  });
});
// caller
$("#btnCall").click(() => {
  const id = document.getElementById("remoteID").value;
  opendStream().then((stream) => {
    playStream("localStream", stream);
    const call = peer.call(id, stream);
    call.on("stream", (remoteStream) =>
      playStream("remoteStream", remoteStream)
    );
  });
  console.log(id);
});

peer.on("call", (call) => {
  opendStream().then((stream) => {
    call.answer(stream);
    playStream("localStream", stream);
    call.on("stream", (remoteStream) =>
      playStream("remoteStream", remoteStream)
    );
  });
});
$(`#ulUser`).on("click", "li", function () {
  const id = $(this).attr("id");
  opendStream().then((stream) => {
    playStream("localStream", stream);
    const call = peer.call(id, stream);
    call.on("stream", (remoteStream) =>
      playStream("remoteStream", remoteStream)
    );
  });
});
