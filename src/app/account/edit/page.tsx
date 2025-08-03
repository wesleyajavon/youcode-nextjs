import { getAuthSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Role } from '@prisma/client'
import { Suspense } from 'react'
import { CardSkeleton } from '@/components/ui/common/skeleton'
import { Layout, LayoutContent } from '@/components/layout/Layout'
import { AccountEditUI } from '@/components/common/server/AccountEditUI'

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