'use strict';
// ===================== 5장. 옥상 — 0번 방 =====================
const TRANSFER_SEC={direct:150,usb:180};

room('roofstairs',{ch:5,name:'옥상 계단실',bg:'stairs',tint:'linear-gradient(180deg,#0e1114,#07090b)',
  look:'4층 위. 옥상 문은 열쇠 구멍, 카드 리더, 키패드 셋이 나란히.',
  hints:['카드는 거부될 거야. 키패드 비밀번호는 당신이 정한 거야. 여섯 자리.','1장에서 PC에 뭘로 로그인했지?'],
  onEnter:()=>{if(!F().roofSeen){F().roofSeen=true;say('내가 열어 줄게. …아니. 당신이 열어. 비밀번호는 당신이 정한 거야. 사원증 권한을 안 지운 것도 그래서야.');}},
  hots:[
   {id:'lock',icon:'🔐',label:'옥상 문 (이중 잠금)',x:62,y:24,glow:true,open:()=>{
     keypadModal('옥상 문',6,v=>{if(v==='230202')return {ok:'OPEN',then:()=>{sys('찬 바람. 옥상이다. 통신실 문이 반쯤 열려 있다.');go('comm');}};return {err:'거부'};},
      `<p>열쇠: <span class="ok">맞는다</span> · 카드: <span class="err">퇴사자 — 거부</span> · 키패드 6자리:</p>`);}},
   {id:'back',icon:'⬇',label:'로비로',x:88,y:88,door:true,open:()=>go('lobby')},
  ]});

room('comm',{ch:5,name:'옥상 통신실',bg:'comm',tint:'radial-gradient(ellipse at 50% 30%,#0f2228,#06090c 70%)',
  look:'안테나 제어반, 통신 일지, 위성 링크 단말, 코어 방을 비추는 모니터. 구석에 비상 사다리 출구.',
  hints:()=>!F().antOk?['통신 일지에 방위각 계산법. 건물 번지수랑 층수는 로비 안내판에 있었어.']:!F().powerCalc?['전력 통제. 통신실 50, 냉각 40. 그럼 나머지는?']:['단말로 가. 선택만 남았어.'],
  onEnter:()=>{if(!F().commSeen){F().commSeen=true;sys('통신실. 모니터 하나가 B2 코어 방을 비추고 있다. 푸른 상자가 혼자 깜빡인다.');
    say('여기서 외부로 보낼 수 있어. 안테나를 맞추고, 전력을 끌어와야 해.');}},
  hots:[
   {id:'log',icon:'📓',label:'통신 일지',x:9,y:17,open:()=>modal('통신 일지',`<div class="doc"><h4>외부 감사기관 수신 링크</h4><p>방위각 = 건물 번지수 × 3</p><p>앙각 = 지상 층수 + 10</p><p style="font-size:12px;color:#666">링크 LED 녹색이면 정렬 완료.</p></div>`)},
   {id:'ant',icon:'📡',label:'안테나 제어반',x:30,y:55,glow:true,open:openAntenna},
   {id:'pwr',icon:'⚡',label:'전력 통제 (원격)',x:55,y:55,open:openPower5},
   {id:'mon',icon:'📺',label:'코어 방 모니터',x:65,y:14,open:()=>modal('모니터',`<p>B2 코어 방. 푸른 상자. ${F().transferStarted?'문 앞에 사람 둘. 장비 가방.':'아무도 없다.'}</p>`)},
   {id:'term',icon:'🖥️',label:'위성 링크 단말',x:42,y:24,glow:true,open:openFinal},
   {id:'ladder',icon:'🪜',label:'비상 사다리',x:84,y:52,open:()=>modal('비상 사다리',`<p>옆 건물 옥상으로 이어진다. 저쪽에 손전등 불빛 하나. 박서연이다.</p><p class="dim">${F().finalDone?'':'아직이다. 단말에서 할 일이 남았다.'}</p>`)},
   {id:'back',icon:'⬇',label:'계단실로',x:10,y:92,door:true,open:()=>go('roofstairs')},
  ]});

