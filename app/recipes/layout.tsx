import MobileNav from '@/components/dashboard/mobile-nav'

export default function RecipesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <MobileNav />
    </>
  )
}
