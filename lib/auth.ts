import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      async profile(profile) {
        console.log(profile)
        return {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          image: profile.image,
        }
      },
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
  ],
})
