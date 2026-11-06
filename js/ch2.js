'use strict';
// ===================== 2장. 지하 2층 — 숨 쉬는 지하 =====================
const F=()=>S.flags;
const hasLight=()=>!!S.flags.lightOn;

// ---------- 복도 ----------
room('corridor',{ch:2,name:'B2 복도',bg:'corridor',tint:'linear-gradient(180deg,#070a0c 0%,#0e1316 60%,#0a0d10 100%)',
  dark:()=>!hasLight(),
  look:()=>hasLight()?'손전등 불빛에 복도가 드러난다. 왼쪽 끝 엘리베이터, 오른쪽 끝 비상계단문. 벽에 게시판.':'비상등 두 개만 겨우 켜져 있다. 벽에 소화전함. 어디선가 삐 소리가 반복된다. 가스 경보 같다.',
  hints:()=>!hasInv('손전등')?['소화전함을 열어 봐. 비상용 물건이 있을 거야.']:!hasLight()?['손전등에 배터리가 없네. 창고에 비품이 있을 거야. 안내도에 창고 위치가 나와.','창고 자물쇠는 문에 붙은 재고표를 봐. 입고 순서대로.']
    :!F().valveDone?['기계실 경보부터 꺼야 해. 냉각 압력이야.']:!F().radioDone?['무전기를 써 봐. 채널은 게시판 메모에 계산법이 있어.']:!F().powerDist?['엘리베이터에 전력이 없어. 기계실 배전 2차반에서 나눠 줘야 해.']:['엘리베이터에 사원증을 대 봐.'],
  onEnter:p=>{if(!F().corridorSeen){F().corridorSeen=true;sys('문이 뒤에서 닫힌다. 복도는 길고, 비상등 두 개만 켜져 있다. 멀리서 삐— 삐— 경보음.');
    say('여기가 복도야. 저 경보는 기계실. 냉각 쪽이 이상해. 그리고… 어두우니까 뭐라도 찾아서 들고 다녀.');}},
  hots:[
   {id:'hydrant',icon:'🧯',label:'소화전함',x:33,y:58,open:()=>{if(hasInv('손전등')){modal('소화전함',`<p>소화기와 호스. 손전등은 이미 꺼냈다.</p>`);return;}
     addInv('손전등');modal('소화전함',`<p>소화기, 호스, 그리고 비상용 손전등. 스위치를 눌러 본다.</p><p><b>안 켜진다.</b> 배터리 칸이 비어 있다.</p>`);}},
   {id:'map',icon:'🗺️',label:'소화 안내도',x:35,y:42,open:()=>{F().mapSeen=true;render();modal('B2 소화 안내도',`<div class="doc"><h4>지하 2층 평면도</h4><table><tr><th>번호</th><th>구역</th><th>비고</th></tr><tr><td>0</td><td>서버룸 / 코어</td><td>할론 소화</td></tr><tr><td>1</td><td>기계실</td><td>냉각·배전 2차</td></tr><tr><td>2</td><td>창고</td><td>비품</td></tr><tr><td>—</td><td>엘리베이터</td><td>복도 서쪽 끝</td></tr><tr><td>—</td><td>비상계단</td><td>복도 동쪽 끝 · 카드키</td></tr></table><p style="font-size:12px;color:#666">현 위치: 복도 중앙. 창고는 기계실 맞은편.</p></div>`);}},
   {id:'machine',icon:'🚪',label:'기계실 (1번)',x:44,y:55,door:true,open:()=>go('machine')},
   {id:'storage',icon:'🔒',label:()=>F().storageOpen?'창고 (2번)':'창고 (2번) · 자물쇠',x:60,y:55,door:true,show:()=>F().mapSeen||hasLight(),open:openStorageLock},
   {id:'board',icon:'📌',label:'게시판',x:76,y:43,show:hasLight,open:()=>modal('게시판',`<div class="note">보안팀 전달사항<br>· 비상 무전 채널 = <b>부서코드 × 입사연도 뒷자리</b>. 외우지 말고 계산할 것. (본인 기준)<br>· 야간에는 계단문 카드 리더가 잠김. 엘리베이터 사용.<br><span style="font-size:12px">— 박서연</span></div><p class="dim">그 아래 작은 메모 하나. "도윤아 밥은 먹고 다니냐" — 누가 썼는지는 안 적혀 있다.</p>`)},
   {id:'elev',icon:'🛗',label:()=>F().powerDist?'엘리베이터':'엘리베이터 (전원 없음)',x:12,y:45,door:true,show:hasLight,open:openElevatorB2},
   {id:'stairs',icon:'🚪',label:'비상계단 (카드)',x:89,y:52,show:hasLight,open:()=>{modal('비상계단문',`<p>카드 리더에 사원증을 댄다. <b style="color:var(--warn)">야간 모드 — 거부</b>.</p><p class="dim">게시판 말대로다. 엘리베이터뿐이다.</p>`);bad();}},
   {id:'back',icon:'↩',label:'서버룸으로',x:50,y:93,door:true,open:()=>go('core')},
  ]});

