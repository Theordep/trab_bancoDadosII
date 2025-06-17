'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navigation() {
    const pathname = usePathname()

    const links = [
        { href: '/dashboard', label: '📊 Dashboard', color: 'hover:bg-blue-700' },
        { href: '/clientes', label: '👥 Clientes', color: 'hover:bg-green-700' },
        { href: '/agendamentos', label: '📅 Agendamentos', color: 'hover:bg-purple-700' },
        { href: '/produtos', label: '📦 Produtos', color: 'hover:bg-orange-700' },
    ]

    return (
        <nav className="bg-blue-600 text-white shadow-lg">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <Link href="/" className="text-xl font-bold hover:text-blue-200">
                        🐾 VetSystem BD II
                    </Link>

                    <div className="flex space-x-1">
                        {links.map(link => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`px-4 py-2 rounded-md transition-colors ${link.color} ${pathname === link.href ? 'bg-blue-800' : ''
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </nav>
    )
}