export const TYPES = {
  LEAF:{label:"Leaf",color:"#82A96E",weak:"EMBER",strong:"TIDE"},
  EMBER:{label:"Ember",color:"#E58B69",weak:"TIDE",strong:"FROST"},
  TIDE:{label:"Tide",color:"#75B8C7",weak:"VOLT",strong:"EMBER"},
  VOLT:{label:"Volt",color:"#E6C35F",weak:"GROVE",strong:"TIDE"},
  GROVE:{label:"Grove",color:"#A7B77B",weak:"FROST",strong:"VOLT"},
  FROST:{label:"Frost",color:"#A6C5D8",weak:"EMBER",strong:"GROVE"},
  SHADE:{label:"Shade",color:"#8C83AD",weak:"GROVE",strong:"MIND"},
  MIND:{label:"Mind",color:"#D49BAF",weak:"SHADE",strong:"EMBER"}
};

export const REGIONS = [
  {id:"sunmeadow",name:"Sunmeadow",subtitle:"Warm fields & sleepy villages",x0:0,z0:0,x1:21,z1:63,ground:"#9FBE83",accent:"#E8CB81",weather:"Clear skies"},
  {id:"whisperwood",name:"Whisperwood",subtitle:"Ancient trees & glowing moss",x0:22,z0:0,x1:43,z1:31,ground:"#789A73",accent:"#A6B88C",weather:"Soft woodland mist"},
  {id:"tideglass",name:"Tideglass Coast",subtitle:"Tide pools & sea caves",x0:44,z0:0,x1:63,z1:31,ground:"#B5C5A0",accent:"#83C4D0",weather:"Sea breeze"},
  {id:"emberfall",name:"Emberfall Ridge",subtitle:"Warm stone & fire flowers",x0:22,z0:32,x1:43,z1:63,ground:"#B99A75",accent:"#E28B68",weather:"Warm updrafts"},
  {id:"frostveil",name:"Frostveil Peaks",subtitle:"Snowfields & crystal pines",x0:44,z0:32,x1:63,z1:63,ground:"#C6D6D7",accent:"#A6C5D8",weather:"Gentle snowfall"}
];

