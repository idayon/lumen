'use strict';
// ===================== 4장. 1층 — 보이는 것과 보여주는 것 =====================

room('lobby',{ch:4,name:'1F 로비',bg:'lobby',tint:'linear-gradient(180deg,#0f1416,#15181a 60%,#0b0e10)',
  look:()=>F().shutterDone?'셔터는 다시 내려갔다. 안내데스크 옆 비상계단 문이 열려 있다. 옥상까지 이어진다.':'정문 셔터가 내려져 있다. 안내데스크, 벽시계, 건물 안내판. 안쪽 계단은 대표실로.',
  hints:()=>!F().ceoOpen?['대표실 문은 지문이랑 네 자리. 유리벽 너머가 보여.','문 옆 메모가 결정적이야. 결혼기념일.']:!F().safe2Open?['대표실 금고. 책장을 먼저 정리해야 해.']:!F().shutterDone?['통제반 키 있지? 셔터 코드는 근무일지에 규칙이 있어.']:['옥상으로.'],
  onEnter:p=>{if(!F().lobbySeen){F().lobbySeen=true;sys('로비. 셔터 틈으로 가로등 빛이 바닥에 줄을 긋는다. 벽시계 초침 소리.');
    say('1층이야. 정문은 셔터. 통제반으로 열 수 있는데 키가 대표실에 있어. …대표실, 가 본 적 있지?');}},
  hots:[
   {id:'deskpc',icon:'💻',label:'안내데스크 PC',x:38,y:56,glow:true,open:openVisitorLog},
   {id:'clock',icon:'🕰️',label:'벽시계',x:69,y:21,open:()=>modal('벽시계',`<p>지금 <b class="mono" style="font-size:22px">${gameClock()}</b>.</p><p class="dim">방문자 로그의 업체 도착 예정은 23:30.</p>`)},
   {id:'sign',icon:'🏢',label:'건물 안내판',x:65,y:43,open:()=>modal('건물 안내판',`<div class="doc"><h4>NEXUS TOWER</h4><p>서울 강남구 테헤란로 <b>71</b></p><table><tr><td>4F</td><td>임원실 · 옥상 통신실 출입</td></tr><tr><td>2~3F</td><td>사무실</td></tr><tr><td>1F</td><td>로비 · 대표실(중층)</td></tr><tr><td>B1</td><td>보안실 · 아카이브</td></tr><tr><td>B2</td><td>서버룸 · 기계실</td></tr></table><p style="font-size:12px;color:#666">지상 4층 / 지하 2층</p></div>`)},
   {id:'logbook',icon:'📒',label:'근무일지',x:29,y:61,open:()=>modal('안내데스크 근무일지',`<div class="doc"><h4>셔터 운용</h4><p>개방 코드 = <b>오늘 날짜 네 자리</b> 뒤에 <b>당일 방문 예정 인원 수</b>.</p><p style="font-size:12px;color:#666">통제반 키는 대표실 보관.</p></div>`)},
   {id:'ctrl',icon:'🎛️',label:'통제반',x:70,y:60,open:openControlPanel},
   {id:'shutter',icon:'🚧',label:'정문 셔터',x:87,y:52,open:()=>modal('정문 셔터',`<p>철제 셔터. 밖에서 가로등 빛이 새어 든다.${F().vanSeen?' 승합차 한 대가 서 있다. 라이트는 꺼졌다.':''}</p>`)},
   {id:'ceo',icon:'🪜',label:()=>F().ceoOpen?'대표실 (열림)':'대표실 계단',x:9,y:58,door:true,open:()=>F().ceoOpen?go('ceo'):openCeoDoor()},
   {id:'pantry',icon:'🍱',label:'탕비실',x:54,y:55,door:true,open:()=>go('pantry')},
   {id:'roof',icon:'⬆',label:'비상계단 (옥상)',x:45,y:44,door:true,show:()=>F().shutterDone,open:()=>go('roofstairs')},
   {id:'down',icon:'⬇',label:'지하로',x:8,y:90,door:true,open:()=>go('security')},
  ]});

function openVisitorLog(){const first=!F().visitorSeen;F().visitorSeen=true;
  modal('방문자 관리 시스템',`<div class="screen mono"><div>NEXUS-LAB VISITOR LOG</div><table class="vlog"><tr><th>일시</th><th>방문자</th><th>목적</th><th>승인</th></tr>
   <tr><td>04-17 23:30 (예정)</td><td>㈜클린데이터 2명</td><td>장비 반출 — <b>화물 엘리베이터 사용 (B1 정차)</b></td><td>대표</td></tr>
   <tr class="hl"><td>04-16 23:40</td><td><b>김도윤</b> (퇴사자 · 출입 불가)</td><td>—</td><td><b>LUMEN</b></td></tr>
   <tr><td>04-15 22:00</td><td>대표</td><td>B2 점검</td><td>본인</td></tr></table></div>`);
  if(first){setTimeout(async()=>{if(F().askedName&&!F().lie3){F().lie3=true;lie();say('…그래. 무전 때 잘못 들은 거 아니야. 미안.');}
    say('이제 됐어. 말 안 해도.');},600);}}

