# Mapa Interactivo La Chispa

Una aplicación de mapa interactivo diseñada para visualizar datos geográficos relevantes El proyecto está construido con React, TypeScript y Vite, utilizando React-Leaflet para la renderización de mapas.

## Funcionalidades Actuales

- **Mapa Interactivo:** Navegación fluida con controles de zoom y desplazamiento.
- **Control de Capas:** Un menú permite al usuario activar o desactivar la visibilidad de las diferentes capas de datos disponibles.
- **Clustering de Marcadores:** Optimización de rendimiento para capas con un gran número de puntos, agrupándolos visualmente para evitar la saturación del mapa.

## Capas Disponibles

1.  **Unidades Vecinales:** Muestra los polígonos que definen las áreas de las unidades vecinales de la comuna.
2.  **Juntas de Vecinos:** Muestra la ubicación de aproximadamente 1500 juntas de vecinos a través de marcadores individuales, agrupados en clusters para una mejor visualización.

---

## Instrucciones de Instalación y Uso

### Prerrequisitos
- Node.js y npm instalados.

### Pasos

1.  **Clonar el repositorio**
    (Reemplazar `<URL_DEL_REPOSITORIO>` con la URL real)
    ```bash
    git clone <URL_DEL_REPOSITORIO>
    ```

2.  **Ingresar al directorio del proyecto e instalar dependencias**
    ```bash
    cd mapa-lachispa
    npm install
    ```

3.  **Iniciar el servidor en modo desarrollo**
    ```bash
    npm run dev
    ```

4.  **Abrir el navegador y acceder a la aplicación**
    La aplicación estará disponible en la URL que indique la consola, generalmente:
    ```plaintext
    http://localhost:5173
    ```

5.  **Detener el servidor**
    En la terminal donde se ejecuta `npm run dev`, presionar:
    ```bash
    Ctrl + C
    ```
