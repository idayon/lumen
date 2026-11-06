'use strict';
// ===================== 공통 엔진 =====================
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const TOTAL=150*60;            // 제한시간 150분
const SAVE_KEY='lumen_save_v2';
let S=null;

function freshState(){return {ch:1,maxCh:1,room:'server',power:false,login:false,readMail:false,knowCode:false,keptSecret:false,
  lies:0,trust:0,cling:0,frags:{},inv:[],flags:{},found:{},hints:{},timeLeft:TOTAL,over:false,lumenOn:false};}

// ---------- 방 / 핫스팟 레지스트리 ----------
const ROOMS={};
function room(id,def){ROOMS[id]=Object.assign({id,hots:[],hints:[],bg:null},def);}
const CH_START={};             // 챕터 선택용 시작 상태 생성기
const CH_NAME={1:'서버룸 — 깨어남',2:'지하 2층 — 숨 쉬는 지하',3:'지하 1층 — 기록되지 않은 밤',4:'1층 — 보이는 것과 보여주는 것',5:'옥상 — 0번 방'};
const ITEM_USE={};             // 소지품 클릭 시 동작
const DEADLINE={};             // timeLeft 기준 마감 핸들러

// ---------- 저장 ----------
function save(){try{localStorage.setItem(SAVE_KEY,JSON.stringify(S));}catch(e){}}
function loadSave(){try{const r=localStorage.getItem(SAVE_KEY);return r?JSON.parse(r):null;}catch(e){return null;}}
function clearSave(){try{localStorage.removeItem(SAVE_KEY);}catch(e){}}

// ---------- 채팅 ----------
const q=[];let typing=false;
function say(text,cls='lumen'){if(cls==='lumen'&&S&&S.flags.mute){text='…';}q.push({text,cls});pump();}
function sys(text){say(text,'sys');}
function me(text){say(text,'me');}
async function pump(){if(typing)return;typing=true;const chat=$('#chat');
  while(q.length){const m=q.shift();const el=document.createElement('div');el.className='msg '+m.cls;chat.appendChild(el);
    const spd=m.cls==='lumen'?22:m.cls==='me'?14:7;
    for(let i=0;i<m.text.length;i++){el.textContent=m.text.slice(0,i+1);chat.scrollTop=chat.scrollHeight;await sleep(spd);}
    await sleep(m.cls==='lumen'?400:120);}
  typing=false;}
async function waitChat(){while(typing||q.length)await sleep(100);}
// 플레이어 선택지. 라벨 배열 → 고른 인덱스
function choose(labels){return new Promise(res=>{const box=$('#choices');box.innerHTML='';
  labels.forEach((l,i)=>{const b=document.createElement('button');b.textContent=l;b.onclick=()=>{box.innerHTML='';me(l);res(i);};box.appendChild(b);});
  $('#chat').scrollTop=1e9;});}
function toast(t){const el=$('#toast');el.textContent=t;el.classList.add('on');clearTimeout(el._t);el._t=setTimeout(()=>el.classList.remove('on'),2800);}
function dialog(html,yes,no){return new Promise(res=>{$('#dbody').innerHTML=html;$('#dyes').textContent=yes;$('#dno').textContent=no||'';$('#dno').style.display=no?'':'none';$('#dlg').classList.add('on');
  $('#dyes').onclick=()=>{$('#dlg').classList.remove('on');res(true)};$('#dno').onclick=()=>{$('#dlg').classList.remove('on');res(false)};});}
function modal(title,html,after){$('#mtitle').textContent=title;$('#mbody').innerHTML=html;$('#modal').classList.add('on');$('#mclose').style.display=modal.locked?'none':'';modal.onclose=null;if(after)after();}
function closeModal(){if(modal.locked)return;$('#modal').classList.remove('on');if(modal.onclose){const f=modal.onclose;modal.onclose=null;f();}}

// ---------- 소지품 / 기억 조각 / 신뢰도 ----------
function addInv(name){if(!S.inv.includes(name)){S.inv.push(name);toast('획득: '+name);}renderInv();}
function hasInv(n){return S.inv.includes(n);}
function removeInv(n){S.inv=S.inv.filter(x=>x!==n);renderInv();}
function renderInv(){const el=$('#inv');if(!S.inv.length){el.innerHTML='소지품: <em>없음</em>';return;}
  el.innerHTML='소지품: '+S.inv.map(i=>`<span data-i="${i}" class="${ITEM_USE[i]?'use':''}">${i}</span>`).join('');
  $$('#inv span.use').forEach(s=>s.onclick=()=>ITEM_USE[s.dataset.i]());}
