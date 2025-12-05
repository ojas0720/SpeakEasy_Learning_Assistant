import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function POST(request: NextRequest) {
    try {
        const { token } = await request.json();

        if (!token) {
            return NextResponse.json(
                { valid: false, error: "No token provided" },
                { status: 401 }
            );
        }

        const secret = new TextEncoder().encode(
            process.env.ADMIN_JWT_SECRET || "your-secret-key-change-this-in-production"
        );

        const { payload } = await jwtVerify(token, secret);

        if (payload.role === "admin") {
            return NextResponse.json({ valid: true, username: payload.username });
        } else {
            return NextResponse.json(
                { valid: false, error: "Invalid role" },
                { status: 403 }
            );
        }
    } catch (error) {
        return NextResponse.json(
            { valid: false, error: "Invalid or expired token" },
            { status: 401 }
        );
    }
}
