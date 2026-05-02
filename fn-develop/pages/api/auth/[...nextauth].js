import API from "@/utlis/api/ApiCall";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const options = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          console.log("Attempting login for:", credentials.email);
          const response = await API.post(`/auth/login`, {
            email: credentials.email,
            password: credentials.password,
          });
          console.log("Backend response status:", response.status);
          if (response?.data?.token) {
            const { token, user } = response?.data;
            return {
              token: token,
              name: `${user.firstName} ${user.lastName}`,
              role: user.role
            };
          } else {
            console.log("No token in backend response");
            return null;
          }
        } catch (error) {
          console.error(
            "Error during authentication:",
            error.response?.data || error.message
          );
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (trigger === "update" && session?.user) {  
        return { ...token};
      }

      if (user) {
        token.role = typeof user.role === 'string' ? user.role : user.role?.roleName;
        token.name = user.name
        token.token = user.token;
      } 
      return token;
    },
    async session({ session, token, trigger }) {
      if (token) {
        session.user.role = token.role
        session.user.name = token.name
        session.user.token = token.token;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
};

export default function auth(req, res) {
  return NextAuth(req, res, options);
}