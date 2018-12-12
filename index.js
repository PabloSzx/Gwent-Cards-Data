import _ from "lodash";
import fs from "fs";
import raw from "./gwent-data-release/cards.json";
import mkdirp from "mkdirp";

const stringToPathKey = input => {
  if (input) {
    let str = input;
    str = str.replace(/[-!$%^&*()_+|~=`{}[\]:";'<>?,./@#\\]/g, "");
    str = str.replace(/\s/g, "-");
    str = str.toLocaleLowerCase();
    return encodeURIComponent(str);
  }
  return "";
};

const saveFile = async (obj, name) => {
  try {
    await fs.writeFileSync(
      `../src/data/${name}.json`,
      JSON.stringify(obj),
      "utf8"
    );
    console.log(name + " was saved in Gwent-Cards folder!");
  } catch (err) {
    mkdirp("json", err => {
      if (err) {
        return console.error(err);
      }
      fs.writeFile(`json/${name}.json`, JSON.stringify(obj), "utf8", err => {
        if (err) {
          return console.error(err);
        }

        console.log(name + " was saved in json folder!");
      });
    });
  }
};

const cards_language = {
  "de-DE": [],
  "en-US": [],
  "es-ES": [],
  "es-MX": [],
  "fr-FR": [],
  "it-IT": [],
  "ja-JP": [],
  "pl-PL": [],
  "pt-BR": [],
  "ru-RU": [],
  "zh-CN": [],
  "zh-TW": []
};
_.forEach(raw, obj => {
  if (obj.released) {
    _.forEach(cards_language, (arreglo, idioma) => {
      arreglo.push(obj.name[idioma]);
    });
  }
});

saveFile(cards_language, "cards_language");

const database = {};

_.forEach(raw, obj => {
  if (obj.released) {
    let name = stringToPathKey(obj.name["en-US"]);
    database[name] = {
      categories: obj.categories,
      faction: obj.faction,
      info: obj.info,
      name: obj.name,
      loyalties: obj.loyalties,
      provision: obj.provision,
      strength: obj.strength,
      type: obj.type,
      variations: obj.variations,
      rarity: _.sample(obj.variations).rarity
    };
  }
});

saveFile(database, "database");

const equivalents = {};

_.forEach(raw, obj => {
  if (obj.released) {
    let name = stringToPathKey(obj.name["en-US"]);
    equivalents[name] = [];
    _.forEach(obj.name, nombre => {
      equivalents[name].push(stringToPathKey(nombre));
    });
  }
});

saveFile(equivalents, "equivalents");
