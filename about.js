const API = 'http://pvk7mklteh7fkzwrmfcpa95p.31.97.28.81.sslip.io/github';

fetch(API)
    .then(r => r.json())
    .then(d => document.getElementById('count').textContent = d.length)
    .catch(() => {});
