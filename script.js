import {
  query,
  collection,
  orderBy,
  onSnapshot,
  limit,
  getFirestore,
  addDoc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/9.4.0/firebase-firestore.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";

const firebaseConfig = {
  apiKey: "AIzaSyDDIex0SQlWiotiL4MkZ0QhmUiChYqcPAA",
  authDomain: "chatbot-81ed5.firebaseapp.com",
  projectId: "chatbot-81ed5",
  storageBucket: "chatbot-81ed5.appspot.com",
  messagingSenderId: "483371209947",
  appId: "1:483371209947:web:72a4c8410a81737b4428fe",
  measurementId: "G-FKS3T32Y6Y",
};

// Initialize Firebase
const app2 = initializeApp(firebaseConfig);
const db = getFirestore(app2);

let ifConnectClick = false;

document.getElementById("connect").addEventListener("click", () => {
  ifConnectClick = true;
  const q = query(
    collection(db, "messages"),
    orderBy("createdAt", "desc"),
    limit(50)
  );

  const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
    const fetchedMessages = [];
    QuerySnapshot.forEach((doc) => {
      fetchedMessages.push({ ...doc.data(), id: doc.id });
    });
    const sortedMessages = fetchedMessages.sort(
      (a, b) => a.createdAt - b.createdAt
    );
    chatHistory.innerHTML += `<div class="bot-message">${
      sortedMessages[sortedMessages.length - 1]?.text
    }</div>`;

    //setMessages(sortedMessages);
  });
});

const chatHistory = document.getElementById("chat-history");
const userInput = document.getElementById("user-input");
const form = document.getElementById("chat-form");

const sendMessage1 = async (userMessage) => {
  await addDoc(collection(db, "messages"), {
    text: userMessage,
    name: "shruti",
    avatar: "",
    createdAt: serverTimestamp(),
    uid: "P77qLDMxbChjNZ34mMzWZFdrrFL2",
  });
};

async function sendMessage() {
  const userMessage = userInput.value;
  userInput.value = ""; // Clear input field
  try {
    if (ifConnectClick) {
      sendMessage1(userMessage);
      chatHistory.innerHTML += `<div class="user-message">${userMessage}</div>`;
    } else {
      const response = await fetch("/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userInput: userMessage }),
      });

      const data = await response.json();
      const botMessage = data.response;

      // Add chat message to the chat history
      chatHistory.innerHTML += `<div class="user-message">${userMessage}</div>`;
      chatHistory.innerHTML += `<div class="bot-message">${botMessage}</div>`;
    }

    // Scroll to the bottom of the chat history
    chatHistory.scrollTop = chatHistory.scrollHeight;
  } catch (error) {
    console.error("Error:", error);
    // Handle errors gracefully, e.g., display an error message to the user
  }
}

form.addEventListener("submit", (event) => {
  event.preventDefault(); // Prevent form submission
  const loader = document.getElementById("loader");
  loader.style.display = "block"; // Show the loader
  sendMessage().finally(() => {
    loader.style.display = "none"; // Hide the loader after the message is sent
  });
});
