import { MapPin, Phone, Clock, Mail } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="relative w-14 h-14 overflow-hidden rounded-xl border border-slate-800 shadow-lg">
                <Image src="/logo.svg" alt="Casa de León Logo" fill className="object-cover" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white leading-none">
                  CASA DE LEÓN
                </h3>
                <span className="text-[10px] text-amber-500 font-medium tracking-[0.2em] uppercase">
                  Desde 1969
                </span>
              </div>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Empresa familiar argentina dedicada a la venta de materiales de construcción, ferretería y servicios de transporte desde 1969.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Contacto Rápidos</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-slate-400 hover:text-amber-500 transition-colors">
                <MapPin className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <span>Calle 9 esquina 0, Presidencia Roque Sáenz Peña, Chaco, Argentina.</span>
              </li>
              <li className="flex items-center gap-3 text-slate-400 hover:text-amber-500 transition-colors">
                <Phone className="w-5 h-5 text-amber-500 shrink-0" />
                <span>(0364) 442 0294</span>
              </li>
              <li className="flex items-center gap-3 text-slate-400 hover:text-amber-500 transition-colors">
                <Mail className="w-5 h-5 text-amber-500 shrink-0" />
                <span>consultas@casadeleonsrl.com</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Horarios</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-slate-400">
                <Clock className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-slate-300">Lunes a Viernes</p>
                  <p>8:00 a 12:00 hs y 15:00 a 19:00 hs</p>
                </div>
              </li>
              <li className="flex items-start gap-3 text-slate-400">
                <div className="w-5 h-5 shrink-0" />
                <div>
                  <p className="font-medium text-slate-300">Sábados</p>
                  <p>8:00 a 12:00 hs</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-slate-800 text-center text-slate-500 text-sm flex flex-col md:flex-row justify-between items-center">
          <p>&copy; {new Date().getFullYear()} Casa de León S.R.L. Todos los derechos reservados.</p>
          <div className="mt-4 md:mt-0 flex gap-4">
            <Link href="/" className="hover:text-amber-500 transition-colors">Inicio</Link>
            <Link href="/galeria" className="hover:text-amber-500 transition-colors">Galería</Link>
            <Link href="/contacto" className="hover:text-amber-500 transition-colors">Contacto</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
