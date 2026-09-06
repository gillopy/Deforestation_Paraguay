# Web estatica de deforestacion en Paraguay (Vanilla JS + Scrollama)

Este proyecto ahora esta enfocado en una pagina web estatica tipo articulo:

- JavaScript vanilla (sin frameworks)
- Scrollytelling con Scrollama por CDN (el `#scrolly` de Placa 01)
- Datos desde `data/paraguay_deforestacion.json` (+ CSV para descarga)
- Imagenes PNG por departamento desde `images/`
- Placas 06-10: anexo documental del informe Planet "Gran Chaco
  2016-2026" (figuras originales en `images/informe/` y mapa de
  sitios replicado sobre `data/py.json`)

No hace falta ejecutar `hansen_export_pipeline.py` para esta etapa (ya tenes los datos).

## Estructura

- `index.html`: estructura principal del articulo (Placas 01-10)
- `assets/css/styles.css`: diseno, layout y responsive
- `assets/js/main.js`: carga de datos, metricas, ranking, grafico y explorador; `renderReportMap()` replica los sitios del informe
- `data/paraguay_deforestacion.csv`: base para estadisticas y descarga
- `data/paraguay_deforestacion.json`: copia de `paraguay_deforestacion.partial.json` para compatibilidad
- `images/*`: mapas exportados por departamento y capa (`cover`, `loss`, `combined`)
- `images/informe/*`: figuras y pares PlanetScope descargados del informe Planet 2016-2026 (anexo documental, Placas 06-10)

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
