import { AccountUI } from './AccountUI'
import { Suspense } from 'react'
import { CardSkeleton } from '@/components/ui/skeleton'
import { Layout, LayoutContent } from '@/components/layout/layout'

export default async function AccountPage() {
  return (
    <Layout>
      <LayoutContent>
        <Suspense fallback={<CardSkeleton />}>
          <AccountUI />
        </Suspense>
      </LayoutContent>
    </Layout>
  )
}