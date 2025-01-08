import { gql } from '@apollo/client'
import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { onError } from "@apollo/client/link/error";
import { setContext } from '@apollo/client/link/context';
import { textOnly } from "@lens-protocol/metadata";
import axios from 'axios';

const PINATA_API_KEY = process.env.NEXT_PUBLIC_PINATA_API_KEY;
const PINATA_SECRET_API_KEY = process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY;

if (!PINATA_API_KEY || !PINATA_SECRET_API_KEY) {
  throw new Error('Pinata API keys are not set in environment variables');
}

const httpLink = createHttpLink({
  uri: process.env.NODE_ENV === 'development' ? '/api/proxy' : 'https://api.lens.dev',
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('lens-auth-token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
      ),
    );
  if (networkError) console.log(`[Network error]: ${networkError}`);
});

const client = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
});

const POST_MUTATION = gql`
  mutation CreatePost($request: PostRequest!) {
    post(request: $request) {
      ... on PostResponse {
        hash
      }
      ... on SponsoredTransactionRequest {
        id
        hash
      }
      ... on SelfFundedTransactionRequest {
        id
        hash
      }
      ... on TransactionWillFail {
        reason
      }
    }
  }
`;

export const createPostTypedData = async (address: string, content: string, visibility: string) => {
  try {
    // 1. Create Post Metadata
    const metadata = textOnly({ content });

    // 2. Upload Post Metadata
    let uri;
    try {
      const result = await uploadMetadata(metadata);
      uri = result;
    } catch (error: any) {
      console.error('Error uploading metadata:', error);
      throw new Error(`Failed to upload metadata: ${error.message}`);
    }

    // 3. Submit On-Chain
    const result = await client.mutate({
      mutation: POST_MUTATION,
      variables: {
        request: {
          contentUri: uri,
          profileId: address,
          collectModule: {
            freeCollectModule: { followerOnly: visibility === 'FOLLOWERS' }
          },
          referenceModule: {
            followerOnlyReferenceModule: visibility === 'FOLLOWERS'
          }
        },
      },
    });

    console.log('Post created:', result.data);
    return result.data;
  } catch (error: any) {
    console.error('Error creating post:', error);
    if (error.networkError) {
      console.error('Network error details:', error.networkError);
    }
    throw error;
  }
};

async function uploadMetadata(metadata: any) {
  try {
    const data = JSON.stringify({
      pinataOptions: {
        cidVersion: 1
      },
      pinataMetadata: {
        name: "LensPostContent",
      },
      pinataContent: metadata
    });

    const res = await axios.post("https://api.pinata.cloud/pinning/pinJSONToIPFS", data, {
      headers: {
        'Content-Type': 'application/json',
        'pinata_api_key': PINATA_API_KEY,
        'pinata_secret_api_key': PINATA_SECRET_API_KEY
      }
    });

    console.log(res.data);

    return `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`;
  } catch (error) {
    console.error('Error uploading to IPFS via Pinata:', error);
    throw new Error('Failed to upload content to IPFS');
  }
}

