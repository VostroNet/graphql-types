
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


// const valueFuncs = ["eq", "ne", "gte", "lte", "lt", "not", "is", "like",
//   "notLike", "iLike", "notILike", "startsWith", "endsWith", "substring",
//   "regexp", "notRegexp", "iRegexp", "notIRegexp",
// ];
// const arrayFuncs = ["or", "and", "any", "all"];

// const arrayValues = ["in", "notIn", "contains", "contained",
//   "between", "notBetween", "overlap", "adjacent", "strictLeft",
//   "strictRight", "noExtendRight", "noExtendLeft",
// ];




export const defaultConfig = {
  getFieldType(field) {
    return GraphQLString;
  },
  valueFuncs: ["eq", "ne", "gte", "lte", "lt", "not", "is", "like",
    "notLike", "iLike", "notILike", "startsWith", "endsWith", "substring",
    "regexp", "notRegexp", "iRegexp", "notIRegexp",
  ],
  arrayFuncs: ["or", "and", "any", "all"],
  arrayValues: ["in", "notIn", "contains", "contained",
    "between", "notBetween", "overlap", "adjacent", "strictLeft",
    "strictRight", "noExtendRight", "noExtendLeft",
  ],
};

export default function createQueryType(config) {
  const mainInputName = `GQLTQuery${config.modelName}Where`;
  const fieldInputType = new GraphQLInputObjectType({
    name: mainInputName,
    fields() {
      let fields = Object.keys(config.fields).reduce((o, fieldName) => {
        const actualFieldType = config.fields[fieldName];
        const fieldType = new GraphQLInputObjectType({
          name: `${mainInputName}${fieldName}`,
          fields() {
            let innerFields = config.valueFuncs.reduce((i, funcName) => {
              i[funcName] = {
                type: actualFieldType,
              };
              return i;
            }, {});
            innerFields = config.arrayValues.reduce((i, funcName) => {
              i[funcName] = {
                type: new GraphQLList(actualFieldType),
              };
              return i;
            }, innerFields);
            if (config.processInnerFields) {
              return config.processInnerFields(innerFields, actualFieldType);
            }
            return innerFields;
          },
        });
        o[fieldName] = {
          type: fieldType,
        };
        return o;
      }, {});
      fields = config.arrayFuncs.reduce((i, funcName) => {
        i[funcName] = {
          type: new GraphQLList(fieldInputType),
        };
        return i;
      }, fields);
      if (config.isolatedFields) {
        fields = Object.keys(config.isolatedFields).reduce((o, fieldName) => {
          o[fieldName] = {
            type: config.isolatedFields[fieldName],
          };
          return o;
        }, fields);
      }
      if (config.processFields) {
        return config.processFields(fields);
      }
      return fields;
    },
  });
  return fieldInputType;
}