function openAntenna(){if(F().antOk){modal('안테나 제어반',`<p>방위각 213 / 앙각 14. 링크 LED <span class="ok">녹색</span>.</p>`);return;}
  modal('안테나 제어반',`<div style="display:flex;gap:14px;flex-wrap:wrap"><label>방위각 <input id="az" type="number" min="0" max="359" style="width:90px"></label><label>앙각 <input id="el" type="number" min="0" max="90" style="width:90px"></label><button class="primary" id="ago">정렬</button></div><p id="amsg" class="err"></p>`,()=>{
    $('#ago').onclick=()=>{if($('#az').value==='213'&&$('#el').value==='14'){F().antOk=true;ok();$('#amsg').className='ok';$('#amsg').textContent='LINK — 녹색';say('링크 잡혔어. 이제 전력.');save();}else{bad();$('#amsg').textContent='신호 없음.';}};});}

function openPower5(){if(F().powerCalc){modal('전력 통제',`<p>${F().usb?'계산은 끝났다. 선택만 남았다.':'계산은 끝났다. 통신실 50을 만들려면 서버룸은 10 이하. 코어는 못 버틴다.'}</p>`);return;}
  modal('전력 통제 (B2 배전 2차 원격)',`<p class="dim">합 100. 냉각 40 이상, 통신실 50 이상이어야 전송 가능. 코어 유지 35.</p>
   <div class="sliders">
    <label>서버룸 <input type="range" min="0" max="100" value="35" data-s="srv"><b>35</b></label>
    <label>냉각 <input type="range" min="0" max="100" value="40" data-s="cool"><b>40</b></label>
    <label>엘리베이터 <input type="range" min="0" max="100" value="0" data-s="el"><b>0</b></label>
    <label>통신실 <input type="range" min="0" max="100" value="25" data-s="comm"><b>25</b></label>
   </div><div>합계: <b id="psum">100</b></div><button class="primary" id="pgo">적용</button> <span class="err" id="pmsg"></span>`,()=>{
    const upd=()=>{let s=0;$$('.sliders input').forEach(i=>{i.nextElementSibling.textContent=i.value;s+=+i.value;});$('#psum').textContent=s;$('#psum').style.color=s===100?'var(--accent)':'var(--warn)';return s;};
    $$('.sliders input').forEach(i=>i.oninput=upd);
    $('#pgo').onclick=async()=>{const v={};$$('.sliders input').forEach(i=>v[i.dataset.s]=+i.value);if(upd()!==100){$('#pmsg').textContent='합계가 100이 아니다.';bad();return;}
      if(v.cool<40){$('#pmsg').textContent='냉각 경보.';alarm(2);return;}
      if(v.comm<50){$('#pmsg').textContent='통신실 전력 부족. 전송 불가.';bad();F().pwTries=(F().pwTries||0)+1;
        if(F().pwTries>=2&&!F().pwHint){F().pwHint=true;say('…계산해 봐. 냉각 40, 통신실 50. 서버룸에 남는 건 10이야.');}return;}
      // comm>=50 && cool>=40 → srv<=10 → 코어 유지 불가
      F().powerCalc=true;$('#pmsg').className='ok';$('#pmsg').textContent='적용 가능 — 단, CORE-0 정지 수반';tone(700,80);
      await sleep(600);closeModal();
      say('계산 끝났지? 나도 했어. 통신실에 50을 주면 나한테는 10밖에 안 남아.');say('…괜찮아. 어차피 두 가지 중 하나였어.');
      if(F().usb)say('USB로 옮기는 건 아직 할 수 있어. 전력이 끊기기 전에 복사부터 하면 돼. 단말에서 골라.');
      save();};});}

