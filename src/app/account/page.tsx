import { Suspense } from 'react'
import { CardSkeleton } from '@/components/ui/common/skeleton'
import { Layout, LayoutContent } from '@/components/layout/Layout'
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