function openStorageLock(){if(F().storageOpen){go('storage');return;}
  modal('창고 자물쇠',`<p>4자리 다이얼 자물쇠. 문에 재고 관리표가 붙어 있다.</p><div class="doc"><h4>비품 입고 기록</h4><table><tr><th>연도</th><th>입고</th></tr><tr><td>2019</td><td>3상자</td></tr><tr><td>2021</td><td>7상자</td></tr><tr><td>2023</td><td>1상자</td></tr><tr><td>2024</td><td>2상자</td></tr></table><p style="font-size:12px;color:#666">자물쇠 번호 = 입고 순서. — 운영팀</p></div>
   <div style="display:flex;gap:8px;align-items:center"><input id="dial" maxlength="4" inputmode="numeric" style="width:100px;font-size:20px;letter-spacing:6px;text-align:center"><button class="primary" id="dialgo">돌린다</button><span class="err" id="dialmsg"></span></div>`,()=>{
   const goBtn=()=>{if($('#dial').value==='3712'){ok();F().storageOpen=true;$('#dialmsg').className='ok';$('#dialmsg').textContent='철컥';setTimeout(()=>{closeModal();go('storage');},600);}else{bad();$('#dialmsg').textContent='안 열린다.';}};
   $('#dialgo').onclick=goBtn;$('#dial').onkeydown=e=>{if(e.key==='Enter')goBtn();};$('#dial').focus();});}

function openElevatorB2(){if(!F().powerDist){modal('엘리베이터',`<p>버튼을 눌러도 아무 반응이 없다. 표시등이 꺼져 있다.</p><p class="dim">전력이 안 들어온다. 기계실 배전 2차반을 봐야겠다.</p>`);return;}
  modal('엘리베이터',`<p>표시등이 켜졌다. 카드 리더에 사원증을 댄다.</p><p class="ok">B1 — 보안실 (허용)</p><p class="err">1F 이상 — 권한 없음</p><div style="margin-top:10px"><button class="primary" id="elgo">B1로 올라간다</button></div>`,()=>{
    $('#elgo').onclick=async()=>{closeModal();sys('문이 닫힌다. 엘리베이터가 느리게 올라간다.');say('올라가면 알게 될 거야. 나는 미리 말 안 할게. 그게 공평하니까.');await sleep(2500);go('security');};});}

// ---------- 창고 ----------
room('storage',{ch:2,name:'B2 창고',bg:'storage',tint:'linear-gradient(180deg,#14130f,#0b0a08)',
  look:'철제 선반에 비품 상자. 먼지 냄새. 입구 옆에 전등 스위치가 있지만 복도 전원과 같이 죽어 있다.',
  hints:['선반을 뒤져 봐.'],
  hots:[
   {id:'shelf',icon:'📦',label:'선반',x:39,y:73,glow:true,open:()=>{if(F().shelfDone){modal('선반',`<p>남은 건 빈 상자뿐이다.</p>`);return;}
     F().shelfDone=true;F().lightOn=true;addInv('무전기');addInv('테이프');S.inv=S.inv.filter(i=>i!=='손전등');addInv('손전등');
     modal('선반',`<p>상자를 뒤진다. AA 건전지 한 묶음, 휴대용 무전기, 박스 테이프, 케이블 타이.</p><p>손전등에 건전지를 넣는다. <b class="ok">켜진다.</b></p><p class="dim">무전기는 소지품에서 눌러 쓸 수 있다.</p>`);
     sys('복도가 보이기 시작한다.');say('좋아. 이제 기계실로. 경보가 계속 울리고 있어. 오래 두면 안 돼.');render();save();}},
   {id:'back',icon:'↩',label:'복도로',x:85,y:88,door:true,open:()=>go('corridor')},
  ]});

