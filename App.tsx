
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useFluidSimulation } from './hooks/useFluidSimulation';
import SectorFlowChart from './components/SectorFlowChart';
import CapitalHistoryChart from './components/CapitalHistoryChart'; 
import PlayIcon from './components/icons/PlayIcon';
import PauseIcon from './components/icons/PauseIcon';
import ResetIcon from './components/icons/ResetIcon';
import InformationCircleIcon from './components/icons/InformationCircleIcon';
import LightBulbIcon from './components/icons/LightBulbIcon';
import MenuIcon from './components/icons/MenuIcon';
import XIcon from './components/icons/XIcon';
import { DEFAULT_SIMULATION_SPEED, START_YEAR } from './constants';
import { SimulationSpeed, LogEntry } from './types';

const App: React.FC = () => {
  const { gameState, isPaused, isComplete, togglePause, reset, currentSpeed, changeSpeed, maxSimulationTime } = useFluidSimulation(DEFAULT_SIMULATION_SPEED);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const majorEventLogRef = useRef<HTMLDivElement>(null);
  const secondaryEventLogRef = useRef<HTMLDivElement>(null);
  const tertiaryEventLogRef = useRef<HTMLDivElement>(null);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const formatTime = (time: number, forDisplay: boolean = true) => {
    const year = START_YEAR + Math.floor(time / 4);
    const quarter = (time % 4) + 1;
    let displayText = `${year}년 Q${quarter}`;
    if (forDisplay && isComplete && time >= maxSimulationTime) {
      displayText += ' (최종)';
    }
    return displayText;
  };

  const speedOptions: { key: SimulationSpeed; label: string }[] = [
    { key: 'slow', label: '느리게' },
    { key: 'middle', label: '보통' },
    { key: 'fast', label: '빠르게' },
  ];

  const { majorEvents, secondaryEvents, tertiaryEvents } = useMemo(() => {
    return {
      majorEvents: gameState.log.filter(event => event.importance === 1),
      secondaryEvents: gameState.log.filter(event => event.importance === 2),
      tertiaryEvents: gameState.log.filter(event => event.importance === 3),
    };
  }, [gameState.log]);

  useEffect(() => {
    if (majorEventLogRef.current) {
      majorEventLogRef.current.scrollLeft = majorEventLogRef.current.scrollWidth;
    }
  }, [majorEvents]);

  useEffect(() => {
    if (secondaryEventLogRef.current) {
      secondaryEventLogRef.current.scrollLeft = secondaryEventLogRef.current.scrollWidth;
    }
  }, [secondaryEvents]);
  
  useEffect(() => {
    if (tertiaryEventLogRef.current) {
      tertiaryEventLogRef.current.scrollLeft = tertiaryEventLogRef.current.scrollWidth;
    }
  }, [tertiaryEvents]);

  const renderEventList = (events: LogEntry[], ref: React.RefObject<HTMLDivElement>) => (
    <div ref={ref} className="overflow-x-auto pb-3"> 
      {events.length === 0 ? (
        <p className="text-xs text-gray-500 italic pl-1">해당 중요도의 이벤트가 없습니다.</p>
      ) : (
        <ul className="flex space-x-3 text-xs"> 
          {events.map((event, i) => ( 
            <li key={`${event.name}-${event.originalEventTime}-${i}-${event.importance}`} 
                className="flex-shrink-0 bg-gray-700 p-2.5 rounded-md shadow-md w-60 sm:w-64 hover:shadow-lg transition-shadow">
              <p className="font-semibold text-teal-300 text-sm">{formatTime(event.originalEventTime, false)}</p>
              <p className="mt-1 text-gray-300 leading-tight text-[0.8rem]">{event.name}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col selection:bg-blue-500 selection:text-white">
      <header className="sticky top-0 z-30 w-full bg-gray-800/80 backdrop-blur-md shadow-lg border-b border-gray-700">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={toggleSidebar}
                className="p-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 lg:hidden"
                aria-label={isSidebarOpen ? "사이즈바 닫기" : "사이드바 열기"}
              >
                {isSidebarOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
              </button>
              <h1 className="ml-3 text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-teal-400 to-green-400">
                자본 흐름 시뮬레이션
              </h1>
            </div>
             <p className="hidden md:block text-xs text-gray-400">
                ({START_YEAR}년 시작, 최종 {formatTime(maxSimulationTime, false)})
              </p>
          </div>
        </div>
      </header>
      
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside 
          className={`fixed inset-y-0 left-0 z-20 flex-shrink-0 w-80 sm:w-96 bg-gray-800 border-r border-gray-700 shadow-xl overflow-y-auto transition-transform duration-300 ease-in-out lg:static lg:translate-x-0
                      ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
          <div className="p-4 sm:p-6 space-y-6 flex flex-col h-full mt-16 lg:mt-0">
            {/* Controls Panel */}
            <div className="bg-gray-850 p-4 sm:p-5 rounded-xl shadow-xl border border-gray-700/50">
              <h3 className="text-lg font-semibold mb-4 text-gray-200">시뮬레이션 제어</h3>
              <div className="flex flex-col space-y-3">
                <button 
                  onClick={togglePause} 
                  disabled={isComplete && isPaused}
                  className={`flex items-center justify-center w-full px-4 py-3 rounded-lg font-medium transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-opacity-50
                              ${isComplete && isPaused ? 'bg-gray-600 text-gray-400 cursor-not-allowed' :
                                (isPaused 
                                ? 'bg-green-500 hover:bg-green-600 text-white focus:ring-green-400' 
                                : 'bg-yellow-500 hover:bg-yellow-600 text-gray-900 focus:ring-yellow-400')}`}
                  aria-label={isComplete && isPaused ? "Simulation complete" : (isPaused ? "Play simulation" : "Pause simulation")}
                >
                  {isComplete && isPaused ? <PauseIcon className="w-5 h-5 mr-2" /> : (isPaused ? <PlayIcon className="w-5 h-5 mr-2" /> : <PauseIcon className="w-5 h-5 mr-2" />)}
                  {isComplete && isPaused ? '완료' : (isPaused ? '시작' : '일시정지')}
                </button>
                <button 
                  onClick={reset} 
                  className="flex items-center justify-center w-full bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-lg font-medium transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50"
                  aria-label="Reset simulation"
                >
                  <ResetIcon className="w-5 h-5 mr-2" />
                  초기화
                </button>
              </div>
              
              <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-400 mb-2 text-center">속도 조절</h4>
                  <div className="grid grid-cols-3 gap-2">
                      {speedOptions.map(opt => (
                          <button
                              key={opt.key}
                              onClick={() => changeSpeed(opt.key)}
                              className={`px-3 py-2 text-sm rounded-md transition-colors duration-150
                                          ${currentSpeed === opt.key 
                                              ? 'bg-blue-500 text-white font-semibold shadow-md' 
                                              : 'bg-gray-700 hover:bg-gray-600 text-gray-300'}`}
                              aria-pressed={currentSpeed === opt.key}
                          >
                              {opt.label}
                          </button>
                      ))}
                  </div>
              </div>

              <div className="mt-6 text-center">
                <span className="text-gray-400 text-sm">시간:</span>
                <span className="ml-2 text-xl font-mono font-semibold text-teal-400 tabular-nums" aria-live="polite" aria-atomic="true">
                  {formatTime(gameState.time)}
                </span>
              </div>
            </div>

            {/* Simulation Principles Panel */}
            <div className="bg-gray-850 p-4 sm:p-5 rounded-xl shadow-xl border border-gray-700/50">
              <h3 className="text-lg font-semibold mb-3 text-gray-200 flex items-center">
                <InformationCircleIcon className="w-5 h-5 mr-2 text-blue-400" />
                원리 및 그래프 안내
              </h3>
              <div className="text-xs space-y-2 text-gray-300">
                <p>자본을 유체 입자로 간주, 유체역학 원리로 자본 이동을 모사합니다. 시간 단위는 분기입니다. {START_YEAR}년부터 {formatTime(maxSimulationTime, false)}까지 데이터를 사용합니다.</p>
                <ul className="list-disc list-inside space-y-1 pl-1">
                  <li><strong>압력</strong>: 자본 집중 시 압력 상승, 타지역으로 자본 확산.</li>
                  <li><strong>마찰</strong>: 거래 비용 등, 자본 이동 억제.</li>
                  <li><strong>외부 충격</strong>: 경제 이벤트가 자본 증감 유발.</li>
                </ul>
                <h4 className="font-semibold mt-2 text-gray-200">그래프 해석:</h4>
                <ul className="list-disc list-inside space-y-1 pl-1">
                  <li><strong>막대 길이</strong>: 섹터 자본 규모.</li>
                  <li><strong>막대 색상</strong>:
                      <span className="text-red-500 ml-1">■</span> 고압 (유입)
                      <span className="text-gray-400 ml-1">■</span> 중립
                      <span className="text-blue-500 ml-1">■</span> 저압 (유출)
                  </li>
                  <li><strong>선 그래프</strong>: 시간별 섹터 자본량 변화 (최근 50년).</li>
                  <li><strong>이벤트 로그</strong>: 중요도별(주요/일반/기타) 사건 흐름.</li>
                </ul>
              </div>
            </div>

            {/* Results Interpretation Panel */}
            <div className="bg-gray-850 p-4 sm:p-5 rounded-xl shadow-xl border border-gray-700/50 flex-grow flex flex-col min-h-[10rem]">
              <h3 className="text-lg font-semibold mb-3 text-gray-200 flex items-center">
                <LightBulbIcon className="w-5 h-5 mr-2 text-yellow-400" />
                결과 해석 가이드
              </h3>
              <div className="text-xs space-y-2 text-gray-300 overflow-y-auto">
                <ul className="list-disc list-inside space-y-1 pl-1">
                  <li><strong>자본 집중</strong>: 막대 길이 증가 및 <span className="text-red-500">붉은색</span>, 선 그래프 상승.</li>
                  <li><strong>자본 이탈</strong>: 막대 길이 감소 및 <span className="text-blue-500">푸른색</span>, 선 그래프 하락.</li>
                  <li><strong>시장 충격</strong>: 이벤트 로그 발생 시 관련 섹터의 자본량, 압력 변화 관찰. 주요 사건은 시장 전체 변동성 야기.</li>
                  <li><strong>균형과 변화</strong>: 자본 이동에 따른 시장 균형 탐색 및 외부 요인에 의한 변동 시각화. 일반/기타 사건은 특정 섹터 동향 파악에 유용.</li>
                </ul>
              </div>
            </div>
          </div>
        </aside>

        {/* Main content area */}
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto mt-16 lg:mt-0"> 
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="lg:w-1/2 flex flex-col">
              <SectorFlowChart sectors={gameState.sectors} />
            </div>
            <div className="lg:w-1/2 flex flex-col">
              <CapitalHistoryChart 
                capitalHistory={gameState.capitalHistory} 
                sectors={gameState.sectors} 
                currentTime={gameState.time}
                formatTime={(time) => formatTime(time, false)}
                startYear={START_YEAR}
              />
            </div>
          </div>

          {/* Event Log Panel - Horizontal & Multi-row */}
          <div className="mt-6 bg-gray-800 p-4 sm:p-6 rounded-xl shadow-2xl border border-gray-700" aria-labelledby="event-log-heading">
            <h3 id="event-log-heading" className="text-xl font-semibold mb-4 text-gray-200">이벤트 로그</h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-md font-semibold text-red-400 mb-1.5 border-b border-red-400/30 pb-1">주요 사건 (Importance 1)</h4>
                {renderEventList(majorEvents, majorEventLogRef)}
              </div>
              <div>
                <h4 className="text-md font-semibold text-yellow-400 mb-1.5 border-b border-yellow-400/30 pb-1">일반 사건 (Importance 2)</h4>
                {renderEventList(secondaryEvents, secondaryEventLogRef)}
              </div>
              <div>
                <h4 className="text-md font-semibold text-sky-400 mb-1.5 border-b border-sky-400/30 pb-1">기타 동향 (Importance 3)</h4>
                {renderEventList(tertiaryEvents, tertiaryEventLogRef)}
              </div>
            </div>
          </div>
        </main>
      </div>

      <footer className="w-full text-center py-4 text-xs text-gray-500 border-t border-gray-700 bg-gray-800">
        <p>&copy; {new Date().getFullYear()} 유체역학 자본 흐름 시뮬레이션. 교육 및 예시 목적으로 제작되었습니다.</p>
      </footer>
    </div>
  );
}

export default App;