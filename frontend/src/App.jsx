import React from 'react';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-blue-600 mb-2">ElimuPath</h1>
        <p className="text-lg text-gray-700">Find your eligible Kenyan university courses based on your KCSE results.</p>
      </header>
      
      <main className="w-full max-w-2xl bg-white rounded-lg shadow-md p-6">
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Project Initialized</h2>
          <p className="text-gray-600 mb-6">The core project structure is ready. Next steps include implementing OCR and course matching logic.</p>
          <div className="flex justify-center gap-4">
            <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">React (Vite)</span>
            <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium">Tailwind CSS</span>
            <span className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">Express API</span>
          </div>
        </div>
      </main>

      <footer className="mt-8 text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} ElimuPath - Helping Students Shape Their Futures
      </footer>
    </div>
  );
}

export default App;
