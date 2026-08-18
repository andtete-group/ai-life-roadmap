const grid=document.querySelector("#articleGrid");
if(grid){
  const colors=[["#0d2847","#087fc4"],["#17203b","#d34d36"],["#24325f","#b74da7"],["#08213c","#078c9f"],["#2d183c","#e04b62"],["#10283b","#d28a28"],["#223b31","#66a534"],["#172b4b","#276dc9"],["#17374a","#20a39e"]];
  const posts=[
    {no:1,code:"CODEX START",title:"Codexスタート講座\n最初の6ステップとAIが賢くなるフォルダ設計",lead:"Codexを初めて使う人が迷わない始め方と、仕事を理解してくれるAIに育てるフォルダ整理を解説します。",tags:["初心者向け","フォルダ設計","プロンプト付き"],published:"2026-08-16",updated:"2026-08-18",href:"./article-01-codex-start.html",image:"./assets/codex-workspace-hero.jpg"},
    ...Object.entries(window.AILifeBonusArticles).map(([no,a])=>({no:Number(no),...a,published:"2026-08-18",updated:"2026-08-18",href:`./article.html?no=${no}`}))
  ].sort((a,b)=>b.updated.localeCompare(a.updated)||b.no-a.no);
  const format=d=>d.replaceAll("-",".");
  const ageInDays=d=>Math.floor((Date.now()-new Date(`${d}T00:00:00+09:00`))/86400000);
  const freshness=p=>ageInDays(p.updated)>180?'<span class="freshness old">情報が古い可能性あり</span>':ageInDays(p.published)<=14?'<span class="freshness new">NEW</span>':'<span class="freshness current">確認済み</span>';
  grid.innerHTML=posts.map((p,i)=>`<article class="blog-post ${i===0?'latest':''}">${p.image?`<a class="blog-post__image" href="${p.href}"><img src="${p.image}" alt="${p.title.replace("\n"," ")}"></a>`:`<a class="blog-post__visual" data-no="${String(p.no).padStart(2,"0")}" style="--card-a:${colors[(p.no-1)%colors.length][0]};--card-b:${colors[(p.no-1)%colors.length][1]}" href="${p.href}"><span>${p.code}</span></a>`}<div class="blog-post__body"><div class="post-status">${freshness(p)}<span>${p.code}</span></div><h2><a href="${p.href}">${p.title.replace("\n","<br>")}</a></h2><p>${p.lead}</p><div class="post-dates"><time datetime="${p.published}">公開 ${format(p.published)}</time>${p.updated!==p.published?`<time datetime="${p.updated}">更新 ${format(p.updated)}</time>`:""}</div><div class="topic-tags">${p.tags.slice(0,3).map(t=>`<span>${t}</span>`).join("")}</div><a class="text-link" href="${p.href}">続きを読む <b>→</b></a></div></article>`).join("");
  document.querySelector("#articleCount").textContent=`全${posts.length}記事`;
  const updates=[
    ["2026-08-18","データ分析・メール・議事録など実践記事8本を追加","NEW"],
    ["2026-08-18","X運用・Codex設計・補助制度・利用量管理を追加","NEW"],
    ["2026-08-18","第2〜8回の記事を公開","NEW"],
    ["2026-08-18","Codexスタート講座を更新","UPDATE"],
    ["2026-08-16","Codexスタート講座を公開","START"]
  ];
  const typeLabel={NEW:"新規公開",UPDATE:"内容更新",START:"ブログ開始"};
  const typeIcon={NEW:"＋",UPDATE:"↻",START:"●"};
  document.querySelector("#updateTimeline").innerHTML=updates.map(([date,text,type])=>`<li class="type-${type.toLowerCase()}"><div class="timeline-icon">${typeIcon[type]}</div><div class="timeline-content"><div><time datetime="${date}">${format(date)}</time><span>${typeLabel[type]}</span></div><p>${text}</p></div></li>`).join("");
}
