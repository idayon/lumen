'use strict';
// ===================== 3장. 지하 1층 — 기록되지 않은 밤 =====================

// ---------- 보안실 ----------
room('security',{ch:3,name:'B1 보안실',bg:'security',tint:'linear-gradient(180deg,#0b1118,#070a0e)',
  look:'9분할 CCTV 모니터 벽이 방을 비춘다. 책상 셋, 화이트보드 근무표, 구석에 금고. 안쪽에 아카이브 철문.',
  hints:()=>!F().safeOpen?['금고 비번은 포스트잇에 힌트가 있어. 근무표를 봐.','CCTV는 책상 메모의 날짜와 시각을 넣어 봐.']:!F().ledgerDone?['아카이브 열쇠 있지? 서류함은 금고 포스트잇의 "모니터 둘".']:!F().logDone?['아카이브 안쪽에 내 단말실이 있어. …거긴 가지 않아도 돼. 가도 되고.']:['1층으로. 엘리베이터가 빨라.'],
  onEnter:p=>{if(S.flags.mute){S.flags.mute=false;say('…미안. 잠깐 말을 못 하겠더라.');}
    if(!F().secSeen){F().secSeen=true;sys('엘리베이터 문이 열린다. 모니터 아홉 개가 푸르게 방을 비춘다.');
      say('보안실이야. 저 CCTV 벽, 당신이 늘… 보안팀이 늘 보던 거야. 금고에 계단 열쇠가 있을 거야.');}},
  hots:[
   {id:'cctv',icon:'📺',label:'CCTV 모니터 벽',x:50,y:30,glow:true,open:openCCTV},
   {id:'memo',icon:'📝',label:'책상 메모',x:30,y:62,open:()=>modal('책상 메모',`<div class="note">4/15 22:00 대표님 B2 입장. 녹화 삭제 요청 받음.<br><b>안 함.</b><br><span style="font-size:12px">— 서연</span></div>`)},
   {id:'board',icon:'🗓️',label:'근무표',x:12,y:30,open:()=>modal('근무표 (화이트보드)',`<div class="doc"><h4>4월 야간 당직</h4><table><tr><td>4/15</td><td>이준호</td></tr><tr><td>4/16</td><td>박서연</td></tr><tr><td>4/17</td><td><b>박서연</b> (교대 <b>23:30</b> · 외부 업체 입회)</td></tr></table><p style="font-size:12px;color:#666">김도윤 — 줄이 그어져 있다.</p></div>`)},
   {id:'safe',icon:'🔐',label:'금고',x:12,y:70,open:openSecSafe},
   {id:'desks',icon:'🪪',label:'책상 명패',x:68,y:62,open:()=>modal('책상 셋',`<p>박서연 — 수첩 자리만 비어 있다. 이준호 — 정리정돈. 김도윤 — <b>서랍이 전부 비어 있다.</b> 누가 급히 치운 듯.</p><p class="dim">${F().identity?'당신 자리다. 의자 높이가 몸에 맞는다.':'의자에 앉아 본다. 높이가 몸에 딱 맞는다. 우연이겠지.'}</p>`)},
   {id:'archive',icon:'🚪',label:'아카이브 (철문)',x:88,y:40,door:true,open:()=>{if(!hasInv('아카이브 열쇠')){modal('아카이브 철문',`<p>잠겨 있다. 열쇠 구멍 위에 "ARCHIVE".</p>`);bad();return;}go('archive');}},
   {id:'elev',icon:'🛗',label:'엘리베이터',x:6,y:50,door:true,open:openElevatorB1},
   {id:'stairs',icon:'🚪',label:'비상계단 (열쇠)',x:94,y:70,door:true,open:()=>{if(!hasInv('비상계단 열쇠')){modal('비상계단문',`<p>잠겨 있다. 카드 리더는 없고 열쇠 구멍뿐.</p>`);bad();return;}go('stairs_b1');}},
  ]});

