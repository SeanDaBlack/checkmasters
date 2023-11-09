

// spectate functionality
function startSocket() {
    socket = io({ autoConnect: false });
    return socket
}
// document.getElementById("start").addEventListener("click", function () {
//     const username = document.getElementById("username").value;
//     socket.connect();
//     socket.on('connect', function () {
//         socket.emit('user_join', username);
//     });
//     document.getElementById("landing").style.display = "none";
//     document.getElementById("game").style.display = "block";
// });

document.getElementById("send").addEventListener("click", function(){
    const val = document.getElementById("chat-box").value;
    const hidden_name = document.getElementById("hidden-name").value;
    const room = document.getElementById("hidden-room").value;

    const data = hidden_name + ": " + val
    socket.emit("room_message", {"data":data, "room":room})
    document.getElementById("chat-box").value = "";
})

document.getElementById("send").addEventListener("keyup", function(event){

    if (event.key == "Enter") {
        const val = document.getElementById("chat-box").value;
        const hidden_name = document.getElementById("hidden-name").value;
        const room = document.getElementById("hidden-room").value;

        const data = hidden_name + ": " + val
        socket.emit("room_message", {"data":data, "lobby_name":room})
        document.getElementById("chat-box").value = "";
    }
})

