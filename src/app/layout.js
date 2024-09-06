export const metadata = {
  title: 'Cold Call Game',
  description: 'Practice your commercial real estate cold calling skills',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="dark:bg-slate-900">
        <main className="min-h-screen flex flex-col">
          {children}
        </main>
      </body>
    </html>
  )
}