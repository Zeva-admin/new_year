let stream;
let micOn = false;


async function toggleMic() {
if (!micOn) {
stream = await navigator.mediaDevices.getUserMedia({ audio: true });
micOn = true;
alert('Микрофон включён (WebRTC можно расширить)');
} else {
stream.getTracks().forEach(t => t.stop());
micOn = false;
}
}