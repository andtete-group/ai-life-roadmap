import { createRoot } from "https://esm.sh/react-dom@19.1.0/client";
import { supabase } from "./supabase.js?v=2";

const supported = new Set(["1","2","3","4","5","7","8","9","10","12"]);
const chapter = new URLSearchParams(location.search).get("chapter") || "1";
const { data: { session } } = await supabase.auth.getSession();

if (!session) {
  location.replace("./");
} else if (!supported.has(chapter)) {
  location.replace("./");
} else {
  const { default: Tool } = await import(`./tool-${chapter}.js`);
  document.querySelector("#toolLoading").remove();
  createRoot(document.querySelector("#root")).render(Tool());
}

document.addEventListener("click", event => {
  const link = event.target.closest("a");
  if (!link) return;
  const url = new URL(link.href, location.href);
  if (url.origin !== location.origin) return;
  const match = url.pathname.match(/\/chapter(\d+)\/?$/);
  if (url.pathname === "/") {
    event.preventDefault();
    location.href = "./tool.html?chapter=1";
  } else if (match && supported.has(match[1])) {
    event.preventDefault();
    location.href = `./tool.html?chapter=${match[1]}`;
  }
});
