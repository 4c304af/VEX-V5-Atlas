import {useEffect,useMemo,useState} from 'react';
import {ArrowLeft,ArrowUpRight,BookOpen,Bookmark,Search,ShieldCheck,Trophy,Image,RefreshCw} from 'lucide-react';
import {motion} from 'motion/react';
import type {Language} from './types';
import './rules.css';
interface Rule {id:string;group:string;code:string;title:string;zhTitle:string;summary:string;pages:number[];blocks:{en:string;page:number}[]}
interface Manual {season:string;game:string;version:string;released:string;source:string;sha256:string;translation:string;pageCount:number;groups:{id:string;zh:string;en:string}[];documents:Rule[]}
export default function CompetitionRules({language,id,select,source}:{language:Language;id?:string;select:(id?:string)=>void;source:(url:string)=>void}) {
  const [manual,setManual]=useState<Manual|null>(null),[error,setError]=useState(false),[retry,setRetry]=useState(0);
  const [group,setGroup]=useState('all'),[query,setQuery]=useState(''),[figures,setFigures]=useState(false);
  const [saved,setSaved]=useState<string[]>(()=>{try{return JSON.parse(localStorage.getItem('atlas:rule-bookmarks')??'[]');}catch{return [];}});
  const zh=language!=='en',t=(cn:string,en:string)=>zh?cn:en;
  useEffect(()=>{const c=new AbortController();setError(false);fetch('./rules/catalog.json',{signal:c.signal}).then(r=>{if(!r.ok)throw Error();return r.json();}).then(setManual).catch(e=>{if(e.name!=='AbortError')setError(true);});return()=>c.abort();},[retry]);
  useEffect(()=>{try{localStorage.setItem('atlas:rule-bookmarks',JSON.stringify(saved));}catch{}},[saved]);
  useEffect(()=>{setFigures(false);document.querySelector('.main-scroll')?.scrollTo({top:0});},[id]);
  const results=useMemo(()=>manual?.documents.filter(d=>(group==='all'||group==='saved'&&saved.includes(d.id)||group===d.group)&&query.toLowerCase().split(/\s+/).every(word=>(d.code+' '+d.title+' '+d.zhTitle+' '+d.summary+' '+d.blocks.map(b=>b.en).join(' ')).toLowerCase().includes(word)))??[],[manual,query,group,saved]);
  if(error)return <div className="empty-state"><BookOpen size={38}/><h2>{t('赛事规则暂时无法读取','Competition rules could not be loaded')}</h2><button className="primary-button" onClick={()=>setRetry(n=>n+1)}><RefreshCw size={16}/>{t('重试','Try again')}</button></div>;
  if(!manual)return <div className="empty-state" role="status">{t('正在打开离线规则…','Opening offline rules…')}</div>;
  const current=manual.documents.find(d=>d.id===id);
  const bookmark=(rule:Rule)=>setSaved(old=>old.includes(rule.id)?old.filter(x=>x!==rule.id):[...old,rule.id]);
  if(id&&!current)return <div className="empty-state"><h2>{t('未找到这条规则','Rule not found')}</h2><button className="primary-button" onClick={()=>select()}>{t('返回规则分区','Back to rules')}</button></div>;
  return <>
    {current?<>
      <div className="rule-reader-tools"><button className="text-button" onClick={()=>select()}><ArrowLeft size={16}/>{t('赛事规则','Competition rules')}</button><span>OVERRIDE · v{manual.version} · {current.code||t('章节','SECTION')}</span><button className="icon-button" aria-label={t('收藏规则','Bookmark rule')} aria-pressed={saved.includes(current.id)} onClick={()=>bookmark(current)}><Bookmark size={19} fill={saved.includes(current.id)?'currentColor':'none'}/></button></div>
      <div className="page-heading"><div className="hero-kicker">{manual.groups.find(g=>g.id===current.group)?.[zh?'zh':'en']}</div><h1>{current.code&&<code>{current.code} · </code>}{zh?current.zhTitle:current.title}</h1><p>{manual.season} · Override · v{manual.version} · {t('PDF 页码','PDF pages')} {current.pages[0]}–{current.pages.at(-1)}</p></div>
      <div className="rules-notice"><ShieldCheck size={18}/><p>{t(manual.translation,'Chinese clause summaries written by Codex, not a full translation. Read the English clauses, violation notes and original pages for details. Live Q&A is not included.')} {t('下方原页保留图表与原始排版。','Original pages below retain figures, tables and layout.')}</p></div>
      <div className={'rule-columns '+(language==='dual'?'dual':'')}>
        {(language==='dual'?['zh','en'] as const:[zh?'zh':'en'] as const).map(lang=><article key={lang} lang={lang==='zh'?'zh-CN':'en'} className="rule-text"><div className="rule-column-label">{lang==='zh'?'中文条款要点译解':'ENGLISH ORIGINAL'}</div>{lang==='zh'?<p>{current.summary}</p>:current.blocks.map((b,i)=><p key={i} data-page={b.page}>{b.en}</p>)}</article>)}
      </div>
      <div className="rule-reader-tools"><button className="primary-button" aria-expanded={figures} onClick={()=>setFigures(v=>!v)}><Image size={17}/>{figures?t('收起官方原页','Hide original pages'):t('查看官方原页与配图','View original pages & figures')}</button><button className="text-button" onClick={()=>source(manual.source)}>{t('官方手册','Official manual')}<ArrowUpRight size={16}/></button></div>
      {figures&&<div className="rule-original-pages">{current.pages.map(p=><figure key={p}><img src={'./rules/pages/'+p+'.jpg'} loading="lazy" alt={t(`官方手册 PDF 第 ${p} 页`,`Official manual PDF page ${p}`)}/><figcaption>PDF · {p} / {manual.pageCount}</figcaption></figure>)}</div>}
      <div className="rule-reader-tools">{[-1,1].map(step=>{const next=manual.documents[manual.documents.indexOf(current)+step];return next&&<button key={step} className="text-button" onClick={()=>select(next.id)}>{step<0?'←':'→'} {next.code||t('相邻章节','Adjacent section')} · {zh?next.zhTitle:next.title}</button>;})}</div>
    </>:<>
      <motion.section className="rules-hero" initial={{opacity:0,y:12}} animate={{opacity:1,y:0}}><div><div className="hero-kicker">COMPETITION FIELD GUIDE</div><h1>{t('读懂规则，再上赛场。','Know the rules. Own your game.')}</h1><p>{manual.season} VEX V5 · Override · v{manual.version}</p><span>{t('按章节探索，按规则编号定位，中英随时对照。','Explore by section, find a rule by number, and compare both languages.')}</span></div><Trophy size={68} strokeWidth={1.2}/></motion.section>
      <div className="rules-notice"><ShieldCheck size={18}/><p>{t(manual.translation,'Unofficial Chinese clause summaries written by Codex. Read the English manual for full clauses; official Q&A governs.')} · {t('手册发布日期','Manual released')} {manual.released} · {t('离线快照，不含实时 Q&A','Offline snapshot; live Q&A is not included')}</p></div>
      <div className="rules-search"><Search size={19}/><input aria-label={t('搜索赛事规则','Search competition rules')} value={query} onChange={e=>setQuery(e.target.value)} placeholder={t('搜索 SG1、检录、自动阶段…','Search SG1, inspection, autonomous…')}/><span>{results.length} {t('项','entries')}</span></div>
      <div className="filter-chips rule-groups">{[{id:'all',zh:'全部章节',en:'All sections'},{id:'saved',zh:'规则收藏',en:'Bookmarks'},...manual.groups].map(g=><button key={g.id} aria-pressed={group===g.id} className={group===g.id?'selected':''} onClick={()=>setGroup(g.id)}>{zh?g.zh:g.en}</button>)}</div>
      <div className="rules-grid">{results.map(rule=><button key={rule.id} className="rule-card" onClick={()=>select(rule.id)}><span className="rule-card-code">{rule.code||'§'}</span><span><small>{manual.groups.find(g=>g.id===rule.group)?.[zh?'zh':'en']}</small><h2>{zh?rule.zhTitle:rule.title}</h2><p>PDF {rule.pages[0]}–{rule.pages.at(-1)} · {t('中 / EN','ZH / EN')}</p></span><ArrowUpRight size={17}/></button>)}</div>
      {!results.length&&<div className="empty-state"><Search size={30}/><h2>{t('没有匹配的规则','No matching rules')}</h2><button className="text-button" onClick={()=>{setGroup('all');setQuery('');}}>{t('清除筛选','Clear filters')}</button></div>}
    </>}
  </>;
}