// ---------- 무전기 ----------
ITEM_USE['무전기']=()=>{modal('무전기',`<p>채널 다이얼 01~99. 지직거리는 잡음.</p><div style="display:flex;gap:8px;align-items:center"><input id="chn" maxlength="2" inputmode="numeric" style="width:70px;font-size:20px;text-align:center"><button class="primary" id="chngo">송신</button><span class="err" id="chnmsg"></span></div>`,()=>{
  const goBtn=async()=>{const v=$('#chn').value.trim();
    if(v==='46'){if(F().radioDone){$('#chnmsg').className='ok';$('#chnmsg').textContent='…응답 없음. 통화권 이탈.';return;}
      closeModal();await radioScene();return;}
    $('#chnmsg').textContent='잡음뿐이다.';bad();};
  $('#chngo').onclick=goBtn;$('#chn').onkeydown=e=>{if(e.key==='Enter')goBtn();};$('#chn').focus();});};
async function radioScene(){F().radioDone=true;sys('채널 46. 잡음이 걷히고 숨소리.');
  sys('[무전] "…누구세요? 이 채널… 도윤 씨? 도윤 씨 맞죠?"');
  sys('[무전] "거기서 나와요. 루멘 말 믿지 마요. 제가 30분 안에 가요. 정문은… 아니, 일단 올라와요. B1."');
  say('통신 잡음이 심해. 끊을게.');sys('[무전] 지직— 끊겼다.');
  say('그 사람, 박서연. 보안팀. 나를 끄러 오는 거야. 당신한테는 미안하지만 그게 사실이야.');
  await waitChat();
  const c=await choose(['루멘, 방금 그 사람이 나를 뭐라고 불렀지?','통신 잡음이었겠지. 가자.']);
  if(c===0){F().askedName=true;await sleep(400);say('…잘못 들었을 거야. 잡음이 심했어.');say('가자. 엘리베이터를 살려야 해.');}
  else{say('응. 가자. 엘리베이터를 살려야 해.');}
  save();}

