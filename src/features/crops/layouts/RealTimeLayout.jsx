import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { RealTimeIndicator } from "../ui/RealTimeIndicator";
import { RealTimeChart } from "../ui/RealTimeChart";
import { TimeSelector } from "../ui/TimeSelector";
import { GlobalThresholdsEditor } from "../ui/GlobalThresholdsEditor";

// Valores por defecto para umbrales
const defaultThresholds = {
  temperature: { min: 18.0, max: 26.0 },
  humidity: { min: 60, max: 80 },
  ec: { min: 1.0, max: 1.6 },
};

// Datos de ejemplo
const demoData = {
  temperature: {
    current: 22.4,
    unit: "°C",
    trend: "+0.3",
    trendDirection: "up",
    trendTime: "última hora",
  },
  humidity: {
    current: 68,
    unit: "%",
    trend: "-2",
    trendDirection: "down",
    trendTime: "última hora",
  },
  ec: {
    current: 1.3,
    unit: "mS/cm",
    trend: "Estable",
    trendTime: "hace 2h",
  },
};

/**
 * Layout para la sección de monitoreo en tiempo real
 *
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.data - Datos para mostrar en tiempo real
 */
export const RealTimeLayout = ({ data = {} }) => {
  // Validar si los datos proporcionados son válidos
  const isValidData =
    data?.temperature?.current !== undefined &&
    data?.humidity?.current !== undefined &&
    data?.ec?.current !== undefined;

  const displayData = isValidData ? data : demoData;

  const [thresholds, setThresholds] = useState(defaultThresholds);

  // useEffect futuro: actualizar thresholds desde backend o sincronizar con data
  useEffect(() => {
    // Lógica para sincronizar umbrales si fuese necesario
  }, [data]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Monitoreo en tiempo real</h1>

      {/* Indicadores en tiempo real */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <RealTimeIndicator
          label="Temperatura"
          value={displayData.temperature.current}
          unit={displayData.temperature.unit}
          trend={displayData.temperature.trend}
          trendDirection={displayData.temperature.trendDirection}
          trendTime={displayData.temperature.trendTime}
          icon="temperature"
        />

        <RealTimeIndicator
          label="Humedad"
          value={displayData.humidity.current}
          unit={displayData.humidity.unit}
          trend={displayData.humidity.trend}
          trendDirection={displayData.humidity.trendDirection}
          trendTime={displayData.humidity.trendTime}
          icon="humidity"
        />

        <RealTimeIndicator
          label="EC"
          value={displayData.ec.current}
          unit={displayData.ec.unit}
          trend={displayData.ec.trend}
          trendTime={displayData.ec.trendTime}
          icon="conductivity"
        />
      </div>

      {/* Gráfico de monitoreo en tiempo real */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Monitoreo en tiempo real</h2>
          <TimeSelector />
        </div>
        <RealTimeChart />
      </div>

      {/* Umbrales editables */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <GlobalThresholdsEditor
          thresholds={thresholds}
          setThresholds={setThresholds}
        />

        {/* Botón para guardar los cambios */}
        <button className="mt-4 p-2 bg-primary text-white rounded">
          {" "}
          Guardar Umbrales{" "}
        </button>
      </div>
    </div>
  );
};

// Definición de tipos para las props
RealTimeLayout.propTypes = {
  data: PropTypes.shape({
    temperature: PropTypes.shape({
      current: PropTypes.number,
      unit: PropTypes.string,
      trend: PropTypes.string,
      trendDirection: PropTypes.string,
      trendTime: PropTypes.string,
    }),
    humidity: PropTypes.shape({
      current: PropTypes.number,
      unit: PropTypes.string,
      trend: PropTypes.string,
      trendDirection: PropTypes.string,
      trendTime: PropTypes.string,
    }),
    ec: PropTypes.shape({
      current: PropTypes.number,
      unit: PropTypes.string,
      trend: PropTypes.string,
      trendTime: PropTypes.string,
    }),
  }),
};
