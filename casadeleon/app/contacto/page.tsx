"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, Clock } from "lucide-react";
import { useState } from "react";

export default function ContactoPage() {
  const [formStatus, setFormStatus] = useState<"idle" | "submitting" | "success">("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormStatus("submitting");
    
    const formData = new FormData(e.currentTarget);
    const data = {
      nombre: formData.get("nombre"),
      telefono: formData.get("telefono"),
      email: formData.get("email"),
      mensaje: formData.get("mensaje"),
    };

    try {
      const res = await fetch("/api/contacto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setFormStatus("success");
        // Reset form status after a few seconds
        setTimeout(() => setFormStatus("idle"), 5000);
      } else {
        setFormStatus("idle");
        alert("Ocurrió un error al enviar el mensaje. Por favor intenta nuevamente.");
      }
    } catch (error) {
      console.error(error);
      setFormStatus("idle");
      alert("Error de conexión. Inténtalo de nuevo más tarde.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 py-12 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-extrabold text-white mb-4"
          >
            Ponte en <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">Contacto</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-400 max-w-2xl mx-auto"
          >
            Estamos aquí para ayudarte a hacer realidad tu proyecto. Solicita presupuestos o realiza consultas sin compromiso.
          </motion.p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          {/* Contact Info */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="w-full lg:w-5/12 space-y-8"
          >
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 blur-3xl rounded-full"></div>
              
              <h3 className="text-2xl font-bold text-white mb-8">Información Directa</h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-amber-500/10 p-3 rounded-xl border border-amber-500/20 shrink-0">
                    <MapPin className="w-6 h-6 text-amber-500" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">Visítanos</h4>
                    <p className="text-slate-400">Calle 9 esquina 0, Presidencia Roque Sáenz Peña,<br/>Chaco, Argentina.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-amber-500/10 p-3 rounded-xl border border-amber-500/20 shrink-0">
                    <Phone className="w-6 h-6 text-amber-500" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">Llámanos</h4>
                    <p className="text-slate-400">(0364) 442 0294</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-amber-500/10 p-3 rounded-xl border border-amber-500/20 shrink-0">
                    <Clock className="w-6 h-6 text-amber-500" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">Horarios de Atención</h4>
                    <p className="text-slate-400">Lun a Vie: 8:00 a 12:00 y 15:00 a 19:00 hs<br/>Sábados: 8:00 a 12:00 hs</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Maps embed placeholder (stylized) */}
            <div className="h-[250px] bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden relative group cursor-pointer flex items-center justify-center">
               <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cartographer.png')] opacity-20"></div>
               <div className="z-10 text-center">
                  <MapPin className="w-10 h-10 text-amber-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-white font-medium block">Ver en Google Maps</span>
               </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="w-full lg:w-7/12"
          >
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 md:p-10 shadow-2xl">
              <h3 className="text-2xl font-bold text-white mb-6">Envíanos un mensaje</h3>
              
              {formStatus === "success" ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-green-500/10 border border-green-500/20 p-8 rounded-2xl text-center"
                >
                  <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send className="w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-bold text-white mb-2">¡Mensaje Enviado!</h4>
                  <p className="text-slate-400">Gracias por contactarte con Casa de León. Te responderemos a la brevedad.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300">Nombre Completo</label>
                      <input 
                        required
                        type="text" 
                        name="nombre"
                        placeholder="Ej: Juan Pérez"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300">Teléfono</label>
                      <input 
                        required
                        type="tel" 
                        name="telefono"
                        placeholder="Ej: 0364 4420294"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Correo Electrónico</label>
                    <input 
                      required
                      type="email" 
                      name="email"
                      placeholder="tu@email.com"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Asunto o Consulta</label>
                    <textarea 
                      required
                      rows={5}
                      name="mensaje"
                      placeholder="¿En qué te podemos ayudar? (Presupuestos, dudas, etc.)"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all resize-none"
                    ></textarea>
                  </div>

                  <button 
                    type="submit" 
                    disabled={formStatus === "submitting"}
                    className="w-full bg-amber-500 text-slate-950 py-4 rounded-xl font-bold text-lg hover:bg-amber-400 transition-all shadow-[0_0_15px_rgba(245,158,11,0.3)] hover:shadow-[0_0_25px_rgba(245,158,11,0.5)] flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {formStatus === "submitting" ? (
                      <div className="w-6 h-6 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        Enviar Mensaje
                        <Send className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
