// import {
//   query,
//   collection,
//   orderBy,
//   onSnapshot,
//   limit,
// } from "firebase";
// import { getFirestore } from "firebase";
// import { initializeApp } from "firebase";
// import { addDoc, serverTimestamp } from "firebase";

// const firebaseConfig = {
//     apiKey: "AIzaSyDDIex0SQlWiotiL4MkZ0QhmUiChYqcPAA",
//     authDomain: "chatbot-81ed5.firebaseapp.com",
//     projectId: "chatbot-81ed5",
//     storageBucket: "chatbot-81ed5.appspot.com",
//     messagingSenderId: "483371209947",
//     appId: "1:483371209947:web:72a4c8410a81737b4428fe",
//     measurementId: "G-FKS3T32Y6Y",
//   };
  
//   // Initialize Firebase
//   const app2 = initializeApp(firebaseConfig);
//   const db = getFirestore(app2);
//   const q = query(
//     collection(db, "messages"),
//     orderBy("createdAt", "desc"),
//     limit(50)
//   );
  
//   const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
//     const fetchedMessages = [];
//     QuerySnapshot.forEach((doc) => {
//       fetchedMessages.push({ ...doc.data(), id: doc.id });
//     });
//     const sortedMessages = fetchedMessages.sort(
//       (a, b) => a.createdAt - b.createdAt
//     );
//     console.log(sortedMessages)
//     //setMessages(sortedMessages);
//   });
  
//   const sendMessage1 = async () => {
//     await addDoc(collection(db, "messages"), {
//       text: 'bjbkb',
//       name: 'shruti',
//       avatar: '',
//       createdAt: serverTimestamp(),
//       uid: 'P77qLDMxbChjNZ34mMzWZFdrrFL2',
//     });
//   };
//   sendMessage1()
//   console.log('abcs')



const chatHistory = document.getElementById("chat-history");
const userInput = document.getElementById("user-input");
const form = document.getElementById("chat-form");

async function sendMessage() {
  const userMessage = userInput.value;
  userInput.value = ""; // Clear input field
  console.log(userMessage);
  try {
    const response = await fetch("/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userInput: userMessage }),
    });

    const data = await response.json();
    console.log(data);
    const botMessage = data.response;
    console.log(botMessage);
    // Add chat message to the chat history
    chatHistory.innerHTML += `<div class="user-message">${userMessage}</div>`;
    chatHistory.innerHTML += `<div class="bot-message">${botMessage}</div>`;

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