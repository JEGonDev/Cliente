import { useState } from 'react';

import { CropDetailModal } from '../ui/CropDetailModal';
import { CropCard } from '../ui/CropCard';
import { Header } from '../../../ui/layouts/Header';
import { MonitoringSidebar } from './MonitoringSidebar';

// Simulación de cultivos
const mockCrops = [
  {
    id: 1,
    name: 'Tomates Cherry',
    location: 'Invernadero 1',
    startDate: '2024-04-01',
    plantType: 'Tomate',
    status: 'active',
    sensors: {
      humidity: 70,
      conductivity: 2.5,
      temperature: 24
    },
    alerts: [
      { id: 'a1', type: 'warning', message: 'Alta temperatura detectada', timestamp: Date.now() - 1000000 }
    ]
  },
  {
    id: 2,
    name: 'Lechuga Romana',
    location: 'Zona Norte',
    startDate: '2024-03-15',
    plantType: 'Lechuga',
    status: 'paused',
    sensors: {
      humidity: 60,
      conductivity: 1.8,
      temperature: 20
    },
    alerts: []
  }
];

export const CropsLayout = () => {
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleCardClick = (crop) => {
    setSelectedCrop(crop);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedCrop(null);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Encabezado */}
      <Header />

      <div className="flex flex-1">
        {/* Barra lateral de navegación */}
        <MonitoringSidebar activeSection="cultivos" />
        
        {/* Contenido principal de cultivos */}
        <main className="flex-1 p-6">
          <h1 className="text-2xl font-bold mb-6">Cultivos</h1>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {mockCrops.map((crop) => (
              <CropCard key={crop.id} crop={crop} onClick={handleCardClick} />
            ))}
          </div>

          <CropDetailModal isOpen={modalOpen} crop={selectedCrop} onClose={closeModal} />
        </main>
      </div>
    </div>
  );
};