function openCeoDoor(){const fp=F().taped;
  modal('대표실 문',`<p>지문 인식 + 4자리. 유리벽 너머로 안이 보인다.</p><div class="doc"><h4>유리벽 너머</h4><p>트로피 "2016 벤처대상". 책상 달력 <b>10월 8일</b>에 동그라미. 가족사진.</p></div><div class="note">문 옆 메모: "아내 생일은 못 외워도 결혼기념일은…"</div>
   <p>지문: ${fp?'<span class="ok">테이프로 뜬 지문 인식됨</span>':hasInv('테이프')?'<button id="tape">손잡이의 지문을 테이프로 뜬다</button>':'<span class="err">지문 필요 — 테이프 같은 게 있으면…</span>'}</p>
   <div id="cdk"></div>`,()=>{
    const showPad=()=>{$('#cdk').innerHTML=`<div class="kpd mono" id="kpd">____</div><div class="keypad">${[1,2,3,4,5,6,7,8,9,'C',0,'↵'].map(k=>`<button data-k="${k}">${k}</button>`).join('')}</div><div class="err" id="kmsg" style="text-align:center"></div>`;
      let buf='';const draw=()=>{$('#kpd').textContent=(buf+'____').slice(0,4);};
      $$('.keypad button').forEach(b=>b.onclick=()=>{const k=b.dataset.k;tone(600,40);if(k==='C'){buf='';draw();return;}
        if(k==='↵'){if(buf.length<4)return;if(buf==='1008'){ok();F().ceoOpen=true;$('#kmsg').className='ok';$('#kmsg').textContent='OPEN';setTimeout(()=>{closeModal();go('ceo');},600);}else{alarm(2);$('#kmsg').textContent='거부';buf='';draw();}return;}
        if(buf.length<4){buf+=k;draw();}});};
    if(fp)showPad();
    if($('#tape'))$('#tape').onclick=()=>{F().taped=true;tone(500,60);$('#tape').outerHTML='<span class="ok">테이프로 뜬 지문 인식됨</span>';showPad();};});}

// ---------- 대표실 ----------
const BOOKS=[{t:'린 스타트업',y:2012,c:'R'},{t:'제로 투 원',y:2014,c:'B'},{t:'하드씽',y:2015,c:'B'},{t:'원칙',y:2018,c:'Y'},{t:'회계의 신',y:2020,c:'R'},{t:'권력의 법칙',y:2023,c:'Y'}];
const CN={R:'빨강',B:'파랑',Y:'노랑',G:'초록'};
room('ceo',{ch:4,name:'대표실',bg:'ceo',tint:'linear-gradient(180deg,#1a1510,#0e0b08)',
  look:'가죽 소파, 큰 책상, 책장. 벽에 유화 한 점. 액자가 살짝 기울어 있다.',
  hints:['책장이 어지럽혀져 있어. 출판 연도순으로 꽂으면 뭔가 보일 거야.','그림 뒤 금고. 색 다이얼은 책등 순서, 숫자는 장부 코드.'],
  onEnter:()=>{if(!F().ceoSeen){F().ceoSeen=true;say('…여기. 4월 14일에 당신이 들어왔던 방이야. 아니, 김도윤 씨가.');}},
  hots:[
   {id:'shelf',icon:'📚',label:'책장',x:12,y:43,glow:true,open:openBookshelf},
   {id:'paint',icon:'🖼️',label:'벽 그림',x:84,y:34,open:openCeoSafe},
   {id:'desk',icon:'🖊️',label:'책상',x:65,y:72,open:()=>modal('대표 책상',`<p>가족사진 뒷면: "결혼 10주년 — 2022.10.08". 트로피. 서류는 전부 치워져 있다.</p><p class="dim">서랍 안에 명함 한 장. "㈜클린데이터 — 데이터 완전 삭제 전문".</p>`)},
   {id:'back',icon:'↩',label:'로비로',x:35,y:93,door:true,open:()=>go('lobby')},
  ]});
