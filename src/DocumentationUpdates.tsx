import { useEffect, useRef, useState } from 'react';
import { AlertCircle, ArrowUpRight, Check, CheckCheck, Clock3, FileCode2, Globe2, LoaderCircle, RefreshCw, ShieldCheck, WifiOff, X } from 'lucide-react';
import type { Catalog, DocumentationChange, DocumentationProgress, DocumentationUpdateResult } from './types';

const cacheKey='atlas:documentation-updates';
function readCache():DocumentationUpdateResult|null {
  try {
    const result=JSON.parse(localStorage.getItem(cacheKey)??'null');
    return result&&['current','updates','partial'].includes(result.status)&&Array.isArray(result.changes)&&Array.isArray(result.failures)?result:null;
  }catch{return null;}
}
export function useDocumentationUpdates(snapshotId?:string) {
  const [result,setResult]=useState<DocumentationUpdateResult|null>(readCache);
  const [busy,setBusy]=useState(false);
  const [progress,setProgress]=useState<DocumentationProgress>({phase:'index',completed:0,total:0});
  const [issue,setIssue]=useState<string|null>(null);
  const pending=useRef(false);
  const available=typeof window.atlasDesktop?.checkDocUpdates==='function';
  async function check() {
    const request=window.atlasDesktop?.checkDocUpdates;
    if(!request||pending.current)return;
    pending.current=true;setBusy(true);setIssue(null);setProgress({phase:'index',completed:0,total:0});
    try {
      const latest=await request(value=>setProgress(previous=>({...value,completed:value.phase===previous.phase?Math.max(previous.completed,value.completed):value.completed})));
      if(latest.status==='error')setIssue(latest.errorCode??'network');
      else if(latest.status==='cancelled')setIssue('cancelled');
      else {
        setResult(latest);
        try{localStorage.setItem(cacheKey,JSON.stringify(latest));}catch{/* A full profile must not prevent update checks. */}
      }
    }catch(error){setIssue(error instanceof Error&&error.message==='timeout'?'timeout':'network');}
    finally{pending.current=false;setBusy(false);}
  }
  return {result:!snapshotId||result?.snapshotId===snapshotId?result:null,busy,progress,issue,available,check,cancel:()=>window.atlasDesktop?.cancelDocUpdateCheck?.()};
}
type UpdateState=ReturnType<typeof useDocumentationUpdates>;

function failureMessage(code:string,t:(zh:string,en:string)=>string) {
  switch(code) {
    case 'cancelled':return t('检查已取消，已保留上次结果。','Check cancelled. Your previous result is still available.');
    case 'timeout':return t('连接超时，请检查网络后重试。','The check timed out. Check your connection and try again.');
    case 'http-403':case 'http-429':return t('官方站点暂时限制访问，请稍后重试。','The official site is limiting access. Please try again later.');
    case 'invalid-index':case 'invalid-content':case 'redirect-blocked':return t('官方站点返回了无法核对的内容，暂时不能判断是否更新。','The official site returned content that could not be verified. Update status is unknown.');
    case 'invalid-snapshot':return t('本地快照校验信息无法读取，请重新打开应用或使用完整的离线包。','The local snapshot metadata could not be read. Reopen the app or use the complete offline package.');
    case 'busy':return t('已有检查正在进行，请稍后重试。','Another check is already running. Please try again shortly.');
    case 'http-404':return t('官方索引中的此页面暂时无法读取。','This page is listed in the official index but is temporarily unavailable.');
    default:return t('无法连接官方文档，请检查网络或系统代理后重试。','Could not reach the official documentation. Check your connection or system proxy and try again.');
  }
}

