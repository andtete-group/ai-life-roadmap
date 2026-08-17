const grid=document.querySelector("#articleGrid");
if(grid){
  const colors=[["#17203b","#d34d36"],["#24325f","#b74da7"],["#08213c","#078c9f"],["#2d183c","#e04b62"],["#10283b","#d28a28"],["#223b31","#66a534"],["#172b4b","#276dc9"]];
  grid.innerHTML=Object.entries(window.AILifeBonusArticles).map(([no,a],i)=>`<article class="article-card"><a class="article-card__visual" data-no="${String(no).padStart(2,"0")}" style="--card-a:${colors[i][0]};--card-b:${colors[i][1]}" href="./article.html?no=${no}"><span>${a.code}</span></a><div class="article-card__body"><div class="article-meta"><span>${String(no).padStart(2,"0")}</span><span>${a.tags[0]}</span></div><h2><a href="./article.html?no=${no}">${a.title.replace("\n","<br>")}</a></h2><p>${a.lead}</p><div class="topic-tags">${a.tags.slice(0,2).map(t=>`<span>${t}</span>`).join("")}</div><a class="read-button" href="./article.html?no=${no}">この記事を読む <b>→</b></a></div></article>`).join("");
}
