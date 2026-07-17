import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
export const supabase = createClient("https://hahdvhvvasefphriviga.supabase.co", "sb_publishable_bs4qBgSrVRnf8K20TNU_gw_XzRjIqxX");
export const chapters = ["ChatGPT・Codex完全理解","プロンプト完全攻略","ChatGPT仕事術","GPTs・AI秘書構築","Codex完全攻略","Codex仕事自動化","AI×画像・SNS","AI動画制作","AIコンテンツ販売","AIアプリ開発","AI自動化・API連携","AI会社設計・収益化","実践ワーク"];
export function accountEmail(username, admin=false){ const v=username.trim().toUpperCase(); if(v==="AILIFE") return admin?"admin@ai-life.local":"member@ai-life.local"; return admin?"admin@ai-life.local":"member@ai-life.local"; }
export function youtubeEmbed(value){ try{const u=new URL(value);let id="";if(u.hostname.includes("youtu.be"))id=u.pathname.slice(1);else if(u.pathname.startsWith("/shorts/"))id=u.pathname.split("/")[2];else id=u.searchParams.get("v")||u.pathname.split("/").pop();return id?`https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}`:""}catch{return ""} }
export function esc(v){return String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