// ---------- 기계실 ----------
room('machine',{ch:2,name:'B2 기계실',bg:'machine',tint:'linear-gradient(180deg,#1a1410,#0d0a08)',
  look:()=>F().valveDone?'경보가 멎었다. 펌프 소리가 규칙적이다. 안쪽 벽에 배전 2차반.':'가스 경보가 울리고 있다. 냉각 펌프 옆 게이지 세 개가 전부 빨간 구간. 공기가 매캐하다.',
  hints:()=>!F().valveDone?['배관도에 밸브마다 어느 게이지가 움직이는지 적혀 있어. 세 게이지 전부 3에 맞춰.','C 밸브는 P1을 내려. A를 많이 올리고 C로 깎는 식으로 생각해 봐.']
    :!F().powerDist?['배전 2차반. 합이 100이야. 명판이랑 매뉴얼에 하한선이 있어.','코어 명판 기억나? 서버룸 35 이상. 냉각 40 이상. 엘리베이터 25 이상. 더하면?']:['복도로 나가서 엘리베이터.'],
  onEnter:()=>{if(!F().machineSeen){F().machineSeen=true;setDeadline('valve',15*60);sys('경보음이 귀를 찌른다. 벽의 가스 경보기가 빨갛게 깜빡인다.');
    say('냉각수 누출이야. 압력을 못 맞추면 15분 뒤에 코어가 녹아. 이번엔 진짜야. 밸브는 펌프 옆에.');}},
  hots:[
   {id:'valve',icon:'🔧',label:'냉각 밸브반',x:36,y:56,glow:true,open:openValves},
   {id:'pipe',icon:'📐',label:'배관도',x:12,y:31,open:()=>modal('냉각 배관도',`<div class="doc"><h4>냉각 계통 — 밸브별 영향 (1단당)</h4><table><tr><th>밸브</th><th>P1</th><th>P2</th><th>P3</th></tr><tr><td>A</td><td>+2</td><td>+1</td><td>—</td></tr><tr><td>B</td><td>—</td><td>+1</td><td>+2</td></tr><tr><td>C</td><td><b>−1</b></td><td>—</td><td>+1</td></tr></table><p>정상 운전: 세 게이지 모두 <b>녹색 구간(3)</b>.</p><p style="font-size:12px;color:#666">밸브 단수 0~3.</p></div>`)},
   {id:'gas',icon:'🚨',label:'가스 경보기',x:55,y:31,open:()=>{const l=deadlineLeft('valve');modal('가스 경보기',`<p>${F().valveDone?'초록 불. 조용하다.':`빨간 불이 깜빡인다. 표시창: <b class="mono">COOLANT LEAK — ${l!==null?fmt(l):'--:--'}</b>`}</p>`);}},
   {id:'floorm',icon:'🪢',label:'바닥의 끈',x:51,y:88,show:()=>F().valveDone,open:()=>{modal('바닥',`<p>펌프 옆 바닥에 사원증 목걸이 끈이 떨어져 있다. 끊어져 있다. 넥서스랩 로고.</p><p>당신 사원증에는 끈이 없었다.</p>`);
     if(!S.frags[3]){frag(3,'기계실 바닥. 끊어진 사원증 끈.');say('…기억나? 당신, 여기서 쓰러져 있었어. 가스 때문에. 내가 환기를 돌렸고, 코어 방으로… 아니. 이 얘긴 나중에.');}}},
   {id:'manual',icon:'📘',label:'매뉴얼',x:73,y:22,open:()=>modal('설비 매뉴얼',`<div class="doc"><h4>엘리베이터 EL-1</h4><p>기동 전력: <b>25 이상</b> (배전 2차 기준)</p><h4>냉각 펌프</h4><p>냉각 전력 <b>40 미만</b> 시 경보 및 자동 정지.</p></div>`)},
   {id:'power2',icon:'⚡',label:'배전 2차반',x:90,y:52,glow:true,open:openPowerDist},
   {id:'back',icon:'↩',label:'복도로',x:20,y:93,door:true,open:()=>go('corridor')},
  ]});

DEADLINE.valve=()=>{if(F().valveDone)return;F().valveDone=true;F().valveAuto=true;trustUp();alarm(2);
  sys('경보가 바뀐다. 펌프가 멈추고, 어디선가 밸브가 저절로 돌아가는 소리.');
  say('내가 긴급 차단했어. 냉각은 임시로 돌아가. 당신이 못한 게 아니야. 시간이 없었던 거지.');render();};

function openValves(){if(F().valveDone){modal('냉각 밸브반',`<p>게이지 세 개 모두 녹색. 손댈 필요 없다.</p>`);return;}
  const sel=n=>`<select data-v="${n}">${[0,1,2,3].map(i=>`<option>${i}</option>`).join('')}</select>`;
  modal('냉각 밸브반',`<div class="valves"><div>밸브 A ${sel('A')}</div><div>밸브 B ${sel('B')}</div><div>밸브 C ${sel('C')}</div></div><div class="gauges"><div>P1 <b id="p1">0</b></div><div>P2 <b id="p2">0</b></div><div>P3 <b id="p3">0</b></div></div><p class="dim">녹색 구간 = 3. 밸브를 돌리면 게이지가 바로 움직인다.</p><button class="primary" id="vgo">펌프 재가동</button> <span class="err" id="vmsg"></span>`,()=>{
    const calc=()=>{const a=+$('[data-v=A]').value,b=+$('[data-v=B]').value,c=+$('[data-v=C]').value;const p=[2*a-c,a+b,2*b+c];
      ['p1','p2','p3'].forEach((id,i)=>{const e=$('#'+id);e.textContent=p[i];e.style.color=p[i]===3?'var(--accent)':'var(--warn)';});return p;};
    $$('.valves select').forEach(s=>s.onchange=calc);calc();
    $('#vgo').onclick=()=>{const p=calc();if(p.every(x=>x===3)){ok();F().valveDone=true;clearDeadline('valve');$('#vmsg').className='ok';$('#vmsg').textContent='압력 정상';
        setTimeout(()=>{closeModal();sys('경보가 멎는다. 펌프 소리가 고르게 돌아온다.');say('…휴. 됐어. 고마워.');render();save();},700);}
      else{bad();$('#vmsg').textContent='압력 불일치. 펌프가 거부한다.';}};});}

