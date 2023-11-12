// index.js

const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Ir a la página de inicio de sesión
  await page.goto('http://localhost:2368/ghost/#/signin');

  // Introducir el nombre de usuario y la contraseña
  await page.type('[name="identification"]', 'miguel1999parra@gmail.com');
  await page.type('[name="password"]', 'zbyHRuEWC6j.m*_');

  // Hacer clic en el botón de inicio de sesión
  await page.click('[type="submit"]');

  // Esperar a que la página de inicio de sesión se cargue completamente (puedes ajustar el tiempo de espera según sea necesario)
  await page.waitForNavigation({ waitUntil: 'networkidle0' });

  // Ahora puedes ir a la página del editor de post
  await page.goto('http://localhost:2368/ghost/#/editor/post/65269302f57ed340a04acce1');

  // Tomar una captura de pantalla
  await page.screenshot({ path: 'example.png' });
  
//----------------------------------------------------------------
// Validar la verificación del editor de contenido en tiempo real
await page.waitForSelector('.gh-editor-title-container page-improvements [contenteditable="true"]'); // Esperar a que el editor esté listo

// Introducir contenido en el editor (por ejemplo, texto de prueba)
await page.type('.gh-editor-title-container page-improvements [contenteditable="true"]', 'Contenido de prueba');

// Hacer clic en algún botón de guardar o realizar otra acción que provoque un cambio en el contenido

// Esperar a que el cambio se refleje en el editor de contenido en tiempo real
await page.waitForFunction(() => {
  const editorContent = document.querySelector('.gh-editor-title-container page-improvements[contenteditable="true"]').innerText;
  return editorContent.includes('Contenido de prueba');
});

// Tomar una captura de pantalla
await page.screenshot({ path: 'editor_verification.png' });

//-----------------------------------------------------------------------------------------
 // Seleccionar una imagen predeterminada
 await page.waitForSelector('.gh-editor-feature-image-unsplash'); 
 await page.click('.gh-editor-feature-image-unsplash');

 // Esperar a que se cargue la lista de imágenes predeterminadas
 await page.waitForSelector('.gh-unsplash-photo-container'); 
 // Seleccionar la primera imagen de la lista (ajusta el selector según tu implementación)
 await page.click('.gh-unsplash-photo-container img:first-child');

 // Puedes realizar otras acciones según la implementación de tu página, como hacer clic en un botón de confirmación

 // Tomar una captura de pantalla
 await page.screenshot({ path: 'editor_with_image.png' });

//--------------------------------------------------------------------------------------------------------

// Seleccionar el botón o área de carga de imágenes
await page.waitForSelector('.gh-editor-feature-image-add-button'); 
await page.click('.gh-editor-feature-image-add-button');

// Esperar a que se cargue el diálogo de carga de archivos
await page.waitForSelector('.file-input'); 

// Obtener el camino absoluto de la imagen local que deseas subir
const imagePath = 'data/2995522.png'; 

// Subir la imagen al diálogo de carga de archivos
const input = await page.$('.file-input');
await input.uploadFile(imagePath);

// Tomar una captura de pantalla
await page.screenshot({ path: 'editor_with_local_image.png' });

//----------------------------------------------------------------------------
//Comprobar que los cambios en los temas se aplican de manera dinámica y sin afectar la disponibilidad del sitio web.
const isEditorReady = await page.$('.gh-editor-title-container page-improvements [contenteditable="true"]') !== null;
    if (!isEditorReady) {
      throw new Error('El editor no está listo.');
    }

//--------------------------------------------------------------------------------
//Validación de la Previsualización del Tema Personalizado
   // Hacer un cambio en el título (reemplaza '.post-title' con el selector correcto)
   await page.type('.gh-editor-title-container page-improvements [contenteditable="true"]', 'Nuevo título del post');

   // Guardar el título actual para verificar los cambios más adelante
   const originalTitle = await page.$eval('.gh-editor-title-container page-improvements [contenteditable="true"]', (title) => title.textContent);

   // Hacer clic en el botón "Update" (ajusta el selector según la estructura de tu página)
   await page.click('#ember1010');

   // Esperar a que se complete la actualización
   await page.waitForNavigation({ waitUntil: 'networkidle0' });

   // Validar que los cambios persisten después de hacer clic en "Update"
   const updatedTitle = await page.$eval('.gh-editor-title-container page-improvements [contenteditable="true"]', (title) => title.textContent);
   if (originalTitle !== updatedTitle) {
     console.log('Los cambios en el título se han aplicado correctamente.');
   } else {
     throw new Error('Los cambios en el título no se aplicaron correctamente.');
   }

   // Tomar una captura de pantalla al finalizar la prueba
   await page.screenshot({ path: 'title_update_result.png' });
// Cerrar el navegador
await browser.close();
})();




