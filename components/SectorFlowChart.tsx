import React from 'react';
import { scaleLinear } from 'd3-scale';
import { Sector } from '../types';

interface SectorFlowChartProps {
  sectors: Sector[];
}

const SectorFlowChart: React.FC<SectorFlowChartProps> = ({ sectors }) => {
  const maxCapital = Math.max(...sectors.map(s => s.capital), 1); 

  const colorScale = scaleLinear<string>()
    .domain([-0.01, -0.0001, 0, 0.0001, 0.01]) 
    .range(['bg-blue-500', 'bg-blue-400', 'bg-gray-500', 'bg-red-400', 'bg-red-500'])
    .clamp(true);

  return (
    <div className="p-4 sm:p-6 border border-gray-700 rounded-lg bg-gray-800 shadow-xl w-full">
      <h3 className="text-xl font-semibold mb-6 text-gray-100">섹터별 자본 분포</h3>
      <div className="space-y-4">
        {sectors.map(sector => {
          const capitalPercentage = maxCapital > 0 ? (sector.capital / maxCapital) * 100 : 0;
          // Ensure percentage is between 0 and 100 for safety, though capital should be positive.
          const safePercentage = Math.max(0, Math.min(100, capitalPercentage));
          const widthStyle = `w-[${safePercentage.toFixed(2)}%]`; 
          const bgColorClass = colorScale(sector.pressure);
          
          const barClasses = [
            "h-full",
            "transition-all", "duration-150", "ease-linear", // Combined transitions
            bgColorClass,
            // widthStyle, // Tailwind JIT might not pick this up if too dynamic. Using style prop instead for width.
            sector.capital > 0 ? "border-r-2 border-white/10" : ""
          ].join(" ");

          return (
            <div key={sector.id} className="text-gray-200">
              <div className="flex justify-between items-center mb-1 text-sm sm:text-base">
                <span className="font-medium">{sector.name}</span>
                <span className="text-gray-300 font-mono">${Math.round(sector.capital).toLocaleString()} T</span>
              </div>
              <div className="bg-gray-700 rounded-md overflow-hidden h-7 shadow-inner">
                <div
                  className={barClasses}
                  style={{ width: `${safePercentage}%` }} // Using style for dynamic width
                  title={`Pressure: ${sector.pressure.toFixed(5)}`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SectorFlowChart;