import { useState } from 'react';

import { CropDetailModal } from '../ui/CropDetailModal';
import { CropCard } from '../ui/CropCard';

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
  },
  {
    id: 3,
    name: 'Espinaca Verde',
    location: 'Invernadero 2',
    startDate: '2024-04-10',
    plantType: 'Espinaca',
    status: 'alert',
    sensors: {
      humidity: 45,
      conductivity: 1.2,
      temperature: 29
    },
    alerts: [
      { id: 'a2', type: 'error', message: 'Humedad baja', timestamp: Date.now() - 500000 }
    ]
  },
  {
    id: 4,
    name: 'Pimientos Rojos',
    location: 'Zona Sur',
    startDate: '2024-02-20',
    plantType: 'Pimiento',
    status: 'completed',
    sensors: {
      humidity: 55,
      conductivity: 2.0,
      temperature: 22
    },
    alerts: []
  },
  {
    id: 5,
    name: 'Zanahorias',
    location: 'Campo Abierto',
    startDate: '2024-01-10',
    plantType: 'Zanahoria',
    status: 'active',
    sensors: {
      humidity: 68,
      conductivity: 1.9,
      temperature: 23
    },
    alerts: [
      { id: 'a3', type: 'warning', message: 'Conductividad alta', timestamp: Date.now() - 700000 }
    ]
  },
  {
    id: 6,
    name: 'Albahaca',
    location: 'Huerto Urbano',
    startDate: '2024-05-01',
    plantType: 'Albahaca',
    status: 'paused',
    sensors: {
      humidity: 75,
      conductivity: 1.5,
      temperature: 21
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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Cultivos</h1>

      <div className="flex flex-col gap-4 w-full">
        {mockCrops.map((crop) => (
          <CropCard key={crop.id} crop={crop} onClick={handleCardClick} />
        ))}
      </div>

      <CropDetailModal isOpen={modalOpen} crop={selectedCrop} onClose={closeModal} />
    </div>
  );
};
