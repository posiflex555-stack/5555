// هذا الملف ضروري لتفعيل زر التثبيت كتطبيق (PWA)
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  // يمكن تركها فارغة، هي فقط لإيهام المتصفح أن التطبيق يعمل أوفلاين
});
