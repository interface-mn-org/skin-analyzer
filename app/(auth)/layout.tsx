import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (session?.user) {
    redirect('/')
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(900px_circle_at_8%_10%,rgba(14,165,233,0.16),transparent_60%),radial-gradient(700px_circle_at_92%_8%,rgba(16,185,129,0.18),transparent_55%),linear-gradient(to_bottom,rgba(255,255,255,1),rgba(248,250,252,1))]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/2 h-72 w-80 -translate-x-1/2 rounded-full bg-linear-to-r from-sky-200/60 via-emerald-200/50 to-teal-100/60 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 right-[-8%] h-72 w-72 rounded-full bg-linear-to-tr from-slate-200/60 via-sky-100/50 to-emerald-100/60 blur-3xl"
      />
      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl items-center px-6 py-12">
        {children}
      </div>
    </div>
  )
}
