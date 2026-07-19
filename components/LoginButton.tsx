"use client";

import { FaGoogle } from "react-icons/fa6";
import { signIn } from "next-auth/react";

export function LoginButton({ className }: { className?: string }) {
    return (
        <button 
            onClick={() => signIn("google", { callbackUrl: "/" })}
            className={`flex items-center justify-center gap-2 w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-6 py-2.5 font-medium shadow-sm transition-colors ${className || ""}`}
        >
            <FaGoogle className="w-4 h-4" />
            Sign in with Google
        </button>
    )
}

export default LoginButton;
