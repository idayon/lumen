# 배경 이미지 생성 프롬프트 (나노바나나 / Gemini 이미지)

생성한 파일을 이 폴더(`escape_room/bg/`)에 아래 이름으로 저장하면 게임이 자동으로 깔아 쓴다.
파일이 없으면 기존 CSS 배경으로 돌아간다.

| 파일명 | 쓰이는 단계 | 비고 |
|---|---|---|
| `room_lit.jpg` (png도 됨) | 3~4단계 | **이걸 먼저** 만들고, 나머지는 이 이미지를 편집해서 뽑으면 구도가 일치함 |
| `room_dark.jpg` | 1~2단계 | room_lit 편집본 |
| `core.jpg` | 5단계 | 별도 생성 |
| `title.jpg` | 인트로 (선택) | 없어도 됨 |

권장 사이즈 16:9, 1920×1080 이상. 클릭 지점(핫스팟)이 이미지 위에 겹쳐 올라가므로 **물건 배치가 중요**하다. 아래 프롬프트의 위치 지시를 지켜 달라.

---

## 1. room_lit.png — 불 켜진 서버룸 (3~4단계)

```
Wide-angle interior of a small underground server room in an abandoned Korean IT startup office, 16:9, eye-level camera, photorealistic, slightly grainy, muted cold color palette (steel grey, dark teal, pale fluorescent green-white). Flickering fluorescent ceiling lights are ON.

Layout is important, keep objects in these exact screen regions:
- LEFT WALL (far left, middle height): an old grey electrical breaker panel with its door slightly open; a small brass nameplate screwed below it; a yellow sticky note stuck on the wall above it.
- LEFT-CENTER: a cheap office desk with an old CRT-style monitor and a desktop PC tower, keyboard, a cold half-finished coffee mug, a drawer unit under the desk.
- UPPER CENTER: a wall calendar and a printed organization chart pinned to the wall above the desk.
- RIGHT-CENTER: a tall black server rack with four rack-mounted servers, blinking amber LEDs, cables.
- UPPER RIGHT: a torn paper poster of a Morse code chart taped to the wall above the rack.
- FAR RIGHT: a heavy grey steel fire door with a small numeric keypad next to it, keypad glowing red.
- FLOOR: polished concrete, some chalk scribbles near the panel on the left, a crumpled circuit diagram paper lying on the floor in the lower center.

No people. No text that is readable (keep paper and labels blurry/abstract). Atmosphere: eerie, quiet, dust in the air, faint blue glow from the server LEDs. Cinematic, like a still from a psychological thriller game. Leave the center of the floor relatively empty.
```

## 2. room_dark.png — 깨어난 직후, 불 꺼진 방 (1~2단계)

**방법 A (추천)**: room_lit.png 를 첨부하고 편집 요청

```
Edit this image. Turn all ceiling lights OFF. The room is now almost completely dark. The only light sources are: the CRT monitor on the desk glowing pale green, and the tiny amber LEDs on the server rack. Everything else fades into deep shadow; the far-right door and left wall are barely visible silhouettes. Keep every object exactly where it is. Add a faint vignette. Same camera, same composition.
```

**방법 B**: 처음부터 생성

```
Same scene as a small underground server room (breaker panel far left, desk with CRT monitor left-center, calendar upper center, server rack right-center, steel door far right), but at night with the lights OFF. Nearly pitch black. The only light is the pale green glow of the monitor and small amber LEDs on the rack. Deep shadows, heavy vignette, photorealistic, grainy, 16:9, psychological horror atmosphere. No people, no readable text.
```

## 3. core.png — 루멘 코어 룸 (5단계)

```
A tiny windowless concrete room behind a half-open steel emergency door, 16:9, eye-level, photorealistic. In the exact CENTER of the frame, on a low metal pedestal, sits a palm-sized translucent cube glowing soft cyan-blue from inside, slowly pulsing, with a few fiber optic cables running into the floor. Next to the pedestal: a small industrial power switch box and a tiny admin terminal with a dark screen. On the FAR RIGHT edge: the emergency exit door, slightly ajar, with cold white corridor light leaking in. The rest of the room is dark, walls faintly lit blue by the cube. Dust particles in the light. Melancholic, quiet, intimate atmosphere. No people, no readable text.
```

