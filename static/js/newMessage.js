
function openNewMessageWindow() {
    const newWindow = window.open("", "_blank", "width=400, height=300");
    newWindow.document.write(`
        <h2>New Message</h2>
        <label for="recipient">Recipient:</label>
        <input type="text" id="recipient"><br><br>
        <label for="message">Message:</label>
        <textarea id="message" rows="4" cols="50"></textarea><br><br>
        <button id="send-button">Send</button>
        <button id="cancel-button">Cancel</button>
    `);

    newWindow.document.getElementById("send-button").addEventListener("click", function () {
        const recipient = newWindow.document.getElementById("recipient").value;
        const message = newWindow.document.getElementById("message").value;

   
        alert(`Recipient: ${recipient}\nMessage: ${message}`);

        newWindow.close();
    });

    newWindow.document.getElementById("cancel-button").addEventListener("click", function () {
        newWindow.close();
    });
}
