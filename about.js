const API = '/api/github';

fetch(API)
    .then(r => r.json())
    .then(d => document.getElementById('count').textContent = d.length)
    .catch(() => {});
