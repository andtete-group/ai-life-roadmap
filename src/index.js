const chapters = [
  "ChatGPT・Codex完全理解", "プロンプト完全攻略", "ChatGPT仕事術", "GPTs・AI秘書構築",
  "Codex完全攻略", "Codex仕事自動化", "AI×画像・SNS", "AI動画制作", "AIコンテンツ販売",
  "AIアプリ開発", "AI自動化・API連携", "AI会社設計・収益化", "実践ワーク"
];

export default {
  async fetch(request, env) {
    await initDb(env.DB);
    const url = new URL(request.url);
    const path = url.pathname;
    if (path === "/api/login" && request.method === "POST") return login(request, env, "member");
    if (path === "/api/admin/login" && request.method === "POST") return login(request, env, "admin");
    if (path === "/api/logout" && request.method === "POST") return logout();
    if (path === "/api/content" && request.method === "GET") return listContent(request, env);
    if (path === "/api/content" && request.method === "POST") return addContent(request, env);
    if (path === "/api/content" && request.method === "DELETE") return deleteContent(request, env);
    if (path.startsWith("/media/")) return media(request, env, path.slice(7));
    if (path === "/admin/login") return html(loginPage(true));
    if (path === "/login") return html(loginPage(false));
    if (path === "/admin") return await requireRole(request, env, "admin") ? html(adminPage()) : redirect("/admin/login");
    if (path === "/members" || path.startsWith("/members/chapter/")) return await requireAny(request, env) ? html(memberPage()) : redirect(`/login?returnTo=${encodeURIComponent(path)}`);
    return redirect("/login");
  }
};

async function initDb(db) {
  await db.prepare(`CREATE TABLE IF NOT EXISTS content (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    chapter_id INTEGER NOT NULL,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    body TEXT DEFAULT '',
    media_key TEXT,
    external_url TEXT,
    thumbnail_key TEXT,
    thumbnail_url TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )`).run();
}

async function login(request, env, role) {
  const data = await request.formData();
  const expectedUser = role === "admin" ? env.ADMIN_USERNAME : env.MEMBER_USERNAME;
  const expectedPass = role === "admin" ? env.ADMIN_PASSWORD : env.MEMBER_PASSWORD;
  if (!expectedPass || data.get("username") !== expectedUser || data.get("password") !== expectedPass) return json({ error: "invalid" }, 401);
  const token = await sign(`${role}:${Date.now() + 1000 * 60 * 60 * 24 * 7}`, env.SESSION_SECRET);
  return new Response(null, { status: 204, headers: { "Set-Cookie": `session=${token}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=604800` } });
}

function logout() { return new Response(null, { status: 204, headers: { "Set-Cookie": "session=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0" } }); }

async function requireAny(request, env) { return Boolean(await roleFromRequest(request, env)); }
async function requireRole(request, env, role) { return (await roleFromRequest(request, env)) === role; }
async function roleFromRequest(request, env) {
  const raw = (request.headers.get("cookie") || "").match(/(?:^|; )session=([^;]+)/)?.[1];
  if (!raw || !env.SESSION_SECRET) return null;
  const payload = await verify(raw, env.SESSION_SECRET);
  if (!payload) return null;
  const [role, expires] = payload.split(":");
  return Number(expires) > Date.now() ? role : null;
}

