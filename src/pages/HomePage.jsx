import cultivador from '../assets/homePage/cultivador.jpeg';
import cultivo from '../assets/homePage/cultivo.jpeg';
import educacion from '../assets/homePage/educacion.png';
import comunidad from '../assets/homePage/comunidad.png';
import monitoreo from '../assets/homePage/monitoreo.png';
import userI from '../assets/homePage/usuario1.png';
import userII from '../assets/homePage/usuario2.png';
import userIII from '../assets/homePage/usuario3.png';
// import { Header } from '../ui/layouts/Header';

export const HomePage = () => {
  return (
    <div className="font-sans">
      {/* Header Section */}
      {/* <Header /> */}
      {/* Hero Section */}
      <div className="w-full bg-white py-12  px-12 flex flex-col md:flex-row items-center justify-between border-b border-gray-200">
        <div className="md:w-1/2 space-y-4 pr-4">
          <h1 className="text-3xl font-bold text-gray-900">
            Domina la Hidroponía con la Mejor Plataforma Educativa y de Monitoreo
          </h1>
          <p className="text-gray-700">
            Aprende con recursos exclusivos, conéctate con otros cultivadores y monitorea tu cultivo en tiempo real. <span className="font-bold">¡Todo en un solo lugar!</span>
          </p>
          <div className="flex gap-4 mt-6">
            <button className="bg-primary text-white px-6 py-2 rounded">Contáctanos</button>
            <button className="bg-primary text-white px-6 py-2 rounded">Regístrate gratis</button>
          </div>
        </div>
        <div className="md:w-1/2 flex justify-end mt-6 md:mt-0">
          <img
            src={cultivador}
            alt="Ilustración de cultivador con estantería hidropónica"
            className="h-64 w-64"
          />
        </div>
      </div>

      <div id='nosotros' className=" w-full bg-primary text-white py-12   px-12 flex flex-col md:flex-row items-center justify-between border-b border-gray-200">
        <div className="md:w-1/2 space-y-4 pr-4">
          <h2 className=" text-2xl font-bold mb-4 text-center">
            ¡Cultiva Conocimiento, Cosecha Comunidad!
          </h2>
          
              <p className="mb-4">
                Germogli no es solo un sistema de cultivo hidropónico, es una comunidad de aprendizaje que está revolucionando la forma de cultivar y crecer plantas en casa. Comparte tus experiencias, aprende de otros y cultiva conocimiento.
              </p>
              <p>
                La hidroponía facilita tener grandes cantidades de hojas de lechuga. Aquí podrás aprender, monitorear tus planos y compartir tus logros de forma sencilla y ordenada.
              </p>
            </div>
            {/* <div className="md:w-1/2 flex justify-center items-center"> */}
            <div className="md:w-1/2 flex justify-end mt-6 md:mt-0">
              <img
                src={cultivo}
                alt="Plantas hidropónicas"
                className="rounded-lg w-full max-w-xs"
              />
            
        </div>
      </div>      

      {/* Features Section */}
      <div id='servicios' className="py-8 px-6">
        <h2 className="text-2xl font-bold text-center mb-8">
          EXPLORA TODO LO QUE GERMOGLI TIENE PARA TI
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div className="flex flex-col items-center text-center p-4">
            <div className="bg-blue-100 rounded-full p-4 mb-3">
              <img src={educacion} alt="Educación" className="h-16 w-16" />
            </div>
            <h3 className="font-bold mb-2">Educación</h3>
            <p className="text-sm text-gray-600">
              Aprende todo lo básico del cultivo hidropónico a través de nuestros cursos
            </p>
          </div>
          <div className="flex flex-col items-center text-center p-4">
            <div className="bg-green-100 rounded-full p-4 mb-3">
              <img src={comunidad} alt="Comunidad" className="h-16 w-16" />
            </div>
            <h3 className="font-bold mb-2">Comunidad</h3>
            <p className="text-sm text-gray-600">
              Comparte experiencias y conocimientos con otros agricultores urbanos
            </p>
          </div>
          <div className="flex flex-col items-center text-center p-4">
            <div className="bg-yellow-100 rounded-full p-4 mb-3">
              <img src={monitoreo} alt="Seguimiento" className="h-16 w-16" />
            </div>
            <h3 className="font-bold mb-2">Monitoreo</h3>
            <p className="text-sm text-gray-600">
              Haz un seguimiento de tus cultivos con nuestra app móvil
            </p>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-8 px-6 bg-gray-50">
        <h2 className="text-2xl font-bold text-center mb-8">
          Experiencias de nuestra comunidad
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="flex justify-center mb-3">
              <div className="bg-purple-100 rounded-full p-1">
                <img src={userI} alt="Usuario" className="h-12 w-12 rounded-full" />
              </div>
            </div>
            <p className="text-center font-medium">Carlos Santos</p>
            <div className="flex justify-center text-yellow-400 my-1">★★★★★</div>
            <p className="text-sm text-center text-gray-600">
              "Con Germagic logré montar mi primer sistema hidropónico y ahora produzco lechugas para mi familia."
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="flex justify-center mb-3">
              <div className="bg-pink-100 rounded-full p-1">
                <img src={userII} alt="Usuario" className="h-12 w-12 rounded-full" />
              </div>
            </div>
            <p className="text-center font-medium">Ana Martínez</p>
            <div className="flex justify-center text-yellow-400 my-1">★★★★★</div>
            <p className="text-sm text-center text-gray-600">
              "Lo mejor es la comunidad, siempre hay alguien dispuesto a ayudarte. ¡Muy recomendable!"
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="flex justify-center mb-3">
              <div className="bg-orange-100 rounded-full p-1">
                <img src={userIII} alt="Usuario" className="h-12 w-12 rounded-full" />
              </div>
            </div>
            <p className="text-center font-medium">José García</p>
            <div className="flex justify-center text-yellow-400 my-1">★★★★★</div>
            <p className="text-sm text-center text-gray-600">
              "El sistema de monitoreo me ayuda a mantener mis cultivos en óptimas condiciones."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
