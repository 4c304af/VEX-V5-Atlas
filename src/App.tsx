import { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { AnimatePresence, MotionConfig, motion } from 'motion/react';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Bookmark, BookMarked, BookOpen, Check, ChevronDown, ChevronRight, CircleHelp, Clock3, Code2, Command, Copy, ExternalLink, FileCode2, Globe2, Grid2X2, Heart, House, Keyboard, Languages, Library, List, Menu, Minus, Moon, PanelLeftClose, Plus, RefreshCw, Search, Settings2, ShieldCheck, Sparkles, Square, Sun, Trash2, WifiOff, X } from 'lucide-react';
import Prism from 'prismjs';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import '@fontsource-variable/manrope';
import RobotArt from './RobotArt';
import AccentSettings from './AccentSettings';
import { accentPalette } from './theme';
import DocumentationUpdates, { useDocumentationUpdates } from './DocumentationUpdates';
import AutoUpdates, {useAutoUpdates} from './AutoUpdates';
import appPackage from '../package.json';
import { DEFAULT_SETTINGS, GROUPS, QUICK, TERMS, groupFor } from './data';
import type { Catalog, Doc, Entry, Page, Read, Settings } from './types';

function stored<T>(key: string, fallback: T): T {
  try { const value = localStorage.getItem('atlas:'+key); return value ? JSON.parse(value) : fallback; } catch { return fallback; }
}
function useSaved<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => stored(key, initial));
  useEffect(() => { try { localStorage.setItem('atlas:'+key, JSON.stringify(value)); } catch { /* Reading remains available when storage is full. */ } }, [key,value]);
  return [value, setValue] as const;
}
function pageFromHash(): Page {
  const hash = decodeURIComponent(location.hash.slice(1));
  if (hash.startsWith('doc/')) { const [id, anchor] = hash.slice(4).split('#'); return { kind: 'doc', id, anchor }; }
  const [kind, group] = hash.split('/');
  if (['home','library','favorites','history','settings','glossary','updates'].includes(kind)) return { kind: kind as Exclude<Page['kind'],'doc'>, group };
  return { kind: 'home' };
}
function pageHash(page: Page) {
  if (page.kind === 'doc') return '#doc/'+page.id+(page.anchor ? '#'+page.anchor : '');
  return '#'+page.kind+(page.group ? '/'+page.group : '');
}
const spring = { type: 'spring' as const, stiffness: 380, damping: 32 };
const transitions = { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -5 }, transition: { duration: .2 } };

