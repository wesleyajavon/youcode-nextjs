import { Suspense } from 'react'
import { CardSkeleton } from '@/components/ui/common/skeleton'
import { AccountUI } from '@/components/common/server/AccountUI'
import { Layout, LayoutContent } from '@/components/layout/LayoutTemp'

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