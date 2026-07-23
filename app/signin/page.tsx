import { LoginButton } from "@/components/LoginButton";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AlertCircle } from "lucide-react";

export default async function SignInPage(props: { searchParams: Promise<{ error?: string }> }) {
    const session = await auth();
    if (session?.user) {
        redirect("/");
    }

    const searchParams = await props.searchParams;
    const error = searchParams.error;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background px-4 text-center">
            <h1 className="text-4xl font-bold mb-6 text-primary">Sign In</h1>
            
            {error === "OAuthAccountNotLinked" && (
                <div className="mb-6 max-w-md bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-start gap-3 text-left">
                    <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
                    <p className="text-sm">
                        <b>Account linking error:</b> This email is either already associated with another login method, or you are trying to log in with a different account while still logged in. Please <b>Sign Out</b> first, or clear your cookies if you are stuck.
                    </p>
                </div>
            )}

            <p className="text-lg mb-6 text-muted-foreground">Please sign in to continue your booking</p>
            <LoginButton />
        </div>
    )
}