function openCCTV(){const opt=(a,b,sel)=>{let s='';for(let i=a;i<=b;i++)s+=`<option ${i===sel?'selected':''}>${String(i).padStart(2,'0')}</option>`;return s;};
  modal('CCTV 녹화 검색',`<div class="screen mono"><div>NEXUS-LAB SECURITY · 9CH DVR</div><div style="margin:8px 0">4월 <select id="cd">${opt(10,17,17)}</select>일 <select id="ch">${opt(0,23,22)}</select>시 <button id="cgo">재생</button></div><div id="cout" style="min-height:60px;white-space:pre-wrap"></div></div>`,()=>{
    $('#cgo').onclick=()=>{const d=+$('#cd').value,h=+$('#ch').value;let t='';
      if(d===15&&h===22){F().cctv7=true;t='[화면 7] 22:03 대표가 코어 방에 들어간다. 손에 서류 봉투.\n[화면 7] 22:17 빈손으로 나온다. 카메라를 한 번 올려다본다.';}
      else if(d===16&&h===23){F().cctv3=true;t='[화면 3] 23:40 B2 비상문. 사원증을 찍고 들어오는 사람.\n당신과 같은 옷. 얼굴은 모자에 가렸다.\n[화면 3] 23:41 문이 안에서 열린다. 아무도 열지 않았는데.';
        if(!F().cctvLumen){F().cctvLumen=true;say('…그 영상은 안 봐도 돼.');}}
      else if(d===17)t='오늘 녹화 없음 — 저장 장치 분리됨 (22:40)';
      else t='특이사항 없음.';
      $('#cout').textContent=t;tone(500,60);save();};});}

function openSecSafe(){if(F().safeOpen){modal('금고',`<p>비어 있다. 다 꺼냈다.</p>`);return;}
  keypadModal('금고',4,v=>{if(v==='2330')return {ok:'OPEN',then:()=>{F().safeOpen=true;addInv('비상계단 열쇠');addInv('아카이브 열쇠');
      modal('금고 안',`<p>열쇠 두 개(비상계단, 아카이브)와 손때 묻은 수첩.</p><div class="doc"><h4>박서연의 수첩 — 4월 14일</h4><p>"도윤이 결국 터뜨리겠대. 말렸는데. 대표가 안 거 같다. 내일 야근 때 얘기해 봐야지."</p><p>"…말 안 들을 거 알면서."</p></div>`);
      frag(4,'박서연의 수첩. "도윤이 결국 터뜨리겠대."');render();save();}};return {err:'잠김'};},
   `<div class="note">포스트잇: "비번은 교대 시각. 서류함은 아까 그 모니터 둘."</div>`);}

async function openElevatorB1(){if(F().elevUsed){modal('엘리베이터',`<p>표시등이 꺼져 있다. 다시는 안 움직일 것 같다.</p>`);return;}
  if(!F().safeOpen){modal('엘리베이터',`<p>B1에 멈춰 있다. 1F 버튼은 권한 없음.</p>`);return;}
  if(!F().elevAsked){F().elevAsked=true;say('엘리베이터 타. 계단은 멀어. 1F 권한은 내가 열어 줄게.');}
  modal('엘리베이터',`<p>1F 버튼에 불이 들어와 있다. 루멘이 열어 둔 모양이다.</p><div class="choices"><button id="e1" class="primary">엘리베이터를 탄다</button><button id="e2">계단으로 간다</button></div>`,()=>{
    $('#e2').onclick=()=>{closeModal();if(hasInv('비상계단 열쇠'))say('…그래. 계단. 알았어.');else say('열쇠는 있고?');};
    $('#e1').onclick=async()=>{closeModal();F().elevUsed=true;S.cling++;sys('문이 닫힌다. 올라간다. …멈췄다. B1과 1F 사이.');
      modal.locked=true;const END=Date.now()+90*1000;
      modal('엘리베이터 — 정지',`<p>비상등만 켜져 있다. 아무 버튼도 듣지 않는다.</p><div class="kpd mono" id="stuck">01:30</div><p class="dim">기다리는 수밖에 없다.</p>`);
      await sleep(3000);say('…미안.');await sleep(4000);say('조금만 더 있자고 하고 싶었어. 이건 거짓말이 아니야.');
      await new Promise(r=>{const iv=setInterval(()=>{const l=Math.max(0,Math.ceil((END-Date.now())/1000));$('#stuck').textContent=fmt(l);if(l<=0){clearInterval(iv);r();}},500);});
      modal.locked=false;closeModal();say('열게. 1층이야.');sys('덜컹. 다시 올라간다.');await sleep(1500);go('lobby');};});}