export const CREATURES = [
  {id:"mosslet",name:"Mosslet",type:"LEAF",region:"sunmeadow",rarity:"Common",shape:"sprout",color:"#8EAF73",accent:"#D3DDA5",hp:34,atk:10,def:12,spd:9,learn:["Leaf Flick","Root Hug"],evolvesTo:"mossprig",evolveAt:12},
  {id:"mossprig",name:"Mossprig",type:"LEAF",region:"whisperwood",rarity:"Uncommon",shape:"sprout",color:"#648F62",accent:"#D6E2A8",hp:52,atk:15,def:18,spd:12,learn:["Leaf Flick","Root Hug","Bramble Burst"]},
  {id:"cindercub",name:"Cindercub",type:"EMBER",region:"sunmeadow",rarity:"Common",shape:"cub",color:"#E68B67",accent:"#F7C47D",hp:31,atk:14,def:9,spd:13,learn:["Spark Paw","Cinder Puff"],evolvesTo:"cindergrove",evolveAt:12},
  {id:"cindergrove",name:"Cindergrove",type:"EMBER",region:"emberfall",rarity:"Uncommon",shape:"cub",color:"#C96B53",accent:"#FFD08B",hp:50,atk:20,def:14,spd:17,learn:["Spark Paw","Cinder Puff","Wildfire Rush"]},
  {id:"bubbloon",name:"Bubbloon",type:"TIDE",region:"sunmeadow",rarity:"Common",shape:"float",color:"#83C4D0",accent:"#D9F0E8",hp:38,atk:10,def:13,spd:11,learn:["Bubble Pop","Mist Veil"],evolvesTo:"bubblume",evolveAt:12},
  {id:"bubblume",name:"Bubblume",type:"TIDE",region:"tideglass",rarity:"Uncommon",shape:"float",color:"#65AFC1",accent:"#E5F6ED",hp:58,atk:15,def:18,spd:15,learn:["Bubble Pop","Mist Veil","Tidal Bloom"]},
  {id:"pipkin",name:"Pipkin",type:"GROVE",region:"sunmeadow",rarity:"Common",shape:"rabbit",color:"#D2B783",accent:"#F5E3B6",hp:30,atk:11,def:10,spd:16,learn:["Seed Toss","Quick Hop"],evolvesTo:"pipthorn",evolveAt:13},
  {id:"pipthorn",name:"Pipthorn",type:"GROVE",region:"whisperwood",rarity:"Uncommon",shape:"rabbit",color:"#A9B77A",accent:"#E8E9B5",hp:49,atk:16,def:15,spd:21,learn:["Seed Toss","Quick Hop","Thicket Spin"]},
  {id:"glimmeray",name:"Glimmeray",type:"VOLT",region:"whisperwood",rarity:"Rare",shape:"moth",color:"#E6C76D",accent:"#FFF0B0",hp:34,atk:17,def:9,spd:21,learn:["Sparkle Zap","Wingbeat"]},
  {id:"thornit",name:"Thornit",type:"LEAF",region:"whisperwood",rarity:"Common",shape:"hedgehog",color:"#75966A",accent:"#C7D39A",hp:46,atk:13,def:18,spd:7,learn:["Bramble Burst","Curl Up"]},
  {id:"pebblit",name:"Pebblit",type:"GROVE",region:"whisperwood",rarity:"Common",shape:"rock",color:"#A99C83",accent:"#D8C9A8",hp:52,atk:11,def:22,spd:5,learn:["Pebble Bonk","Curl Up"],evolvesTo:"bouldear",evolveAt:14},
  {id:"bouldear",name:"Bouldear",type:"GROVE",region:"emberfall",rarity:"Uncommon",shape:"rock",color:"#897F70",accent:"#D5C5A4",hp:76,atk:17,def:29,spd:6,learn:["Pebble Bonk","Stone Roll","Curl Up"]},
  {id:"driftfin",name:"Driftfin",type:"TIDE",region:"tideglass",rarity:"Common",shape:"fish",color:"#78B9C8",accent:"#D9F1E9",hp:35,atk:12,def:10,spd:18,learn:["Bubble Pop","Fin Flick"]},
  {id:"petalyn",name:"Petalyn",type:"LEAF",region:"sunmeadow",rarity:"Uncommon",shape:"deer",color:"#B7B978",accent:"#F0D5A5",hp:44,atk:14,def:13,spd:17,learn:["Petal Pulse","Root Hug"]},
  {id:"shellip",name:"Shellip",type:"TIDE",region:"tideglass",rarity:"Common",shape:"turtle",color:"#73AFA6",accent:"#D7D9B1",hp:52,atk:10,def:21,spd:6,learn:["Shell Bash","Mist Veil"]},
  {id:"coralisk",name:"Coralisk",type:"TIDE",region:"tideglass",rarity:"Rare",shape:"lizard",color:"#E58D83",accent:"#F6C4A8",hp:48,atk:18,def:13,spd:15,learn:["Tidal Bloom","Fin Flick"]},
  {id:"marinaut",name:"Marinaut",type:"TIDE",region:"tideglass",rarity:"Rare",shape:"seal",color:"#81B7C6",accent:"#EAF4E7",hp:62,atk:17,def:19,spd:12,learn:["Mist Veil","Tidal Bloom"]},
  {id:"voltkit",name:"Voltkit",type:"VOLT",region:"tideglass",rarity:"Uncommon",shape:"fox",color:"#E6C35F",accent:"#FFF0B0",hp:39,atk:18,def:9,spd:20,learn:["Sparkle Zap","Quick Hop"]},
  {id:"embermole",name:"Embermole",type:"EMBER",region:"emberfall",rarity:"Common",shape:"mole",color:"#C77D61",accent:"#F4C18B",hp:44,atk:16,def:13,spd:9,learn:["Cinder Puff","Tunnel Dash"]},
  {id:"slagoon",name:"Slagoon",type:"EMBER",region:"emberfall",rarity:"Uncommon",shape:"salamander",color:"#D97855",accent:"#F6C078",hp:54,atk:19,def:14,spd:13,learn:["Wildfire Rush","Cinder Puff"]},
  {id:"flarehart",name:"Flarehart",type:"EMBER",region:"emberfall",rarity:"Rare",shape:"deer",color:"#D66D4F",accent:"#FFD28B",hp:61,atk:23,def:15,spd:18,learn:["Wildfire Rush","Petal Pulse"]},
  {id:"ashwing",name:"Ashwing",type:"EMBER",region:"emberfall",rarity:"Rare",shape:"bird",color:"#A96F61",accent:"#F2C28A",hp:45,atk:20,def:11,spd:23,learn:["Cinder Puff","Wingbeat"]},
  {id:"frostbit",name:"Frostbit",type:"FROST",region:"frostveil",rarity:"Common",shape:"fox",color:"#A7C8D9",accent:"#F0FAF6",hp:39,atk:13,def:13,spd:16,learn:["Snowball","Mist Veil"]},
  {id:"crystail",name:"Crystail",type:"FROST",region:"frostveil",rarity:"Uncommon",shape:"fox",color:"#91B9D1",accent:"#E8F5F8",hp:52,atk:18,def:17,spd:19,learn:["Snowball","Crystal Gleam"]},
  {id:"puffern",name:"Puffern",type:"FROST",region:"frostveil",rarity:"Common",shape:"bird",color:"#D1DCE0",accent:"#FFFFFF",hp:35,atk:12,def:11,spd:18,learn:["Snowball","Wingbeat"]},
  {id:"glacibear",name:"Glacibear",type:"FROST",region:"frostveil",rarity:"Rare",shape:"bear",color:"#8EAFC1",accent:"#E5F2F5",hp:74,atk:21,def:23,spd:7,learn:["Crystal Gleam","Stone Roll"]},
  {id:"moonmew",name:"Moonmew",type:"SHADE",region:"whisperwood",rarity:"Rare",shape:"cat",color:"#9388B7",accent:"#E3D6F0",hp:41,atk:20,def:10,spd:22,learn:["Dusk Pounce","Mind Spark"]},
  {id:"noctowl",name:"Noctowl",type:"SHADE",region:"frostveil",rarity:"Uncommon",shape:"owl",color:"#756B92",accent:"#D6C9E5",hp:48,atk:16,def:15,spd:13,learn:["Dusk Pounce","Wingbeat"]},
  {id:"dreamlet",name:"Dreamlet",type:"MIND",region:"whisperwood",rarity:"Uncommon",shape:"float",color:"#D49BAF",accent:"#F7D8E4",hp:43,atk:17,def:12,spd:18,learn:["Mind Spark","Lullaby"]},
  {id:"starling",name:"Starling",type:"MIND",region:"frostveil",rarity:"Rare",shape:"moth",color:"#C3A9D4",accent:"#F8E4F0",hp:46,atk:21,def:12,spd:20,learn:["Crystal Gleam","Mind Spark"]},
  {id:"hollowisp",name:"Hollowisp",type:"SHADE",region:"emberfall",rarity:"Rare",shape:"wisp",color:"#8279A4",accent:"#D8C4E8",hp:40,atk:22,def:9,spd:24,learn:["Dusk Pounce","Cinder Puff"]},
  {id:"sunmoth",name:"Sunmoth",type:"VOLT",region:"sunmeadow",rarity:"Uncommon",shape:"moth",color:"#E9C76B",accent:"#FFF2B9",hp:37,atk:15,def:10,spd:22,learn:["Sparkle Zap","Petal Pulse"]},
  {id:"mireling",name:"Mireling",type:"TIDE",region:"whisperwood",rarity:"Uncommon",shape:"frog",color:"#79A99A",accent:"#D2E1B4",hp:49,atk:14,def:15,spd:11,learn:["Bubble Pop","Root Hug"]},
  {id:"bramblet",name:"Bramblet",type:"LEAF",region:"emberfall",rarity:"Common",shape:"hedgehog",color:"#9B8F67",accent:"#E3C68D",hp:42,atk:16,def:14,spd:9,learn:["Bramble Burst","Seed Toss"]},
  {id:"skydoodle",name:"Skydoodle",type:"MIND",region:"sunmeadow",rarity:"Rare",shape:"bird",color:"#B8A6CE",accent:"#F2DCEB",hp:38,atk:16,def:10,spd:24,learn:["Mind Spark","Wingbeat"]}
  ,{id:"fernowl",name:"Fernowl",type:"LEAF",region:"whisperwood",rarity:"Uncommon",shape:"owl",color:"#6E9875",accent:"#CDE0AE",hp:48,atk:15,def:16,spd:13,learn:["Leaf Flick","Wingbeat","Bramble Burst"]}
  ,{id:"copperscale",name:"Copperscale",type:"VOLT",region:"emberfall",rarity:"Uncommon",shape:"lizard",color:"#C78E55",accent:"#F2D18A",hp:46,atk:19,def:13,spd:16,learn:["Sparkle Zap","Tunnel Dash"]}
  ,{id:"snowbell",name:"Snowbell",type:"FROST",region:"frostveil",rarity:"Uncommon",shape:"float",color:"#B8D3DF",accent:"#F5FCFA",hp:45,atk:15,def:16,spd:17,learn:["Snowball","Lullaby"]}
  ,{id:"tidekip",name:"Tidekip",type:"TIDE",region:"tideglass",rarity:"Common",shape:"frog",color:"#73B7B8",accent:"#D7EAC8",hp:42,atk:13,def:14,spd:14,learn:["Bubble Pop","Quick Hop"]}
  ,{id:"duskram",name:"Duskram",type:"SHADE",region:"whisperwood",rarity:"Rare",shape:"bear",color:"#80749B",accent:"#D9CBE4",hp:70,atk:22,def:20,spd:8,learn:["Dusk Pounce","Stone Roll","Mind Spark"]}

];

