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

    // Достаем текст, который мы положили в data выше
    const pushText = event.notification.data.msg;

    // Формируем безопасный URL с параметрами
    const targetUrl = new URL(`/?screen=log&msg=${encodeURIComponent(pushText)}`, self.location.origin).href;

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true })
            .then(function (clientList) {
                // Пытаемся найти уже открытую вкладку
                for (let client of clientList) {
                    if (client.url.indexOf(self.location.origin) !== -1 && 'focus' in client) {
                        // Шлем сообщение открытой странице
                        client.postMessage({
                            action: 'navigate',
                            screen: 'log',
                            msg: pushText
                        });
                        return client.focus();
                    }
                }
                // Если вкладок нет — открываем новую с параметрами в URL
                if (clients.openWindow) {
                    return clients.openWindow(targetUrl);
                }
            })
    );

});
