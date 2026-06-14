// Auto-embedded from assets/content/{get,phrasal-up,have,up}.json — content verbatim, do not edit by hand.
// file:// safe: no fetch, no network. Loaded before app.js.
// get·phrasal-up = 출제 풀, have·up = sense 참조용(verb-choice 대비·합성 해설).
window.CONTENT_ALL = {
"get": {
  "axis": "core-verbs",
  "item": "get",
  "senses": [
    {
      "id": "get-arrival",
      "ko": "영역 밖에 있던 것이 영역 안으로 들어와 닿는 순간 — have가 '이미 안에 있음(정적)'이라면 get은 '안으로 들어오는 사건(동적 도달)'이다.",
      "image": "내 영역을 둘러싼 원의 바깥에 있던 것이 화살표를 따라 원 안으로 들어와 나에게 닿는 그림. have가 원 안에 가만히 놓인 그림이라면, get은 그 자리에 막 도착하는 움직임이다.",
      "boundary_ko": "have는 정적 상태라 진행형·완료의 도달점이 없다(I have it = 이미 안). get은 도달 '사건'이라 시점이 있다(I got it = 들어온 순간, I'm getting it = 들어오는 중). 같은 목적어라도 have는 상태를, get은 그 상태가 시작되는 도달을 그린다.",
      "source_refs": [
        {
          "source_id": "heine-1997",
          "locator": "Ch. 2 (Conceptual sources of possession) — Action/Goal schema (the 'X takes/gets Y' source)",
          "claim": "소유 구문의 인지적 원천 중 하나는 소유자가 대상을 자기 영역으로 가져오거나 받아 영역 안에 들어오게 하는 획득·수령·이동(action·goal) 도식이며, 이는 정적 위치 도식과 구별되는 동적 source다 — 능동적으로 가져오는 경우와 외부에서 와 닿아 받는(receive) 경우를 모두 포함한다."
        },
        {
          "source_id": "langacker-1987",
          "locator": "Vol. I, Ch. on action chains — source→goal energy transfer, change of state into a relation",
          "claim": "동사는 에너지가 source에서 goal로 흘러 대상이 새로운 관계·상태에 도달하는 동작연쇄를 윤곽 지을 수 있으며, get류는 결과 관계로의 도달을 윤곽 짓는다."
        }
      ],
      "validation": {
        "method": "subagent-consensus",
        "strength": "weak",
        "date": "2026-06-11"
      }
    },
    {
      "id": "get-state-change",
      "ko": "주어가 어떤 상태(위치)로 옮겨 가 그 자리에 닿는다 — 사물의 도달 도식에서 '주어가 상태로 이동'하는 그림으로 은유 확장된 감각(get tired = 피곤하다는 위치로 옮겨 가 닿는다). 상태는 도착할 위치이고, 움직이는 쪽은 주어다.",
      "image": "상태를 '위치'로 보고, 주어가 그 위치로 옮겨 가 닿는 그림 — '피곤함'이라는 자리로 내가 이동해 그 자리에 막 도착한다(STATES ARE LOCATIONS, CHANGE IS MOTION). 머물러 있는 be tired가 아니라, 내가 그 상태 자리로 옮겨 가 도착하는 움직임이다.",
      "boundary_ko": "be는 상태(위치)에 머물러 있음(I am tired = 지금 피곤한 자리에 있음), get은 주어가 그 상태로 옮겨 가 닿음(I get tired = 내가 피곤한 자리로 이동한다). 움직이는 것은 언제나 주어이지 상태가 아니다 — get은 주어가 상태로 가 닿는 변화의 도달점을 그리므로 be로 바꾸면 그 이동이 사라진다.",
      "source_refs": [
        {
          "source_id": "langacker-1987",
          "locator": "Vol. II, Ch. on inchoative / change-of-state predications",
          "claim": "get + 형용사·과거분사 구문은 주어가 어떤 결과 상태로 이행(inchoative)함을 윤곽 짓는다 — 상태 자체가 아니라 그 상태로의 변화·도달을 그린다."
        },
        {
          "source_id": "lakoff-johnson-1980",
          "locator": "Ch. on orientational/ontological metaphor — STATES ARE LOCATIONS, CHANGE IS MOTION",
          "claim": "상태를 위치로, 상태 변화를 그 위치로의 이동으로 보는 은유는 영어에 체계적으로 자리하며, 도달 동사가 상태 변화를 표현하는 확장의 토대가 된다."
        }
      ],
      "validation": {
        "method": "subagent-consensus",
        "strength": "weak",
        "date": "2026-06-11"
      }
    }
  ],
  "training_items": [
    {
      "id": "get-t1",
      "sense_id": "get-arrival",
      "sentence": "I got a text from my sister this morning.",
      "subject_label": "I",
      "object_label": "a text (arriving)",
      "type": "sense-choice",
      "prompt": "이 got이 그리는 그림은?",
      "choices": [
        "문자가 이미 내 영역 안에 가만히 놓여 있는 정적 상태",
        "문자가 바깥에서 내 영역 안으로 들어와 나에게 닿은 도달 사건",
        "내가 문자를 향해 걸어가고 있는 중이다"
      ],
      "answer_index": 1,
      "why_ko": "get a text는 문자를 '가지고 있음'(have)이 아니라, 바깥에 있던 문자가 내 영역 안으로 들어와 닿은 도달의 순간이다. 그래서 시점(this morning)이 따라붙는다."
    },
    {
      "id": "get-t2",
      "sense_id": "get-arrival",
      "sentence": "She finally got the job she wanted.",
      "subject_label": "she",
      "object_label": "the job (arriving)",
      "type": "sense-choice",
      "prompt": "이 got의 감각은?",
      "choices": [
        "일자리가 그녀 영역 안으로 들어와 그녀에게 닿은 도달 사건",
        "일자리가 원래부터 그녀 영역 안에 있던 정적 상태",
        "그녀가 일자리를 향해 이동하는 동작만 가리킨다"
      ],
      "answer_index": 0,
      "why_ko": "get the job은 일자리를 '이미 가진'(have) 상태가 아니라, 바깥에 있던 일자리가 그녀 영역 안으로 들어와 닿은 도달이다. finally가 그 도달이 일어난 시점을 가리킨다."
    },
    {
      "id": "get-t3",
      "sense_id": "get-arrival",
      "sentence": "We got home just before the storm.",
      "subject_label": "we",
      "object_label": "home (arriving at)",
      "type": "sense-choice",
      "prompt": "get home은 어떤 그림인가? (목적어가 사물이 아니라 장소다)",
      "choices": [
        "집을 소유물처럼 손에 넣었다",
        "집 안에 가만히 머물러 있던 정적 상태",
        "바깥에 있던 우리가 집이라는 지점 안으로 들어와 닿은 도달"
      ],
      "answer_index": 2,
      "why_ko": "get home은 집을 '가지는'(have) 게 아니라, 바깥에 있던 우리가 집이라는 영역 안으로 들어와 닿은 도달이다. 목적어가 사물이든 장소든 '밖→안 도달' 도식은 같다."
    },
    {
      "id": "get-t4",
      "sense_id": "get-state-change",
      "sentence": "The kids got tired after the long hike.",
      "subject_label": "the kids",
      "object_label": "into a tired state",
      "type": "sense-choice",
      "prompt": "이 got tired가 그리는 그림은?",
      "choices": [
        "아이들이 줄곧 피곤한 상태에 머물러 있었다",
        "아이들이 피곤하다는 상태(자리)로 옮겨 가 그 자리에 닿았다",
        "아이들이 피곤함을 물건처럼 손에 쥐었다"
      ],
      "answer_index": 1,
      "why_ko": "get tired는 '피곤한 상태'(be tired)에 머무는 게 아니라, 아이들이 피곤하다는 상태 자리로 옮겨 가 그 자리에 닿은 변화다 — 움직이는 것은 주어인 아이들이다. 사물의 도달 도식이 '주어가 상태로 이동'하는 도달로 확장된 것이다."
    },
    {
      "id": "get-t5",
      "sense_id": "get-state-change",
      "sentence": "It gets cold here as soon as the sun goes down.",
      "subject_label": "it (the weather)",
      "object_label": "into a cold state",
      "type": "sense-choice",
      "prompt": "이 gets cold의 감각으로 가장 가까운 것은?",
      "choices": [
        "날씨가 줄곧 추운 상태로 머물러 있다",
        "추위를 어디선가 받아 와 손에 쥔다",
        "날씨가 춥다는 상태(자리)로 옮겨 가 그 자리에 닿는다"
      ],
      "answer_index": 2,
      "why_ko": "gets cold는 추운 상태에 머무는 be cold가 아니라, 주어(날씨)가 춥다는 상태 자리로 옮겨 가 닿는 변화다. 해가 지는 시점에 주어가 그 상태로 이동해 도달한다."
    },
    {
      "id": "get-t6",
      "sense_id": "get-arrival",
      "sentence": "She ___ a package from her mom a minute ago.",
      "subject_label": "she",
      "object_label": "a package (arriving)",
      "type": "verb-choice",
      "prompt": "빈칸에 들어갈 동사로 감각이 맞는 것은?",
      "choices": [
        "has",
        "got",
        "makes"
      ],
      "answer_index": 1,
      "why_ko": "has는 소포가 이미 그녀 영역 안에 있는 정적 상태를 그리지만, a minute ago는 '막 들어온 도달 사건'을 가리키므로 들어오는 순간을 그리는 got이 맞다. have(이미 안)와 get(들어오는 순간)의 대비다."
    },
    {
      "id": "get-t7",
      "sense_id": "get-arrival",
      "sentence": "Can you ___ me a glass of water from the kitchen?",
      "subject_label": "you",
      "object_label": "a glass of water (bringing in for me)",
      "type": "verb-choice",
      "prompt": "빈칸에 들어갈 동사로 감각이 맞는 것은?",
      "choices": [
        "get",
        "have",
        "know"
      ],
      "answer_index": 0,
      "why_ko": "from the kitchen이 '가서 영역 안으로 가져오는' 동적 도달을 못박는다 — get me a glass는 부엌에 가서 물을 내 쪽으로 들여오는 움직임이다. have는 '이미 안에 있음'(정적)이라 *have me a glass from the kitchen은 비문이라 못 들어간다. get(가서 영역 안으로 가져오는 도달) vs have(이미 안)의 대비다."
    },
    {
      "id": "get-t8",
      "sense_id": "get-state-change",
      "sentence": "If you don't sleep, you ___ sick easily.",
      "subject_label": "you",
      "object_label": "into a sick state",
      "type": "verb-choice",
      "prompt": "빈칸에 들어갈 동사로 감각이 맞는 것은?",
      "choices": [
        "are",
        "have",
        "get"
      ],
      "answer_index": 2,
      "why_ko": "are sick은 아픈 상태에 머물러 있음이고, have sickness는 병이 영역 안에 자리한 정적 그림이다. 여기선 주어(you)가 '아프다는 상태 자리로 옮겨 가 닿는' 변화를 묻으므로 도달 동사 get이 맞다 — be(머묾)와 get(주어가 상태로 옮겨 가 닿음)의 대비."
    },
    {
      "id": "get-t9",
      "sense_id": "get-arrival",
      "sentence": "I ___ your point — you don't need to explain again.",
      "subject_label": "I",
      "object_label": "your point (arriving in mind)",
      "type": "verb-choice",
      "prompt": "빈칸에 들어갈 동사로 감각이 맞는 것은? (이해가 머릿속에 '도달'한다)",
      "choices": [
        "get",
        "make",
        "give"
      ],
      "answer_index": 0,
      "why_ko": "get your point은 네 요점이 바깥에서 내 머릿속(영역) 안으로 들어와 닿은 도달 — '이해가 도착했다'는 그림이다. have your point이라 안 하는 이유는, 이해는 정적 소유가 아니라 닿는 사건이기 때문이다. (경계 문항: get의 도달이 추상으로 확장된 자리)"
    },
    {
      "id": "get-t10",
      "sense_id": "get-arrival",
      "sentence": "Hurry ___ — we're leaving in two minutes!",
      "subject_label": "you",
      "object_label": "to completion",
      "type": "sense-cloze",
      "prompt": "빈칸에 들어갈 불변화사로 감각이 맞는 것은?",
      "choices": [
        "up",
        "out",
        "off"
      ],
      "answer_index": 0,
      "why_ko": "hurry up의 up은 서두르는 일이 끝점까지 차올라 완료에 도달하라는 감각이다(완료 up). out은 '안→밖으로 나옴', off는 '붙어 있다 분리됨'의 그림인데, 이 문장엔 그런 밖으로 나오거나 떨어져 나가는 그림이 없다 — 끝까지 차올라 완료에 닿는 up만 맞는다. (정답 up의 감각만 환원 — out·off는 별개 그림)"
    }
  ],
  "transfer_items": [
    {
      "id": "get-x1",
      "sense_id": "get-arrival",
      "sentence": "He got an email from the bank late last night.",
      "subject_label": "he",
      "object_label": "an email (arriving)",
      "type": "sense-choice",
      "prompt": "이 got의 감각은?",
      "choices": [
        "이메일이 그의 영역 안으로 들어와 그에게 닿은 도달 사건",
        "이메일이 줄곧 그의 영역 안에 놓여 있던 정적 상태",
        "그가 이메일을 향해 이동하는 동작이다"
      ],
      "answer_index": 0,
      "why_ko": "get an email은 이메일을 이미 '가진'(have) 상태가 아니라, 밖에 있던 이메일이 그의 영역 안으로 들어와 닿은 도달이다. late last night가 그 도달 시점이다."
    },
    {
      "id": "get-x2",
      "sense_id": "get-state-change",
      "sentence": "Her handwriting got better over the semester.",
      "subject_label": "her handwriting",
      "object_label": "into a better state",
      "type": "sense-choice",
      "prompt": "got better가 그리는 그림으로 가장 가까운 것은?",
      "choices": [
        "글씨가 줄곧 좋은 상태로 머물러 있었다",
        "그녀가 더 나은 글씨를 물건처럼 받아 왔다",
        "글씨가 더 나은 상태(자리)로 옮겨 가 닿는 변화가 한 학기에 걸쳐 일어났다"
      ],
      "answer_index": 2,
      "why_ko": "get better는 좋은 상태에 머무는 be better가 아니라, 주어(글씨)가 더 나은 상태 자리로 옮겨 가 닿는 변화다. 한 학기에 걸쳐 주어가 그 상태로 이동해 도달했다."
    },
    {
      "id": "get-x3",
      "sense_id": "get-arrival",
      "sentence": "Did you ___ my message about the meeting?",
      "subject_label": "you",
      "object_label": "my message (arriving)",
      "type": "verb-choice",
      "prompt": "빈칸에 들어갈 동사로 감각이 맞는 것은?",
      "choices": [
        "have",
        "get",
        "send"
      ],
      "answer_index": 1,
      "why_ko": "have my message면 메시지가 이미 네 영역 안에 있다는 상태를 전제하지만, 여기선 '그게 너에게 들어와 닿았느냐'는 도달 여부를 묻는다 — get이 '밖→안으로 들어와 닿음'을 그린다. (have/get 대비)"
    },
    {
      "id": "get-x4",
      "sense_id": "get-state-change",
      "sentence": "The room ___ dark within minutes.",
      "subject_label": "the room",
      "object_label": "into a dark state",
      "type": "verb-choice",
      "prompt": "빈칸에 들어갈 동사로 감각이 맞는 것은?",
      "choices": [
        "was",
        "got",
        "had"
      ],
      "answer_index": 1,
      "why_ko": "within minutes는 '몇 분 만에 어두운 상태로 옮겨 가 닿는' 변화의 도달을 못박는다 — was dark(어두운 상태에 머묾)로는 이 짧은 시간 안의 이행이 안 그려진다. 주어(방)가 그 어두운 상태로 옮겨 가 닿는 그림이라 도달 동사 get이 맞다 — be(머묾)와 get(상태로의 도달)의 대비."
    },
    {
      "id": "get-x5",
      "sense_id": "get-arrival",
      "sentence": "Please clean ___ the kitchen before the guests arrive.",
      "subject_label": "you",
      "object_label": "to completion",
      "type": "sense-cloze",
      "prompt": "빈칸에 들어갈 불변화사로 감각이 맞는 것은?",
      "choices": [
        "up",
        "out",
        "in"
      ],
      "answer_index": 0,
      "why_ko": "clean up의 up은 치우는 일이 끝점까지 차올라 완전히 마무리되는 완료 감각이다. out은 '안의 것을 밖으로 비워 냄'(clean out), in은 '안으로 들임'의 그림인데, 이 문장엔 어디로 비우거나 들이는 방향 그림이 없다 — 끝까지 차올라 마무리되는 up만 맞는다. (정답 up의 완료 감각만 환원)"
    }
  ]
},
"phrasal-up": {
  "axis": "phrasal-verbs",
  "item": "V+up",
  "senses": [
    {
      "id": "compose-vertical",
      "ko": "동사의 감각 × up의 수직 감각이 합쳐진 그림 — get up = '도달(get)' + '위로(up)'처럼, 구동사는 통암기가 아니라 이미 아는 두 그림의 합성이다.",
      "image": "동사가 그리는 움직임 위에 up의 '아래→위' 화살표가 포개진 그림. get up이면 누운 상태에서 선 상태로 '도달'(get)하면서 몸이 '위로'(up) 올라가는, 두 화살표가 겹친 한 장면.",
      "boundary_ko": "이 수직 합성의 up은 문자 그대로의 방향이라 반대 방향이 성립한다(get up ↔ sit/lie down, stand up ↔ sit down). 방향을 뒤집을 수 있으면 수직 합성이지 완료 합성이 아니다.",
      "source_refs": [
        {
          "source_id": "lindner-1981",
          "locator": "Ch. on UP — verb-particle constructions, compositional vertical sense of V+UP",
          "claim": "영어 동사+UP 구문의 의미는 통째 암기되는 것이 아니라 동사의 의미와 불변화사 UP의 공간(수직) 도식이 합성되어 형성된다."
        },
        {
          "source_id": "talmy-2000",
          "locator": "Ch. on satellite-framed languages — path expressed by the satellite (up)",
          "claim": "영어는 위성틀 언어로, 경로(위로 향함)를 동사가 아니라 위성(up 같은 불변화사)이 표현하므로 동사 감각과 불변화사 경로가 분리·합성된다."
        }
      ],
      "validation": {
        "method": "subagent-consensus",
        "strength": "weak",
        "date": "2026-06-11"
      }
    },
    {
      "id": "compose-completion",
      "ko": "동사의 감각 × up의 완료 감각이 합쳐진 그림 — drink up = '마시다(drink)' + '끝까지 차올라 완료(up)'. 동사 동작이 끝점까지 도달함을 up이 더해 준다.",
      "image": "동사가 그리는 동작이 진행되다가, up의 '끝까지 차올라 한계에 닿음'이 포개져 그 동작이 남김없이 완료되는 그림. drink up이면 마시는 동작이 잔이 빌 때까지 차올라 끝나는 한 장면.",
      "boundary_ko": "이 완료 합성의 up은 '아래로'가 없다 — *drink down·*clean down은 완료의 반대로 성립하지 않는다. 방향을 뒤집을 수 없으면(반대말 down이 안 서면) 완료 합성이지 수직 합성이 아니다. 단, 완료 up 합성은 투명한 경우(eat·drink·clean·heat·pack up처럼 동사+완료로 의미가 그대로 환원되는 경우)에 한한다 — save up·tie up처럼 굳어진 표현은 down 테스트는 통과해도 의미가 합성으로 완전히 환원되지 않는다(굳어진 관용 쪽으로 기운다).",
      "source_refs": [
        {
          "source_id": "lindner-1981",
          "locator": "Ch. on UP — completive/perfective extension composed with the verb",
          "claim": "동사+UP 구문에서 UP의 완료(completive) 의미는 동사의 동작이 끝점까지 도달함을 더하며, 수직 도식에서 은유적으로 확장된 이 완료 감각이 동사 의미와 합성된다."
        }
      ],
      "validation": {
        "method": "subagent-consensus",
        "strength": "weak",
        "date": "2026-06-11"
      }
    }
  ],
  "training_items": [
    {
      "id": "pup-t1",
      "sense_id": "compose-vertical",
      "sentence": "I get up at six every morning.",
      "subject_label": "I",
      "object_label": "rise + reach upright",
      "type": "sense-choice",
      "prompt": "get up은 어떤 두 그림이 합쳐진 것인가?",
      "choices": [
        "'도달(get)' + '위로(up)' — 누운 상태에서 선 상태로 도달하며 몸이 위로 올라간다",
        "get up은 통째로 외우는 숙어라 get·up 각각의 그림은 없다",
        "'마시다' + '끝까지' — 일어나는 일을 완전히 끝낸다"
      ],
      "answer_index": 0,
      "why_ko": "get up은 암기 숙어가 아니라, 이미 아는 두 그림의 합성이다 — get(밖→안으로 도달)이 '선 자세에 도달'을 그리고, up(아래→위)이 몸이 위로 향함을 그린다. 그래서 반대로 lie down이 선다(수직 합성).",
      "verb_label": "get"
    },
    {
      "id": "pup-t2",
      "sense_id": "compose-vertical",
      "sentence": "The crane lifted the container up onto the ship.",
      "subject_label": "the container",
      "object_label": "raised + upward",
      "type": "sense-choice",
      "prompt": "lift up은 어떤 두 그림의 합성인가?",
      "choices": [
        "lift와 up은 같은 뜻이라 up은 그냥 강조일 뿐이다",
        "'들다(lift)' + '위로(up)' — 드는 동작에 위쪽 방향이 포개진다",
        "'들다' + '끝까지' — 드는 일을 완료해 버린다"
      ],
      "answer_index": 1,
      "why_ko": "lift up은 lift(드는 동작) 위에 up(아래→위 방향)이 포개진 합성이다. 컨테이너가 위 높이로 향하므로, 내리면 lower ... down 쪽이 선다 — 문자적 수직 합성.",
      "verb_label": "lift"
    },
    {
      "id": "pup-t3",
      "sense_id": "compose-vertical",
      "sentence": "She jumped up when she heard the good news.",
      "subject_label": "she",
      "object_label": "spring + upward",
      "type": "sense-choice",
      "prompt": "jump up이 그리는 합성 그림으로 가장 가까운 것은?",
      "choices": [
        "'뛰다' + '끝까지' — 뛰는 일을 완전히 끝낸다",
        "jump up은 외우는 표현이라 up에 그림이 없다",
        "'뛰다(jump)' + '위로(up)' — 뛰는 동작에 몸이 위로 솟는 방향이 포개진다"
      ],
      "answer_index": 2,
      "why_ko": "jump up은 jump(뛰는 동작) 위에 up(아래→위)이 포개진 합성이다. 몸이 위로 솟구치므로 방향을 뒤집어 jump down도 성립한다 — 수직 합성.",
      "verb_label": "jump"
    },
    {
      "id": "pup-t4",
      "sense_id": "compose-completion",
      "sentence": "Come on, drink up — the bus is here.",
      "subject_label": "the drink",
      "object_label": "consume + to the end",
      "type": "sense-choice",
      "prompt": "drink up은 어떤 두 그림의 합성인가?",
      "choices": [
        "'마시다' + '위로' — 잔을 위로 들어 올려 마신다",
        "drink up은 외우는 숙어라 up에 그림이 없다",
        "'마시다(drink)' + '끝까지 차올라 완료(up)' — 잔이 빌 때까지 남김없이 마신다"
      ],
      "answer_index": 2,
      "why_ko": "drink up은 drink(마시는 동작)에 up(끝까지 차올라 완료)이 합쳐진 그림이다. 잔이 빌 때까지 도달해 다 마시는 것이라, *drink down은 안 된다 — 완료 합성.",
      "verb_label": "drink"
    },
    {
      "id": "pup-t5",
      "sense_id": "compose-completion",
      "sentence": "Let's clean up the kitchen after dinner.",
      "subject_label": "the kitchen",
      "object_label": "tidy + fully done",
      "type": "sense-choice",
      "prompt": "clean up이 그리는 합성 그림은?",
      "choices": [
        "'치우다' + '위로' — 물건을 위로 쌓아 올린다",
        "'치우다(clean)' + '끝까지 완료(up)' — 치우는 일이 끝점까지 차올라 말끔히 마무리된다",
        "clean과 clean up은 완전히 같은 뜻이다"
      ],
      "answer_index": 1,
      "why_ko": "clean up은 clean(치우는 동작)에 up(끝까지 차올라 완료)이 합쳐진 그림이다. 치우는 일이 끝점에 도달해 말끔해지는 것이라, *clean down은 없다 — 완료 합성.",
      "verb_label": "clean"
    },
    {
      "id": "pup-t6",
      "sense_id": "compose-vertical",
      "sentence": "Sit ___ straight so the doctor can listen to your back.",
      "subject_label": "you",
      "object_label": "torso + upward",
      "type": "sense-cloze",
      "prompt": "빈칸에 들어갈 불변화사로 합성 감각이 맞는 것은?",
      "choices": [
        "up",
        "off",
        "out"
      ],
      "answer_index": 0,
      "why_ko": "sit up은 sit에 up(아래→위)이 합쳐져 굽었던 상체가 위로 곧게 펴 올라가는 수직 합성이다. 반대로 slouch/lie down 쪽으로 내려가니 문자적 방향 up이다. off는 '붙어 있다 분리됨', out은 '안→밖으로 나옴'의 그림인데 이 문장엔 떨어져 나가거나 밖으로 나오는 그림이 없다 — 위로 곧게 펴 올라가는 up만 맞는다.",
      "verb_label": "sit"
    },
    {
      "id": "pup-t7",
      "sense_id": "compose-vertical",
      "sentence": "He propped up the ladder against the wall.",
      "subject_label": "the ladder",
      "object_label": "support + upright",
      "type": "sense-choice",
      "prompt": "prop up은 어떤 두 그림의 합성인가?",
      "choices": [
        "'받치다(prop)' + '위로(up)' — 받치는 동작에 아래→위로 세워 올리는 방향이 포개진다",
        "'받치다' + '끝까지' — 받치는 일을 완전히 끝낸다",
        "prop up은 외우는 표현이라 up에 그림이 없다"
      ],
      "answer_index": 0,
      "why_ko": "prop up은 prop(받치는 동작)에 up(아래→위)이 합쳐져 사다리가 쓰러지지 않게 위로 세워 받쳐지는 수직 합성이다. 받침을 빼 쓰러뜨리면 아래로 내려가니 문자적 방향 up이다.",
      "verb_label": "prop"
    },
    {
      "id": "pup-t8",
      "sense_id": "compose-completion",
      "sentence": "Can you heat up the soup while I set the table?",
      "subject_label": "the soup",
      "object_label": "warm + to the point",
      "type": "sense-choice",
      "prompt": "heat up이 그리는 합성 그림으로 가장 가까운 것은?",
      "choices": [
        "'데우다' + '위로' — 냄비를 위로 들어 올려 데운다",
        "'데우다(heat)' + '끝까지 차올라 완료(up)' — 온도가 먹기 좋은 지점까지 차올라 데워진다",
        "heat과 heat up은 완전히 같은 뜻이다"
      ],
      "answer_index": 1,
      "why_ko": "heat up은 heat(데우는 동작)에 up(끝까지 차올라 완료)이 합쳐져, 온도가 목표 지점까지 차오르며 데워진다는 그림이다. 방향을 뒤집을 수 없어 *heat down은 없다 — 완료 합성.",
      "verb_label": "heat"
    }
  ],
  "transfer_items": [
    {
      "id": "pup-x1",
      "sense_id": "compose-vertical",
      "sentence": "The diver came up to the surface for air.",
      "subject_label": "the diver",
      "object_label": "ascend + upward",
      "type": "sense-choice",
      "prompt": "come up은 어떤 두 그림의 합성인가?",
      "choices": [
        "'오다' + '끝까지' — 오는 일을 완료한다",
        "come up은 '생기다'라는 뜻의 외우는 숙어라 방향이 없다",
        "'오다(come)' + '위로(up)' — 다가오는 동작에 아래→위로 올라오는 방향이 포개진다"
      ],
      "answer_index": 2,
      "why_ko": "come up은 come(다가오는 동작)에 up(아래→위)이 합쳐져 잠수부가 수면 위로 올라오는 수직 합성이다. 내려가면 go down 쪽이 서므로 문자적 방향 up이다.",
      "verb_label": "come"
    },
    {
      "id": "pup-x2",
      "sense_id": "compose-completion",
      "sentence": "Please wash ___ the dishes before you go to bed.",
      "subject_label": "the dishes",
      "object_label": "clean + fully done",
      "type": "sense-cloze",
      "prompt": "빈칸에 들어갈 불변화사로 합성 감각이 맞는 것은?",
      "choices": [
        "up",
        "down",
        "off"
      ],
      "answer_index": 0,
      "why_ko": "wash up은 wash(씻는 동작)에 up(끝까지 차올라 완료)이 합쳐져 설거지를 끝점까지 도달해 빠짐없이 마치는 투명한 완료 합성이다 — 동사+완료로 의미가 그대로 환원된다. down은 '아래로 씻어 내림'(wash down: 물로 흘려보냄)이라 완료의 반대가 아니고, off는 '붙은 것을 씻어 떼어 냄'(wash off)의 분리 그림이라 이 문장의 '끝까지 마침'과는 별개다 — 끝점에 차올라 닿는 up만 맞는다.",
      "verb_label": "wash"
    },
    {
      "id": "pup-x3",
      "sense_id": "compose-completion",
      "sentence": "Hurry and pack up your things — we leave in ten minutes.",
      "subject_label": "your things",
      "object_label": "gather + fully packed",
      "type": "sense-choice",
      "prompt": "pack up이 그리는 합성 그림으로 가장 가까운 것은?",
      "choices": [
        "'싸다' + '위로' — 짐을 위쪽으로 쌓아 올린다",
        "'싸다(pack)' + '끝까지 완료(up)' — 남은 짐까지 끝점에 도달해 빠짐없이 다 싼다",
        "pack up은 그냥 pack을 강조한 것이라 차이가 없다"
      ],
      "answer_index": 1,
      "why_ko": "pack up은 pack(싸는 동작)에 up(끝까지 차올라 완료)이 합쳐진 투명한 합성이다 — 짐을 남김없이 다 싸 끝점에 도달한다는 그림. 방향을 뒤집을 수 없어 *pack down은 없다 — 완료 합성이고, 동사+완료로 의미가 그대로 환원된다.",
      "verb_label": "pack"
    },
    {
      "id": "pup-x4",
      "sense_id": "compose-vertical",
      "sentence": "She hopped up onto the kitchen stool.",
      "subject_label": "she",
      "object_label": "spring + upward",
      "type": "sense-choice",
      "prompt": "hop up은 어떤 두 그림의 합성인가?",
      "choices": [
        "hop up은 외우는 숙어라 up에 그림이 없다",
        "'뛰다' + '끝까지' — 뛰는 일을 완료해 버린다",
        "'뛰다(hop)' + '위로(up)' — 깡충 뛰는 동작에 아래→위 방향이 포개져 의자 위로 오른다"
      ],
      "answer_index": 2,
      "why_ko": "hop up은 hop(깡충 뛰는 동작)에 up(아래→위)이 합쳐져 몸이 의자 위 높이로 오르는 수직 합성이다. 내려오면 hop down이 그대로 서므로 문자적 방향 up이다.",
      "verb_label": "hop"
    }
  ]
},
"have": {
  "axis": "core-verbs",
  "item": "have",
  "senses": [
    {
      "id": "have-domain-location",
      "ko": "무언가를 손에 넣거나 사는 게 아니라, 그것이 그냥 주어의 영역 안에 자리 잡고 있다는 정적인 감각.",
      "image": "내 몸 둘레에 보이지 않는 원이 있고, 그 원 안쪽 자리에 무언가가 놓여 있는 그림.",
      "boundary_ko": "이 정적 have는 진행형이 안 된다 — *I am having a sister (×). 지금 상태 그대로 말한다: I have a sister.",
      "source_refs": [
        {
          "source_id": "heine-1997",
          "locator": "Ch. 2 (Conceptual sources of possession) — Location schema",
          "claim": "소유 구문은 소유물이 소유자의 위치·영역 안에 있다는 공간 도식에서 인지적으로 비롯된다."
        },
        {
          "source_id": "langacker-1987",
          "locator": "Vol. I, Ch. on stative relations (trajector/landmark)",
          "claim": "have류 동사는 동작이 아니라 두 개체 사이의 정적 관계를 윤곽 짓는다."
        }
      ],
      "validation": {
        "method": "subagent-consensus",
        "strength": "weak",
        "date": "2026-06-11"
      }
    },
    {
      "id": "have-event-in-domain",
      "ko": "사건·경험(점심·회의·휴식)이 주어의 영역(하루·시간) 안에 자리해 있어, 주어가 그것을 겪는다는 감각.",
      "image": "내 하루라는 원 안에 사건 한 칸이 자리 잡고 있는 그림 — 그 칸의 시간이 오면 내가 그것을 겪는다.",
      "boundary_ko": "이 사건성 have는 진행형이 된다(We are having lunch ○). 정적 위치의 have는 안 된다(*I am having a sister ×) — 두 감각을 가르는 표지.",
      "source_refs": [
        {
          "source_id": "heine-1997",
          "locator": "Ch. 2 (Location schema) — extension to abstract possessa",
          "claim": "소유의 위치 도식은 구체물뿐 아니라 추상적·비구체적 대상으로도 확장된다."
        },
        {
          "source_id": "oald",
          "locator": "have, sense group: 'experience / do an activity' (have lunch / a meeting / a problem)",
          "claim": "have는 식사·모임·문제 같은 사건·경험을 목적어로 취하는 용법이 학습자 사전에 표준 용법으로 실려 있다."
        }
      ],
      "validation": {
        "method": "subagent-consensus",
        "strength": "weak",
        "date": "2026-06-11"
      }
    }
  ],
  "training_items": [
    {
      "id": "have-t1",
      "sense_id": "have-domain-location",
      "sentence": "She has the window seat.",
      "prompt": "이 has가 그리는 그림은?",
      "choices": [
        "그녀가 창가 좌석을 돈 주고 사서 소유했다",
        "창가 좌석이 그녀의 영역 안에 놓여 있다",
        "그녀가 창가 좌석을 향해 걸어가고 있다"
      ],
      "answer_index": 1,
      "why_ko": "have는 좌석을 사거나 그쪽으로 움직이는 동작이 아니라, 그 좌석이 그녀의 영역 안에 정적으로 자리 잡고 있다는 그림이다."
    },
    {
      "id": "have-t2",
      "sense_id": "have-domain-location",
      "sentence": "I have your phone number.",
      "prompt": "이 have의 감각은?",
      "choices": [
        "내가 네 번호를 방금 받아 손에 쥐는 동작",
        "네 번호가 이미 내 영역 안에 들어와 있다",
        "내가 네 번호를 얻으려고 애쓰는 중이다"
      ],
      "answer_index": 1,
      "why_ko": "번호를 '받는' 동작이 아니라, 그 번호가 이미 내 영역 안에 자리 잡고 있는 정적인 상태를 그린다."
    },
    {
      "id": "have-t3",
      "sense_id": "have-domain-location",
      "sentence": "The house has three bedrooms.",
      "prompt": "집이 침실을 'have'한다는 건 어떤 그림인가?",
      "choices": [
        "집이 침실을 가지다 — 집이 침실의 주인이다",
        "침실 세 개가 그 집의 영역(테두리) 안에 들어 있다",
        "집이 침실 세 개를 새로 사들였다"
      ],
      "answer_index": 1,
      "why_ko": "집은 무언가를 '소유'하지 않는다. 침실들이 집이라는 영역 안에 자리한다는 위치 감각일 뿐이다."
    },
    {
      "id": "have-t4",
      "sense_id": "have-domain-location",
      "sentence": "He has brown eyes.",
      "prompt": "이 has가 그리는 그림은?",
      "choices": [
        "그가 갈색 눈을 가지다 — 눈을 소유물처럼 지니다",
        "갈색 눈이 그라는 사람의 영역에 속한 특징이다",
        "그가 갈색 눈을 어디선가 얻어 왔다"
      ],
      "answer_index": 1,
      "why_ko": "신체 특징은 사거나 얻는 게 아니라, 그라는 영역에 속해 있는 것으로 그려지는 정적 감각이다."
    },
    {
      "id": "have-t5",
      "sense_id": "have-domain-location",
      "sentence": "We have a small garden behind the house.",
      "prompt": "이 have의 감각으로 가장 가까운 것은?",
      "choices": [
        "우리가 정원을 구입해 소유권을 얻었다",
        "작은 정원이 우리 영역(생활 공간) 안에 들어와 있다",
        "우리가 정원을 만들려고 작업 중이다"
      ],
      "answer_index": 1,
      "why_ko": "소유권 주장이 아니라, 정원이 우리 영역 안에 그냥 자리 잡고 있다는 정적인 위치 감각이다."
    },
    {
      "id": "have-t6",
      "sense_id": "have-event-in-domain",
      "sentence": "We usually have lunch at noon.",
      "prompt": "이 have가 그리는 그림은?",
      "choices": [
        "우리가 점심(음식)을 손에 들고 소유한다",
        "점심이라는 사건이 우리 영역 안에 들어와 우리가 그것을 겪는다",
        "우리가 점심을 향해 이동하고 있다"
      ],
      "answer_index": 1,
      "why_ko": "have lunch는 음식을 '가지는' 게 아니라, 점심이라는 사건이 우리 하루 안에 자리해 우리가 그것을 겪는 감각이다. (사건성이라 We are having lunch도 가능)"
    },
    {
      "id": "have-t7",
      "sense_id": "have-event-in-domain",
      "sentence": "I have a meeting at three o'clock.",
      "prompt": "이 have의 감각은?",
      "choices": [
        "내가 회의 자료를 손에 쥐고 있다",
        "회의라는 사건이 내 영역(내 하루) 안에 들어와 있다",
        "내가 회의실로 걸어가는 중이다"
      ],
      "answer_index": 1,
      "why_ko": "회의를 물건처럼 가지는 게 아니라, 그 사건이 내 영역 안에 자리 잡아 내가 그것을 겪게 된다는 그림이다."
    },
    {
      "id": "have-t8",
      "sense_id": "have-domain-location",
      "sentence": "She has a problem with her laptop.",
      "prompt": "이 has가 그리는 그림은?",
      "choices": [
        "그녀가 문제를 소유물처럼 가지다",
        "문제라는 상황이 그녀의 영역 안에 놓여 있다",
        "그녀가 문제를 일부러 만들어 냈다"
      ],
      "answer_index": 1,
      "why_ko": "have a problem은 문제를 '소유'하는 게 아니라, 곤란한 상황이 지금 그녀 영역 안에 정적으로 놓여 있다는 그림이다. (그래서 *is having a problem이 어색하다 — 정적 have)"
    },
    {
      "id": "have-t9",
      "sense_id": "have-event-in-domain",
      "sentence": "Let's have a quick chat after class.",
      "prompt": "이 have의 감각으로 가장 가까운 것은?",
      "choices": [
        "우리가 대화(라는 물건)를 손에 넣자",
        "수업 뒤에 대화라는 사건을 우리 영역 안에 두고 함께 겪자",
        "우리가 대화하는 장소로 이동하자"
      ],
      "answer_index": 1,
      "why_ko": "have a chat은 대화를 가지는 게 아니라, 대화라는 사건이 우리 영역 안에서 일어나 우리가 함께 겪는 그림이다."
    },
    {
      "id": "have-t10",
      "sense_id": "have-event-in-domain",
      "sentence": "They had a great time at the party.",
      "prompt": "이 had가 그리는 그림은?",
      "choices": [
        "그들이 즐거운 시간을 물건처럼 소유했다",
        "즐거운 시간이라는 경험이 그들의 영역 안에 들어와 그들이 그것을 겪었다",
        "그들이 파티 시간에 맞춰 도착했다"
      ],
      "answer_index": 1,
      "why_ko": "have a great time은 시간을 가지는 게 아니라, 즐거운 경험이 그들 영역 안에 자리해 그들이 그것을 겪었다는 감각이다."
    }
  ],
  "transfer_items": [
    {
      "id": "have-x1",
      "sense_id": "have-domain-location",
      "sentence": "We have ten minutes before the train leaves.",
      "prompt": "이 have의 감각은?",
      "choices": [
        "우리가 10분을 돈처럼 가지고 있다",
        "10분이라는 여유가 우리 영역 안에 놓여 있다",
        "우리가 10분 뒤를 향해 달려가고 있다"
      ],
      "answer_index": 1,
      "why_ko": "시간을 '소유'하는 게 아니라, 출발 전 10분이라는 여유가 지금 우리 영역 안에 정적으로 놓여 있다는 그림이다."
    },
    {
      "id": "have-x2",
      "sense_id": "have-domain-location",
      "sentence": "This idea has real potential.",
      "prompt": "추상적인 idea가 무언가를 'have'한다는 건 어떤 그림인가?",
      "choices": [
        "아이디어가 잠재력을 사서 소유했다",
        "잠재력이 그 아이디어라는 영역 안에 깃들어 있다",
        "아이디어가 잠재력을 향해 발전해 가고 있다"
      ],
      "answer_index": 1,
      "why_ko": "추상물조차 무언가를 '얻는' 게 아니라, 잠재력이 그 아이디어의 영역 안에 자리 잡고 있다는 정적 위치 감각으로 그려진다."
    },
    {
      "id": "have-x3",
      "sense_id": "have-domain-location",
      "sentence": "She has a lot of patience with children.",
      "prompt": "이 has가 그리는 그림으로 가장 가까운 것은?",
      "choices": [
        "그녀가 인내심을 노력해서 얻어 냈다",
        "많은 인내심이 그녀라는 영역 안에 갖춰져 있다",
        "그녀가 인내심을 발휘하려고 애쓰는 중이다"
      ],
      "answer_index": 1,
      "why_ko": "인내심 같은 성질도 얻거나 발휘하는 동작이 아니라, 그녀 영역 안에 정적으로 자리해 있다는 위치 감각으로 그려진다."
    },
    {
      "id": "have-x4",
      "sense_id": "have-event-in-domain",
      "sentence": "Why don't you have a rest before dinner?",
      "prompt": "이 have의 감각은?",
      "choices": [
        "휴식을 물건처럼 받아서 가지라는 뜻",
        "휴식이라는 사건을 저녁 전 시간 안에 두고 겪으라는 뜻",
        "쉬는 장소로 옮겨 가라는 뜻"
      ],
      "answer_index": 1,
      "why_ko": "have a rest는 휴식을 '받는' 게 아니라, 휴식이라는 사건 한 칸을 네 시간 영역 안에 두고 겪으라는 그림이다."
    },
    {
      "id": "have-x5",
      "sense_id": "have-event-in-domain",
      "sentence": "I had a strange dream last night.",
      "prompt": "이 had가 그리는 그림은?",
      "choices": [
        "내가 꿈을 물건처럼 손에 쥐었다",
        "이상한 꿈이라는 경험이 내 영역 안에 들어와 내가 그것을 겪었다",
        "내가 꿈을 꾸려고 일부러 노력했다"
      ],
      "answer_index": 1,
      "why_ko": "have a dream은 꿈을 소유하는 게 아니라, 그 경험이 밤사이 내 영역 안에 들어와 내가 그것을 겪었다는 감각이다."
    }
  ]
},
"up": {
  "axis": "particles",
  "item": "up",
  "senses": [
    {
      "id": "up-vertical",
      "ko": "대상이 낮은 데서 높은 데로 올라가거나 위쪽을 향한다는, 수직 방향의 공간 감각.",
      "image": "땅에 붙어 있던 것이 화살표를 따라 위로 솟구치거나, 시선이 아래에서 위 끝으로 올라가는 그림.",
      "boundary_ko": "이 수직 up은 문자 그대로의 방향이라 반대 방향 down이 그대로 성립한다(stand up ↔ sit down, look up ↔ look down). 방향을 뒤집을 수 있으면 수직 감각이다.",
      "source_refs": [
        {
          "source_id": "lindner-1981",
          "locator": "Ch. on UP — spatial/vertical schema of the particle UP",
          "claim": "불변화사 UP의 의미망은 대상이 수직 축을 따라 위로 향하는 공간 도식을 핵으로 삼는다."
        },
        {
          "source_id": "tyler-evans-2003",
          "locator": "Ch. on the vertical axis (up/down) — proto-scene",
          "claim": "up은 수직 축 위에서 trajector가 높은 쪽에 위치하거나 그쪽으로 향하는 원형 장면(proto-scene)을 가진다."
        }
      ],
      "validation": {
        "method": "subagent-consensus",
        "strength": "weak",
        "date": "2026-06-11"
      }
    },
    {
      "id": "up-completion",
      "ko": "어떤 일이 끝까지 차올라 한계·완료 지점에 도달했다는, 수직 상승이 은유로 확장된 감각.",
      "image": "그릇이 바닥부터 차오르다 가장자리(끝)까지 꽉 차서 더 올라갈 데가 없어지는 그림 — 위로 차오르다 한계에 닿는다.",
      "boundary_ko": "이 완료 up은 '아래로'가 없다 — *eat down은 불가능하다. 방향을 뒤집을 수 없으면(반대말 down이 안 서면) 완료 감각이지 수직 감각이 아니다. (slow down·calm down의 down은 완료의 반대가 아니라 감소·진정이라는 별개의 그림이다.)",
      "source_refs": [
        {
          "source_id": "lindner-1981",
          "locator": "Ch. on UP — completive/perfective extension of the UP network",
          "claim": "UP의 의미망은 수직 상승 도식에서 동작이 끝점까지 도달하는 완료(completive) 용법으로 확장된다."
        }
      ],
      "validation": {
        "method": "subagent-consensus",
        "strength": "weak",
        "date": "2026-06-11"
      }
    }
  ],
  "training_items": [
    {
      "id": "up-t1",
      "sense_id": "up-vertical",
      "sentence": "Please stand up when the teacher comes in.",
      "subject_label": "you",
      "object_label": "rise upright",
      "prompt": "이 up이 그리는 그림은?",
      "choices": [
        "몸이 낮은 자세에서 위로 솟아 똑바로 서는 방향",
        "서 있는 동작을 끝까지 완전히 끝내 버림",
        "stand up은 그냥 외운 숙어라 up에 그림은 없다"
      ],
      "answer_index": 0,
      "why_ko": "stand up은 앉아 있던 몸이 수직으로 올라가 서는 방향 감각이다. 그래서 반대 방향 sit down이 그대로 성립한다."
    },
    {
      "id": "up-t2",
      "sense_id": "up-vertical",
      "sentence": "Everyone looked up at the night sky.",
      "subject_label": "everyone",
      "object_label": "gaze upward",
      "prompt": "이 up의 감각은?",
      "choices": [
        "하늘을 다 보고 나서 보는 일을 끝냄",
        "시선이 아래에서 위쪽 끝으로 올라가는 방향",
        "look up은 사전을 찾는다는 뜻의 숙어다"
      ],
      "answer_index": 1,
      "why_ko": "look up은 시선이 수직으로 위를 향하는 방향 감각이다. 반대로 look down도 그대로 되니 문자적 수직 up이다."
    },
    {
      "id": "up-t3",
      "sense_id": "up-vertical",
      "sentence": "Can you pick up that pen from the floor?",
      "subject_label": "the pen",
      "object_label": "lift off the floor",
      "prompt": "펜을 pick up한다는 건 어떤 그림인가?",
      "choices": [
        "펜을 집는 일을 완전히 끝까지 해냄",
        "pick up은 '태우러 간다'는 뜻이라 위와 상관없다",
        "펜이 바닥에서 손 높이로 들려 올라가는 방향"
      ],
      "answer_index": 2,
      "why_ko": "pick up은 바닥에 있던 펜이 위로 들려 올라가는 수직 방향 감각이다. 대상이 아래에서 위로 움직인다."
    },
    {
      "id": "up-t4",
      "sense_id": "up-vertical",
      "sentence": "The balloon floated up into the clouds.",
      "subject_label": "the balloon",
      "object_label": "rise into the sky",
      "prompt": "이 up이 그리는 그림은?",
      "choices": [
        "풍선이 점점 위로 떠올라 가는 방향",
        "풍선이 구름까지 다 차올라 꽉 참",
        "풍선이 위로 가든 말든 up은 강조일 뿐이다"
      ],
      "answer_index": 0,
      "why_ko": "float up은 풍선이 아래에서 하늘 위로 올라가는 수직 방향 그 자체다. 내려오면 float down이 되니 문자적 up이다."
    },
    {
      "id": "up-t5",
      "sense_id": "up-vertical",
      "sentence": "She climbed up the steep hill slowly.",
      "subject_label": "she",
      "object_label": "ascend the hill",
      "prompt": "이 up의 감각으로 가장 가까운 것은?",
      "choices": [
        "언덕 오르기를 끝까지 마쳐 완료함",
        "낮은 데서 언덕 위쪽으로 몸이 올라가는 방향",
        "climb up은 통째로 외우는 숙어라 up에 뜻이 없다"
      ],
      "answer_index": 1,
      "why_ko": "climb up은 몸이 아래에서 언덕 위로 올라가는 수직 방향 감각이다. climb down으로 방향을 뒤집을 수 있다."
    },
    {
      "id": "up-t6",
      "sense_id": "up-completion",
      "sentence": "Hurry and eat up all your vegetables.",
      "subject_label": "the vegetables",
      "object_label": "all gone",
      "prompt": "eat up이 그리는 그림은?",
      "choices": [
        "음식을 위로 들어 올려서 먹는다",
        "그냥 먹는다는 말을 강조한 것뿐, up은 의미 없다",
        "먹는 일이 끝까지 차올라 하나도 안 남게 다 비운다"
      ],
      "answer_index": 2,
      "why_ko": "eat up은 위로 먹는 게 아니라, 먹는 일이 끝점까지 도달해 남김없이 다 비웠다는 완료 감각이다. 그래서 *eat down은 안 된다."
    },
    {
      "id": "up-t7",
      "sense_id": "up-completion",
      "sentence": "Let me fill up the bottle with water.",
      "subject_label": "the bottle",
      "object_label": "full to the top",
      "prompt": "이 up의 감각은?",
      "choices": [
        "물이 바닥부터 차올라 병의 끝(꼭대기)까지 꽉 참",
        "병을 손으로 들어 위로 올린다",
        "fill up은 주유한다는 뜻의 숙어라 위와 무관하다"
      ],
      "answer_index": 0,
      "why_ko": "fill up은 물이 끝까지 차올라 가장자리에 닿는 완료·한계 도달 감각이다. 위로 차오르다 더 올라갈 데가 없어진 그림이다."
    },
    {
      "id": "up-t8",
      "sense_id": "up-completion",
      "sentence": "I need to finish up this report tonight.",
      "subject_label": "the report",
      "object_label": "fully done",
      "prompt": "finish up이 그리는 그림으로 가장 가까운 것은?",
      "choices": [
        "보고서를 책상 위로 올려 둔다",
        "finish에 up이 붙어도 finish와 똑같은 뜻이다",
        "남은 부분까지 끝까지 채워 완전히 마무리한다"
      ],
      "answer_index": 2,
      "why_ko": "finish up은 남은 일이 끝점까지 차올라 완전히 끝났다는 완료 감각이다. up이 '끝까지 도달'을 더해 마무리를 강조한다."
    },
    {
      "id": "up-t9",
      "sense_id": "up-completion",
      "sentence": "Sorry, time's up — please put your pens down.",
      "subject_label": "the time",
      "object_label": "limit reached",
      "prompt": "time이 up이라는 건 어떤 그림인가? (시간은 위로 가지 않는데?)",
      "choices": [
        "시계 바늘이 위(12시)에 도달했다는 그림이다",
        "주어진 시간이 한계(끝)까지 다 차올라 더 남지 않았다",
        "time's up은 그냥 외우는 표현이라 up에 그림이 없다"
      ],
      "answer_index": 1,
      "why_ko": "time's up은 시간이 위로 간 게 아니라, 주어진 양이 끝까지 차올라 한계에 닿아 더 없다는 완료 감각이다. 방향이 아니라 한계 도달이라 down이 안 선다."
    },
    {
      "id": "up-t10",
      "sense_id": "up-completion",
      "sentence": "The old barn burned up in the fire.",
      "subject_label": "the barn",
      "object_label": "completely gone",
      "prompt": "burn up이 그리는 그림은? (불은 위로 타오르는데, 왜 완료일까?)",
      "choices": [
        "불길이 헛간 위로 솟아오르는 방향만 가리킨다",
        "타는 일이 끝까지 진행돼 헛간이 남김없이 다 타 없어졌다",
        "burn up과 burn down은 위/아래 방향만 다른 같은 그림이다"
      ],
      "answer_index": 1,
      "why_ko": "burn up은 불의 방향이 아니라, 타는 일이 끝점까지 도달해 완전히 다 타버렸다는 완료 감각이다. burn down은 '무너져 내림'을 보지만, up은 '소진'을 본다."
    }
  ],
  "transfer_items": [
    {
      "id": "up-x1",
      "sense_id": "up-vertical",
      "sentence": "The narrow road goes up the mountain.",
      "subject_label": "the road",
      "object_label": "toward the top",
      "prompt": "길은 움직이지 않는데 go up이라니 — 이 up의 감각은?",
      "choices": [
        "시선이 길을 따라 산 위쪽으로 올라가는 방향",
        "길 공사가 끝까지 진행돼 완료됐다",
        "go up은 위층에 간다는 숙어라 산길에는 못 쓴다"
      ],
      "answer_index": 0,
      "why_ko": "길 자체는 움직이지 않지만, 길을 따라가는 시선이 아래에서 산 위로 오른다 — 수직 방향 감각은 멈춰 있는 것에도 그려진다. 반대로 내려가면 go down이 선다."
    },
    {
      "id": "up-x2",
      "sense_id": "up-completion",
      "sentence": "We used up the last of the printer ink yesterday.",
      "subject_label": "the ink",
      "object_label": "all consumed",
      "prompt": "use up이 그리는 그림으로 가장 가까운 것은?",
      "choices": [
        "잉크를 위쪽으로 들어 올려 썼다",
        "use up은 그냥 use를 강조한 것이라 차이가 없다",
        "쓰는 일이 끝까지 진행돼 잉크가 한 방울도 안 남게 다 소진됐다"
      ],
      "answer_index": 2,
      "why_ko": "use up은 위로 쓰는 게 아니라, 쓰는 일이 끝점까지 차올라 잉크가 바닥나 다 소진됐다는 완료 감각이다."
    },
    {
      "id": "up-x3",
      "sense_id": "up-completion",
      "sentence": "Let's wrap up the meeting before five o'clock.",
      "subject_label": "the meeting",
      "object_label": "fully closed",
      "prompt": "wrap up이 그리는 그림은?",
      "choices": [
        "회의 자료를 걷어 위로 쌓아 올린다",
        "회의가 남은 안건까지 끝점에 도달해 완전히 닫힌다",
        "wrap up은 선물을 포장한다는 뜻의 숙어일 뿐이다"
      ],
      "answer_index": 1,
      "why_ko": "wrap up은 포장이나 위쪽 이동이 아니라, 회의가 끝점까지 차올라 완전히 닫히는 완료 감각이다. 그래서 *wrap down은 없다."
    },
    {
      "id": "up-x4",
      "sense_id": "up-vertical",
      "sentence": "He held the trophy up for the crowd to see.",
      "subject_label": "the trophy",
      "object_label": "lifted high",
      "prompt": "이 up이 그리는 그림은?",
      "choices": [
        "트로피가 손에 들려 머리 위 높이로 올라간 방향",
        "트로피를 보여 주는 일을 끝까지 완료함",
        "hold up은 '강도질하다'라는 뜻이라 위와 무관하다"
      ],
      "answer_index": 0,
      "why_ko": "hold ... up은 트로피가 아래에서 위 높이로 들려 올라간 수직 방향 감각이다. 내리면 hold down 쪽이 되니 문자적 up이다."
    },
    {
      "id": "up-x5",
      "sense_id": "up-completion",
      "sentence": "Don't worry, the bruise will clear up in a few days.",
      "subject_label": "the bruise",
      "object_label": "fully gone",
      "prompt": "clear up이 그리는 그림으로 가장 가까운 것은?",
      "choices": [
        "멍이 피부 위로 떠오른다",
        "clear up은 날씨가 갠다는 뜻뿐이라 멍에는 안 쓴다",
        "낫는 일이 끝까지 진행돼 멍이 완전히 사라진 상태에 도달한다"
      ],
      "answer_index": 2,
      "why_ko": "clear up은 위로 가는 게 아니라, 사라지는 과정이 끝점까지 도달해 멍이 말끔히 없어졌다는 완료 감각이다. up이 '끝까지'를 더한다."
    }
  ]
}
};
window.CONTENT = window.CONTENT_ALL["get"];