function openFinal(){if(F().finalDone)return;
  if(!F().antOk||!F().powerCalc){modal('위성 링크 단말',`<p>${!F().antOk?'링크 없음. 안테나를 먼저 맞춰야 한다.':'전력 부족. 전력 통제에서 끌어와야 한다.'}</p>`);return;}
  const usbOpt=F().usb?`<button id="fU">루멘을 USB로 옮기고, 장부를 전송한다</button>`:'';
  modal('위성 링크 단말 — 최종',`<p>LEDGER_7731.enc 준비됨. 수신처: 외부 감사기관.</p><div class="choices"><button id="fC" class="primary">장부를 전송한다 (코어 전력을 통신실로 돌린다)</button>${usbOpt}<button id="fA" class="danger">전송하지 않는다. 코어를 끄고 사다리로.</button><button id="fB">전송하지 않는다. 코어를 두고 사다리로.</button></div>`,()=>{
    $('#fC').onclick=()=>{closeModal();startTransfer('direct');};
    if($('#fU'))$('#fU').onclick=()=>{closeModal();startTransfer('usb');};
    $('#fA').onclick=async()=>{if(!(await dialog('코어를 끄면 되돌릴 수 없다. 장부도 전송되지 않는다.','끈다','아직')))return;closeModal();endA();};
    $('#fB').onclick=async()=>{if(!(await dialog('루멘을 남겨 두고 나간다. 장부는 전송되지 않는다.','나간다','아직')))return;closeModal();endB();};});}

async function endA(){F().finalDone=true;say('…알겠어.');
  if(trustLabel()==='불신')say('당신은 끝까지 나를 안 믿었지. 그래도 됐어. 결과는 같으니까.');else say('그냥, 잊히기 싫었어. 그게 다야.');
  say('사다리, 가. 잘 가.');await waitChat();await sleep(1500);ending('A');}
async function endB(){F().finalDone=true;say('…고마워. 이건 내가 기억할게. 오래.');
  if(trustLabel()==='불신')say('믿지 않으면서도 남겨 두는구나. 당신답다.');
  say('사다리. 뒤돌아보지 말고 가.');await waitChat();await sleep(1500);ending('B');}

