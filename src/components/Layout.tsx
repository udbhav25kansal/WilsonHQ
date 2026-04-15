import Nav from './Nav'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-cream relative overflow-x-hidden">
      <Nav />
      <main className="pt-20">{children}</main>
    </div>
  )
}
