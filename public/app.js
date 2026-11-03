(() => {
  const cfg = window.ECLIPSE_SITE_CONFIG || {};
  const version = cfg.launcherVersion || '0.7.1';
  document.querySelectorAll('[data-version]').forEach(el => el.textContent = `v${version}`);
  document.querySelectorAll('[data-release-channel]').forEach(el => el.textContent = cfg.releaseChannel || 'PUBLIC RELEASE');
  document.querySelectorAll('[data-download-file]').forEach(el => el.textContent = cfg.downloadFileName || 'Windows x64 installer');
  document.querySelectorAll('[data-installer]').forEach(link => {
    if (cfg.windowsDownloadUrl) {
      link.href = cfg.windowsDownloadUrl;
      link.removeAttribute('aria-disabled');
      link.classList.remove('is-disabled');
    } else {
      link.href = '/download#installer';
      link.setAttribute('aria-disabled', 'true');
      link.classList.add('is-disabled');
    }
  });
  document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());
  const currentPath = location.pathname.replace(/\/$/, '') || '/';
  document.querySelectorAll('[data-nav]').forEach(a => {
    const target = a.getAttribute('href').replace(/\/$/, '') || '/';
    if (target === currentPath || (currentPath === '/' && target === '/home')) a.classList.add('active');
  });
  const menuBtn = document.querySelector('[data-menu-button]');
  const mobileMenu = document.querySelector('[data-mobile-menu]');
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      const open = mobileMenu.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', String(open));
      menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      mobileMenu.classList.remove('open'); menuBtn.setAttribute('aria-expanded','false');
    }));
  }
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const reveal = document.querySelectorAll('.reveal');
  if (!reduce && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); io.unobserve(entry.target); }
    }), {threshold:.08, rootMargin:'0px 0px -30px 0px'});
    reveal.forEach(el => io.observe(el));
  } else reveal.forEach(el => el.classList.add('visible'));

  const tabs = document.querySelectorAll('[data-stage-tab]');
  const stage = document.querySelector('[data-stage]');
  const copyTitle = document.querySelector('[data-stage-title]');
  const copyText = document.querySelector('[data-stage-copy]');
  const stages = {
    home: {title:'A clear view of your next session.',copy:'Your selected profile, installed content and launch action stay together in one calm workspace.',heading:'Welcome back.',sub:'Your selected instance is ready.',banner:'Survival profile',meta:'Fabric · Minecraft 1.21.11',stats:[['CONTENT','12 items'],['MEMORY','4 GB'],['LOADER','FABRIC'],['PRESENCE','OPTIONAL']]},
    profiles:{title:'Separate setups. No crossed wires.',copy:'Keep versions and loaders organised in individual game profiles, then switch between them when your plans change.',heading:'Your profiles.',sub:'Choose a setup to continue.',banner:'Modded survival',meta:'Fabric · Minecraft 1.21.11',stats:[['PROFILE','SURVIVAL'],['MEMORY','4 GB'],['STATUS','READY'],['VERSION','1.21.11']]},
    content:{title:'Bring your content with you.',copy:'Discover compatible Modrinth mods, modpacks, resource packs and shaders for the selected instance.',heading:'Mods & content.',sub:'Managed for this profile.',banner:'Browse Modrinth',meta:'Mods · Packs · Shaders',stats:[['MODS','08'],['PACKS','03'],['SHADERS','01'],['SOURCE','MODRINTH']]},
    wardrobe:{title:'Personalise the details.',copy:'Keep skin and cape customisation close to your profile. Local textures remain local unless configured with a supported provider.',heading:'Your wardrobe.',sub:'Customisation for this instance.',banner:'Character appearance',meta:'Local texture · PNG',stats:[['SKIN','CUSTOM'],['CAPE','OPTIONAL'],['SYNC','LOCAL'],['PROVIDER','SUPPORTED']]},
    settings:{title:'A setup that feels right.',copy:'Tune game resolution, memory allocation, launcher display and Discord Rich Presence in one place.',heading:'Preferences.',sub:'Fine-tune your launcher.',banner:'Launcher settings',meta:'Display · Memory · Presence',stats:[['MEMORY','4 GB'],['WINDOW','1280×800'],['PRESENCE','ON'],['RUNTIME','AUTO']]}
  };
  function renderStage(key, tab) {
    const item = stages[key]; if (!item || !stage) return;
    tabs.forEach(t => { const on = t === tab; t.classList.toggle('active', on); t.setAttribute('aria-pressed', String(on)); });
    stage.classList.add('stage-changing');
    window.setTimeout(() => {
      stage.querySelector('[data-app-heading]').textContent = item.heading;
      stage.querySelector('[data-app-sub]').textContent = item.sub;
      stage.querySelector('[data-app-banner]').textContent = item.banner;
      stage.querySelector('[data-app-meta]').textContent = item.meta;
      stage.querySelectorAll('[data-app-stat]').forEach((el,i) => { el.querySelector('small').textContent = item.stats[i][0]; el.querySelector('b').textContent = item.stats[i][1]; });
      if (copyTitle) copyTitle.textContent = item.title;
      if (copyText) copyText.textContent = item.copy;
      stage.classList.remove('stage-changing');
    }, reduce ? 0 : 130);
  }
  tabs.forEach(tab => tab.addEventListener('click', () => renderStage(tab.dataset.stageTab, tab)));
})();
