// next-auth.d.ts
import NextAuth from "next-auth";

// Extend the default session and user types
declare module "next-auth" {
  interface User {
    id: string;
    role: string;
  }

  interface Session {
    user: {
      role: string; 
      token: string;
    };
  }
}
