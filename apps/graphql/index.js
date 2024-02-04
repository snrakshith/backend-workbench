const { ApolloServer, gql } = require("apollo-server");

// Scalars String , Int , Float ,Boolean, Id
const typeDefs = gql`
  type Query {
    hello: String
    numberOfAnimals: Int! # Important of Int type
  }
`;
const resolvers = {
  Query: {
    hello: () => {
      return "Hello..";
    },
    numberOfAnimals: () => {
      return 4;
    },
  },
};
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen().then(({ url }) => {
  console.log(`Server started at ${url}`);
});
