(function () {
  // Ensure the chat script only loads once
  if (window.DeepChatLoaded) return;
  window.DeepChatLoaded = true;

  // Inject <meta> tag for responsive behavior
  const viewportMeta = document.createElement('meta');
  viewportMeta.name = "viewport";
  viewportMeta.content = "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no";
  document.head.appendChild(viewportMeta);

  // Load DeepChat script
  const script = document.createElement('script');
  script.src = 'https://unpkg.com/deep-chat@2.1.1/dist/deepChat.bundle.js';
  script.type = 'module';
  script.defer = true;
  document.body.appendChild(script);

  // Inject global CSS styles
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

    #chat-toggle:focus,
    #chat-toggle:focus-visible {
      outline: none;
      box-shadow: none;
    }

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

    /* Mobile responsive adjustments */
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

    /* Hide toggle when chat is open */
    body.chat-is-visible #chat-toggle {
      display: none !important;
      pointer-events: none !important;
    }
  `;
  document.head.appendChild(styleEl);

  // Main chat initialization function
  window.initDeepChat = function (config = {}) {
    // Destructure config with defaults
    const {
      toggleText = "💬",
      introMessage = "Chat will attempt to send messages to the server. Type something!",
      connectUrl = "http://localhost:3000/message",
      headerTitle = "Hi There!",
      headerSubTitle = "Welcome to Omada AI",
      headerColor = "#0566ff",
      toggleColor = "#0566ff",
      position = "bottom-right",
      chatContainerPosition = "bottom-right",
      avatars = true,
      customizeAvatarImageForAI = null,
      customizeAvatarImageForUser = null,
      errorMessages = {
        displayServiceErrorMessages: false,
        overrides: {
          default: "Something went wrong. Please try again.",
          service: "Unable to connect to server.",
          speechToText: "Voice input failed."
        }
      },
      textInputPlaceholder = {
        text: "Type a message...",
        style: { color: "#bcbcbc" }
      },
      auxiliaryStyle = `
        ::-webkit-scrollbar {
          height: 10px;
          width: 3px;
        }
        ::-webkit-scrollbar-thumb {
          background-color: #3b82f6;
          border-radius: 5px;
        }
      `,
      messageStyles = {
        error: {
          bubble: { backgroundColor: "#ff0000", color: "#ffffff", fontSize: "15px" }
        },
        default: {
          shared: { bubble: { color: "white" } },
          ai: { bubble: { backgroundColor: "#3cbe3c" } },
          user: { bubble: { backgroundColor: "#6767ff" } }
        }
      }
    } = config;

    // Create toggle button
    const chatToggle = document.createElement('button');
    chatToggle.id = 'chat-toggle';
    chatToggle.innerHTML = toggleText;
    chatToggle.style.backgroundColor = toggleColor;
    document.body.appendChild(chatToggle);

    // Create chat container
    const chatContainer = document.createElement('div');
    chatContainer.id = 'chat-container';
    document.body.appendChild(chatContainer);

    // Chat header with title and close
    const chatHeader = document.createElement('div');
    chatHeader.className = 'chat-header';
    chatHeader.style.backgroundColor = headerColor;

    const titleContainer = document.createElement('div');
    titleContainer.style.display = 'flex';
    titleContainer.style.flexDirection = 'column';

    const title1 = document.createElement('span');
    title1.textContent = headerTitle;
    const title2 = document.createElement('span');
    title2.textContent = headerSubTitle;

    titleContainer.appendChild(title1);
    titleContainer.appendChild(title2);
    chatHeader.appendChild(titleContainer);

    const chatClose = document.createElement('span');
    chatClose.className = 'chat-close';
    chatClose.id = 'chat-close';
    chatClose.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="6 9 12 15 18 9" />
      </svg>
    `;
    chatHeader.appendChild(chatClose);
    chatContainer.appendChild(chatHeader);

    // DeepChat element
    const deepChat = document.createElement('deep-chat');
    deepChat.id = 'chat-element';
    deepChat.style.width = '100%';
    deepChat.style.height = 'calc(100% - 52px)';
    deepChat.setAttribute('avatars', avatars ? 'true' : 'false');
    deepChat.setAttribute('chatStyle', JSON.stringify({
      backgroundColor: "rgb(255,255,255)",
      height: "calc(100% - 52px)",
      border: "1px solid #ffffff",
      borderBottomLeftRadius: "10px",
      borderBottomRightRadius: "10px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
      width: "100%"
    }));
    deepChat.setAttribute('connect', JSON.stringify({ url: connectUrl, method: "POST" }));
    deepChat.setAttribute('introMessage', JSON.stringify({ text: introMessage }));
    deepChat.setAttribute('errorMessages', JSON.stringify(errorMessages));
    deepChat.setAttribute('auxiliaryStyle', auxiliaryStyle);
    deepChat.setAttribute('messageStyles', JSON.stringify(messageStyles));

    // Optional avatars
    if (avatars) {
      const avatarConfig = {
        default: {
          styles: {
            avatar: { height: "30px", width: "30px" },
            container: { marginTop: "8px" }
          }
        }
      };
      if (customizeAvatarImageForAI) {
        avatarConfig.ai = {
          src: customizeAvatarImageForAI,
          styles: { avatar: { marginLeft: "-3px" } }
        };
      }
      if (customizeAvatarImageForUser) {
        avatarConfig.user = {
          src: customizeAvatarImageForUser,
          styles: { avatar: { borderRadius: "50%" } }
        };
      }
      deepChat.setAttribute("avatars", JSON.stringify(avatarConfig));
    }

    // Text input styles
    deepChat.setAttribute('textInput', JSON.stringify({
      styles: {
        container: {
          width: "100%",
          margin: "0",
          borderTop: "1px solid #eaeaea",
          borderBottom: "1px solid white",
          borderLeft: "1px solid white",
          borderRight: "1px solid white",
          boxShadow: "unset"
        },
        text: {
          fontSize: "1.05em",
          paddingTop: "11px",
          paddingBottom: "13px",
          paddingLeft: "12px",
          paddingRight: "2.4em"
        }
      },
      placeholder: textInputPlaceholder
    }));

    // Submit button animation
    deepChat.setAttribute('submitButtonStyles', JSON.stringify({
      submit: {
        container: {
          default: {
            transform: "scale(1.21)",
            marginBottom: "-3px",
            marginRight: "0.4em"
          }
        }
      }
    }));

    chatContainer.appendChild(deepChat);

    // Responsive behavior
    function applyMobileStyles() {
      const isMobile = window.innerWidth <= 600;
      if (isMobile) {
        chatContainer.style = `
          position: fixed; top: 0; left: 0; right: 0; bottom: 0;
          width: 100%; height: 100%; max-width: 100%; max-height: 100%;
        `;
        chatHeader.style.borderTopLeftRadius = "0";
        chatHeader.style.borderTopRightRadius = "0";
      } else {
        chatContainer.style.width = "350px";
        chatContainer.style.height = "auto";
        chatHeader.style.borderTopLeftRadius = "10px";
        chatHeader.style.borderTopRightRadius = "10px";
      }
      applyPositionStyles();
    }

    function applyPositionStyles() {
      const positionStyles = {
        "bottom-right": { bottom: "50px", right: "2%" },
        "bottom-left": { bottom: "50px", left: "2%" },
        "top-left": { top: "50px", left: "2%" },
        "top-right": { top: "50px", right: "2%" }
      };
      Object.assign(chatContainer.style, positionStyles[chatContainerPosition] || {});
      Object.assign(chatToggle.style, positionStyles[position] || {});
    }

    applyMobileStyles();
    window.addEventListener('resize', applyMobileStyles);

    // Show/hide logic
    function showChat() {
      document.body.classList.add('chat-is-visible');
      chatContainer.classList.add('show');
      chatContainer.style.opacity = '1';
      chatContainer.style.transform = 'scale(1)';
    }

    function hideChat() {
      chatContainer.classList.remove('show');
      chatContainer.style.opacity = '0';
      chatContainer.style.transform = 'scale(0)';
      document.body.classList.remove('chat-is-visible');
    }

    // Event listeners
    chatToggle.addEventListener('click', showChat);
    chatClose.addEventListener('click', hideChat);

    // Return public API
    return {
      show: showChat,
      hide: hideChat,
      toggle: () => chatContainer.classList.contains('show') ? hideChat() : showChat(),
      applyMobileStyles
    };
  };
})();
