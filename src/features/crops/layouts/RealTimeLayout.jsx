import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { RealTimeIndicator } from "../ui/RealTimeIndicator";
import { RealTimeChart } from "../ui/RealTimeChart";
import { TimeSelector } from "../ui/TimeSelector";
import { ThresholdEditModal } from "../ui/ThresholdEditModal"; 
import { Link } from 'react-router-dom';
import { ThresholdSlider } from "../ui/ThresholdSlider";

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
 * Ahora incluye sliders visuales para umbrales y modal de edición
 *
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.data - Datos para mostrar en tiempo real
 */
export const RealTimeLayout = ({ data = {} }) => {
  const isValidData =
    data?.temperature?.current !== undefined &&
    data?.humidity?.current !== undefined &&
    data?.ec?.current !== undefined;

  const displayData = isValidData ? data : demoData;

  const [thresholds, setThresholds] = useState(defaultThresholds);
  const [status, setStatus] = useState(null); // null | "loading" | "success" | "error"
  const [isThresholdModalOpen, setIsThresholdModalOpen] = useState(false);

  // Actualiza thresholds si vienen desde props.data
  useEffect(() => {
    if (data?.thresholds) {
      setThresholds((prevThresholds) => ({
        ...prevThresholds,
        ...data.thresholds,
      }));
    }
  }, [data]);

  // Maneja apertura del modal de edición
  const handleEditThresholds = () => {
    setIsThresholdModalOpen(true);
  };

  //  Maneja guardado desde el modal
  const handleSaveThresholdsFromModal = async (newThresholds) => {
    try {
      // Simular llamada a API (reemplaza con tu endpoint real)
      const response = await fetch("/api/thresholds", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newThresholds),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      // Actualizar los umbrales locales inmediatamente
      setThresholds(newThresholds);
      setStatus("success");
      setTimeout(() => setStatus(null), 3000);
      
      return Promise.resolve();
    } catch (error) {
      console.error('Error saving thresholds:', error);
      throw error; // Re-lanzar para que el modal lo maneje
    }
  };

  const handleSaveThresholds = async () => {
    setStatus("loading");
    try {
      await handleSaveThresholdsFromModal(thresholds);
    } catch (error) {
      setStatus("error");
    }
  };

  return (
    <div className="p-6">
      {/* Botón de navegación */}
      <div className="mb-4">
        <Link
          to="/monitoring/crops"
          className="inline-block bg-gray-100 text-gray-700 px-4 py-2 rounded hover:bg-gray-200 transition"
        >
          ← Volver a cultivos
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-6">Monitoreo en tiempo real</h1>

      {/* Indicadores en tiempo real (existentes) */}
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

      {/* Gráfico de monitoreo en tiempo real (existente) */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Monitoreo en tiempo real</h2>
          <TimeSelector />
        </div>
        <RealTimeChart />
      </div>

      {/* Sliders de umbrales en lugar del formulario */}
      <ThresholdSlider
        thresholds={thresholds}
        onEditClick={handleEditThresholds}
      />

      {/*  Modal para editar umbrales */}
      <ThresholdEditModal
        isOpen={isThresholdModalOpen}
        onClose={() => setIsThresholdModalOpen(false)}
        initialThresholds={thresholds}
        onSave={handleSaveThresholdsFromModal}
      />

      {/* NOTIFICACIÓN GLOBAL DE ÉXITO */}
      {status === "success" && (
        <div className="fixed bottom-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded shadow-lg z-50">
          <div className="flex items-center gap-2">
            <span>✅</span>
            <span>Umbrales actualizados correctamente</span>
          </div>
        </div>
      )}
    </div>
  );
};

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
    }),
  }),
};