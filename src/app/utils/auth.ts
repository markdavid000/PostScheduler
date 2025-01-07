import { ApolloClient, InMemoryCache, gql } from '@apollo/client';

const client = new ApolloClient({
  uri: 'http://localhost:3001/api',
  cache: new InMemoryCache(),
});

const CHALLENGE_QUERY = gql`
  query Challenge($address: EthereumAddress!) {
    challenge(request: { address: $address }) {
      text
    }
  }
`;

const AUTHENTICATE_MUTATION = gql`
  mutation Authenticate($address: EthereumAddress!, $signature: Signature!) {
    authenticate(request: {
      address: $address,
      signature: $signature
    }) {
      accessToken
      refreshToken
    }
  }
`;

export async function authenticate(address: string, signer: any) {
  // 1. Get the challenge
  const challengeResult = await client.query({
    query: CHALLENGE_QUERY,
    variables: { address },
  });

  const challengeText = challengeResult.data.challenge.text;

  // 2. Sign the challenge
  const signature = await signer.signMessage(challengeText);

  // 3. Authenticate with the signature
  const authResult = await client.mutate({
    mutation: AUTHENTICATE_MUTATION,
    variables: {
      address,
      signature,
    },
  });

  const { accessToken, refreshToken } = authResult.data.authenticate;

  // 4. Store the tokens
  localStorage.setItem('lens-auth-token', accessToken);
  localStorage.setItem('lens-refresh-token', refreshToken);

  return { accessToken, refreshToken };
}

