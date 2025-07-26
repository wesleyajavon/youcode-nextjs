import { getAuthSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Role } from '@prisma/client'
import { Suspense } from 'react'
import { CardSkeleton } from '@/components/ui/skeleton'
import { Layout, LayoutContent } from '@/components/layout/layout'
import { AccountEditUI } from '@/components/common/AccountEditUI'

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