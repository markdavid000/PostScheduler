import { ApolloClient, InMemoryCache } from '@apollo/client'

export const apolloClient = new ApolloClient({
  uri: 'https://api.lens.dev',
  cache: new InMemoryCache()
})

