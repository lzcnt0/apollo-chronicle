import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Аполлон - интерактивная хроника лунной программы',
  description:
    'Интерактивный курс: архитектура полёта, техника, карта посадок, маршруты, наука и аварии программы Apollo.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className="antialiased">{children}</body>
    </html>
  );
}
