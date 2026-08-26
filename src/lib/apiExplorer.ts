export function renderApiExplorerHtml({
  title,
  endpoint,
  data,
}: {
  title: string;
  endpoint: string;
  data: any;
}) {
  const jsonPretty = JSON.stringify(data, null, 2);

  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} | API Visual Explorer Skye Digital Yearbook</title>
  <link rel="icon" href="/logo/Default.jpg" type="image/jpeg">
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; background-color: #F4F4F5; }
  </style>
</head>
<body class="text-gray-800 min-h-screen flex flex-col justify-between">

  <!-- HEADER NAVBAR -->
  <header className="sticky top-0 z-40 bg-[#9E9898] text-white shadow-md border-b border-[#888282] p-4">
    <div class="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
      <div class="flex items-center space-x-3">
        <img src="/logo/Default.jpg" alt="Skye Logo" class="h-9 w-9 rounded-xl object-cover border border-white shadow-sm" />
        <div>
          <span class="text-[10px] font-black uppercase tracking-widest bg-[#27272A] text-white px-2 py-0.5 rounded">
            REST API Dashboard
          </span>
          <h1 class="text-lg font-black text-white leading-tight mt-0.5">Skye Digital Yearbook API</h1>
        </div>
      </div>

      <!-- ENDPOINT TABS -->
      <nav class="flex items-center space-x-1.5 bg-white/20 p-1.5 rounded-2xl border border-white/30 text-xs font-bold">
        <a href="/api/classes" class="px-3 py-1.5 rounded-xl transition-all ${endpoint === '/api/classes' ? 'bg-white text-[#27272A] shadow-sm font-black' : 'text-white hover:bg-white/20'}">/api/classes</a>
        <a href="/api/students" class="px-3 py-1.5 rounded-xl transition-all ${endpoint === '/api/students' ? 'bg-white text-[#27272A] shadow-sm font-black' : 'text-white hover:bg-white/20'}">/api/students</a>
        <a href="/api/photos" class="px-3 py-1.5 rounded-xl transition-all ${endpoint === '/api/photos' ? 'bg-white text-[#27272A] shadow-sm font-black' : 'text-white hover:bg-white/20'}">/api/photos</a>
        <a href="/api/academic-years" class="px-3 py-1.5 rounded-xl transition-all ${endpoint === '/api/academic-years' ? 'bg-white text-[#27272A] shadow-sm font-black' : 'text-white hover:bg-white/20'}">/api/academic-years</a>
      </nav>
    </div>
  </header>

  <!-- MAIN CONTAINER -->
  <main class="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 flex-1">

    <!-- BANNER CONTROL -->
    <div class="bg-white p-6 rounded-3xl border border-gray-300 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <div>
        <span class="text-[10px] font-black text-[#9E9898] uppercase tracking-wider block">Endpoint Path: ${endpoint}</span>
        <h2 class="text-2xl font-black text-[#27272A] mt-0.5">${title}</h2>
        <p class="text-xs text-gray-500 font-semibold mt-1">Total Data: <strong>${Array.isArray(data) ? data.length : 1} Record</strong></p>
      </div>

      <!-- VIEW TOGGLE BUTTON (VISUAL UI vs RAW JSON) -->
      <div class="flex items-center space-x-2 bg-gray-100 p-1.5 rounded-2xl border border-gray-300">
        <button id="btnVisual" onclick="showVisual()" class="px-4 py-2 bg-[#9E9898] text-white text-xs font-black rounded-xl shadow-sm transition-all">Visual Cards UI</button>
        <button id="btnJson" onclick="showJson()" class="px-4 py-2 text-gray-700 text-xs font-bold rounded-xl hover:bg-gray-200 transition-all">Raw JSON</button>
      </div>
    </div>

    <!-- VISUAL UI CARDS -->
    <div id="visualContainer" class="space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        ${
          Array.isArray(data)
            ? data.map((item, idx) => `
                <div class="bg-white border border-gray-300 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow space-y-3">
                  <div class="flex items-center justify-between border-b border-gray-200 pb-2">
                    <span class="text-[10px] font-black uppercase text-white bg-[#9E9898] px-2.5 py-0.5 rounded-md">#${idx + 1}</span>
                    <span class="text-[10px] font-mono text-gray-400 font-bold">ID: ${item.id || 'N/A'}</span>
                  </div>
                  
                  <div class="space-y-2 text-xs">
                    ${Object.entries(item)
                      .map(([key, val]) => {
                        if (typeof val === 'object' && val !== null) return '';
                        if (key === 'url' || key === 'coverImage' || key === 'classLogo' || key === 'avatar') {
                          return `
                            <div>
                              <span class="font-black text-gray-500 block uppercase text-[10px]">${key}:</span>
                              <img src="${val}" alt="${key}" class="w-full h-32 object-cover rounded-xl mt-1 border border-gray-200" />
                            </div>
                          `;
                        }
                        return `
                          <div class="flex justify-between border-b border-gray-100 py-1">
                            <span class="font-black text-gray-500 uppercase text-[10px]">${key}:</span>
                            <span class="font-bold text-[#27272A] truncate max-w-[200px]" title="${val}">${val}</span>
                          </div>
                        `;
                      })
                      .join('')}
                  </div>
                </div>
              `).join('')
            : `<pre class="bg-white p-6 rounded-3xl border border-gray-300 text-xs font-mono overflow-x-auto">${jsonPretty}</pre>`
        }
      </div>
    </div>

    <!-- RAW JSON VIEW (HIDDEN BY DEFAULT) -->
    <div id="jsonContainer" class="hidden">
      <div class="bg-[#27272A] text-emerald-400 p-6 rounded-3xl border border-gray-700 shadow-xl overflow-x-auto">
        <div class="flex justify-between items-center border-b border-gray-700 pb-3 mb-4 text-xs font-mono text-gray-300">
          <span>Format: application/json</span>
          <button onclick="navigator.clipboard.writeText(\`${jsonPretty.replace(/`/g, '\\`')}\`)" class="bg-[#9E9898] text-white px-3 py-1 rounded-lg hover:bg-[#888282] font-bold">Salin JSON</button>
        </div>
        <pre class="font-mono text-xs leading-relaxed">${jsonPretty}</pre>
      </div>
    </div>

  </main>

  <footer class="border-t border-gray-300 py-4 bg-[#9E9898] text-center text-xs text-white font-semibold">
    Skye Digital Yearbook Platform REST API Explorer
  </footer>

  <script>
    function showVisual() {
      document.getElementById('visualContainer').classList.remove('hidden');
      document.getElementById('jsonContainer').classList.add('hidden');
      document.getElementById('btnVisual').className = 'px-4 py-2 bg-[#9E9898] text-white text-xs font-black rounded-xl shadow-sm transition-all';
      document.getElementById('btnJson').className = 'px-4 py-2 text-gray-700 text-xs font-bold rounded-xl hover:bg-gray-200 transition-all';
    }

    function showJson() {
      document.getElementById('visualContainer').classList.add('hidden');
      document.getElementById('jsonContainer').classList.remove('hidden');
      document.getElementById('btnJson').className = 'px-4 py-2 bg-[#9E9898] text-white text-xs font-black rounded-xl shadow-sm transition-all';
      document.getElementById('btnVisual').className = 'px-4 py-2 text-gray-700 text-xs font-bold rounded-xl hover:bg-gray-200 transition-all';
    }
  </script>
</body>
</html>`;
}
