importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');

firebase.initializeApp({
    apiKey: "AIzaSyCKNcKYcnafRE1h9CDxhY4K23zI4N7ur6g",
    authDomain: "fullstack-demo-6f25b.firebaseapp.com",
    projectId: "fullstack-demo-6f25b",
    storageBucket: "fullstack-demo-6f25b.firebasestorage.app",
    messagingSenderId: "48848355982",
    appId: "1:48848355982:web:79874e9c872ea0bdfc7fdf"
});
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    // Это пробуждает систему и показывает пуш, даже если вкладка убита
    self.registration.showNotification(payload.notification.title, {
        body: payload.notification.body,
        icon: '/icon_active.png'
    });
});