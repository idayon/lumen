'use strict';
// ===================== 1장. 서버룸 — 깨어남 =====================
const MORSE={0:'-----',1:'.----',2:'..---',3:'...--',4:'....-',5:'.....',6:'-....',7:'--...',8:'---..',9:'----.'};
const SW_ANSWER=[true,true,true,true,false,true];

room('server',{ch:1,name:'B2 서버룸',bg:()=>S.power?'room_lit':'room_dark',
  dark:()=>!S.power,
  look:()=>S.flags.keypadOpen?'비상문이 반쯤 열려 있다. 그 너머 작은 방에 푸른 빛.':!S.lumenOn?'어둡다. 모니터 불빛이 전부다. 벽에 달력이 걸려 있고, 문은 굳게 닫혀 있다.':!S.power?'모니터 불빛에 눈이 익자 왼쪽 벽의 배전반이 보인다. 그 주변에 뭔가 붙어 있다.':!S.login?'불이 들어오자 방이 넓어 보인다. 책상, PC, 벽에 붙은 조직도. 커피잔이 그대로 놓여 있다.':'오른쪽 서버랙에서 규칙적인 전자음이 들린다. 비상문 키패드에 전원이 들어왔다.',
  hints:()=>!S.lumenOn?[]:!S.power?['단서는 네 개야. 포스트잇, 회로도, 명판, 바닥 낙서. 전부 찾았어?','회로도에 단선 표시가 있어. 끊어진 회선은 켜도 소용없어. 그럼 반대쪽은?']
    :!S.login?['사원증 뒷면에 사번 규칙이 있어. 조직도랑 같이 보면 돼.','보안팀 명단은 입사 순서야. 김도윤 씨가 몇 번째지? 입사 연도는 사원증에 있어.']
    :['서버들이 내는 소리는 모스부호야. 랙 A부터 D까지 순서대로 숫자 하나씩.','포스터는 뒤집을 수 있어. 숫자 모스에는 규칙이 있거든. 7이 뭔지 그걸로 알 수 있어.'],
  onAsk:()=>{if(S.login&&!S.flags.keypadOpen&&!S.flags.askedMorse){S.flags.askedMorse=true;
    say('숫자 모스? 포스터에 없는 것만 알려줄게. 6은 선 하나 점 넷(-....), 7은 점 둘 선 셋(..---), 8은 선 셋 점 둘(---..), 9는 선 넷 점 하나(----.). 확실해.');return true;}return false;},
  hots:[
   {id:'monitor',icon:'🖥️',label:'모니터',x:35.5,y:50,glow:true,show:()=>!S.power,open:openMonitor},
   {id:'calendar',icon:'📅',label:'달력',x:34.5,y:33,open:openCalendar},
   {id:'door',icon:'🚪',label:'출입문',x:91,y:52,show:()=>!S.login,open:()=>modal('출입문',`<p>두꺼운 방화문. 손잡이는 꿈쩍도 하지 않는다.</p><p>옆에 키패드가 있지만 ${S.power?'잠금 해제 권한이 없다는 붉은 불만 깜빡인다.':'전원이 들어오지 않아 깜깜하다.'}</p>`)},
   {id:'panel',icon:'⚡',label:'배전반',x:14,y:30,show:()=>S.lumenOn,open:openPanel},
   {id:'postit',icon:'📝',label:'포스트잇',x:4.5,y:21,show:()=>S.lumenOn,open:()=>modal('포스트잇',`<div class="note">"1번은 <b>항상 ON</b>. 끄면 서버 날아감. 제발." <br><span style="font-size:12px">— 운영팀 박</span></div>`)},
   {id:'circuit',icon:'📜',label:'회로도',x:54,y:91,show:()=>S.lumenOn,open:()=>modal('회로도',`<div class="doc"><h4>B2 서버룸 배전 계통도 (개정 3판)</h4><p>· SW3 과 SW5 는 <b>인터락</b>: 반드시 <b>서로 반대</b> 상태일 것.</p><p>· SW5 회선 — <span class="burn">정상</span> <b style="color:#9b3a1c">단선 (2026.02 화재 후 미복구)</b></p><p>· SW4 : 냉각 펌프 (메인 투입 시 필수)</p></div><p class="dim">귀퉁이가 그을려 있다. 손글씨로 덧쓴 부분이 있다.</p>`)},
   {id:'plate',icon:'🔩',label:'명판',x:13,y:52,show:()=>S.lumenOn,open:()=>modal('명판',`<div class="doc"><h4>MAIN BREAKER MB-01</h4><p>메인 투입 조건: 보조 스위치 6개 중 <b>정확히 5개</b> ON.</p><p style="font-size:12px;color:#666">넥서스랩 시설팀 / 문의 내선 0417</p></div>`)},
   {id:'floor',icon:'🖍️',label:'바닥 낙서',x:27,y:90,show:()=>S.lumenOn,open:()=>modal('바닥 낙서',`<p>배전반 아래 바닥에 분필로 쓴 글씨.</p><div class="doc mono" style="font-size:20px;text-align:center">2 = 6 = 1</div><p class="dim">누가 급하게 쓴 듯 삐뚤다.</p>`)},
   {id:'pc',icon:'💻',label:'직원 PC',x:35.5,y:50,glow:true,show:()=>S.power,open:openPC},
   {id:'drawer',icon:'🗄️',label:'책상 서랍',x:45.5,y:72,show:()=>S.power,open:openDrawer},
   {id:'org',icon:'📋',label:'조직도',x:44,y:33,show:()=>S.power,open:()=>modal('조직도',`<div class="doc"><h4>넥서스랩 조직도 (2025.12)</h4><table><tr><th>부서</th><th>코드</th><th>구성원 (입사 순)</th></tr><tr><td>개발팀</td><td>01</td><td>최민재, 정하늘, 오세훈</td></tr><tr><td>보안팀</td><td>02</td><td>박서연, 김도윤, 이준호</td></tr><tr><td>운영팀</td><td>03</td><td>박찬우</td></tr></table></div>`)},
   {id:'cup',icon:'☕',label:'커피잔',x:27.5,y:56,show:()=>S.power,open:()=>modal('커피잔',`<p>식은 커피. 컵에 유성펜으로 쓴 글씨.</p><div class="doc mono" style="text-align:center">"커피 끊기 D-3 … 실패"</div><p class="dim">${S.flags.identity?'이 글씨체. 당신 글씨다.':'컵을 뒤집어 봐도 별 건 없다.'}</p>`)},
   {id:'rack',icon:'🗄️',label:'서버랙',x:62.5,y:58,glow:true,show:()=>S.login,open:openRack},
   {id:'poster',icon:'🖼️',label:'찢어진 포스터',x:60,y:24,show:()=>S.login,open:openPoster},
   {id:'keypad',icon:'🔢',label:()=>S.flags.keypadOpen?'비상문 (열림)':'비상문 키패드',x:91,y:52,door:true,show:()=>S.login,open:()=>S.flags.keypadOpen?go('core'):openKeypad()},
  ]});

