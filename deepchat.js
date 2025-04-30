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
        toggleColor = "#0566ff",
        position = "bottom-right",
       } = config;

    // Create chat toggle button
    const chatToggle = document.createElement('button');
    chatToggle.id = 'chat-toggle';
      chatToggle.style.position = "fixed";
    chatToggle.innerHTML = toggleText;
    chatToggle.style.backgroundColor = toggleColor;
    document.body.appendChild(chatToggle);

    // Create chat container
    const chatContainer = document.createElement('div');
    chatContainer.id = 'chat-container';
      chatContainer.style.position = "fixed";
    document.body.appendChild(chatContainer);
applyPositionStyles();

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
  const isMobile = window.innerWidth <= 600;
  
  if (isMobile) {
    chatContainer.style.position = 'fixed';
    chatContainer.style.top = '0';
    chatContainer.style.left = '0';
    chatContainer.style.right = '0';
    chatContainer.style.bottom = '0';
    chatContainer.style.width = '100%';
    chatContainer.style.maxWidth = '100%';
    chatContainer.style.height = '100%';

    document.querySelector('.chat-header').style.borderTopLeftRadius = "0";
    document.querySelector('.chat-header').style.borderTopRightRadius = "0";

    deepChat.style.height = "calc(100% - 52px)";
    deepChat.setAttribute('chatStyle', JSON.stringify({
      backgroundColor: "rgb(255,255,255)",
      height: "100%",
      border: "1px solid #ffffff",
      borderBottomLeftRadius: "0",
      borderBottomRightRadius: "0",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
      width: "100%"
    }));
  } else {
    // Only apply size styles, do NOT reset top/bottom/left/right
    chatContainer.style.width = "350px";
    chatContainer.style.maxWidth = "92vw";
    chatContainer.style.height = "auto";

    document.querySelector('.chat-header').style.borderTopLeftRadius = "10px";
    document.querySelector('.chat-header').style.borderTopRightRadius = "10px";

    deepChat.style.height = "60vh";
    deepChat.setAttribute('chatStyle', JSON.stringify({
      backgroundColor: "rgb(255,255,255)",
      height: "60vh",
      border: "1px solid #ffffff",
      borderBottomLeftRadius: "10px",
      borderBottomRightRadius: "10px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
      width: "100%"
    }));

    // 🛠 RE-APPLY POSITIONING HERE!
    applyPositionStyles();
  }
}


    // Apply styles initially and on resize
    applyMobileStyles();
    window.addEventListener('resize', applyMobileStyles);
      
function applyPositionStyles() {
  const positionStyles = {
    "bottom-right": {
      container: { bottom: "100px", right: "4%", top: "auto", left: "auto" },
      toggle: { bottom: "10%", right: "4%", top: "auto", left: "auto" },
    },
    "bottom-left": {
      container: { bottom: "100px", left: "4%", top: "auto", right: "auto" },
      toggle: { bottom: "10%", left: "4%", top: "auto", right: "auto" },
    },
    "top-left": {
      container: { top: "100px", left: "4%", bottom: "auto", right: "auto" },
      toggle: { top: "10%", left: "4%", bottom: "auto", right: "auto" },
    },
    "top-right": {
      container: { top: "100px", right: "4%", bottom: "auto", left: "auto" },
      toggle: { top: "10%", right: "4%", bottom: "auto", left: "auto" },
    },
  };

  const styles = positionStyles[position] || positionStyles["bottom-right"];
  
  // Apply to chat container
  Object.assign(chatContainer.style, styles.container);

  // Apply to toggle button
  Object.assign(chatToggle.style, styles.toggle);
}

applyPositionStyles();

  // Show chat function
function showChat() {
  document.body.classList.add('chat-is-visible');
  applyMobileStyles();

  const originMap = {
    "bottom-right": "bottom right",
    "bottom-left": "bottom left",
    "top-left": "top left",
    "top-right": "top right"
  };

  const origin = originMap[position] || "bottom right";
  chatContainer.style.transformOrigin = origin;

  chatContainer.style.display = 'flex';
  chatContainer.style.opacity = '0';
  chatContainer.style.transform = 'scale(0)';
  chatContainer.style.borderRadius = '50%';

  setTimeout(() => {
    chatContainer.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s ease, border-radius 0.4s ease';
    chatContainer.style.opacity = '1';
    chatContainer.style.transform = 'scale(1)';
    chatContainer.style.borderRadius = '10px';
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
