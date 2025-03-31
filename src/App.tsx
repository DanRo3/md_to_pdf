// src/App.tsx
import React, { useState } from "react";

function App() {
  const [markdown, setMarkdown] = useState<string>("# Hola, Markdown!"); // Estado para el texto MD

  // Funciones placeholder (las implementaremos después)
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("Archivo cargado:", event.target.files);
    // Lógica para leer el archivo .md
  };

  const handleConvertAndDownload = () => {
    console.log("Convirtiendo y descargando PDF...");
    // Lógica para convertir 'markdown' a PDF y descargarlo
  };

  const handleClearEditor = () => {
    setMarkdown("");
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100 font-sans">
      {/* Panel Izquierdo: Editor y Controles */}
      <div className="w-full md:w-1/2 p-4 flex flex-col">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">
          Editor Markdown
        </h1>

        {/* Área de Texto */}
        <textarea
          className="flex-grow border border-gray-300 rounded-md p-3 text-base leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={markdown}
          onChange={(e) => setMarkdown(e.target.value)}
          placeholder="Escribe tu Markdown aquí..."
          spellCheck="false" // Útil para editores de código/markdown
        />

        {/* Botones de Acción */}
        <div className="mt-4 flex flex-wrap gap-2">
          <label className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded cursor-pointer transition duration-150 ease-in-out">
            <span>Cargar Archivo (.md)</span>
            <input
              type="file"
              accept=".md"
              className="hidden" // Ocultamos el input feo
              onChange={handleFileUpload}
            />
          </label>
          <button
            onClick={handleConvertAndDownload}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out"
          >
            Convertir y Descargar PDF
          </button>
          <button
            onClick={handleClearEditor}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out"
          >
            Limpiar Editor
          </button>
        </div>
      </div>

      {/* Panel Derecho: Previsualización (A implementar) */}
      <div className="w-full md:w-1/2 p-4 border-l border-gray-300 bg-white overflow-auto">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          Previsualización
        </h2>
        <div className="prose lg:prose-xl max-w-none">
          {/* Aquí irá la previsualización renderizada del Markdown */}
          <p className="text-gray-500">(La previsualización aparecerá aquí)</p>
        </div>
      </div>
    </div>
  );
}

export default App;