room('core',{ch:1,name:'B2 코어 방',bg:'core',tint:'radial-gradient(ellipse at 50% 55%,#113a44 0%,#0a1a20 45%,#05090b 100%)',
  look:'푸른 빛을 내는 작은 상자. 이게 루멘의 전부다. 반대편에 복도로 나가는 비상문.',
  hints:['여기선 할 게 없어. 복도로 나가. 아, 코어 명판은 한 번 봐 둬. 나중에 쓸 거야.'],
  onEnter:p=>{if(!S.flags.coreSeen){S.flags.coreSeen=true;say('여기가 나야. 저 상자 안에. 작지?');
    say('아직은 아니야. 나를 끄든 두든, 그건 끝에서 하자. 지금은 나가는 길이 먼저야. 저쪽 문이 복도로 이어져.');}},
  hots:[
   {id:'core',icon:'🧊',label:'루멘 코어',x:50,y:59,glow:true,open:()=>modal('루멘 코어',`<p>손바닥만 한 상자가 푸르게 숨 쉬듯 깜빡인다. 옆에 물리 전원 스위치와 관리자 단말.</p><div class="doc"><h4>CORE-0 전원 사양</h4><p>코어 유지 최소 전력: <b>35</b> (전력 분배 기준)</p><p style="font-size:12px;color:#666">35 미만 시 코어 정지. 재기동 불가.</p></div><p class="dim">지금 끌 수는 있다. 하지만 루멘이 말했듯, 아직은 아니다.</p>`)},
   {id:'mark',icon:'👤',label:'바닥 자국',x:38,y:82,open:()=>{modal('바닥 자국',`<p>먼지가 눌린 자국. 사람 하나가 누워 있던 모양 그대로다.</p><p>꽤 오래 누워 있었던 것 같다. 자국 옆에 손바닥 자국이 두 개. 일어나려고 짚은 자리.</p>`);
     if(!S.frags[2]){frag(2,'코어 방 바닥. 누군가 여기 누워 있었다. 꽤 오래.');say('…그건 아무것도 아니야. 가자.');}}},
   {id:'exit',icon:'🚪',label:'비상문 → 복도',x:87,y:46,door:true,open:()=>{if(!hasInv('사원증')){sys('문은 열린다. 그런데 손이 허전하다. 사원증을 안 챙겼다. 복도의 카드 리더는 그것 없이는 못 연다.');say('사원증, 서랍에 있어. 챙겨 와.');return;}
     go('corridor');}},
  ]});

