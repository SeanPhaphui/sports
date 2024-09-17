import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

// Add font imports here
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { HashRouter } from "react-router-dom";
// import { getToken, onMessage } from "firebase/messaging";
// import { messaging } from "./firebaseConfig";

console.log(process.env.PUBLIC_URL);

// window.addEventListener("load", () => {
//     if ("serviceWorker" in navigator) {
//         navigator.serviceWorker.getRegistration().then((existingRegistration) => {
//             if (existingRegistration) {
//                 console.log(
//                     "Service worker already registered with scope:",
//                     existingRegistration.scope
//                 );
//                 // Use the existing registration to get the token and listen for messages
//                 getTokenAndListen(existingRegistration);
//             } else {
//                 // Register the service worker since it's not registered yet
//                 navigator.serviceWorker
//                     .register(`/sports/firebase-messaging-sw.js`, { scope: "/sports/" })
//                     .then((newRegistration) => {
//                         console.log("Service worker registered with scope:", newRegistration.scope);
//                         // No need to wait for the 'ready' event inside here
//                         // because it's for a new registration
//                         handleServiceWorkerStateChange(newRegistration);
//                     })
//                     .catch((error) => {
//                         console.error("Service worker registration failed:", error);
//                     });
//             }
//         });
//     }
// });

// function handleServiceWorkerStateChange(registration: ServiceWorkerRegistration) {
//     if (registration.installing) {
//         const newWorker = registration.installing;
//         newWorker.onstatechange = () => {
//             if (newWorker.state === "activated") {
//                 console.log("New service worker is now active");
//                 getTokenAndListen(registration);
//             }
//         };
//     } else if (registration.waiting) {
//         registration.waiting.postMessage({ type: "SKIP_WAITING" });
//     } else if (registration.active) {
//         getTokenAndListen(registration);
//     }
// }

// function getTokenAndListen(registration: ServiceWorkerRegistration) {
//     if (Notification.permission === "granted") {
//         // Retrieve an instance of Firebase Messaging so that it can handle background messages.
//         getToken(messaging, { serviceWorkerRegistration: registration })
//             .then((currentToken) => {
//                 if (currentToken) {
//                     console.log("Firebase token retrieved:", currentToken);
//                 } else {
//                     console.log("No Firebase token retrieved, permission already granted.");
//                     // Handle lack of token even though permission is granted
//                 }
//             })
//             .catch((err) => {
//                 console.error("An error occurred while retrieving token. ", err);
//             });
//     } else {
//         console.log("Notification permission not granted. Token retrieval skipped.");
//     }

//     // Handle foreground messages
//     onMessage(messaging, (payload) => {
//         console.log("Message received. ", payload);
//         // Handle the message as needed
//     });
// }

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
    // <React.StrictMode>
    //   <App />
    // </React.StrictMode>
    <HashRouter>
        <App />
    </HashRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
