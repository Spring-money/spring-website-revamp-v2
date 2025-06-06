
import React from 'react';

interface ResultsHeaderProps {
  totalAdvisors: number;
  filteredAdvisorsCount: number;
}

const ResultsHeader: React.FC<ResultsHeaderProps> = ({ totalAdvisors, filteredAdvisorsCount }) => {
  const isFiltered = totalAdvisors !== filteredAdvisorsCount;
  
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h2 className="text-2xl font-semibold text-[#272A2B]">
          {isFiltered ? 'Filtered Results' : 'All Advisors'}
        </h2>
        <p className="text-gray-500">
          {filteredAdvisorsCount === 0 
            ? 'No advisors match your criteria' 
            : `Showing ${filteredAdvisorsCount} ${filteredAdvisorsCount === 1 ? 'advisor' : 'advisors'}`}
          {isFiltered && filteredAdvisorsCount > 0 && ` out of ${totalAdvisors}`}
        </p>
      </div>
    </div>
  );
};

export default ResultsHeader;