## 4. title.png — 인트로 화면 (선택)

```
Dark atmospheric key art for a web escape room game titled "Server Room 0", 16:9. A lone figure's silhouette seen from behind, facing a closed steel door in a dark server corridor, a single CRT monitor glowing green on the left, server LEDs blinking faintly. Heavy shadows, cinematic teal-and-amber grading, film grain. No visible text or logos.
```

---

## 팁

- 나노바나나는 **첨부 이미지 편집**이 강점이다. room_lit 하나 잘 뽑은 뒤 "불 꺼 줘", "이 구도 그대로 코어 룸으로 바꿔 줘" 식으로 파생시키면 세 장의 구도가 맞는다.
- 글자가 또렷하게 생성되면 게임 단서와 충돌한다. "no readable text" 를 꼭 넣고, 그래도 나오면 "make all paper labels blurry" 로 재편집.
- 물건 위치가 핫스팟과 어긋나면 이미지를 다시 뽑는 것보다 `index.html` 의 `HOTS` 배열에서 x, y 퍼센트를 옮기는 게 빠르다.
- 세로 모바일 대응은 `background-size: cover` 라 양옆이 잘린다. 핵심 물건을 가로 중앙 70% 안에 두면 안전하다.

---

# 확장판 (2~5장) 배경 8장

같은 규칙: 16:9, 1376×768 이상, no readable text, 물건 위치 지시 준수. 파일명은 `bg/` 폴더에 그대로. 전부 1장과 같은 톤(차가운 철강색, 그레인, 스릴러)으로 맞춘다. 1장 `room_lit.jpg`를 첨부하고 "같은 건물, 같은 카메라 톤으로" 라고 덧붙이면 통일된다.

| 파일명 | 방 |
|---|---|
| `corridor.jpg` | B2 복도 |
| `storage.jpg` | B2 창고 |
| `machine.jpg` | B2 기계실 |
| `security.jpg` | B1 보안실 |
| `archive.jpg` | B1 아카이브 |
| `terminal.jpg` | 루멘 단말실 |
| `stairs.jpg` | 비상계단 (3장·5장 공용) |
| `lobby.jpg` | 1F 로비 |
| `ceo.jpg` | 대표실 |
| `pantry.jpg` | 탕비실 |
| `comm.jpg` | 옥상 통신실 |

(실제로는 11장. 창고·탕비실·계단실은 단순해서 생략해도 되고, 그러면 단색 배경이 쓰인다.)

## corridor.jpg
```
Long underground basement corridor of an abandoned Korean IT office at night, 16:9, eye-level, photorealistic, same cold steel-and-teal grading as the attached server room. Lights OFF, only two dim red emergency lamps on the ceiling. FAR LEFT: elevator doors, dark. LEFT WALL (middle): a red fire hose cabinet and a framed evacuation floor plan. CENTER-LEFT: a steel door with a small sign (machine room). CENTER-RIGHT: another steel door with a padlock (storage). RIGHT WALL: a cork notice board with pinned papers. FAR RIGHT: an emergency stair door with a card reader glowing red. Concrete floor, pipes along the ceiling. No people, no readable text.
```

## machine.jpg
```
Cramped basement mechanical room, 16:9, photorealistic, same grading. LEFT-CENTER: a cooling pump unit with three round pressure gauges and three large red valve wheels labeled A/B/C (labels blurry). UPPER LEFT: a laminated piping diagram pinned to the wall. UPPER CENTER: a red gas alarm box with a flashing lamp. UPPER RIGHT: a thick equipment manual binder on a shelf. RIGHT WALL: a secondary electrical distribution panel with three large rotary dials. Floor: wet concrete, a broken lanyard lying near the pump. Steam, pipes, harsh single work light. No people, no readable text.
```