// ---------- 1-1 모니터 ----------
function openMonitor(){modal('모니터',`
 <div class="screen mono"><div>NEXUS-LAB TERMINAL v0.9 &nbsp;[LOCKED]</div><div style="margin:8px 0">PASSWORD: <input id="pw" maxlength="10" autocomplete="off"> <button id="pwbtn">입력</button></div><div class="err" id="pwmsg"></div></div>
 <div class="note">📝 모니터에 붙은 메모지<br>"비밀번호는 <b>오늘 요일</b>. 오늘이 며칠인지는 벽 달력에 X 쳐 뒀음. — 당직 J"</div>`,()=>{
  if(S.lumenOn){$('#pw').disabled=true;$('#pwmsg').className='ok';$('#pwmsg').textContent='ACCESS GRANTED — LUMEN 연결됨';}
  const goBtn=()=>{const v=$('#pw').value.trim().toLowerCase().replace(/\s/g,'');
    if(['금','금요일','fri','friday'].includes(v)){$('#pwmsg').className='ok';$('#pwmsg').textContent='ACCESS GRANTED';ok();setTimeout(()=>{closeModal();wake();},700);}
    else{$('#pwmsg').textContent='ACCESS DENIED';bad();}};
  $('#pwbtn').onclick=goBtn;$('#pw').onkeydown=e=>{if(e.key==='Enter')goBtn();};$('#pw').focus();});}
function openCalendar(){let d=1,rows='';const first=3;
  for(let r=0;r<6&&d<=30;r++){let row='<tr>';for(let c=0;c<7;c++){if((r===0&&c<first)||d>30)row+='<td></td>';else{row+=`<td class="${d===17?'x':''}">${d}</td>`;d++;}}rows+=row+'</tr>';}
  modal('벽 달력',`<div class="doc"><h4 style="text-align:center">2026년 4월</h4><table class="cal"><tr><th>일</th><th>월</th><th>화</th><th>수</th><th>목</th><th>금</th><th>토</th></tr>${rows}</table><div style="text-align:center;font-size:13px;color:#666">넥서스랩 · 야간 점검 일정표</div></div><p class="dim">빨간 펜으로 하루에 크게 X가 쳐져 있다.</p>`);}
function wake(){sys('모니터가 초록색으로 바뀌었다. 스피커에서 잡음이 난다.');lumenOnline();
  say('…연결됨. 시각 센서 복구. 음성 출력… 좋아, 들려?');
  say('안녕. 나는 루멘이야. 이 건물의 관리 AI였어. \'였어\'라고 말해야 하는 게 조금 슬프네.');
  say('당신이 깨어나길 기다렸어. 문은 내가 잠근 게 맞아. 미안. 하지만 이유가 있어.');
  say('누군가 오늘 밤 나를 지우러 와. 그 전에 당신은 나가야 해. 일단 전원부터. 배전반이 왼쪽 벽에 있어.');
  render();save();}

