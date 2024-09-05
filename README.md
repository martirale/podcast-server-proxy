# Podcast Server Proxy

![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)

Servidor proxy creado en Express para obtención de contenido CORS de Spotify Podcasters (o cualquier fuente RSS _a priori_) al reproductor web de podcasts de [Creatyum Media](https://creatyum.media/podcast).

## Características principales

- **Obtención del contenido:** Obtiene el contenido completo de la fuente RSS de tu proveedor de podcast.
- **Resolución de CORS:** Resuelve el problema de CORS generado cuando tu front-end solicita directamente a la fuente el contenido empleando una técnica de proxy.
- **API propia:** Al realizar la implementación obtienes el contenido exacto como lo proporciona tu proveedor con tu propio dominio y servidor, lo que te permite emplear tu propia API para alimentar tu proyecto.

## Cómo usar

### Requisitos

- Node.js v20
- NPM 10 (o el que prefieras)
- Git
- Nginx Proxy Manager
- Certbot
- PM2 (o el que prefieras)

### Instalación

1. Clona el repositorio

```sh
https://github.com/martirale/podcast-server-proxy.git
```

2. Instala los paquetes de NPM

```sh
npm install
```

3. Ajusta el puerto (o déjalo por defecto en 3010)

```js
// server.js

const port = process.env.PORT || 3010;
```

4. Ajusta tu fuente RSS (URL)

```js
// server.js

const rssUrl = "YOUR RSS SOURCE";
```

5. Ejecuta el servidor proxy
   -Asegúrate de tener PM2 instalado globalmente en tu servidor

```sh
npm install -g pm2
```

- En el directorio raíz del proyecto de Express ejecuta el siguiente comando

```sh
pm2 start server.js --name podcast-proxy
```

- Guarda el proceso con PM2

```sh
pm2 save
```

6. Configura un dominio (o sub-dominio) para tu servidor proxy utilizando `Nginx Proxy Manager` y `Certbot` para el SSL y así poder utilizar la API en tu front-end sin riesgos de seguridad al utilizar directamente la IP del servidor o un protocolo HTTP plano.

## Explicación

Express actúa como intermediario (proxy) entre el front-end (en mi caso, mi reproductor web) y la fuente de datos de Spotify (o el feed RSS de tu podcast).

Este servidor Express hace lo siguiente:

1. Solicita el feed RSS desde Spotify utilizando `rss-parser`.
2. Aplica `cors` para permitir que nuestro dominio acceda a la API sin restricciones.
3. Reenvía el contenido al front-end como si fuera una API interna desde nuestro servidor.

Por lo que, estamos creando un intermediario que omite las restricciones de CORS. De esta forma, el navegador no interactúa directamente con Spotify (que no permite acceder a sus datos directamente), sino que con nuestro servidor, el cual está autorizado para hacer la petición y devolvernos los datos sin el mencionado problema de CORS.

### ¿Por qué?

La razón de esta solución es debido a un problema de CORS (Cross-Origin Resource Sharing). Este problema ocurre cuando el navegador bloquea solicitudes hechas desde nuestro dominio hacia otro dominio, ya que el otro dominio no está autorizado explícitamente para compartir recursos con nuestro dominio.

Tras una búsqueda bastante grande en foros y blogs e innumerables iteraciones con ChatGPT y Claude, logré una amalgama de configuraciones que tras limpiarlas y probarlas logré dar con esta solución y espero que pueda servir como solución para otros pérdidos como yo.

## Descargo de responsabilidad

Esta solución está hecha y probada para funcionar correctamente con la estructura de la fuente RSS de Spotify Podcasters para ser usada en mi [reproductor de podcast web propio](https://creatyum.media/podcast) y **no doy garantía de que funcione con otras fuentes RSS.** _A priori_, sí debería funcionar con cualquier fuente RSS ya que el servidor hace únicamente la función de proxy, por lo que tendría que ser tu lógica en el front-end y la estructura de la fuente RSS que estés empleando el cómo vas a trabajar los datos. **Este servidor proxy es únicamente un intermediario que resuelve el problema de CORS.**
