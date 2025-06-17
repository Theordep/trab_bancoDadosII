import './globals.css'
import Navigation from './components/Navigation'

export const metadata = {
  title: 'Sistema Veterinária - BD II',
  description: 'Sistema de gestão veterinária demonstrando recursos avançados do PostgreSQL',
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className="bg-gray-100 min-h-screen">
        <Navigation />
        <main className="min-h-screen">{children}</main>

        {/* Footer */}
        <footer className="bg-gray-800 text-white text-center py-4 mt-8">
          <p>🐾 Sistema Veterinária - Banco de Dados II</p>
          <p className="text-sm text-gray-400">
            Demonstrando: Procedures, Functions, Views, Triggers e Exception Handling
          </p>
        </footer>
      </body>
    </html>
  )
}