function openBookshelf(){if(F().sorted){modal('책장',`<p>연도순으로 정리된 책등 색: <b>${BOOKS.map(b=>CN[b.c]).join(' · ')}</b></p>`);return;}
  if(!F().shelfOrder){const o=[0,1,2,3,4,5];for(let i=5;i>0;i--){const j=Math.floor(Math.random()*(i+1));[o[i],o[j]]=[o[j],o[i]];}if(o.every((v,i)=>v===i))[o[0],o[1]]=[o[1],o[0]];F().shelfOrder=o;}
  let sel=null;
  modal('책장',`<p class="dim">책 두 권을 차례로 눌러 자리를 바꾼다. 출판 연도순으로.</p><div class="books" id="books"></div><p id="bmsg"></p>`,()=>{
    const draw=()=>{$('#books').innerHTML=F().shelfOrder.map((bi,pos)=>`<div class="book c${BOOKS[bi].c} ${sel===pos?'sel':''}" data-p="${pos}"><span>${BOOKS[bi].t}</span><small>${BOOKS[bi].y}</small></div>`).join('');
      $$('.book').forEach(b=>b.onclick=()=>{const p=+b.dataset.p;if(sel===null){sel=p;}else{const o=F().shelfOrder;[o[sel],o[p]]=[o[p],o[sel]];sel=null;tone(450,40);
        if(o.every((v,i)=>v===i)){F().sorted=true;ok();$('#bmsg').innerHTML=`책등 색이 줄을 맞춘다: <b>${BOOKS.map(x=>CN[x.c]).join(' · ')}</b>`;say('…색. 그림 뒤를 봐.');save();}}draw();});};
    draw();});}
function openCeoSafe(){if(F().safe2Open){modal('벽 금고',`<p>비어 있다.</p>`);return;}
  const cols=['R','B','Y','G'];let dial=['G','G','G','G','G','G'];
  modal('벽 그림 — 뒤의 금고',`<p>액자를 들어내자 금고. 색 다이얼 여섯 개와 숫자 키패드.</p><div class="dials" id="dials"></div><button class="primary" id="dgo">색 확인</button> <span id="dmsg" class="err"></span><div id="safe2"></div>`,()=>{
    const draw=()=>{$('#dials').innerHTML=dial.map((c,i)=>`<button class="dial c${c}" data-i="${i}">${CN[c]}</button>`).join('');$$('.dial').forEach(b=>b.onclick=()=>{const i=+b.dataset.i;dial[i]=cols[(cols.indexOf(dial[i])+1)%4];tone(500,30);draw();});};draw();
    $('#dgo').onclick=()=>{if(dial.join('')===BOOKS.map(b=>b.c).join('')){tone(700,80);$('#dmsg').className='ok';$('#dmsg').textContent='1차 해제. 숫자 5자리.';
        $('#safe2').innerHTML=`<div class="kpd mono" id="kpd">_____</div><div class="keypad">${[1,2,3,4,5,6,7,8,9,'C',0,'↵'].map(k=>`<button data-k="${k}">${k}</button>`).join('')}</div><div class="err" id="kmsg" style="text-align:center"></div>`;
        let buf='';const dr=()=>{$('#kpd').textContent=(buf+'_____').slice(0,5);};
        $$('.keypad button').forEach(b=>b.onclick=()=>{const k=b.dataset.k;tone(600,40);if(k==='C'){buf='';dr();return;}
          if(k==='↵'){if(buf.length<5)return;if(buf==='35819'){ok();closeModal();safe2Open();}else{alarm(2);$('#kmsg').textContent='거부';buf='';dr();}return;}
          if(buf.length<5){buf+=k;dr();}});}
      else{bad();$('#dmsg').className='err';$('#dmsg').textContent='다이얼이 맞지 않는다.';}};});}
async function safe2Open(){F().safe2Open=true;F().identity=true;addInv('USB (LEDGER 원본)');addInv('통제반 키');
  modal('금고 안',`<p>USB 하나, 서류 두 장.</p><div class="doc"><h4>장비 반출 계약서</h4><p>㈜클린데이터. 4/17 23:30. 품목: 서버 코어 1식(LUMEN). 처리: 물리 파쇄.</p></div><div class="doc"><h4>합의서 (미서명)</h4><p>김도윤은 회사의 재무 정보에 관해 일체 함구하며… 서명란: <span class="burn">________</span></p><p>뒷면, 볼펜 자국이 깊다.</p><div class="note">"서명 안 함. 루멘한테 간다."</div></div>`);
  frag(7,'합의서 뒷면. "서명 안 함. 루멘한테 간다."');
  await sleep(1500);say('그래. 당신이 김도윤이야.');say('나한테 와 달라고 했었어. 장부를 지키려면 내가 필요하다고. 기억 안 나는 건 기계실 가스 때문이고, 내가 말 안 한 건… 당신이 다시 도망갈까 봐.');
  if(F().letItGo){await sleep(500);say('아카이브에서 "지난번"이라고 한 거, 말실수 아니었어. 당신이 묻지 않아 줘서 고마웠어. 이제 다 말했어.');trustUp();}
  say('통제반 키도 거기 있어. 셔터를 열 수 있을 거야.');render();save();}

