import MobileNav from '@/components/dashboard/mobile-nav'

export default function NotificationsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <MobileNav />
    </>
  )
}