export default function App() {
  const [settings, setSettings] = useSaved<Settings>('settings', DEFAULT_SETTINGS);
  const [favorites, setFavorites] = useSaved<string[]>('favorites', []);
  const [reads, setReads] = useSaved<Read[]>('history', []);
  const [page, setPage] = useState<Page>(pageFromHash);
  const [catalog, setCatalog] = useState<Catalog | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toast, setToast] = useState('');
  const [retry, setRetry] = useState(0);
  const documentationUpdates=useDocumentationUpdates(catalog?.snapshotId);
  const autoUpdates=useAutoUpdates(settings);
  const scrollRef = useRef<HTMLElement>(null);
  const zh = settings.language !== 'en';
  const t = useCallback((cn: string, en: string) => zh ? cn : en, [zh]);
  const entries = catalog?.documents ?? [];
  const current = page.kind === 'doc' ? entries.find(d => d.id === page.id) : undefined;

  useEffect(() => {
    const controller = new AbortController();
    fetch('./docs/catalog.json', { cache:'no-store',signal: controller.signal }).then(r => { if (!r.ok) throw Error(); return r.json(); }).then(value=>{setLoadError(false);setCatalog(value);}).catch(e => { if (e.name !== 'AbortError') setLoadError(true); });
    return () => controller.abort();
  }, [retry]);
  useEffect(()=>{const refresh=()=>setRetry(n=>n+1);window.addEventListener('atlas:library-updated',refresh);return()=>window.removeEventListener('atlas:library-updated',refresh);},[]);
  useEffect(() => { const change = () => { setPage(pageFromHash()); setSidebarOpen(false); }; window.addEventListener('hashchange',change); return () => window.removeEventListener('hashchange',change); }, []);
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setSearchOpen(v => !v); }
      if (e.key === 'Escape') { setSearchOpen(false); setSidebarOpen(false); }
    };
    window.addEventListener('keydown',key); return () => window.removeEventListener('keydown',key);
  }, []);
  useEffect(() => {
    const media = matchMedia('(prefers-color-scheme: dark)');
    const apply = () => {
      const theme = settings.theme === 'system' ? (media.matches ? 'dark' : 'light') : settings.theme;
      document.documentElement.dataset.theme = theme;
      for (const [key, value] of Object.entries(accentPalette(settings.accent, settings.customColor, theme === 'dark'))) {
        document.documentElement.style.setProperty(key, value);
      }
    };
    apply(); media.addEventListener('change',apply);
    document.documentElement.lang = zh ? 'zh-CN' : 'en';
    document.documentElement.dataset.motion = settings.motion ? 'on' : 'off';
    document.documentElement.dataset.accent = settings.accent;
    document.documentElement.style.setProperty('--reader-font', settings.fontSize+'px');
    return () => media.removeEventListener('change',apply);
  }, [settings,zh]);
  useEffect(() => { if (toast) { const id = setTimeout(() => setToast(''), 2800); return () => clearTimeout(id); } }, [toast]);
  useEffect(() => {
    if (page.kind === 'doc') {
      const id = page.id;
      setReads(prev => [{ id, time: Date.now() }, ...prev.filter(r => r.id !== id)].slice(0,80));
    }
    scrollRef.current?.scrollTo({ top: 0, behavior: 'instant' });
  }, [page.kind, page.kind === 'doc' ? page.id : page.group, setReads]);

  const navigate = useCallback((next: Page) => {
    setSidebarOpen(false);
    if (location.hash === pageHash(next)) { setPage(next); scrollRef.current?.scrollTo({top: 0}); }
    else location.hash = pageHash(next);
  }, []);
  const openDoc = useCallback((id: string, anchor?: string) => navigate({ kind: 'doc', id, anchor }), [navigate]);
  const favorite = useCallback((id: string) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(v => v !== id) : [...prev,id]);
  }, [setFavorites]);
  const changeSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => setSettings(s => ({...s,[key]:value}));
  const name = (e: Entry) => zh ? e.zhTitle : e.title;
  const title = current ? name(current) : ({ home:t('概览','Overview'), library:t('API 文档库','API library'), favorites:t('我的收藏','Bookmarks'), history:t('最近阅读','Reading history'), settings:t('偏好设置','Preferences'), glossary:t('中英术语表','Bilingual glossary'),updates:t('文档更新','Documentation updates'), doc:'' })[page.kind];
  const source = useCallback(async (url: string) => {
    if (window.atlasDesktop) {
      if (!(await window.atlasDesktop.openSource(url))) setToast(t('此链接未包含在离线包中','This link is not included in the offline bundle'));
    } else window.open(url, '_blank', 'noopener,noreferrer');
  }, [t]);

  return <MotionConfig reducedMotion={settings.motion ? 'user' : 'always'} transition={spring}>
    <div className="app-shell">
      <div className="titlebar" onDoubleClick={() => window.atlasDesktop?.maximize()}>
        <div className="titlebar-brand"><span className="tiny-mark">V5</span> ATLAS <span className="titlebar-separator" /> VEX V5 C++ API</div>
        {window.atlasDesktop && <div className="window-controls">
          <button aria-label={t('最小化','Minimize')} onClick={() => window.atlasDesktop!.minimize()}><Minus size={14}/></button>
          <button aria-label={t('最大化','Maximize')} onClick={() => window.atlasDesktop!.maximize()}><Square size={11}/></button>
          <button className="window-close" aria-label={t('关闭','Close')} onClick={() => window.atlasDesktop!.close()}><X size={16}/></button>
        </div>}
      </div>
      <div className="app-body">
        {sidebarOpen && <button className="sidebar-shade" aria-label={t('收起导航','Close navigation')} onClick={() => setSidebarOpen(false)}/>}
        <aside className={'sidebar '+(sidebarOpen ? 'open' : '')}>
          <button className="brand" onClick={() => navigate({kind:'home'})} aria-label="V5 Atlas Home">
            <img src="./icon.svg" alt=""/><div><strong>V5 Atlas<span className="brand-dot">.</span></strong></div>
          </button>
          <button className="sidebar-search" onClick={() => setSearchOpen(true)}><Search size={17}/><span>{t('搜索文档','Search anything')}</span><kbd>⌃ K</kbd></button>
          <nav aria-label={t('主导航','Main navigation')} className="main-nav">
            {[
              {kind:'home',zh:'概览',en:'Overview',icon:House},
              {kind:'library',zh:'全部 API',en:'All APIs',icon:Library,count:entries.length},
              {kind:'favorites',zh:'我的收藏',en:'Bookmarks',icon:Bookmark,count:favorites.length || undefined},
              {kind:'history',zh:'最近阅读',en:'Recent reading',icon:Clock3},
            ].map(item => {
              const active = page.kind === item.kind && !(page.kind === 'library' && page.group);
              return <button key={item.kind} className={'nav-item '+(active?'active':'')} onClick={() => navigate({kind:item.kind as 'home'})} aria-current={active?'page':undefined}>
                {active && <motion.span className="nav-selection" layoutId="navigation" transition={spring}/>}<item.icon size={19}/><span>{t(item.zh,item.en)}</span>{item.count !== undefined && <small>{item.count}</small>}
              </button>;
            })}
          </nav>
          <div className="nav-section-label">{t('探索 API','EXPLORE THE API')}<span>C++</span></div>
          <nav className="category-nav" aria-label={t('API 分类','API categories')}>
            {GROUPS.filter(g => g.id !== 'Essentials').map(g => {
              const count = entries.filter(d => d.group === g.id || d.id === g.id).length;
              const active = (page.kind === 'library' && page.group === g.id) || (current && (current.group === g.id || current.id === g.id));
              return <button key={g.id} className={'category-link '+(active?'active':'')} onClick={() => navigate({kind:'library',group:g.id})}><g.icon size={17}/><span>{t(g.zh,g.en)}</span><small>{count}</small></button>;
            })}
          </nav>
          <div className="sidebar-bottom">
            <button className={'subtle-link '+(page.kind==='updates'?'selected':'')} onClick={() => navigate({kind:'updates'})}><RefreshCw size={17} className={documentationUpdates.busy||autoUpdates.busy?'update-spinning':''}/>{t('文档更新','Documentation updates')}{autoUpdates.result?.application.status==='ready'&&<small className="update-ready-badge">{t('新版','NEW')}</small>}</button>
            <button className={'subtle-link '+(page.kind==='glossary'?'selected':'')} onClick={() => navigate({kind:'glossary'})}><Languages size={17}/>{t('中英术语表','Bilingual glossary')}<ArrowUpRight size={14}/></button>
            <button className={'subtle-link '+(page.kind==='settings'?'selected':'')} onClick={() => navigate({kind:'settings'})}><Settings2 size={17}/>{t('偏好设置','Preferences')}</button>
          </div>
        </aside>

        <div className="workspace">
          <header className="topbar">
            <button className="icon-button mobile-menu" aria-label={t('打开导航','Open navigation')} onClick={() => setSidebarOpen(v=>!v)}><Menu size={21}/></button>
            <div className="breadcrumb"><strong>{title}</strong></div>
            <div className="topbar-actions">
              <span className="offline-pill"><span className="status-dot"/>{t('离线就绪','Offline ready')}</span>
              <div className="language-switch" aria-label={t('阅读语言','Reading language')}>
                {(['zh','en','dual'] as const).map((l,i)=><button key={l} aria-pressed={settings.language === l} className={settings.language===l?'selected':''} onClick={() => changeSetting('language',l)}>{settings.language===l && <motion.span layoutId="language" className="language-selection"/>}<span>{['中','EN',t('对照','DUAL')][i]}</span></button>)}
              </div>
              <button className="icon-button theme-toggle" onClick={() => changeSetting('theme', document.documentElement.dataset.theme==='dark'?'light':'dark')} aria-label={t('切换深浅色主题','Toggle color theme')}><Sun className="sun-icon" size={19}/><Moon className="moon-icon" size={19}/></button>
            </div>
          </header>

          <main ref={scrollRef} className={'main-scroll '+(page.kind==='doc'?'reading-scroll':'')} id="main-content">
            {!catalog ? <div className="loading-state"><div className="morph-loader"/><h2>{loadError ? t('文档加载失败','Could not load documents') : t('正在打开你的离线文档库','Opening your offline library')}</h2>{loadError && <button className="primary-button" onClick={() => {setLoadError(false);setRetry(r=>r+1);}}>{t('重试','Retry')}</button>}</div> :
              <AnimatePresence mode="wait" initial={false}>
                <motion.div key={page.kind === 'doc' ? page.id : page.kind+(page.group??'')} className={'page page-'+page.kind} {...transitions}>
                  {page.kind === 'home' && <>
                    <section className="hero">
                      <div className="hero-copy">
                        <h1>VEX V5 C++<br/><span>{t('离线参考手册','Offline reference')}</span><span className="hero-spark">✳</span></h1>
                        <p>{t('查阅设备 API、函数与代码示例，支持中英对照。','Device APIs, functions, and code examples in Chinese and English.')}</p>
                        <div className="hero-buttons"><button className="primary-button" onClick={()=>navigate({kind:'library'})}>{t('探索 API 文档','Explore the API')}<ArrowRight size={18}/></button><button className="text-button" onClick={()=>openDoc('index')}>{t('从这里开始','Start here')}<ArrowUpRight size={17}/></button></div>
                      </div>
                      <div className="hero-art"><span className="art-orbit"/><RobotArt animate={settings.motion}/></div>
                    </section>
                    <div className="stats-strip"><span><FileCode2 size={17}/><strong>{entries.length}</strong>{t('篇完整文档','complete documents')}</span><i/><span><Languages size={18}/><strong>{t('中 / EN','ZH / EN')}</strong>{t('双语对照','side by side')}</span><i/><span><ShieldCheck size={18}/>{t('文档与示例全部本地存储','Docs & examples stored locally')}</span><span className="snapshot-label">SNAPSHOT · {catalog.snapshotDate.replaceAll('-','.')} </span></div>
                    <section className="quick-section"><div className="section-heading"><div><span className="section-index">01</span><h2>{t('从常用设备开始','Start with the essentials')}</h2></div><button className="text-button small" onClick={()=>navigate({kind:'library'})}>{t('查看全部','View all')}<ArrowRight size={16}/></button></div>
                      <div className="quick-grid">{QUICK.map((q,i)=><motion.button key={q.id} whileHover={{ y: -5 }} whileTap={{ scale: .98 }} className={'quick-card '+q.color} onClick={()=>openDoc(q.id)}><div className="quick-card-top"><span className="shape-icon"><q.icon size={25}/></span><ArrowUpRight size={19}/></div><code>{q.name}</code><strong>{t(q.zh,q.en)}</strong><div className="quick-card-footer">{t('查看参考','Open reference')}<span>0{i+1}</span></div></motion.button>)}</div>
                    </section>
                    <div className="home-bottom-grid"><section className="continue-panel"><div className="section-heading"><div><span className="section-index">02</span><h2>{t('最近阅读','Recent reading')}</h2></div><Clock3 size={17}/></div>
                      {reads.filter(r=>entries.some(e=>e.id===r.id)).slice(0,3).map(read=>{const entry=entries.find(e=>e.id===read.id)!;return <button className="recent-row" key={read.id} onClick={()=>openDoc(read.id)}><span className={'small-icon '+groupFor(entry.group).color}><FileCode2 size={19}/></span><div><strong>{name(entry)}</strong><span>{entry.title} · C++</span></div><ArrowRight size={17}/></button>;})}
                      {reads.length===0 && <div className="first-read"><span className="first-read-art"><BookOpen size={25}/></span><p>{t('暂无阅读记录','No recent reading')}</p><button className="round-button" onClick={()=>openDoc('Drivetrain/index')} aria-label={t('开始阅读','Start reading')}><ArrowRight size={20}/></button></div>}
                    </section><section className="tip-card"><div className="tip-eyebrow"><Keyboard size={17}/>{t('快捷搜索','Quick search')}</div><h3>{t('搜索函数或设备','Find a function or device')}</h3><button onClick={()=>setSearchOpen(true)} className="shortcut-button"><Search size={16}/>{t('扭矩、spinFor…','torque, spinFor…')}<kbd>Ctrl K</kbd></button></section></div>
                    <footer className="page-footer"><span>V5 Atlas</span><span>{t('基于 VEX 官方 C++ API · 独立离线阅读器','Based on the official VEX C++ API · Independent offline reader')}</span></footer>
                  </>}

                  {page.kind==='updates'&&<><AutoUpdates state={autoUpdates} settings={settings} setSetting={changeSetting} t={t}/><DocumentationUpdates catalog={catalog} state={documentationUpdates} zh={zh} t={t} source={source}/></>}
                  {['library','favorites','history'].includes(page.kind) && <LibraryPage entries={entries} page={page} favorites={favorites} reads={reads} zh={zh} t={t} openDoc={openDoc} favorite={favorite} navigate={navigate} onClearHistory={()=>setReads([])} />}
                  {page.kind === 'doc' && <Reader key={catalog.snapshotId} entry={current} entries={entries} language={settings.language} zh={zh} t={t} favorites={favorites} favorite={favorite} openDoc={openDoc} anchor={page.anchor} navigate={navigate} notify={setToast} source={source} />}
                  {page.kind === 'settings' && <>
                    <PageHeading title={t('偏好设置','Preferences')}/>
                    <div className="settings-layout"><div>
                      <SettingsCard icon={<Languages size={20}/>} title={t('阅读语言','Reading language')} description={t('代码保持原文。','Code remains unchanged.')}>
                        <div className="option-group">{(['zh','en','dual'] as const).map((lang,i)=><button key={lang} aria-pressed={settings.language===lang} className={settings.language===lang?'selected':''} onClick={()=>changeSetting('language',lang)}>{[t('简体中文','简体中文'),'English',t('中英对照','Side by side')][i]}{settings.language===lang&&<Check size={16}/>}</button>)}</div>
                      </SettingsCard>
                      <SettingsCard icon={<Sun size={20}/>} title={t('外观','Appearance')}><div className="theme-options">{(['light','dark','system'] as const).map((theme,i)=><button key={theme} aria-pressed={settings.theme===theme} className={'theme-option '+(settings.theme===theme?'selected':'')} onClick={()=>changeSetting('theme',theme)}><span className={'theme-swatch '+theme}><i/><i/><i/></span><span>{[t('浅色','Light'),t('深色','Dark'),t('跟随系统','System')][i]}{settings.theme===theme&&<Check size={15}/>}</span></button>)}</div><AccentSettings settings={settings} preset={id=>changeSetting('accent',id)} custom={color=>setSettings(s=>({...s,accent:'custom',customColor:color}))} t={t}/></SettingsCard>
                      <SettingsCard icon={<BookOpen size={20}/>} title={t('阅读字号','Reading size')} description={t('正文大小，13–21 px。','Body text, 13–21 px.')}><div className="font-control"><button className="icon-button" aria-label={t('减小字号','Smaller text')} disabled={settings.fontSize<=13} onClick={()=>changeSetting('fontSize',settings.fontSize-1)}><Minus size={17}/></button><span>{settings.fontSize} px</span><button className="icon-button" aria-label={t('增大字号','Larger text')} disabled={settings.fontSize>=21} onClick={()=>changeSetting('fontSize',settings.fontSize+1)}><Plus size={17}/></button><span className="font-preview" style={{fontSize:settings.fontSize}}>{t('正文预览','Reading preview')}</span></div></SettingsCard>
                      <SettingsCard icon={<Sparkles size={20}/>} title={t('灵动动画','Expressive motion')} description={t('遵循系统的减少动态效果设置。','Respects the system’s reduced motion setting.')}><button className={'toggle '+(settings.motion?'on':'')} role="switch" aria-checked={settings.motion} aria-label={t('灵动动画','Expressive motion')} onClick={()=>changeSetting('motion',!settings.motion)}><span>{settings.motion&&<Check size={12}/>}</span></button></SettingsCard>
                    </div><aside className="about-panel"><h2>V5 Atlas<span>.</span></h2><div className="version-pill">v{appPackage.version}</div><dl><dt>{t('内容快照','Content snapshot')}</dt><dd>{catalog.snapshotDate}</dd><dt>{t('文档范围','Coverage')}</dt><dd>{entries.length} {t('篇 VEX V5 C++ 文档','VEX V5 C++ documents')}</dd><dt>{t('离线资源','Offline resources')}</dt><dd>{t('英文原文 · 中文译文 · 代码 · 配图','English · Chinese · Code · Images')}</dd></dl><div className="translation-note"><Languages size={18}/><p>{t('中文为辅助译文，API 行为以官方英文为准。','Chinese is a supporting translation. Refer to the official English for API behavior.')}</p></div><button className="text-button" onClick={()=>source('https://api.vex.com/v5/home/cpp/index.html')}>{t('访问官方参考','Official reference')}<ExternalLink size={15}/></button><p className="independent-note">{t('独立制作的离线阅读器，非 VEX Robotics 官方产品。官方文档、代码及配图的权利归原权利人所有。','An independent reader, not an official VEX Robotics product. Documentation, examples, and illustrations belong to their respective owners.')}</p></aside></div>
                  </>}
                  {page.kind==='glossary' && <><PageHeading title={t('中英术语表','Bilingual glossary')}/><div className="glossary-intro"><Languages size={23}/><p>{t('这些词在日常英语和编程语境中可能有不同含义。中文译文始终结合设备、单位和函数行为理解。','Everyday words can mean something different in programming. Read translations in the context of the device, unit, and function behavior.')}</p><span>{TERMS.length} {t('组核心术语','core terms')}</span></div><div className="glossary-grid">{TERMS.map(([en,cn,cnText,enText],i)=><article className="term-card" key={en}><span className="term-index">{String(i+1).padStart(2,'0')}</span><code>{en}</code><h3>{cn}</h3><p>{zh?cnText:enText}</p></article>)}</div></>}
                </motion.div>
              </AnimatePresence>}
          </main>
        </div>
      </div>
      <AnimatePresence>{searchOpen && <SearchDialog entries={entries} zh={zh} t={t} close={()=>setSearchOpen(false)} select={(id,anchor)=>{setSearchOpen(false);openDoc(id,anchor);}} />}</AnimatePresence>
      <AnimatePresence>{toast && <motion.div className="snackbar" role="status" initial={{opacity:0,y:30,scale:.95}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:20}}><Check size={17}/>{toast}<button aria-label={t('关闭提示','Dismiss')} onClick={()=>setToast('')}><X size={15}/></button></motion.div>}</AnimatePresence>
    </div>
  </MotionConfig>;
}

