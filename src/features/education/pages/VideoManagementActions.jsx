import { ModuleDetailLayout } from '../layouts/ModuleDetailLayout';
import { Header } from '../../../ui/layouts/Header';
import { GuidesSection } from '../layouts/GuidesSection';
import { VideosSection } from '../layouts/VideoSection';
import { ArticlesSection } from '../layouts/ArticlesSection';

/**
 * Página de detalle de un módulo educativo
 */
export const VideoManagementActions = () => {
  // Datos de ejemplo para el módulo
  const moduleData = {
    title: 'Introduccion al modulo',
    description: 'Landify is a landing page UI kit for Figma, created to help designers design the landing page quickly without having to spend much time. It is crafted with a vision to support any web project and thereby creating a block system that helps with all the use cases. The kit contains 170+ blocks and 50D+ components. It\'s fully customizable, well-organized layers, text, color and effect styles.',   
  };

  // Flag para mostrar controles de administrador
  const isAdmin = true;
  
  return (
    <>
      <Header  title={moduleData.title}
          description={moduleData.description}/>
      <ModuleDetailLayout>
        
        {/* Sección de artículos */}
        <ArticlesSection />
        
        {/* Sección de guías */}
        <GuidesSection isAdmin={isAdmin} />
        
        {/* Sección de videos */}
        <VideosSection isAdmin={isAdmin} />
      </ModuleDetailLayout>
    </>
  );
};