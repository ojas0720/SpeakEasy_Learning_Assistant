"use client";

import { Layout, LayoutProps } from "react-admin";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

const CustomAppBar = () => {
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem("adminToken");
        router.push("/admin-login");
    };

    return (
        <div className="flex items-center justify-between bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4 shadow-lg">
            <div className="flex items-center gap-3">
                <h1 className="text-xl font-bold">SpeakEasy Admin</h1>
            </div>
            <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors duration-200"
            >
                <LogOut className="w-4 h-4" />
                <span className="text-sm font-medium">Logout</span>
            </button>
        </div>
    );
};

export const CustomLayout = (props: LayoutProps) => (
    <Layout {...props} appBar={CustomAppBar} />
);