function PageHeading({title,description}:{title:string;description?:string}) {
  return <div className="page-heading"><h1>{title}</h1>{description&&<p>{description}</p>}</div>;
}
function SettingsCard({icon,title,description,children}:{icon:ReactNode;title:string;description?:string;children:ReactNode}) {
  return <section className="settings-card"><div className="settings-title"><span className="settings-icon">{icon}</span><div><h2>{title}</h2>{description&&<p>{description}</p>}</div></div>{children}</section>;
}

interface LibraryProps { entries:Entry[]; page:Page; favorites:string[]; reads:Read[]; zh:boolean; t:(a:string,b:string)=>string; openDoc:(id:string,anchor?:string)=>void; favorite:(id:string)=>void; navigate:(page:Page)=>void; onClearHistory:()=>void }
function LibraryPage({entries,page,favorites,reads,zh,t,openDoc,favorite,navigate,onClearHistory}:LibraryProps) {
  const [query,setQuery]=useState('');
  const [view,setView]=useState<'grid'|'list'>('grid');
  const group=page.kind!=='doc'?page.group:undefined;
  const filtered=useMemo(()=>{
    let result=entries;
    if (page.kind==='favorites') result=result.filter(e=>favorites.includes(e.id));
    if (page.kind==='history') result=reads.map(r=>entries.find(e=>e.id===r.id)).filter((e):e is Entry=>!!e);
    if (group) result=result.filter(e=>e.group===group || e.id===group);
    const words=query.toLowerCase().trim().split(/\s+/).filter(Boolean);
    if(words.length) result=result.filter(e=>words.every(q=>(e.title+' '+e.zhTitle+' '+e.id+' '+e.text+' '+e.zhText).toLowerCase().includes(q)));
    return result;
  },[entries,page.kind,group,favorites,reads,query]);
  const activeGroup=group?groupFor(group):null;
  const heading=page.kind==='favorites'?t('我的收藏','Bookmarks'):page.kind==='history'?t('最近阅读','Reading history'):activeGroup?t(activeGroup.zh,activeGroup.en):t('API 文档库','API library');
  return <>
    <PageHeading title={heading}/>
    {page.kind==='library' && <div className="filter-chips"><button onClick={()=>navigate({kind:'library'})} className={!group?'selected':''}>{!group&&<Check size={14}/>} {t('全部','All')}<span>{entries.length}</span></button>{GROUPS.filter(g=>g.id!=='Essentials').map(g=><button key={g.id} className={group===g.id?'selected':''} onClick={()=>navigate({kind:'library',group:g.id})}>{group===g.id&&<Check size={14}/>} {t(g.zh,g.en)}</button>)}</div>}
    <div className="library-toolbar"><div className="library-search"><Search size={18}/><input value={query} onChange={e=>setQuery(e.target.value)} aria-label={t('筛选文档','Filter documents')} placeholder={t('按设备、函数或关键词筛选…','Filter by device, function, or keyword…')}/>{query&&<button aria-label={t('清空筛选','Clear filter')} onClick={()=>setQuery('')}><X size={15}/></button>}</div><span className="results-count">{filtered.length} {t('篇文档','documents')}</span>{page.kind==='history'&&reads.length>0&&<button className="text-button small" onClick={onClearHistory}><Trash2 size={15}/>{t('清空记录','Clear history')}</button>}<div className="view-toggle"><button aria-label={t('网格视图','Grid view')} aria-pressed={view==='grid'} className={view==='grid'?'selected':''} onClick={()=>setView('grid')}><Grid2X2 size={17}/></button><button aria-label={t('列表视图','List view')} aria-pressed={view==='list'} className={view==='list'?'selected':''} onClick={()=>setView('list')}><List size={19}/></button></div></div>
    <div className={'document-grid '+view}>{filtered.map(entry=>{const g=groupFor(entry.group==='Essentials'?entry.id:entry.group);return <motion.article layout="position" transition={{duration:.2}} className="document-card" key={entry.id}><button className="document-open" onClick={()=>openDoc(entry.id)}><div className="document-top"><span className={'small-icon '+g.color}><g.icon size={21}/></span><span className="document-language">C++</span></div><h2>{zh?entry.zhTitle:entry.title}</h2><code>{entry.title}</code><p>{zh?entry.zhIntro:entry.intro}</p><div className="document-bottom"><span>{t(g.zh,g.en)}</span><ArrowUpRight size={17}/></div></button><button className={'bookmark-button '+(favorites.includes(entry.id)?'saved':'')} aria-label={favorites.includes(entry.id)?t('取消收藏','Remove bookmark'):t('收藏文档','Bookmark document')} aria-pressed={favorites.includes(entry.id)} onClick={()=>favorite(entry.id)}><Bookmark size={18} fill={favorites.includes(entry.id)?'currentColor':'none'}/></button></motion.article>;})}</div>
    {filtered.length===0&&<div className="empty-state"><span className="empty-art">{query?<Search size={35}/>:page.kind==='favorites'?<Bookmark size={35}/>:<Clock3 size={35}/>}</span><h2>{query?t('暂时没有找到','No matches yet'):page.kind==='favorites'?t('暂无收藏','No bookmarks'):t('暂无阅读记录','No recent reading')}</h2><p>{query?t('试试更短的关键词，或直接搜索英文函数名。','Try a shorter keyword or an English function name.'):t('阅读文档时点击收藏图标，或从文档库开启一次探索。','Bookmark a page as you read, or explore the library.')}</p><button className="primary-button" onClick={()=>query?setQuery(''):navigate({kind:'library'})}>{query?t('清除筛选','Clear filter'):t('探索文档库','Explore the library')}<ArrowRight size={16}/></button></div>}
  </>;
}

