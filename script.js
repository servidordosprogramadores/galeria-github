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

function card(u) {
    const avatar = `https://github.com/${u.githubUsername}.png?size=100`;
    const company = `
        <div class="meta-row">
            <span class="meta-icon">//</span>
            <span class="meta-val ${u.company ? '' : 'empty'}">${u.company || 'vazio'}</span>
        </div>`;
    const blog = `
        <div class="meta-row">
            <span class="meta-icon">//</span>
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
                <div class="username">@${u.githubUsername}</div>
                ${u.bio ? `<div class="bio">${u.bio}</div>` : ''}
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
            <a class="gh-link" href="${u.profileUrl}" target="_blank" rel="noopener noreferrer">github →</a>
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
