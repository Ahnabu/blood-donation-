import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);
    const role = (session?.user as { role?: string } | undefined)?.role;

    if (role === "admin") redirect("/dashboard/admin");
    if (role === "receiver") redirect("/dashboard/receiver");
    redirect("/dashboard/donor");
}