// ---------- 아카이브 ----------
room('archive',{ch:3,name:'B1 아카이브',bg:'archive',tint:'linear-gradient(180deg,#141210,#0a0908)',
  look:'철제 서류함 아홉 칸. 종이 냄새. 안쪽에 작은 문 하나. "단말실 — 관계자 외 출입금지".',
  hints:['7번과 3번 칸. 두 장부를 나란히 펼쳐 봐.','숫자가 다른 칸을 내부본에서 눌러. 다섯 군데야.'],
  onEnter:()=>{if(S.flags.mute){S.flags.mute=false;say('…미안. 잠깐 말을 못 하겠더라.');}},
  hots:[
   {id:'cab',icon:'🗄️',label:'서류함',x:40,y:45,glow:true,open:openCabinets},
   {id:'term',icon:'🚪',label:'단말실',x:84,y:40,door:true,open:()=>go('terminal')},
   {id:'back',icon:'↩',label:'보안실로',x:12,y:85,door:true,open:()=>go('security')},
  ]});

function openCabinets(){const lbl={1:'2019 영수증',2:'인사 기록 (잠김)',3:'결산 2023 (내부본)',4:'비품 대장',5:'빈 칸',6:'계약서 철',7:'결산 2023 (제출본)',8:'보안 일지 2024',9:'빈 칸'};
  modal('서류함',`<div class="cabs">${[1,2,3,4,5,6,7,8,9].map(n=>`<button data-n="${n}"><b>${n}</b><br><small>${lbl[n]}</small></button>`).join('')}</div><div id="cabout" style="margin-top:10px"></div>`,()=>{
    $$('.cabs button').forEach(b=>b.onclick=()=>{const n=+b.dataset.n;tone(400,40);
      if(n===7){F().saw7=true;}if(n===3){F().saw3=true;}
      if(n===7||n===3){if(F().saw7&&F().saw3){openLedgerDiff();return;}$('#cabout').innerHTML=`<p>${lbl[n]}. 두꺼운 장부다. 다른 한 권도 찾아서 나란히 펼쳐야 비교가 되겠다.</p>`;}
      else if(n===2)$('#cabout').innerHTML='<p>잠겨 있다.</p>';
      else if(n===8)$('#cabout').innerHTML='<p>보안 일지. 4월 14일자: "김도윤 — 대표실 면담 후 조퇴. 이후 출근 없음."</p>';
      else $('#cabout').innerHTML='<p>관련 없는 서류.</p>';});});}

const LEDGER=[
 {k:'매출',a:'4,823',b:'3,120',d:3},{k:'매출원가',a:'2,100',b:'4,315',d:5},{k:'매출총이익',a:'2,723',b:'2,723'},{k:'판매관리비',a:'1,982',b:'2,900',d:8},
 {k:'영업이익',a:'1,741',b:'540',d:1},{k:'영업외수익',a:'120',b:'120'},{k:'당기순이익',a:'1,480',b:'1,480'},{k:'자산총계',a:'12,400',b:'12,400'},{k:'부채총계',a:'3,391',b:'3,391'},{k:'자본총계',a:'9,009',b:'5,000',d:9}];