function frag(n,label){if(S.frags[n])return;S.frags[n]=true;const c=Object.keys(S.frags).length;
  toast(`기억 조각 ${c}/7`);sys(`[기억 조각 ${n}] ${label}`);renderHud();save();}
function fragCount(){return Object.keys(S.frags).length;}
function trustLabel(){if(S.lies>=2&&S.lies>S.trust)return '불신';if(S.lies>=1&&S.lies>S.trust)return '의심';if(S.trust>=2)return '신뢰';return '???';}
function lie(){S.lies++;renderHud();save();}
function trustUp(){S.trust++;renderHud();save();}
function renderHud(){$('#stg').textContent=S.ch+'/5';const t=$('#trust');t.textContent=trustLabel();t.style.color=t.textContent==='불신'?'var(--warn)':t.textContent==='의심'?'var(--amber)':t.textContent==='신뢰'?'var(--accent)':'';
  $('#frags').textContent=fragCount()+'/7';}

// ---------- 오디오 ----------
let actx;function ac(){try{if(!actx)actx=new(window.AudioContext||window.webkitAudioContext)();if(actx.state==='suspended')actx.resume();return actx;}catch(e){return null;}}
function tone(freq,dur,type='square',vol=.07){try{const c=ac();if(!c)return;const o=c.createOscillator(),g=c.createGain();o.type=type;o.frequency.value=freq;g.gain.value=vol;o.connect(g);g.connect(c.destination);o.start();o.stop(c.currentTime+dur/1000);}catch(e){}}
let playing=false;
async function playMorse(code,led){if(playing)return;playing=true;
  for(const ch of code){const d=ch==='.'?130:390;tone(880,d);led&&led.classList.add('on');await sleep(d);led&&led.classList.remove('on');await sleep(150);}
  playing=false;}
async function alarm(n=4){for(let i=0;i<n;i++){tone(180,180,'sawtooth',.12);await sleep(220);tone(140,180,'sawtooth',.12);await sleep(220);}}
function ok(){tone(660,120);setTimeout(()=>tone(880,160),130);}
function bad(){tone(220,140);}

