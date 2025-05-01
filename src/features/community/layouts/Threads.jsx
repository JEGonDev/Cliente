import { useState } from 'react';
import { MessageCircle, Bell, ArrowLeft } from 'lucide-react';

export const Threads =() => {
  const [comments] = useState([
    {
      user: "SirHydroponic",
      time: "21/04, 16:23",
      content: "Ya tuve problemas con acumulación de sales en las raíces. Recomiendo revisar los niveles cada dos semanas y monitorear la conductividad eléctrica (EC) para evitar sobre-fertilización.",
      avatar: "/api/placeholder/30/30"
    },
    {
      user: "SirHydroponic",
      time: "21/04, 16:20",
      content: "Ya tuve problemas con acumulación de sales en las raíces. Recomiendo revisar los niveles cada dos semanas y monitorear la conductividad eléctrica (EC) para evitar sobre-fertilización.",
      avatar: "/api/placeholder/30/30"
    },
    {
      user: "GardenCultive",
      time: "21/04, 16:05",
      content: "Ya tuve problemas con acumulación de sales en las raíces. Recomiendo revisar los niveles cada dos semanas y monitorear la conductividad eléctrica (EC) para evitar sobre-fertilización.",
      avatar: "/api/placeholder/30/30"
    },
    {
      user: "SirHydroponic",
      time: "21/04, 15:52",
      content: "Ya tuve problemas con acumulación de sales en las raíces. Recomiendo revisar los niveles cada dos semanas y monitorear la conductividad eléctrica (EC) para evitar sobre-fertilización.",
      avatar: "/api/placeholder/30/30"
    },
    {
      user: "GardenCultive",
      time: "21/04, 15:40",
      content: "Ya tuve problemas con acumulación de sales en las raíces. Recomiendo revisar los niveles cada dos semanas y monitorear la conductividad eléctrica (EC) para evitar sobre-fertilización.",
      avatar: "/api/placeholder/30/30"
    }
  ]);

  return (
    <div className="max-w-md mx-auto bg-gray-100 min-h-screen">
      {/* Header con navegación */}
      <div className="bg-gray-200 p-2 flex items-center">
        <div className="flex-1">
          <div className="flex items-center text-sm">
            <ArrowLeft size={16} className="mr-1" />
            <span>Cultivos Orgánicos en Casa &gt;</span>
            <span className="font-medium ml-1">Cultivo de lechuga en NFT</span>
          </div>
        </div>
        <Bell size={18} className="ml-2" />
      </div>

      {/* Encabezado del post */}
      <div className="p-4 bg-white">
        <div className="flex items-center mb-3">
          <div className="bg-gray-200 rounded-full w-10 h-10 flex items-center justify-center mr-3">
            <MessageCircle size={20} className="text-gray-500" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Cultivo de lechuga en NFT</h1>
            <p className="text-sm text-gray-600">Empezado por Shireirgw</p>
          </div>
        </div>
        <div className="text-xs text-gray-500 text-right">
          27 de abril de 2023
        </div>
      </div>

      {/* Lista de comentarios */}
      <div className="mt-2">
        {comments.map((comment, index) => (
          <div key={index} className="bg-white p-3 mb-2 border-b border-gray-100">
            <div className="flex items-center mb-1">
              <div className="rounded-full overflow-hidden mr-2">
                <img src={comment.avatar} alt={comment.user} className="w-6 h-6 bg-blue-200 rounded-full" />
              </div>
              <span className="font-medium text-sm">{comment.user}</span>
              <span className="text-xs text-gray-500 ml-2">{comment.time}</span>
            </div>
            <p className="text-sm">{comment.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}