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

self.addEventListener('notificationclick', function (event) {
    event.notification.close();

    // Берем текст пуша, который мы сохранили в объекте notification
    const pushText = event.notification.body || "";

    // Формируем URL с текстом пуша (закодированным), чтобы страница его подхватила
    const urlToOpen = new URL('/?screen=log&msg=' + encodeURIComponent(pushText), self.location.origin).href;

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true })
            .then(function (clientList) {
                for (let client of clientList) {
                    if (client.url.indexOf(self.location.origin) !== -1 && 'focus' in client) {
                        // Если страница открыта, шлем ей текст напрямую
                        client.postMessage({ action: 'navigate', screen: 'log', msg: pushText });
                        return client.focus();
                    }
                }
                if (clients.openWindow) return clients.openWindow(urlToOpen);
            })
    );
});
