"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Truck, HardHat, Wrench, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/construction.png"
            alt="Materiales de Construcción"
            fill
            priority
            className="object-cover object-center brightness-50"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-slate-950/40 to-slate-950"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-amber-500 font-bold tracking-widest uppercase text-sm mb-4 block">
              Construyendo el futuro desde 1969
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight">
              Tu Socio en la <br className="hidden md:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">
                Construcción
              </span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              Materiales de primera calidad, herramientas de precisión y el mejor servicio de transporte en toda la provincia del Chaco.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contacto"
                className="bg-amber-500 text-slate-950 px-8 py-4 rounded-full font-bold text-lg hover:bg-amber-400 transition-all hover:scale-105 shadow-[0_0_20px_rgba(245,158,11,0.4)] flex items-center justify-center gap-2"
              >
                Solicitar Presupuesto
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/galeria"
                className="bg-slate-800/50 backdrop-blur border border-slate-700 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-slate-700 transition-all flex items-center justify-center"
              >
                Ver Galería
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">¿Por qué elegir Casa de León?</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Con más de 50 años de experiencia, brindamos soluciones integrales para grandes obras y proyectos residenciales.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: HardHat, title: "Materiales", desc: "Todo para la construcción gruesa y terminaciones." },
              { icon: Wrench, title: "Ferretería", desc: "Herramientas de marcas líderes mundiales." },
              { icon: Truck, title: "Transporte Propio", desc: "Envíos seguros a toda la provincia del Chaco." },
              { icon: ShieldCheck, title: "Confianza", desc: "Garantía de calidad en todos nuestros productos." }
            ].map((feature, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                className="bg-slate-900 border border-slate-800 p-8 rounded-2xl hover:border-amber-500/50 transition-colors group"
              >
                <div className="bg-slate-800 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:bg-amber-500 transition-colors">
                  <feature.icon className="w-7 h-7 text-amber-500 group-hover:text-slate-950 transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-slate-400">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Mini Gallery/Promo */}
      <section className="py-24 bg-slate-900 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center gap-12">
          <div className="w-full md:w-1/2">
            <div className="relative h-[400px] md:h-[500px] w-full rounded-2xl overflow-hidden shadow-2xl border border-slate-700">
              <Image src="/truck.png" alt="Transporte Casa de León" fill className="object-cover hover:scale-105 transition-transform duration-700" />
            </div>
          </div>
          <div className="w-full md:w-1/2">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Logística que potencia tu obra</h2>
            <p className="text-lg text-slate-300 mb-8 leading-relaxed">
              No dejes que tu proyecto se detenga. Contamos con una flota de transporte propia diseñada para entregar tus materiales de manera rápida y segura directamente en tu obra, sin importar las dimensiones del pedido.
            </p>
            <ul className="space-y-4 mb-8">
              {['Envíos en tiempo récord', 'Cargas de gran volumen', 'Cobertura provincial'].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-300">
                  <div className="bg-amber-500/20 p-1 rounded-full">
                    <ShieldCheck className="w-5 h-5 text-amber-500" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href="/contacto"
              className="inline-block border-b-2 border-amber-500 text-amber-500 font-bold pb-1 hover:text-amber-400 transition-colors text-lg"
            >
              Consultar zonas de envío &rarr;
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
