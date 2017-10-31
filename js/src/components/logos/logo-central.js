var SixersLogo = require("../../resources/images/team_logos/76ers.jpg");
var BucksLogo = require("../../resources/images/team_logos/bucks.jpg");
var BullsLogo = require("../../resources/images/team_logos/bulls.jpg");
var CavaliersLogo = require("../../resources/images/team_logos/cavaliers.jpg");
var CelticsLogo = require("../../resources/images/team_logos/celtics.jpg");
var ClippersLogo = require("../../resources/images/team_logos/clippers.jpg");
var GrizzliesLogo = require("../../resources/images/team_logos/grizzlies.jpg");
var HawksLogo = require("../../resources/images/team_logos/hawks.jpg");
var HeatLogo = require("../../resources/images/team_logos/heat.jpg");
var HornetsLogo = require("../../resources/images/team_logos/hornets.jpg");
var JazzLogo = require("../../resources/images/team_logos/jazz.jpg");
var KingsLogo = require("../../resources/images/team_logos/kings.jpg");
var KnicksLogo = require("../../resources/images/team_logos/knicks.jpg");
var LakersLogo = require("../../resources/images/team_logos/lakers.jpg");
var MagicLogo = require("../../resources/images/team_logos/magic.jpg");
var MavericksLogo = require("../../resources/images/team_logos/mavericks.jpg");
var NetsLogo = require("../../resources/images/team_logos/nets.jpg");
var NuggetsLogo = require("../../resources/images/team_logos/nuggets.jpg");
var PelicansLogo = require("../../resources/images/team_logos/pelicans.jpg");
var PacersLogo = require("../../resources/images/team_logos/pacers.jpg");
var PistonsLogo = require("../../resources/images/team_logos/pistons.jpg");
var RaptorsLogo = require("../../resources/images/team_logos/raptors.jpg");
var RocketsLogo = require("../../resources/images/team_logos/rockets.jpg");
var SpursLogo = require("../../resources/images/team_logos/spurs.jpg");
var SunsLogo = require("../../resources/images/team_logos/suns.jpg");
var ThunderLogo = require("../../resources/images/team_logos/thunder.jpg");
var TimberwolvesLogo = require("../../resources/images/team_logos/timberwolves.jpg");
var TrailblazersLogo = require("../../resources/images/team_logos/trailblazers.jpg");
var WarriorsLogo = require("../../resources/images/team_logos/warriors.jpg");
var WizardsLogo = require("../../resources/images/team_logos/wizards.jpg");

const logos = {
	Sixers: SixersLogo,
	Bucks: BucksLogo,
	Bulls: BullsLogo,
	Cavaliers: CavaliersLogo,
	Celtics: CelticsLogo,
	Clippers: ClippersLogo,
	Grizzlies: GrizzliesLogo,
	Hawks: HawksLogo,
	Heat: HeatLogo,
	Hornets: HornetsLogo,
	Jazz: JazzLogo,
	Kings: KingsLogo,
	Knicks: KnicksLogo,
	Lakers: LakersLogo,
	Magic: MagicLogo,
	Mavericks: MavericksLogo,
	Nets: NetsLogo,
	Nuggets: NuggetsLogo,
	Pelicans: PelicansLogo,
	Pacers: PacersLogo,
	Pistons: PistonsLogo,
	Raptors: RaptorsLogo,
	Rockets: RocketsLogo,
	Spurs: SpursLogo,
	Suns: SunsLogo,
	Thunder: ThunderLogo,
	Timberwolves: TimberwolvesLogo,
	Trailblazers: TrailblazersLogo,
	Warriors: WarriorsLogo,
	Wizards: WizardsLogo
};

export function getLogo(teamName) {
  return logos[teamName];
}
