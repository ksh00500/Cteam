import React, { useEffect, useState, useRef } from "react";
import "./CloudCaptionsEffect.css";

// 의미 없는 반응/특수문자는 유지하고, 영상 댓글형 밈 대신 축제 게임에 맞는 문구를 사용합니다.
const TEXT_TEMPLATES = [
  "ㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋ",
  "와아아아아아아아아아아아아아아아아아아",
  "??????????????????????????????????????????????",
  "!!!!!!!!!!!!!!!!!대박!!!!!!!!!!!!!!!!!!!!!!!!",
  "10초 감각 자신 있어?",
  "딱 10.00초 맞혀봐!",
  "손 떨리면 안 돼!",
  "기록 갱신 가자!",
  "오늘의 1등은 누구?",
  "시간 감각 테스트!",
  "과연 몇 초일까?",
  "타이밍을 믿어봐!",
  "아슬아슬한데?",
  "정지 버튼 어디 갔지?",
  "집중! 집중!",
  "（⌐■_■）",
  "ㄹㅇㅋㅋ",
  "ლ(ಠ益ಠ)ლ",
  "ㅋㅋㅋㅋㅋㅋㅋㅋ미쳤다",
  "앜ㅋㅋㅋㅋㅋㅋ"
];

const CAT_ART = `／l、
（ﾟ､ ｡ ７
 l、ﾞ ~ヽ
 じしf_, )ノ`;

const BRAILLE_ART_1 = `⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡀⠁⠀⠀⠀⡐⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⢀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠀⠀⠒⠀⠖⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠳⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⠀⠠⠤⢤⠂⠀⠀⠀⠠⠐⠈
⠀⠀⢀⡀⠀⠀⠀⠀⢀⠄⠀⠀⠐⠀⠀⠀⠀⠀⠈⠀⠀⠀⡀⠀⠀⠐⠀⠀⠀⡄
⠄⡮⢒⣂⡁⠂⢠⠈⠀⠀⠀⠠⠁⠀⠀⠀⠀⠀⠆⠠⠤⠤⠈⠉⠀⠀⠀⠀⠀⡰
⣅⣿⢻⡿⢀⣄⠱⠀⠀⠀⠀⠀⠢⡀⢀⠄⡒⠍⠀⠀⠀⠀⠀⠀⠀⠑⠤⠔⠁⠒
⡽⠟⢙⣦⣾⠃⠀⠀⠐⠒⠒⠒⠂⠉⠁⡠⠀⠀⠠⢄⠀⠀⠀⠀⢸⠀⠀⠀⠀⠀
⠙⢾⠟⠊⢠⠂⠀⠀⠀⠀⠀⠀⢀⠄⠈⠀⠀⠀⠀⠀⠈⠐⠤⡀⠀⡆⠀⠀⠀⠀
⠀⠀⠈⠉⠀⠂⠠⠄⠀⣀⠀⡘⠀⠀⠀⠀⠀⠀⠀⠀⠀⠃⠀⠐⠀⠈⢂⠀⠌⠀
⠀⠀⠀⠀⠀⠀⠁⠠⡀⠀⠉⡇⠀⠀⠀⠀⠀⠀⠀⡀⠄⠃⠀⢀⠀⠊⠀⠀⠀⠈
⠀⠀⠀⠀⠀⠀⠀⠀⠈⢉⡸⠀⠀⠀⡇⠐⠒⠒⠛⠂⢴⠒⠀⠁⠀⠀⠀⠀⠀⠀`;

