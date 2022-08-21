const queryPokemon = {
  getFuzzyPokemon: `
      {
        getFuzzyPokemon($params) {
          key
          num
          color
          sprite
          types
          shinySprite
          backSprite
          weight
          height
          baseStats {
            hp 
            attack 
            defense 
            specialattack 
            specialdefense 
            speed 
          }
          abilities { 
            first 
            second 
            hidden 
          }
        }
      }
    `,
  getAbility: `
    {
      getAbility($params) {
        key
        desc
        name
        shortDesc
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
        _params += `${key}: ${params[key]}`;
      });
      _params += ")";
    }
    return _params;
  });
  return JSON.stringify({ query });
};

export default getQueryPokemon;
