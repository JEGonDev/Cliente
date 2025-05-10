import PropTypes from 'prop-types';
import { ModuleContentStats } from './ModuleContentStats';

export const ModuleHeader = ({ 
  title,
  description,
  tags = [],
  videoCount = 0, 
  articleCount = 0, 
  guideCount = 0 
}) => {
  return (
    <div className="mb-8">
      <ModuleContentStats
        title={title}
        description={description}
        tags={tags}
        videoCount={videoCount}
        articleCount={articleCount}
        guideCount={guideCount}
      />
    </div>
  );
};

ModuleHeader.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  tags: PropTypes.arrayOf(PropTypes.string),
  videoCount: PropTypes.number,
  articleCount: PropTypes.number,
  guideCount: PropTypes.number
};