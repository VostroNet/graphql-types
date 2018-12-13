import { GraphQLScalarType } from "graphql";
import { GraphQLError } from "graphql/error";
import { Kind } from "graphql/language";

function isNumber(value) {
  return (value === null ||
    typeof value === "undefined" ||
    isNaN(value) ||
    Number.isNaN(value) ||
    value === Number.NaN);
}

function processValue(value) {
  if (!isNumber(value)) {
    throw new TypeError(`Value is not a number: ${value}`);
  }
  return parseFloat(value);
}

export default new GraphQLScalarType({
  name: "GQLTFloat",
  description: "Float",
  serialize(value) {
    return `${value}`;
  },

  parseValue(value) {
    if (!isNumber(value)) {
      throw new TypeError(`Value is not a number: ${value}`);
    }
    return parseFloat(value);
  },

  parseLiteral(ast) {
    if (ast.kind !== Kind.FLOAT) {
      throw new GraphQLError(
        `Can only validate floating point numbers as floating point numbers but got a: ${
          ast.kind
        }`,
      );
    }
    return processValue(ast.value);
  },
});
