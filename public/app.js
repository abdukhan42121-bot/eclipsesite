(() => {
  const cfg = window.ECLIPSE_SITE_CONFIG || {};
  const version = cfg.launcherVersion || '1.0.0';
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


  // Live published-release archive: latest stable release first, all previous releases below.
  const releaseApi = cfg.githubReleasesApi;
  const githubReleasesPage = cfg.githubReleasesPage || 'https://github.com/abdukhan42121-bot/eclipsesite/releases';
  const latestApi = cfg.githubLatestReleaseApi || '';
  const tagsApi = cfg.githubTagsApi || '';
  const repoSlug = `${cfg.githubOwner || 'abdukhan42121-bot'}/${cfg.githubRepo || 'eclipsesite'}`;
  const releaseCacheKey = 'eclipse-client-release-archive-v2';
  const releaseRoot = document.querySelector('[data-release-archive]');
  const releaseFeatured = document.querySelector('[data-release-featured]');
  const releaseList = document.querySelector('[data-release-list]');
  const releaseCount = document.querySelector('[data-release-count]');
  const releaseSearch = document.querySelector('[data-release-search]');
  const releaseFilter = document.querySelector('[data-release-filter]');
  let cachedReleases = [];
  const safeText = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const versionKey = tag => {
    const m = String(tag || '').match(/[vV]?(\d+)\.(\d+)(?:\.(\d+))?(?:[-+.]?(.*))?/);
    return m ? [Number(m[1]), Number(m[2]), Number(m[3] || 0), m[4] || ''] : [0,0,0,String(tag || '')];
  };
  const compareRelease = (a,b) => {
    const time = new Date(b.published_at || b.created_at || 0)-new Date(a.published_at || a.created_at || 0);
    if (time) return time;
    const x=versionKey(a.tag_name), y=versionKey(b.tag_name);
    for(let i=0;i<3;i++) if(x[i]!==y[i]) return y[i]-x[i];
    return Boolean(a.prerelease)-Boolean(b.prerelease);
  };
  const getInstaller = release => (release.assets || []).find(a => /\.exe$/i.test(a.name) && /setup|installer|eclipse/i.test(a.name)) || (release.assets || []).find(a => /\.exe$/i.test(a.name));
  const formatDate = value => { if (!value) return 'SOURCE TAG'; try { const d=new Date(value); return Number.isNaN(d.getTime())?'Date unavailable':new Intl.DateTimeFormat(undefined,{year:'numeric',month:'short',day:'numeric'}).format(d); } catch { return 'Date unavailable'; } };
  function releaseCard(r, latest=false) {
    const tag = safeText(r.tag_name || r.name || 'Unversioned release');
    const title = safeText(r.name || r.tag_name || 'Eclipse Client release');
    const body = safeText((r.body || (r.isTagOnly ? 'Source tag only — no published release notes or installer asset are attached.' : 'Release notes were not provided.')).replace(/\r/g,'').slice(0,360));
    const date = formatDate(r.published_at || r.created_at);
    const installer = getInstaller(r);
    const download = installer ? `<a class="button button-primary" href="${safeText(installer.browser_download_url)}" rel="noopener">Download Setup ↗</a>` : '';
    const allAssets = (r.assets || []).map(a => `<a class="button button-outline" href="${safeText(a.browser_download_url)}" rel="noopener">${safeText(a.name)}</a>`).join('');
    const releaseLink = safeText(r.html_url || (r.isTagOnly ? `https://github.com/${repoSlug}/tree/${encodeURIComponent(r.tag_name || '')}` : githubReleasesPage));
    const sourceLink = (!r.isTagOnly && r.zipball_url) ? `<a class="button button-outline" href="${safeText(r.zipball_url)}" rel="noopener">Source ZIP</a>` : '';
    const badge = latest ? '<span class="release-flag">LATEST STABLE</span>' : (r.isTagOnly ? '<span class="release-flag">SOURCE TAG</span>' : (r.prerelease ? '<span class="release-flag">PRE-RELEASE</span>' : '<span class="release-meta">ARCHIVED VERSION</span>'));
    if (latest) return `<article class="latest-release"><div><div class="eyebrow">${badge}</div><h2>${title}</h2><div class="release-meta"><span>${tag}</span><span>${date}</span><span>${(r.assets||[]).length} ASSETS</span></div><p>${body}</p></div><div class="latest-release-actions">${download || `<a class="button button-outline" href="${releaseLink}" rel="noopener">View release ↗</a>`}<a class="button button-outline" href="${releaseLink}" rel="noopener">Release notes</a></div></article>`;
    return `<article class="release-row" data-release-item data-version-tag="${tag.toLowerCase()}" data-prerelease="${Boolean(r.prerelease)}"><div><div class="release-meta"><span>${badge}</span><span>${date}</span><span>${tag}</span></div><h3>${title}</h3><p>${body}</p></div><div class="release-row-actions">${allAssets || (r.isTagOnly && r.zipball_url ? `<a class="button button-outline" href="${safeText(r.zipball_url)}" rel="noopener">Download source ZIP</a>` : `<span class="release-meta">NO INSTALLER ASSET</span>`)}<a class="button button-outline" href="${releaseLink}" rel="noopener">${r.isTagOnly ? 'View source tag ↗' : 'Release notes ↗'}</a>${sourceLink}</div></article>`;
  }
  function renderArchive() {
    if (!releaseList) return;
    const query = (releaseSearch?.value || '').trim().toLowerCase();
    const filter = releaseFilter?.value || 'all';
    const older = cachedReleases.filter(r => r !== cachedReleases[0]).filter(r => {
      const hay = `${r.tag_name||''} ${r.name||''} ${r.body||''}`.toLowerCase();
      return (!query || hay.includes(query)) && (filter === 'all' || (filter === 'stable' ? !r.prerelease : Boolean(r.prerelease)));
    });
    releaseList.innerHTML = older.length ? older.map(r=>releaseCard(r,false)).join('') : '<div class="release-empty">No versions match this search.</div>';
    if (releaseCount) releaseCount.textContent = `${older.length} OLDER VERSION${older.length===1?'':'S'}`;
  }
  async function loadReleaseArchive() {
    if (!releaseApi) return;
    try {
      let all=[];
      try {
        const cached = JSON.parse(localStorage.getItem(releaseCacheKey) || 'null');
        if (cached && Date.now()-cached.time < 10*60*1000 && Array.isArray(cached.items)) all=cached.items;
      } catch {}
      if (!all.length) {
        let page=1;
        while(page<=10) {
          const separator=releaseApi.includes('?')?'&':'?';
          const response=await fetch(`${releaseApi}${separator}page=${page}`,{headers:{Accept:'application/vnd.github+json'}});
          if (!response.ok) throw new Error(`GitHub Releases returned ${response.status}`);
          const batch=await response.json();
          if (!Array.isArray(batch)) throw new Error('Unexpected release response');
          all=all.concat(batch.filter(r=>!r.draft));
          if(batch.length<100) break;
          page++;
        }
        try { localStorage.setItem(releaseCacheKey,JSON.stringify({time:Date.now(),items:all})); } catch {}
      }
      // Include semantic Git tags that do not have a formal GitHub Release.
      // These appear as source-only history entries and never receive fake installer links.
      if (tagsApi) {
        try {
          let tags=[], tagPage=1;
          while(tagPage<=10) {
            const separator=tagsApi.includes('?')?'&':'?';
            const tagResponse=await fetch(`${tagsApi}${separator}page=${tagPage}`,{headers:{Accept:'application/vnd.github+json'}});
            if(!tagResponse.ok) throw new Error(`GitHub Tags returned ${tagResponse.status}`);
            const batch=await tagResponse.json();
            if(!Array.isArray(batch)) break;
            tags=tags.concat(batch);
            if(batch.length<100) break;
            tagPage++;
          }
          const existing=new Set(all.map(r=>String(r.tag_name||'').toLowerCase()));
          const versionLike=/(?:^|[-_])v?\d+\.\d+(?:\.\d+)?(?:[-+][0-9a-z.-]+)?$/i;
          for(const tag of tags) {
            const name=String(tag.name||'');
            if(!name || existing.has(name.toLowerCase()) || !versionLike.test(name)) continue;
            all.push({id:`tag:${name}`,name,tag_name:name,body:'',draft:false,prerelease:false,published_at:null,created_at:null,assets:[],zipball_url:tag.zipball_url,tarball_url:tag.tarball_url,html_url:`https://github.com/${repoSlug}/tree/${encodeURIComponent(name)}`,isTagOnly:true});
          }
        } catch(tagError) { console.warn('Could not load Git tags:',tagError); }
      }
      let latest=null;
      if(latestApi) {
        try {
          const latestResponse=await fetch(latestApi,{headers:{Accept:'application/vnd.github+json'}});
          if(latestResponse.ok) latest=await latestResponse.json();
        } catch {}
      }
      if(!latest || latest.draft || latest.prerelease) latest=all.filter(r=>!r.prerelease).sort(compareRelease)[0] || null;
      if (!latest) throw new Error('No published stable releases found');
      const ordered=all.filter(r=>r.id!==latest.id).sort(compareRelease);
      cachedReleases=[latest,...ordered];
      if (releaseFeatured) releaseFeatured.innerHTML=releaseCard(latest,true);
      if (releaseList) renderArchive();
      const latestVersion = latest.tag_name || cfg.launcherVersion || '1.0.0';
      document.querySelectorAll('[data-version]').forEach(el=>el.textContent=`v${latestVersion}`);
      document.querySelectorAll('[data-live-latest-download]').forEach(el=>{const asset=getInstaller(latest); if(asset){el.href=asset.browser_download_url;el.classList.remove('is-disabled');el.removeAttribute('aria-disabled');}});
      if (releaseCount) releaseCount.textContent=`${ordered.length} OLDER VERSION${ordered.length===1?'':'S'}`;
      document.querySelectorAll('[data-latest-release-title]').forEach(el=>el.textContent=latest.name||latest.tag_name);
    } catch(error) {
      if (releaseFeatured) releaseFeatured.innerHTML=`<article class="latest-release"><div><div class="release-flag">CURRENT WEBSITE FALLBACK</div><h2>Eclipse Client ${safeText(cfg.launcherVersion || '1.0.0')}</h2><div class="release-meta"><span>v${safeText(cfg.launcherVersion || '1.0.0')}</span><span>WINDOWS x64</span></div><p>The live release feed is temporarily unavailable. Open GitHub to browse the verified release history.</p></div><div class="latest-release-actions"><a class="button button-primary" href="${safeText(cfg.windowsDownloadUrl || '#')}">Download current Setup ↗</a><a class="button button-outline" href="${githubReleasesPage}" rel="noopener">View all releases</a></div></article>`;
      if (releaseList) releaseList.innerHTML=`<div class="release-empty">Live version history is temporarily unavailable. <a class="release-note-link" href="${githubReleasesPage}" rel="noopener">Browse every published version on GitHub ↗</a></div>`;
      if (releaseCount) releaseCount.textContent='LIVE ARCHIVE UNAVAILABLE';
    }
  }
  if (releaseSearch) releaseSearch.addEventListener('input',renderArchive);
  if (releaseFilter) releaseFilter.addEventListener('change',renderArchive);
  if (releaseApi) loadReleaseArchive();

})();
