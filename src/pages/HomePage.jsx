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
import { motion } from 'framer-motion';
import { PhoneSimulator } from '../ui/components/PhoneSimulator';

export const HomePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const instance = new TypeIt("#companionMethods", {
      speed: 100,
      waitUntilVisible: true,
      loop: true,
    })
      .type("¡Todo en un solo lugar!")
      .pause(1000)
      .delete()
      .pause(750)
      .go();
  }, []);

  const scrollToFooter = () => {
    const footerElement = document.getElementById('main-footer');
    if (footerElement) {
      footerElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="font-sans relative">
      {/* Primera sección */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="w-full bg-white py-24 px-8 md:px-20 flex flex-col md:flex-row items-center justify-between border-b border-gray-200 min-h-[85vh]"
      >
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="md:w-1/2 space-y-8 pr-4"
        >
          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight tracking-wide text-gray-900 font-poppins">
            Domina la Hidroponía con la Mejor Plataforma Educativa y de Monitoreo
          </h1>
          <p className="text-lg text-gray-700 mt-4 font-inter">
            Aprende con recursos exclusivos, conéctate con otros cultivadores y monitorea tu cultivo en tiempo real.
            <span id="companionMethods" className="font-bold text-green-800"></span>
          </p>
          <div className="flex flex-wrap gap-4 mt-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-primary text-white px-8 py-3 rounded text-base font-poppins"
              onClick={scrollToFooter}
            >
              Contáctanos
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/register")}
              className="bg-primary text-white px-8 py-3 rounded text-base font-poppins"
            >
              Regístrate gratis
            </motion.button>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="md:w-1/2 flex justify-center md:justify-end mt-10 md:mt-0"
        >
          <img
            src={cultivador}
            alt="Ilustración de cultivador con estantería hidropónica"
            className="h-72 w-72 md:h-80 md:w-80 object-contain"
          />
        </motion.div>
      </motion.div>

      {/* Segunda sección */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        id="nosotros"
        className="w-full bg-primary text-white py-24 px-6 md:px-12 flex flex-col md:flex-row items-center justify-between border-b border-gray-200 font-inter relative overflow-hidden"
      >
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="md:w-1/2 pr-0 md:pr-6 space-y-6 text-left"
        >
          <h2 className="text-3xl font-bold leading-tight">
            ¡Cultiva Conocimiento, Cosecha Comunidad!
          </h2>
          <p className="leading-relaxed text-base">
            Germogli no es solo un sistema de cultivo hidropónico, es una comunidad de aprendizaje que está revolucionando la forma de cultivar y crecer plantas en casa. Comparte tus experiencias, aprende de otros y cultiva conocimiento.
          </p>
          <p className="leading-relaxed text-base">
            La hidroponía facilita tener grandes cantidades de hojas de lechuga. Aquí podrás aprender, monitorear tus planos y compartir tus logros de forma sencilla y ordenada.
          </p>
        </motion.div>
      </motion.div>

      {/* Contenedor para PhoneSimulator y tercera sección */}
      <div className="relative">
        {/* PhoneSimulator flotante - Posicionado entre sección verde y servicios */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="absolute z-30 right-2 sm:right-4 md:right-8 lg:right-12"
          style={{
            top: 'clamp(-330px, -28vw, -380px)' // ¡Sube un poco más y sigue siendo flexible!
          }}
        >
          <div className="w-[180px] sm:w-[220px] md:w-[260px] lg:w-[300px] max-w-full">
            <PhoneSimulator />
          </div>
        </motion.div>

        {/* Tercera sección - Servicios con padding-top reducido */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          id="servicios"
          className="py-20 px-6 pt-20" // Padding-top normal para no crear tanto espacio vacío
        >
          <h2 className="text-2xl font-bold text-center mb-14 font-poppins tracking-wide text-green-900">
            EXPLORA TODO LO QUE GERMOGLI TIENE PARA TI
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[{
              title: "Educación",
              img: educacion,
              desc: "Aprende todo lo básico del cultivo hidropónico a través de nuestros cursos"
            }, {
              title: "Comunidad",
              img: comunidad,
              desc: "Comparte experiencias y conocimientos con otros agricultores urbanos"
            }, {
              title: "Monitoreo",
              img: monitoreo,
              desc: "Haz un seguimiento de tus cultivos con nuestra app móvil"
            }].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: idx * 0.2 }}
                className="relative flex flex-col items-center text-center p-4"
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -z-10 w-40 h-40 opacity-80">
                  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                    <path fill="#043707" d="M34.7,-42.3C49.2,-29.1,68.3,-22.3,72.8,-10.8C77.3,0.7,67.2,16.8,56.5,30C45.7,43.1,34.4,53.2,20.8,58.8C7.2,64.5,-8.6,65.7,-20.3,59.7C-32,53.7,-39.6,40.5,-45.8,27.5C-52.1,14.6,-56.8,1.9,-59,-14.7C-61.2,-31.2,-60.8,-51.6,-50.5,-65.6C-40.3,-79.5,-20.1,-87.1,-5,-81.1C10.1,-75.1,20.1,-55.5,34.7,-42.3Z" transform="translate(100 100)" />
                  </svg>
                </div>
                <div className="mb-6 z-20">
                  <img src={item.img} alt={item.title} className="h-28 w-28 md:h-30 md:w-30" />
                </div>
                <h3 className="font-bold text-base md:text-lg mb-3 font-poppins">{item.title}</h3>
                <p className="text-sm text-gray-600 font-inter">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="py-16 px-6 bg-gray-50"
      >
        <h2 className="text-3xl font-bold text-center mb-14 font-poppins text-green-900 tracking-wide">
          Experiencias de nuestra comunidad
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
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
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: idx * 0.2 }}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center space-y-3"
            >
              <div className={`rounded-full p-1 ${user.bg} shadow-sm`}>
                <img src={user.img} alt={user.name} className="h-16 w-16 rounded-full border-2 border-white" />
              </div>
              <p className="text-lg font-semibold text-gray-900 font-poppins">{user.name}</p>
              <div className="text-yellow-400 text-lg">★★★★★</div>
              <p className="text-sm text-center text-gray-700 leading-relaxed italic font-inter">
                "{user.comment}"
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <Footer id="main-footer" />
    </div>
  );
};