import { NextRequest, NextResponse } from "next/server";
import { SignJWT } from "jose";

export async function POST(request: NextRequest) {
    try {
        const { username, password } = await request.json();

        // Get admin credentials from environment variables
        const adminUsername = process.env.ADMIN_USERNAME || "admin";
        const adminPassword = process.env.ADMIN_PASSWORD || "SpeakEasy2024!";

        // Verify credentials
        if (username === adminUsername && password === adminPassword) {
            // Create JWT token
            const secret = new TextEncoder().encode(
                process.env.ADMIN_JWT_SECRET || "your-secret-key-change-this-in-production"
            );

            const token = await new SignJWT({ username, role: "admin" })
                .setProtectedHeader({ alg: "HS256" })
                .setIssuedAt()
                .setExpirationTime("24h")
                .sign(secret);

            return NextResponse.json({
                success: true,
                token,
                message: "Login successful"
            });
        } else {
            return NextResponse.json(
                { error: "Invalid username or password" },
                { status: 401 }
            );
        }
    } catch (error) {
        console.error("Admin login error:", error);
        return NextResponse.json(
            { error: "Login failed" },
            { status: 500 }
        );
    }
}
