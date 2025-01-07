import { create } from 'ipfs-http-client';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { textOnly } from "@lens-protocol/metadata";

const client = new ApolloClient({
  uri: 'http://localhost:3001/api', // Use our proxy server
  cache: new InMemoryCache(),
});

const ipfs = create({ url: 'https://ipfs.infura.io:5001/api/v0' }); // Use Infura IPFS node

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
    const { uri } = await uploadMetadata(metadata);

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
      context: {
        headers: {
          'x-access-token': localStorage.getItem('lens-auth-token'),
        },
      },
    });

    console.log('Post created:', result.data);
    return result.data;
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
};

async function uploadMetadata(metadata: any) {
  const result = await ipfs.add(JSON.stringify(metadata));
  return { uri: `ipfs://${result.path}` };
}

