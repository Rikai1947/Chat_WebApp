const socket = io();

document.addEventListener('DOMContentLoaded', () => {
  const leftUsername = sessionStorage.getItem('leftUsername');
  const leftAvatar = sessionStorage.getItem('leftAvatar');
  const rightUsername = sessionStorage.getItem('rightUsername');
  const rightAvatar = sessionStorage.getItem('rightAvatar');

  if (!leftUsername || !leftAvatar || !rightUsername || !rightAvatar) {
    window.location.href = '/';
    return;
  }

  socket.emit('join', { name: leftUsername, avatar: leftAvatar });
  socket.emit('join', { name: rightUsername, avatar: rightAvatar });

  const leftSendBtn = document.getElementById('left-send-btn');
  const rightSendBtn = document.getElementById('right-send-btn');
  const leftMessageInput = document.getElementById('left-message-input');
  const rightMessageInput = document.getElementById('right-message-input');
  const leftFileInput = document.getElementById('left-file-input');
  const rightFileInput = document.getElementById('right-file-input');
  const darkModeSwitch = document.getElementById('dark-mode-switch');
  const exitBtn = document.getElementById('exit-btn');

  leftSendBtn.addEventListener('click', () => {
    sendMessage('left');
  });

  rightSendBtn.addEventListener('click', () => {
    sendMessage('right');
  });

  darkModeSwitch.addEventListener('change', () => {
    document.body.classList.toggle('dark-mode', darkModeSwitch.checked);
  });

  exitBtn.addEventListener('click', () => {
    window.location.href = '/';
  });

  leftFileInput.addEventListener('change', (event) => {
    sendFile('left', event.target.files[0]);
  });

  rightFileInput.addEventListener('change', (event) => {
    sendFile('right', event.target.files[0]);
  });

  function sendMessage(side) {
    const messageInput = document.getElementById(`${side}-message-input`);
    const text = messageInput.value;

    if (text.trim()) {
      const message = {
        name: side === 'left' ? leftUsername : rightUsername,
        avatar: side === 'left' ? leftAvatar : rightAvatar,
        text,
        side,
      };
      displayMessage(message);
      socket.emit('chatMessage', message);
      messageInput.value = '';
    }
  }

  function sendFile(side, file) {
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const message = {
          name: side === 'left' ? leftUsername : rightUsername,
          avatar: side === 'left' ? leftAvatar : rightAvatar,
          fileUrl: reader.result,
          fileName: file.name,
          side,
        };
        displayFileMessage(message);
        socket.emit('fileMessage', message);
      };
      reader.readAsDataURL(file);
    }
  }

  function displayMessage({ name, avatar, text, side }) {
    const messagesContainer = document.getElementById(
      `${side === 'left' ? 'right' : 'left'}-messages`
    );
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');

    messageElement.innerHTML = `
      <div class="message-header">
        <img src="${avatar}" alt="${name}" class="avatar">
        <strong>${name}</strong>
      </div>
      <div class="message-body">${text}</div>
    `;

    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  function displayFileMessage({ name, avatar, fileUrl, fileName, side }) {
    const messagesContainer = document.getElementById(
      `${side === 'left' ? 'right' : 'left'}-messages`
    );
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');

    messageElement.innerHTML = `
      <div class="message-header">
        <img src="${avatar}" alt="${name}" class="avatar">
        <strong>${name}</strong>
      </div>
      <div class="message-body">
        <a href="${fileUrl}" download="${fileName}">${fileName}</a>
      </div>
    `;

    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  socket.on('message', (message) => {
    if (message.side !== undefined) {
      displayMessage(message);
    }
  });

  socket.on('fileMessage', (message) => {
    if (message.side !== undefined) {
      displayFileMessage(message);
    }
  });

  // Add voice message handlers here if needed.
});