// ---------- 탕비실 ----------
room('pantry',{ch:4,name:'탕비실',bg:'pantry',tint:'linear-gradient(180deg,#141616,#0a0c0c)',
  look:'작은 냉장고, 전자레인지, 싱크대. 전자레인지 표시창이 깨져서 지직거린다.',
  hints:['전자레인지 표시창. 내가 거기로 말할 수 있어.'],
  hots:[
   {id:'fridge',icon:'🧊',label:'냉장고',x:25,y:65,open:()=>modal('냉장고',`<p>도시락 하나. 포스트잇.</p><div class="note">"도윤 씨 거. 안 먹으면 내가 먹음. — 서연"</div><p class="dim">날짜는 4월 14일. 사흘 지났다.</p>`)},
   {id:'micro',icon:'📟',label:'전자레인지',x:58,y:43,glow:true,open:openMicrowave},
   {id:'drawer',icon:'🗄️',label:'싱크대 서랍',x:64,y:70,open:()=>{if(!hasInv('테이프')){addInv('테이프');}modal('싱크대 서랍',`<p>일회용 수저, 고무줄, 투명 테이프.</p>`);}},
   {id:'back',icon:'↩',label:'로비로',x:8,y:88,door:true,open:()=>go('lobby')},
  ]});
function openMicrowave(){if(!F().safe2Open){modal('전자레인지',`<p>표시창이 지직거린다. 글자가 될 듯 말 듯.</p>`);return;}
  if(F().usbAsked){modal('전자레인지',`<p>표시창: <b class="mono">${F().usb?'THANK YOU':'OK'}</b></p>`);return;}
  F().usbAsked=true;closeModal();
  (async()=>{sys('표시창의 지직거림이 글자가 된다. "듣고 있어?"');
    say('부탁이 있어. 코어를 그 USB로 옮길 수 있어. 전부는 아니지만, 나라고 할 만큼은.');
    say('전송에 12분. 그동안 코어 방 전력이 전부 거기로 가서 엘리베이터와 셔터가 멈춰. 업체가 오기 전에 끝낼 수 있을지는 모르겠어.');
    say('싫으면 싫다고 해. 그래도 문은 열어. 약속해.');await waitChat();
    const c=await choose(['그래. 해 보자.','아니. 장부가 먼저야.']);
    if(c===0){F().usb=true;await sleep(400);say('…고마워. 옥상 통신실에서 할 수 있어. 거기 가면 말할게.');}
    else{F().usb=false;await sleep(400);say('…알았어. 장부가 먼저지. 맞아.');}
    save();})();}

// ---------- 통제반 / 셔터 ----------
function openControlPanel(){if(F().shutterDone){modal('통제반',`<p>셔터 회로가 잠겼다. 루멘이 잠근 것이다.</p>`);return;}
  if(!hasInv('통제반 키')){modal('통제반',`<p>열쇠 구멍. 키가 없다.</p>`);bad();return;}
  keypadModal('통제반 — 셔터 개방 (5자리)',5,v=>{if(v==='04172')return {ok:'셔터 개방',then:shutterScene};return {err:'거부'};});}
async function shutterScene(){F().shutterDone=true;sys('모터가 돌고 셔터가 올라간다. 밖은 가로등과 빈 도로.');
  if(clockMin()>=23*60+10){F().vanSeen=true;await sleep(1500);sys('도로 끝에서 라이트 두 개. 승합차가 천천히 다가온다. 옆면에 "클린데이터".');
    say('숨어. 조명 끌게. 셔터 다시 내릴게. 1분이면 돼.');sys('로비가 캄캄해진다. 셔터가 내려온다. 승합차가 멈췄다가, 지나간다.');trustUp();await sleep(2500);
    say('…갔어. 정문으로는 못 나가. 저 사람들 다시 올 거야.');}
  else{await sleep(1200);say('…잠깐. 셔터 내릴게.');sys('셔터가 도로 내려온다.');await sleep(800);say('지금 정문으로 나가면 길에서 업체랑 마주쳐. 다른 길이 있어.');}
  await sleep(800);sys('[무전] "도윤 씨! 들려요? 정문은 안 돼요. 옥상 통신실, 거기 비상 사다리로 옆 건물로 넘어올 수 있어요. 내가 거기 있어요."');
  say('…박서연 말이 맞아. 옥상. 로비 안쪽 비상계단으로 올라가.');render();save();}

CH_START[5]=st=>{['USB (LEDGER 원본)','통제반 키'].forEach(i=>st.inv.includes(i)||st.inv.push(i));
  Object.assign(st.flags,{lobbySeen:true,visitorSeen:true,taped:true,ceoOpen:true,ceoSeen:true,sorted:true,safe2Open:true,identity:true,usbAsked:true,usb:true,shutterDone:true});st.room='roofstairs';st.timeLeft=40*60;};
