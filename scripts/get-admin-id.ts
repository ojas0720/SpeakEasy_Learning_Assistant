/**
 * Helper script to get your Clerk User ID for admin access
 * 
 * This script helps you find your User ID after signing up
 * so you can add it to the CLERK_ADMIN_IDS in .env
 */

import { clerkClient } from "@clerk/nextjs/server";

async function getAdminUserId() {
    try {
        console.log("\n🔍 Fetching users from Clerk...\n");

        // Get all users
        const users = await clerkClient.users.getUserList();

        if (users.length === 0) {
            console.log("❌ No users found. Please sign up first at http://localhost:3000\n");
            return;
        }

        console.log("📋 Found Users:\n");
        console.log("=".repeat(80));

        users.forEach((user, index) => {
            const email = user.emailAddresses[0]?.emailAddress || "No email";
            const username = user.username || user.firstName || "No name";
            const userId = user.id;
            const createdAt = new Date(user.createdAt).toLocaleDateString();

            console.log(`\n${index + 1}. User: ${username}`);
            console.log(`   Email: ${email}`);
            console.log(`   User ID: ${userId}`);
            console.log(`   Created: ${createdAt}`);
            console.log(`   ${"─".repeat(76)}`);
        });

        console.log("\n" + "=".repeat(80));
        console.log("\n📝 To make a user an admin:\n");
        console.log("1. Copy the User ID from above");
        console.log("2. Open your .env file");
        console.log("3. Update CLERK_ADMIN_IDS with the User ID:");
        console.log('   CLERK_ADMIN_IDS="user_2abc123xyz456"');
        console.log("4. For multiple admins, separate with comma and space:");
        console.log('   CLERK_ADMIN_IDS="user_2abc123xyz456, user_2def789ghi012"');
        console.log("5. Restart your development server");
        console.log("6. Access admin panel at http://localhost:3000/admin\n");

    } catch (error) {
        console.error("\n❌ Error fetching users:", error);
        console.log("\n💡 Make sure:");
        console.log("   - Your Clerk credentials are correct in .env");
        console.log("   - You have at least one user signed up");
        console.log("   - Your development server is running\n");
    }
}

// Run the script
getAdminUserId();
