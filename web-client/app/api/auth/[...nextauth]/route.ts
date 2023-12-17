import NextAuth from "next-auth"
import DuendeIdentityServer6 from "next-auth/providers/duende-identity-server6";
import GitHubProvider from "next-auth/providers/github";

export const authOptions = {
    providers: [
        GitHubProvider({
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!,
        }),
        DuendeIdentityServer6({
            clientId: process.env.DUENDE_IDS6_ID!,
            clientSecret: process.env.DUENDE_IDS6_SECRET!,
            issuer: process.env.DUENDE_IDS6_ISSUER,
            profile(profile) {
                
                return {
                    id: profile.sub,
                    name: profile.name,
                    email: profile.email,
                    image: null,
                }
            },
        }),
    ],
}

const handler = NextAuth(authOptions)

export {handler as GET, handler as POST}