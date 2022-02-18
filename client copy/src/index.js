import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  gql
} from "@apollo/client";

const PAT = "mdawkuaxj65pquet6aq6s7o5e4zx4thl2xcnbr2xctgihvkulvia";

const client = new ApolloClient({
  uri: 'http://localhost:4000',
  cache: new InMemoryCache()
});

// client
//   .query({
//     query: gql`
//       query GetRates {
//         rates(currency: "USD") {
//           currency
//         }
//       }
//     `
//   })
//   .then(result => console.log(result));

const BOOKS = gql`
  query Books {
    books {
      title
    }
  }
`;

function Books() {
  const { loading, error, data } = useQuery(BOOKS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  
  return data.books.map(({title}) => (
    <div key={title}>
      <p>
        {title}
      </p>
    </div>
  ));
}

const WORK_ITEMS = gql`
  query WorkItems {
    workItems {
      id
    }
  }
`

function WorkItems() {
  const { loading, error, data } = useQuery(WORK_ITEMS);

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error :</p>

  return data.workItems.map(({id}) => (
    <div key={id}>
      <p>
        {id}
      </p>
    </div>
  ));
}


ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
      <Books />
      <WorkItems />
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
