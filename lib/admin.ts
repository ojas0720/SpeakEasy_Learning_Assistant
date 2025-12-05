import { auth } from "@clerk/nextjs/server";

export const getIsAdmin = async () => {
  const { userId } = await auth();

  // Development mode: Allow admin access for any logged-in user
  // Set ENABLE_DEV_ADMIN=true in .env to enable this
  if (process.env.ENABLE_DEV_ADMIN === "true" && userId) {
    return true;
  }

  const adminIds = process.env.CLERK_ADMIN_IDS?.split(", ") || []; // stored in .env file as string separated by comma(,) and space( )

  if (!userId) return false;

  return adminIds.indexOf(userId) !== -1;
};