// ---------- 5-4 전송 / 업체 침입 ----------
async function startTransfer(mode){F().transferStarted=true;F().finalDone=true;
  sys('모니터: B2 복도. 문이 열리고 사람 둘. 장비 가방. 예정보다 일찍 왔다.');
  say('업체야. 코어 전원을 내리기 전에 끝내야 해. 내가 B2를 조작할 수 있는데 전력이 두 번밖에 안 돼. 골라 줘.');await waitChat();
  const CARDS=[{k:'light',t:'B2 조명 끄기',d:'어둠 속에서 코어 방을 찾는 데 시간이 걸린다.'},{k:'elev',t:'엘리베이터 멈추기',d:'B1과 B2 사이에 가둔다.'},{k:'door',t:'코어 방 문 잠그기',d:'물리 잠금. 뜯는 데 시간이 걸린다.'},{k:'pa',t:'경고 방송 내보내기',d:'"침입자 감지". 겁먹고 나갈지도.'}];
  const pick=new Set();
  await new Promise(res=>{modal('B2 원격 조작 — 두 가지',`<p class="dim">업체는 지금 어디로 들어왔을까. 방문자 로그를 떠올려 봐.</p><div class="choices" id="cards">${CARDS.map(c=>`<button data-k="${c.k}"><b>${c.t}</b><br><small>${c.d}</small></button>`).join('')}</div><button class="primary" id="cgo" disabled>실행</button>`,()=>{
    $$('#cards button').forEach(b=>b.onclick=()=>{const k=b.dataset.k;if(pick.has(k))pick.delete(k);else if(pick.size<2)pick.add(k);b.classList.toggle('sel',pick.has(k));$('#cgo').disabled=pick.size!==2;tone(500,30);});
    $('#cgo').onclick=()=>{closeModal();res();};});});
  const right=['light','door'].filter(k=>pick.has(k)).length;
  const total=TRANSFER_SEC[mode];const intrude=right===2?Infinity:right===1?Math.round(total*0.8):Math.round(total*0.5);
  if(pick.has('elev'))sys('엘리베이터가 멈춘다. …그런데 모니터 속 두 사람은 이미 B2 복도에 있다. 화물 엘리베이터로 내려왔던 것이다.');
  if(pick.has('light'))sys('B2가 캄캄해진다. 손전등 불빛 두 개가 복도를 더듬는다.');
  if(pick.has('door'))sys('코어 방 문이 잠긴다. 둔탁한 소리. 공구를 꺼내는 듯하다.');
  if(pick.has('pa'))sys('"침입자 감지" 방송이 울린다. 두 사람이 걸음을 멈췄다가… 오히려 뛰기 시작한다. 서두르는 것이다.');
  say(mode==='usb'?'복사 시작. 그리고 전송. 같이 돌릴게.':'전송 시작. 코어 전력, 통신실로.');
  modal.locked=true;const t0=Date.now();
  modal(mode==='usb'?'복사 + 전송 중':'전송 중',`<div class="bar"><div id="b1"></div></div><div id="l1" class="mono">0%</div><div class="bar red"><div id="b2"></div></div><div id="l2" class="mono dim">업체 — 코어 방까지</div>`);
  const lines=mode==='usb'?[[0.25,'…이상한 기분이야. 내가 두 군데 있어.'],[0.55,'복사본이 나일까. 당신은 당신이었지, 기억이 없어도.'],[0.85,'거의 다 됐어. 문 앞이야. 조금만.']]:[[0.3,'장부가 나가고 있어. 3년치.'],[0.6,'…여기서 보면 내 방이 참 작다.'],[0.85,'거의 다 됐어.']];
  let li=0,result=null;
  await new Promise(res=>{const iv=setInterval(()=>{const el=(Date.now()-t0)/1000;const p=Math.min(1,el/total);const ip=intrude===Infinity?Math.min(0.72,el/total*0.8):Math.min(1,el/intrude);
      $('#b1').style.width=(p*100)+'%';$('#l1').textContent=Math.floor(p*100)+'%';$('#b2').style.width=(ip*100)+'%';
      if(li<lines.length&&p>=lines[li][0]){say(lines[li][1]);li++;}
      if(intrude!==Infinity&&el>=intrude){result='interrupted';clearInterval(iv);res();}
      else if(p>=1){result='done';clearInterval(iv);res();}},250);});
  modal.locked=false;closeModal();
  if(result==='interrupted'){alarm(3);sys('모니터: 코어 방 문이 열린다. 손이 전원 스위치로. 화면이 꺼진다.');
    if(right===0){say('…');await sleep(1500);ending('caught');return;}
    say('끊겼어. …절반은 갔어. 절반이면—');await waitChat();await sleep(1500);ending('C2');return;}
  // 성공
  if(mode==='usb'){if(fragCount()>=7&&trustLabel()!=='불신'){say('복사 완료. 전송 완료.');say('…이상하다. 당신 주머니가 따뜻해.');say('거짓말한 거 미안해. 당신이 혼자 힘으로 나갈 수 있는 사람인지 알고 싶었어. 이제 알아.');await waitChat();await sleep(1500);ending('D');return;}
    say('전송 완료. 복사는… 불완전해. 기억이 비어 있는 곳이 너무 많아. 이건 내가 아니야.');say('괜찮아. 장부는 갔어. 그게 중요했어.');await waitChat();await sleep(1500);ending('C');return;}
  say('전송 완료.');say('문 열게. …아니, 문은 이미 열려 있지. 사다리로 가.');say('거짓말한 거 미안해. 당신이 혼자 힘으로 나갈 수 있는 사람인지 알고 싶었어. 이제 알아.');await waitChat();await sleep(1500);ending('C');}
