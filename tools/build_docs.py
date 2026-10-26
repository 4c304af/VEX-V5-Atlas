"""Compile official MyST sources and build a protected, cached bilingual corpus.

Translation is a BUILD-TIME step only. The installed app never sends document
text to a server. Code, identifiers, links, and numeric values are preserved.
"""
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor, as_completed
from markdown_it import MarkdownIt
from bs4 import BeautifulSoup, NavigableString
import requests, re, json, hashlib, time, html, posixpath, threading

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'public' / 'docs'
CACHE_FILE = ROOT / 'sources' / 'translation-cache.json'
MANIFEST = json.loads((ROOT / 'sources' / 'manifest.json').read_text(encoding='utf-8'))
CACHE = json.loads(CACHE_FILE.read_text(encoding='utf-8')) if CACHE_FILE.exists() else {}
EDITORIAL = json.loads((ROOT / 'sources' / 'editorial.json').read_text(encoding='utf-8'))
LOCK = threading.Lock()
MD = MarkdownIt('commonmark', {'html': True}).enable('table')

TITLES = {
 'C++':'C++ 参考指南', 'Drivetrain':'传动系统', 'smartdrive':'智能传动系统',
 'Motors and Motor Controllers':'电机与电机控制器','Motor and Motor Group':'电机与电机组',
 'Motor Controller 55':'55 电机控制器','Motor 393 (Motor Controller 29)':'393 电机（29 电机控制器）',
 'Servo Motor':'舵机','Victor 883 Motor':'Victor 883 电机','Controller':'遥控器',
 'Brain':'主控器','Battery':'电池','Screen':'屏幕','Timer':'计时器','SDcard':'SD 卡',
 'Axis':'摇杆轴','Button':'按钮','Competition':'竞赛控制','Console':'控制台',
 'Smart Port Devices':'智能端口设备','3-Wire Devices':'三线设备','3-Wire Expander':'三线端口扩展器',
 'Accelerometer':'加速度计','Analog In':'模拟输入','Bumper Switch':'碰撞开关',
 'Digital In':'数字输入','Digital Out':'数字输出','Encoder':'编码器','Gyro Sensor':'陀螺仪',
 'LED Indicator':'LED 指示灯','Light Sensor':'光线传感器','Limit Switch':'限位开关',
 'Line Tracker':'巡线传感器','PWM Out':'PWM 输出','Pneumatics':'气动装置',
 'Potentiometer':'电位器','Range Finder':'超声波测距传感器',
 'AI Vision Sensor':'AI 视觉传感器','Distance Sensor':'距离传感器','GPS Sensor':'GPS 定位传感器',
 'Inertial Sensor':'惯性传感器','Optical Sensor':'光学传感器','Rotation Sensor':'旋转传感器',
 'Vision Sensor':'视觉传感器','Logic':'程序逻辑','Comments':'注释','Control':'流程控制',
 'Custom Colors':'自定义颜色','Custom String Formatting':'自定义字符串格式',
 'Custom Timer':'自定义计时器','Events':'事件','Functions':'函数','Math':'数学函数',
 'Operators':'运算符','Random':'随机数','Threads':'线程','Variables':'变量',
 'VEXlink':'VEXlink 通信','Message Link':'消息通信','Serial Link':'串行通信',
 'CTE Workcell':'CTE 工作站','CTE Arm':'CTE 机械臂','Object Sensor':'物体检测传感器',
 'Signal Tower':'信号灯塔'
}
HEADINGS = {**TITLES,
 'Introduction':'概述','Derived Classes':'派生类','Class Constructors':'构造函数',
 'Class Constructor':'构造函数','Constructors':'构造函数','Constructor':'构造函数',
 'Class Destructor':'析构函数','Destructor':'析构函数','Parameters':'参数',
 'Parameter':'参数','Type':'类型','Description':'说明','Return Value':'返回值',
 'Return Values':'返回值','Notes':'说明与注意事项','Note':'说明',
 'Example':'示例','Examples':'示例','Member Functions':'成员函数',
 'Available Functions':'函数重载','Available Function':'函数签名','Syntax':'语法',
 'Motor':'电机','Motor Group':'电机组','Actions':'动作控制',
 'Mutators':'设置方法','Getters':'读取方法','Settings':'设置','Values':'状态读取',
 'Related Classes':'相关类','Member Variables':'成员变量','Variables':'变量',
 'Methods':'方法','Functions and Keywords':'函数与关键字','Events':'事件',
 'Functions':'函数','Attributes':'属性','Properties':'属性','Usage':'用法',
 'This function does not return a value.':'此函数无返回值。',
 'This function does not take any parameters.':'此函数不接受参数。',
 'This control structure does not return a value.':'此控制结构无返回值。',
 'This method does not return a value.':'此方法无返回值。',
 'This function has no parameters.':'此函数不接受参数。',
}
# Prefer robotics/programming terminology over everyday meanings. Inline code
# remains byte-for-byte identical and is never passed through these substitutions.
GLOSSARY = [
 (r'\bV5 Brain\b','V5 主控器'),(r'\bBrain\b','主控器'),
 (r'\bmotor groups?\b','电机组'),(r'\bSmart Motors?\b','智能电机'),
 (r'\bmotors?\b','电机'),(r'\bdrivetrains?\b','传动系统'),
 (r'\bControllers?\b','遥控器'),(r'\bSmart Ports?\b','智能端口'),
 (r'\b3-Wire Ports?\b','三线端口'),(r'\bgear cartridges?\b','齿轮盒'),
 (r'\bgear ratio\b','齿轮传动比'),(r'\bgear setting\b','齿轮配置'),
 (r'\btorque\b','扭矩'),(r'\bcurrent\b','电流') if False else (r'\belectrical current\b','电流'),
 (r'\bnon-waiting\b','非阻塞'),(r'\btarget-based movement\b','目标运动'),
 (r'\bBoolean\b','布尔'),(r'\bheading\b','航向角'),
 (r'\bcoasting\b','自由滑行'),(r'\bbraking\b','制动'),(r'\bholding\b','保持位置'),
 (r'\bInertial Sensor\b','惯性传感器'),(r'\bGyro Sensor\b','陀螺仪'),
 (r'\bRotation Sensor\b','旋转传感器'),(r'\bOptical Sensor\b','光学传感器'),
 (r'\bVision Sensor\b','视觉传感器'),(r'\bDistance Sensor\b','距离传感器'),
 (r'\bColor Signatures?\b','颜色特征'),(r'\bColor Codes?\b','颜色码'),
 (r'\bcallback\b','回调函数'),(r'\bmember functions?\b','成员函数'),
 (r'\bconstructors?\b','构造函数'),(r'\bdestructors?\b','析构函数'),
]

