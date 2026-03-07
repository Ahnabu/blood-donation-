import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        const token = req.nextauth.token;
        const path = req.nextUrl.pathname;

        // Redirect unverified users to NID upload page
        if (
            token &&
            token.nidStatus !== "approved" &&
            path.startsWith("/dashboard") &&
            !path.startsWith("/dashboard/verify-nid")
        ) {
            return NextResponse.redirect(new URL("/dashboard/verify-nid", req.url));
        }

        // RBAC: Donor routes
        if (path.startsWith("/dashboard/donor") && token?.role !== "donor") {
            return NextResponse.redirect(new URL("/unauthorized", req.url));
        }

        // RBAC: Receiver routes
        if (path.startsWith("/dashboard/receiver") && token?.role !== "receiver") {
            return NextResponse.redirect(new URL("/unauthorized", req.url));
        }

        // RBAC: Admin routes
        if (path.startsWith("/dashboard/admin") && token?.role !== "admin") {
            return NextResponse.redirect(new URL("/unauthorized", req.url));
        }

        return NextResponse.next();
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token,
        },
    }
);

export const config = {
    matcher: ["/dashboard/:path*"],
};
