import { useCallback, useEffect, useRef, useState } from 'react';
import { Download, RefreshCw, ShieldCheck, Sparkles, X } from 'lucide-react';
import type { AutoUpdateResult, Settings } from './types';
import app from '../package.json';
import './auto-updates.css';

export function useAutoUpdates(settings:Settings) {
  const [result,setResult]=useState<AutoUpdateResult|null>(()=>{try{const saved=JSON.parse(localStorage.getItem('atlas:auto-updates')??'null');return saved?.appVersion===app.version?saved.result:null;}catch{return null;}});
  const [busy,setBusy]=useState(false);
  const [progress,setProgress]=useState('documents:check');
  const pending=useRef(false);
  const options=useRef(settings);options.current=settings;
  const available=!!window.atlasDesktop?.runAutoUpdates;
  const run=useCallback(async(documents=true,application=true)=>{
    const request=window.atlasDesktop?.runAutoUpdates;
    if(!request||pending.current)return;
    pending.current=true;setBusy(true);setProgress(documents?'documents:check':'application:check');
    try {
      const next=await request({documents,application},setProgress);
      setResult(next);
      try{localStorage.setItem('atlas:auto-updates',JSON.stringify({appVersion:app.version,result:next}));}catch{/* Reading remains available. */}
    }catch{setResult({checkedAt:new Date().toISOString(),documents:{status:documents?'error':'skipped',error:'network'},application:{status:application?'error':'skipped',error:'network'}});}
    finally{pending.current=false;setBusy(false);}
  },[]);
  useEffect(()=>{
    if(!available||window.atlasDesktop?.automaticUpdatesEnabled===false)return;
    const check=()=>{const s=options.current;if(s.autoDocuments!==false||s.autoApplication!==false)void run(s.autoDocuments!==false,s.autoApplication!==false);};
    const timer=setTimeout(check,3500);const interval=setInterval(check,6*60*60*1000);
    return()=>{clearTimeout(timer);clearInterval(interval);};
  },[available,run]);
  return {result,busy,progress,available,run,cancel:()=>window.atlasDesktop?.cancelDocUpdateCheck?.(),restart:()=>window.atlasDesktop?.restartToUpdate?.()};
}

export default function AutoUpdates({state,settings,setSetting,t}:{state:ReturnType<typeof useAutoUpdates>;settings:Settings;setSetting:<K extends keyof Settings>(key:K,value:Settings[K])=>void;t:(zh:string,en:string)=>string}) {
  const {result,busy,progress,available,run,cancel,restart}=state;
  const manualApplication=window.atlasDesktop?.applicationUpdates==='manual';
  const applicationLabel=manualApplication?t('检查程序更新','Check application updates'):t('自动下载程序更新','Download application updates');
  const labels:Record<string,string>={
    'documents:check':t('正在检查双语文档包…','Checking bilingual documentation…'),
    'documents:download':t('正在下载双语文档包…','Downloading bilingual documentation…'),
    'documents:verify':t('正在校验并更新文档库…','Verifying and updating your library…'),
    'application:check':t('正在检查程序版本…','Checking the application version…'),
    'application:download':t('正在下载新版程序…','Downloading the application update…'),
  };
  const describe=(part:AutoUpdateResult['documents'],isApp=false)=>{
    if(part.status==='updated')return t('新文档已加入文档库，搜索和阅读已同步更新。','New documents are in your library. Search and reading are up to date.');
    if(part.status==='ready')return t(`新版 ${part.version} 已下载，下次重启即可安装。`,`Version ${part.version} is downloaded and ready to install on restart.`);
    if(part.status==='available')return t(`发现新版 ${part.version}，下载后拖入“应用程序”完成替换。`,`Version ${part.version} is available. Download it and drag the app into Applications to replace this version.`);
    if(part.status==='current')return isApp?t('程序已是最新版本。','Your application is up to date.'):t('已使用最新的双语文档包。','You have the latest bilingual documentation package.');
    if(part.status==='cancelled')return t('更新已取消，已有内容已保留。','Update cancelled. Existing content is retained.');
    if(part.status==='error')return part.error==='app-update-required'?t('此文档包需要新版程序，请先更新程序。','This documentation package requires a newer application. Update the app first.'):part.error==='busy'?t('另一个更新任务正在进行，请稍后重试。','Another update is running. Please try again shortly.'):t('暂时无法完成更新，已有离线内容可继续使用。请检查网络后重试。','The update could not be completed. Your offline content remains available. Check your connection and try again.');
    return t('本次未检查。','Not checked in this run.');
  };
  return <section className="auto-updates" aria-label={t('自动更新','Automatic updates')} aria-busy={busy}>
    <div className="auto-update-heading"><span className="auto-update-orbit"><Sparkles size={27}/></span><div><h2>{t('自动更新','Automatic updates')}</h2><p>{t('自动获取通过校验的中英双语文档包；新增页面会直接进入文档库。','Verified Chinese and English documentation packages arrive automatically, with new pages added to your library.')}</p></div></div>
    <div className="auto-preferences">{(['autoDocuments','autoApplication'] as const).map((key,i)=><div key={key}><div><strong>{i?applicationLabel:t('自动更新文档','Update documentation automatically')}</strong><small>{i?manualApplication?t('发现新版后，可前往发布页下载。','Download from the release page when a new version is available.'):t('新版就绪后，由你选择重启时间。','Choose when to restart once an update is ready.'):t('启动时及每 6 小时检查，可随时关闭。','Checks at startup and every 6 hours. You can turn this off.')}</small></div><button className={'toggle '+(settings[key]!==false?'on':'')} role="switch" aria-label={i?applicationLabel:t('自动更新文档','Update documentation automatically')} aria-checked={settings[key]!==false} onClick={()=>setSetting(key,settings[key]===false)}><span/></button></div>)}</div>
    <div className="auto-update-actions">{busy?<><RefreshCw size={18} className="update-spinning"/><span role="status">{labels[progress]??t('正在更新…','Updating…')}</span><button className="text-button" onClick={cancel}><X size={16}/>{t('取消更新','Cancel update')}</button></>:<><button className="primary-button" disabled={!available} onClick={()=>void run()}><Download size={17}/>{t('立即同步并检查新版','Sync and check for updates')}</button><span>{available?t('仅从项目 GitHub 发布页获取更新','Updates come from this project’s GitHub releases'):t('请在桌面版中使用','Available in the desktop app')}</span></>}</div>
    {result&&!busy&&<div className="auto-update-results" role="status"><div data-status={result.documents.status}><strong>{t('双语文档','Bilingual documentation')}</strong><p>{describe(result.documents)}</p></div><div data-status={result.application.status}><strong>{t('桌面程序','Desktop application')}</strong><p>{describe(result.application,true)}</p>{result.application.status==='ready'&&<button className="primary-button" onClick={restart}><RefreshCw size={16}/>{t('重启并更新','Restart and update')}</button>}{result.application.status==='available'&&<button className="primary-button" onClick={()=>window.atlasDesktop?.openApplicationUpdate?.()}><Download size={16}/>{t('下载 Mac 新版','Download for Mac')}</button>}</div><small>{t('最近同步：','Last sync: ')}{new Date(result.checkedAt).toLocaleString(undefined,{timeZone:'Asia/Shanghai'})} · UTC+8</small></div>}
    <div className="auto-update-footnote"><ShieldCheck size={16}/><p>{t('每小时生成双语文档包，发布可能延迟。校验失败时保留原文档。','Bilingual packages are built hourly; publishing may be delayed. Failed verification keeps existing documents.')}</p></div>
  </section>;
}
