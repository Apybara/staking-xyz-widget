import moment from "moment";
import { cosmos } from "juno-network";

const { GenericAuthorization } = cosmos.authz.v1beta1;
const { StakeAuthorization } = cosmos.staking.v1beta1;

export const createAuthzAminoConverters = () => {
  const grantConverter: any = createAuthzAuthorizationAminoConverter();
  return {
    "/cosmos.authz.v1beta1.MsgGrant": {
      aminoType: "cosmos-sdk/MsgGrant",
      toAmino: ({ granter, grantee, grant }: any) => {
        const converter = grantConverter[grant.authorization.typeUrl];
        return {
          granter,
          grantee,
          grant: {
            authorization: {
              type: converter.aminoType,
              value: converter.toAmino(grant.authorization.value),
            },
            expiration: grant.expiration && dateConverter.toAmino(grant.expiration),
          },
        };
      },
      fromAmino: ({ granter, grantee, grant }: any) => {
        const protoType: any = Object.keys(grantConverter).find(
          (type) => grantConverter[type].aminoType === grant.authorization.type,
        );
        const converter = grantConverter[protoType];
        return {
          granter,
          grantee,
          grant: {
            authorization: {
              typeUrl: protoType,
              value: converter.fromAmino(grant.authorization.value),
            },
            expiration: grant.expiration && dateConverter.fromAmino(grant.expiration),
          },
        };
      },
    },
  };
};

const createAuthzAuthorizationAminoConverter = () => {
  return {
    "/cosmos.authz.v1beta1.GenericAuthorization": {
      aminoType: "cosmos-sdk/GenericAuthorization",
      toAmino: (value: any) => GenericAuthorization.decode(value),
      fromAmino: ({ msg }: any) =>
        GenericAuthorization.encode(
          GenericAuthorization.fromPartial({
            msg,
          }),
        ).finish(),
    },
    "/cosmos.staking.v1beta1.StakeAuthorization": {
      aminoType: "cosmos-sdk/StakeAuthorization",
      toAmino: (value: any) => {
        const { allowList, maxTokens, authorizationType } = StakeAuthorization.decode(value);
        return {
          Validators: {
            type: "cosmos-sdk/StakeAuthorization/AllowList",
            value: {
              allow_list: allowList,
            },
          },
          max_tokens: maxTokens,
          authorization_type: authorizationType,
        };
      },
      fromAmino: ({ allow_list, max_tokens, authorization_type }: any) =>
        StakeAuthorization.encode(
          StakeAuthorization.fromPartial({
            allowList: allow_list,
            maxTokens: max_tokens,
            authorizationType: authorization_type,
          }),
        ).finish(),
    },
  };
};

const dateConverter = {
  toAmino(date: any) {
    return moment(date.seconds.toNumber() * 1000)
      .utc()
      .format();
  },
  fromAmino(date: any) {
    return {
      seconds: moment(date).unix(),
      nanos: 0,
    };
  },
};