async function sign(payload, secret) {
  const p = btoa(payload);
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(p));
  return `${p}.${bytesToBase64Url(new Uint8Array(sig))}`;
}
async function verify(token, secret) {
  const [p, sig] = token.split("."); if (!p || !sig) return null;
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["verify"]);
  const ok = await crypto.subtle.verify("HMAC", key, base64UrlToBytes(sig), new TextEncoder().encode(p));
  return ok ? atob(p) : null;
}
function bytesToBase64Url(bytes) { return btoa(String.fromCharCode(...bytes)).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", ""); }
function base64UrlToBytes(s) { const b = atob(s.replaceAll("-", "+").replaceAll("_", "/")); return Uint8Array.from(b, c => c.charCodeAt(0)); }

async function listContent(request, env) {
  if (!await requireAny(request, env)) return json({ error: "unauthorized" }, 401);
  const { results } = await env.DB.prepare("SELECT * FROM content ORDER BY chapter_id, created_at DESC").all();
  return json({ items: results });
}

async function addContent(request, env) {
  if (!await requireRole(request, env, "admin")) return json({ error: "unauthorized" }, 401);
  const data = await request.formData();
  const mediaFile = data.get("file"); const thumbFile = data.get("thumbnail");
  const id = crypto.randomUUID();
  let mediaKey = null, thumbKey = null;
  if (mediaFile instanceof File && mediaFile.size) { mediaKey = `media/${id}-${safeName(mediaFile.name)}`; await env.MEDIA.put(mediaKey, mediaFile.stream(), { httpMetadata: { contentType: mediaFile.type } }); }
  if (thumbFile instanceof File && thumbFile.size) { thumbKey = `thumbs/${id}-${safeName(thumbFile.name)}`; await env.MEDIA.put(thumbKey, thumbFile.stream(), { httpMetadata: { contentType: thumbFile.type } }); }
  await env.DB.prepare("INSERT INTO content (chapter_id,type,title,body,media_key,external_url,thumbnail_key,thumbnail_url) VALUES (?,?,?,?,?,?,?,?)")
    .bind(Number(data.get("chapterId")), String(data.get("type")), String(data.get("title")), String(data.get("body") || ""), mediaKey, String(data.get("url") || ""), thumbKey, String(data.get("thumbnailUrl") || "")).run();
  return json({ ok: true });
}

async function deleteContent(request, env) {
  if (!await requireRole(request, env, "admin")) return json({ error: "unauthorized" }, 401);
  const id = new URL(request.url).searchParams.get("id");
  const row = await env.DB.prepare("SELECT media_key,thumbnail_key FROM content WHERE id=?").bind(id).first();
  if (row?.media_key) await env.MEDIA.delete(row.media_key); if (row?.thumbnail_key) await env.MEDIA.delete(row.thumbnail_key);
  await env.DB.prepare("DELETE FROM content WHERE id=?").bind(id).run(); return json({ ok: true });
}

async function media(request, env, key) {
  if (!await requireAny(request, env)) return new Response("Unauthorized", { status: 401 });
  const object = await env.MEDIA.get(decodeURIComponent(key)); if (!object) return new Response("Not found", { status: 404 });
  const headers = new Headers(); object.writeHttpMetadata(headers); headers.set("etag", object.httpEtag); headers.set("Cache-Control", "private, max-age=3600");
  return new Response(object.body, { headers });
}

function safeName(name) { return name.normalize("NFKD").replace(/[^a-zA-Z0-9._-]/g, "-").slice(-100); }
function json(value, status = 200) { return new Response(JSON.stringify(value), { status, headers: { "content-type": "application/json; charset=utf-8" } }); }
function html(body) { return new Response(body, { headers: { "content-type": "text/html; charset=utf-8", "content-security-policy": "default-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; img-src 'self' data: https:; media-src 'self' https:; frame-src 'self' https:;" } }); }
function redirect(to) { return new Response(null, { status: 302, headers: { location: to } }); }

const styles = `
*{box-sizing:border-box}body{margin:0;background:#f8f6f0;color:#17342d;font-family:system-ui,-apple-system,"Noto Sans JP",sans-serif}a{color:inherit}button,input,select,textarea{font:inherit}.top{display:flex;justify-content:space-between;align-items:center;padding:18px 5vw;background:#fff;border-bottom:1px solid #dedbd2}.logo{font-weight:900;letter-spacing:.03em}.logo span{background:#17342d;color:#fff;padding:8px;margin-right:10px}.wrap{max-width:1180px;margin:38px auto;padding:0 24px}.kicker{color:#b9783f;font-size:12px;letter-spacing:.18em;font-weight:800}.hero h1{font-family:Georgia,serif;font-size:clamp(36px,6vw,72px);margin:.2em 0}.muted{color:#65736e}.auth{min-height:100vh;display:grid;place-items:center;background:linear-gradient(120deg,#17342d 0 48%,#f8f6f0 48%)}.panel{background:#fff;width:min(480px,90vw);padding:42px;border-radius:18px;box-shadow:0 24px 70px #0b201b33}.panel label,.form label{display:grid;gap:8px;font-weight:700;margin:18px 0}.panel input,.form input,.form select,.form textarea{width:100%;padding:13px;border:1px solid #cac7bd;border-radius:8px;background:#fff}.primary{border:0;border-radius:8px;padding:14px 18px;background:#17342d;color:white;font-weight:800;cursor:pointer}.error{color:#a33}.chapters{display:flex;gap:8px;overflow:auto;padding:4px 0 20px}.chapters button{white-space:nowrap;padding:9px 13px;border:1px solid #d7d3c9;border-radius:999px;background:white}.chapters button.active{background:#17342d;color:white}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:20px}.card{background:#fff;border-radius:14px;overflow:hidden;border:1px solid #e1ded5;box-shadow:0 8px 24px #17342d0b}.thumb{aspect-ratio:16/9;background:#dfe6e1;display:grid;place-items:center;overflow:hidden}.thumb img{width:100%;height:100%;object-fit:cover}.card-body{padding:20px}.badge{font-size:11px;letter-spacing:.12em;color:#b9783f;font-weight:900}.open{display:inline-block;text-decoration:none;margin-top:8px}.admin{display:grid;grid-template-columns:300px 1fr;gap:28px}.form,.list{background:#fff;padding:24px;border-radius:14px;border:1px solid #e1ded5}.row{display:grid;grid-template-columns:1fr 1fr;gap:14px}.item{padding:16px 0;border-bottom:1px solid #eee}.danger{border:0;background:#8b2f2f;color:#fff;padding:8px 12px;border-radius:6px}.logout{border:0;background:none;font-weight:700;cursor:pointer}@media(max-width:760px){.auth{background:#17342d}.admin{grid-template-columns:1fr}.row{grid-template-columns:1fr}}
`;

function shell(title, content, script = "") { return `<!doctype html><html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title} | あいらいふ</title><style>${styles}</style></head><body>${content}<script>${script}</script></body></html>`; }
function header(admin=false) { return `<header class="top"><div class="logo"><span>AI</span>あいらいふ</div><nav>${admin?'<a href="/members">会員画面を見る</a>':''} <button class="logout" onclick="logout()">ログアウト</button></nav></header>`; }
function loginPage(admin) { return shell(admin ? "運営管理画面" : "会員ログイン", `<main class="auth"><form class="panel" id="login"><p class="kicker">${admin?'FOR OPERATORS':'MEMBERS ONLY'}</p><h1>${admin?'運営管理画面':'会員サイトへログイン'}</h1><p class="muted">ユーザー名とパスワードを入力してください。</p><label>ユーザー名<input name="username" autocomplete="username" required></label><label>パスワード<input name="password" type="password" autocomplete="current-password" required></label><p class="error" id="error"></p><button class="primary">ログインする →</button></form></main>`, `document.querySelector('#login').onsubmit=async e=>{e.preventDefault();const r=await fetch('${admin?'/api/admin/login':'/api/login'}',{method:'POST',body:new FormData(e.target)});if(r.ok)location.href='${admin?'/admin':'/members'}';else document.querySelector('#error').textContent='ユーザー名またはパスワードが正しくありません。'};`); }
function chapterButtons() { return chapters.map((c,i)=>`<button data-chapter="${i+1}" class="${i===0?'active':''}">${String(i+1).padStart(2,'0')} ${c}</button>`).join(""); }
function memberPage() { return shell("会員サイト", `${header()}<main class="wrap"><section class="hero"><p class="kicker">AI LIFE ACADEMY</p><h1>学びを、毎日の成果に。</h1><p class="muted">動画・スライド・実践資料を章ごとに確認できます。</p></section><div class="chapters">${chapterButtons()}</div><section id="cards" class="grid"></section></main>`, commonScript()+`
let selected=1;const buttons=[...document.querySelectorAll('[data-chapter]')];buttons.forEach(b=>b.onclick=()=>{buttons.forEach(x=>x.classList.remove('active'));b.classList.add('active');selected=Number(b.dataset.chapter);render()});let items=[];async function load(){const r=await fetch('/api/content');items=(await r.json()).items||[];render()}function urlFor(x,thumb=false){const key=thumb?x.thumbnail_key:x.media_key;const ext=thumb?x.thumbnail_url:x.external_url;return key?'/media/'+encodeURIComponent(key):ext||''}function render(){const list=items.filter(x=>x.chapter_id===selected);cards.innerHTML=list.length?list.map(x=>{const u=urlFor(x),t=urlFor(x,true);return '<article class="card"><div class="thumb">'+(t?'<img src="'+esc(t)+'" alt="">':'<strong>'+esc(x.type.toUpperCase())+'</strong>')+'</div><div class="card-body"><span class="badge">'+esc(x.type.toUpperCase())+'</span><h2>'+esc(x.title)+'</h2><p>'+esc(x.body||'説明文なし')+'</p>'+(u?'<a class="primary open" href="'+esc(u)+'" target="_blank" rel="noopener">教材を開く ↗</a>':'<p class="error">教材ファイルが設定されていません</p>')+'</div></article>'}).join(''):'<p class="muted">この章の教材はまだありません。</p>'}load();`); }
function adminPage() { return shell("運営管理画面", `${header(true)}<main class="wrap"><p class="kicker">CONTENT EDITOR</p><h1>教材を追加・管理</h1><div class="admin"><form id="content" class="form"><label>章<select name="chapterId">${chapters.map((c,i)=>`<option value="${i+1}">第${i+1}章 ${c}</option>`).join('')}</select></label><label>教材の種類<select name="type"><option value="text">文章・お知らせ</option><option value="video">動画</option><option value="slide">スライド</option><option value="file">ダウンロード資料</option></select></label><label>タイトル<input name="title" required></label><label>説明文<textarea name="body" rows="5"></textarea></label><label>動画・スライドのURL<input name="url" type="url" placeholder="https://..."></label><label>または教材ファイル<input name="file" type="file" accept="video/*,.pdf,.ppt,.pptx,.key"></label><hr><h2>サムネイル</h2><label>サムネイル画像<input name="thumbnail" type="file" accept="image/*"></label><label>または画像URL<input name="thumbnailUrl" type="url" placeholder="https://..."></label><button class="primary">教材を追加する</button><p id="status"></p></form><section class="list"><h2>登録済みの教材</h2><div id="items"></div></section></div></main>`, commonScript()+`
let all=[];async function load(){const r=await fetch('/api/content');all=(await r.json()).items||[];items.innerHTML=all.map(x=>'<article class="item"><span class="badge">第'+x.chapter_id+'章 '+esc(x.type.toUpperCase())+'</span><h3>'+esc(x.title)+'</h3><p>'+esc(x.body||'説明文なし')+'</p><button class="danger" data-delete="'+x.id+'">削除</button></article>').join('')||'<p class="muted">まだ教材がありません。</p>';document.querySelectorAll('[data-delete]').forEach(b=>b.onclick=async()=>{if(confirm('この教材を削除しますか？')){await fetch('/api/content?id='+b.dataset.delete,{method:'DELETE'});load()}})}content.onsubmit=async e=>{e.preventDefault();status.textContent='保存しています…';const r=await fetch('/api/content',{method:'POST',body:new FormData(e.target)});if(r.ok){e.target.reset();status.textContent='教材を追加しました';load()}else status.textContent='保存できませんでした'};load();`); }
function commonScript() { return `function esc(s){return String(s||'').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]))}async function logout(){await fetch('/api/logout',{method:'POST'});location.href='/login'}`; }
