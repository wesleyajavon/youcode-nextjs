"use server"

import { prisma } from '@/lib/prisma';
import { Role } from '@prisma/client';

export async function updateRoleAction(id: string, newRole: Role) {
  try {
    const user = await prisma.user.update({
      where: { id },
      data: { role: newRole },
    });
    return { success: true };
  } catch ( error ) {
    console.error('Error updating user role:', error);
    return { success: false };
  }
}