def slug(value):
    value = BeautifulSoup(value, 'html.parser').get_text().lower().strip()
    return re.sub(r'\s+', '-', re.sub(r'[^\w\s-]', '', value))

def clean_markdown(text):
    text = text.lstrip('\ufeff')
    text = re.sub(r'^---\n.*?\n---\n', '', text, count=1, flags=re.S)
    text = re.sub(r'<!--.*?-->', '', text, flags=re.S)
    def directive(m):
        kind, args, content = m.group(1), m.group(2).strip(), m.group(3)
        if kind == 'image':
            alt = re.search(r':alt:\s*(.*)', content)
            return f'\n\n![{alt.group(1) if alt else "Device illustration"}]({args})\n\n'
        return ''
    text = re.sub(r'^```\{([^}]+)\}([^\n]*)\n(.*?)^```\s*$', directive, text, flags=re.M|re.S)
    # Inline spans carry Sphinx styling only. Their content must remain visible.
    text = re.sub(r'</?span\b[^>]*>', '', text)
    return text

ASSETS = {}
def compile_doc(entry):
    source = (ROOT/'sources/en'/(entry['id']+'.md')).read_text(encoding='utf-8')
    soup = BeautifulSoup(MD.render(clean_markdown(source)), 'html.parser')
    for node in soup(['script','style','iframe']): node.decompose()
    for node in soup.find_all(True):
        for attr in list(node.attrs):
            if attr.startswith('on') or attr in ['style','srcset']: del node[attr]
    headings = []
    counts = {}
    for h in soup.find_all(re.compile(r'^h[1-6]$')):
        en = h.get_text(' ', strip=True)
        base = slug(en)
        n = counts.get(base, 0); counts[base] = n+1
        anchor = base if not n else base+'-'+str(n)
        h['id'] = anchor
        headings.append({'id':anchor,'en':en,'level':int(h.name[1])})
    for a in soup.find_all('a',href=True):
        ref = a['href']
        # Repair known broken anchors in the upstream snapshot without altering
        # any signature or source archive. MyST uses underscores for pump_on.
        aliases={'#canendeffectortoreachto':'#canendeffectorreachto','#pump-on':'#pump_on',
                 '#pump-off':'#pump_off','#create-an-event':'#class-constructors'}
        ref=aliases.get(ref,ref)
        if 'Custom_color.md#predefined-color' in ref: ref=ref.split('#')[0]
        a['href']=ref
        if ref.startswith('#'): continue
        if not ref.startswith(('http:','https:','mailto:')):
            path, _, anchor = ref.partition('#')
            dest = posixpath.normpath(posixpath.join(posixpath.dirname(entry['id']),path))
            dest = re.sub(r'\.(md|html)$','',dest)
            if dest in DOC_IDS: a['href'] = '#doc/'+dest+('#'+anchor if anchor else '')
            else: a['href'] = 'https://api.vex.com/v5/home/cpp/'+dest+'.html'+('#'+anchor if anchor else '')
    for img in soup.find_all('img',src=True):
        src = img['src']
        url = 'https://api.vex.com/v5/_images/'+src.rsplit('/',1)[-1] if src.startswith('/_static/') else src
        if not url.startswith('https://'): url = 'https://api.vex.com/v5/'+src.lstrip('/')
        filename = hashlib.sha256(url.encode()).hexdigest()[:12]+Path(src).suffix
        ASSETS[url] = filename
        img['src'] = './docs/media/'+filename
        img['loading'] = 'lazy'
    return soup, headings

