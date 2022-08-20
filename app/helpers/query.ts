type Query = Record<string, string>;

const queryPokemon = {
  getAllPokemon: `
        {
            getFuzzyPokemon($params) {
                key
                num
                color
                sprite
            }
        }
    `,
};

const getQueryPokemon = (
  queryName: keyof typeof queryPokemon,
  params?: Record<string, any>
) => {
  let query = queryPokemon[queryName].replace(/\(\$params\)/gi, () => {
    let _params = "";
    if (params) {
      _params = "(";
      Object.keys(params).forEach((key, idx) => {
        if (idx > 0) {
          _params += ", ";
        }
        _params += `${key}: `;
        if (typeof params[key] === "string") {
          _params += `"${params[key]}"`;
        } else {
          _params += params[key];
        }
      });
      _params += ")";
    }
    return _params;
  });
  return JSON.stringify({ query });
};

export default getQueryPokemon;
