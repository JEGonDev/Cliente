import PropTypes from 'prop-types';

export const GlobalThresholdsEditor = ({ thresholds, setThresholds }) => {
  const handleChange = (type, limit, value) => {
    const newValue = parseFloat(value);
    if (!isNaN(newValue)) {
      setThresholds(prev => ({
        ...prev,
        [type]: {
          ...prev[type],
          [limit]: newValue
        }
      }));
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Umbrales Globales</h3>
      
      {Object.keys(thresholds).map(type => (
        <div key={type} className="mb-6">
          <h4 className="font-medium capitalize mb-2">{type}</h4>
          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <div className="flex-1">
              <label className="block text-sm mb-1">Mínimo</label>
              <input
                type="number"
                value={thresholds[type].min}
                onChange={e => handleChange(type, 'min', e.target.value)}
                className="border p-2 rounded w-full"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm mb-1">Máximo</label>
              <input
                type="number"
                value={thresholds[type].max}
                onChange={e => handleChange(type, 'max', e.target.value)}
                className="border p-2 rounded w-full"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

GlobalThresholdsEditor.propTypes = {
  thresholds: PropTypes.shape({
    temperature: PropTypes.shape({
      min: PropTypes.number,
      max: PropTypes.number,
    }),
    humidity: PropTypes.shape({
      min: PropTypes.number,
      max: PropTypes.number,
    }),
    ec: PropTypes.shape({
      min: PropTypes.number,
      max: PropTypes.number,
    }),
  }).isRequired,
  setThresholds: PropTypes.func.isRequired,
};