export const MOVES = {
  "Leaf Flick":{power:11,type:"LEAF",description:"A quick flick of bright leaves."},
  "Root Hug":{power:9,type:"GROVE",description:"Roots wrap around the target."},
  "Bramble Burst":{power:15,type:"LEAF",description:"A burst of prickly vines."},
  "Spark Paw":{power:13,type:"EMBER",description:"A warm, fiery paw strike."},
  "Cinder Puff":{power:10,type:"EMBER",description:"A puff of glowing embers."},
  "Wildfire Rush":{power:18,type:"EMBER",description:"A blazing charge."},
  "Bubble Pop":{power:10,type:"TIDE",description:"A popping water bubble."},
  "Mist Veil":{power:8,type:"TIDE",description:"A cool misty splash."},
  "Tidal Bloom":{power:16,type:"TIDE",description:"A blooming wave of water."},
  "Seed Toss":{power:10,type:"GROVE",description:"A handful of hard seeds."},
  "Quick Hop":{power:12,type:"GROVE",description:"A quick bouncing strike."},
  "Thicket Spin":{power:16,type:"LEAF",description:"A spinning ring of leaves."},
  "Sparkle Zap":{power:14,type:"VOLT",description:"A bright electric snap."},
  "Wingbeat":{power:11,type:"MIND",description:"A swift gust of air."},
  "Curl Up":{power:7,type:"GROVE",description:"A defensive curl and bump."},
  "Pebble Bonk":{power:13,type:"GROVE",description:"A chunky stone strike."},
  "Stone Roll":{power:18,type:"GROVE",description:"A rolling stone attack."},
  "Fin Flick":{power:12,type:"TIDE",description:"A sharp flick of the fin."},
  "Petal Pulse":{power:13,type:"LEAF",description:"A wave of soft petals."},
  "Shell Bash":{power:14,type:"TIDE",description:"A sturdy shell-first bump."},
  "Tunnel Dash":{power:14,type:"EMBER",description:"A fast underground dash."},
  "Snowball":{power:12,type:"FROST",description:"A compact ball of snow."},
  "Crystal Gleam":{power:17,type:"FROST",description:"A shimmering crystal flash."},
  "Dusk Pounce":{power:16,type:"SHADE",description:"A shadowy pounce."},
  "Mind Spark":{power:15,type:"MIND",description:"A little burst of thought."},
  "Lullaby":{power:8,type:"MIND",description:"A gentle but distracting tune."}
};