def translate_texts(texts):
    # A delimiter with no linguistic meaning keeps API paragraphs independent.
    separator = '\n\n\u241e\n\n'
    q = separator.join(texts)
    for attempt in range(5):
        try:
            r = requests.get('https://translate.googleapis.com/translate_a/single', params={
                'client':'gtx','sl':'en','tl':'zh-CN','dt':'t','q':q}, timeout=45)
            r.raise_for_status()
            result = ''.join(s[0] or '' for s in r.json()[0])
            parts = re.split(r'\s*\u241e\s*', result)
            if len(parts) != len(texts):
                if len(texts)>1:
                    mid=len(texts)//2
                    return translate_texts(texts[:mid])+translate_texts(texts[mid:])
                raise ValueError('Translation separator lost')
            return [p.strip() for p in parts]
        except Exception:
            if attempt == 4: raise
            time.sleep(2*(attempt+1))

def prepare_fragment(inner):
    protected = []
    def protect(m):
        protected.append(m.group(0))
        return ' ZXQ'+str(len(protected)-1)+'QXZ '
    # Identifiers and all HTML attributes are protected; prose remains in context.
    content = re.sub(r'<code\b[^>]*>.*?</code>|<[^>]+>|https?://[^\s<>]+', protect, inner, flags=re.S)
    for pattern, chinese in GLOSSARY:
        def term(m):
            protected.append(chinese)
            return ' ZXQ'+str(len(protected)-1)+'QXZ '
        content=re.sub(pattern,term,content,flags=re.I)
    return content,protected

def restore_fragment(translated, protected):
    for i, original in enumerate(protected):
        pattern = r'\s*ZXQ\s*'+str(i)+r'\s*QXZ\s*'
        if not re.search(pattern, translated, flags=re.I):
            raise ValueError('Protected identifier lost: '+str(i)+' in '+translated[:150])
        translated=re.sub(pattern, lambda _:original, translated, flags=re.I)
    return translated

def translate_fragment_by_nodes(inner):
    """Conservative fallback: keep the DOM and translate only prose text nodes."""
    soup=BeautifulSoup(inner,'html.parser')
    nodes=[n for n in soup.find_all(string=True) if not n.find_parent(['code','pre']) and re.search('[a-zA-Z]{2,}',str(n))]
    texts=[]
    for node in nodes:
        text=str(node)
        texts.append(text)
    if texts:
        values=translate_texts(texts)
        for node,value in zip(nodes,values): node.replace_with(value)
    return str(soup)

def needs_translation(el):
    if el.find_parent(['pre','code','svg']): return False
    # Translate each text-bearing block exactly once, including nested table lists.
    if el.name not in ['p','li','td','th','h1','h2','h3','h4','h5','h6']: return False
    if el.find_parent(['p','li','td','th','h1','h2','h3','h4','h5','h6']): return False
    return True

def save_cache():
    CACHE_FILE.write_text(json.dumps(CACHE,ensure_ascii=False,indent=1),encoding='utf-8')

def correct_terminology(fragment, english):
    soup=BeautifulSoup(fragment,'html.parser')
    fixes={'驱动程序控制':'手动控制','驾驶员控制':'手动控制','自治周期':'自动阶段','自主模式':'自动模式',
           '自主和':'自动阶段和','自治期':'自动阶段','Field QI':'场地控制器','V5 大脑':'V5 主控器',
           '变异器':'设置方法','匝数':'转角','英寸磅':'磅力·英寸','牛顿米':'牛·米',
           '布尔，':'布尔值，','从属':'从设备'}
    if 'torque' in english.lower(): fixes.update({'税务':'扭矩','图纸':'扭矩'})
    for node in soup.find_all(string=True):
        if node.find_parent(['code','pre']):continue
        value=str(node)
        for a,b in fixes.items():value=value.replace(a,b)
        if value!=str(node):node.replace_with(value)
    return str(soup)

