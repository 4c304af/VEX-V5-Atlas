import {useEffect,useMemo,useState} from 'react';
import {ArrowLeft,ArrowUpRight,BookOpen,Bookmark,ChevronRight,Search,ShieldCheck,Trophy,Image,RefreshCw} from 'lucide-react';
import {motion} from 'motion/react';
import type {Language} from './types';
import './rules.css';
interface Rule {id:string;group:string;code:string;title:string;zhTitle:string;summary:string;pages:number[];blocks:{en:string;page:number}[]}
interface Manual {season:string;game:string;version:string;released:string;source:string;sha256:string;translation:string;pageCount:number;groups:{id:string;zh:string;en:string}[];documents:Rule[]}
const categories:Record<string,[string,string]>={SC:['得分判定','Scoring'],SG:['比赛专项规则','Specific game rules'],S:['安全规则','Safety rules'],G:['通用规则','General rules'],GG:['比赛通用规则','General game rules'],RSC:['技能赛规则','Skills rules'],R:['机器人与检录规则','Robot and inspection rules'],VUG:['大学组比赛规则','VEX U game rules'],VURS:['大学组技能赛','VEX U skills'],VUT:['大学组赛事组织','VEX U tournament'],VUR:['大学组机器人','VEX U robots'],VAISC:['AI 得分判定','VEX AI scoring'],VAIG:['AI 比赛规则','VEX AI game rules'],VAIRS:['AI 技能赛','VEX AI skills'],VAIT:['AI 赛事组织','VEX AI tournament'],VAIRM:['AI 机器人','VEX AI robots'],T:['赛事组织规则','Tournament rules']};
const prefix=(rule:Rule)=>rule.code.replace(/\d+$/,'');
const sectionId=(group:string,category?:string)=>'section-'+group+(category?'~'+category:'');
export default function CompetitionRules({language,id,select,source}:{language:Language;id?:string;select:(id?:string)=>void;source:(url:string)=>void}) {
  const [manual,setManual]=useState<Manual|null>(null),[error,setError]=useState(false),[retry,setRetry]=useState(0);
  const [query,setQuery]=useState(''),[figures,setFigures]=useState(false);
  const [saved,setSaved]=useState<string[]>(()=>{try{const value=JSON.parse(localStorage.getItem('atlas:rule-bookmarks')??'[]');return Array.isArray(value)?value:[];}catch{return [];}});
  const zh=language!=='en',t=(cn:string,en:string)=>zh?cn:en;
  const [groupId,category]=id?.startsWith('section-')?id.slice(8).split('~'):[];
  const current=manual?.documents.find(d=>d.id===id);
  const activeGroup=manual?.groups.find(g=>g.id===(current?.group??groupId));
  const documents=useMemo(()=>manual?.documents.filter(d=>d.group===activeGroup?.id)??[],[manual,activeGroup]);
  const overview=documents.find(d=>!d.code);
  const sections=[...new Set(documents.filter(d=>d.code).map(prefix))];
  const results=useMemo(()=>manual?.documents.filter(d=>(id==='saved'?saved.includes(d.id):!groupId||d.group===groupId)&&(!category||prefix(d)===category)&&query.toLowerCase().split(/\s+/).every(word=>(d.code+' '+d.title+' '+d.zhTitle+' '+d.summary+' '+d.blocks.map(b=>b.en).join(' ')).toLowerCase().includes(word)))??[],[manual,query,groupId,category,id,saved]);
  useEffect(()=>{const c=new AbortController();setError(false);fetch('./rules/catalog.json',{signal:c.signal}).then(r=>{if(!r.ok)throw Error();return r.json();}).then(setManual).catch(e=>{if(e.name!=='AbortError')setError(true);});return()=>c.abort();},[retry]);
  useEffect(()=>{try{localStorage.setItem('atlas:rule-bookmarks',JSON.stringify(saved));}catch{}},[saved]);
  useEffect(()=>{setFigures(false);setQuery('');document.querySelector('.main-scroll')?.scrollTo({top:0});},[id]);
  if(error)return <div className="empty-state"><BookOpen size={38}/><h2>{t('赛事规则暂时无法读取','Competition rules could not be loaded')}</h2><button className="primary-button" onClick={()=>setRetry(n=>n+1)}><RefreshCw size={16}/>{t('重试','Try again')}</button></div>;
  if(!manual)return <div className="empty-state" role="status">{t('正在打开离线规则…','Opening offline rules…')}</div>;
  const bookmark=(rule:Rule)=>setSaved(old=>old.includes(rule.id)?old.filter(x=>x!==rule.id):[...old,rule.id]);
  const categoryName=(key:string)=>categories[key]?.[zh?0:1]??key;
  const card=(rule:Rule)=><button key={rule.id} className="rule-card" onClick={()=>select(rule.id)}><span className="rule-card-code">{rule.code||'§'}</span><span><small>{manual.groups.find(g=>g.id===rule.group)?.[zh?'zh':'en']}</small><h2>{zh?rule.zhTitle:rule.title}</h2><p>PDF {rule.pages[0]}–{rule.pages.at(-1)}</p></span><ChevronRight size={17}/></button>;
  const invalid=id&&!current&&id!=='saved'&&(!activeGroup||category&&!sections.includes(category));
  if(invalid)return <div className="empty-state"><h2>{t('未找到这个规则分区','Rules section not found')}</h2><button className="primary-button" onClick={()=>select()}>{t('返回规则分区','Back to rules')}</button></div>;
  return <>
    <nav className="rules-breadcrumb" aria-label={t('规则导航','Rule navigation')}><button onClick={()=>select()} aria-current={!id?'page':undefined}>{t('赛事规则','Competition rules')}</button>{activeGroup&&<><ChevronRight size={14}/><button onClick={()=>select(sectionId(activeGroup.id))} aria-current={groupId&&!category?'page':undefined}>{zh?activeGroup.zh:activeGroup.en}</button></>}{(category||current?.code)&&<><ChevronRight size={14}/><button onClick={()=>select(sectionId(activeGroup!.id,category||prefix(current!)))} aria-current={category?'page':undefined}>{categoryName(category||prefix(current!))}</button></>}{current&&<><ChevronRight size={14}/><span aria-current="page">{current.code||t('章节导读','Overview')}</span></>}{!id&&<button className="rules-bookmarks" onClick={()=>select('saved')}><Bookmark size={15}/>{t('规则收藏','Bookmarks')} · {saved.length}</button>}</nav>
    <div className={'rules-workspace '+(!id?'rules-home':'')}>
      {id&&<nav className="rule-section-nav" aria-label={t('赛事规则分区','Competition rule sections')}>
        <button className={!id?'selected':''} onClick={()=>select()}><BookOpen size={16}/>{t('全部分区','All sections')}</button>
        {manual.groups.map(g=><div key={g.id}><button className={activeGroup?.id===g.id?'selected':''} aria-current={groupId===g.id&&!category?'page':undefined} onClick={()=>select(sectionId(g.id))}>{zh?g.zh:g.en}<ChevronRight size={14}/></button>{activeGroup?.id===g.id&&sections.map(key=><button key={key} className={'rule-subnav '+((category||current&&prefix(current))===key?'selected':'')} aria-current={category===key?'page':undefined} onClick={()=>select(sectionId(g.id,key))}><code>{key}</code>{categoryName(key)}</button>)}</div>)}
        <button className={id==='saved'?'selected':''} onClick={()=>select('saved')}><Bookmark size={16}/>{t('规则收藏','Bookmarks')}<small>{saved.length}</small></button>
      </nav>}
      <div className="rules-main">
    {current?<>
      <div className="rule-reader-tools"><button className="text-button" onClick={()=>select(sectionId(current.group,current.code?prefix(current):undefined))}><ArrowLeft size={16}/>{t('返回所属分区','Back to section')}</button><span>OVERRIDE · v{manual.version} · {current.code||t('章节','SECTION')}</span><button className="icon-button" aria-label={t('收藏规则','Bookmark rule')} aria-pressed={saved.includes(current.id)} onClick={()=>bookmark(current)}><Bookmark size={19} fill={saved.includes(current.id)?'currentColor':'none'}/></button></div>
      <div className="page-heading"><div className="hero-kicker">{activeGroup?.[zh?'zh':'en']}</div><h1>{current.code&&<code>{current.code} · </code>}{zh?current.zhTitle:current.title}</h1><p>{manual.season} · Override · v{manual.version} · {t('PDF 页码','PDF pages')} {current.pages[0]}–{current.pages.at(-1)}</p></div>
      <div className="rules-notice"><ShieldCheck size={18}/><p>{t(manual.translation,'Chinese clause summaries written by Codex, not a full translation. Read the English clauses, violation notes and original pages for details. Live Q&A is not included.')}</p></div>
      <div className={'rule-columns '+(language==='dual'?'dual':'')}>
        {(language==='dual'?['zh','en'] as const:[zh?'zh':'en'] as const).map(lang=><article key={lang} lang={lang==='zh'?'zh-CN':'en'} className="rule-text"><div className="rule-column-label">{lang==='zh'?'中文条款要点译解':'ENGLISH ORIGINAL'}</div>{lang==='zh'?<p>{current.summary}</p>:current.blocks.map((b,i)=><p key={i} data-page={b.page}>{b.en}</p>)}</article>)}
      </div>
      <div className="rule-reader-tools"><button className="primary-button" aria-expanded={figures} onClick={()=>setFigures(v=>!v)}><Image size={17}/>{figures?t('收起官方原页','Hide original pages'):t('查看官方原页与配图','View original pages & figures')}</button><button className="text-button" onClick={()=>source(manual.source)}>{t('官方手册','Official manual')}<ArrowUpRight size={16}/></button></div>
      {figures&&<div className="rule-original-pages">{current.pages.map(p=><figure key={p}><img src={'./rules/pages/'+p+'.jpg'} loading="lazy" alt={t(`官方手册 PDF 第 ${p} 页`,`Official manual PDF page ${p}`)}/><figcaption>PDF · {p} / {manual.pageCount}</figcaption></figure>)}</div>}
      <div className="rule-reader-tools">{[-1,1].map(step=>{const siblings=documents.filter(d=>current.code?prefix(d)===prefix(current):!d.code),next=siblings[siblings.indexOf(current)+step];return next&&<button key={step} className="text-button" onClick={()=>select(next.id)}>{step<0?'←':'→'} {next.code} · {zh?next.zhTitle:next.title}</button>;})}</div>
    </>:<>
      {!id?<motion.section className="rules-hero" initial={{opacity:0,y:12}} animate={{opacity:1,y:0}}><div><div className="hero-kicker">COMPETITION FIELD GUIDE</div><h1>{t('赛事规则分区','Competition rule sections')}</h1><p>{manual.season} VEX V5 · Override · v{manual.version}</p><span>{t('选择章节，再按类别查阅条款。','Choose a section, then explore its rule categories.')}</span></div><Trophy size={68} strokeWidth={1.2}/></motion.section>:<div className="page-heading"><div className="hero-kicker">OVERRIDE · v{manual.version}</div><h1>{id==='saved'?t('规则收藏','Rule bookmarks'):category?categoryName(category):activeGroup?.[zh?'zh':'en']}</h1><p>{category?category+' · ':''}{t('按规则编号查阅，随时切换中英对照。','Browse by rule number and compare both languages.')}</p></div>}
      <div className="rules-search"><Search size={19}/><input aria-label={t('搜索赛事规则','Search competition rules')} value={query} onChange={e=>setQuery(e.target.value)} placeholder={activeGroup?t('搜索本章节…','Search this section…'):t('搜索全部规则：SG1、检录…','Search all rules: SG1, inspection…')}/>{query&&<button className="text-button" onClick={()=>setQuery('')}>{t('清除','Clear')}</button>}</div>
      {query||category||id==='saved'?<><p className="rules-result-count">{results.length} {t('项','entries')}</p><div className="rules-grid">{results.map(card)}</div>{!results.length&&<div className="empty-state"><Search size={30}/><h2>{t('没有匹配的规则','No matching rules')}</h2></div>}</>:activeGroup?<>
        {overview&&<section className="rule-overview"><span className="hero-kicker">{t('章节导读','SECTION OVERVIEW')}</span><h2>{zh?overview.zhTitle:overview.title}</h2><p>{zh?overview.summary:t('打开章节导读，查看定义、背景与官方原页。','Read the section overview for definitions, context and original pages.')}</p><button className="text-button" onClick={()=>select(overview.id)}>{t('阅读章节导读与原页','Read overview & original pages')}<ArrowUpRight size={16}/></button></section>}
        {!!sections.length&&<><h2 className="rule-category-heading">{t('本章分类','In this section')}</h2><div className="rules-grid rule-category-grid">{sections.map(key=><button key={key} className="rule-category-card" onClick={()=>select(sectionId(activeGroup.id,key))}><span className="rule-card-code">{key}</span><h2>{categoryName(key)}</h2><p>{documents.filter(d=>prefix(d)===key).length} {t('条规则','rules')}</p><ChevronRight size={20}/></button>)}</div></>}
      </>:<div className="rules-sections-grid">{manual.groups.map((g,i)=>{const entries=manual.documents.filter(d=>d.group===g.id),intro=entries.find(d=>!d.code);return <motion.button key={g.id} className="rule-section-card" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:i*.025}} onClick={()=>select(sectionId(g.id))}><span className="rule-section-number">{String(i+1).padStart(2,'0')}</span><BookOpen size={23}/><h2>{zh?g.zh:g.en}</h2><p>{zh?intro?.zhTitle:intro?.title}</p><small>{entries.filter(d=>d.code).length?t(`${entries.filter(d=>d.code).length} 条规则`,`${entries.filter(d=>d.code).length} rules`):t('导读与官方图文','Guide & original pages')}<ChevronRight size={17}/></small></motion.button>;})}</div>}
      {!id&&<div className="rules-notice"><ShieldCheck size={18}/><p>{t(manual.translation,'Unofficial Chinese clause summaries. Read the English manual for full clauses.')} · {t('手册发布日期','Manual released')} {manual.released}</p></div>}
    </>}
      </div>
    </div>
  </>;
}
