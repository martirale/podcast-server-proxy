# Podcast Server Proxy

Servidor proxy de podcasts con Express 5. Consulta una fuente RSS configurada en el servidor y devuelve sus episodios como JSON para que cualquier sitio web o reproductor pueda consumirlos.

El proyecto puede usarse en distintos sitios y no depende de una marca, un reproductor ni un proveedor de podcasts específico. La compatibilidad de cada fuente depende de su estructura y de lo que admita `rss-parser`.

## Funcionamiento

1. El frontend solicita `GET /api/podcast`.
2. El servidor consulta la URL definida en `SOURCE` y analiza su RSS con `rss-parser`.
3. La API devuelve el arreglo de episodios (`feed.items`) como JSON.

La respuesta contiene los campos que normaliza `rss-parser`; no devuelve el XML original ni los metadatos generales del canal. Cada solicitud vuelve a consultar la fuente: no hay caché ni almacenamiento local.

El middleware `cors` permite que el navegador consulte esta API desde otros dominios. La fuente RSS se consulta desde el servidor, por lo que esa solicitud no está sujeta a las restricciones CORS del navegador.

## Requisitos

- Node.js **22.23.4**
- npm, incluido con Node.js
- Git, para clonar el repositorio

No requiere compilación. Un administrador de procesos y un proxy inverso con HTTPS son opciones de despliegue, no requisitos para ejecutarlo localmente.

## Instalación

```sh
git clone https://github.com/martirale/podcast-server-proxy.git
cd podcast-server-proxy
npm ci
```

## Configuración

El servidor lee estas variables del entorno:

| Variable | Requerida | Descripción |
| --- | --- | --- |
| `PORT` | Sí | Puerto HTTP en el que escucha el servidor |
| `SOURCE` | Sí | URL HTTP o HTTPS de la fuente RSS del podcast |

No hay un puerto predeterminado ni se carga un archivo `.env` automáticamente. Configurá ambas variables en tu plataforma de despliegue o al iniciar el proceso:

```sh
PORT=3010 SOURCE="https://example.com/podcast.xml" npm start
```

## API

### `GET /api/podcast`

Devuelve un arreglo JSON con los episodios de la fuente configurada. Los campos disponibles dependen del feed y de cómo los interprete `rss-parser`.

```js
const response = await fetch('https://podcast.example.com/api/podcast');

if (!response.ok) {
  throw new Error('Unable to fetch podcast episodes');
}

const episodes = await response.json();
```

Si la consulta o el análisis de la fuente falla, devuelve HTTP `500`:

```json
{
  "error": "Error fetching RSS feed"
}
```

La API no recibe URLs desde el cliente. Cada instancia consulta una sola fuente, definida por `SOURCE`. No descarga ni retransmite los archivos de audio de los episodios.

## Despliegue

Usá Node.js `22.23.4` también en el VPS o contenedor; el campo `engines` declara el requisito, pero no instala ni actualiza Node.js.

Configurá `PORT` y `SOURCE` en el entorno del servicio. El comando de inicio es:

```sh
npm start
```

Si administrás el proceso con PM2, una vez instalado podés iniciarlo así:

```sh
PORT=3010 SOURCE="https://example.com/podcast.xml" pm2 start server.js --name podcast-proxy
pm2 save
```

Publicá el servicio detrás de un proxy inverso con HTTPS, como Nginx, Traefik o Caddy. La API permite solicitudes desde cualquier origen y no implementa autenticación; tenelo en cuenta al decidir dónde exponerla.

## Licencia

Apache License 2.0. Consultá [LICENSE](LICENSE) y [NOTICE](NOTICE).
