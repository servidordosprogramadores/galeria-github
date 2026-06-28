const API = '/api/github';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function fmtDate(str) {
    const d = new Date(str);
    return `${MONTHS[d.getUTCMonth()]}, ${d.getUTCFullYear()}`;
}

function fmtNum(n) {
    if (n >= 1000) return (n / 1000).toFixed(1).replace('.0', '') + 'k';
    return n;
}

function safeUrl(blog) {
    if (!blog) return null;
    return blog.startsWith('http') ? blog : 'https://' + blog;
}

const ICON_COMPANY = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="11" height="11" fill="currentColor"><path d="M1.5 14.25c0 .138.112.25.25.25H4v-1.25a.75.75 0 0 1 .75-.75h2.5a.75.75 0 0 1 .75.75v1.25h2.25a.25.25 0 0 0 .25-.25V1.75a.25.25 0 0 0-.25-.25h-8.5a.25.25 0 0 0-.25.25ZM1.75 0h8.5C11.216 0 12 .784 12 1.75v12.5A1.75 1.75 0 0 1 10.25 16h-8.5A1.75 1.75 0 0 1 0 14.25V1.75C0 .784.784 0 1.75 0ZM3.5 6.25a.75.75 0 0 1 .75-.75h1a.75.75 0 0 1 0 1.5h-1a.75.75 0 0 1-.75-.75ZM4.25 3.5h1a.75.75 0 0 1 0 1.5h-1a.75.75 0 0 1 0-1.5ZM3.5 9.25a.75.75 0 0 1 .75-.75h1a.75.75 0 0 1 0 1.5h-1a.75.75 0 0 1-.75-.75ZM7.25 3.5h1a.75.75 0 0 1 0 1.5h-1a.75.75 0 0 1 0-1.5ZM6.5 6.25a.75.75 0 0 1 .75-.75h1a.75.75 0 0 1 0 1.5h-1a.75.75 0 0 1-.75-.75ZM7.25 9h1a.75.75 0 0 1 0 1.5h-1a.75.75 0 0 1 0-1.5Z"/></svg>`;

const ICON_BLOG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="11" height="11" fill="currentColor"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 2 2 0 0 0 2.83 0l2.5-2.5a2 2 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a2 2 0 0 1 0-2.83l2.5-2.5a2 2 0 0 1 2.83 0 .751.751 0 0 0 1.042-.018.751.751 0 0 0 .018-1.042 3.5 3.5 0 0 0-4.95 0l-2.5 2.5a3.5 3.5 0 0 0 4.95 4.95l1.25-1.25a.751.751 0 0 0-.018-1.042.751.751 0 0 0-1.042-.018l-1.25 1.25a2 2 0 0 1-2.83 0Z"/></svg>`;