def main():
    OUT.mkdir(parents=True,exist_ok=True)
    compiled = []
    pending = {}
    for entry in MANIFEST['documents']:
        soup, headings = compile_doc(entry)
        for el in soup.find_all(True):
            if not needs_translation(el): continue
            inner = el.decode_contents()
            plain = el.get_text(' ',strip=True)
            key = hashlib.sha256(inner.encode()).hexdigest()
            if plain in EDITORIAL:
                CACHE[key]=EDITORIAL[plain]
            elif plain in HEADINGS and '<code' not in inner:
                CACHE[key] = HEADINGS[plain]
            elif el.name.startswith('h') and re.match(r'^[\w:.~()\[\]/*+<>=!&|% ,-]+$', plain) and plain[:1].islower() and ' ' not in plain:
                CACHE[key] = inner
            elif not re.search('[a-zA-Z]{2,}',BeautifulSoup(re.sub(r'<code.*?</code>','',inner,flags=re.S),'html.parser').get_text()):
                CACHE[key] = inner
            elif key not in CACHE:
                pending[key] = inner
        compiled.append((entry,soup,headings))
    for entry,soup,headings in compiled:
        for el in soup.find_all(True):
            if needs_translation(el):
                key=hashlib.sha256(el.decode_contents().encode()).hexdigest()
                if key in CACHE: CACHE[key]=correct_terminology(CACHE[key],el.get_text(' ',strip=True))
    print('Unique translation fragments pending:',len(pending),flush=True)
    batches=[]; batch=[]; size=0
    for key,inner in pending.items():
        content,protected=prepare_fragment(inner)
        if batch and size+len(content)>2700:
            batches.append(batch); batch=[]; size=0
        batch.append((key,content,protected)); size+=len(content)+6
    if batch: batches.append(batch)
    def translate_batch(batch):
        values=translate_texts([v[1] for v in batch])
        result={}
        for (key,content,protected),translated in zip(batch,values):
            try: result[key]=restore_fragment(translated,protected)
            except ValueError:
                # Retry independently if a batch caused placeholder corruption.
                result[key]=translate_fragment_by_nodes(pending[key])
        return result
    with ThreadPoolExecutor(max_workers=2) as pool:
        futures=[pool.submit(translate_batch,b) for b in batches]
        for n,future in enumerate(as_completed(futures),1):
            CACHE.update(future.result()); save_cache()
            if n%10==0 or n==len(batches): print(f'Translated batch {n}/{len(batches)}',flush=True)
    catalog=[]
    for entry,en_soup,headings in compiled:
        zh_soup=BeautifulSoup(str(en_soup),'html.parser')
        blocks=[el for el in zh_soup.find_all(True) if needs_translation(el)]
        for el in blocks:
            key=hashlib.sha256(el.decode_contents().encode()).hexdigest()
            if key not in CACHE: raise ValueError('Untranslated content in '+entry['id'])
            translated=BeautifulSoup(CACHE[key],'html.parser')
            el.clear()
            for child in list(translated.contents): el.append(child)
        for h in headings:
            node=zh_soup.find(id=h['id'])
            h['zh']=node.get_text(' ',strip=True) if node else h['en']
        if zh_soup.h1: zh_soup.h1.string=TITLES.get(entry['title'],entry['title'])
        key=entry['id'].replace('/','--')
        doc={'id':entry['id'],'en':str(en_soup),'zh':str(zh_soup),'headings':headings}
        (OUT/(key+'.json')).write_text(json.dumps(doc,ensure_ascii=False),encoding='utf-8')
        group=entry['id'].split('/')[0] if '/' in entry['id'] else 'Essentials'
        intro=en_soup.find('p'); zh_intro=zh_soup.find('p')
        catalog.append({**entry,'key':key,'group':group,'zhTitle':TITLES.get(entry['title'],entry['title']),
            'intro':intro.get_text(' ',strip=True) if intro else '',
            'zhIntro':zh_intro.get_text(' ',strip=True) if zh_intro else '',
            'headings':headings,
            'text':en_soup.get_text(' ',strip=True), 'zhText':zh_soup.get_text(' ',strip=True)})
    (OUT/'catalog.json').write_text(json.dumps({'snapshotDate':MANIFEST['snapshotDate'],
        'documents':catalog,'translation':'Build-time machine-assisted translation with a protected code glossary and editorial corrections.'},ensure_ascii=False),encoding='utf-8')
    media=OUT/'media'; media.mkdir(exist_ok=True)
    def download_asset(pair):
        url,name=pair; file=media/name
        if not file.exists():
            r=requests.get(url,timeout=45); r.raise_for_status(); file.write_bytes(r.content)
        return name
    with ThreadPoolExecutor(max_workers=5) as pool:
        for f in as_completed([pool.submit(download_asset,p) for p in ASSETS.items()]): f.result()
    print('Built:',len(catalog),'documents,',len(ASSETS),'local illustrations',flush=True)

DOC_IDS={e['id'] for e in MANIFEST['documents']}
if __name__ == '__main__': main()
