
import { GameState, Sector, SimulationEvent, SimulationSpeed } from './types';

// export const TICK_RATE = 1000 / 60; // Approx 60 FPS - Replaced by SIMULATION_SPEEDS

export const SIMULATION_SPEEDS: Record<SimulationSpeed, number> = {
  slow: 200,    // Milliseconds per tick
  middle: 100,
  fast: 50,
};
export const DEFAULT_SIMULATION_SPEED: SimulationSpeed = 'middle';
export const START_YEAR = 1925; 


export const SIMULATION_PARAMS = {
  PRESSURE_COEFFICIENT: 0.005, 
  FRICTION_COEFFICIENT: 0.05,  
  EXTERNAL_FORCE_DECAY: 0.95, 
};

export const INITIAL_SECTORS_DATA: Sector[] = [
  { id: 'tech', name: '기술주', capital: 800, pressure: 0, external_force: 0 }, 
  { id: 'finance', name: '금융주', capital: 1200, pressure: 0, external_force: 0 },
  { id: 'healthcare', name: '헬스케어', capital: 600, pressure: 0, external_force: 0 },
  { id: 'value', name: '가치주', capital: 1500, pressure: 0, external_force: 0 },
  { id: 'emerging', name: '신흥 시장', capital: 400, pressure: 0, external_force: 0 },
  { id: 'renewable', name: '신재생에너지', capital: 200, pressure: 0, external_force: 0 },
  { id: 'realestate', name: '부동산', capital: 1000, pressure: 0, external_force: 0 },
  { id: 'consumerd', name: '소비재', capital: 1300, pressure: 0, external_force: 0 },
  { id: 'industrials', name: '산업재', capital: 1800, pressure: 0, external_force: 0 },
  { id: 'commodities', name: '원자재', capital: 700, pressure: 0, external_force: 0 },
];

