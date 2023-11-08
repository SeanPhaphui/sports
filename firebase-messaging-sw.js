// These importScripts paths are for the modular v9+ SDK test
importScripts('https://www.gstatic.com/firebasejs/10.4.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.4.0/firebase-messaging-compat.js');

// Your Firebase config object
const firebaseConfig = {
    apiKey: "AIzaSyB4N2vUOlqu9LB5yn4hDkCJS3XNn-jUbtM",
    authDomain: "sports-41aa0.firebaseapp.com",
    projectId: "sports-41aa0",
    storageBucket: "sports-41aa0.appspot.com",
    messagingSenderId: "233351778885",
    appId: "1:233351778885:web:9032c544c9617f964cc92c",
    measurementId: "G-763CGN06KV",
};

// Initialize Firebase app
firebase.initializeApp(firebaseConfig);

// Retrieve an instance of Firebase Messaging so that it can handle background messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log("[firebase-messaging-sw.js] Received background message ", payload);

    // Only show a custom notification if there is no notification payload from FCM
    if (!payload.notification) {
        // Customize notification here using the data payload
        const notificationTitle = 'Default Title'; // You should define a default or use payload.data.title
        const notificationOptions = {
            body: 'Default body text', // You should define a default or use payload.data.body
            icon: "/logo192.png",
            // ...other options...
        };

        self.registration.showNotification(notificationTitle, notificationOptions);
    }
    // If payload.notification is present, FCM will handle displaying the notification
});
