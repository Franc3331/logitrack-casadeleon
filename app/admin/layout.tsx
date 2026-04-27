'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Truck, LayoutDashboard, Package, Users, LogOut } from 'lucide-react'

const NAV = [
  { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/clients', icon: Users, label: 'Clientes' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem('logitrack_token')
    localStorage.removeItem('logitrack_user')
    router.push('/admin/login')
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-60 flex flex-col glass border-r border-slate-800/60 shrink-0">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-slate-800/60">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
              <Truck className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="font-bold text-slate-100">LogiTrack</span>
          </div>
          <p className="text-xs text-slate-500 mt-1 ml-11">Panel Admin</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1" aria-label="Navegación admin">
          {NAV.map(({ href, icon: Icon, label }) => {
            const active = pathname === href || pathname.startsWith(href + '/')
            return (
              <Link
                key={href}
                id={`nav-${label.toLowerCase()}`}
                href={href}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                  transition-all duration-200
                  ${active
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/25'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }
                `}
              >
                <Icon className="w-4.5 h-4.5 shrink-0" />
                {label}
              </Link>
            )
          })}
        </nav>

        {/* Logout */}
        <div className="px-3 pb-5 border-t border-slate-800/60 pt-4">
          <button
            id="admin-logout-btn"
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-500 hover:text-red-400 hover:bg-red-500/10 w-full transition-all duration-200"
          >
            <LogOut className="w-4.5 h-4.5 shrink-0" />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto min-h-screen p-8 animate-fade-in">
        {children}
      </main>
    </div>
  )
}
