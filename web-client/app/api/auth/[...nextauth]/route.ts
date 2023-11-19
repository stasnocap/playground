import NextAuth from "next-auth"
import DuendeIdentityServer6 from "next-auth/providers/duende-identity-server6";

export const authOptions = {
    providers: [
        DuendeIdentityServer6({
            clientId: process.env.DUENDE_IDS6_ID!,
            clientSecret: process.env.DUENDE_IDS6_SECRET!,
            issuer: process.env.DUENDE_IDS6_ISSUER,
        }),
    ],
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }