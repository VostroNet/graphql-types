import "source-map-support/register";
import express from "express";

import { ApolloServer } from "apollo-server-express";
import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString
} from "graphql";

import createQueryType from "./query";

const app = express();

const Sequelize = {};
const schema = {
  flag: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
  myDate: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
  title: { type: Sequelize.STRING, allowNull: false },
  uniqueTwo: { type: Sequelize.INTEGER },
};



const server = new ApolloServer({
  schema: new GraphQLSchema({
    query: new GraphQLObjectType({
      name: "RootQuery",
      fields: {
        test: {
          type: GraphQLString,
          args: {
            where: {
              type: createQueryType("TEST", schema),
            },
          },
        },
      },
    }),
  }),
});

server.applyMiddleware({ app }); // app is from an existing express app

app.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
);
