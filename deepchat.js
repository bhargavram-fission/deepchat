(function() {
  // Prevent multiple initializations
  if (window.OmadaChatLoaded) return;
  window.OmadaChatLoaded = true;

  // Default configuration
  const DEFAULT_CONFIG = {
    toggleText: "💬",
    introMessage: "Chat will attempt to send messages to the server. Type something!",
    websocket: false,
    stream: true,
    headerTitle: "OmadaAI Assistant!",
    headerSubTitle: "How can I help you?",
    headerColor: "#0057F3",
    toggleColor: "#0057F3",
    position: "bottom-right",
    chatContainerPosition: "bottom-right",
    avatars: true,
    customizeAvatarImageForAI: null,
    customizeAvatarImageForUser: null,
    errorMessages: {
      displayServiceErrorMessages: false,
      overrides: {
        default: "Something went wrong. Please try again.",
        service: "Unable to connect to server.",
        speechToText: "Voice input failed."
      }
    },
    textInputPlaceholder: {
      text: "Type a message...",
      style: { color: "#bcbcbc" }
    },
    messageStyles: {
      error: {
        bubble: {backgroundColor: "#ff0000", color: "#ffffff", fontSize: "15px"}
      },
      default: {
        shared: {bubble: {color: "white"}},
        ai: { bubble: { backgroundColor: "#F3F5F7",color:'#000000',padding:'10px' } },  
        user: { bubble: { backgroundColor: "#0057F3" } }  
      }
    }
  };

  // Cache for DOM elements
  const elements = {};

  // Add viewport meta tag for mobile responsiveness
  function addViewportMeta() {
    if (!document.querySelector('meta[name="viewport"]')) {
      const meta = document.createElement('meta');
      meta.name = "viewport";
      meta.content = "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no";
      document.head.appendChild(meta);
    }
  }

  // Add default styles
  function addStyles() {
    if (!document.getElementById('omada-chat-styles')) {
      const style = document.createElement('style');
      style.id = 'omada-chat-styles';
      style.innerHTML = `
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          margin: 0;
          padding: 0;
        }
        #omada-chat-toggle {
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
          z-index: 999999;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          transition: background-color 0.3s ease;
        }

        #omada-chat-toggle:hover {
          background-color: rgb(5, 51, 255);
        }

        #omada-chat-toggle:focus,
        #omada-chat-toggle:focus-visible {
          outline: none;
          box-shadow: none;
        }

        #omada-chat-container {
          position: fixed;
          bottom: 10%;
          right: 4%;
          display: none;
          flex-direction: column;
          z-index: 999999;
          opacity: 0;
          transform: scale(0.95);
          transition: opacity 0.3s ease, transform 0.3s ease;
          width: 350px;
          max-width: 90vw;
          border: none;
        }

        #omada-chat-container.show {
          display: flex;
          opacity: 1;
          transform: scale(1);
        }

        .omada-chat-header {
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

        .omada-chat-title {
          flex-grow: 1;
          display: flex;
          flex-direction: column;
        }

        .omada-chat-title span:first-child {
          font-size: 16px;
          font-weight: 600;
        }

        .omada-chat-title span:last-child {
          font-size: 12px;
          font-weight: 400;
          opacity: 0.9;
        }

        .omada-chat-close {
          cursor: pointer;
          font-size: 24px;
          color: white !important;
          margin-left: 10px;
        }

        #omada-chat-element {
          flex-grow: 1;
          overflow: hidden;
          width: 100%;
        }

        @media screen and (max-width: 578px) {
          #omada-chat-container {
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

          .omada-chat-header {
            border-top-left-radius: 0;
            border-top-right-radius: 0;
          }
        }
        
        body.omada-chat-is-visible #omada-chat-toggle {
          display: none !important;
          pointer-events: none !important;
        }
      `;
      document.head.appendChild(style);
    }
  }

  // Position elements based on configured position
  function applyPositionStyles(config) {
    const positions = {
      "bottom-right": { top: "auto", bottom: "20px", left: "auto", right: "1%" },
      "bottom-left": { top: "auto", bottom: "20px", left: "1%", right: "auto" },
      "top-left": { top: "30px", bottom: "auto", left: "1%", right: "auto" },
      "top-right": { top: "30px", bottom: "auto", right: "1%", left: "auto" },
    };

    const containerPos = positions[config.chatContainerPosition] || positions["bottom-right"];
    const togglePos = positions[config.position] || positions["bottom-right"];

    Object.assign(elements.chatContainer.style, containerPos);
    Object.assign(elements.chatToggle.style, togglePos);
  }

  // Handle responsive layout for different screen sizes
  function applyResponsiveStyles(config) {
    const isMobile = window.innerWidth <= 600;
    
    if (isMobile) {
      // Full screen on mobile
      elements.chatContainer.style.position = 'fixed';
      elements.chatContainer.style.top = '0';
      elements.chatContainer.style.left = '0';
      elements.chatContainer.style.right = '0';
      elements.chatContainer.style.bottom = '0';
      elements.chatContainer.style.width = '100%';
      elements.chatContainer.style.maxWidth = '100%';
      elements.chatContainer.style.height = '100%';

      elements.chatHeader.style.borderTopLeftRadius = "0";
      elements.chatHeader.style.borderTopRightRadius = "0";

      elements.deepChat.style.height = "calc(100% - 52px)";
      elements.deepChat.setAttribute('chatStyle', JSON.stringify({
        backgroundColor: "rgb(255,255,255)",
        height: "100%",
        border: "1px solid #ffffff",
        borderBottomLeftRadius: "0",
        borderBottomRightRadius: "0",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        width: "100%"
      }));
    } else {
      // Standard size on desktop
      elements.chatContainer.style.width = "400px";
      elements.chatContainer.style.maxWidth = "92vw";
      elements.chatContainer.style.height = "auto";

      elements.chatHeader.style.borderTopLeftRadius = "10px";
      elements.chatHeader.style.borderTopRightRadius = "10px";

      elements.deepChat.style.height = "60vh";
      elements.deepChat.setAttribute('chatStyle', JSON.stringify({
        backgroundColor: "rgb(255,255,255)",
        height: "60vh",
        border: "1px solid #ffffff",
        borderBottomLeftRadius: "10px",
        borderBottomRightRadius: "10px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        width: "100%"
      }));

      // Reapply positioning
      applyPositionStyles(config);
    }
  }

  // Animation for showing chat window
  function showChat(config) {
    document.body.classList.add('omada-chat-is-visible');
    applyResponsiveStyles(config);

    const originMap = {
      "bottom-right": "bottom right",
      "bottom-left": "bottom left",
      "top-left": "top left",
      "top-right": "top right"
    };

    const origin = originMap[config.position] || "bottom right";
    elements.chatContainer.style.transformOrigin = origin;

    elements.chatContainer.style.display = 'flex';
    elements.chatContainer.style.opacity = '0';
    elements.chatContainer.style.transform = 'scale(0)';
    elements.chatContainer.style.borderRadius = '50%';

    setTimeout(() => {
      elements.chatContainer.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s ease, border-radius 0.4s ease';
      elements.chatContainer.style.opacity = '1';
      elements.chatContainer.style.transform = 'scale(1)';
      elements.chatContainer.style.borderRadius = '10px';
      elements.chatContainer.classList.add('show');
    }, 10);

    elements.chatToggle.style.display = 'none';
  }

  // Animation for hiding chat window
  function hideChat() {
    elements.chatContainer.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s ease, border-radius 0.4s ease';
    elements.chatContainer.style.transform = 'scale(0)';
    elements.chatContainer.style.opacity = '0';
    elements.chatContainer.style.borderRadius = '50%';

    setTimeout(() => {
      elements.chatContainer.style.display = 'none';
      elements.chatContainer.classList.remove('show');
      elements.chatToggle.style.display = 'flex';
      document.body.classList.remove('omada-chat-is-visible');
    }, 500);
  }

  // Create the chat widget UI elements
  function createChatElements(config) {
    // Create chat toggle button
    const chatToggle = document.createElement('button');
    chatToggle.id = 'omada-chat-toggle';
    chatToggle.style.position = "fixed";
    chatToggle.innerHTML = config.toggleText;
    chatToggle.style.backgroundColor = config.toggleColor;
    document.body.appendChild(chatToggle);

    // Create chat container
    const chatContainer = document.createElement('div');
    chatContainer.id = 'omada-chat-container';
    chatContainer.style.position = "fixed";
    document.body.appendChild(chatContainer);

    // Create chat header
    const chatHeader = document.createElement('div');
    chatHeader.className = 'omada-chat-header';
    chatHeader.style.backgroundColor = config.headerColor;
    chatContainer.appendChild(chatHeader);

    // Create chat title container
    const chatTitleContainer = document.createElement('div');
    chatTitleContainer.className = 'omada-chat-title';
    
    const chatTitle1 = document.createElement('span');
    chatTitle1.textContent = config.headerTitle;
    const chatTitle2 = document.createElement('span');
    chatTitle2.textContent = config.headerSubTitle;
    
    chatTitleContainer.appendChild(chatTitle1);
    chatTitleContainer.appendChild(chatTitle2);
    chatHeader.appendChild(chatTitleContainer);

    // Create close button with SVG
    const chatClose = document.createElement('span');
    chatClose.className = 'omada-chat-close';
    chatClose.id = 'omada-chat-close';
    chatClose.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="6 9 12 15 18 9" />
      </svg>
    `;
    chatHeader.appendChild(chatClose);
 
    // Create deep-chat element
    const deepChat = document.createElement('deep-chat');
    deepChat.id = 'omada-chat-element';
    
    // Save elements for later reference
    elements.chatToggle = chatToggle;
    elements.chatContainer = chatContainer;
    elements.chatHeader = chatHeader;
    elements.chatClose = chatClose;
    elements.deepChat = deepChat;
    
    return deepChat;
  }

  // Generate the connect URL based on provided credentials
  function generateConnectUrl(config) {
    if (config.connectUrl) {
      return config.connectUrl;
    }
    
    if (config.agentId && config.workspaceId) {
      const baseUrl = config.baseUrl || "https://ds4i1tjnjs35d.cloudfront.net";
      return `${baseUrl}/sse/workspaces/${config.workspaceId}/chat-agents/${config.agentId}/chat/stream`;
    }
    
    return null;
  }

  // Configure the deep-chat element
  function configureDeepChat(deepChat, config) {
    // Handle avatars configuration
    if (config.avatars) {
      const avatarConfig = {
        default: {
          styles: {
            avatar: { height: "30px", width: "30px" },
            container: { marginTop: "8px" }
          }
        }
      };

      if (config.customizeAvatarImageForAI) {
        avatarConfig.ai = {
          src: config.customizeAvatarImageForAI,
          styles: { avatar: { marginLeft: "-3px" } }
        };
      }

      if (config.customizeAvatarImageForUser) {
        avatarConfig.user = {
          src: config.customizeAvatarImageForUser,
          styles: { avatar: { borderRadius: "50%" } }
        };
      }

      deepChat.setAttribute("avatars", JSON.stringify(avatarConfig));
    } else {
      deepChat.setAttribute("avatars", "false");
    }
    
    // Set up basic styles
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
    deepChat.setAttribute("errorMessages", JSON.stringify(config.errorMessages));
    
    // Add auxiliary styles for scrollbar and mobile responsiveness
    const auxiliaryStyle = `
      ::-webkit-scrollbar {
        height: 10px;
        width: 3px;
      }
      ::-webkit-scrollbar-thumb {
        background-color: #3b82f6;
        border-radius: 5px;
      }
      @media screen and (max-width: 768px) {
        .message-container {
          max-width: 100% !important;
        }
        .message-content {
          max-width: calc(100% - 20px) !important;
        }
      }
    `;
    deepChat.setAttribute('auxiliaryStyle', auxiliaryStyle);

    // Text input configuration
    const textInputConfig = {
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
      placeholder: config.textInputPlaceholder
    };
    deepChat.setAttribute('textInput', JSON.stringify(textInputConfig));
    
    // Message styles
    deepChat.setAttribute('messageStyles', JSON.stringify(config.messageStyles));

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
    
    // Generate the connect URL
    const connectUrl = generateConnectUrl(config);
    
    // Set up the request headers for authentication
    const headers = {};
    if (config.accessToken) {
      headers.Authorization = `Bearer ${config.accessToken}`;
    }
    
    // Connect configuration with streaming support
    const connectConfig = {
      url: connectUrl,
      method: "POST",
      websocket: config.websocket || false,
      stream: config.stream || true,
      headers: headers
    };
    
    deepChat.setAttribute('connect', JSON.stringify(connectConfig));
    deepChat.setAttribute('introMessage', `{"text": "${config.introMessage}"}`);
    
    return deepChat;
  }

  // Load deep-chat web component script
  function loadDeepChatScript() {
    return new Promise((resolve, reject) => {
      // Check if already loaded
      if (window.customElements && window.customElements.get('deep-chat')) {
        return resolve();
      }
      
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/deep-chat@2.1.1/dist/deepChat.bundle.js';
      script.type = 'module';
      script.defer = true;
      
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load deep-chat script'));
      
      document.body.appendChild(script);
    });
  }

  // Initialize the chat widget
  window.OmadaChat = {
    init: async function(userConfig = {}) {
      // Load deep-chat script
      try {
        await loadDeepChatScript();
      } catch (error) {
        console.error('Failed to load deep-chat:', error);
        return null;
      }
      
      // Add viewport meta tag
      addViewportMeta();
      
      // Add default styles
      addStyles();
      
      // Merge default config with user config
      const config = { ...DEFAULT_CONFIG, ...userConfig };
      
      // Create elements
      const deepChat = createChatElements(config);
      
      // Configure deep-chat
      configureDeepChat(deepChat, config);
      
      // Add deep-chat to the container
      elements.chatContainer.appendChild(deepChat);

      // Apply initial styles
      applyPositionStyles(config);
      applyResponsiveStyles(config);
      
      // Set up event listeners
      elements.chatToggle.addEventListener('click', () => showChat(config));
      elements.chatClose.addEventListener('click', hideChat);
      window.addEventListener('resize', () => applyResponsiveStyles(config));
      
      // Return public API
      return {
        show: () => showChat(config),
        hide: hideChat,
        toggle: () => {
          if (elements.chatContainer.classList.contains('show')) {
            hideChat();
          } else {
            showChat(config);
          }
        },
        updateConfig: (newConfig) => {
          Object.assign(config, newConfig);
          applyPositionStyles(config);
          applyResponsiveStyles(config);
        }
      };
    }
  };
})();
