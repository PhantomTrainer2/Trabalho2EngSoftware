import '../styles/globals.css'
import LayoutWrapper from '../components/LayoutWrapper'

export const metadata = {
  title: 'Estocaê',
  description: 'Gerenciador de Estoque',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-gray-100">
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  )
}