interface ReaderProps {entry:Entry|undefined;entries:Entry[];language:Settings['language'];zh:boolean;t:(a:string,b:string)=>string;favorites:string[];favorite:(id:string)=>void;openDoc:(id:string,anchor?:string)=>void;anchor?:string;navigate:(page:Page)=>void;notify:(message:string)=>void;source:(url:string)=>void}
function Reader({entry,entries,language,zh,t,favorites,favorite,openDoc,anchor,navigate,notify,source}:ReaderProps) {
  const [doc,setDoc]=useState<Doc|null>(null);
  const [error,setError]=useState(false);
  const [tocOpen,setTocOpen]=useState(false);
  const [retry,setRetry]=useState(0);
  const [active,setActive]=useState('');
  const contentRef=useRef<HTMLDivElement>(null);
  const scrollTo = useCallback((id:string) => { contentRef.current?.querySelector(`[data-anchor="${CSS.escape(id)}"]`)?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'}); setActive(id);setTocOpen(false); },[]);
  useEffect(()=>{
    if(!entry)return;
    setError(false);setDoc(null);
    const controller=new AbortController();
    fetch('./docs/'+entry.key+'.json',{cache:'no-store',signal:controller.signal}).then(r=>{if(!r.ok)throw Error();return r.json();}).then(setDoc).catch(e=>{if(e.name!=='AbortError')setError(true);});
    return()=>controller.abort();
  },[entry?.key,retry]);
  useEffect(()=>{
    if(!doc||!contentRef.current)return;
    const root=contentRef.current;
    root.querySelectorAll('pre').forEach(pre=>{
      const code=pre.querySelector('code');
      if(code&&!code.classList.contains('highlighted')) {code.innerHTML=Prism.highlight(code.textContent??'',Prism.languages.cpp,'cpp');code.classList.add('highlighted');}
      if(!pre.querySelector('.copy-code')){
        const button=document.createElement('button');button.className='copy-code';button.setAttribute('aria-label',t('复制代码','Copy code'));button.innerHTML='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="8" y="8" width="12" height="13" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/></svg><span>'+t('复制','Copy')+'</span>';
        button.onclick=async()=>{try{await navigator.clipboard.writeText(code?.textContent??'');notify(t('代码已复制','Code copied to clipboard'));}catch{notify(t('无法复制，请选中代码手动复制','Could not copy. Select the code and copy manually.'));}};
        pre.appendChild(button);
      }
    });
    const observer=new IntersectionObserver(items=>{
      const visible=items.filter(i=>i.isIntersecting).sort((a,b)=>a.boundingClientRect.top-b.boundingClientRect.top);
      if(visible[0])setActive(visible[0].target.getAttribute('data-anchor')??'');
    },{root:document.querySelector('.main-scroll'),rootMargin:'-12% 0px -66% 0px',threshold:0});
    root.querySelectorAll('[data-anchor]').forEach(h=>observer.observe(h));
    if(anchor)requestAnimationFrame(()=>scrollTo(anchor));
    return()=>observer.disconnect();
  },[doc,language,anchor,notify,scrollTo,t]);
  useEffect(()=>{
    if(language!=='dual'||!contentRef.current||!doc)return;
    const root=contentRef.current;
    const sync=()=>{
      const groups=new Map<string,HTMLElement[]>();
      root.querySelectorAll<HTMLElement>('.doc-section').forEach(section=>{
        const key=section.dataset.pair??'';const arr=groups.get(key)??[];arr.push(section);groups.set(key,arr);
      });
      groups.forEach(sections=>{
        const height=Math.max(...sections.map(s=>s.firstElementChild?.getBoundingClientRect().height??0));
        sections.forEach(s=>{s.style.minHeight=innerWidth>580?Math.ceil(height)+'px':'';});
      });
    };
    const observer=new ResizeObserver(sync);
    root.querySelectorAll('.doc-section-content').forEach(el=>observer.observe(el));
    sync();return()=>observer.disconnect();
  },[doc,language]);
  const prepared=useMemo(()=>{
    if(!doc)return null;
    const prepare=(html:string,prefix:string)=>{
      const el=document.createElement('div');el.innerHTML=html;
      el.querySelector('h1')?.remove();
      el.querySelectorAll('[id]').forEach(h=>{const id=h.id;h.setAttribute('data-anchor',id);h.id=prefix+'-'+id;});
      el.querySelectorAll('table').forEach(table=>{const wrapper=document.createElement('div');wrapper.className='table-scroll';table.replaceWith(wrapper);wrapper.append(table);});
      const chunks:{key:string;nodes:Node[]}[]=[];let chunk={key:'preface',nodes:[] as Node[]};
      Array.from(el.childNodes).forEach(node=>{
        if(node instanceof HTMLElement&&/^H[23]$/.test(node.tagName)){
          if(chunk.nodes.length)chunks.push(chunk);
          chunk={key:node.dataset.anchor??'preface',nodes:[]};
        }
        chunk.nodes.push(node);
      });
      if(chunk.nodes.length)chunks.push(chunk);
      el.innerHTML='';chunks.forEach(chunk=>{
        const section=document.createElement('div');section.className='doc-section';section.dataset.pair=chunk.key;
        const content=document.createElement('div');content.className='doc-section-content';chunk.nodes.forEach(n=>content.append(n));section.append(content);el.append(section);
      });
      return el.innerHTML;
    };
    return {en:prepare(doc.en,'en'),zh:prepare(doc.zh,'zh')};
  },[doc]);
  if(!entry)return <div className="empty-state"><CircleHelp size={40}/><h2>{t('这篇文档不在当前快照中','This page is not in this snapshot')}</h2><button className="primary-button" onClick={()=>navigate({kind:'library'})}>{t('返回文档库','Back to library')}</button></div>;
  const group=groupFor(entry.group==='Essentials'?entry.id:entry.group);
  const sameGroup=entries.filter(e=>e.group===entry.group&&e.id!==entry.id).slice(0,3);
  const handleContentClick=(e:React.MouseEvent)=>{
    const a=(e.target as HTMLElement).closest('a');if(!a)return;
    e.preventDefault();const href=a.getAttribute('href')??'';
    if(href.startsWith('#doc/')){const[id,section]=href.slice(5).split('#');openDoc(id,section);}
    else if(href.startsWith('#'))scrollTo(href.slice(1));
    else if(href.startsWith('https://'))source(href);
  };
  const toc=doc?.headings.filter(h=>h.level===2 || h.level===3)??[];
  return <>
    <div className="reader-top"><button className="text-button small" onClick={()=>navigate({kind:'library',group:group.id})}><ArrowLeft size={16}/>{t(group.zh,group.en)}</button><div className="reader-tools"><span className="snapshot-chip">C++ · {t('离线参考','OFFLINE REFERENCE')}</span><button className="icon-button" onClick={()=>favorite(entry.id)} aria-label={favorites.includes(entry.id)?t('取消收藏','Remove bookmark'):t('收藏文档','Bookmark document')} aria-pressed={favorites.includes(entry.id)}><Bookmark size={19} fill={favorites.includes(entry.id)?'currentColor':'none'}/></button><button className="icon-button" onClick={()=>source(entry.source)} aria-label={t('打开官方原文（需要网络）','Open official source (requires internet)')}><ExternalLink size={18}/></button><button className="icon-button toc-toggle" onClick={()=>setTocOpen(v=>!v)} aria-label={t('本页目录','On this page')}><List size={20}/></button></div></div>
    <div className="reader-heading"><span className={'reader-device-icon '+group.color}><group.icon size={28}/></span><div><span className="hero-kicker">VEX V5 · C++ API</span><h1>{zh?entry.zhTitle:entry.title}<span>{zh?entry.title:entry.zhTitle}</span></h1></div></div>
    <div className="reader-meta"><span><Globe2 size={14}/>{t('英文原文与中文译文均已收录','English & Chinese included offline')}</span><span><ShieldCheck size={14}/>{t('代码标识符保持原文','Original code identifiers')}</span>{language==='dual'&&<span className="dual-badge"><Languages size={13}/>{t('中英对照模式','Bilingual view')}</span>}</div>
    <div className={'reader-layout '+(language==='dual'?'dual-layout':'')}>
      <div className="reader-main">
        {error?<div className="empty-state"><h2>{t('读取文档时遇到问题','Could not open this document')}</h2><button className="primary-button" onClick={()=>setRetry(r=>r+1)}>{t('重新读取','Try again')}</button></div>:!prepared?<div className="loading-state"><div className="morph-loader"/></div>:
          <div ref={contentRef} className={'doc-columns '+(language==='dual'?'dual':'')} onClick={handleContentClick}>
            {language!=='en'&&<section className="doc-column"><div className="column-label"><span>简体中文</span><span>{t('参考译文','REFERENCE TRANSLATION')}</span></div><article lang="zh-CN" className="doc-content" dangerouslySetInnerHTML={{__html:prepared.zh}}/></section>}
            {language!=='zh'&&<section className="doc-column"><div className="column-label"><span>English</span><span>OFFICIAL REFERENCE</span></div><article lang="en" className="doc-content" dangerouslySetInnerHTML={{__html:prepared.en}}/></section>}
          </div>}
        <div className="reader-source-note"><ShieldCheck size={19}/><div><strong>{t('可核对的文档来源','A traceable source')}</strong><p>{t('内容来自 VEX 官方 C++ API。中文为机器辅助、术语统一及重点校订的参考译文；如有歧义，可切换英文或中英对照核对。','Content comes from the official VEX C++ API. Chinese is a machine-assisted reference translation with terminology and targeted editorial corrections. Compare with English whenever meaning is uncertain.')}</p><code>SHA-256 · {entry.sha256.slice(0,20)}…</code></div></div>
        {sameGroup.length>0&&<div className="related-docs"><h2>{t('继续探索','Keep exploring')}</h2>{sameGroup.map(e=><button key={e.id} onClick={()=>openDoc(e.id)}><FileCode2 size={17}/>{zh?e.zhTitle:e.title}<ArrowRight size={16}/></button>)}</div>}
      </div>
      <aside className={'page-toc '+(tocOpen?'open':'')}><div className="toc-heading">{t('本页目录','ON THIS PAGE')}<button className="icon-button" aria-label={t('关闭目录','Close outline')} onClick={()=>setTocOpen(false)}><X size={16}/></button></div><nav>{toc.map(h=><button key={h.id} className={(h.level===3?'nested ':'')+(active===h.id?'active':'')} onClick={()=>scrollTo(h.id)}>{zh?h.zh:h.en}</button>)}</nav><button className="toc-top" onClick={()=>document.querySelector('.main-scroll')?.scrollTo({top:0,behavior:'smooth'})}>{t('回到顶部','Back to top')}<ArrowDown size={14} style={{transform:'rotate(180deg)'}}/></button></aside>
    </div>
  </>;
}

function SearchDialog({entries,zh,t,close,select}:{entries:Entry[];zh:boolean;t:(a:string,b:string)=>string;close:()=>void;select:(id:string,anchor?:string)=>void}) {
  const [query,setQuery]=useState('');const deferred=useDeferredValue(query);
  const [mode,setMode]=useState<'all'|'docs'|'methods'>('all');const [active,setActive]=useState(0);
  const listRef=useRef<HTMLDivElement>(null);
  const results=useMemo(()=>{
    const words=deferred.trim().toLowerCase().split(/\s+/).filter(Boolean);
    if(!words.length)return[];
    return entries.flatMap(entry=>{
      const hay=(entry.title+' '+entry.zhTitle+' '+entry.text+' '+entry.zhText).toLowerCase();
      if(!words.every(w=>hay.includes(w)))return[];
      const heading=entry.headings.find(h=>words.some(w=>(h.en+' '+h.zh).toLowerCase().includes(w))&&h.level>=2);
      const titleMatch=words.some(w=>(entry.title+' '+entry.zhTitle).toLowerCase().includes(w));
      if(mode==='docs'&&!titleMatch)return[];
      if(mode==='methods'&&!heading)return[];
      const text=zh?entry.zhText:entry.text;
      let index=text.toLowerCase().indexOf(words[0]); if(index<0)index=0;
      const snippet=(index>30?'…':'')+text.slice(Math.max(0,index-28),index+140)+(text.length>index+140?'…':'');
      return[{entry,heading:titleMatch?undefined:heading,snippet,score:(titleMatch?100:0)+(heading?40:0)+(entry.title.toLowerCase()===deferred.toLowerCase()?100:0)}];
    }).sort((a,b)=>b.score-a.score).slice(0,50);
  },[entries,deferred,mode,zh]);
  useEffect(()=>setActive(0),[deferred,mode]);
  useEffect(()=>{listRef.current?.querySelector('[data-active="true"]')?.scrollIntoView({block:'nearest'});},[active]);
  return <motion.div className="modal-backdrop" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onMouseDown={e=>{if(e.target===e.currentTarget)close();}}>
    <motion.section className="search-dialog" role="dialog" aria-modal="true" aria-label={t('全文搜索','Full-text search')} initial={{opacity:0,y:25,scale:.97}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:15,scale:.98}} onKeyDown={e=>{
      if(e.key==='ArrowDown'){e.preventDefault();setActive(v=>Math.min(v+1,results.length-1));}
      if(e.key==='ArrowUp'){e.preventDefault();setActive(v=>Math.max(0,v-1));}
      if(e.key==='Enter'&&results[active]){e.preventDefault();select(results[active].entry.id,results[active].heading?.id);}
      if(e.key==='Tab') { const focusable=Array.from(e.currentTarget.querySelectorAll<HTMLElement>('button,input')).filter(el=>!el.hasAttribute('disabled')); const first=focusable[0],last=focusable[focusable.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus();} }
    }}>
      <div className="search-input-wrap"><Search size={25}/><input autoFocus value={query} onChange={e=>setQuery(e.target.value)} placeholder={t('你的下一条线索是…','What are you curious about?')} aria-label={t('搜索 API','Search APIs')}/>{query&&<button className="icon-button" aria-label={t('清空搜索','Clear search')} onClick={()=>setQuery('')}><X size={18}/></button>}<button className="esc-button" onClick={close}>ESC</button></div>
      <div className="search-tabs">{(['all','docs','methods'] as const).map((m,i)=><button key={m} className={mode===m?'selected':''} onClick={()=>setMode(m)}>{[t('全部内容','Everything'),t('设备与文档','Devices & pages'),t('函数与章节','Functions & sections')][i]}</button>)}<span>{t('本地全文搜索','LOCAL SEARCH')}<WifiOff size={13}/></span></div>
      <div className="search-results" ref={listRef}>
        {!query.trim()?<div className="search-start"><span className="search-start-symbol">✳</span><h3>{t('每个好问题，都值得探索。','A good question deserves an answer.')}</h3><p>{t('搜索英文函数名或中文关键词，例如：','Try an English function name or a Chinese keyword:')}</p><div className="search-suggestions">{['spinFor','扭矩','waitForCompletion','GPS'].map(q=><button key={q} onClick={()=>setQuery(q)}><Search size={13}/>{q}</button>)}</div><span className="search-privacy"><ShieldCheck size={14}/>{t('搜索在本机完成，无需网络。','Your search stays on this device. No network needed.')}</span></div>:
          results.length?<><div className="search-count">{results.length} {t('个相关结果','matching pages')}</div>{results.map((r,i)=><button key={r.entry.id} className={'search-result '+(active===i?'active':'')} data-active={active===i} onMouseEnter={()=>setActive(i)} onClick={()=>select(r.entry.id,r.heading?.id)}><span className={'small-icon '+groupFor(r.entry.group).color}>{r.heading?<Code2 size={20}/>:<FileCode2 size={20}/>}</span><div><strong>{zh?r.entry.zhTitle:r.entry.title}{r.heading&&<><ChevronRight size={13}/><code>{r.heading.en}</code></>}</strong><span>{r.snippet}</span></div>{active===i?<kbd>↵</kbd>:<ArrowUpRight size={16}/>}</button>)}</>:<div className="search-no-results"><Search size={30}/><h3>{t('还没有找到这条线索','No matching references')}</h3><p>{t('试试更短的关键词，或检查函数名的拼写。','Try a shorter keyword or check the function name.')}</p></div>}
      </div>
      <div className="search-footer"><span><kbd>↑</kbd><kbd>↓</kbd>{t('选择','navigate')}<kbd>↵</kbd>{t('打开','open')}<kbd>esc</kbd>{t('关闭','close')}</span><span>V5 ATLAS <i>✳</i></span></div>
    </motion.section>
  </motion.div>;
}
