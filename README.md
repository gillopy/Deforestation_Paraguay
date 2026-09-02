# Web estatica de deforestacion en Paraguay (Vanilla JS + GSAP)

Este proyecto ahora esta enfocado en una pagina web estatica tipo articulo:

- JavaScript vanilla (sin frameworks)
- Animaciones con GSAP + ScrollTrigger por CDN
- Datos desde `data/paraguay_deforestacion.csv`
- Imagenes PNG por departamento desde `images/`

No hace falta ejecutar `hansen_export_pipeline.py` para esta etapa (ya tenes los datos).

## Estructura

- `index.html`: estructura principal del articulo
- `assets/css/styles.css`: diseno, layout y responsive
- `assets/js/main.js`: carga de datos, metricas, ranking, grafico y explorador
- `data/paraguay_deforestacion.csv`: base para estadisticas
- `data/paraguay_deforestacion.json`: copia de `paraguay_deforestacion.partial.json` para compatibilidad
- `images/*`: mapas exportados por departamento y capa (`cover`, `loss`, `combined`)

## Preparativos realizados

Se ejecutaron preparativos por terminal `cmd`:

1. Creacion de carpetas `assets/`, `assets/css/`, `assets/js/`.
2. Copia de `data/paraguay_deforestacion.partial.json` a `data/paraguay_deforestacion.json`.

## Como correr localmente

Recomendado (para que `fetch()` funcione):

```cmd
cd /d c:\Users\solox\OneDrive\Escritorio\paraguay-deforestacion-hansen
python -m http.server 5500
```

Luego abrir:

- `http://localhost:5500/`

Tambien podes usar cualquier servidor estatico (Live Server, nginx, etc.).

## Que muestra la pagina

- Hero animado
- Metricas nacionales (cobertura, perdida, promedio anual, depto mas afectado)
- Grafico anual de perdida en canvas (vanilla)
- Explorador por departamento y capa de imagen
- Ranking de departamentos por porcentaje perdido

## Nota tecnica

El parser CSV esta hecho en vanilla JS y asume el formato actual del archivo fuente.
Si cambia el esquema del CSV, hay que ajustar `assets/js/main.js`.
