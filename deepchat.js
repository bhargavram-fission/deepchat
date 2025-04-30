(function() {
    // Ensure the chat script only loads once
  if (window.DeepChatLoaded) return;
  window.DeepChatLoaded = true;

   // ADD THIS PART to inject <meta> tag
 const viewportMeta = document.createElement('meta');
 viewportMeta.name = "viewport";
 viewportMeta.content = "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no";
 document.head.appendChild(viewportMeta);

  const script = document.createElement('script');
  script.src = 'https://unpkg.com/deep-chat@2.1.1/dist/deepChat.bundle.js';
  script.type = 'module';
  script.defer = true;
  document.body.appendChild(script);

  // Add default styles from the HTML document
  const styleEl = document.createElement('style');
  styleEl.innerHTML = `
    body {
      font-family: Inter, sans-serif;
      margin: 0;
      padding: 0;
    }
    #chat-toggle {
      position: fixed;
      bottom: 20px;
      right: 20px;
      background-color: rgb(5, 102, 255);
      color: white;
      border: none;
      border-radius: 28px;
      width: 60px;
      height: 60px;
      font-size: 24px;
      cursor: pointer;
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }

    #chat-toggle:hover {
      background-color: rgb(5, 51, 255);
    }

    /* Chat container with fade-in effect */
    #chat-container {
      position: fixed;
      bottom: 10%;
      right: 4%;
      display: none;
      flex-direction: column;
      z-index: 999;
      opacity: 0;
      transform: scale(0.95);
      transition: opacity 0.3s ease, transform 0.3s ease;
      width: 350px;
      max-width: 90vw;
      border: none;
    }
#chat-toggle:focus,
#chat-toggle:focus-visible {
outline: none;
box-shadow: none;
}
    #chat-container.show {
      display: flex;
      opacity: 1;
      transform: scale(1);
    }

    .chat-header {
      background-color: #0566ff;
      color: white;
      padding: 12px 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 16px;
      font-weight: 600;
      border-top-left-radius: 10px;
      border-top-right-radius: 10px;
    }

    .chat-title {
      flex-grow: 1;
    }

    .chat-close {
      cursor: pointer;
      font-size: 24px;
      color: white !important;
      margin-left: 10px;
    }

    #chat-element {
      flex-grow: 1;
      overflow: hidden;
      width: 100%;
    }

    /* Mobile responsive styles */
    @media screen and (max-width: 578px) {
      #chat-container {
        width: 100%;
      height: 100%;
      max-width: 100%;
      max-height: 100%;
      border-radius: 0;
      bottom: 0;
      right: 0;
      top: 0;
      left: 0;
      }

      .chat-header {
        border-top-left-radius: 0;
        border-top-right-radius: 0;
      }
    }
    
    /* Hide chat toggle when chat is visible */
    body.chat-is-visible #chat-toggle {
      display: none !important;
      pointer-events: none !important;
    }
  `;
  document.head.appendChild(styleEl);

  window.initDeepChat = function(config = {}) {
    const { 
      toggleText = "💬",
       introMessage = "Chat will attempt to send messages to the server. Type something!",
        connectUrl = "http://localhost:3000/message",
        headerTitle = "Hi There!",
        headerSubTitle = "Welcome to Omada AI",
        headerColor = "#0566ff",
        toggleColor = "#0566ff"
       } = config;

    // Create chat toggle button
    const chatToggle = document.createElement('button');
    chatToggle.id = 'chat-toggle';
    chatToggle.innerHTML = toggleText;
    chatToggle.style.backgroundColor = toggleColor;
    document.body.appendChild(chatToggle);

    // Create chat container
    const chatContainer = document.createElement('div');
    chatContainer.id = 'chat-container';
    document.body.appendChild(chatContainer);

    // Create chat header
    const chatHeader = document.createElement('div');
    chatHeader.className = 'chat-header';
    chatHeader.style.backgroundColor = headerColor;
    chatContainer.appendChild(chatHeader);

    // Create chat title with two lines like the HTML version
    const chatTitleContainer = document.createElement('div');
    chatTitleContainer.style.display = 'flex';
    chatTitleContainer.style.flexDirection = 'column';
    
    const chatTitle1 = document.createElement('span');
  chatTitle1.textContent = headerTitle;
  const chatTitle2 = document.createElement('span');
  chatTitle2.textContent = headerSubTitle;
    
  chatTitleContainer.appendChild(chatTitle1);
  chatTitleContainer.appendChild(chatTitle2);
  chatHeader.appendChild(chatTitleContainer);

    // Create close button with SVG
    const chatClose = document.createElement('span');
    chatClose.className = 'chat-close';
    chatClose.id = 'chat-close';
    chatClose.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="6 9 12 15 18 9" />
      </svg>
    `;
    chatHeader.appendChild(chatClose);

    // Create deep-chat element with all the styling options from the HTML
    const deepChat = document.createElement('deep-chat');
    deepChat.id = 'chat-element';
    deepChat.setAttribute('avatars', 'true');
    
    // Setting inline styles
    deepChat.style.width = '100%';
    deepChat.style.height = 'calc(100% - 52px)';
    
    // Chat style
    const chatStyle = {
      backgroundColor: "rgb(255,255,255)",
      height: "calc(100% - 52px)",
      border: "1px solid #ffffff",
      borderBottomLeftRadius: "10px",
      borderBottomRightRadius: "10px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
      width: "100%"
    };
    deepChat.setAttribute('chatStyle', JSON.stringify(chatStyle));
    
    // Input area style
    deepChat.setAttribute('inputAreaStyle', '{"backgroundColor": "transparent", "borderTop":"1px solid #fdfdfd", "width": "100%"}');
    
    // Text input style
    deepChat.setAttribute('textInput', '{' +
      '"styles": {' +
        '"container": {' +
          '"width": "100%",' +
          '"margin": "0",' +
          '"borderTop": "1px solid #eaeaea",' +
          '"borderBottom": "1px solid white",' +
          '"borderLeft": "1px solid white",' +
          '"borderRight": "1px solid white",' +
          '"boxShadow": "unset"' +
        '},' +
        '"text": {' +
          '"fontSize": "1.05em",' +
          '"paddingTop": "11px",' +
          '"paddingBottom": "13px",' +
          '"paddingLeft": "12px",' +
          '"paddingRight": "2.4em"' +
        '}' +
      '},' +
      '"placeholder": {"text": "Type a message...", "style": {"color": "#bcbcbc"}}' +
    '}');
    
    // Submit button styles
    deepChat.setAttribute('submitButtonStyles', '{' +
      '"submit": {' +
        '"container": {' +
          '"default": {' +
            '"transform": "scale(1.21)",' +
            '"marginBottom": "-3px",' +
            '"marginRight": "0.4em"' +
          '}' +
        '}' +
      '}' +
    '}');
    
    // Auxiliary style
    deepChat.setAttribute('auxiliaryStyle', 
      "::-webkit-scrollbar {" +
      "  height: 10px;" +
      "  width: 3px;" +
      "}" +
      "::-webkit-scrollbar-thumb {" +
      "  background-color: #3b82f6;" +
      "  border-radius: 5px;" +
      "}" +
      "@media screen and (max-width: 768px) {" +
      "  .message-container {" +
      "    max-width: 100% !important;" +
      "  }" +
      "  .message-content {" +
      "    max-width: calc(100% - 20px) !important;" +
      "  }" +
      "}"
    );
    
    // Connect and intro message
    deepChat.setAttribute('connect', `{"url": "${connectUrl}", "method": "POST"}`);
    deepChat.setAttribute('introMessage', `{"text": "${introMessage}"}`);
    
    chatContainer.appendChild(deepChat);

    // Functions for responsive styles
    function applyMobileStyles() {
      if (window.innerWidth <= 600) {
        // Mobile-specific styles
        chatContainer.style.bottom = "0";
        chatContainer.style.right = "0";
        chatContainer.style.left = "0";
        chatContainer.style.width = "100%";
        chatContainer.style.maxWidth = "100%";
        chatContainer.style.height = "100%";
        
        // Update chat header styles
        document.querySelector('.chat-header').style.borderTopLeftRadius = "0";
        document.querySelector('.chat-header').style.borderTopRightRadius = "0";
        
        // Update deep-chat inline styles
        deepChat.style.height = "calc(100% - 52px)";
        
        // Update chatStyle attribute
        const mobileStyles = {
          backgroundColor: "rgb(255,255,255)",
          height: "100%",
          border: "1px solid #ffffff",
          borderBottomLeftRadius: "0",
          borderBottomRightRadius: "0",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          width: "100%"
        };
        
        deepChat.setAttribute('chatStyle', JSON.stringify(mobileStyles));
      } else {
        // Desktop styles
        chatContainer.style.bottom = "10%";
        chatContainer.style.right = "4%";
        chatContainer.style.left = "auto";
        chatContainer.style.width = "350px";
        chatContainer.style.maxWidth = "92vw";
        chatContainer.style.height = "auto";
        
        // Reset chat header styles
        document.querySelector('.chat-header').style.borderTopLeftRadius = "10px";
        document.querySelector('.chat-header').style.borderTopRightRadius = "10px";
        
        // Update deep-chat inline styles
        deepChat.style.height = "60vh";
        
        // Update chatStyle attribute
        const desktopStyles = {
          backgroundColor: "rgb(255,255,255)",
          height: "60vh",
          border: "1px solid #ffffff",
          borderBottomLeftRadius: "10px",
          borderBottomRightRadius: "10px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          width: "100%"
        };
        
        deepChat.setAttribute('chatStyle', JSON.stringify(desktopStyles));
      }
    }

    // Apply styles initially and on resize
    applyMobileStyles();
    window.addEventListener('resize', applyMobileStyles);
function applyPositionStyles() {
  const positionStyles = {
    "bottom-right": { bottom: "20px", right: "20px", left: "auto", top: "auto" },
    "bottom-left": { bottom: "20px", left: "20px", right: "auto", top: "auto" },
    "top-right": { top: "20px", right: "20px", bottom: "auto", left: "auto" },
    "top-left": { top: "20px", left: "20px", bottom: "auto", right: "auto" },
  };

  const styles = positionStyles[position] || positionStyles["bottom-right"];

  Object.assign(chatToggle.style, styles);
  Object.assign(chatContainer.style, styles);
}
applyPositionStyles();

  // Show chat function
function showChat() {
document.body.classList.add('chat-is-visible');
applyMobileStyles();

// Set initial small bubble look
chatContainer.style.display = 'flex';
chatContainer.style.opacity = '0';
chatContainer.style.transformOrigin = 'bottom right';
chatContainer.style.transform = 'scale(0)';
chatContainer.style.borderRadius = '50%';

setTimeout(() => {
  chatContainer.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s ease, border-radius 0.4s ease';
  chatContainer.style.opacity = '1';
  chatContainer.style.transform = 'scale(1)';
  chatContainer.style.borderRadius = '10px'; // Becomes rectangular
  chatContainer.classList.add('show');
}, 10);

chatToggle.style.display = 'none';
}

// Hide chat function
function hideChat() {
chatContainer.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s ease, border-radius 0.4s ease';
chatContainer.style.transform = 'scale(0)';
chatContainer.style.opacity = '0';
chatContainer.style.borderRadius = '50%';

setTimeout(() => {
  chatContainer.style.display = 'none';
  chatContainer.classList.remove('show');
  chatToggle.style.display = 'flex';
  document.body.classList.remove('chat-is-visible');
}, 500);
}


    // Set up event listeners
    chatToggle.addEventListener('click', showChat);
    chatClose.addEventListener('click', hideChat);

    // Return API for external use
    return {
      show: showChat,
      hide: hideChat,
      toggle: () => {
        if (chatContainer.classList.contains('show')) {
          hideChat();
        } else {
          showChat();
        }
      },
      applyMobileStyles: applyMobileStyles
    };
  };
})();
