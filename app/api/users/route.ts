import { NextResponse } from "next/server";

import db from "@/db/drizzle";
import { getIsAdmin } from "@/lib/admin";

export const GET = async () => {
  const isAdmin = await getIsAdmin();
  if (!isAdmin) return new NextResponse("Unauthorized.", { status: 401 });

  const data = await db.query.userProgress.findMany();
  const res = NextResponse.json(data);
  // Let react-admin know the total for pagination
  res.headers.set("Content-Range", `users 0-${data.length}/${data.length}`);
  res.headers.set("Access-Control-Expose-Headers", "Content-Range");
  return res;
};