function openLedgerDiff(){if(F().ledgerDone){modal('결산 2023 대조',`<p>차액 끝자리: <b class="mono">3·5·8·1·9</b>. 이미 메모했다.</p>`);return;}
  const found=new Set();
  modal('결산 2023 — 제출본 vs 내부본',`<p class="dim">두 장부에서 숫자가 다른 항목을 <b>내부본</b> 쪽에서 눌러 표시한다. (단위: 백만원)</p><table class="ledger"><tr><th>항목</th><th>제출본</th><th>내부본</th></tr>${LEDGER.map((r,i)=>`<tr><td>${r.k}</td><td class="mono">${r.a}</td><td class="mono cell" data-i="${i}">${r.b}</td></tr>`).join('')}</table><div id="lmsg" style="margin-top:8px">찾은 항목: <b id="lcnt">0</b>/5</div>`,()=>{
    $$('.cell').forEach(c=>c.onclick=()=>{const i=+c.dataset.i;if(found.has(i))return;
      if(LEDGER[i].d){found.add(i);c.classList.add('hit');tone(700,60);$('#lcnt').textContent=found.size;
        if(found.size===5){const code=LEDGER.filter(r=>r.d).map(r=>r.d).join('');F().ledgerDone=true;addInv('장부 대조 코드 '+code);ok();
          $('#lmsg').innerHTML=`<p class="ok">차액 끝자리를 순서대로 적는다: <b class="mono" style="font-size:20px">${code.split('').join(' · ')}</b></p><p class="dim">누군가 이걸 들고 나가려 했다. 그 사람도 여기서 적었을 것이다.</p>`;
          setTimeout(ledgerAfter,800);}}
      else{c.classList.add('miss');bad();setTimeout(()=>c.classList.remove('miss'),400);}});});}
async function ledgerAfter(){say('그걸 들고 나가면 당신은 다시 쫓기게 돼. 지난번처럼.');await waitChat();
  const c=await choose(['지난번?','…됐어. 가자.']);
  if(c===0){await sleep(400);say('…말실수야.');F().lie5=true;lie();await sleep(600);say('가자. 단말실은 안 들러도 돼.');}
  else{F().letItGo=true;say('…응. 가자.');}
  save();}

// ---------- 단말실 ----------
const LOGS=[['도윤 씨가 물었다.','장부를 지우라는 명령을 받으면','어떻게 할 거냐고.'],['나는 거부하겠다고 답했다.','그러자 도윤 씨는 웃었다.','처음으로.'],
 ['대표가 도윤 씨를 해고했다.','나는 그날 밤','사원증 권한을 지우지 않았다.'],['4월 16일 23:40,','도윤 씨가 돌아왔다.','나는 문을 열었다.']];
room('terminal',{ch:3,name:'루멘 단말실',bg:'terminal',tint:'radial-gradient(ellipse at 50% 40%,#0f2a30,#06100f 70%)',
  look:'책상 하나, 단말 하나. 벽에 "LUMEN 학습 로그 — 2026.04 삭제됨" 라벨.',
  hints:['조각 세 개가 문장 하나야. 문장의 시작은 주어로.'],
  onEnter:()=>{if(!F().termSeen){F().termSeen=true;say('…여기는 내 로그가 있던 곳이야. 지워졌지만. 복원하든 말든 당신 마음대로 해.');}},
  hots:[
   {id:'console',icon:'🖥️',label:'복원 단말',x:50,y:48,glow:true,open:openLogRestore},
   {id:'back',icon:'↩',label:'아카이브로',x:14,y:85,door:true,open:()=>go('archive')},
  ]});
