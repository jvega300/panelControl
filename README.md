# panelControl

Esto es una simple aplicación escrita en NodeJs que funciona como servicio Rest.

Tiene una interfaz escrita con Handlebars.

La he escrito para probar Passport y Bcrypt como metodos de autenticación seguros.

Para lanzarla hay que seguir estos pasos:

- npm install para bajar las dependencias
- iniciar tu base Mongo en local -> en el congig.js puedes editar el puerto y el nombre
- npm start para arrancar el servidor express
- Ir al navegador a http://localhost:8080

El Rest funciona si quieres verlo en las rutas:
    - http://localhost:8080/posts
    - http://localhost:8080/users

Verás que la contraseña está encriptada desde la bbdd ;)

No he tocado casi nada de estilos, por lo que me he basado en la plantilla "Light Bootstrap Dashboard by Creative Tim"
