// (function () {
//     const errorLogs = [];
//     let sessionId = Date.now() + '-' + Math.random().toString(36).substr(2, 9);

//     function getFormattedDate() {
//         return new Date().toLocaleString('en-ZA', {
//             timeZone: 'Africa/Johannesburg',
//             dateStyle: 'medium',
//             timeStyle: 'long'
//         });
//     }

//     function logError(type, message, details = {}) {
//         const entry = `[${getFormattedDate()}] [${type.toUpperCase()}] ${message}\n`;
//         const detailLines = Object.entries(details)
//             .map(([key, value]) => `  ${key}: ${String(value)}`)
//             .join('\n');
//         const fullEntry = detailLines ? `${entry}${detailLines}\n---\n` : `${entry}---\n`;
        
//         errorLogs.push(fullEntry);
//         console.error(`[${type.toUpperCase()}]`, message, details);
//     }

//     function downloadLog() {
//         if (!errorLogs.length) {
//             alert('No errors captured in this session.');
//             return;
//         }
//         const header = `=== ERROR LOG SESSION: ${sessionId} ===\n\n`;
//         const content = header + errorLogs.join('');
//         const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
//         const url = URL.createObjectURL(blob);
//         const a = document.createElement('a');
//         a.href = url;
//         a.download = `errorLog-${sessionId}.txt`;
//         a.click();
//         URL.revokeObjectURL(url);
//     }

//     window.onerror = (msg, url, line, col, error) => {
//         logError('JS_ERROR', msg, {
//             url: url || window.location.href,
//             line: line || 'N/A',
//             column: col || 'N/A',
//             stack: error?.stack || 'No stack trace'
//         });
//     };

//     window.addEventListener('unhandledrejection', e => {
//         logError('PROMISE_ERROR', e.reason?.message || 'Unhandled promise rejection', {
//             reason: e.reason,
//             stack: e.reason?.stack
//         });
//     });

//     const originalFetch = window.fetch;
//     window.fetch = function(...args) {
//         return originalFetch.apply(this, args).catch(err => {
//             logError('NETWORK_ERROR', `Fetch failed: ${err.message}`, {
//                 url: args[0],
//                 status: 'Failed',
//                 method: 'FETCH'
//             });
//             throw err;
//         });
//     };

//     const originalXHROpen = XMLHttpRequest.prototype.open;
//     XMLHttpRequest.prototype.open = function(method, url, ...args) {
//         this.addEventListener('error', () => {
//             logError('NETWORK_ERROR', `XHR failed`, {
//                 url,
//                 method,
//                 status: this.status,
//                 statusText: this.statusText
//             });
//         });
//         this.addEventListener('abort', () => {
//             logError('NETWORK_ERROR', `XHR aborted`, { url, method });
//         });
//         return originalXHROpen.apply(this, [method, url, ...args]);
//     };

//     const originalXHRSend = XMLHttpRequest.prototype.send;
//     XMLHttpRequest.prototype.send = function(...args) {
//         this.addEventListener('loadend', () => {
//             if (this.status >= 400) {
//                 logError('HTTP_ERROR', `${this.status} ${this.statusText}`, {
//                     url: this.responseURL,
//                     method: this._method || 'GET',
//                     response: this.responseText?.substring(0, 500)
//                 });
//             }
//         });
//         return originalXHRSend.apply(this, args);
//     };

//     window.addEventListener('error', e => {
//         if (e.target.tagName === 'IMG' || e.target.tagName === 'SCRIPT' || 
//             e.target.tagName === 'LINK' || e.target.tagName === 'VIDEO') {
//             logError('RESOURCE_ERROR', `${e.target.tagName} failed to load`, {
//                 src: e.target.src || e.target.href,
//                 tagName: e.target.tagName
//             });
//         }
//     }, true);

//     const observer = new PerformanceObserver(list => {
//         list.getEntries().forEach(entry => {
//             if (entry.name.includes('.css') && entry.duration > 5000) {
//                 logError('CSS_ERROR', 'CSS file took too long to load', {
//                     url: entry.name,
//                     duration: `${entry.duration}ms`
//                 });
//             }
//         });
//     });
//     observer.observe({ entryTypes: ['resource'] });

//     const originalConsoleError = console.error;
//     console.error = function(...args) {
//         logError('CONSOLE_ERROR', args.join(' '), { args });
//         return originalConsoleError.apply(this, args);
//     };

//     window.addEventListener('securitypolicyviolation', e => {
//         logError('SECURITY_ERROR', 'CSP Violation', {
//             directive: e.violatedDirective,
//             blockedURI: e.blockedURI,
//             originalPolicy: e.originalPolicy
//         });
//     });

//     if (window.performance.memory) {
//         setInterval(() => {
//             const memory = window.performance.memory;
//             if (memory.usedJSHeapSize > memory.jsHeapSizeLimit * 0.9) {
//                 logError('MEMORY_WARNING', 'High memory usage detected', {
//                     used: Math.round(memory.usedJSHeapSize / 1024 / 1024) + 'MB',
//                     limit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024) + 'MB'
//                 });
//             }
//         }, 30000);
//     }

//     window.addEventListener('online', () => logError('NETWORK_STATUS', 'Connection restored'));
//     window.addEventListener('offline', () => logError('NETWORK_ERROR', 'WENT OFFLINE'));

//     document.addEventListener('visibilitychange', () => {
//         if (document.hidden) {
//             logError('PAGE_EVENT', 'Page hidden');
//         }
//     });

//     document.addEventListener('submit', e => {
//         setTimeout(() => {
//             if (e.target.checkValidity && !e.target.checkValidity()) {
//                 logError('FORM_ERROR', 'Form validation failed', {
//                     form: e.target.id || e.target.className,
//                     validity: e.target.validity
//                 });
//             }
//         }, 100);
//     }, true);

//     const originalApiRequest = window.apiRequest;
//     window.apiRequest = async function(endpoint, method, data) {
//         try {
//             const response = await originalApiRequest(endpoint, method, data);
//             if (!response.ok) {
//                 logError('API_ERROR', `API returned error: ${response.status}`, {
//                     endpoint,
//                     method,
//                     status: response.status,
//                     statusText: response.statusText
//                 });
//             }
//             return response;
//         } catch (err) {
//             logError('API_ERROR', `API request failed: ${err.message}`, {
//                 endpoint,
//                 method,
//                 error: err.message
//             });
//             throw err;
//         }
//     };

//     const originalLocalStorageSet = localStorage.setItem;
//     localStorage.setItem = function(key, value) {
//         try {
//             return originalLocalStorageSet.call(this, key, value);
//         } catch (e) {
//             logError('STORAGE_ERROR', 'localStorage.setItem failed', {
//                 key,
//                 error: e.message
//             });
//         }
//     };

//     window.downloadErrorLog = downloadLog;
//     window.clearErrorLog = () => { errorLogs.length = 0; alert('Error log cleared'); };
//     window.getErrorCount = () => errorLogs.length;

//     let criticalErrors = 0;
//     const originalLogError = logError;
//     logError = (type, ...args) => {
//         if (['JS_ERROR', 'API_ERROR', 'NETWORK_ERROR'].includes(type)) criticalErrors++;
//         if (criticalErrors > 10) downloadLog();
//         originalLogError(type, ...args);
//     };

//     console.log('Error Catcher Active - Session:', sessionId);
// })();