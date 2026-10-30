"""Import the pinned official PDF and attach authored Chinese clause summaries.

Run explicitly when adopting a new manual; never silently change a competition season.
English pages and renderings remain available to check extraction and summaries.
"""
from pathlib import Path
import json,re,hashlib,argparse
import requests,pymupdf
ROOT=Path(__file__).resolve().parents[1]
URL='https://content.vexrobotics.com/docs/2026-2027/override/files/Override-2.1.pdf'
OUT=ROOT/'public/rules'
GROUPS=[('prefix','前言与更新','Prefix',5),('introduction','手册导读','Introduction',14),('game','比赛规则','The Game',19),('skills','机器人技能赛','Robot Skills',51),('robot','机器人与检录','The Robot',56),('tournament','赛事组织','The Tournament',70),('vex-u','VEX U 大学组','VEX U',83),('vex-ai','VEX AI 自动机器人赛','VEX AI',99),('appendix-a','附录 A · 场地','Appendix A · Field',115),('appendix-b','附录 B · 术语','Appendix B · Glossary',133),('appendix-c','附录 C · 违规','Appendix C · Violations',145),('appendix-d','附录 D · 队伍与学生职责','Appendix D · Team roles',147)]

def main():
    parser=argparse.ArgumentParser();parser.add_argument('--pdf',type=Path);parser.add_argument('--extract-only',action='store_true');args=parser.parse_args()
    OUT.mkdir(parents=True,exist_ok=True);(OUT/'pages').mkdir(exist_ok=True)
    if args.pdf:raw=args.pdf.read_bytes()
    else:
        r=requests.get(URL,timeout=90);r.raise_for_status();raw=r.content
    expected=json.loads((ROOT/'sources/rules-manifest.json').read_text(encoding='utf-8'))
    assert hashlib.sha256(raw).hexdigest()==expected['sha256'],'Manual changed; review Chinese editorial before importing'
    assert raw.startswith(b'%PDF'),'Official server did not return a PDF'
    pdf=pymupdf.open(stream=raw,filetype='pdf');assert len(pdf)==148,'Review page boundaries for a new manual'
    (OUT/'manual.pdf').write_bytes(raw)
    docs=[]
    for gi,(gid,zh,title,start) in enumerate(GROUPS):
        end=GROUPS[gi+1][3]-1 if gi+1<len(GROUPS) else len(pdf)
        current=None
        for page_number in range(start,end+1):
            page=pdf[page_number-1]
            image=OUT/'pages'/f'{page_number}.jpg'
            if not image.exists():page.get_pixmap(matrix=pymupdf.Matrix(1.4,1.4)).save(image,jpg_quality=85)
            # Crop repeated title/footer, preserve reading-order text blocks.
            blocks=page.get_text('blocks',clip=pymupdf.Rect(0,43,page.rect.width,page.rect.height-37),sort=True)
            pieces=[]
            for block in blocks:
                raw_text=block[4].replace('\xad\n','').replace('\xad','').strip()
                pieces.extend(re.split(r'(?m)(?=^<[A-Z]{1,5}\d+>\s+[A-Z])',raw_text) if gid in ['game','skills','robot','tournament','vex-u','vex-ai'] else [raw_text])
            for text in pieces:
                if not text:continue
                match=re.match(r'^<([A-Z]{1,5}\d+)>\s*([A-Z].*)',text,re.S) if gid in ['game','skills','robot','tournament','vex-u','vex-ai'] else None
                if match or current is None:
                    code=match[1] if match else gid.upper()
                    # Some references repeat a rule number; use a unique stable page-qualified key.
                    current={'id':f'{gid}-{code}-{page_number}','group':gid,'code':code if match else '', 'title':(match[2].split('\n')[0] if match else title)[:160],'pages':[],'blocks':[]}
                    docs.append(current)
                if page_number not in current['pages']:current['pages'].append(page_number)
                key=hashlib.sha256(text.encode()).hexdigest()
                current['blocks'].append({'en':text,'key':key,'page':page_number})
            if current and page_number not in current['pages']:current['pages'].append(page_number)

    if args.extract_only:
        (ROOT/'build/rules-source.json').write_text(json.dumps(docs,ensure_ascii=False),encoding='utf-8');print('Extracted entries:',len(docs));return
    editorial={}
    for line in (ROOT/'sources/rules-editorial.txt').read_text(encoding='utf-8').splitlines():
        if not line or line.startswith('#'):continue
        key,title,summary=line.split('|',2);editorial[key]=(title,summary)
    for doc in docs:
        key=doc['group']+'/'+doc['code']
        if key not in editorial:raise ValueError('Missing Chinese editorial: '+key)
        doc['zhTitle'],doc['summary']=editorial[key]
        for block in doc['blocks']:block.pop('key')
    catalog={'season':'2026–2027','game':'Override','version':'2.1','released':'2026-10-08','source':URL,'sha256':hashlib.sha256(raw).hexdigest(),'pageCount':len(pdf),'translation':'Codex 撰写的中文条款要点译解，非逐句全文翻译。细则及违规备注请核对英文和官方原页；官方 Q&A 未实时同步。','groups':[{'id':g[0],'zh':g[1],'en':g[2]} for g in GROUPS],'documents':docs}
    (OUT/'catalog.json').write_text(json.dumps(catalog,ensure_ascii=False),encoding='utf-8')
    print('Built bilingual rules:',len(docs),flush=True)
if __name__=='__main__':main()
