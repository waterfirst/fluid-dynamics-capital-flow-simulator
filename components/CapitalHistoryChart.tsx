
import React from 'react';
import { scaleLinear } from 'd3-scale';
import { line as d3Line } from 'd3-shape';
import { extent as d3Extent } from 'd3-array';
import { Sector, GameState } from '../types';

interface CapitalHistoryChartProps {
  capitalHistory: GameState['capitalHistory'];
  sectors: Sector[];
  currentTime: number;
  formatTime: (time: number) => string; 
  startYear: number;
}

const HISTORY_WINDOW_QUARTERS = 50 * 4; // 50 years

const CapitalHistoryChart: React.FC<CapitalHistoryChartProps> = ({ capitalHistory, sectors, currentTime, formatTime, startYear }) => {
  const margin = { top: 20, right: 20, bottom: 70, left: 70 }; 
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [svgWidth, setSvgWidth] = React.useState(600);

  React.useLayoutEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setSvgWidth(containerRef.current.offsetWidth);
      }
    };
    updateSize(); // Initial size
    const resizeObserver = new ResizeObserver(updateSize);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    return () => resizeObserver.disconnect();
  }, []);
  
  const width = Math.max(0, svgWidth - margin.left - margin.right);
  const height = Math.max(0, 350 - margin.top - margin.bottom); // Standard height

  const sectorColors = [
    '#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd',
    '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf',
    '#aec7e8', '#ffbb78', '#98df8a', '#ff9896', '#c5b0d5',
    '#c49c94', '#f7b6d2', '#c7c7c7', '#dbdb8d', '#9edae5'
  ];

  const { lineData, minTimeInWindow, maxTimeInWindow } = React.useMemo(() => {
    const localMaxTime = Math.max(0, currentTime);
    const localMinTime = Math.max(0, localMaxTime - HISTORY_WINDOW_QUARTERS + 1);

    const processedLineData = sectors.map(sector => {
      const history = capitalHistory[sector.id] || [];
      const dataPoints = [];
      // Iterate from minTimeInWindow to maxTimeInWindow to get relevant data points
      for (let t = localMinTime; t <= localMaxTime; t++) {
        if (t < 0) continue; // Should not happen with Math.max(0,...)
        let capital = 0;
        if (t < history.length) {
            capital = history[t];
        } else if (history.length > 0) {
            capital = history[history.length -1]; // Use last known value if history is shorter
        }
        dataPoints.push({ time: t, capital });
      }
      return dataPoints;
    });
    return { lineData: processedLineData, minTimeInWindow: localMinTime, maxTimeInWindow: localMaxTime };
  }, [sectors, capitalHistory, currentTime]);
  
  const allCapitalValuesInWindow = lineData.flat().map(d => d.capital);
  const [minCap, maxCapActual] = d3Extent(allCapitalValuesInWindow);
  
  const effectiveMaxCap = (maxCapActual === undefined || maxCapActual === 0 || Number.isNaN(maxCapActual)) ? 1 : maxCapActual;
  const effectiveMinCap = (minCap === undefined || Number.isNaN(minCap)) ? 0 : minCap;

  const xScale = scaleLinear()
    .domain([minTimeInWindow, maxTimeInWindow > minTimeInWindow ? maxTimeInWindow : minTimeInWindow + 1])
    .range([0, width]);

  const yScale = scaleLinear().domain([effectiveMinCap, effectiveMaxCap]).range([height, 0]).nice();

  const lineGenerator = d3Line<{ time: number, capital: number }>()
    .x(d => xScale(d.time))
    .y(d => yScale(d.capital));

  const numXTicksTarget = Math.max(2, width / 100); 
  let xTicks = xScale.ticks(numXTicksTarget);


  return (
    <div ref={containerRef} className="p-4 sm:p-6 border border-gray-700 rounded-lg bg-gray-800 shadow-xl w-full h-full">
      <h3 className="text-xl font-semibold mb-6 text-gray-100">섹터별 자본 추이 (최근 50년)</h3>
      {width > 0 && height > 0 && (
        <svg width={svgWidth} height={height + margin.top + margin.bottom}>
          <g transform={`translate(${margin.left},${margin.top})`}>
            {/* Grid Lines */}
            {xTicks.map(tickValue => (
              <line
                key={`x-grid-${tickValue}`}
                x1={xScale(tickValue)}
                x2={xScale(tickValue)}
                y1={0}
                y2={height}
                stroke="currentColor"
                className="text-gray-700 opacity-50"
                strokeDasharray="2,2"
              />
            ))}
            {yScale.ticks(5).map(tickValue => (
              <line
                key={`y-grid-${tickValue}`}
                x1={0}
                x2={width}
                y1={yScale(tickValue)}
                y2={yScale(tickValue)}
                stroke="currentColor"
                className="text-gray-700 opacity-50"
                strokeDasharray="2,2"
              />
            ))}

            {/* X Axis */}
            <g transform={`translate(0,${height})`}>
              {xTicks.map(tickValue => (
                <g key={`x-tick-${tickValue}`} transform={`translate(${xScale(tickValue)}, 0)`}>
                  <line y2="6" stroke="currentColor" className="text-gray-500" />
                  <text 
                    transform="rotate(-45)"
                    style={{ textAnchor: 'end' }}
                    x={-5}
                    y={10}
                    dy="0.32em"
                    className="text-xs text-gray-400 fill-current"
                  >
                    {formatTime(tickValue)}
                  </text>
                </g>
              ))}
              <line x2={width} stroke="currentColor" className="text-gray-500" />
              <text transform={`translate(${width / 2}, ${margin.bottom - 15})`} textAnchor="middle" className="text-sm text-gray-300 fill-current">시간 (분기)</text>
            </g>

            {/* Y Axis */}
            <g>
              {yScale.ticks(5).map(tickValue => (
                <g key={`y-tick-${tickValue}`} transform={`translate(0, ${yScale(tickValue)})`}>
                  <line x2="-6" stroke="currentColor" className="text-gray-500" />
                  <text dx="-0.5em" x="-9" dy="0.32em" textAnchor="end" className="text-xs text-gray-400 fill-current">
                    {tickValue.toLocaleString()}T
                  </text>
                </g>
              ))}
              <line y2={height} stroke="currentColor" className="text-gray-500" />
              <text transform={`rotate(-90)`} x={-height / 2} y={-margin.left + 25} textAnchor="middle" className="text-sm text-gray-300 fill-current">자본 (조 단위)</text>
            </g>

            {/* Lines */}
            {lineData.map((data, index) => {
               if (data.length === 0) return null;
               const validData = data.filter(d => 
                 Number.isFinite(d.capital) && 
                 Number.isFinite(d.time) &&
                 d.time >= minTimeInWindow && d.time <= maxTimeInWindow && // Ensure points are within scaled domain
                 Number.isFinite(yScale(d.capital)) && 
                 Number.isFinite(xScale(d.time))
                );
               if(validData.length < 2) return null; // Need at least two points to draw a line
               
               const pathDefinition = lineGenerator(validData);
               if (!pathDefinition) return null;
               return (
                  <path
                    key={sectors[index].id}
                    d={pathDefinition}
                    stroke={sectorColors[index % sectorColors.length]}
                    strokeWidth="2"
                    fill="none"
                  />
              );
            })}
          </g>
        </svg>
      )}
      {/* Legend */}
      <div className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-2">
        {sectors.map((sector, index) => (
          <div key={sector.id} className="flex items-center text-xs">
            <span 
              className="w-3 h-3 inline-block mr-1.5 rounded-sm" 
              style={{ backgroundColor: sectorColors[index % sectorColors.length] }}
            />
            <span className="text-gray-300">{sector.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CapitalHistoryChart;