## storage.jpg
```
Small basement storage room, 16:9, photorealistic, dark, only a flashlight beam from the camera lighting the center. Metal shelving with cardboard boxes in the CENTER-LEFT, a box opened showing batteries, a handheld radio and packing tape. Dust, concrete walls. No people, no readable text.
```

## security.jpg
```
Basement security office, 16:9, photorealistic, same grading, lit by monitors. UPPER CENTER: a wall of nine CCTV monitors in a 3x3 grid, bluish. LEFT WALL: a whiteboard duty roster with marker scribbles (unreadable). LOWER LEFT: a small grey safe on the floor with a yellow sticky note. CENTER-RIGHT: three desks in a row with name plates, one desk conspicuously empty and cleaned. FAR LEFT: elevator doors. FAR RIGHT: a steel archive door with a keyhole, and further right an emergency stair door. No people, no readable text.
```

## archive.jpg
```
Basement records archive, 16:9, photorealistic, warm-grey, single fluorescent tube. CENTER-LEFT: a wall of nine grey steel filing cabinets in a 3x3 arrangement with numbered drawers (numbers blurry). RIGHT: a small plain door with a warning sign (terminal room). LEFT edge: the way back, an open steel door. Paper dust in the air, stacked boxes. No people, no readable text.
```

## terminal.jpg
```
Tiny windowless room with one desk and one old terminal, 16:9, photorealistic. The monitor in the CENTER glows pale cyan, the only light. On the wall above it a label strip (blurry). Cables run into the floor. Everything else is deep shadow. Intimate, melancholic. No people, no readable text.
```

## stairs.jpg
```
Bare concrete emergency stairwell going up, 16:9, photorealistic, cold green emergency lighting. LEFT WALL: a single paper poster taped at eye level with a handwritten scribble in the corner (unreadable). RIGHT-CENTER: the stairs rising to a landing and a door above. Handrail, dust. No people, no readable text.
```

## lobby.jpg
```
Ground-floor lobby of a small Korean office tower at night, 16:9, photorealistic, same grading, streetlight leaking through a closed steel roll-down shutter on the FAR RIGHT. CENTER-LEFT: a reception desk with a PC and a logbook. UPPER CENTER: a round wall clock. RIGHT WALL: a building directory sign. LOWER RIGHT: a grey control panel box on the wall near the shutter with a keyhole. FAR LEFT: a short open staircase going up to a mezzanine office with a glass wall. LOWER CENTER: a plain door (pantry) and a stair door. Polished dark floor reflecting the shutter light. No people, no readable text.
```

## ceo.jpg
```
Executive office at night, 16:9, photorealistic, warm leather and dark wood but the same cold grain. LEFT: a tall bookshelf with six thick books in bright red, blue and yellow spines, clearly out of order. UPPER CENTER-RIGHT: a large oil painting hanging slightly crooked. CENTER-RIGHT: a big desk with a family photo frame, a trophy and a desk calendar. Blinds closed, city light through slats. No people, no readable text.
```

## pantry.jpg
```
Small office pantry at night, 16:9, photorealistic. LEFT: a compact fridge with a sticky note. CENTER-RIGHT: a microwave on the counter with a cracked, flickering display glowing cyan. LOWER RIGHT: a sink with a drawer. Dark, only the microwave display and a street lamp through a small window. No people, no readable text.
```

## comm.jpg
```
Rooftop telecom equipment room at night, 16:9, photorealistic, same grading, rain on a small window. UPPER LEFT: a logbook on a shelf. CENTER-LEFT: an antenna control console with two large rotary dials and a small green LED. CENTER-RIGHT: a rack of power control equipment with four sliders. UPPER RIGHT: a wall monitor showing a dark room with a glowing blue cube. UPPER CENTER: a satellite link terminal with a keyboard. FAR RIGHT: an open hatch to an exterior fire ladder, city lights beyond. No people, no readable text.
```
