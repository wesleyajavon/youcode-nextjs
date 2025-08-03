
import { Suspense } from 'react'
import { CardSkeleton } from '@/components/ui/common/skeleton'
import { AccountEditUI } from '@/components/common/server/AccountEditUI'
import { Layout, LayoutContent } from '@/components/layout/LayoutTemp'

export default async function EditAccountPage() {

  return (
        <Layout>
          <LayoutContent> 
            <Suspense fallback={<CardSkeleton />}>
              <AccountEditUI />
            </Suspense>
          </LayoutContent>
        </Layout>

  )
}