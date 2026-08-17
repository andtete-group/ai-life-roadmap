const toast = document.querySelector("#copyToast");

document.querySelectorAll("[data-copy]").forEach((button) => {
  button.addEventListener("click", async () => {
    const source = document.getElementById(button.dataset.copy);
    if (!source) return;
    const text = source.innerText;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const area = document.createElement("textarea");
      area.value = text;
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      document.execCommand("copy");
      area.remove();
    }
    button.textContent = "コピー済み ✓";
    button.classList.add("copied");
    if (toast) {
      toast.classList.add("show");
      window.setTimeout(() => toast.classList.remove("show"), 1800);
    }
    window.setTimeout(() => {
      button.textContent = "コピーする";
      button.classList.remove("copied");
    }, 2200);
  });
});
