import { signIn } from "@/auth";
import { FaGoogle } from "react-icons/fa6";

export function LoginButton({ className }: { className?: string }) {
    return (
        <form
            action={async () => {
                "use server";
                await signIn("google", { redirectTo: "/" });
            }}
            className="w-full"
        >
            <button 
                type="submit"
                className={`flex items-center justify-center gap-2 w-full bg-slate-900 text-white hover:bg-slate-800 rounded-full px-6 py-2.5 font-medium shadow-sm transition-colors ${className || ""}`}
            >
                <FaGoogle className="w-4 h-4" />
                Sign in with Google
            </button>
        </form>
    );
}

export default LoginButton;
