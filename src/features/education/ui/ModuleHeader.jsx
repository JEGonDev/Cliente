import PropTypes from 'prop-types';
import { ModuleContentStats } from './ModuleContentStats';

export const ModuleHeader = ({ 
  videoCount = 0, 
  articleCount = 0, 
  guideCount = 0 
}) => {
  return (
    <div className="mb-8">
      <ModuleContentStats
        videoCount={videoCount}
        articleCount={articleCount}
        guideCount={guideCount}
      />
    </div>
  );
};

ModuleHeader.propTypes = {
  videoCount: PropTypes.number,
  articleCount: PropTypes.number,
  guideCount: PropTypes.number
};