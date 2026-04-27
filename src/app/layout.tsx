import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'LANGFANG_OPS - 廊坊运营',
  description: '骑手垃圾单标记与配送难点排行',
};

export const viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" className="dark">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
      </head>
      <body className="bg-background text-on-background min-h-screen">
        {children}
      </body>
    </html>
  );
}
