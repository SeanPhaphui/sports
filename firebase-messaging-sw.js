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

    // Customize notification here
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: "/logo192.png",
        // If you want to add additional data to the notification options, you can do it here
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});