export default function DocumentationUpdates({catalog,state,zh,t,source}:{catalog:Catalog;state:UpdateState;zh:boolean;t:(a:string,b:string)=>string;source:(url:string)=>void}) {
  const {result,busy,progress,issue,available,check,cancel}=state;
  const [filter,setFilter]=useState<'all'|DocumentationChange['kind']>('all');
  useEffect(()=>setFilter('all'),[result?.checkedAt]);
  const added=result?.changes.filter(c=>c.kind==='added').length??0;
  const modified=result?.changes.filter(c=>c.kind==='modified').length??0;
  const removed=result?.changes.filter(c=>c.kind==='removed').length??0;
  const changes=result?.changes.filter(c=>filter==='all'||c.kind===filter)??[];
  const percent=progress.total?Math.round(progress.completed/progress.total*100):0;
  const formatTime=(value:string)=>new Date(value).toLocaleString(zh?'zh-CN':'en-GB',{timeZone:'Asia/Shanghai',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit'});
  const current=result?.status==='current';
  const partial=result?.status==='partial';
  const kindName=(kind:DocumentationChange['kind'])=>({added:t('新增','Added'),modified:t('已修改','Modified'),removed:t('已移除','Removed')})[kind];
  return <>
    <div className="page-heading"><h1>{t('官方原文核对','Compare official sources')}</h1><p>{t('按需连接 VEX 官方站点，逐页核对 C++ 文档原文，与当前离线快照比较。','Connect to the official VEX site on demand and compare each C++ document with your offline snapshot.')}</p></div>
    <div className="update-metrics"><div><span>{t('本地文档快照','LOCAL SNAPSHOT')}</span><strong>{catalog.snapshotDate}</strong><small>VEX V5 · C++</small></div><div><span>{t('已收录文档','IN YOUR LIBRARY')}</span><strong>{catalog.documents.length}<i>{t('篇','pages')}</i></strong><small>{t('中英双语 · 离线可读','Chinese & English · available offline')}</small></div><div><span>{t('最近检查（北京时间）','LAST CHECK · UTC+8')}</span><strong className="update-last-time">{result?formatTime(result.checkedAt):t('尚未检查','Not checked yet')}</strong><small>{result?partial?t('上次有页面未完成核对','Some pages could not be verified'):t('已保存到本机','Saved on this device'):t('点击下方按钮开始','Start a check below')}</small></div></div>
    <section className={'update-check-card '+(busy?'checking':'')} aria-busy={busy}>
      <span className="update-check-symbol">{busy?<RefreshCw size={31} className="update-spinning"/>:current?<CheckCheck size={32}/>:<Globe2 size={32}/>}</span>
      <div className="update-check-copy"><h2>{busy?t('正在核对官方文档…','Checking the official reference…'):t('检查文档更新','Check documentation updates')}</h2><p>{busy?progress.phase==='index'?t('正在读取官方 C++ 文档索引…','Reading the official C++ documentation index…'):t(`已核对 ${progress.completed} / ${progress.total} 篇文档`,`Checked ${progress.completed} / ${progress.total} documents`):t('检查会联网读取官方索引和文档原文，识别新增、修改与移除的页面。','Reads the official index and document sources to identify added, modified, and removed pages.')}</p><span className="update-network-note"><ShieldCheck size={13}/>{t('仅在点击时联网检查，查阅功能继续离线可用。','Connects only when you start a check. Offline reading remains available.')}</span></div>
      {busy?<button className="update-cancel-button" onClick={cancel}><X size={16}/>{t('取消检查','Cancel check')}</button>:<button className="primary-button" disabled={!available} onClick={()=>void check()}><RefreshCw size={16}/>{result?t('重新检查','Check again'):t('立即检查','Check now')}</button>}
      {busy&&<div className={'update-progress '+(progress.phase==='index'?'indeterminate':'')} role="progressbar" aria-label={t('文档核对进度','Documentation check progress')} aria-valuenow={progress.phase==='documents'?percent:undefined} aria-valuemin={0} aria-valuemax={100}><span style={{width:progress.phase==='index'?'25%':percent+'%'}}/></div>}
    </section>
    {!available&&<div className="update-message"><WifiOff size={18}/><p>{t('请在桌面版中使用更新检测。浏览器预览仍可离线查阅文档。','Open the desktop app to check for updates. The browser preview can still read the offline library.')}</p></div>}
    {issue&&<div className={'update-message '+(issue==='cancelled'?'':'warning')} role="status"><AlertCircle size={18}/><p>{failureMessage(issue,t)}{result&&issue!=='cancelled'&&<span>{t('下方保留的是上次检查结果。','The previous check result is retained below.')}</span>}</p></div>}
    {result&&!busy&&<section className="update-results" aria-label={t('文档更新检查结果','Documentation update results')}>
      <div className={'update-result-heading '+(partial?'partial':current?'current':'changed')}><span className="update-result-icon">{partial?<AlertCircle size={22}/>:current?<Check size={24}/>:<FileCode2 size={23}/>}</span><div><h2>{partial?t('部分页面未完成核对','Some pages could not be verified'):current?t('官方文档与本地快照一致','Official documentation matches your snapshot'):t(`发现 ${result.changes.length} 篇文档有变化`,`${result.changes.length} documentation pages have changed`)}</h2><p>{partial?t(`已成功读取 ${result.checkedCount} / ${result.total} 篇；未读取的页面暂时无法判断。`,`Successfully read ${result.checkedCount} / ${result.total} pages. The remaining pages could not be assessed.`):t(`已逐页核对 ${result.checkedCount} 篇官方 C++ 文档。`,`Compared ${result.checkedCount} official C++ pages individually.`)}</p></div><Clock3 size={17}/></div>
      {result.changes.length>0&&<><div className="update-change-tabs">{(['all','added','modified','removed'] as const).map((kind,i)=><button key={kind} className={filter===kind?'selected':''} aria-pressed={filter===kind} onClick={()=>setFilter(kind)}>{[t('全部变化','All changes'),t('新增','Added'),t('修改','Modified'),t('移除','Removed')][i]}<span>{[result.changes.length,added,modified,removed][i]}</span></button>)}</div><div className="update-change-list">{changes.length?changes.map(change=><article key={change.id} className="update-change-row"><span className={'change-kind '+change.kind}>{kindName(change.kind)}</span><div><h3>{zh&&change.zhTitle?change.zhTitle:change.title}</h3><code>{change.id}</code>{zh&&change.zhTitle&&<span>{change.title}</span>}</div>{change.kind!=='removed'&&<button className="text-button small" onClick={()=>source(change.source)} aria-label={t('查看官方原文：','Open official source: ')+change.title}>{t('查看原文','View source')}<ArrowUpRight size={16}/></button>}</article>):<p className="update-filter-empty">{t('此类文档暂无变化。','No changes in this category.')}</p>}</div><div className="update-translation-note"><ShieldCheck size={17}/><p>{t('这里显示官方英文原文的变化。双语包生成后，上方自动更新会把英文和中文一起加入本机文档库。','These changes refer to the official English sources. Once a bilingual package is built, automatic updates above add the English and Chinese content to your local library together.')}</p></div></>}
      {partial&&<details className="update-failures"><summary>{t(`查看 ${result.failures.length} 篇未完成的页面`,`View ${result.failures.length} unverified pages`)}</summary>{result.failures.map(f=><div key={f.id}><strong>{f.title}</strong><p>{failureMessage(f.code,t)}</p></div>)}</details>}
    </section>}
    {!result&&!busy&&!issue&&<div className="update-first-check"><p>{t('首次检查完成后，这里会保留结果和变化清单，断网也能再次查看。','Your check result and change list will be saved here, ready to review even when you are offline.')}</p></div>}
  </>;
}
