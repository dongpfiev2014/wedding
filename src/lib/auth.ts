import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret:
    process.env.AUTH_SECRET ||
    process.env.NEXTAUTH_SECRET ||
    "wedding-super-secret-key-2026-minh-dong-dieu-linh",
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const username = (credentials?.username as string)?.trim();
        const password = credentials?.password as string;

        const expectedUser = (process.env.ADMIN_USERNAME || "admin").trim();
        const expectedPass = process.env.ADMIN_PASSWORD || "123456";

        if (username === expectedUser && password === expectedPass) {
          return { id: "1", name: "Admin", email: "admin@wedding.com" };
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/admin/login",
  },
  session: { strategy: "jwt" },
  callbacks: {
    authorized({ auth, request }) {
      const pathname = request?.nextUrl?.pathname;
      if (pathname === "/admin/login") return true;
      return !!auth?.user;
    },
    redirect({ url, baseUrl }) {
      if (url.endsWith("/admin/login") || url.includes("/admin/login")) {
        return `${baseUrl}/admin`;
      }
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      try {
        if (new URL(url).origin === baseUrl) return url;
      } catch {
        // invalid URL fallback
      }
      return `${baseUrl}/admin`;
    },
  },
});
