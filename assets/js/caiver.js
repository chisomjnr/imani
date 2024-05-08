'use strict';

/**
 * add Event on elements
 */
const addEventOnElem = function (elem, type, callback) {
  if (elem.length > 1) {
    for (let i = 0; i < elem.length; i++) {
      elem[i].addEventListener(type, callback);
    }
  } else {
    elem.addEventListener(type, callback);
  }
}

/**
 * navbar toggle
 */
const navbar = document.querySelector("[data-navbar]");
const navTogglers = document.querySelectorAll("[data-nav-toggler]");
const navbarLinks = document.querySelectorAll("[data-nav-link]");
const overlay = document.querySelector("[data-overlay]");

const toggleNavbar = function () {
  navbar.classList.toggle("active");
  overlay.classList.toggle("active");
}

addEventOnElem(navTogglers, "click", toggleNavbar);

const closeNavbar = function () {
  navbar.classList.remove("active");
  overlay.classList.remove("active");
}

addEventOnElem(navbarLinks, "click", closeNavbar);

/**
 * header & back top btn show when scroll down to 100px
 */
const header = document.querySelector("[data-header]");
const backTopBtn = document.querySelector("[data-back-top-btn]");
const chatbotPopup = document.querySelector(".chatbot");

const headerActive = function () {
  if (window.scrollY > 80 && !document.body.classList.contains("show-chatbot")) {
    header.classList.add("active");
    backTopBtn.classList.add("active");
  } else {
    header.classList.remove("active");
    backTopBtn.classList.remove("active");
  }
}

addEventOnElem(window, "scroll", headerActive);

const handleChatbotVisibility = function () {
  if (chatbotPopup.classList.contains("show-chatbot")) {
    header.classList.add("invisible");
  } else {
    header.classList.remove("invisible");
  }
}

addEventOnElem(document.body, "transitionend", handleChatbotVisibility);










const chatbotToggler = document.querySelector(".chatbot-toggler");
const closeBtn = document.querySelector(".close-btn");
const chatbox = document.querySelector(".chatbox");
const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");

let userMessage = null; // Variable to store user's message
const API_KEY = "PASTE-YOUR-API-KEY"; // Paste your API key here
const inputInitHeight = chatInput.scrollHeight;

const createChatLi = (message, className) => {
    // Create a chat <li> element with passed message and className
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", `${className}`);
    let chatContent = className === "outgoing" ? `<p></p>` : ` <i style="font-size:35px; margin-right:8px; color:rgb(250, 250, 250);  "  class='fas fa-paper-plane'></i><p></p>`;
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message;
    return chatLi; // return chat <li> element
}

const generateResponse = (chatElement) => {
  const API_URL = "https://api.openai.com/v1/chat/completions";
  const messageElement = chatElement.querySelector("p");

  // Define special inputs and their corresponding responses
  const specialInputs = {
      "how are you": "I am okay",
      "New or old caf?": "Why not both",
      "what's your name": "My name is Caiver",
      "what is your name":"My name is Caiver",
      "what's your name?": "My name is Caiver",
      "what is your name?":"My name is Caiver",
      "New or old caf?": "Right now i'd suggest trying old caf, the que's a bit fast",
      "who dey sell weed for school?": "Omo my bro!! dem plenty fr fr"
      // Add more special inputs and responses as needed
  };

    // Check if the user's message matches a special input
    const specialResponse = specialInputs[userMessage.toLowerCase()];
    if (specialResponse) {
        // If a special input is found, set the response after a delay
        setTimeout(() => {
            messageElement.textContent = specialResponse;
            chatbox.scrollTo(0, chatbox.scrollHeight);
        }, 600); // Adjust the delay time as needed
        return;
    }

    // Define the properties and message for the API request
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{role: "user", content: userMessage}],
        })
    }

    // Send POST request to API, get response and set the response as paragraph text
    fetch(API_URL, requestOptions).then(res => res.json()).then(data => {
      messageElement.textContent = data.choices[0].message.content.trim();


    // Create a container for the message and icon
    const messageContainer = document.createElement("div");
    messageContainer.classList.add("message-container");
    // Set the text content of the message
    messageElement.textContent = responseText;

    // Create an icon element
    const icon = document.createElement("i");
    icon.classList.add("fas", "fa-copy", "copy-icon");
    icon.style.color = "white"; // Set icon color to white
    // Add click event listener to copy the output to clipboard when icon is clicked
    icon.addEventListener("click", () => {
        // Copy the text content of the message to clipboard
        navigator.clipboard.writeText(responseText).then(() => {
            alert("Output copied to clipboard!");
        }).catch(err => {
            console.error("Error copying to clipboard:", err);
        });
    });

    // Append the icon to the message container
    messageContainer.appendChild(messageElement);
    messageContainer.appendChild(icon);

    // Append the container to the chatbox
    chatbox.appendChild(messageContainer);


    
    }).catch(() => {
        messageElement.classList.add("error");
        messageElement.textContent = "Oops! Something went wrong. Please try again.";
    }).finally(() => chatbox.scrollTo(0, chatbox.scrollHeight));
}

const handleChat = () => {
    userMessage = chatInput.value.trim(); // Get user entered message and remove extra whitespace
    if(!userMessage) return;

    // Clear the input textarea and set its height to default
    chatInput.value = "";
    chatInput.style.height = `${inputInitHeight}px`;

    // Append the user's message to the chatbox
    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight);
    
    setTimeout(() => {
        // Display "Thinking..." message while waiting for the response
        const incomingChatLi = createChatLi("Thinking...", "incoming");
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);
        generateResponse(incomingChatLi);
    }, 600);
}

chatInput.addEventListener("input", () => {
    // Adjust the height of the input textarea based on its content
    chatInput.style.height = `${inputInitHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e) => {
    // If Enter key is pressed without Shift key and the window 
    // width is greater than 800px, handle the chat
    if(e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
        e.preventDefault();
        handleChat();
    }
});

sendChatBtn.addEventListener("click", handleChat);
closeBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));
chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));














