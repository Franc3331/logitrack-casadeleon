"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function GaleriaPage() {
  const images = [
    { src: "/herramientas.png", alt: "Ferretería y Herramientas en stock", colSpan: "md:col-span-2", rowSpan: "md:row-span-2" },
    { src: "/ladrillos.png", alt: "Materiales de Construcción - Ladrillos", colSpan: "md:col-span-1", rowSpan: "md:row-span-1" },
    { src: "/sanitarios.png", alt: "Sanitarios y Grifería", colSpan: "md:col-span-1", rowSpan: "md:row-span-1" },
    { src: "/viguetas.png", alt: "Viguetas y Materiales Pesados", colSpan: "md:col-span-2", rowSpan: "md:row-span-1" },
    { src: "/hardware.png", alt: "Interior de Sucursal (Ilustración)", colSpan: "md:col-span-1", rowSpan: "md:row-span-1" },
    { src: "/construction.png", alt: "Materiales (Ilustración)", colSpan: "md:col-span-1", rowSpan: "md:row-span-1" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 py-12 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-extrabold text-white mb-4"
          >
            Nuestra <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">Galería</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-400 max-w-2xl mx-auto"
          >
            Conoce nuestras instalaciones, nuestro amplio stock de materiales, sanitarios, ferretería y nuestra capacidad de entrega inmediata.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
          {images.map((img, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + idx * 0.1, duration: 0.5 }}
              className={`relative rounded-3xl overflow-hidden group border-2 border-slate-800 hover:border-amber-500/50 transition-colors shadow-lg shadow-black/50 ${img.colSpan} ${img.rowSpan}`}
            >
              {/* CSS Filters applied here to enhance the original images: more contrast, slightly saturated, and crisp */}
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover transition-all duration-700 group-hover:scale-110 saturate-[1.15] contrast-[1.1] brightness-[1.05]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <span className="text-white font-bold text-xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] border-l-4 border-amber-500 pl-3">
                  {img.alt}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
