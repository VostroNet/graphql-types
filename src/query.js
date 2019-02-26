
import {
  GraphQLScalarType,
  GraphQLInt,
  GraphQLFloat,
  GraphQLBoolean,
  GraphQLString,
  GraphQLInputObjectType,
  GraphQLList,
} from "graphql";

import { Kind } from "graphql/language";

import property from "./utils/property";


// To generate an strict model for query types instead of blank json types
// this should fix apollo's variable cache issue


const valueFuncs = ["eq", "ne", "gte", "lte", "lt", "not", "is", "like",
  "notLike", "iLike", "notILike", "startsWith", "endsWith", "substring",
  "regexp", "notRegexp", "iRegexp", "notIRegexp",
];
const arrayFuncs = ["or", "and", "any", "all"];

const arrayValues = ["in", "notIn", "contains", "contained",
  "between", "notBetween", "overlap", "adjacent", "strictLeft",
  "strictRight", "noExtendRight", "noExtendLeft",
];

export default function createQueryType(modelName, modelFields, Ops) {
  const mainInputName = `Query${modelName}Where`;
  const fieldInputType = new GraphQLInputObjectType({
    name: mainInputName,
    fields() {
      let fields = Object.keys(modelFields).reduce((o, fieldName) => {
        const actualFieldType = GraphQLString;
        const fieldType = new GraphQLInputObjectType({
          name: `${mainInputName}${fieldName}`,
          fields() {
            let innerFields = valueFuncs.reduce((i, funcName) => {
              i[funcName] = {
                type: actualFieldType,
              };
              return i;
            }, {});
            innerFields = arrayValues.reduce((i, funcName) => {
              i[funcName] = {
                type: new GraphQLList(actualFieldType),
              };
              return i;
            }, innerFields);
            return innerFields;
          }
        });
        o[fieldName] = {
          type: fieldType,
        };
        return o;
      }, {});
      fields = arrayFuncs.reduce((i, funcName) => {
        i[funcName] = {
          type: new GraphQLList(fieldInputType),
        };
        return i;
      }, fields);
      return fields;
    }
  });
  return fieldInputType;
}
