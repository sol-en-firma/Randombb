import MobileNav from '@/components/dashboard/mobile-nav'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <MobileNav />
    </>
  )
}
