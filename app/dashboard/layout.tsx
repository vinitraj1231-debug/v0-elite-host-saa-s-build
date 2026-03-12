import { AuthProvider } from '@/lib/auth/auth-context'
import { DashboardNav } from '@/components/dashboard/nav'
import { DashboardHeader } from '@/components/dashboard/header'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-background">
        <DashboardNav />
        
        {/* Main content */}
        <div className="lg:pl-64">
          <DashboardHeader />
          <main className="p-4 lg:p-6 pb-24 lg:pb-6">
            {children}
          </main>
        </div>
      </div>
    </AuthProvider>
  )
}
