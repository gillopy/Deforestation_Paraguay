    /* ============================================================
       CONFIGURACIÓN
       ============================================================ */

    const CONFIG = {

      jsonPath: "data/paraguay_deforestacion.json",

      imagePath: "images/",

      /*

        Nombres EXACTOS de los mapas utilizados en el scrollytelling.

        El encodeURI permite trabajar correctamente con caracteres
        como "ó" en "Boquerón".

      */

      storyImages: {

        1:
          "map_export_Alto_Paraguay_Boquerón_combined_forest_change_year_2_high_res.png",

        2:
          "map_export_Alto_Paraguay_Boquerón_combined_forest_change_year_10_high_res.png",

        3:
          "map_export_Alto_Paraguay_Boquerón_combined_forest_change_year_25_high_res.png"

      },

      storyLabels: {

        1: "AÑO 2002 · ALTO PARAGUAY + BOQUERÓN",

        2: "AÑO 2010 · ALTO PARAGUAY + BOQUERÓN",

        3: "AÑO 2025 · ALTO PARAGUAY + BOQUERÓN"

      }

    };


    const REDUCED_MOTION =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const STORAGE_KEY =
      "hansen-scrolly-step";


    /* ============================================================
       ELEMENTOS
       ============================================================ */

    const storyImage =
      document.getElementById("storyImage");

    const imageYear =
      document.getElementById("imageYear");

    const departmentSelect =
      document.getElementById("departmentSelect");

    const layerSelect =
      document.getElementById("layerSelect");

    const departmentImage =
      document.getElementById("departmentImage");

    const departmentCaption =
      document.getElementById("departmentCaption");

    const departmentMapSvg =
      document.getElementById("departmentMap");

    const mapHint =
      document.getElementById("mapHint");

    let departmentsCatalog = [];


    /* ============================================================
       FORMATO DE NÚMEROS
       ============================================================ */

    function formatHa(value) {

      const number = Number(value);

      if (!Number.isFinite(number)) return "—";

      return (
        new Intl.NumberFormat("es-PY", {
          maximumFractionDigits: 0
        }).format(number) + " ha"
      );

    }

    function formatPct(value) {

      const number = Number(value);

      if (!Number.isFinite(number)) return "—";

      return (
        new Intl.NumberFormat("es-PY", {
          minimumFractionDigits: 1,
          maximumFractionDigits: 1
        }).format(number) + "%"
      );

    }


    /* ============================================================
       SCROLLYTELLING
       ============================================================ */

    const railDashes =
      Array.from(document.querySelectorAll(".rail-dash"));

    const railCaption =
      document.getElementById("railCaption");

    const railYears = { 1: "2002", 2: "2010", 3: "2025" };

    let currentStep = 1;

    const restoredStep = (() => {

      try {

        return sessionStorage.getItem(STORAGE_KEY);

      }

      catch (error) {

        return null;

      }

    })();

    function updateRail(step) {

      currentStep = Number(step) || 1;

      railDashes.forEach(dash => {

        dash.classList.toggle(
          "is-on",
          Number(dash.dataset.rail) <= currentStep
        );

        dash.classList.remove("is-flagged");

      });

      if (railCaption) {

        railCaption.textContent = railYears[currentStep] || "";

      }

      try {

        sessionStorage.setItem(STORAGE_KEY, String(currentStep));

      }

      catch (error) {

        /* almacenamiento no disponible: el raíl sigue funcionando */

      }

    }

    function flagStoppedStep() {

      /* el marco donde te detuviste queda marcado al volver */

      const stopped = restoredStep;

      if (!stopped || stopped === "1") return;

      const dash =
        railDashes.find(d => d.dataset.rail === stopped);

      if (dash) {

        dash.classList.add("is-flagged");

        if (railCaption) {

          railCaption.innerHTML =
            railYears[Number(stopped)] +
            ' · <span class="was">volviste a este marco</span>';

        }

      }

    }

    function changeStoryImage(step) {

      const filename =
        CONFIG.storyImages[step];

      if (!filename) return;

      const newSrc =
        encodeURI(CONFIG.imagePath + filename);

      updateRail(step);

      if (REDUCED_MOTION) {

        storyImage.src = newSrc;

        imageYear.textContent =
          CONFIG.storyLabels[step];

        return;

      }

      /* snap de un curso: cambia en un paso, sin crossfade */

      storyImage.classList.add("is-swapping");

      const apply = () => {

        storyImage.src = newSrc;

        imageYear.textContent =
          CONFIG.storyLabels[step];

        const settle = () => {

          storyImage.classList.remove("is-swapping");

        };

        if (storyImage.complete) {

          settle();

        }

        else {

          storyImage.onload = settle;

        }

      };

      setTimeout(apply, 120);

    }


    /* ============================================================
       SCROLLAMA
       ============================================================ */

    let scroller = null;


    function setupScroller() {

      /*
        Scrollama se carga con `defer` desde el CDN y por tanto aún no
        está disponible cuando main.js se ejecuta bloqueante al final
        del body. Se instancia aquí, dentro de DOMContentLoaded, cuando
        los scripts `defer` ya corrieron.
      */

      if (!window.scrollama) {

        console.warn(
          "Scrollama no se pudo cargar (CDN no disponible); " +
          "se omite la animación de scroll, el resto del sitio sigue funcionando."
        );

        return;

      }

      scroller = scrollama();

      scroller
        .setup({

          step: "#scrolly article .step",

          offset: 0.55,

          progress: false

        })

        .onStepEnter(response => {

          const step =
            response.element.dataset.step;

          document
            .querySelectorAll(".step")
            .forEach(element => {

              element.classList.remove("is-active");

            });

          response.element
            .classList.add("is-active");

          changeStoryImage(step);

        });

    }


    /* ============================================================
       RESIZE
       ============================================================ */

    window.addEventListener(
      "resize",
      () => {

        scroller?.resize();

      }
    );


    /* ============================================================
       JSON
       ============================================================ */

    async function loadData() {

      try {

        const response =
          await fetch(CONFIG.jsonPath);

        if (!response.ok) {

          throw new Error(
            `HTTP ${response.status}`
          );

        }

        const data =
          await response.json();

        populateDepartments(data);

        updateConcentrationStat(data);

        loadDepartmentMap();

      }

      catch (error) {

        console.error(
          "No se pudo cargar el JSON:",
          error
        );

        departmentCaption.textContent =
          "No fue posible cargar los datos departamentales.";

      }

    }


    /* ============================================================
       ESTADÍSTICA DE CONCENTRACIÓN
       ============================================================ */

    function updateConcentrationStat(data) {

      const statEl =
        document.getElementById("statConcentration");

      if (!statEl) return;

      const byName =
        Object.fromEntries(
          (data.departments || []).map(
            dept => [dept.name, dept]
          )
        );

      const boqueron = byName["Boquerón"];
      const altoParaguay = byName["Alto Paraguay"];
      const nationalLoss = data.national?.loss_total_ha;

      if (!boqueron || !altoParaguay || !nationalLoss) return;

      const share =
        ((boqueron.loss_total_ha + altoParaguay.loss_total_ha) /
          nationalLoss) *
        100;

      statEl.textContent =
        `${formatPct(share)} del total`;

    }


    /* ============================================================
       NORMALIZACIÓN DE NOMBRES
       ============================================================ */

    function normalizeDepartmentName(name) {

      return String(name)

        .normalize("NFD")

        .replace(/[\u0300-\u036f]/g, "")

        .toLowerCase()

        .replace(/\s+/g, "_")

        .replace(/[^a-z0-9_-]/g, "");

    }


    /* ============================================================
       OBTENER DEPARTAMENTOS DESDE JSON
       ============================================================ */

    function extractDepartments(data) {

      if (Array.isArray(data.departments)) {

        return data.departments;

      }

      return Array.isArray(data) ? data : [];

    }


    /* ============================================================
       BUSCAR NOMBRE DEL DEPARTAMENTO
       ============================================================ */

    function getDepartmentName(row) {

      return row.name || row.slug || "";

    }


    /* ============================================================
       POBLAR SELECTOR
       ============================================================ */

    function populateDepartments(data) {

      const rows =
        extractDepartments(data);

      const departments = [];

      rows.forEach(row => {

        const name =
          getDepartmentName(row);

        if (!name) return;

        const slug =
          row.slug || normalizeDepartmentName(name);

        departments.push({

          name,
          slug,
          data: row

        });

      });


      /*
        Elimina duplicados.
      */

      const unique =
        Array.from(

          new Map(
            departments.map(
              item => [item.slug, item]
            )
          ).values()

        );


      /*
        Orden alfabético.
      */

      unique.sort(
        (a, b) =>
          a.name.localeCompare(
            b.name,
            "es"
          )
      );


      departmentSelect.innerHTML = "";

      const defaultOption =
        document.createElement("option");

      defaultOption.value = "";

      defaultOption.textContent =
        "Seleccionar departamento";

      departmentSelect.appendChild(
        defaultOption
      );


      unique.forEach(item => {

        const option =
          document.createElement("option");

        option.value =
          item.slug;

        option.textContent =
          item.name;

        departmentSelect.appendChild(
          option
        );

      });

      departmentsCatalog = unique;


      /*
        Por defecto mostramos Boquerón, el departamento en el
        que se centra el artículo (con Alto Paraguay como
        segunda opción de respaldo).
      */

      const initial =
        unique.find(d => d.slug === "boqueron") ||
        unique.find(d => d.slug === "alto_paraguay") ||
        unique[0];

      if (initial) {

        selectDepartmentBySlug(initial.slug);

      }

    }


    /* ============================================================
       MOSTRAR DEPARTAMENTO
       ============================================================ */

    function showDepartment(item) {

      if (!item) return;

      const selectedLayer =
        layerSelect?.value || "combined";

      const selectedLayerLabel =
        layerSelect?.selectedOptions[0]?.textContent.trim() ||
        selectedLayer;

      const relativePath =
        item.data?.images?.[selectedLayer] ||
        `${CONFIG.imagePath}${item.slug}_${selectedLayer}.png`;

      departmentImage.style.opacity =
        "0";

      setTimeout(() => {

        departmentImage.src =
          encodeURI(relativePath);

        departmentImage.alt =
          `Mapa completo de ${item.name}`;

        const stats = item.data;

        departmentCaption.textContent = stats
          ? `${item.name} · ${selectedLayerLabel} · cobertura 2000: ${formatHa(stats.treecover2000_ha)} · pérdida acumulada: ${formatHa(stats.loss_total_ha)} (${formatPct(stats.loss_pct)})`
          : `${item.name} · ${selectedLayerLabel}`;

        departmentImage.onload = () => {

          departmentImage.style.opacity =
            "1";

        };

        departmentImage.onerror = () => {

          departmentCaption.textContent =
            `No se encontró la imagen de ${item.name}.`;

        };

      }, 120);

    }


    /* ============================================================
       SELECCIÓN COMPARTIDA (selector, mapa)
       ============================================================ */

    function selectDepartmentBySlug(slug) {

      const dept =
        departmentsCatalog.find(
          d => d.slug === slug
        );

      if (!dept) return;

      departmentSelect.value = slug;

      showDepartment(dept);

      highlightMapDepartment(slug);

    }


    /* ============================================================
       MAPA DE DEPARTAMENTOS (usa data/py.json)
       ============================================================ */

    const MAP_CONFIG = {

      geoPath: "data/py.json",

      width: 520,

      height: 560,

      padding: 18

    };


    /*
      Proyecta coordenadas [lon, lat] a puntos [x, y] del SVG.
      Usa una equirectangular simple, corrigiendo el ancho por
      el coseno de la latitud media para no deformar el país,
      y escala todo de manera uniforme para que quepa en el
      viewBox sin estirarse.
    */

    function projectPoints(features) {

      let minLon = Infinity;
      let maxLon = -Infinity;
      let minLat = Infinity;
      let maxLat = -Infinity;

      features.forEach(feature => {

        feature.geometry.coordinates[0].forEach(([lon, lat]) => {

          if (lon < minLon) minLon = lon;
          if (lon > maxLon) maxLon = lon;
          if (lat < minLat) minLat = lat;
          if (lat > maxLat) maxLat = lat;

        });

      });

      const meanLat = (minLat + maxLat) / 2;
      const cosLat = Math.cos((meanLat * Math.PI) / 180);

      const rawMinX = minLon * cosLat;
      const rawMaxX = maxLon * cosLat;
      const rawMinY = -maxLat;
      const rawMaxY = -minLat;

      const innerW = MAP_CONFIG.width - MAP_CONFIG.padding * 2;
      const innerH = MAP_CONFIG.height - MAP_CONFIG.padding * 2;

      const scale =
        Math.min(
          innerW / (rawMaxX - rawMinX),
          innerH / (rawMaxY - rawMinY)
        );

      const offsetX =
        MAP_CONFIG.padding +
        (innerW - (rawMaxX - rawMinX) * scale) / 2;

      const offsetY =
        MAP_CONFIG.padding +
        (innerH - (rawMaxY - rawMinY) * scale) / 2;

      return function project([lon, lat]) {

        const x = (lon * cosLat - rawMinX) * scale + offsetX;
        const y = (-lat - rawMinY) * scale + offsetY;

        return [x, y];

      };

    }

    function ringToPath(ring, project) {

      return (
        ring
          .map(([lon, lat], index) => {

            const [x, y] = project([lon, lat]);

            return `${index === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;

          })
          .join(" ") + " Z"
      );

    }

    /*
      Escala de color de 3 puntos (dosel -> ocre de expedición ->
      bermellón de pérdida), luminancia elevada para el fondo oscuro,
      la misma rampa que declara la leyenda en styles.css.
    */

    function lossColor(pct, minPct, maxPct) {

      const stops = [
        [111, 173, 120],
        [214, 169, 46],
        [226, 85, 62]
      ];

      const range = maxPct - minPct;
      const t = range > 0 ? Math.min(1, Math.max(0, (pct - minPct) / range)) : 0;

      const scaled = t * (stops.length - 1);
      const i = Math.min(stops.length - 2, Math.floor(scaled));
      const localT = scaled - i;

      const [r1, g1, b1] = stops[i];
      const [r2, g2, b2] = stops[i + 1];

      const r = Math.round(r1 + (r2 - r1) * localT);
      const g = Math.round(g1 + (g2 - g1) * localT);
      const b = Math.round(b1 + (b2 - b1) * localT);

      return `rgb(${r}, ${g}, ${b})`;

    }

    function highlightMapDepartment(slug) {

      if (!departmentMapSvg) return;

      departmentMapSvg
        .querySelectorAll(".dept-path")
        .forEach(path => {

          path.classList.toggle(
            "is-selected",
            path.dataset.slug === slug
          );

        });

    }

    async function loadDepartmentMap() {

      if (!departmentMapSvg) return;

      try {

        const response =
          await fetch(MAP_CONFIG.geoPath);

        if (!response.ok) {

          throw new Error(`HTTP ${response.status}`);

        }

        const geo =
          await response.json();

        const features =
          (geo.features || []).filter(
            feature => feature.geometry?.type === "Polygon"
          );

        const project = projectPoints(features);

        const lossPctValues =
          departmentsCatalog
            .map(dept => Number(dept.data?.loss_pct))
            .filter(Number.isFinite);

        const minPct = Math.min(...lossPctValues);
        const maxPct = Math.max(...lossPctValues);

        departmentMapSvg.setAttribute(
          "viewBox",
          `0 0 ${MAP_CONFIG.width} ${MAP_CONFIG.height}`
        );

        departmentMapSvg.innerHTML = "";

        features.forEach(feature => {

          const name = feature.properties?.name || "";
          const slug = normalizeDepartmentName(name);

          const match =
            departmentsCatalog.find(dept => dept.slug === slug);

          const pct = Number(match?.data?.loss_pct);

          const fill =
            Number.isFinite(pct)
              ? lossColor(pct, minPct, maxPct)
              : "#1A2332";

          const path =
            document.createElementNS(
              "http://www.w3.org/2000/svg",
              "path"
            );

          path.setAttribute(
            "d",
            ringToPath(feature.geometry.coordinates[0], project)
          );

          path.setAttribute("fill", fill);
          path.classList.add("dept-path");
          path.dataset.slug = slug;
          path.setAttribute("tabindex", "0");
          path.setAttribute("role", "button");

          path.setAttribute(
            "aria-label",
            Number.isFinite(pct)
              ? `${name}, ${formatPct(pct)} de pérdida forestal`
              : name
          );

          const title =
            document.createElementNS(
              "http://www.w3.org/2000/svg",
              "title"
            );

          title.textContent =
            Number.isFinite(pct)
              ? `${name} · ${formatPct(pct)} de pérdida forestal`
              : name;

          path.appendChild(title);

          const select = () => selectDepartmentBySlug(slug);

          path.addEventListener("click", select);

          path.addEventListener("keydown", event => {

            if (event.key === "Enter" || event.key === " ") {

              event.preventDefault();
              select();

            }

          });

          path.addEventListener("mouseenter", () => {

            if (!mapHint) return;

            mapHint.textContent =
              Number.isFinite(pct)
                ? `${name} · ${formatPct(pct)} de pérdida forestal desde 2001`
                : name;

          });

          departmentMapSvg.appendChild(path);

        });

        const legendMin =
          document.getElementById("legendMin");

        const legendMax =
          document.getElementById("legendMax");

        if (legendMin) legendMin.textContent = formatPct(minPct);
        if (legendMax) legendMax.textContent = formatPct(maxPct);

        highlightMapDepartment(departmentSelect.value);

        departmentMapSvg.addEventListener("mouseleave", () => {

          if (mapHint) {

            mapHint.textContent =
              "Pasá el cursor o hacé clic sobre un departamento.";

          }

        });

      }

      catch (error) {

        console.error(
          "No se pudo cargar el mapa de departamentos:",
          error
        );

        if (mapHint) {

          mapHint.textContent =
            "No fue posible cargar el mapa de departamentos.";

        }

      }

    }


    /* ============================================================
       SELECTOR
       ============================================================ */

    departmentSelect.addEventListener(
      "change",
      event => {

        if (event.target.value) {

          selectDepartmentBySlug(
            event.target.value
          );

        }

      }
    );

    layerSelect?.addEventListener(
      "change",
      () => {

        if (departmentSelect.value) {

          selectDepartmentBySlug(
            departmentSelect.value
          );

        }

      }
    );


    /* ============================================================
       GRÁFICOS DE PÉRDIDA Y EMISIONES (CSV de GFW)
       ============================================================ */

    /*
      Formato compacto para valores grandes de los ejes
      (por ejemplo "4,6 M" o "850 k").
    */

    function formatCompact(value) {

      const number = Number(value);

      if (!Number.isFinite(number)) return "—";

      const abs = Math.abs(number);

      if (abs >= 1000000) {

        return (
          new Intl.NumberFormat("es-PY", {
            maximumFractionDigits: 1
          }).format(number / 1000000) + " M"
        );

      }

      if (abs >= 1000) {

        return (
          new Intl.NumberFormat("es-PY", {
            maximumFractionDigits: 0
          }).format(number / 1000) + " k"
        );

      }

      return (
        new Intl.NumberFormat("es-PY", {
          maximumFractionDigits: 0
        }).format(number)
      );

    }

    /*
      Parser de CSV simple, suficiente para los archivos
      exportados por Global Forest Watch (columnas separadas
      por coma, valores entre comillas, sin comas internas).
    */

    function parseChartCsv(text) {

      const lines =
        text
          .split(String.fromCharCode(10))
          .map(line => line.trim())
          .filter(line => line !== "");

      const headers =
        lines[0]
          .split(",")
          .map(h => h.replace(/^"|"$/g, ""));

      return lines.slice(1).map(line => {

        const values =
          line
            .split(",")
            .map(v => v.replace(/^"|"$/g, ""));

        const row = {};

        headers.forEach((header, index) => {
          row[header] = values[index];
        });

        return row;

      });

    }

    /*
      Dibuja dentro de un <svg> un gráfico combinado:
      barras para la pérdida anual (hectáreas, eje izquierdo)
      y una línea superpuesta para las emisiones brutas de
      CO₂e (Mg, eje derecho).
    */

    function renderLossChart(svgEl, rows) {

      const data =
        rows
          .map(row => ({

            year:
              Number(row.umd_tree_cover_loss__year),

            lossHa:
              Number(row.umd_tree_cover_loss__ha),

            emissions:
              Number(row.gfw_gross_emissions_co2e_all_gases__Mg)

          }))
          .filter(d => Number.isFinite(d.year))
          .sort((a, b) => a.year - b.year);

      if (!data.length) return;

      const svgNs = "http://www.w3.org/2000/svg";

      const width = 560;
      const height = 300;

      const margin = {
        top: 30,
        right: 58,
        bottom: 42,
        left: 58
      };

      const innerW = width - margin.left - margin.right;
      const innerH = height - margin.top - margin.bottom;

      const maxLoss =
        Math.max(...data.map(d => d.lossHa), 1);

      const maxEmissions =
        Math.max(
          ...data
            .map(d => d.emissions)
            .filter(Number.isFinite),
          1
        );

      const band = innerW / data.length;

      const barWidth = Math.max(2, band * 0.55);

      const xCenter = index =>
        margin.left + index * band + band / 2;

      const yLoss = value =>
        margin.top + innerH - (value / maxLoss) * innerH;

      const yEmissions = value =>
        margin.top + innerH - (value / maxEmissions) * innerH;

      svgEl.setAttribute(
        "viewBox",
        `0 0 ${width} ${height}`
      );

      svgEl.innerHTML = "";

      /*
        Guías horizontales y etiquetas de ambos ejes.
      */

      const tickCount = 4;

      for (let i = 0; i <= tickCount; i++) {

        const ratio = i / tickCount;

        const y =
          margin.top + innerH - ratio * innerH;

        const gridLine =
          document.createElementNS(svgNs, "line");

        gridLine.setAttribute("x1", margin.left);
        gridLine.setAttribute("x2", width - margin.right);
        gridLine.setAttribute("y1", y);
        gridLine.setAttribute("y2", y);
        gridLine.setAttribute("class", "chart-grid-line");

        svgEl.appendChild(gridLine);

        const lossTick =
          document.createElementNS(svgNs, "text");

        lossTick.setAttribute("x", margin.left - 8);
        lossTick.setAttribute("y", y + 3);
        lossTick.setAttribute("text-anchor", "end");
        lossTick.setAttribute("class", "chart-axis-label");
        lossTick.textContent =
          formatCompact(maxLoss * ratio);

        svgEl.appendChild(lossTick);

        const emissionsTick =
          document.createElementNS(svgNs, "text");

        emissionsTick.setAttribute(
          "x",
          width - margin.right + 8
        );
        emissionsTick.setAttribute("y", y + 3);
        emissionsTick.setAttribute("text-anchor", "start");
        emissionsTick.setAttribute(
          "class",
          "chart-axis-label chart-axis-label--line"
        );
        emissionsTick.textContent =
          formatCompact(maxEmissions * ratio);

        svgEl.appendChild(emissionsTick);

      }

      /*
        Unidades de cada eje.
      */

      const lossUnit =
        document.createElementNS(svgNs, "text");

      lossUnit.setAttribute("x", margin.left - 8);
      lossUnit.setAttribute("y", margin.top - 12);
      lossUnit.setAttribute("text-anchor", "end");
      lossUnit.setAttribute("class", "chart-axis-unit");
      lossUnit.textContent = "ha";

      svgEl.appendChild(lossUnit);

      const emissionsUnit =
        document.createElementNS(svgNs, "text");

      emissionsUnit.setAttribute(
        "x",
        width - margin.right + 8
      );
      emissionsUnit.setAttribute("y", margin.top - 12);
      emissionsUnit.setAttribute("text-anchor", "start");
      emissionsUnit.setAttribute(
        "class",
        "chart-axis-unit chart-axis-unit--line"
      );
      emissionsUnit.textContent = "Mg CO₂e";

      svgEl.appendChild(emissionsUnit);

      /*
        Etiquetas de años (como máximo unas 6).
      */

      const labelStep =
        Math.max(1, Math.ceil(data.length / 6));

      data.forEach((d, index) => {

        if (
          index % labelStep !== 0 &&
          index !== data.length - 1
        ) return;

        const yearLabel =
          document.createElementNS(svgNs, "text");

        yearLabel.setAttribute("x", xCenter(index));
        yearLabel.setAttribute(
          "y",
          height - margin.bottom + 18
        );
        yearLabel.setAttribute("text-anchor", "middle");
        yearLabel.setAttribute("class", "chart-axis-label");
        yearLabel.textContent = d.year;

        svgEl.appendChild(yearLabel);

      });

      /*
        Línea base del eje x.
      */

      const baseline =
        document.createElementNS(svgNs, "line");

      baseline.setAttribute("x1", margin.left);
      baseline.setAttribute("x2", width - margin.right);
      baseline.setAttribute("y1", margin.top + innerH);
      baseline.setAttribute("y2", margin.top + innerH);
      baseline.setAttribute("class", "chart-axis-line");

      svgEl.appendChild(baseline);

      /*
        Barras de pérdida anual.
      */

      data.forEach((d, index) => {

        const barHeight =
          Math.max(
            (d.lossHa / maxLoss) * innerH,
            1
          );

        const rect =
          document.createElementNS(svgNs, "rect");

        rect.setAttribute(
          "x",
          xCenter(index) - barWidth / 2
        );
        rect.setAttribute(
          "y",
          margin.top + innerH - barHeight
        );
        rect.setAttribute("width", barWidth);
        rect.setAttribute("height", barHeight);
        rect.setAttribute("rx", 2);
        rect.setAttribute("class", "chart-bar");

        const title =
          document.createElementNS(svgNs, "title");

        title.textContent =
          `${d.year} · pérdida: ${formatHa(d.lossHa)} · emisiones: ${formatCompact(d.emissions)} Mg CO₂e`;

        rect.appendChild(title);

        svgEl.appendChild(rect);

      });

      /*
        Línea de emisiones superpuesta.
      */

      const linePoints =
        data
          .map((d, index) =>
            Number.isFinite(d.emissions)
              ? [xCenter(index), yEmissions(d.emissions), d]
              : null
          )
          .filter(Boolean);

      if (linePoints.length) {

        const linePath =
          document.createElementNS(svgNs, "path");

        linePath.setAttribute(
          "d",
          linePoints
            .map((point, index) =>
              `${index === 0 ? "M" : "L"}${point[0].toFixed(1)},${point[1].toFixed(1)}`
            )
            .join(" ")
        );

        linePath.setAttribute("class", "chart-line");

        svgEl.appendChild(linePath);

        linePoints.forEach(point => {

          const circle =
            document.createElementNS(svgNs, "circle");

          circle.setAttribute("cx", point[0]);
          circle.setAttribute("cy", point[1]);
          circle.setAttribute("r", 2.6);
          circle.setAttribute("class", "chart-line-point");

          const title =
            document.createElementNS(svgNs, "title");

          title.textContent =
            `${point[2].year} · emisiones: ${formatCompact(point[2].emissions)} Mg CO₂e`;

          circle.appendChild(title);

          svgEl.appendChild(circle);

        });

      }

    }

    async function loadLossCharts() {

      const chartSvgs =
        document.querySelectorAll("svg[data-chart-src]");

      await Promise.all(

        Array.from(chartSvgs).map(async svgEl => {

          try {

            const response =
              await fetch(svgEl.dataset.chartSrc);

            if (!response.ok) {

              throw new Error(
                `HTTP ${response.status}`
              );

            }

            const rows =
              parseChartCsv(await response.text());

            renderLossChart(svgEl, rows);

          }

          catch (error) {

            console.error(
              "No se pudo cargar el gráfico:",
              svgEl.dataset.chartSrc,
              error
            );

            svgEl.insertAdjacentHTML(
              "afterend",
              '<p class="chart-error">No se pudo cargar el gráfico.</p>'
            );

          }

        })

      );

    }


    /* ============================================================
       INICIALIZACIÓN
       ============================================================ */

    document.addEventListener(
      "DOMContentLoaded",
      () => {

        /*
          Imagen inicial.
        */

        changeStoryImage(1);

        flagStoppedStep();

        /*
          Regiones vivas: métricas y mapa anuncian sus valores.
        */

        const statConcentration =
          document.getElementById("statConcentration");

        if (statConcentration) {

          statConcentration.setAttribute("aria-live", "polite");

        }

        if (departmentCaption) {

          departmentCaption.setAttribute("aria-live", "polite");

        }

        /*
          Activamos el primer step.
        */

        const firstStep =
          document.querySelector(
            '.step[data-step="1"]'
          );

        if (firstStep) {

          firstStep.classList.add(
            "is-active"
          );

        }

        /*
          Scrollytelling.
        */

        setupScroller();

        /*
          JSON.
        */

        loadData();

        /*
          Gráficos de pérdida y emisiones.
        */

        loadLossCharts();

      }
    );
