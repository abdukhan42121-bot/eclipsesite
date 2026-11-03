(() => {
  const config = window.ECLIPSE_SITE_CONFIG || {};
  const version = config.launcherVersion || "0.7.1";
  document.querySelectorAll("[data-version]").forEach(el => el.textContent = `v${version}`);
  const year = document.getElementById("currentYear");
  if (year) year.textContent = new Date().getFullYear();
  [
    ["[data-support-link]", config.supportUrl],
    ["[data-community-link]", config.discordUrl],
    ["[data-release-link]", config.releaseNotesUrl]
  ].forEach(([selector, url]) => {
    const link = document.querySelector(selector);
    if (link && typeof url === "string" && url.trim()) {
      link.href = url.trim(); link.target = "_blank"; link.rel = "noopener noreferrer"; link.hidden = false;
    }
  });

  const dialog = document.getElementById("downloadDialog");
  const closeDialog = document.getElementById("closeDialog");
  const dialogDownload = document.getElementById("dialogDownload");
  const dialogMessage = document.getElementById("dialogMessage");
  const guide = document.getElementById("dialogGuide");
  const directUrl = (config.windowsDownloadUrl || "").trim();
  function openDownload() {
    if (directUrl) {
      window.location.assign(directUrl);
      return;
    }
    dialogDownload.hidden = true;
    dialogMessage.innerHTML = 'The public installer link has not been connected yet. Once your Windows Setup file is uploaded, add its direct URL to <code>windowsDownloadUrl</code> in <code>config.js</code>. Every download button on the website will then point to the release automatically.';
    if (typeof dialog.showModal === "function") dialog.showModal();
    else window.location.href = "/download";
  }
  document.querySelectorAll(".download-trigger").forEach(button => button.addEventListener("click", event => {
    event.preventDefault();
    if (directUrl) window.location.assign(directUrl);
    else openDownload();
  }));
  if (closeDialog) closeDialog.addEventListener("click", () => dialog.close());
  if (guide) guide.addEventListener("click", () => dialog.close());
  if (dialog) dialog.addEventListener("click", event => { if (event.target === dialog) dialog.close(); });

  const menuButton = document.getElementById("mobileMenuButton");
  const mobileNav = document.getElementById("mobileNav");
  if (menuButton && mobileNav) {
    menuButton.addEventListener("click", () => {
      const open = mobileNav.classList.toggle("open");
      menuButton.setAttribute("aria-expanded", String(open));
      menuButton.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
    });
    mobileNav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
      mobileNav.classList.remove("open"); menuButton.setAttribute("aria-expanded", "false");
    }));
  }

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const revealEls = document.querySelectorAll(".reveal");
  if (!reduceMotion && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add("visible"); observer.unobserve(entry.target); }
    }), {threshold: .12, rootMargin: "0px 0px -25px 0px"});
    revealEls.forEach(el => observer.observe(el));
  } else revealEls.forEach(el => el.classList.add("visible"));

  const stageData = {
    profiles: {title:"Profiles that make sense.", count:"01 — 04", description:"Create separate setups for different versions and playstyles. Sign in with Microsoft or use a local profile for supported offline play.", html:`<div class="stage-greeting"><span>YOUR PROFILES</span><b>Manage your worlds</b></div><div class="instance-row instance-row-active"><div class="instance-thumb thumb-forest"></div><div class="instance-info"><b>Survival profile</b><small>Fabric · 1.21.11 · 4 GB</small></div><span class="instance-check">✓</span></div><div class="instance-row"><div class="instance-thumb thumb-sunset"></div><div class="instance-info"><b>Vanilla world</b><small>Vanilla · 1.21.11 · 3 GB</small></div><span class="instance-more">···</span></div><div class="instance-row"><div class="instance-thumb thumb-void"></div><div class="instance-info"><b>Creative lab</b><small>Fabric · 1.20.4 · 4 GB</small></div><span class="instance-more">···</span></div><div class="stage-app-add">＋ &nbsp; CREATE PROFILE</div>`},
    content: {title:"Your content, in one place.", count:"02 — 04", description:"Browse compatible Modrinth mods, modpacks, resource packs and shaders. Eclipse checks required dependencies and selected profile compatibility.", html:`<div class="stage-greeting"><span>PROFILE CONTENT</span><b>Survival · Installed content</b></div><div class="mini-content-grid"><div class="mini-content-card"><i class="mc-icon mod">✳</i><b>Sodium</b><small>Performance · Mod</small><span>INSTALLED</span></div><div class="mini-content-card"><i class="mc-icon pack">▧</i><b>Visual pack</b><small>Resource pack</small><span>ENABLED</span></div><div class="mini-content-card"><i class="mc-icon shader">◌</i><b>Complementary</b><small>Shader pack</small><span>AVAILABLE</span></div><div class="mini-content-card"><i class="mc-icon mods">▦</i><b>Browse Modrinth</b><small>Find more content</small><span>EXPLORE ↗</span></div></div>`},
    wardrobe: {title:"Your character, your style.", count:"03 — 04", description:"Keep skin and cape customisation close to your profile. Local textures stay local unless you configure a supported provider for shared visibility.", html:`<div class="wardrobe-stage"><div class="wardrobe-stage-left"><span>ACTIVE CHARACTER</span><b>Player skin</b><small>Local texture · PNG</small><div class="wardrobe-stage-actions"><i>SKIN</i><i>CAPE</i></div></div><div class="wardrobe-stage-right"><div class="skin-stage-aura"></div><div class="skin-stage-head"></div><div class="skin-stage-torso"></div><div class="skin-stage-arm l"></div><div class="skin-stage-arm r"></div><div class="skin-stage-leg l"></div><div class="skin-stage-leg r"></div></div></div>`},
    settings: {title:"The details, dialled in.", count:"04 — 04", description:"Tune game and launcher display settings, memory allocation, Java runtime preferences and Discord Rich Presence to fit your setup.", html:`<div class="stage-greeting"><span>LAUNCHER PREFERENCES</span><b>Your setup</b></div><div class="setting-stage-row"><span>Game resolution</span><b>1920 × 1080</b></div><div class="setting-stage-row"><span>Memory allocation</span><b>4 GB</b></div><div class="setting-stage-row"><span>Discord Rich Presence</span><b class="enabled-tag">ON</b></div><div class="setting-stage-row"><span>Java runtime</span><b>Auto detect</b></div><div class="setting-stage-row"><span>Launcher window</span><b>1280 × 800</b></div>`}
  };
  const stageMain = document.getElementById("stageAppMain");
  const stageVisual = document.getElementById("stageVisual");
  document.querySelectorAll(".showcase-tab").forEach(tab => tab.addEventListener("click", () => {
    const key = tab.dataset.showcase;
    const data = stageData[key];
    if (!data || !stageMain) return;
    document.querySelectorAll(".showcase-tab").forEach(item => { const active = item === tab; item.classList.toggle("active", active); item.setAttribute("aria-selected", String(active)); });
    stageVisual.classList.add("changing");
    window.setTimeout(() => {
      stageMain.innerHTML = data.html;
      document.getElementById("stageTitle").textContent = data.title;
      document.getElementById("stageCount").textContent = data.count;
      document.getElementById("stageDescription").textContent = data.description;
      document.querySelectorAll(".stage-progress i").forEach((dot, index) => dot.classList.toggle("active", index === Object.keys(stageData).indexOf(key)));
      stageVisual.classList.remove("changing");
    }, reduceMotion ? 0 : 160);
  }));

})();
