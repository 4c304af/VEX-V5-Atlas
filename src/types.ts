export type Language = 'zh' | 'en' | 'dual';
export type Theme = 'light' | 'dark' | 'system';
export interface Heading { id: string; en: string; zh: string; level: number }
export interface Entry {
  id: string; key: string; title: string; zhTitle: string; group: string;
  source: string; sha256: string; intro: string; zhIntro: string;
  headings: Heading[]; text: string; zhText: string;
}
export interface Catalog { snapshotDate: string;snapshotId?:string; documents: Entry[]; translation: string }
export interface Doc { id: string; en: string; zh: string; headings: Heading[] }
export interface Settings { language: Language; theme: Theme; motion: boolean; fontSize: number; accent: string; customColor?: string;autoDocuments?:boolean;autoApplication?:boolean }
export interface AutoUpdatePart {status:'skipped'|'current'|'updated'|'ready'|'available'|'error'|'cancelled';version?:string;error?:string}
export interface AutoUpdateResult {documents:AutoUpdatePart;application:AutoUpdatePart;checkedAt:string}
export interface Read { id: string; time: number }
export type Page = { kind: 'home' | 'library' | 'favorites' | 'history' | 'settings' | 'glossary' | 'updates'; group?: string } | { kind: 'doc'; id: string; anchor?: string };
export interface DocumentationChange { id:string;title:string;zhTitle?:string;kind:'added'|'modified'|'removed';source:string }
export interface DocumentationProgress {phase:'index'|'documents';completed:number;total:number}
export interface DocumentationUpdateResult {
  status:'current'|'updates'|'partial'|'error'|'cancelled';checkedAt:string;snapshotDate:string;snapshotId?:string;
  total:number;checkedCount:number;changes:DocumentationChange[];failures:{id:string;title:string;code:string}[];errorCode?:string;
}
declare global {
  interface Window { atlasDesktop?: {
    platform?: 'macos' | 'windows';
    applicationUpdates?: 'manual' | 'automatic';
    copyText?:(text:string)=>Promise<boolean>;
    openApplicationUpdate?:()=>void;
    minimize(): void; maximize(): void; close(): void; openSource(url: string): Promise<boolean>;
    checkDocUpdates?:(onProgress?:(progress:DocumentationProgress)=>void)=>Promise<DocumentationUpdateResult>;
    cancelDocUpdateCheck?:()=>void;
    automaticUpdatesEnabled?:boolean;
    runAutoUpdates?:(options:{documents:boolean;application:boolean},onProgress?:(value:string)=>void)=>Promise<AutoUpdateResult>;
    restartToUpdate?:()=>void;
  } }
}
