(function() {
  // Check if DeepChat script is already loaded
  if (window.DeepChatLoaded) return;
  window.DeepChatLoaded = true;

  // Dynamically load DeepChat script
  const script = document.createElement('script');
  script.src = 'https://unpkg.com/deep-chat@2.1.1/dist/deepChat.bundle.js';
  script.type = 'module';
  document.body.appendChild(script);

  // Create a function to initialize the chat
  window.initDeepChat = function(config = {}) {
    const { toggleText = "💬", introMessage = "Chat will attempt to send messages to the server. Type something!", connectUrl = "http://localhost:3000/message" } = config;

    // Create a button to toggle the chat
    const chatToggle = document.createElement('button');
    chatToggle.id = 'chat-toggle';
    chatToggle.innerHTML = toggleText;
    chatToggle.style.position = 'fixed';
    chatToggle.style.bottom = '20px';
    chatToggle.style.right = '20px';
    chatToggle.style.backgroundColor = 'rgb(5, 102, 255)';
    chatToggle.style.color = 'white';
    chatToggle.style.border = 'none';
    chatToggle.style.borderRadius = '28px';
    chatToggle.style.width = '60px';
    chatToggle.style.height = '60px';
    chatToggle.style.fontSize = '24px';
    chatToggle.style.cursor = 'pointer';
    chatToggle.style.zIndex = 1000;
    chatToggle.style.display = 'flex';
    chatToggle.style.alignItems = 'center';
    chatToggle.style.justifyContent = 'center';
    chatToggle.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
    document.body.appendChild(chatToggle);

    // Create the chat container
    const chatContainer = document.createElement('div');
    chatContainer.id = 'chat-container';
    chatContainer.style.position = 'fixed';
    chatContainer.style.bottom = '10%';
    chatContainer.style.right = '4%';
    chatContainer.style.display = 'none';
    chatContainer.style.flexDirection = 'column';
    chatContainer.style.zIndex = 999;
    chatContainer.style.opacity = 0;
    chatContainer.style.transform = 'scale(0.95)';
    chatContainer.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    chatContainer.style.width = '350px';
    chatContainer.style.maxWidth = '92vw';
    document.body.appendChild(chatContainer);

    // Add chat header
    const chatHeader = document.createElement('div');
    chatHeader.classList.add('chat-header');
    chatHeader.style.backgroundColor = '#0566ff';
    chatHeader.style.color = 'white';
    chatHeader.style.padding = '12px 16px';
    chatHeader.style.display = 'flex';
    chatHeader.style.justifyContent = 'space-between';
    chatHeader.style.alignItems = 'center';
    chatHeader.style.fontSize = '16px';
    chatHeader.style.fontWeight = '600';
    chatHeader.style.borderTopLeftRadius = '10px';
    chatHeader.style.borderTopRightRadius = '10px';
    chatContainer.appendChild(chatHeader);

    const chatTitle = document.createElement('div');
    chatTitle.classList.add('chat-title');
    chatTitle.innerHTML = 'Hi There! Welcome To Omada AI';
    chatHeader.appendChild(chatTitle);

    const chatClose = document.createElement('span');
    chatClose.classList.add('chat-close');
    chatClose.innerHTML = 'X';
    chatClose.style.cursor = 'pointer';
    chatHeader.appendChild(chatClose);

    // Add DeepChat component
    const deepChat = document.createElement('deep-chat');
    deepChat.id = 'chat-element';
    deepChat.setAttribute('avatars', 'true');
    deepChat.style.width = '100%';
    deepChat.style.height = 'calc(100% - 52px)';
    deepChat.setAttribute('connect', `{"url": "${connectUrl}", "method": "POST"}`);
    deepChat.setAttribute('introMessage', `{"text": "${introMessage}"}`);
    chatContainer.appendChild(deepChat);

    // Toggle chat container visibility
    chatToggle.addEventListener('click', () => {
      chatContainer.style.display = 'flex';
      setTimeout(() => {
        chatContainer.style.opacity = 1;
        chatContainer.style.transform = 'scale(1)';
      }, 10);
      chatToggle.style.display = 'none';
    });

    // Close the chat container
    chatClose.addEventListener('click', () => {
      chatContainer.style.opacity = 0;
      chatContainer.style.transform = 'scale(0.95)';
      setTimeout(() => {
        chatContainer.style.display = 'none';
        chatToggle.style.display = 'flex';
      }, 300);
    });
  };
})();
