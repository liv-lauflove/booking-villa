import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AuthRedirectPage() {
    const session = await auth();
    
    if (!session?.user) {
        redirect("/signin");
    }

    if (session.user.role === "admin") {
        redirect("/admin");
    } else {
        redirect("/");
    }
}
