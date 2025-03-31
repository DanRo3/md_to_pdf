// src/App.tsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { FiSun, FiMoon, FiUpload, FiDownload, FiTrash2 } from "react-icons/fi";

function App() {
  const [markdown, setMarkdown] = useState<string>(
    "# ¡Hola, Tailwind v4!\n\nRenderiza esto con `prose`.\n\n- Item 1\n- Item 2\n\n```css\nbody { font-family: sans-serif; }\n```"
  );
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    if (savedTheme) return savedTheme;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });
  const previewRef = useRef<HTMLDivElement>(null); // Ref para el DIV que contiene el <article>

  // Efecto para aplicar clase dark y guardar tema (sin cambios)
  useEffect(() => {
    const root = document.documentElement;
    console.log("APP: Aplicando tema:", theme); // Log tema
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    try {
      localStorage.setItem("theme", theme);
    } catch (error) {
      console.warn("APP: No se pudo guardar el tema en localStorage:", error);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && (file.type === "text/markdown" || file.name.endsWith(".md"))) {
      const reader = new FileReader();
      reader.onload = (e) => setMarkdown(e.target?.result as string);
      reader.onerror = (e) => {
        console.error("Error leyendo archivo:", e);
        alert("Error al leer.");
      };
      reader.readAsText(file);
    } else if (file) {
      alert("Selecciona un archivo .md");
    }
    event.target.value = "";
  };

  const handleConvertAndDownload = useCallback(() => {
    const previewElement = previewRef.current?.querySelector(".prose"); // **Selecciona el <article> con prose**
    if (!previewElement) {
      console.error(
        "Elemento <article class='prose'> no encontrado dentro del ref de previsualización."
      );
      alert(
        "Error: No se encontró el contenido de previsualización para generar el PDF."
      );
      return;
    }

    console.log("Iniciando generación de PDF desde:", previewElement);
    const backgroundColor = theme === "dark" ? "#1f2937" : "#ffffff"; // Colores simples

    html2canvas(previewElement as HTMLElement, {
      // Aseguramos que es HTMLElement
      scale: 2,
      useCORS: true,
      logging: true,
      backgroundColor: backgroundColor,
    })
      .then((canvas) => {
        console.log("Canvas creado.");
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF({
          orientation: canvas.width > canvas.height ? "l" : "p",
          unit: "px",
          format: [canvas.width, canvas.height],
          hotfixes: ["px_scaling"],
        });
        pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
        pdf.save("markdown-export.pdf");
        console.log("PDF guardado.");
      })
      .catch((error) => {
        console.error("Error generando PDF con html2canvas:", error);
        alert(`Error al generar el PDF: ${error.message}. Revisa la consola.`);
        if (error.message?.includes("oklch")) {
          console.warn(
            "El error 'oklch' sugiere incompatibilidad de html2canvas con funciones de color CSS modernas."
          );
        }
      });
  }, [theme]);

  const handleClearEditor = () => setMarkdown("");

  // --- Estilos Botones (sin cambios en clases, Tailwind v4 debería entenderlas) ---
  const baseButtonClass =
    "flex items-center justify-center gap-2 font-semibold py-2 px-4 rounded-lg transition-all duration-200 ease-in-out shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900 disabled:opacity-50";
  const primaryButtonClass = `${baseButtonClass} bg-indigo-600 hover:bg-indigo-700 text-white focus-visible:ring-indigo-500`;
  const successButtonClass = `${baseButtonClass} bg-green-600 hover:bg-green-700 text-white focus-visible:ring-green-500`;
  const secondaryButtonClass = `${baseButtonClass} bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-100 focus-visible:ring-gray-500`;
  const dangerButtonClass = `${baseButtonClass} bg-red-600 hover:bg-red-700 text-white focus-visible:ring-red-500`;

  console.log(
    "APP: Renderizando con Markdown:",
    markdown.substring(0, 50) + "..."
  ); // Log Markdown

  return (
    <div
      className={`flex flex-col md:flex-row h-screen font-sans text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-900`}
    >
      {/* Panel Izquierdo */}
      <div className="w-full md:w-1/2 p-4 flex flex-col border-r border-gray-300 dark:border-gray-700">
        <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-300 dark:border-gray-700">
          <h1 className="text-2xl font-bold text-indigo-700 dark:text-indigo-400">
            Editor MD (v4)
          </h1>
          <button
            onClick={toggleTheme}
            className={`${secondaryButtonClass} px-3`}
            aria-label="Cambiar tema"
          >
            {theme === "light" ? <FiMoon size={20} /> : <FiSun size={20} />}
          </button>
        </div>
        <textarea
          className="flex-grow border border-gray-300 dark:border-gray-600 rounded-md p-4 text-base font-mono leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 bg-white dark:bg-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 mb-4 shadow-inner"
          value={markdown}
          onChange={(e) => setMarkdown(e.target.value)}
          placeholder="Escribe tu Markdown aquí..."
          spellCheck="false"
          aria-label="Editor de Markdown"
        />
        <div className="flex flex-wrap gap-3">
          <label className={`${primaryButtonClass} cursor-pointer`}>
            <FiUpload /> <span>Cargar .md</span>
            <input
              type="file"
              accept=".md,text/markdown"
              className="hidden"
              onChange={handleFileUpload}
            />
          </label>
          <button
            onClick={handleConvertAndDownload}
            className={successButtonClass}
            disabled={!markdown.trim()}
          >
            <FiDownload /> Descargar PDF
          </button>
          <button
            onClick={handleClearEditor}
            className={dangerButtonClass}
            disabled={!markdown.trim()}
          >
            <FiTrash2 /> Limpiar
          </button>
        </div>
      </div>

      {/* Panel Derecho: Previsualización */}
      <div className="w-full md:w-1/2 p-4 flex flex-col bg-white dark:bg-gray-800 overflow-hidden">
        <h2 className="text-xl font-semibold mb-4 pb-3 border-b border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 flex-shrink-0">
          Previsualización
        </h2>
        {/* Contenedor scrollable */}
        <div
          ref={previewRef} // La ref va en el contenedor exterior scrollable
          className="flex-grow overflow-y-auto rounded bg-gray-50 dark:bg-gray-800 p-1" // Fondo base del contenedor
        >
          {/* **Artículo con prose es el que se estiliza y se captura para el PDF** */}
          <article
            className="prose prose-indigo dark:prose-invert max-w-none p-4"
            // style={{ backgroundColor: theme === 'dark' ? '#1f2937' : '#f9fafb' }} // ¿Necesario? Prose ya debería manejar el fondo
          >
            {/* Comprobación simple para ver si ReactMarkdown existe */}
            {typeof ReactMarkdown === "function" ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {markdown ||
                  "*Empieza a escribir o carga un archivo .md para ver la previsualización.*"}
              </ReactMarkdown>
            ) : (
              <p className="text-red-500">
                Error: ReactMarkdown no parece estar cargado.
              </p>
            )}
          </article>
        </div>
      </div>
    </div>
  );
}

export default App;