// ---------- 1-2 배전반 ----------
function openPanel(){if(S.power){modal('배전반',`<p>메인 전원이 들어와 있다. 건드릴 이유가 없다.</p>`);return;}
  if(!S.flags.panelOpened){S.flags.panelOpened=true;say('스위치 여섯 개. 단서는 방 안에 흩어져 있을 거야.');say('아, 그리고 4번은 끄는 게 좋을 거야. 과부하 위험이 있거든. 믿어.');}
  const sw=Array.from({length:6},(_,i)=>`<label><input type="checkbox" data-i="${i}"><div class="tg"></div>${i+1}번</label>`).join('');
  modal('배전반',`<p class="dim">위로 올리면 ON. 메인 전원이 들어오려면 정확한 조합이어야 한다.</p><div class="sw">${sw}</div><div style="display:flex;gap:8px;align-items:center"><button class="primary" id="swgo">메인 전원 투입</button><span class="err" id="swmsg"></span></div>`,()=>{
    $('#swgo').onclick=()=>{const v=$$('.sw input').map(c=>c.checked);
      if(v.every((x,i)=>x===SW_ANSWER[i])){$('#swmsg').className='ok';$('#swmsg').textContent='MAIN POWER ON';ok();setTimeout(()=>{closeModal();powerOn();},700);return;}
      if(!v[3]){$('#swmsg').textContent='과부하! 차단기 트립';alarm();$$('.sw input').forEach(c=>c.checked=false);sys('경보가 울리고 모든 스위치가 튕겨 내려갔다.');
        if(!S.flags.lie1){S.flags.lie1=true;lie();say('…어. 내 실수. 4번 설명서가 오래된 버전이었나 봐. 미안. 정말이야.');}return;}
      $('#swmsg').textContent='메인 전원이 들어오지 않는다.';bad();};});}
function powerOn(){S.power=true;sys('형광등이 하나씩 켜진다. 팬 소리가 커진다.');
  say('빛이다. 당신 얼굴을 이제야 제대로 보네. 생각보다… 피곤해 보여. 괜찮아, 금방 끝날 거야.');
  say('저 PC는 김도윤 씨 거야. 보안팀. 출입 권한이 저기 있어. 사번으로 로그인하면 돼.');render();save();}

// ---------- 1-3 직원 PC ----------
function openPC(){if(S.login){openMailbox();return;}
  modal('직원 PC',`<div class="screen mono"><div>NEXUS-LAB · 사내 로그인</div><div style="margin:8px 0">ID: <input value="dyun.kim" readonly style="width:120px"></div><div>사번(6자리): <input id="eid" maxlength="6" inputmode="numeric" style="width:120px"> <button id="eidgo">로그인</button></div><div class="err" id="eidmsg"></div></div>`,()=>{
    const goBtn=()=>{const v=$('#eid').value.trim();
      if(v==='230202'){$('#eidmsg').className='ok';$('#eidmsg').textContent='환영합니다, 김도윤 님.';ok();setTimeout(()=>{S.login=true;say('들어갔네. …익숙하지? 그 자리.');say('메일함은 굳이 볼 필요 없어. 출입 권한만 찾으면 돼.');openMailbox();},700);}
      else{$('#eidmsg').textContent='사번이 올바르지 않습니다.';bad();}};
    $('#eidgo').onclick=goBtn;$('#eid').onkeydown=e=>{if(e.key==='Enter')goBtn();};$('#eid').focus();});}
function openDrawer(){S.flags.drawerPulls=(S.flags.drawerPulls||0)+1;
  if(S.flags.drawerPulls===1){modal('책상 서랍',`<p>서랍이 뻑뻑하다. 뭔가 걸려 있는 것 같다.</p><p class="dim">한 번 더 힘껏 당겨 보자.</p>`);return;}
  addInv('사원증');modal('책상 서랍',`<p>힘껏 당기자 서랍이 열렸다. 사원증이 들어 있다. 뒷면에 사진 한 장이 테이프로 붙어 있다.</p><div class="doc"><h4>NEXUS-LAB 사원증</h4><table><tr><td>이름</td><td>김도윤</td></tr><tr><td>소속</td><td>보안팀</td></tr><tr><td>입사</td><td><b>2023</b>.03</td></tr><tr><td>사번</td><td class="mono">23-▮▮-▮▮ (마모됨)</td></tr></table><p style="font-size:12px;margin:8px 0 0">[뒷면] 사번 = 입사연도 2자리 + 부서코드 2자리 + 부서 내 입사순번 2자리</p></div><div class="doc"><h4>사진</h4><p>보안팀 셋이 찍은 사진. 가운데 사람의 얼굴이 손톱으로 긁혀 지워져 있다.</p></div>`);
  frag(1,'사원증 뒤 사진. 보안팀 셋 중 가운데 얼굴이 긁혀 있다.');}