const BRAILLE_ART_2 = `⠀⠀⠀⠀⢠⠁⠉⠉⠉⣍⣉⢻⠿⣿⣷⡶⣶⠶⠛⠋⠉⠁⣀⡀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⣴⡿⣠⣠⠴⢻⡟⡿⣿⣶⣀⣻⣧⡀⠀⣀⣦⣢⣿⣟⠃⠀⠀⠀⠀⠀⠀
⠀⠀⢐⠀⠀⠈⠑⠀⠾⠯⠿⢿⣿⣿⠏⠛⠤⠲⠉⢁⣿⣿⣿⡿⠀⠀⠀⠀⠀⠀
⠀⠀⠁⠀⠀⠀⠀⠀⠲⢦⡠⠴⠶⡗⠶⣢⣀⣀⣠⣡⣶⢤⡤⡤⠀⠀⠀⠀⠀⠀
⠀⢀⠀⠀⠀⠀⠀⠀⠀⢠⣡⣦⠿⠾⠟⠻⠛⠛⠛⠛⢳⣶⡔⡁⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⣴⣿⣥⢴⢤⣤⣤⣤⣤⣤⣤⣶⣾⣿⣿⠁⠀⠀⢈⠀⠀⠀
⢀⣴⣾⣶⣦⣴⣤⣾⣿⣿⣄⢀⣿⣿⣿⣿⣿⣿⣿⣛⠻⣿⡏⣤⣾⣦⠄⠀⠀⠀
⣿⣿⣿⣿⣿⣿⣿⣿⣿⢿⠋⠉⠉⠉⠉⠉⠉⠉⠉⠉⢀⡝⣱⣿⡿⠋⠀⠀⠀⠀`;

const BRAILLE_ART_3 = `⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡤⠀⠠⠄⠠⢀⡠⠄⠠⠠⣀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⢀⡀⠀⠠⠔⠖⠒⠒⠒⣤⢤⠤⠀⠠⡗⡀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⡐⠁⠀⢀⣠⢀⠀⣀⣀⠠⣄⣂⠀⠀⠀⢀⠀⡠⡀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⡐⠀⢀⠔⠽⠚⠀⠐⠃⠂⠇⡒⡈⢄⢀⠠⣑⠥⠤⠜⢲⠀⠀⠀
⠀⠀⠀⠀⠀⠐⠀⠀⠈⠈⠚⠭⣹⣽⣟⢻⡄⠀⠨⢚⠠⢱⣸⡗⠏⠑⢉⠀⠀⠀
⠀⠀⠀⠀⢀⠆⠀⠀⠀⠀⠀⠓⠠⠌⢍⣟⣀⣀⡐⠒⠶⣞⡛⡛⢓⢰⠀⠀⠀⠀
⠀⠀⠀⠀⡌⠀⠀⠀⣐⣂⠀⠀⠀⠀⠀⢀⡠⠄⠁⠀⠀⠈⠂⠄⠁⠁⢠⡀⠀⠀
⠀⠀⠀⢠⠀⠀⠀⠈⢿⣷⣦⣦⣄⣀⢉⡁⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣽⠃⠀⠀
⠀⠀⡀⠀⠠⠀⡒⠀⠀⠙⠻⢿⣿⣿⣿⣿⣿⣿⣶⣶⣶⣶⣶⣶⣶⣿⡇⠀⠀⠀
⠀⢀⡀⠀⠀⠀⣃⡠⢥⠀⠀⠀⠈⠉⢁⠿⠿⠿⠿⠿⠿⠿⠿⠿⠟⢻⠁⠀⠀⠀
⢀⣿⣿⣷⣦⡰⠁⠴⠮⠒⣈⠩⣂⡤⠊⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣤⣄⠀⠀⠀
⣸⣿⣿⣿⣿⠇⠀⠀⠰⠞⠗⢋⢠⣋⣴⣦⣤⣦⣤⣤⣤⣤⣴⣴⡁⣿⣿⣷⣄⠀
⣿⣿⣿⣿⡟⠀⠀⠀⠀⠐⠊⣠⣔⢿⣿⢿⠟⠛⠻⠿⠿⢿⣿⣿⣿⣿⣿⣿⣿⣦
⣿⣿⣿⣿⣧⠀⢄⠀⠀⢈⣿⣿⣿⣷⣶⣿⣄⠀⠀⣠⣷⣾⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣶⣤⣾⣿⣿⣿⣿⣿⣿⣿⣦⠀⠀⢠⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿`;

const ART_TEMPLATES = [CAT_ART, BRAILLE_ART_1, BRAILLE_ART_2, BRAILLE_ART_3];

// 가짜 타이머 컴포넌트


