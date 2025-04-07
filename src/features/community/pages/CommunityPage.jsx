import React, { useState } from 'react';
import {
  Bell,
  MessageCircle,
  Users,
  Star,
  Search,
  ChevronRight,
} from 'lucide-react';

export const CommunityPage = () => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`fixed z-20 inset-y-0 left-0 w-64 bg-white border-r border-gray-200 flex flex-col transform ${
          isSidebarVisible ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:flex`}
      >
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-bold">Comunidad</h1>
        </div>

        {/* Navigation */}
        <div className="flex flex-col flex-1 overflow-y-auto">
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center text-red-500">
                <Star className="w-4 h-4 mr-2" />
                <span className="font-medium text-sm">Favoritos</span>
              </div>
              <button className="text-gray-500">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <ul className="space-y-2 ml-4">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                <span className="text-sm">💬 Hablemos de hidroponía</span>
              </li>
              <li className="flex items-center text-sm">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                <span>🌱 Hidroponía en Casa</span>
              </li>
              <li className="flex items-center text-sm text-gray-500">
                <span className="w-2 h-2 bg-transparent border border-gray-300 rounded-full mr-2"></span>
                <span>Innovaciones en Hidroponía</span>
              </li>
              <li className="flex items-center text-sm text-gray-500">
                <span className="w-2 h-2 bg-transparent border border-gray-300 rounded-full mr-2"></span>
                <span>Técnicas Avanzadas</span>
              </li>
            </ul>
          </div>

          <div className="p-4">
            <div className="flex items-center mb-2">
              <Users className="w-4 h-4 mr-2" />
              <span className="font-medium text-sm">Mis comunidades</span>
            </div>

            <ul className="space-y-2 ml-4">
              <li className="flex items-center text-sm text-gray-700">
                <span className="text-green-600 mr-1">✓</span>
                <span>Cultivos Orgánicos en Casa</span>
              </li>
              <li className="flex items-center text-sm text-gray-700">
                <span className="text-blue-500 mr-1">💧</span>
                <span>Sistemas de Riego Inteligentes</span>
              </li>
              <li className="flex items-center text-sm text-gray-700">
                <span className="text-gray-500 mr-1">🏗️</span>
                <span>Construcción de Invernaderos</span>
              </li>
              <li className="flex items-center text-sm text-gray-700">
                <span className="text-yellow-500 mr-1">📊</span>
                <span>Monitoreo de Cultivos con IoT</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Navigation moved to the left */}
      <div className="fixed inset-y-0 left-0 w-16 bg-gray-100 border-r border-gray-200 flex flex-col items-center justify-around p-2">
        <button className="p-2 text-gray-500">
          <Bell className="w-5 h-5" />
        </button>
        <button className="p-2 text-gray-500">
          <MessageCircle className="w-5 h-5" />
        </button>
        <button className="p-2 text-gray-500">
          <Users className="w-5 h-5" />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden ml-16">
        {/* Toggle Sidebar Button */}
        <button
          onClick={() => setIsSidebarVisible(!isSidebarVisible)}
          className="p-2 bg-blue-500 text-white rounded-full m-4 md:hidden"
        >
          {isSidebarVisible ? 'Cerrar menú' : 'Abrir menú'}
        </button>

        {/* Search bar */}
        <div className="p-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar"
              className="w-full border border-gray-300 rounded-full px-4 py-2 pl-10 text-sm"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
          </div>
        </div>

        {/* Feed */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Header with image */}
          <div className="mb-6">
            <img
              src="/api/placeholder/800/200"
              alt="Hidroponía"
              className="w-full h-32 object-cover rounded-lg"
            />
          </div>

          {/* Posts */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <Users className="w-4 h-4 text-gray-600" />
                </div>
                <div className="ml-2">
                  <div className="font-medium text-sm">Camila A.</div>
                  <div className="text-xs text-gray-500">Hoy 4:30 PM</div>
                </div>
              </div>

              <div className="mb-3">
                <h3 className="font-medium text-sm mb-1">
                  ¿El futuro de la agricultura o una moda pasajera? 🌱
                </h3>
                <p className="text-sm text-gray-700">
                  ¿Creen que este método será el futuro de la agricultura? ¿Cuáles son los pros y contras de cultivar sin suelo?
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