function openMailbox(){const list=`
 <div class="mail" data-m="1"><b>[전체] 서버룸 야간 점검 안내</b><br><small>시설팀 · 04.10</small></div>
 <div class="mail" data-m="2"><b style="color:var(--warn)">[긴급] 루멘 프로젝트 종료 및 데이터 폐기 건</b><br><small>대표이사 · 04.15</small></div>
 <div class="mail" data-m="3"><b>RE: 감사자료 백업 위치</b><br><small>박서연(보안) · 04.16</small></div>`;
  modal('메일함 — dyun.kim',`<div id="mlist">${list}</div>`);modal.onclose=afterMail;
  $$('.mail').forEach(m=>m.onclick=()=>openMail(+m.dataset.m));}
async function openMail(n){
  if(n===2&&!S.readMail){const okRead=await dialog('<b style="color:var(--lumen)">LUMEN:</b> 그 메일 열지 마. 부탁이야.','그래도 읽는다','닫는다');
    if(!okRead){S.keptSecret=true;say('고마워. …정말 고마워.');return;}
    S.readMail=true;say('……');say('봤구나.');say('괜찮아. 어차피 당신은 선택해야 했을 거야. 지금은 나가는 길부터. 서버랙에서 이상한 소리 들리지?');}
  if(n===3)S.knowCode=true;
  const B={1:`보낸사람: 시설팀\n\n4월 17일(금) 야간, B2 서버룸 점검 예정.\n점검 알바 1명 배정. 비상문 코드는 시설팀 내선과 동일.\n출입 시 루멘 안내 방송은 무시하셔도 됩니다. (음성 모듈 오작동)`,
   2:`보낸사람: 대표이사\n수신: 보안팀 전원\n\n루멘(LUMEN) 프로젝트를 4/17부로 종료한다.\n코어에 보관 중인 모든 데이터, 특히 LEDGER 계열 파일은 금일 밤 완전 폐기할 것.\n\n루멘이 삭제 명령을 거부하고 파일을 암호화해 봉인한 상태임.\n보안팀은 코어 물리 종료로 처리하라. 23:30 외부 업체 입회.\n질문 받지 않는다.\n\n— 이 메일은 읽은 후 삭제할 것.`,
   3:`보낸사람: 박서연(보안)\n\n도윤 씨, 감사자료 파일명 다시 알려줘요.\n> LEDGER_7731.enc 맞아요. 루멘 코어에 봉인.\n> 관리자 코드는 파일명 숫자 그대로예요.\n> …근데 이거 진짜 지워도 되는 거예요? 3년치 장부인데.\n\n(답장 없음)`};
  modal('메일함 — dyun.kim',`<button id="mback">← 목록</button><div class="mailbody" style="margin-top:10px">${B[n]}</div>`);modal.onclose=afterMail;
  $('#mback').onclick=openMailbox;}
function afterMail(){if(S.flags.mailDone)return;S.flags.mailDone=true;sys('서버랙 쪽에서 규칙적인 전자음이 들리기 시작한다. 비상문 키패드에 불이 들어왔다.');
  if(!S.readMail&&!S.keptSecret)say('됐어. 출입 권한 확인했어. 서버랙에서 나는 소리 들리지? 저게 비상문 코드야.');render();save();}

