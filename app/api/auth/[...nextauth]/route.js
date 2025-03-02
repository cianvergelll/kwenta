import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import db from "@/lib/db";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const [user] = await db.query("SELECT * FROM users WHERE email = ?", [credentials.email]);

          if (user.length === 0) throw new Error("User not found");

          const isValid = await bcrypt.compare(credentials.password, user[0].password);
          if (!isValid) throw new Error("Invalid credentials");

          return { id: user[0].id, name: user[0].name, email: user[0].email };
        } catch (error) {
          throw new Error(error.message);
        }
      },
    }),
  ],
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id; // ✅ Store user ID in the JWT
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id; // ✅ Retrieve user ID from token
      return session;
    },
  },
};

export const GET = (req, res) => NextAuth(req, res, authOptions);
export const POST = (req, res) => NextAuth(req, res, authOptions);
