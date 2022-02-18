
const { ApolloServer, gql } = require('apollo-server');
const { RESTDataSource } = require('apollo-datasource-rest');

const fs = require('fs');
const TOKEN = fs.readFileSync('./Token').toString();

class WorkItemsAPI extends RESTDataSource {
    constructor() {
        super();
        this.baseURL = "https://dev.azure.com/wdfox3/3143c869-ae4a-48d2-93e6-5503b338c6bc/_apis/wit/"
    }

    async getAllWorkItems() {
        const res = await this.post("wiql", {
            "query": "Select [System.Id], [System.Title], [System.State], [System.WorkItemType] From WorkItems Where [System.WorkItemType] = 'User Story'"
          },
        );
        console.log(res)
        return res.workItems;
    }

    willSendRequest(request) {
        console.log(request);
        const token = ":" + TOKEN;
        console.log(token);
        // console.log(Buffer.from(token, 'binary').toString('base64'));
        request.headers.set('Authorization', 'Basic ' + Buffer.from(token, 'binary').toString('base64'));
        // console.log(Buffer.from(token, 'base64').toString('utf-8'));
        // request.headers.set('Authorization', 'Basic ' + token);
        request.headers.set('Accept', 'application/json;api-version=7.0');
        console.log(request.headers);
    }
}

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = gql`
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Book" type defines the queryable fields for every book in our data source.
  type Book {
    title: String
    author: String
  }

  type WorkItem {
      id: Int!
      url: String!
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    books: [Book]
    workItems: [WorkItem]
  }
`;

const books = [
    {
      title: 'The Awakening',
      author: 'Kate Chopin',
    },
    {
      title: 'City of Glass',
      author: 'Paul Auster',
    },
  ];
  
// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
    Query: {
      books: () => books,
      workItems: (parent, args, {dataSources}) => {
          return dataSources.workItemsAPI.getAllWorkItems();
      }
    },
  };
  
// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({ 
    typeDefs, 
    resolvers,
    dataSources: () => {
        return {
            workItemsAPI: new WorkItemsAPI(),
        };
    },
});

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});