function card(u) {
    const avatar = `https://github.com/${u.githubUsername}.png?size=100`;
    const company = `
        <div class="meta-row">
            <span class="meta-icon">${ICON_COMPANY}</span>
            <span class="meta-val ${u.company ? '' : 'empty'}"${u.company ? ` data-company="${u.company.replace(/"/g, '&quot;')}"` : ''}>${u.company || 'vazio'}</span>
        </div>`;
    const blog = `
        <div class="meta-row">
            <span class="meta-icon">${ICON_BLOG}</span>
            <span class="meta-val ${u.blog ? '' : 'empty'}">${u.blog ? `<a href="${safeUrl(u.blog)}" target="_blank" rel="noopener noreferrer">${u.blog}</a>` : 'vazio'}</span>
        </div>`;
    const hasMeta = true;

    return `<div class="card">
        <div class="dots">
            <div class="dot dot-r"></div>
            <div class="dot dot-y"></div>
            <div class="dot dot-g"></div>
            <span class="card-handle">${u.githubUsername}</span>
        </div>

        <div class="profile">
            <img class="avatar" src="${avatar}" alt="${u.name || u.githubUsername}" loading="lazy"
                 onerror="this.src='https://github.com/ghost.png'">
            <div class="profile-text">
                <div class="name">${u.name || u.githubUsername}</div>
                <a class="username" href="${u.profileUrl}" target="_blank" rel="noopener noreferrer">@${u.githubUsername}</a>
                <div class="bio"${u.bio ? ` data-bio="${u.bio.replace(/"/g, '&quot;')}"` : ' style="visibility:hidden"'}>${u.bio || '.'}</div>
            </div>
        </div>

        ${hasMeta ? `<div class="meta">${company}${blog}</div>` : ''}

        <hr>

        <div class="stats">
            <div class="stat">
                <span class="stat-n">${fmtNum(u.publicRepos)}</span>
                <span class="stat-l">repos</span>
            </div>
            <div class="stat">
                <span class="stat-n">${fmtNum(u.followers)}</span>
                <span class="stat-l">seguidores</span>
            </div>
            <div class="stat">
                <span class="stat-n">${fmtNum(u.following)}</span>
                <span class="stat-l">seguindo</span>
            </div>
        </div>

        <div class="card-footer">
            <span class="desde">desde <b>${fmtDate(u.githubCreatedAt)}</b></span>
        </div>

        <div class="discord-row">
            <img class="discord-avatar" src="${u.discordAvatar}" alt="${u.discordUsername}" loading="lazy" onerror="this.src='https://cdn.discordapp.com/embed/avatars/0.png'">
            <a class="discord-name" href="https://discord.com/users/${u.discordId}" target="_blank" rel="noopener noreferrer">@${u.discordUsername}</a>
        </div>
    </div>`;
}

let users = [];

const SORTERS = {
    followers: (a, b) => b.followers - a.followers,
    repos: (a, b) => b.publicRepos - a.publicRepos,
    name: (a, b) => (a.name || a.githubUsername).localeCompare(b.name || b.githubUsername),
    desde: (a, b) => new Date(a.githubCreatedAt) - new Date(b.githubCreatedAt),
};

function render() {
    const q = document.getElementById('search').value.trim().toLowerCase();
    const sort = document.getElementById('sort').value;
    const gallery = document.getElementById('gallery');

    let list = users.filter(u =>
        !q ||
        (u.name || '').toLowerCase().includes(q) ||
        u.githubUsername.toLowerCase().includes(q) ||
        (u.bio || '').toLowerCase().includes(q) ||
        (u.company || '').toLowerCase().includes(q)
    );

    list = [...list].sort(SORTERS[sort]);

    if (list.length === 0) {
        gallery.innerHTML = '<div class="state state-empty">nenhum resultado encontrado</div>';
        return;
    }

    gallery.innerHTML = list.map(card).join('');

    gallery.querySelectorAll('.bio[data-bio]').forEach(el => {
        if (el.scrollWidth > el.clientWidth)
            el.dataset.tooltip = el.dataset.bio;
    });

    gallery.querySelectorAll('.meta-val[data-company]').forEach(el => {
        if (el.scrollWidth > el.clientWidth)
            el.dataset.tooltip = el.dataset.company;
    });
}

document.getElementById('search').addEventListener('input', render);

const sortEl    = document.getElementById('sort');
const sortArrow = document.querySelector('.select-arrow');
let selectOpen  = false;

sortEl.addEventListener('mousedown', () => {
    selectOpen = !selectOpen;
    sortArrow.textContent = selectOpen ? '▴' : '▾';
});
sortEl.addEventListener('blur',   () => { selectOpen = false; sortArrow.textContent = '▾'; });
sortEl.addEventListener('change', () => { selectOpen = false; sortArrow.textContent = '▾'; render(); });

async function init() {
    try {
        const res = await fetch(API);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        users = await res.json();
        document.getElementById('count').textContent = users.length;
        render();
    } catch (err) {
        document.getElementById('gallery').innerHTML =
            `<div class="state state-error">// erro ao carregar: ${err.message}</div>`;
    }
}

init();

// tooltip
const tooltip = document.createElement('div');
tooltip.id = 'tooltip';
document.body.appendChild(tooltip);

document.addEventListener('mouseover', e => {
    const el = e.target.closest('[data-tooltip]');
    if (!el) return;
    tooltip.textContent = el.dataset.tooltip;
    tooltip.style.display = 'block';
});

document.addEventListener('mousemove', e => {
    tooltip.style.left = (e.clientX + 12) + 'px';
    tooltip.style.top  = (e.clientY + 12) + 'px';
});

document.addEventListener('mouseout', e => {
    if (!e.target.closest('[data-tooltip]')) return;
    tooltip.style.display = 'none';
});