export default function CloudCaptionsEffect({ elapsedTime, isRunning, roundId }) {
  const [captions, setCaptions] = useState([]);
  const lastLaneRef = useRef(-1);

  // 라운드가 변경되거나 정지되면 자막 리스트 리셋
  useEffect(() => {
    setCaptions([]);
  }, [roundId]);

  // 새로운 자막 생성 함수
  const spawnCaption = (initialDelay = 0) => {
    const id = Math.random().toString(36).substring(2, 9);
    
    // 이전에 사용한 라인을 피해서 6개의 라인(0-5) 중 무작위 선택
    let lane = Math.floor(Math.random() * 6);
    if (lane === lastLaneRef.current) {
      lane = (lane + 1) % 6;
    }
    lastLaneRef.current = lane;

    const speed = 1.2 + Math.random() * 5.3; // 1.2초 ~ 6.5초 사이의 폭넓고 무작위적인 이동 속도
    const colorIndex = Math.floor(Math.random() * 7) + 1; // 1 ~ 7번 컬러 테마
    
    // 자막 종류 결정 (80% 일반 텍스트, 20% 아스키/점묘화 아트)
    const rand = Math.random();
    let type = "text";
    if (rand < 0.20) {
      type = "art";
    }

    let content = "";
    let isArt = false;
    // isFake removed
    let fakeOffset = 0;
    let fakeSpeed = 1;

    if (type === "art") {
      content = ART_TEMPLATES[Math.floor(Math.random() * ART_TEMPLATES.length)];
      isArt = true;
    } else {
      content = TEXT_TEMPLATES[Math.floor(Math.random() * TEXT_TEMPLATES.length)];
    }

    const newCaption = {
      id,
      lane,
      speed,
      colorIndex,
      content,
      isArt,
      // isFake removed
      fakeOffset,
      fakeSpeed,
      initialDelay // 초 단위 음수 딜레이 설정 시 화면 중간에서 시작하게 됨
    };

    setCaptions((prev) => [...prev, newCaption]);

    // 애니메이션 지속 시간 + 마진 뒤에 목록에서 자막 제거하여 메모리 관리
    setTimeout(() => {
      setCaptions((prev) => prev.filter((c) => c.id !== id));
    }, (speed + (initialDelay < 0 ? initialDelay : 0)) * 1000 + 1000);
  };

  // 게임 실행 중 주기적 스폰 및 초기 스폰
  useEffect(() => {
    if (!isRunning) return;

    // 타이머 시작 시 화면이 텅 비어있지 않도록 즉시 6개의 초기 자막 스폰 (음수 딜레이 활용)
    spawnCaption(-0.5);
    spawnCaption(-1.0);
    spawnCaption(-1.5);
    spawnCaption(-2.0);
    spawnCaption(-2.5);
    spawnCaption(-3.0);

    // 0.35초 간격으로 매우 빈번하게 새로운 자막 추가
    const spawnTimer = setInterval(() => {
      spawnCaption(0);
    }, 350);

    return () => {
      clearInterval(spawnTimer);
    };
  }, [isRunning]);

  return (
    <>
      {captions.map((cap) => {
        // 라인별 Y축 위치 계산 (예: 총 6개 라인, 상하단 여백 확보)
        const topPercent = 5 + cap.lane * 15;
        
        let className = `dmr-004-caption dmr-004-color-${cap.colorIndex}`;
        if (cap.isArt) className += " dmr-004-caption-art";
        if (cap.isFake) className += " dmr-004-caption-fake-timer";

        const style = {
          top: `${topPercent}%`,
          animationDuration: `${cap.speed}s`,
          animationPlayState: isRunning ? "running" : "paused",
        };

        // 음수 애니메이션 딜레이 추가 (이미 스크롤 진행 중인 연출)
        if (cap.initialDelay < 0) {
          style.animationDelay = `${cap.initialDelay}s`;
        }

        return (
          <div key={cap.id} className={className} style={style}>
            {cap.isArt ? (
              cap.content
            ) : (
              cap.content
            )}
          </div>
        );
      })}
    </>
  );
}
