import React, { useEffect } from 'react';
import { AppProvider, gql, useAuth } from '8base-react-sdk';
import { Auth, AUTH_STRATEGIES } from '@8base/auth';
import { withApollo, Query, } from 'react-apollo';
import { compose } from 'recompose'; 
import Tareas from "../src/components/tareas";
// 8base api endpoint
const API_ENDPOINT_URI = 'https://api.8base.com/ckju6k1um00hy08mcdv5nbarz';

// You can get this info from authentication settings page
const AUTH0_CLIENT_ID = '76lcrr99eikr5tme4jlio27b82';
const AUTH0_CLIENT_DOMAIN = 'https://5ffdc7496111320008860017.auth.us-east-1.amazoncognito.com'
const AUTH_PROFILE_ID = 'ckjubfd2j001t08leg2q81p7n';

const CURRENT_USER_QUERY = gql`
  query CurrentUser {
    user {
      id
      email
    }
  }
`;

const USER_SIGN_UP_MUTATION = gql`
  mutation UserSignUp($user: UserCreateInput!, $authProfileId: ID) {
    userSignUpWithToken(user: $user, authProfileId: $authProfileId) {
      id
      email
    }
  }
`;

const REDIRECT_URI = document.location.href.replace(document.location.hash, '');

// Auth0 auth client 
const authClient = Auth.createClient({
  strategy: AUTH_STRATEGIES.WEB_COGNITO,
  subscribable: true,
}, {
  clientId: AUTH0_CLIENT_ID,
  domain: AUTH0_CLIENT_DOMAIN,
  // Don't forget set custom domains in the authentication settings!
  redirectUri: REDIRECT_URI,
  logoutRedirectUri: REDIRECT_URI,
});

const Hello = compose(
  withApollo,
)(({ client }) => {
  // const auth = useAuth();
  // const logout = async () => {
  //   await client.clearStore();

  //   auth.authClient.logout();
  // };

  return(
    <Query query={ CURRENT_USER_QUERY }>
      { ({ loading, data }) => {
        if (loading) {
          return <p>Loading...</p>
        }

        return (
          <div>
              <Tareas/>
          </div>
        );
      } }
    </Query>
  )
});


// withAuth passes authorization state and utilities through auth prop.
const Authorization = compose(
  withApollo,
)(({ client }) => {
  const auth = useAuth();
  const shouldProcessAuthorizationResult = !auth.isAuthorized &&
    document.location.hash.includes('access_token');

  useEffect(() => {
    const processAuthorizationResult = async () => {
      const { idToken, email } = await auth.authClient.getAuthorizedData();

      const context = { headers: { authorization: `Bearer ${idToken}` } };

      // Check if user exists, if not it'll return an error
      await client.query({
        query: CURRENT_USER_QUERY,
        context,
      })
      // If user is not found - sign them up
        .catch(() => client.mutate({
          mutation: USER_SIGN_UP_MUTATION,
          variables: {
            user: { email },
            authProfileId: AUTH_PROFILE_ID,
          },
          context,
        }));

      // After succesfull signup store token in local storage
      // After that token will be added to a request headers automatically
      auth.authClient.setState({
        token: idToken,
      });
    };

    if (shouldProcessAuthorizationResult) {
      processAuthorizationResult();
    }
  }, [shouldProcessAuthorizationResult, auth, client]);

  if (auth.isAuthorized) {
    return <Hello />;
  }

  const authorize = () => {
    auth.authClient.authorize();
  }

  // Check if we didn't return from auth0
  if (!document.location.hash.includes('access_token')) {
    return (
      <div>
        <p>Hello guest!</p>
        <button type="button" onClick={ authorize }>
          Authorize
        </button>
      </div>
    );
  }

  return <p>Authorizing...</p>
});

const App = () => {
  return (
    <AppProvider uri={ API_ENDPOINT_URI } authClient={ authClient }>
      { ({ loading }) => {
        if (loading) {
          return <p>Loading...</p>;
        }

        return (
          <React.Fragment>
            <Authorization />
          </React.Fragment>
        );
      } }
    </AppProvider>
  );
};

export default App;