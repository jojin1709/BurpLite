// Interactive Playground Tab Switcher
document.querySelectorAll('.play-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.play-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        const target = tab.dataset.playTab;
        document.querySelectorAll('.play-panel').forEach(p => p.classList.add('hidden'));
        document.getElementById(`play-${target}`).classList.remove('hidden');
    });
});

// Mini Decoder Playground Algorithms
const demoInput = document.getElementById('demo-input');
const demoAlgo = document.getElementById('demo-algo');
const demoOutput = document.getElementById('demo-output');

function runDecoder() {
    const text = demoInput.value;
    const algo = demoAlgo.value;
    
    if (!text) {
        demoOutput.value = '';
        return;
    }
    
    try {
        if (algo === 'base64-encode') {
            demoOutput.value = btoa(unescape(encodeURIComponent(text)));
        } else if (algo === 'base64-decode') {
            demoOutput.value = decodeURIComponent(escape(atob(text)));
        } else if (algo === 'rot13') {
            demoOutput.value = text.replace(/[a-zA-Z]/g, function (c) {
                return String.fromCharCode((c <= 'Z' ? 90 : 122) >= (c = c.charCodeAt(0) + 13) ? c : c - 26);
            });
        } else if (algo === 'url-encode') {
            demoOutput.value = encodeURIComponent(text);
        } else if (algo === 'url-decode') {
            demoOutput.value = decodeURIComponent(text);
        } else if (algo === 'hex-encode') {
            let hex = '';
            for (let i = 0; i < text.length; i++) {
                hex += text.charCodeAt(i).toString(16).padStart(2, '0');
            }
            demoOutput.value = hex;
        } else if (algo === 'hex-decode') {
            let str = '';
            for (let i = 0; i < text.length; i += 2) {
                str += String.fromCharCode(parseInt(text.substr(i, 2), 16));
            }
            demoOutput.value = str;
        }
    } catch (e) {
        demoOutput.value = `Error: Invalid input format for ${algo.replace('-', ' ')}`;
    }
}

demoInput.addEventListener('input', runDecoder);
demoAlgo.addEventListener('change', runDecoder);

// Initialize with some default text
demoInput.value = 'BurpLite by Jojin John';
runDecoder();

// Mini cURL Parser Playground
const curlInput = document.getElementById('demo-curl-input');
const parseBtn = document.getElementById('demo-parse-btn');
const parsedResults = document.getElementById('demo-parsed-results');

parseBtn.addEventListener('click', () => {
    const curl = curlInput.value.replace(/\\\r?\n/g, ' ').trim();
    if (!curl) {
        parsedResults.innerHTML = '<span class="placeholder-text">Please paste a cURL command.</span>';
        return;
    }
    
    let url = 'Not Found';
    const urlMatch = curl.match(/(?:curl|fetch)\s+(?:-X\s+[A-Z]+\s+)?['"]?(https?:\/\/[^\s'"]+)['"]?/i);
    if (urlMatch) {
        url = urlMatch[1];
    } else {
        const fallbackUrl = curl.match(/['"]?(https?:\/\/[^\s'"]+)['"]?/i);
        if (fallbackUrl) url = fallbackUrl[1];
    }
    
    let method = 'GET';
    const methodMatch = curl.match(/-X\s+['"]?([A-Z]+)['"]?/i);
    if (methodMatch) {
        method = methodMatch[1];
    } else if (curl.includes('--data') || curl.includes('-d ') || curl.includes('--data-raw')) {
        method = 'POST';
    }
    
    const headers = [];
    const headerRegex = /-H\s+['"]?([^'"]+)['"]?/gi;
    let headerMatch;
    while ((headerMatch = headerRegex.exec(curl)) !== null) {
        const header = headerMatch[1];
        const colonIdx = header.indexOf(':');
        if (colonIdx > 0) {
            headers.push({
                name: header.slice(0, colonIdx).trim(),
                value: header.slice(colonIdx + 1).trim()
            });
        }
    }
    
    let body = '';
    const bodyMatch = curl.match(/(?:-d|--data|--data-raw|--data-binary)\s+['"]?([\s\S]*?)['"]?(?=\s+-[A-Z]|$)/i);
    if (bodyMatch) {
        body = bodyMatch[1];
        if (body.startsWith("'") && body.endsWith("'")) body = body.slice(1, -1);
        if (body.startsWith('"') && body.endsWith('"')) body = body.slice(1, -1);
    }
    
    // Render Results HTML
    let html = `
        <div class="parsed-item"><span class="parsed-key">Method:</span> <span class="parsed-value">${method}</span></div>
        <div class="parsed-item"><span class="parsed-key">URL:</span> <span class="parsed-value">${url}</span></div>
    `;
    
    if (headers.length > 0) {
        html += `<div class="parsed-item"><span class="parsed-key">Headers:</span></div>`;
        headers.forEach(h => {
            html += `<div style="margin-left: 20px; font-size: 0.8rem;"><span class="parsed-key">${h.name}:</span> <span class="parsed-value">${h.value}</span></div>`;
        });
    }
    
    if (body) {
        html += `<div class="parsed-item"><span class="parsed-key">Body Data:</span> <span class="parsed-value">${body}</span></div>`;
    }
    
    parsedResults.innerHTML = html;
});

// Lightbox Modal functions
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCaption = document.getElementById('lightbox-caption');

window.openLightbox = function(src, caption) {
    lightbox.style.display = 'flex';
    lightboxImg.src = src;
    lightboxCaption.textContent = caption;
}

window.closeLightbox = function() {
    lightbox.style.display = 'none';
}

// Close lightbox on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
});