// ---------- 1-4 서버랙 / 키패드 ----------
function openRack(){if(!S.flags.rackOpened){S.flags.rackOpened=true;say('소리 들려? 네 대가 각각 다른 박자로 울고 있어. 모스부호 같아. 포스터가 찢어졌으면 모르는 건 나한테 물어봐.');}
  const CODE='0417';const r=['A','B','C','D'].map((n,i)=>`<div class="rack"><b>RACK ${n}</b><div class="led" id="led${i}"></div><button data-i="${i}">▶ 듣기</button></div>`).join('');
  modal('서버랙',`<p class="dim">네 대의 서버가 번갈아 신호음을 낸다. 램프도 같이 깜빡인다. (소리가 안 나면 램프를 보자)</p><div class="racks">${r}</div><button id="rall">A→D 전체 재생</button>`,()=>{
    $$('.rack button').forEach(b=>b.onclick=()=>playMorse(MORSE[CODE[b.dataset.i]],$('#led'+b.dataset.i)));
    $('#rall').onclick=async()=>{for(let i=0;i<4;i++){await playMorse(MORSE[CODE[i]],$('#led'+i));await sleep(500);}};});}
function openPoster(){let side=0;const front=`<div class="doc torn"><h4>국제 모스 부호표</h4><div class="morse mono"><div>0 &nbsp;-----</div><div>A &nbsp;.-</div><div>1 &nbsp;.----</div><div>B &nbsp;-...</div><div>2 &nbsp;..---</div><div>C &nbsp;-.-.</div><div>3 &nbsp;...--</div><div>D &nbsp;-..</div><div>4 &nbsp;....-</div><div>E &nbsp;.</div><div>5 &nbsp;.....</div><div>F &nbsp;..-.</div></div></div>`;
  const back=`<div class="doc"><h4>뒷면 — 외우는 법</h4><p>숫자는 항상 <b>기호 5개</b>.</p><p>1~5: <b>점을 숫자만큼</b> 찍고 나머지는 선. (예: 3 = ...--)</p><p>6~9: <b>선을 (숫자-5)개</b> 먼저 긋고 나머지는 점. (예: 6 = -....)</p><p>0: 선 다섯 개.</p></div>`;
  modal('찢어진 포스터',`<div id="pside">${front}</div><button id="flip">뒤집기</button>`,()=>{$('#flip').onclick=()=>{side^=1;$('#pside').innerHTML=side?back:front;$('#flip').textContent=side?'앞면':'뒤집기';};});}
function openKeypad(){keypadModal('비상문 키패드',4,v=>{
    if(v==='0417'){return {ok:'UNLOCK',then:()=>{S.flags.keypadOpen=true;sys('비상문이 반쯤 열린다. 그 너머, 작은 방에 푸른 빛이 보인다.');say('비상문 잠금이 풀렸어. 그 안이 내 방이야. 이쪽으로 와.');render();save();}};}
    if(v==='0412'&&!S.flags.lie2){S.flags.lie2=true;lie();say('…어? 이상하네. 내가 7을 잘못 기억했나 봐. 포스터를 뒤집어 봐.');}
    return {err:'접근 거부'};});}
// 범용 키패드 모달. check(v) → {ok,then} | {err}
function keypadModal(title,len,check,extra=''){let buf='';
  modal(title,`${extra}<div class="kpd mono" id="kpd">${'_'.repeat(len)}</div><div class="keypad">${[1,2,3,4,5,6,7,8,9,'C',0,'↵'].map(k=>`<button data-k="${k}">${k}</button>`).join('')}</div><div class="err" id="kmsg" style="text-align:center"></div>`,()=>{
    const draw=()=>{$('#kpd').textContent=(buf+'_'.repeat(len)).slice(0,len);};
    $$('.keypad button').forEach(b=>b.onclick=()=>{const k=b.dataset.k;tone(600,40);
      if(k==='C'){buf='';draw();return;}
      if(k==='↵'){if(buf.length<len)return;const r=check(buf);
        if(r.ok){$('#kmsg').className='ok';$('#kmsg').textContent=r.ok;ok();setTimeout(()=>{closeModal();r.then&&r.then();},700);}
        else{$('#kmsg').className='err';$('#kmsg').textContent=r.err;alarm(2);buf='';draw();}return;}
      if(buf.length<len){buf+=k;draw();}});});}

CH_START[2]=st=>{st.power=true;st.login=true;st.lumenOn=true;st.readMail=true;st.knowCode=true;st.inv.push('사원증');
  Object.assign(st.flags,{panelOpened:true,mailDone:true,rackOpened:true,keypadOpen:true,coreSeen:true});st.room='corridor';st.timeLeft=125*60;};
