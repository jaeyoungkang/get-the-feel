// get-the-feel · c2-2 — 콘텐츠 임베드 (assets/content 7파일 verbatim, 손수정 금지)
// file:// safe — fetch 없음. app.js보다 먼저 로드.
window.CONTENT_ALL = {
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
      "why_ko": "have는 좌석을 사거나 그쪽으로 움직이는 동작이 아니라, 그 좌석이 그녀의 영역 안에 정적으로 자리 잡고 있다는 그림이다.",
      "subject_label": "She",
      "object_label": "the window seat"
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
      "why_ko": "번호를 '받는' 동작이 아니라, 그 번호가 이미 내 영역 안에 자리 잡고 있는 정적인 상태를 그린다.",
      "subject_label": "I",
      "object_label": "your phone number"
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
      "why_ko": "집은 무언가를 '소유'하지 않는다. 침실들이 집이라는 영역 안에 자리한다는 위치 감각일 뿐이다.",
      "subject_label": "the house",
      "object_label": "three bedrooms"
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
      "why_ko": "신체 특징은 사거나 얻는 게 아니라, 그라는 영역에 속해 있는 것으로 그려지는 정적 감각이다.",
      "subject_label": "he",
      "object_label": "brown eyes"
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
      "why_ko": "소유권 주장이 아니라, 정원이 우리 영역 안에 그냥 자리 잡고 있다는 정적인 위치 감각이다.",
      "subject_label": "we",
      "object_label": "a small garden"
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
      "why_ko": "have lunch는 음식을 '가지는' 게 아니라, 점심이라는 사건이 우리 하루 안에 자리해 우리가 그것을 겪는 감각이다. (사건성이라 We are having lunch도 가능)",
      "subject_label": "we",
      "object_label": "lunch"
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
      "why_ko": "회의를 물건처럼 가지는 게 아니라, 그 사건이 내 영역 안에 자리 잡아 내가 그것을 겪게 된다는 그림이다.",
      "subject_label": "I",
      "object_label": "a meeting"
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
      "why_ko": "have a problem은 문제를 '소유'하는 게 아니라, 곤란한 상황이 지금 그녀 영역 안에 정적으로 놓여 있다는 그림이다. (그래서 *is having a problem이 어색하다 — 정적 have)",
      "subject_label": "she",
      "object_label": "a problem"
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
      "why_ko": "have a chat은 대화를 가지는 게 아니라, 대화라는 사건이 우리 영역 안에서 일어나 우리가 함께 겪는 그림이다.",
      "subject_label": "we",
      "object_label": "a quick chat"
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
      "why_ko": "have a great time은 시간을 가지는 게 아니라, 즐거운 경험이 그들 영역 안에 자리해 그들이 그것을 겪었다는 감각이다.",
      "subject_label": "they",
      "object_label": "a great time"
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
      "why_ko": "시간을 '소유'하는 게 아니라, 출발 전 10분이라는 여유가 지금 우리 영역 안에 정적으로 놓여 있다는 그림이다.",
      "subject_label": "we",
      "object_label": "ten minutes"
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
      "why_ko": "추상물조차 무언가를 '얻는' 게 아니라, 잠재력이 그 아이디어의 영역 안에 자리 잡고 있다는 정적 위치 감각으로 그려진다.",
      "subject_label": "this idea",
      "object_label": "real potential"
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
      "why_ko": "인내심 같은 성질도 얻거나 발휘하는 동작이 아니라, 그녀 영역 안에 정적으로 자리해 있다는 위치 감각으로 그려진다.",
      "subject_label": "she",
      "object_label": "patience"
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
      "why_ko": "have a rest는 휴식을 '받는' 게 아니라, 휴식이라는 사건 한 칸을 네 시간 영역 안에 두고 겪으라는 그림이다.",
      "subject_label": "you",
      "object_label": "a rest"
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
      "why_ko": "have a dream은 꿈을 소유하는 게 아니라, 그 경험이 밤사이 내 영역 안에 들어와 내가 그것을 겪었다는 감각이다.",
      "subject_label": "I",
      "object_label": "a strange dream"
    }
  ]
},
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
"take": {
  "axis": "core-verbs",
  "item": "take",
  "senses": [
    {
      "id": "take-grasp",
      "ko": "주어가 스스로 손을 뻗어 대상을 자기 영역 안으로 끌어들여 점유하는, 의지적인 획득 감각 — get이 '저절로 와 닿거나 수령함'까지 품는 도달이라면, take는 '내가 손을 뻗어 잡는' 능동적 점유다.",
      "image": "내 손이 영역 밖으로 뻗어 나가 무언가를 붙잡고, 그것을 내 쪽 영역 안으로 끌어당겨 자리에 놓는 그림. 화살표가 대상에서 나에게로 오는 게 아니라, 내 손이 대상을 향해 나갔다가 그것을 쥐고 돌아온다.",
      "boundary_ko": "get은 외부에서 와 닿아 받는 경우까지 포함하지만(I got a text — 문자가 나에게 옴), take는 주어가 능동적으로 손을 뻗어 잡는 쪽이라 수동적 수령에는 안 맞는다(*I took a text from my sister ×). 의지로 집어 드는 동작이 있으면 take, 그냥 도달·수령이면 get이다.",
      "source_refs": [
        {
          "source_id": "heine-1997",
          "locator": "Ch. 2 (Conceptual sources of possession) — Action schema (the 'X takes Y' source)",
          "claim": "소유 구문의 인지적 원천 중 하나는 소유자가 능동적으로 대상을 잡아 자기 영역으로 가져오는 행위(action) 도식이며, take가 그 전형적 동사다."
        },
        {
          "source_id": "langacker-1987",
          "locator": "Vol. I, Ch. on action chains — agent-initiated energy transfer, source→goal grasping",
          "claim": "동사는 행위자가 에너지를 내보내 대상을 자기 쪽 관계로 끌어들이는 동작연쇄를 윤곽 지을 수 있으며, take류는 행위자가 능동적으로 대상을 점유로 끌어들이는 행위를 윤곽 짓는다."
        }
      ],
      "validation": {
        "method": "subagent-consensus",
        "strength": "weak",
        "date": "2026-06-11"
      }
    },
    {
      "id": "take-carry",
      "ko": "주어가 대상을 잡아 든 채 다른 곳으로 데려가거나 가져가는, 화자에게서 멀어지는 방향의 이동 감각 — bring이 '이쪽으로 가져옴'이라면 take는 '저쪽으로 가져감'으로 방향이 반대다.",
      "image": "내가 무언가를 손에 쥔 채 화자가 선 자리에서 멀어지는 방향으로 들고 가는 그림. bring의 화살표가 바깥에서 화자 쪽으로 온다면, take의 화살표는 화자 곁에서 바깥의 다른 지점으로 나간다.",
      "boundary_ko": "방향이 핵심이다 — 화자/기준점 쪽으로 오면 bring(Bring it here ○), 화자/기준점에서 멀어지면 take(Take it there ○). 같은 물건이라도 어느 방향으로 옮기느냐로 갈린다. get은 '밖→내 영역 안으로 도달'이라 데려가는 방향성이 없다.",
      "source_refs": [
        {
          "source_id": "talmy-2000",
          "locator": "Ch. on satellite-framed languages — deictic motion verbs and path/direction",
          "claim": "영어의 이동 동사는 기준점(화자) 대비 경로의 방향(접근/이탈)을 어휘화하며, take/bring 같은 짝은 화자 기준 이탈/접근의 직시적 방향 대비를 이룬다."
        },
        {
          "source_id": "oald",
          "locator": "take, sense group: 'carry / move sb-sth (from one place to another, away from the speaker)'",
          "claim": "take는 사람·사물을 화자에게서 떨어진 다른 장소로 데려가거나 가져가는 용법이 학습자 사전에 표준 용법으로 실려 있으며, bring(이쪽으로)과 방향이 대비된다."
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
      "id": "take-t1",
      "sense_id": "take-grasp",
      "sentence": "She reached over and took the last cookie from the plate.",
      "subject_label": "she",
      "object_label": "the last cookie (grasped)",
      "type": "sense-choice",
      "prompt": "이 took이 그리는 그림은?",
      "choices": [
        "쿠키가 저절로 그녀 영역 안으로 굴러 들어와 닿았다",
        "그녀가 손을 뻗어 쿠키를 붙잡아 자기 쪽으로 끌어들였다",
        "그녀가 쿠키를 다른 사람에게 건네주었다"
      ],
      "answer_index": 1,
      "why_ko": "take는 쿠키가 저절로 와 닿는 도달(get)이 아니라, 그녀가 능동적으로 손을 뻗어 잡아 자기 영역으로 끌어들이는 의지적 점유다. reached over가 그 손을 뻗는 동작을 못박는다."
    },
    {
      "id": "take-t2",
      "sense_id": "take-grasp",
      "sentence": "He took the biggest slice of pizza without asking.",
      "subject_label": "he",
      "object_label": "the biggest slice (grasped)",
      "type": "sense-choice",
      "prompt": "이 took이 그리는 그림은?",
      "choices": [
        "그가 손을 뻗어 가장 큰 조각을 차지해 자기 영역으로 끌어왔다",
        "피자 조각이 저절로 그의 접시로 옮겨졌다",
        "그가 자기 조각을 남에게 나눠 주었다"
      ],
      "answer_index": 0,
      "why_ko": "take는 그가 능동적으로 손을 뻗어 가장 큰 조각을 골라 차지하는 의지적 점유다 — have/get으로 바꾸면 '이미 가지고 있음'이나 '받아 옴'이 되어 손을 뻗어 차지하는 그림이 사라진다. without asking이 그 능동적으로 집어 가는 동작을 못박는다."
    },
    {
      "id": "take-t3",
      "sense_id": "take-grasp",
      "sentence": "He took my hand and pulled me up the slope.",
      "subject_label": "he",
      "object_label": "my hand (grasped)",
      "type": "sense-choice",
      "prompt": "이 took이 그리는 그림으로 가장 가까운 것은?",
      "choices": [
        "내 손이 그의 영역으로 저절로 들어갔다",
        "그가 손을 뻗어 내 손을 붙잡아 자기 쪽으로 끌어 쥐었다",
        "그가 내 손을 다른 사람에게 넘겼다"
      ],
      "answer_index": 1,
      "why_ko": "take my hand는 내 손이 저절로 가는 게 아니라, 그가 능동적으로 뻗어 잡는 점유 동작이다. 잡은 뒤 pulled로 이어지는 것도 그 의지적 붙잡음에서 나온다."
    },
    {
      "id": "take-t4",
      "sense_id": "take-grasp",
      "sentence": "You should take your medicine right after breakfast.",
      "subject_label": "you",
      "object_label": "your medicine (taken in)",
      "type": "sense-choice",
      "prompt": "take medicine은 약을 손에 쥐는 그림일까, 다른 무엇일까? (경계 문항)",
      "choices": [
        "약이 저절로 몸 안으로 들어온다",
        "당신이 약을 약국으로 도로 가져간다",
        "당신이 약을 능동적으로 집어 들어 자기 몸(영역) 안으로 들여 복용한다"
      ],
      "answer_index": 2,
      "why_ko": "take medicine은 엄밀히는 약을 삼켜 복용한다는 굳은 섭취 용법이라 손으로 물건을 집는 take-grasp와는 결이 한 겹 다르다 — 그 점은 솔직히 인정한다. 다만 get medicine(약을 받아 옴)과 달리, '내가 능동적으로 약을 집어 내 몸이라는 영역 안으로 들인다'는 의지적 들임의 방향은 점유 계열과 같다. 그래서 별 결처럼 보여도 능동 점유 쪽에 느슨히 묶인다."
    },
    {
      "id": "take-t5",
      "sense_id": "take-carry",
      "sentence": "Could you take these letters to the post office?",
      "subject_label": "you",
      "object_label": "these letters (carried away)",
      "type": "sense-choice",
      "prompt": "이 take가 그리는 그림은?",
      "choices": [
        "편지가 우체국에서 당신 쪽으로 온다",
        "당신이 편지를 들고 이 자리에서 우체국 쪽으로 가져간다",
        "편지가 당신 영역 안에 가만히 놓여 있다"
      ],
      "answer_index": 1,
      "why_ko": "take ... to는 편지를 잡아 든 채 지금 이 자리에서 멀어지는 우체국 쪽으로 가져가는 이동이다. 이쪽으로 가져오는 bring과 방향이 반대다."
    },
    {
      "id": "take-t6",
      "sense_id": "take-carry",
      "sentence": "Her father takes her to school every morning.",
      "subject_label": "her father",
      "object_label": "her (carried to school)",
      "type": "sense-choice",
      "prompt": "이 takes가 그리는 그림으로 가장 가까운 것은?",
      "choices": [
        "아빠가 그녀를 학교에서 집으로 데려온다",
        "그녀가 스스로 학교에 도착해 닿는다",
        "아빠가 그녀를 데리고 집에서 학교라는 다른 곳으로 데려간다"
      ],
      "answer_index": 2,
      "why_ko": "take her to school은 그녀를 데리고 기준점(집)에서 멀어지는 학교 쪽으로 데려가는 이동이다. 집으로 데려오는 거라면 bring이 되니, take는 '저쪽으로'의 방향을 그린다."
    },
    {
      "id": "take-t7",
      "sense_id": "take-grasp",
      "sentence": "He ___ an umbrella from the stand before stepping into the rain.",
      "subject_label": "he",
      "object_label": "an umbrella (grasped)",
      "type": "verb-choice",
      "prompt": "빈칸에 들어갈 동사로 감각이 맞는 것은?",
      "choices": [
        "took",
        "had",
        "got"
      ],
      "answer_index": 0,
      "why_ko": "had umbrella는 우산이 이미 그의 영역 안에 있는 정적 상태이고, got은 외부에서 와 닿아 받는 도달까지 포함한다. 여기선 그가 스탠드에서 손을 뻗어 우산을 능동적으로 집어 드는 동작이라 took이 맞다 — have(이미 안)·get(와 닿음)과 달리 take는 내가 손을 뻗어 잡는 점유다."
    },
    {
      "id": "take-t8",
      "sense_id": "take-grasp",
      "sentence": "When the tray came around, she ___ a glass of juice.",
      "subject_label": "she",
      "object_label": "a glass of juice (grasped)",
      "type": "verb-choice",
      "prompt": "빈칸에 들어갈 동사로 감각이 맞는 것은? (보기 모두 문법적으로는 가능하다)",
      "choices": [
        "had",
        "made",
        "took"
      ],
      "answer_index": 2,
      "why_ko": "had a glass면 주스가 그냥 그녀 영역 안에 있는 정적 상태고, made a glass면 그녀가 주스를 빚어 만든 것이 된다. 쟁반이 돌아올 때 그녀가 손을 뻗어 한 잔을 집어 든 능동적 점유라 took이 맞다 — 세 동사 모두 문장은 성립하지만 그리는 그림(정적 보유/제작/집어 듦)이 갈린다."
    },
    {
      "id": "take-t9",
      "sense_id": "take-carry",
      "sentence": "Don't forget to ___ your passport with you to the airport.",
      "subject_label": "you",
      "object_label": "your passport (carried along)",
      "type": "verb-choice",
      "prompt": "빈칸에 들어갈 동사로 감각이 맞는 것은? (보기 모두 문법적으로는 가능하다)",
      "choices": [
        "take",
        "get",
        "have"
      ],
      "answer_index": 0,
      "why_ko": "get your passport이면 여권을 손에 넣는 도달이고, have your passport이면 여권이 이미 곁에 있는 상태다 — 둘 다 화자 기준의 방향(deixis)이 없다. with you to the airport은 여권을 지닌 채 화자가 선 자리에서 멀어지는 공항 쪽으로 들고 가는 이동이라 take가 맞다 — 셋 다 문법은 되지만 '화자에게서 멀어지는 방향'으로 데려가는 그림은 take에만 있다."
    },
    {
      "id": "take-t10",
      "sense_id": "take-grasp",
      "sentence": "If the road is blocked, we'll ___ the next exit instead.",
      "subject_label": "we",
      "object_label": "the next exit (chosen)",
      "type": "verb-choice",
      "prompt": "빈칸에 들어갈 동사로 감각이 맞는 것은? (경계 문항 — 보기 모두 문법적으로는 가능하다)",
      "choices": [
        "take",
        "have",
        "get"
      ],
      "answer_index": 0,
      "why_ko": "take the exit은 여러 길 중 다음 출구를 능동적으로 골라 그 길로 들어서는 점유 감각의 확장이다 — 손을 뻗어 하나를 잡듯 경로를 골라잡는다. have the exit(출구가 영역 안에 있음)·get the exit(출구에 도달)과 달리, take는 '내가 골라 그 길을 취한다'는 의지를 그린다. 길을 잡는 것처럼 보여도 능동 점유에 묶이는 경계 자리다."
    }
  ],
  "transfer_items": [
    {
      "id": "take-x1",
      "sense_id": "take-grasp",
      "sentence": "The committee took full responsibility for the delay.",
      "subject_label": "the committee",
      "object_label": "full responsibility (claimed)",
      "type": "sense-choice",
      "prompt": "추상적인 '책임'을 take한다는 건 어떤 그림인가?",
      "choices": [
        "책임이 위원회 쪽으로 저절로 떠밀려 왔다",
        "위원회가 책임을 다른 부서로 넘겼다",
        "위원회가 책임을 능동적으로 끌어안아 자기 영역으로 삼았다"
      ],
      "answer_index": 2,
      "why_ko": "take responsibility는 책임이 떠밀려 오는 게 아니라, 위원회가 스스로 그것을 끌어안아 자기 것으로 점유하는 의지적 행위다. 구체물을 손으로 잡는 take의 능동 점유가 추상으로 확장된 자리다."
    },
    {
      "id": "take-x2",
      "sense_id": "take-carry",
      "sentence": "A strong current took the small boat far out to sea.",
      "subject_label": "the current",
      "object_label": "the small boat (carried away)",
      "type": "sense-choice",
      "prompt": "이 took이 그리는 그림으로 가장 가까운 것은? (주어가 사람이 아니라 물살이다)",
      "choices": [
        "물살이 배를 붙들어 해안에서 멀어지는 바다 쪽으로 실어 갔다",
        "물살이 배를 해안 쪽으로 끌어다 놓았다",
        "배가 스스로 바다로 떠나 닿았다"
      ],
      "answer_index": 0,
      "why_ko": "주어가 물살이어도 take는 배를 붙든 채 기준점(해안)에서 멀어지는 바다 쪽으로 데려가는 이동을 그린다. 이쪽으로 끌어왔다면 bring 쪽이 되니, take는 '멀어지는 방향'의 운반이다."
    },
    {
      "id": "take-x3",
      "sense_id": "take-grasp",
      "sentence": "She ___ a deep breath before walking onto the stage.",
      "subject_label": "she",
      "object_label": "a deep breath (drawn in)",
      "type": "verb-choice",
      "prompt": "빈칸에 들어갈 동사로 감각이 맞는 것은? (보기 모두 문법적으로는 가능하다)",
      "choices": [
        "had",
        "took",
        "got"
      ],
      "answer_index": 1,
      "why_ko": "had a breath면 숨이 그냥 있는 상태고, got a breath이면 숨 돌릴 틈이 와 닿은 도달이다. take a breath은 그녀가 능동적으로 숨을 끌어 들이마시는 행위라 took이 맞다 — 공기를 내 몸 영역 안으로 의지적으로 들이는 take의 점유 감각이다. 세 보기 모두 문장은 되지만 그리는 그림이 갈린다."
    },
    {
      "id": "take-x4",
      "sense_id": "take-carry",
      "sentence": "Could you ___ this message to your manager when you see her?",
      "subject_label": "you",
      "object_label": "this message (carried to the manager)",
      "type": "verb-choice",
      "prompt": "빈칸에 들어갈 동사로 감각이 맞는 것은? (보기 모두 문법적으로는 가능하다)",
      "choices": [
        "take",
        "get",
        "have"
      ],
      "answer_index": 0,
      "why_ko": "get this message면 메시지를 손에 넣는 도달이고, have this message면 메시지가 이미 곁에 있는 상태다 — 둘 다 화자 기준의 방향(deixis)이 없다. to your manager는 메시지를 지닌 채 화자가 선 자리에서 멀어지는 매니저 쪽으로 전해 가는 이동이라 take가 맞다 — 셋 다 문법은 되지만 '화자에게서 멀어지는 방향'으로 전해 가는 그림은 take에만 있다."
    },
    {
      "id": "take-x5",
      "sense_id": "take-grasp",
      "sentence": "He took a different view of the problem from everyone else.",
      "subject_label": "he",
      "object_label": "a different view (adopted)",
      "type": "sense-choice",
      "prompt": "관점을 take한다는 건 어떤 그림인가? (경계 문항)",
      "choices": [
        "그에게 어떤 관점이 저절로 주어져 닿았다",
        "그가 자기 관점을 남에게 넘겨주었다",
        "그가 여러 관점 중 다른 하나를 능동적으로 골라 자기 입장으로 취했다"
      ],
      "answer_index": 2,
      "why_ko": "take a view는 관점이 주어지는 게 아니라, 여러 입장 중 하나를 능동적으로 골라 자기 것으로 취하는 점유의 확장이다 — 손으로 하나를 골라 쥐듯 입장을 골라잡는다. 추상이라 헷갈리기 쉬운 경계지만 능동 점유 감각에 묶인다."
    }
  ]
},
"make": {
  "axis": "core-verbs",
  "item": "make",
  "senses": [
    {
      "id": "make-create",
      "ko": "없던 것을 손으로 빚어 형체가 생기게 하는, 결과물이 남는 제작 감각 — do가 '행위 자체'를 가리킨다면, make는 그 행위 끝에 새로 생겨난 '만들어진 것'을 가리킨다.",
      "image": "두 손이 재료를 주물러 빚자, 처음엔 없던 형체 하나가 그 자리에 새로 솟아나 남는 그림. 행위가 지나간 뒤 빈자리가 아니라 '만들어진 결과물'이 놓여 있다.",
      "boundary_ko": "do는 행위·활동 자체라 끝나면 산물이 따로 안 남지만(do homework — 숙제하는 활동), make는 행위 끝에 *새로 생겨난 것*(make dinner의 음식 같은 구체물이든, make a decision·make a mistake의 결정·오류 같은 추상 산물이든)이 남는다. 한국인이 가장 헷갈리는 갈림: 활동을 수행하면 do, 끝에 새 산물을 빚어내면 make다.",
      "source_refs": [
        {
          "source_id": "langacker-1987",
          "locator": "Vol. II, Ch. on creation / resultant-entity predications",
          "claim": "make류 동사는 행위의 결과로 새로운 개체(resultant entity)가 생겨남을 윤곽 지으며, 결과물의 존재가 의미의 핵심이다 — 행위 자체만 윤곽 짓는 동사와 구별된다."
        },
        {
          "source_id": "oald",
          "locator": "make, sense group: 'create / produce sth' vs do, sense group: 'perform an action / activity'",
          "claim": "make는 무언가를 만들어 내어 결과물이 생기는 용법으로, do는 행위·활동을 수행하는 용법으로 학습자 사전에 구분되어 실려 있다."
        }
      ],
      "validation": {
        "method": "subagent-consensus",
        "strength": "weak",
        "date": "2026-06-11"
      }
    },
    {
      "id": "make-cause",
      "ko": "만들기 감각이 확장돼, 없던 상태·사건을 빚어내 생겨나게 하는 사역 감각 — 사물을 빚듯, 주어가 힘을 가해 어떤 상태나 반응이 새로 생겨나게 한다(make her laugh, make it possible).",
      "image": "주어가 대상에 힘을 밀어 넣자, 그 끝에서 없던 상태나 반응(웃음·가능함)이 새로 빚어져 솟아나는 그림. 제작에서 물건이 생기듯, 여기선 상태·사건이 결과물처럼 생겨난다.",
      "boundary_ko": "make의 사역은 주어가 힘을 가해 결과 상태를 '빚어내는' 그림이다(I made him wait — 내가 그를 기다리는 상태로 몰아넣음). 단순히 시키거나 부탁하는 게 아니라, 결과가 생겨나게 만드는 force가 있다 — 그래서 강제·유발의 뉘앙스가 따라온다. get sb to do(설득해 ~하게 함)보다 force가 직접적이다.",
      "source_refs": [
        {
          "source_id": "talmy-2000",
          "locator": "Vol. I, Ch. on force dynamics — causative 'make' and the application of force toward a resultant state",
          "claim": "make 사역 구문은 힘 역학(force dynamics)에서 작용자가 대상에 힘을 가해 결과 상태·사건이 생겨나게 함을 표현하며, 이는 사물 제작의 결과 생성 도식과 같은 구조를 공유한다."
        },
        {
          "source_id": "langacker-1987",
          "locator": "Vol. II, Ch. on causative predications — X makes Y become/do Z",
          "claim": "make + 목적어 + 보어/원형 구문은 주어가 대상이 어떤 상태에 이르거나 행동하게 하는 사역 관계를 윤곽 지으며, 결과 상태의 발생을 핵심으로 삼는다."
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
      "id": "make-t1",
      "sense_id": "make-create",
      "sentence": "My grandmother made a thick wool blanket for the baby.",
      "subject_label": "my grandmother",
      "object_label": "a wool blanket (created)",
      "type": "sense-choice",
      "prompt": "이 made가 그리는 그림은?",
      "choices": [
        "할머니의 손끝에서 없던 담요 한 장이 새로 빚어져 생겨났다",
        "할머니가 담요를 다루는 활동을 했을 뿐 결과물은 없다",
        "할머니가 이미 있던 담요를 아기에게 건넸다"
      ],
      "answer_index": 0,
      "why_ko": "make a blanket은 담요를 다루는 활동(do)이 아니라, 손으로 빚어 없던 담요 한 장이 결과물로 새로 생겨나는 제작 감각이다. 끝에 형체 있는 결과물이 남는다."
    },
    {
      "id": "make-t2",
      "sense_id": "make-create",
      "sentence": "The carpenter made a sturdy chair out of oak.",
      "subject_label": "the carpenter",
      "object_label": "a chair (created)",
      "type": "sense-choice",
      "prompt": "이 made가 그리는 그림으로 가장 가까운 것은?",
      "choices": [
        "목수가 의자를 옮기는 일을 했다",
        "목수가 의자에 관한 활동만 하고 결과물은 안 남았다",
        "목수가 참나무를 깎아 없던 의자 하나를 형체로 빚어냈다"
      ],
      "answer_index": 2,
      "why_ko": "make a chair는 의자를 다루는 활동이 아니라, 재료(참나무)를 깎아 없던 의자가 결과물로 새로 생겨나는 제작이다. out of oak이 재료에서 형체가 빚어짐을 못박는다."
    },
    {
      "id": "make-t3",
      "sense_id": "make-create",
      "sentence": "Could you make breakfast while I get the kids ready?",
      "subject_label": "you",
      "object_label": "breakfast (created)",
      "type": "sense-choice",
      "prompt": "make breakfast이 그리는 그림은? (do와 헷갈리기 쉽다)",
      "choices": [
        "아침과 관련된 일을 그냥 처리한다 — 결과물은 따로 없다",
        "재료를 손질해 없던 아침 식사가 음식으로 새로 차려져 생겨난다",
        "이미 있던 아침을 식탁으로 나른다"
      ],
      "answer_index": 1,
      "why_ko": "make breakfast은 아침에 관한 활동을 막연히 하는 do가 아니라, 재료에서 아침 식사라는 결과물(음식)을 빚어내는 제작이다. 끝에 먹을 음식이 남는다는 게 do와 갈리는 지점이다."
    },
    {
      "id": "make-t4",
      "sense_id": "make-cause",
      "sentence": "That silly joke made everyone laugh out loud.",
      "subject_label": "that joke",
      "object_label": "everyone laughing (caused)",
      "type": "sense-choice",
      "prompt": "make ... laugh는 어떤 그림인가? (목적어가 사물이 아니라 반응이다)",
      "choices": [
        "농담이 사람들의 웃음을 다른 곳으로 가져갔다",
        "사람들이 원래 웃고 있었고 농담은 무관하다",
        "농담이 힘을 가해 없던 웃음이라는 반응을 사람들에게서 빚어냈다"
      ],
      "answer_index": 2,
      "why_ko": "make laugh는 사물을 빚어내듯, 농담이 힘을 가해 없던 웃음이라는 반응을 사람들에게서 생겨나게 한 사역이다. 제작에서 물건이 생기듯 여기선 웃음이 결과로 솟아난다."
    },
    {
      "id": "make-t5",
      "sense_id": "make-cause",
      "sentence": "New software made the whole process much faster.",
      "subject_label": "new software",
      "object_label": "the process becoming faster (caused)",
      "type": "sense-choice",
      "prompt": "이 made가 그리는 그림으로 가장 가까운 것은?",
      "choices": [
        "소프트웨어가 힘을 가해 '더 빠른 상태'를 그 과정에 새로 빚어냈다",
        "소프트웨어가 빠른 과정을 어디선가 받아 왔다",
        "과정이 원래부터 빨랐고 소프트웨어는 그대로 두었다"
      ],
      "answer_index": 0,
      "why_ko": "make ... faster는 소프트웨어가 그 과정에 힘을 가해 '더 빠름'이라는 결과 상태를 새로 빚어낸 사역이다. 없던 상태를 결과물처럼 생겨나게 하는 제작 감각의 확장이다."
    },
    {
      "id": "make-t6",
      "sense_id": "make-create",
      "sentence": "She always ___ her own birthday cake from scratch.",
      "subject_label": "she",
      "object_label": "her birthday cake (created)",
      "type": "verb-choice",
      "prompt": "빈칸에 들어갈 동사로 감각이 맞는 것은? (보기 모두 문법적으로는 가능하다)",
      "choices": [
        "does",
        "makes",
        "gets"
      ],
      "answer_index": 1,
      "why_ko": "does her cake면 케이크에 관한 활동을 처리한다는 막연한 행위이고, gets her cake면 케이크를 사거나 받아 오는 도달이다. from scratch는 재료에서 없던 케이크를 빚어내는 제작을 못박으므로 makes가 맞다 — do(행위)·get(도달)과 달리 make는 결과물이 새로 생겨남을 그린다."
    },
    {
      "id": "make-t7",
      "sense_id": "make-create",
      "sentence": "Have you ___ your homework for tomorrow's class yet?",
      "subject_label": "you",
      "object_label": "your homework (the activity)",
      "type": "verb-choice",
      "prompt": "빈칸에 들어갈 동사로 감각이 맞는 것은? (경계 — 한국인 최대 혼동 지점)",
      "choices": [
        "made",
        "gotten",
        "done"
      ],
      "answer_index": 2,
      "why_ko": "homework는 빚어낼 결과물이 아니라 '수행하는 활동'이라 do가 맞다(done) — *made your homework은 한국인이 가장 자주 틀리는 자리다. make는 끝에 형체 있는 결과물이 남을 때만 쓴다(make dinner). 숙제는 활동이라 do, 저녁은 결과물이라 make로 갈린다. (경계 문항: do/make의 핵심 분기)"
    },
    {
      "id": "make-t8",
      "sense_id": "make-cause",
      "sentence": "The long delay ___ the passengers angry and restless.",
      "subject_label": "the long delay",
      "object_label": "the passengers becoming angry (caused)",
      "type": "verb-choice",
      "prompt": "빈칸에 들어갈 동사로 감각이 맞는 것은? (보기 모두 문법적으로는 가능하다)",
      "choices": [
        "made",
        "left",
        "got"
      ],
      "answer_index": 0,
      "why_ko": "left the passengers angry는 화난 상태를 그냥 그대로 둔(방치한) 그림이고, got the passengers angry는 어떤 상태에 이르게 함을 그리지만 빚어내는 force가 약하다. made the passengers angry는 지연이 힘을 직접 밀어 넣어 '화난 상태'를 승객들에게 새로 빚어낸 사역이라, 결과 상태를 생겨나게 하는 force가 가장 직접적이다 — 세 동사 모두 문장은 성립하지만 그리는 그림(방치/약한 이행/결과 상태 빚기)이 갈린다."
    },
    {
      "id": "make-t9",
      "sense_id": "make-cause",
      "sentence": "Better lighting will ___ the whole room much cozier.",
      "subject_label": "better lighting",
      "object_label": "the room becoming cozier (caused)",
      "type": "verb-choice",
      "prompt": "빈칸에 들어갈 동사로 감각이 맞는 것은? (보기 모두 문법적으로는 가능하다)",
      "choices": [
        "keep",
        "make",
        "get"
      ],
      "answer_index": 1,
      "why_ko": "keep the room cozier는 이미 아늑한 상태를 유지함이고, get the room cozier는 그 상태에 이르게 하지만 빚어내는 force가 약하다. make는 조명이 힘을 가해 '더 아늑한' 결과 상태를 방에 새로 빚어낸 사역이라 맞다 — 셋 다 문법은 되지만 '없던 상태를 빚어 생겨나게 함'의 force는 make에 가장 또렷하다."
    },
    {
      "id": "make-t10",
      "sense_id": "make-cause",
      "sentence": "Years of practice finally ___ her tricky landing smooth and clean.",
      "subject_label": "years of practice",
      "object_label": "the landing becoming smooth (caused)",
      "type": "verb-choice",
      "prompt": "빈칸에 들어갈 동사로 감각이 맞는 것은? (보기 모두 문법적으로는 가능하다)",
      "choices": [
        "got",
        "kept",
        "made"
      ],
      "answer_index": 2,
      "why_ko": "got her landing smooth는 그 상태에 이르게 하지만 빚어내는 force가 약하고, kept her landing smooth는 이미 매끄러운 상태를 유지함이다. made her landing smooth는 오랜 연습이 힘을 가해 '매끄러운' 결과 상태를 착지에 새로 빚어낸 사역이라 맞다 — 셋 다 문법은 되지만 '없던 결과 상태를 빚어 생겨나게 함'은 make에 가장 또렷하다."
    }
  ],
  "transfer_items": [
    {
      "id": "make-x1",
      "sense_id": "make-create",
      "sentence": "The committee made a detailed plan for the new park.",
      "subject_label": "the committee",
      "object_label": "a detailed plan (created)",
      "type": "sense-choice",
      "prompt": "추상적인 '계획'을 make한다는 건 어떤 그림인가?",
      "choices": [
        "계획에 관한 일을 그냥 처리했을 뿐 남은 것은 없다",
        "위원회가 없던 계획 하나를 짜 맞춰 결과물로 빚어냈다",
        "위원회가 이미 있던 계획을 받아 왔다"
      ],
      "answer_index": 1,
      "why_ko": "make a plan은 계획에 관한 활동(do)이 아니라, 조각들을 짜 맞춰 없던 계획을 결과물로 빚어내는 제작이다. 추상물이어도 끝에 '만들어진 계획'이 남는다 — 사물 제작의 결과 생성이 추상으로 확장된 자리다."
    },
    {
      "id": "make-x2",
      "sense_id": "make-cause",
      "sentence": "The loud thunder made the baby start crying.",
      "subject_label": "the thunder",
      "object_label": "the baby crying (caused)",
      "type": "sense-choice",
      "prompt": "이 made가 그리는 그림으로 가장 가까운 것은?",
      "choices": [
        "천둥이 힘을 가해 없던 울음이라는 반응을 아기에게서 빚어냈다",
        "천둥이 아기의 울음을 멀리 데려갔다",
        "아기가 원래 울고 있었고 천둥은 무관하다"
      ],
      "answer_index": 0,
      "why_ko": "make ... cry는 천둥이 힘을 밀어 넣어 없던 울음이라는 반응을 아기에게서 새로 생겨나게 한 사역이다. 사물을 빚어내듯, 여기선 울음이라는 사건이 결과로 솟아난다."
    },
    {
      "id": "make-x3",
      "sense_id": "make-create",
      "sentence": "Try not to ___ so many spelling mistakes in the final draft.",
      "subject_label": "you",
      "object_label": "spelling mistakes (produced)",
      "type": "verb-choice",
      "prompt": "빈칸에 들어갈 동사로 감각이 맞는 것은? (경계 문항 — 보기 모두 문법적으로는 가능하다)",
      "choices": [
        "do",
        "get",
        "make"
      ],
      "answer_index": 2,
      "why_ko": "mistake는 do가 아니라 make와 짝이다(make a mistake) — 실수는 '저지름'으로 없던 오류가 결과로 생겨나는 것이라 제작 감각에 묶인다. do mistake는 비문에 가깝고, get a mistake는 실수를 받아 온다는 엉뚱한 도달이 된다. 활동이면 do지만 결과물(여기선 오류)이 생기면 make라는 경계 자리다."
    },
    {
      "id": "make-x4",
      "sense_id": "make-cause",
      "sentence": "A short nap can ___ you fresh and clear-headed again.",
      "subject_label": "a short nap",
      "object_label": "you becoming fresh (caused)",
      "type": "verb-choice",
      "prompt": "빈칸에 들어갈 동사로 감각이 맞는 것은? (보기 모두 문법적으로는 가능하다)",
      "choices": [
        "make",
        "get",
        "keep"
      ],
      "answer_index": 0,
      "why_ko": "keep you fresh는 이미 맑은 상태를 유지함이고, get you fresh는 그 상태에 이르게 하지만 빚어내는 force가 약하다. make you fresh는 낮잠이 힘을 가해 '맑고 개운한' 상태를 새로 빚어낸 사역이라 맞다 — 셋 다 문법은 되지만 '없던 상태가 결과로 생겨나게 함'의 force는 make에 가장 또렷하다."
    },
    {
      "id": "make-x5",
      "sense_id": "make-cause",
      "sentence": "Clear instructions will make the assembly possible for anyone.",
      "subject_label": "clear instructions",
      "object_label": "the assembly becoming possible (caused)",
      "type": "sense-choice",
      "prompt": "make it possible은 어떤 그림인가? (경계 문항 — 추상 상태를 빚어낸다)",
      "choices": [
        "설명서가 '가능함'이라는 상태를 다른 데서 가져왔다",
        "설명서가 힘을 가해 '가능한' 상태를 조립에 새로 빚어냈다",
        "조립이 원래 가능했고 설명서는 그대로 두었다"
      ],
      "answer_index": 1,
      "why_ko": "make ... possible은 설명서가 힘을 가해 없던 '가능함'이라는 상태를 조립에 새로 생겨나게 한 사역이다. 사물을 빚어내듯 추상 상태(가능함)를 결과물처럼 빚어내는 자리라, 헷갈리기 쉬운 경계지만 make의 결과 생성 감각에 묶인다."
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
},
"out": {
  "axis": "particles",
  "item": "out",
  "senses": [
    {
      "id": "out-exit",
      "ko": "용기·테두리 안에 있던 것이 그 경계를 넘어 밖으로 나가는, 안→밖 방향의 공간 감각.",
      "image": "둥근 용기(원) 안에 있던 것이 화살표를 따라 테두리를 넘어 바깥으로 빠져나가는 그림 — 안에 갇혀 있던 것이 경계 밖으로 나온다.",
      "boundary_ko": "이 exit out은 문자 그대로의 안→밖이라 반대 방향 in이 그대로 선다(go out ↔ go in, take out ↔ put in). 방향을 뒤집어 in이 서면 exit 감각이다 — 뒤집어도 in이 안 서면(다음 reveal 감각) exit이 아니다.",
      "source_refs": [
        {
          "source_id": "lindner-1981",
          "locator": "Ch. on OUT — spatial schema: trajector exits the bounded landmark (container)",
          "claim": "불변화사 OUT의 의미망은 trajector가 경계 지어진 용기(landmark) 안에서 그 경계를 넘어 밖으로 나가는 공간 도식을 핵으로 삼는다."
        },
        {
          "source_id": "tyler-evans-2003",
          "locator": "Ch. on out — proto-scene: trajector outside the boundaries of a landmark container",
          "claim": "out은 trajector가 landmark 용기의 경계 바깥에 위치하거나 그쪽으로 이동하는 원형 장면(proto-scene)을 가진다."
        }
      ],
      "validation": {
        "method": "subagent-consensus",
        "strength": "weak",
        "date": "2026-06-11"
      }
    },
    {
      "id": "out-reveal",
      "ko": "용기 도식이 은유로 확장된 감각 — 숨어(가려) 있던 것이 시야·접근 가능한 밖으로 드러나 잡히게 된다(find out, come out, point out). 안 보이던 게 경계를 넘어 '보이는 영역'으로 나온다.",
      "image": "가려진 상자(혹은 안개) 안에 숨어 있던 것이 경계를 넘어 밖으로 나와, 이제 눈에 보이고 손이 닿는 영역에 드러나는 그림 — 숨음에서 드러남으로.",
      "boundary_ko": "이 reveal out은 '드러남' 쪽으로만 확장돼 반대 방향이 없다 — *find in·*come in(드러나다 뜻)이 안 선다. exit out은 in으로 뒤집히지만(go out↔go in) reveal out은 안 뒤집힌다. 뒤집어 in이 안 서면 reveal 감각이다.",
      "source_refs": [
        {
          "source_id": "lindner-1981",
          "locator": "Ch. on OUT — extension to 'accessibility / coming into view' (find out, come out)",
          "claim": "OUT의 의미망은 용기에서 밖으로 나가는 공간 도식에서, 숨어 있던 대상이 드러나 접근·인지 가능해지는(visible/accessible) 의미로 확장된다."
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
      "id": "out-t1",
      "sense_id": "out-exit",
      "sentence": "She walked out of the meeting room in a hurry.",
      "subject_label": "she",
      "object_label": "exit the room",
      "type": "sense-choice",
      "prompt": "이 out이 그리는 그림은?",
      "choices": [
        "그녀가 회의실 안에서 경계를 넘어 바깥으로 나가는 방향",
        "그녀가 회의 안건을 끝까지 다 드러내 밝혔다",
        "walk out은 그냥 외우는 숙어라 out에 그림이 없다"
      ],
      "answer_index": 0,
      "why_ko": "walk out of는 그녀가 회의실이라는 용기 안에서 경계를 넘어 밖으로 나가는 안→밖 방향 감각이다. 반대로 들어가면 walk in이 그대로 서니 문자적 exit out이다."
    },
    {
      "id": "out-t2",
      "sense_id": "out-exit",
      "sentence": "Please take the trash out before you leave.",
      "subject_label": "the trash",
      "object_label": "move outside",
      "type": "sense-choice",
      "prompt": "take ... out이 그리는 그림은?",
      "choices": [
        "쓰레기를 끝까지 다 처리해 완료함",
        "쓰레기가 집(안)에서 경계를 넘어 바깥으로 옮겨지는 방향",
        "take out은 '음식을 포장한다'는 뜻뿐이라 쓰레기엔 안 쓴다"
      ],
      "answer_index": 1,
      "why_ko": "take the trash out은 쓰레기가 집이라는 용기 안에서 밖으로 옮겨지는 안→밖 방향이다. 안으로 들이면 take in 쪽이 서니 문자적 exit out이다."
    },
    {
      "id": "out-t3",
      "sense_id": "out-exit",
      "sentence": "The cat got out through the open window.",
      "subject_label": "the cat",
      "object_label": "escape outside",
      "type": "sense-choice",
      "prompt": "get out이 그리는 그림으로 가장 가까운 것은?",
      "choices": [
        "고양이가 어떤 사실을 드러내 알려 줬다",
        "고양이가 나가는 일을 완전히 끝냈다",
        "고양이가 집(안)에서 창문 경계를 넘어 바깥으로 빠져나간 방향"
      ],
      "answer_index": 2,
      "why_ko": "get out은 고양이가 집이라는 용기 안에서 열린 창의 경계를 넘어 밖으로 나간 안→밖 방향이다. 다시 들이면 get in이 서니 문자적 exit out이다."
    },
    {
      "id": "out-t4",
      "sense_id": "out-exit",
      "sentence": "He poured the milk out into a glass.",
      "subject_label": "the milk",
      "object_label": "flow outside",
      "type": "sense-choice",
      "prompt": "pour ... out이 그리는 그림은?",
      "choices": [
        "우유가 통(안)에서 경계를 넘어 바깥(잔)으로 흘러 나가는 방향",
        "우유를 끝까지 다 따라 통을 완전히 비웠다",
        "pour out은 '속마음을 털어놓다'라는 뜻이라 우유엔 못 쓴다"
      ],
      "answer_index": 0,
      "why_ko": "pour ... out은 우유가 통이라는 용기 안에서 경계를 넘어 바깥으로 흘러 나가는 안→밖 방향이다. 우유를 통에 도로 부으면 pour in이 서니 문자적 exit out이다. (이 문장은 '다 비움'이 아니라 흘러 나가는 방향 자체를 본다)"
    },
    {
      "id": "out-t5",
      "sense_id": "out-reveal",
      "sentence": "I finally found out the truth about the accident.",
      "subject_label": "the truth",
      "object_label": "becomes known",
      "type": "sense-choice",
      "prompt": "find out이 그리는 그림으로 가장 가까운 것은? (진실은 어디로 나오는 걸까?)",
      "choices": [
        "진실을 방 밖으로 들고 나갔다",
        "숨어 있던 진실이 가려진 데서 드러나 내가 알게 되는(보이는 영역으로 나오는) 그림",
        "find out은 그냥 find를 강조한 것이라 out은 의미 없다"
      ],
      "answer_index": 1,
      "why_ko": "find out은 진실이 물리적으로 밖으로 나가는 게 아니라, 숨어 있던 진실이 드러나 내 인지 영역으로 나오는 확장된 out이다. 그래서 반대로 *find in은 안 선다 — exit out과 달리 드러남 쪽으로만 확장됐다."
    },
    {
      "id": "out-t6",
      "sense_id": "out-reveal",
      "sentence": "The teacher pointed out my spelling mistake.",
      "subject_label": "my mistake",
      "object_label": "brought to view",
      "type": "sense-choice",
      "prompt": "point out이 그리는 그림은?",
      "choices": [
        "선생님이 실수를 교실 밖으로 내보냈다",
        "실수를 고치는 일을 끝까지 완료했다",
        "안 보이던 실수가 가리킴을 받아 눈에 보이는 영역으로 드러나는 그림"
      ],
      "answer_index": 2,
      "why_ko": "point out은 실수를 밖으로 옮기는 게 아니라, 가려져 있던 실수가 가리킴을 받아 보이는 영역으로 드러나는 확장된 out이다. *point in이 안 서니 reveal 감각이다."
    },
    {
      "id": "out-t7",
      "sense_id": "out-reveal",
      "sentence": "The stars came out as the sky grew dark.",
      "subject_label": "the stars",
      "object_label": "become visible",
      "type": "sense-choice",
      "prompt": "come out이 그리는 그림으로 가장 가까운 것은?",
      "choices": [
        "별이 보이지 않던 데서 드러나 눈에 보이는 영역으로 나오는 그림",
        "별이 하늘 끝까지 다 차올라 완료됐다",
        "come out은 '데이트하러 나오다'라는 뜻뿐이라 별엔 안 쓴다"
      ],
      "answer_index": 0,
      "why_ko": "come out은 별이 어디서 물리적으로 빠져나오는 게 아니라, 낮 동안 가려져 안 보이던 별이 드러나 보이는 영역으로 나오는 확장된 out이다. *come in(드러나다)이 안 서니 reveal 감각이다."
    },
    {
      "id": "out-t8",
      "sense_id": "out-reveal",
      "sentence": "Her new book comes out next spring.",
      "subject_label": "her book",
      "object_label": "released to public",
      "type": "sense-choice",
      "prompt": "책이 come out한다는 건 어떤 그림인가?",
      "choices": [
        "책을 서점 밖으로 들고 나간다",
        "책 쓰는 일을 끝까지 완료한다",
        "아직 세상에 안 나온(가려진) 책이 드러나 사람들이 접근할 수 있는 영역으로 나온다"
      ],
      "answer_index": 2,
      "why_ko": "(출간되다) come out은 책이 물리적으로 밖으로 나가는 게 아니라, 아직 세상에 없던 책이 드러나 누구나 접근할 수 있는 영역으로 나오는 확장된 out이다. *come in이 안 서니 reveal 감각이다."
    },
    {
      "id": "out-t9",
      "sense_id": "out-exit",
      "sentence": "The firefighters helped everyone climb ___ of the building.",
      "subject_label": "everyone",
      "object_label": "exit the building",
      "type": "sense-cloze",
      "prompt": "빈칸에 들어갈 불변화사로 감각이 맞는 것은?",
      "choices": [
        "out",
        "up",
        "off"
      ],
      "answer_index": 0,
      "why_ko": "climb out of는 사람들이 건물이라는 용기 안에서 경계를 넘어 바깥으로 빠져나가는 안→밖 방향이라 out이 맞다(반대로 climb in이 선다). up은 '아래→위'(climb up)의 수직 방향이고 off는 '붙어 있다 분리됨'의 그림인데, 이 문장은 건물 안에서 밖으로 나오는 그림이라 안→밖의 out만 맞는다."
    },
    {
      "id": "out-t10",
      "sense_id": "out-reveal",
      "sentence": "It will take weeks to figure ___ what went wrong.",
      "subject_label": "the cause",
      "object_label": "becomes known",
      "type": "sense-cloze",
      "prompt": "빈칸에 들어갈 불변화사로 감각이 맞는 것은?",
      "choices": [
        "out",
        "up",
        "in"
      ],
      "answer_index": 0,
      "why_ko": "figure out은 가려져 있던 원인이 드러나 알게 되는(보이는 영역으로 나오는) 확장된 out이라 맞다 — *figure in(알아내다)은 안 선다. up은 '끝까지 차올라 완료'이고 in은 '안으로 들임'의 그림인데, 이 문장은 '안 보이던 게 드러나 알게 됨'이라 드러남의 out만 맞는다."
    }
  ],
  "transfer_items": [
    {
      "id": "out-x1",
      "sense_id": "out-exit",
      "sentence": "Smoke was drifting out of the chimney all morning.",
      "subject_label": "the smoke",
      "object_label": "flow outside",
      "type": "sense-choice",
      "prompt": "drift out이 그리는 그림은?",
      "choices": [
        "연기가 굴뚝(안)에서 경계를 넘어 바깥으로 흘러 나가는 방향",
        "연기가 굴뚝 끝까지 차올라 완료됐다",
        "drift out은 '잠들다'라는 뜻의 숙어라 굴뚝엔 안 쓴다"
      ],
      "answer_index": 0,
      "why_ko": "drift out of는 연기가 굴뚝이라는 용기 안에서 경계를 넘어 바깥으로 흘러 나가는 안→밖 방향이다. 안으로 빨려 들면 drift in 쪽이 서니 문자적 exit out이다."
    },
    {
      "id": "out-x2",
      "sense_id": "out-reveal",
      "sentence": "The full story only came out years later.",
      "subject_label": "the story",
      "object_label": "becomes known",
      "type": "sense-choice",
      "prompt": "이야기가 come out한다는 건 어떤 그림인가?",
      "choices": [
        "이야기를 방 밖으로 들고 나갔다",
        "감춰져 있던 이야기 전말이 드러나 사람들이 알게 되는 영역으로 나온다",
        "이야기를 끝까지 다 써서 완료했다"
      ],
      "answer_index": 1,
      "why_ko": "come out은 이야기가 물리적으로 밖으로 나가는 게 아니라, 오래 감춰져 있던 전말이 드러나 사람들이 알 수 있는 영역으로 나오는 확장된 out이다. *come in이 안 서니 reveal 감각이다."
    },
    {
      "id": "out-x3",
      "sense_id": "out-exit",
      "sentence": "The kids ran out into the yard to play.",
      "subject_label": "the kids",
      "object_label": "exit outside",
      "type": "sense-choice",
      "prompt": "run out이 그리는 그림으로 가장 가까운 것은? (run out of와 헷갈리지 말 것)",
      "choices": [
        "아이들이 노는 일을 끝까지 완료했다",
        "아이들의 기운이 바닥나 다 떨어졌다",
        "아이들이 실내(안)에서 경계를 넘어 마당(밖)으로 뛰어 나가는 방향"
      ],
      "answer_index": 2,
      "why_ko": "여기서 run out은 아이들이 집 안에서 마당 밖으로 뛰어 나가는 안→밖 방향 exit이다. (run out of '바닥나다'의 out은 그릇 안 내용물이 다 빠져나가 텅 빈다는 같은 안→밖 도식의 은유 — 둘 다 '안의 것이 밖으로'다.) 여기선 방향 자체라 ran in이 서니 문자적 exit out이다."
    },
    {
      "id": "out-x4",
      "sense_id": "out-reveal",
      "sentence": "Scientists are still trying to work ___ how the virus spreads.",
      "subject_label": "the mechanism",
      "object_label": "becomes known",
      "type": "sense-cloze",
      "prompt": "빈칸에 들어갈 불변화사로 감각이 맞는 것은? (work out은 '운동'? '풀리다'?)",
      "choices": [
        "out",
        "up",
        "off"
      ],
      "answer_index": 0,
      "why_ko": "여기 work out은 운동(work out at the gym)이 아니라, 가려져 있던 작동 방식이 드러나 알게 되는(풀려서 보이는 영역으로 나오는) 확장된 out이다 — 답·해법이 안 보이다가 '나온다'. up은 '끝까지 차올라 완료', off는 '붙어 있다 분리됨'의 그림인데, 이 문장은 '안 풀리던 게 드러나 알게 됨'이라 드러남의 out만 맞는다."
    },
    {
      "id": "out-x5",
      "sense_id": "out-exit",
      "sentence": "Could you let the dog out before bedtime?",
      "subject_label": "the dog",
      "object_label": "move outside",
      "type": "sense-choice",
      "prompt": "let ... out이 그리는 그림은?",
      "choices": [
        "강아지가 집(안)에서 경계를 넘어 바깥으로 나가게 해 주는 방향",
        "강아지를 재우는 일을 끝까지 완료한다",
        "강아지의 비밀을 드러내 알려 준다"
      ],
      "answer_index": 0,
      "why_ko": "let the dog out은 강아지가 집이라는 용기 안에서 경계를 넘어 밖으로 나가도록 해 주는 안→밖 방향이다. 도로 들이면 let in이 서니 문자적 exit out이다."
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
    },
    {
      "id": "opaque-idiom",
      "ko": "두 그림의 합으로 깔끔히 갈리지 않는 관용 구동사 — 역사 속에서 한 덩어리로 굳어진 표현이라, 동사+불변화사로 분해하지 말고 통째로 익히는 게 맞다(bring up=화제를 꺼내다, look up=찾다, make up=지어내다). 학자들도 갈리는 사례(give up 등)는 그 '합성 테스트가 깔끔히 안 갈린다'는 사실 자체가 통째로 익히라는 신호다.",
      "image": "두 그림(동사 그림 + 불변화사 그림)을 합쳐 봐도 뜻이 안 나오는 자물쇠 그림 — 열쇠는 합성이 아니라 그 표현이 굳어진 역사다. 합쳐서 안 열리면 통째로 외운다.",
      "boundary_ko": "먼저 합성 테스트(두 그림으로 분해되는가)를 해 본다 — drink up·pack up처럼 동사+완료로 뜻이 그대로 나오면 합성(compose-*), bring up(화제를 꺼내다)·look up(찾다)·make up(지어내다)처럼 합쳐도 뜻이 깔끔히 안 갈리면 관용이다. 학자들도 갈리는 사례(give up 등)는 합성 테스트가 깔끔히 안 갈린다는 사실 자체가 통째로 익히라는 신호다. 관용임을 *아는 것*이 '모든 구동사=그림의 합'이라는 과신을 막는다 — 구석의 자백이 아니라 정면으로 배운다.",
      "source_refs": [
        {
          "source_id": "lindner-1981",
          "locator": "Ch. on UP — idiomatized vs. compositional verb-particle constructions",
          "claim": "동사+UP 구문의 의미망 분석은 합성적으로 환원되는 사례와, 역사적으로 관용화되어 합성으로 완전히 환원되지 않는 사례를 구분한다 — 모든 VPC가 동일하게 투명한 합성은 아니다."
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
    },
    {
      "id": "pup-t9",
      "sense_id": "opaque-idiom",
      "sentence": "Don't bring up politics at dinner.",
      "subject_label": "you",
      "object_label": "raise a topic",
      "type": "sense-choice",
      "prompt": "bring up('화제를 꺼내다')이 그리는 그림은? (두 그림으로 분해해 보면?)",
      "choices": [
        "'가져오다(bring)' + '위로(up)' — 정치를 위로 들어 올렸다",
        "'가져오다(bring)' + '끝까지(up)' — 화제를 끝까지 가져와 완료했다",
        "합성으로 깔끔히 안 갈리는 굳은 표현 — '화제를 꺼내다' 한 덩어리로 통째로 익힌다"
      ],
      "answer_index": 2,
      "why_ko": "bring의 그림(이쪽으로 가져옴)에 up을 합쳐도 '(말을) 꺼내다'는 깔끔히 안 나온다 — ①의 수직 합성도, ②의 완료 합성도 bring up을 깔끔히 설명하지 못한다. 합성 테스트가 갈리지 않으면 통째로 익히는 게 정직하다.",
      "verb_label": "bring"
    },
    {
      "id": "pup-t10",
      "sense_id": "opaque-idiom",
      "sentence": "He made up a silly excuse on the spot.",
      "subject_label": "he",
      "object_label": "invented out of nothing",
      "type": "sense-choice",
      "prompt": "make up('지어내다')이 그리는 그림은? (두 그림으로 분해되나?)",
      "choices": [
        "'만들다(make)' + '위로(up)' — 변명을 위로 쌓아 올렸다",
        "두 그림을 합쳐도 '지어내다'가 안 나오는 굳은 표현 — 통째로 익힌다",
        "'만들다(make)' + '끝까지(up)' — 변명 만들기를 완전히 끝냈다"
      ],
      "answer_index": 1,
      "why_ko": "make의 그림(만들다)에 up(위로/끝까지)을 합쳐 봐도 '없는 걸 꾸며 지어내다'라는 뜻은 안 나온다 — ①의 수직 합성도, ③의 완료 합성도 make up(지어내다)을 못 설명한다. give up·look up(찾다)과 같은 관용이라, 합성 테스트가 안 되면 통째로 익히는 게 맞다.",
      "verb_label": "make"
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
    },
    {
      "id": "pup-x5",
      "sense_id": "opaque-idiom",
      "sentence": "If you don't know the word, look it up in the dictionary.",
      "subject_label": "you",
      "object_label": "search and find",
      "type": "sense-choice",
      "prompt": "look up('사전에서 찾다')은 두 그림의 합으로 풀리나?",
      "choices": [
        "'보다(look)' + '위로(up)' — 시선을 위로 들어 올린다(look up at the sky)",
        "'보다(look)' + '끝까지(up)' — 보는 일을 완전히 끝낸다",
        "'찾아본다'는 뜻은 두 그림의 합으로 안 나오는 굳은 관용 — 통째로 익힌다"
      ],
      "answer_index": 2,
      "why_ko": "look up at the sky의 look up은 시선이 위로 가는 수직 합성이지만(①), 사전에서 '찾다'라는 뜻의 look up은 합성으로 안 풀린다 — look(보다)+up(위로)을 합쳐도 '정보를 찾아본다'가 안 나온다. 같은 표면형이라도 한쪽은 합성, 한쪽은 관용이다. 합성 테스트가 배신하면(②의 완료도 안 맞음) 통째로 익히는 게 정직하다.",
      "verb_label": "look"
    }
  ]
}
};