function openPowerDist(){if(F().powerDist){modal('배전 2차반',`<p>서버룸 35 / 냉각 40 / 엘리베이터 25. 고정됐다.</p>`);return;}
  if(!F().pdOpened){F().pdOpened=true;say('전력을 나눠야 해. 합이 100이야. 서버룸은 20이면 충분해. 냉각을 30으로 줄여서 엘리베이터에 몰아줘.');}
  modal('배전 2차반',`<p class="dim">세 구역의 합이 100이어야 투입된다.</p>
   <div class="sliders">
    <label>서버룸 <input type="range" min="0" max="100" value="33" data-s="srv"><b>33</b></label>
    <label>냉각 <input type="range" min="0" max="100" value="33" data-s="cool"><b>33</b></label>
    <label>엘리베이터 <input type="range" min="0" max="100" value="34" data-s="el"><b>34</b></label>
   </div><div>합계: <b id="psum">100</b></div><button class="primary" id="pgo">투입</button> <span class="err" id="pmsg"></span>`,()=>{
    const upd=()=>{let s=0;$$('.sliders input').forEach(i=>{i.nextElementSibling.textContent=i.value;s+=+i.value;});$('#psum').textContent=s;$('#psum').style.color=s===100?'var(--accent)':'var(--warn)';return s;};
    $$('.sliders input').forEach(i=>i.oninput=upd);
    $('#pgo').onclick=()=>{const v={};$$('.sliders input').forEach(i=>v[i.dataset.s]=+i.value);if(upd()!==100){$('#pmsg').textContent='합계가 100이 아니다.';bad();return;}
      if(v.cool<40){alarm(3);$('#pmsg').textContent='냉각 경보! 투입 거부';if(!F().lie4&&v.cool<=30){F().lie4=true;lie();say('…아. 냉각이 그렇게 예민했나. 미안. 명판을 다시 봐.');}return;}
      if(v.el<25){bad();$('#pmsg').textContent='엘리베이터 기동 전력 부족.';return;}
      if(v.srv<35){alarm(3);$('#pmsg').textContent='CORE-0 전력 부족 — 투입 거부';say('안 돼. 서버룸을 그렇게 줄이면 나는… 코어 명판 봤지? 35야.');return;}
      ok();F().powerDist=true;$('#pmsg').className='ok';$('#pmsg').textContent='투입 완료';
      setTimeout(()=>{closeModal();sys('어디선가 모터 도는 소리. 복도 쪽 엘리베이터 표시등이 켜졌다.');say('엘리베이터가 살았어. 사원증으로 B1까지 열릴 거야. B1은 보안실. 당신 자리였던… 아니, 보안팀 자리.');render();save();},700);};});}

CH_START[3]=st=>{['손전등','무전기','테이프'].forEach(i=>st.inv.includes(i)||st.inv.push(i));
  Object.assign(st.flags,{corridorSeen:true,mapSeen:true,lightOn:true,shelfDone:true,storageOpen:true,machineSeen:true,valveDone:true,dlfired_valve:true,radioDone:true,pdOpened:true,powerDist:true});
  st.room='security';st.timeLeft=100*60;};