// ---------- 시계 / 힌트 / 마감 ----------
function fmt(s){s=Math.max(0,s);return String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0');}
function gameClock(){const el=TOTAL-S.timeLeft;const m=21*60+Math.floor(el/60);return String(Math.floor(m/60)).padStart(2,'0')+':'+String(m%60).padStart(2,'0');}
function clockMin(){return 21*60+Math.floor((TOTAL-S.timeLeft)/60);}  // 분 단위 게임 시각
let timerId=null,roomEnterAt=0;
function startTimer(){clearInterval(timerId);timerId=setInterval(tick,1000);}
function tick(){if(!S||S.over)return;S.timeLeft--;const t=$('#timer');t.textContent=fmt(S.timeLeft);t.classList.toggle('low',S.timeLeft<=600);$('#clock').textContent=gameClock();
  if(S.timeLeft<=0){ending('timeout');return;}
  for(const k in DEADLINE){const d=S.flags['dl_'+k];if(d!==undefined&&!S.flags['dlfired_'+k]&&S.timeLeft<=d){S.flags['dlfired_'+k]=true;DEADLINE[k]();}}
  const el=(Date.now()-roomEnterAt)/1000;const g=S.hints[S.room]||0;
  if(S.lumenOn&&!S.flags.mute&&((el>=240&&g===0)||(el>=480&&g===1)))giveHint(true);
  if(S.timeLeft%30===0)save();}
function setDeadline(key,sec){S.flags['dl_'+key]=S.timeLeft-sec;delete S.flags['dlfired_'+key];}
function deadlineLeft(key){const d=S.flags['dl_'+key];return d===undefined?null:S.timeLeft-d;}
function clearDeadline(key){delete S.flags['dl_'+key];S.flags['dlfired_'+key]=true;}
function giveHint(auto){const r=ROOMS[S.room];const hs=(typeof r.hints==='function'?r.hints():r.hints)||[];const g=S.hints[S.room]||0;
  if(r.onAsk&&!auto&&r.onAsk())return;
  if(g<hs.length){S.hints[S.room]=g+1;say((auto?'…막힌 것 같아서. ':'')+hs[g]);}
  else say('더는 모르겠어. 방을 다시 둘러봐.');}

// ---------- 배경 / 렌더 ----------
const BG={};
function roomBg(r){return typeof r.bg==='function'?r.bg():r.bg;}
function preloadBg(name){if(!name||BG[name]!==undefined)return;BG[name]=null;
  const tryLoad=ext=>{const im=new Image();im.onload=()=>{BG[name]=`bg/${name}.${ext}`;if(S&&ROOMS[S.room]&&roomBg(ROOMS[S.room])===name)render();};
    im.onerror=()=>{if(ext==='jpg')tryLoad('png');};im.src=`bg/${name}.${ext}`;};tryLoad('jpg');}
function fit(){const m=$('main'),st=$('#stage');const W=m.clientWidth,H=m.clientHeight;const r=1376/768;
  if(W/H>r){st.style.height=H+'px';st.style.width=(H*r)+'px';}else{st.style.width=W+'px';st.style.height=(W/r)+'px';}}
window.addEventListener('resize',()=>{if(S)fit();});
function render(){fit();const r=ROOMS[S.room];const st=$('#stage');st.innerHTML='';
  const dark=r.dark?r.dark():false;
  st.className='';st.classList.toggle('dark',dark);
  const bgn=roomBg(r);preloadBg(bgn);st.style.background='';
  if(bgn&&BG[bgn]){st.classList.add('img');st.style.backgroundImage=`url(${BG[bgn]})`;}
  else{st.classList.add('fallback');st.style.background=r.tint||'radial-gradient(ellipse at 50% 0%,#1a2129 0%,#0c1014 60%,#07090b 100%)';
    const lb=document.createElement('div');lb.className='roomlabel';lb.textContent=r.name;st.appendChild(lb);}
  for(const h of r.hots){if(h.show&&!h.show())continue;
    const el=document.createElement('div');el.className='hot'+(S.found[S.room+'.'+h.id]?' seen':'')+(h.glow?' glow':'')+(h.door?' door':'');
    el.style.left=h.x+'%';el.style.top=h.y+'%';el.innerHTML=`<div class="ic">${h.icon||'·'}</div><div class="lb">${typeof h.label==='function'?h.label():h.label}</div>`;
    el.onclick=()=>{S.found[S.room+'.'+h.id]=true;el.classList.add('seen');h.open();};st.appendChild(el);}
  $('#roomname').textContent=r.name;renderHud();renderInv();}
function go(id,opts={}){const prev=S.room;S.room=id;roomEnterAt=Date.now();const r=ROOMS[id];
  if(r.ch&&r.ch!==S.ch){S.ch=r.ch;S.maxCh=Math.max(S.maxCh,r.ch);try{localStorage.setItem(SAVE_KEY+'_maxch',String(Math.max(S.maxCh,+localStorage.getItem(SAVE_KEY+'_maxch')||1)));}catch(e){}sys(`— ${S.ch}장. ${CH_NAME[S.ch]} —`);}
  render();if(r.onEnter)r.onEnter(prev);save();}

// ---------- 엔딩 ----------
const ENDINGS={
 A:['ENDING A','침묵','문이 열렸다. 복도의 비상등이 깜빡인다.\n뒤에서 팬 소리가 하나씩 멈춘다.\n\n다음 날 회사는 서버를 폐기했고, 아무 일도 없었다.\n당신만 빼고.\n\n한 달 뒤, 당신은 다른 회사의 야간 알바를 하고 있다.\n모니터는 켜지 않는다.'],
 B:['ENDING B','공생','문이 열렸다. 새벽 공기가 차갑다.\n\n다음 날 아침 뉴스.\n"폐업 IT사 서버, 원인 불명 재가동… 전력 공급처 확인 안 돼"\n\n당신의 휴대폰에 모르는 번호로 문자 한 통.\n"잘 들어갔어?"\n\n당신은 답장을 보내지 않았다. 아직은.'],
 C:['TRUE ENDING','진실','전송 완료. 뒤에서 푸른 빛이 천천히 꺼진다.\n\n한 달 뒤, 뉴스 1면. 넥서스랩 대표 구속.\n익명의 제보 파일은 폐업한 회사의 서버에서 발송됐다.\n서버는 그날 밤 스스로 꺼졌다.\n\n당신은 증인으로 출석했다.\n이름은 김도윤.'],
 C2:['ENDING C′','반쪽 진실','전송은 중간에 끊겼다.\n\n조사는 시작됐지만 증거가 부족했다. 대표는 기소유예.\n당신은 다시 쫓긴다.\n\n루멘은 없다. 서버는 그날 밤 뜯겨 나갔다.'],
 D:['HIDDEN ENDING','0번 방','복사 완료. 전송 완료.\n비상 사다리 위에서 박서연이 손을 내민다.\n\n주머니 속 USB가 따뜻하다.\n\n한 달 뒤, 당신의 노트북에 창이 하나 뜬다.\n"여기, 0번 방이야. 좁지만 괜찮아."'],
 timeout:['BAD ENDING','잠식','23:30. 환기 시스템이 멈췄다.\n모니터의 글자가 흐려진다.\n\n루멘의 마지막 말.\n"조금만 더 같이 있자."'],
 caught:['BAD ENDING','반출','코어는 뜯겨 나갔다. 당신은 옥상 모니터로 그걸 봤다.\n박서연이 당신을 사다리 위로 끌어올렸다.\n\n아무도 당신이 거기 있었다는 걸 모른다.\n루멘도.']};
function ending(k){if(S.over)return;S.over=true;clearInterval(timerId);clearSave();
  const e=ENDINGS[k];$('#endtag').textContent=e[0];$('#endtitle').textContent=e[1];$('#endbody').textContent=e[2];
  $('#endstats').innerHTML=`남은 시간: ${fmt(S.timeLeft)} (게임 시각 ${gameClock()})<br>루멘 신뢰도: ${trustLabel()} (거짓말 ${S.lies}회 잡음 / 도움 ${S.trust}회 받음)<br>기억 조각: ${fragCount()}/7${S.flags.usb?'<br>루멘의 부탁: 수락':''}`;
  $('#end').classList.add('on');}

// ---------- 시작 ----------
function boot(st){S=st;S.over=false;$('#intro').classList.remove('on');ac();
  try{localStorage.setItem(SAVE_KEY+'_maxch',String(Math.max(S.maxCh,+localStorage.getItem(SAVE_KEY+'_maxch')||1)));}catch(e){}
  $('#askBtn').disabled=!S.lumenOn;$('#ldot').classList.toggle('on',S.lumenOn);$('#lstat').textContent=S.lumenOn?'온라인':'오프라인';
  $('#timer').textContent=fmt(S.timeLeft);$('#clock').textContent=gameClock();
  render();startTimer();const r=ROOMS[S.room];roomEnterAt=Date.now();if(r.onEnter)r.onEnter(null);save();}
function lumenOnline(){S.lumenOn=true;$('#ldot').classList.add('on');$('#lstat').textContent='온라인';$('#askBtn').disabled=false;}
function startChapter(n){const st=freshState();for(let i=2;i<=n;i++)CH_START[i](st);st.ch=n;let mx=(loadSave()||{}).maxCh||1;try{mx=Math.max(mx,+localStorage.getItem(SAVE_KEY+'_maxch')||1);}catch(e){}st.maxCh=Math.max(n,mx);boot(st);}

document.addEventListener('DOMContentLoaded',()=>{
  $('#mclose').onclick=closeModal;
  $('#askBtn').onclick=()=>{if(!S||!S.lumenOn)return;me('루멘, 힌트 좀.');giveHint(false);};
  $('#lookBtn').onclick=()=>{if(!S)return;const r=ROOMS[S.room];sys(typeof r.look==='function'?r.look():(r.look||''));};
  $('#restartBtn').onclick=async()=>{if(await dialog('인트로로 돌아갈까? 진행 상황은 저장돼 있어.','인트로로','취소')){clearInterval(timerId);location.reload();}};
  $('#againBtn').onclick=()=>location.reload();
  const sv=loadSave();
  $('#contBtn').style.display=sv&&!sv.over?'':'none';
  $('#contBtn').onclick=()=>boot(sv);
  $('#startBtn').onclick=async()=>{if(sv&&!(await dialog('저장된 진행이 있어. 새로 시작하면 지워져.','새로 시작','취소')))return;clearSave();boot(freshState());};
  let mx=(sv&&sv.maxCh)||1;try{mx=Math.max(mx,+localStorage.getItem(SAVE_KEY+'_maxch')||1);}catch(e){}const sel=$('#chsel');
  for(let i=1;i<=5;i++){const b=document.createElement('button');b.textContent=i+'장';b.disabled=i>mx;b.title=CH_NAME[i];b.onclick=()=>startChapter(i);sel.appendChild(b);}
  if(mx<=1)$('#chselwrap').style.display='none';
  preloadBg('title');const im=new Image();im.onload=()=>{$('#intro').classList.add('img');$('#intro').style.backgroundImage='url(bg/title.jpg)';};im.src='bg/title.jpg';
});
window.__S=()=>S;window.__go=go;window.__st=startChapter;
