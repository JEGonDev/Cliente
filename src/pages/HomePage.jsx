import cultivador from '../assets/homePage/cultivador.jpeg';
import cultivo from '../assets/homePage/cultivo.jpeg';
import educacion from '../assets/homePage/educacion.png';
import comunidad from '../assets/homePage/comunidad.png';
import monitoreo from '../assets/homePage/monitoreo.png';
import userI from '../assets/homePage/usuario1.png';
import userII from '../assets/homePage/usuario2.png';
import userIII from '../assets/homePage/usuario3.png';
import TypeIt from "typeit";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Footer } from '../ui/layouts/Footer';

// import { Header } from '../ui/layouts/Header';

export const HomePage = () => {
  const navigate = useNavigate();
  
   useEffect(() => {
    const instance = new TypeIt("#companionMethods", {
      speed: 100,
      waitUntilVisible: true,
      loop: true, // Queremos que se repita
      // afterComplete: (step, instance) => { // Este afterComplete es un poco problemático para bucles así
      //   setTimeout(() => instance.reset().go(), 2000);
      // },
    })
    .type("¡Todo en un solo lugar!")
    .pause(1000)
    .delete() // Borra todo lo que se ha tipeado en esta cadena. Más seguro que un número fijo.
    .pause(750) // Pequeña pausa antes de que el bucle comience de nuevo.
    .go();
  }, []);

  // Nueva función para desplazar al footer
  const scrollToFooter = () => {
    const footerElement = document.getElementById('main-footer');
    if (footerElement) {
      footerElement.scrollIntoView({ behavior: 'smooth' });
    }
  };


  return (
    <div className="font-sans">
      {/* Header Section */}
      {/* <Header /> */}
      {/* Hero Section */}
      <div className="w-full bg-white py-24 px-8 md:px-20 flex flex-col md:flex-row items-center justify-between border-b border-gray-200 min-h-[85vh]">
        <div className="md:w-1/2 space-y-8 pr-4">
          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight tracking-wide text-gray-900 font-poppins">
            Domina la Hidroponía con la Mejor Plataforma Educativa y de Monitoreo
          </h1>
          <p className="text-lg text-gray-700 mt-4 font-inter">
            Aprende con recursos exclusivos, conéctate con otros cultivadores y monitorea tu cultivo en tiempo real.
            <span id="companionMethods" className="font-bold text-green-800"></span>
          </p>
          <div className="flex flex-wrap gap-4 mt-6">
            <button
              className="bg-primary text-white px-8 py-3 rounded text-base font-poppins"
              onClick={scrollToFooter} // ¡Aquí llamamos a la función!
            >
              Contáctanos
            </button>
            <button
              onClick={() => navigate("/register")}
              className="bg-primary text-white px-8 py-3 rounded text-base font-poppins"
            >
              Regístrate gratis
            </button>
          </div>
        </div>
        <div className="md:w-1/2 flex justify-center md:justify-end mt-10 md:mt-0">
          <img
            src={cultivador}
            alt="Ilustración de cultivador con estantería hidropónica"
            className="h-72 w-72 md:h-80 md:w-80 object-contain"
          />
        </div>
      </div>

      <div
        id="nosotros"
        className="w-full bg-primary text-white py-24 px-6 md:px-12 flex flex-col md:flex-row items-center justify-between border-b border-gray-200 font-inter"
      >
        <div className="md:w-1/2 pr-0 md:pr-6 space-y-6 text-left">
          <h2 className="text-3xl font-bold leading-tight">
            ¡Cultiva Conocimiento, Cosecha Comunidad!
          </h2>

          <p className="leading-relaxed text-base">
            Germogli no es solo un sistema de cultivo hidropónico, es una comunidad de aprendizaje que está revolucionando la forma de cultivar y crecer plantas en casa. Comparte tus experiencias, aprende de otros y cultiva conocimiento.
          </p>

          <p className="leading-relaxed text-base">
            La hidroponía facilita tener grandes cantidades de hojas de lechuga. Aquí podrás aprender, monitorear tus planos y compartir tus logros de forma sencilla y ordenada.
          </p>
        </div>

        <div className="md:w-1/2 flex justify-center md:justify-end mt-10 md:mt-0">
          <img
            src={cultivo}
            alt="Plantas hidropónicas"
            className="rounded-lg w-full max-w-sm shadow-lg"
          />
        </div>
      </div>
      {/* Features Section */}
      <div id='servicios' className="py-20 px-6">
        <h2 className="text-2xl font-bold text-center mb-14 font-poppins tracking-wide text-green-900 ">
          EXPLORA TODO LO QUE GERMOGLI TIENE PARA TI
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">

          {/* Educación */}
          <div className="relative flex flex-col items-center text-center p-4">
            {/* Fondo decorativo SVG */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -z-10 w-40 h-40 opacity-80">
              <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <path fill="#043707" d="M34.7,-42.3C49.2,-29.1,68.3,-22.3,72.8,-10.8C77.3,0.7,67.2,16.8,56.5,30C45.7,43.1,34.4,53.2,20.8,58.8C7.2,64.5,-8.6,65.7,-20.3,59.7C-32,53.7,-39.6,40.5,-45.8,27.5C-52.1,14.6,-56.8,1.9,-59,-14.7C-61.2,-31.2,-60.8,-51.6,-50.5,-65.6C-40.3,-79.5,-20.1,-87.1,-5,-81.1C10.1,-75.1,20.1,-55.5,34.7,-42.3Z" transform="translate(100 100)" />
              </svg>
            </div>
            <div className="mb-6 z-20">
              <img src={educacion} alt="Educación" className="h-28 w-28 md:h-30 md:w-30" />
            </div>
            {/* Ajuste de tamaño texto */}
            <h3 className="font-bold text-base md:text-lg mb-3 font-poppins">Educación</h3>
            <p className="text-sm text-gray-600 font-inter">
              Aprende todo lo básico del cultivo hidropónico a través de nuestros cursos
            </p>
          </div>
          {/* Comunidad */}
          <div className="relative flex flex-col items-center text-center p-4">
            {/* Fondo decorativo SVG */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -z-10 w-40 h-40 opacity-80">
              <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <path fill="#043707" d="M42.8,-50.9C53.4,-38.7,58.2,-21.6,59.1,-4.8C60.1,12,57.2,28.5,47.3,39.9C37.3,51.2,20.4,57.5,2.4,55.6C-15.6,53.7,-31.2,43.5,-45.3,31.5C-59.5,19.5,-72.3,5.8,-71.6,-7.3C-71,-20.4,-56.9,-32.8,-43,-45.5C-29,-58.3,-14.5,-71.4,1.5,-73.4C17.6,-75.4,35.2,-66.1,42.8,-50.9Z" transform="translate(100 100)" />
              </svg>
            </div>
            <div className="mb-6 z-20">
              <img src={comunidad} alt="Comunidad" className="h-28 w-28 md:h-30 md:w-30" />
            </div>
            <h3 className="font-bold text-base md:text-lg mb-3 font-poppins">Comunidad</h3>
            <p className="text-sm text-gray-600 font-inter">
              Comparte experiencias y conocimientos con otros agricultores urbanos
            </p>
          </div>

          {/* Monitoreo */}
          <div className="relative flex flex-col items-center text-center p-4">
            {/* Fondo decorativo SVG */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -z-10 w-40 h-40 opacity-80">
              <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <path fill="#043707" d="M52.9,-59.4C60.8,-45,54.1,-22.5,47.1,-7C40.1,8.6,32.9,17.1,25,31.9C17.1,46.8,8.6,67.8,-3.3,71.1C-15.2,74.4,-30.4,60,-36.7,45.2C-43,30.4,-40.4,15.2,-43.5,-3.1C-46.7,-21.4,-55.4,-42.8,-49.1,-57.1C-42.8,-71.5,-21.4,-78.8,0.6,-79.4C22.5,-79.9,45,-73.7,52.9,-59.4Z" transform="translate(100 100)" />
              </svg>
            </div>
            <div className="mb-6 z-20">
              <img src={monitoreo} alt="Monitoreo" className="h-28 w-28 md:h-30 md:w-30" />
            </div>
            <h3 className="font-bold text-base md:text-lg mb-3 font-poppins">Monitoreo</h3>
            <p className="text-sm text-gray-600 font-inter">
              Haz un seguimiento de tus cultivos con nuestra app móvil
            </p>
          </div>

        </div>
      </div>
      {/* Testimonials Section */}
      <div className="py-16 px-6 bg-gray-50">
        <h2 className="text-3xl font-bold text-center mb-14 font-poppins text-green-900 tracking-wide">
          Experiencias de nuestra comunidad
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {/* Testimonial Card */}
          {[{
            name: "Carlos Santos",
            img: userI,
            bg: "bg-purple-100",
            comment: "Con Germagic logré montar mi primer sistema hidropónico y ahora produzco lechugas para mi familia."
          }, {
            name: "Ana Martínez",
            img: userII,
            bg: "bg-pink-100",
            comment: "Lo mejor es la comunidad, siempre hay alguien dispuesto a ayudarte. ¡Muy recomendable!"
          }, {
            name: "José García",
            img: userIII,
            bg: "bg-orange-100",
            comment: "El sistema de monitoreo me ayuda a mantener mis cultivos en óptimas condiciones."
          }].map((user, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center space-y-3"
            >
              <div className={`rounded-full p-1 ${user.bg} shadow-sm`}>
                <img src={user.img} alt={user.name} className="h-16 w-16 rounded-full border-2 border-white" />
              </div>
              {/* Aplica Poppins a los nombres */}
              <p className="text-lg font-semibold text-gray-900 font-poppins">{user.name}</p>
              <div className="text-yellow-400 text-lg">★★★★★</div>
              {/* Aplica Inter a los comentarios */}
              <p className="text-sm text-center text-gray-700 leading-relaxed italic font-inter">
                "{user.comment}"
              </p>
            </div>
          ))}
        </div>
      </div>
      <Footer id="main-footer" />
    </div>
  );
};
