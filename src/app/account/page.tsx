import { Suspense } from 'react'
import { CardSkeleton } from '@/components/ui/skeleton'
import { Layout, LayoutContent } from '@/components/layout/layout'
import { AccountUI } from '@/components/common/server/AccountUI'

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