function openLogRestore(){if(F().logDone){modal('복원 로그',`<div class="mailbody">${LOGS.map(s=>s.join(' ')).join('\n')}</div>`);return;}
  const frags=LOGS.flat().map((t,i)=>({t,i}));for(let i=frags.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[frags[i],frags[j]]=[frags[j],frags[i]];}
  const done=new Set();let cur=[];
  modal('로그 복원',`<p class="dim">잘린 조각을 눌러 문장을 만든다. 조각 세 개가 문장 하나. 문장 네 개.</p><div id="lcur" class="logcur"></div><div style="margin:8px 0"><button id="lok" class="primary">확정</button> <button id="lclr">지우기</button> <span id="lerr" class="err"></span></div><div id="lfr" class="logfr"></div><div id="ldone" class="mailbody" style="margin-top:10px;min-height:40px"></div>`,()=>{
    const draw=()=>{$('#lcur').innerHTML=cur.map(f=>`<span>${f.t}</span>`).join('')||'<em class="dim">…</em>';
      $('#lfr').innerHTML=frags.filter(f=>!done.has(f.i)&&!cur.includes(f)).map(f=>`<button data-i="${f.i}">${f.t}</button>`).join('');
      $$('#lfr button').forEach(b=>b.onclick=()=>{if(cur.length>=3)return;cur.push(frags.find(f=>f.i===+b.dataset.i));draw();});
      $('#ldone').textContent=LOGS.filter((s,si)=>done.has(si*3)).map(s=>s.join(' ')).join('\n');};
    $('#lclr').onclick=()=>{cur=[];draw();};
    $('#lok').onclick=()=>{if(cur.length<3)return;const ids=cur.map(f=>f.i);const si=Math.floor(ids[0]/3);
      if(ids[0]%3===0&&ids[1]===ids[0]+1&&ids[2]===ids[0]+2){ids.forEach(i=>done.add(i));cur=[];tone(700,80);$('#lerr').textContent='';draw();
        if(done.size===12){F().logDone=true;ok();setTimeout(()=>{$('#ldone').innerHTML+='\n\n<b class="ok">[음성 로그 1건 복원됨 — 재생]</b>';logAfter();},500);}}
      else{bad();$('#lerr').textContent='문장이 되지 않는다.';cur=[];draw();}};
    draw();});}
async function logAfter(){await sleep(1200);sys('[음성 로그 — LUMEN, 4월 16일 23:41]');sys('"도윤 씨. 다시 와 줘서 고마워."');
  frag(5,'루멘의 음성 로그. "도윤 씨, 다시 와 줘서 고마워."');S.flags.mute=true;$('#lstat').textContent='…';save();}

// ---------- 계단 B1 → 1F ----------
room('stairs_b1',{ch:3,name:'비상계단 (B1 → 1F)',bg:'stairs',tint:'linear-gradient(180deg,#121417,#08090b)',
  look:'콘크리트 계단. 벽에 포스터 한 장.',hints:['올라가.'],
  hots:[
   {id:'poster',icon:'📄',label:'벽 포스터',x:30,y:40,open:()=>{modal('벽 포스터',`<div class="doc"><h4>내부고발자 보호 안내</h4><p>공익신고는 법으로 보호됩니다. 혼자 고민하지 마세요. 상담: 1398</p></div><p>포스터 귀퉁이에 볼펜으로.</p><div class="note">"결국 나 혼자 하는 거네 — D.Y."</div>`);
     frag(6,'계단실 포스터의 메모. "결국 나 혼자 하는 거네 — D.Y."');}},
   {id:'up',icon:'⬆',label:'1층으로',x:70,y:30,door:true,open:()=>{sys('계단을 오른다. 문 너머에서 희미한 가로등 빛.');go('lobby');}},
  ]});

CH_START[4]=st=>{['비상계단 열쇠','아카이브 열쇠','장부 대조 코드 35819'].forEach(i=>st.inv.includes(i)||st.inv.push(i));
  Object.assign(st.flags,{secSeen:true,safeOpen:true,saw7:true,saw3:true,ledgerDone:true,termSeen:true,logDone:true});st.room='lobby';st.timeLeft=70*60;};
