import { LoginButton } from "@/components/LoginButton";

export default function SignInPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background">
            <h1 className="text-4xl font-bold mb-6 text-primary">Sign In</h1>
            <p className="text-lg mb-4 text-foreground">Please sign in to continue</p>
            <LoginButton />
        </div>
    )
}