import LayoutClient from "@/components/common/client/LayoutClient";
import { getRequiredAuthSession } from "@/lib/auth";
import { Role } from "@prisma/client";
import { redirect } from "next/navigation";

export default async function AdminLayoutClient({ children }: { children: React.ReactNode }) {

  const session = await getRequiredAuthSession()

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/')
  }

  return (
    <LayoutClient role={session.user.role as Role}>{children}</LayoutClient>
  );
}