// Time unit: 1 = 1 quarter. Year YYYY = (YYYY-START_YEAR) * 4
// START_YEAR is 1925
// Importance: 1 (Major), 2 (Secondary), 3 (Tertiary/Contextual)
export const HISTORICAL_EVENTS: SimulationEvent[] = [
  // --- Early 20th Century & Great Depression ---
  { time: (1928-START_YEAR)*4, name: "대공황 전조: 플로리다 부동산 버블 붕괴 영향 지속", target: 'realestate', force: -30, duration: 4, importance: 3 },
  { time: (1929-START_YEAR)*4, name: "대공황 시작: 주식 시장 대붕괴 (검은 목요일)", target: 'finance', force: -150, duration: 8, importance: 1 }, 
  { time: (1929-START_YEAR)*4, name: "대공황 시작: 산업 생산 급감", target: 'industrials', force: -100, duration: 12, importance: 1 }, 
  { time: (1929-START_YEAR)*4 + 2, name: "대공황 확산: 원자재 가격 폭락", target: 'commodities', force: -80, duration: 16, importance: 2 }, 
  { time: (1930-START_YEAR)*4, name: "대공황 심화: 은행 파산 연쇄", target: 'finance', force: -70, duration: 8, importance: 1 },
  { time: (1933-START_YEAR)*4, name: "뉴딜 정책 시작: 정부 주도 산업 부양 시도", target: 'industrials', force: 60, duration: 20, importance: 2 }, 
  { time: (1933-START_YEAR)*4, name: "뉴딜 정책: 긴급 은행법 및 금융 안정화 조치", target: 'finance', force: 40, duration: 12, importance: 2 },
  { time: (1933-START_YEAR)*4 + 2, name: "뉴딜 정책 효과: 소비 심리 일부 회복", target: 'consumerd', force: 30, duration: 16, importance: 3 },

  // --- WWII & Post-War Boom ---
  { time: (1939-START_YEAR)*4, name: "제2차 세계대전 발발: 군수 산업 폭발적 성장", target: 'industrials', force: 200, duration: 24, importance: 1 }, 
  { time: (1939-START_YEAR)*4, name: "제2차 세계대전: 원자재 수요 폭증", target: 'commodities', force: 100, duration: 24, importance: 2 }, 
  { time: (1941-START_YEAR)*4 + 3, name: "진주만 공습: 미국 참전으로 전시 경제 가속", target: 'industrials', force: 50, duration: 16, importance: 1 }, // Added detail for US entry
  { time: (1946-START_YEAR)*4, name: "전후 경제 호황 시작: 소비재 수요 폭발", target: 'consumerd', force: 80, duration: 60, importance: 2 }, 
  { time: (1946-START_YEAR)*4, name: "전후 경제 호황: 주택 건설 붐과 부동산 시장 성장", target: 'realestate', force: 70, duration: 60, importance: 2 }, 
  { time: (1946-START_YEAR)*4 + 4, name: "전후 경제 호황: 산업 설비 확장 및 다변화", target: 'industrials', force: 60, duration: 56, importance: 2 },
  { time: (1950-START_YEAR)*4, name: "한국 전쟁 발발: 단기적 군수 특수", target: 'industrials', force: 40, duration: 12, importance: 3 },

  // --- Mid to Late 20th Century ---
  { time: (1965-START_YEAR)*4, name: "베트남 전쟁 확전: 국방비 지출 증가", target: 'industrials', force: 50, duration: 20, importance: 3 },
  { time: (1971-START_YEAR)*4 + 2, name: "닉슨 쇼크 (금태환 정지): 브레튼우즈 체제 붕괴 신호", target: 'finance', force: -40, duration: 8, importance: 2 },
  { time: (1973-START_YEAR)*4, name: "1차 석유 파동: 원유 가격 급등 쇼크", target: 'commodities', force: 150, duration: 8, importance: 1 }, 
  { time: (1973-START_YEAR)*4, name: "1차 석유 파동: 스태그플레이션 시작 (산업 위축)", target: 'industrials', force: -70, duration: 12, importance: 2 }, 
  { time: (1973-START_YEAR)*4, name: "1차 석유 파동: 소비 심리 급랭", target: 'consumerd', force: -60, duration: 10, importance: 2 }, 
  { time: (1979-START_YEAR)*4, name: "2차 석유 파동: 이란 혁명 여파", target: 'commodities', force: 120, duration: 6, importance: 2 },
  { time: (1980-START_YEAR)*4, name: "개인용 컴퓨터(PC) 혁명 시작: 초기 기술주 관심", target: 'tech', force: 50, duration: 40, importance: 2 }, 
  { time: (1981-START_YEAR)*4, name: "레이거노믹스 시작: 규제 완화 및 감세 정책", target: 'finance', force: 30, duration: 20, importance: 3 },
  { time: (1987-START_YEAR)*4 + 3, name: "블랙 먼데이: 주식 시장 대폭락", target: 'finance', force: -120, duration: 3, importance: 1 }, 
  
  // --- Dot-com Era ---
  { time: (1993-START_YEAR)*4, name: "인터넷 브라우저 등장 (Mosaic): 기술주 관심 초기 증폭", target: 'tech', force: 20, duration: 8, importance: 3 },
  { time: (1995-START_YEAR)*4, name: "닷컴 버블 형성기: 인터넷 기업 투자 열풍", target: 'tech', force: 100, duration: 20, importance: 2 }, 
  { time: (1998-START_YEAR)*4, name: "러시아 금융위기 및 LTCM 파산: 신흥시장 및 금융 단기 충격", target: 'emerging', force: -50, duration: 4, importance: 3 },
  { time: (2000-START_YEAR)*4, name: "닷컴 버블 붕괴 시작", target: 'tech', force: -180, duration: 8, importance: 1 }, 
  { time: (2001-START_YEAR)*4, name: "닷컴 버블 붕괴 후: 가치주/전통산업으로 자본 이동", target: 'value', force: 70, duration: 10, importance: 2 }, 

  // --- Early 21st Century ---
  { time: (2001-START_YEAR)*4 + 2, name: "9/11 테러 공격: 금융 시장 및 항공/여행 산업 충격", target: 'finance', force: -80, duration: 3, importance: 1 }, 
  { time: (2001-START_YEAR)*4 + 2, name: "9/11 테러 공격: 소비 심리 위축", target: 'consumerd', force: -60, duration: 4, importance: 2 }, 
  { time: (2003-START_YEAR)*4, name: "미국의 이라크 침공: 지정학적 긴장 및 유가 변동성 증가", target: 'commodities', force: 30, duration: 8, importance: 3 },
  { time: (2004-START_YEAR)*4, name: "서브프라임 모기지 시장 성장 및 초기 우려", target: 'realestate', force: 40, duration: 12, importance: 3 },
  
  // --- Global Financial Crisis & Aftermath ---
  { time: (2007-START_YEAR)*4 + 2, name: "글로벌 금융위기 전조: 서브프라임 모기지 부실화 확산", target: 'finance', force: -60, duration: 4, importance: 2 },
  { time: (2008-START_YEAR)*4 + 2, name: "글로벌 금융위기: 리먼 브라더스 파산 쇼크", target: 'finance', force: -200, duration: 8, importance: 1 }, 
  { time: (2008-START_YEAR)*4 + 2, name: "글로벌 금융위기: 부동산 시장 급락", target: 'realestate', force: -150, duration: 12, importance: 1 }, 
  { time: (2008-START_YEAR)*4 + 3, name: "글로벌 금융위기: 실물 경제 파급 (산업 위축)", target: 'industrials', force: -80, duration: 10, importance: 2 }, 
  { time: (2009-START_YEAR)*4, name: "양적완화(QE1) 시작: 대규모 유동성 공급", target: 'finance', force: 60, duration: 16, importance: 2 },
  { time: (2010-START_YEAR)*4, name: "빅테크(FAANG) 성장기 시작: 기술주 주도 장세", target: 'tech', force: 120, duration: 40, importance: 2 }, 
  { time: (2010-START_YEAR)*4, name: "양적완화 지속: 금융시장 회복 및 저금리 기조", target: 'finance', force: 50, duration: 20, importance: 2 }, 
  { time: (2014-START_YEAR)*4, name: "유가 하락: 셰일 오일 공급 증가 영향", target: 'commodities', force: -60, duration: 8, importance: 3 },

  // --- COVID-19 Pandemic & Recent ---
  { time: (2019-START_YEAR)*4 + 3, name: "코로나19 바이러스 첫 보고 (중국 우한)", target: 'healthcare', force: 10, duration: 2, importance: 3 },
  { time: (2020-START_YEAR)*4, name: "코로나19 팬데믹 선언: 글로벌 증시 폭락", target: 'finance', force: -150, duration: 3, importance: 1 },
  { time: (2020-START_YEAR)*4, name: "코로나19 팬데믹: 경제활동 중단 (소비 급감)", target: 'consumerd', force: -180, duration: 4, importance: 1 }, 
  { time: (2020-START_YEAR)*4, name: "코로나19 팬데믹: 공급망 마비 (산업 타격)", target: 'industrials', force: -100, duration: 4, importance: 2 }, 
  { time: (2020-START_YEAR)*4, name: "코로나19 팬데믹: 유가 폭락 (수요 증발)", target: 'commodities', force: -70, duration: 2, importance: 2 }, 
  { time: (2020-START_YEAR)*4 + 1, name: "팬데믹 대응: 대규모 재정 부양책 및 통화 완화", target: 'finance', force: 100, duration: 8, importance: 1 },
  { time: (2020-START_YEAR)*4 + 1, name: "팬데믹 특수: 비대면 기술주 및 바이오/헬스케어 급등 (기술주)", target: 'tech', force: 180, duration: 8, importance: 2 }, 
  { time: (2020-START_YEAR)*4 + 1, name: "팬데믹 특수: 비대면 기술주 및 바이오/헬스케어 급등 (헬스케어)", target: 'healthcare', force: 100, duration: 8, importance: 2 }, 
  { time: (2021-START_YEAR)*4, name: "백신 보급 및 경제 재개 기대감: 경기민감주 반등", target: 'consumerd', force: 70, duration: 8, importance: 2 },
  { time: (2021-START_YEAR)*4, name: "공급망 병목 현상 및 인플레이션 압력 시작", target: 'commodities', force: 90, duration: 12, importance: 2 }, 
  { time: (2021-START_YEAR)*4, name: "ESG 투자 트렌드 확산 (신재생에너지 관심 증대)", target: 'renewable', force: 80, duration: 12, importance: 3 },
  { time: (2022-START_YEAR)*4, name: "러시아-우크라이나 전쟁 발발: 에너지/곡물 가격 급등", target: 'commodities', force: 120, duration: 6, importance: 1 },
  { time: (2022-START_YEAR)*4, name: "주요국 금리 인상 시작: 인플레이션 대응", target: 'finance', force: -70, duration: 8, importance: 1 },
  { time: (2023-START_YEAR)*4, name: "AI 기술 투자 붐 (Chat GPT 등)", target: 'tech', force: 150, duration: 8, importance: 2 },
  { time: (2023-START_YEAR)*4 + 2, name: "미국 지역 은행 위기 (SVB 등)", target: 'finance', force: -50, duration: 3, importance: 3 },
  { time: (2024-START_YEAR)*4, name: "지속되는 인플레이션과 고금리 환경", target: 'value', force: 30, duration: 6, importance: 3 }, // Duration: (2025 Q2 - 2024 Q1) = (401 - 396 + 1) = 6 quarters
];


export const getInitialGameState = (): GameState => {
  const initialSectors = JSON.parse(JSON.stringify(INITIAL_SECTORS_DATA));
  const initialCapitalHistory: Record<string, number[]> = {};
  initialSectors.forEach((sector: Sector) => {
    // For a timeline starting at START_YEAR (time=0), initial capital is at history[0]
    initialCapitalHistory[sector.id] = [sector.capital]; 
  });
  return {
    time: 0, // Represents Q1 START_YEAR
    sectors: initialSectors,
    log: [],
    capitalHistory: initialCapitalHistory,
  };
};
