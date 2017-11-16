import { SixersLogo, BucksLogo, BullsLogo, CavaliersLogo, CelticsLogo,
	ClippersLogo, GrizzliesLogo, HawksLogo, HeatLogo, HornetsLogo,
	JazzLogo, KingsLogo, KnicksLogo, LakersLogo, MagicLogo, MavericksLogo,
	NetsLogo, NuggetsLogo, PelicansLogo, PacersLogo, PistonsLogo,
	RaptorsLogo, RocketsLogo, SpursLogo, SunsLogo, ThunderLogo,
	TimberwolvesLogo, TrailblazersLogo, WarriorsLogo, WizardsLogo }
	from '../../resources/images/team_svg_logos';
import React, { Component }  from 'react';

var SixerLogo = require("../../resources/images/team_logos/76ers.jpg");
var BuckLogo = require("../../resources/images/team_logos/bucks.jpg");
var BullLogo = require("../../resources/images/team_logos/bulls.jpg");
var CavalierLogo = require("../../resources/images/team_logos/cavaliers.jpg");
var CelticLogo = require("../../resources/images/team_logos/celtics.jpg");
var ClipperLogo = require("../../resources/images/team_logos/clippers.jpg");
var GrizzlieLogo = require("../../resources/images/team_logos/grizzlies.jpg");
var HawkLogo = require("../../resources/images/team_logos/hawks.jpg");
var HeaLogo = require("../../resources/images/team_logos/heat.jpg");
var HornetLogo = require("../../resources/images/team_logos/hornets.jpg");
var JazLogo = require("../../resources/images/team_logos/jazz.jpg");
var KingLogo = require("../../resources/images/team_logos/kings.jpg");
var KnickLogo = require("../../resources/images/team_logos/knicks.jpg");
var LakerLogo = require("../../resources/images/team_logos/lakers.jpg");
var MagiLogo = require("../../resources/images/team_logos/magic.jpg");
var MaverickLogo = require("../../resources/images/team_logos/mavericks.jpg");
var NetLogo = require("../../resources/images/team_logos/nets.jpg");
var NuggetLogo = require("../../resources/images/team_logos/nuggets.jpg");
var PelicanLogo = require("../../resources/images/team_logos/pelicans.jpg");
var PacerLogo = require("../../resources/images/team_logos/pacers.jpg");
var PistonLogo = require("../../resources/images/team_logos/pistons.jpg");
var RaptorLogo = require("../../resources/images/team_logos/raptors.jpg");
var RocketLogo = require("../../resources/images/team_logos/rockets.jpg");
var SpurLogo = require("../../resources/images/team_logos/spurs.jpg");
var SunLogo = require("../../resources/images/team_logos/suns.jpg");
var ThundeLogo = require("../../resources/images/team_logos/thunder.jpg");
var TimberwolveLogo = require("../../resources/images/team_logos/timberwolves.jpg");
var TrailblazerLogo = require("../../resources/images/team_logos/trailblazers.jpg");
var WarriorLogo = require("../../resources/images/team_logos/warriors.jpg");
var WizardLogo = require("../../resources/images/team_logos/wizards.jpg");

const logos = {
	Sixers: SixerLogo,
	Bucks: BuckLogo,
	Bulls: BullLogo,
	Cavaliers: CavalierLogo,
	Celtics: CelticLogo,
	Clippers: ClipperLogo,
	Grizzlies: GrizzlieLogo,
	Hawks: HawkLogo,
	Heat: HeaLogo,
	Hornets: HornetLogo,
	Jazz: JazLogo,
	Kings: KingLogo,
	Knicks: KnickLogo,
	Lakers: LakerLogo,
	Magic: MagiLogo,
	Mavericks: MaverickLogo,
	Nets: NetLogo,
	Nuggets: NuggetLogo,
	Pelicans: PelicanLogo,
	Pacers: PacerLogo,
	Pistons: PistonLogo,
	Raptors: RaptorLogo,
	Rockets: RocketLogo,
	Spurs: SpurLogo,
	Suns: SunLogo,
	Thunder: ThundeLogo,
	Timberwolves: TimberwolveLogo,
	Trailblazers: TrailblazerLogo,
	Warriors: WarriorLogo,
	Wizards: WizardLogo
};


const svgLogos = {
	Sixers: <SixersLogo />,
	Bucks: <BucksLogo />,
	Bulls: <BullsLogo/>,
	Cavaliers: <CavaliersLogo />,
	Celtics: <CelticsLogo />,
	Clippers: <ClippersLogo />,
	Grizzlies: <GrizzliesLogo />,
	Hawks: <HawksLogo />,
	Heat: <HeatLogo />,
	Hornets: <HornetsLogo />,
	Jazz: <JazzLogo />,
	Kings: <KingsLogo />,
	Knicks: <KnicksLogo />,
	Lakers: <LakersLogo />,
	Magic: <MagicLogo />,
	Mavericks: <MavericksLogo />,
	Nets: <NetsLogo />,
	Nuggets: <NuggetsLogo />,
	Pelicans: <PelicansLogo />,
	Pacers: <PacersLogo />,
	Pistons: <PistonsLogo />,
	Raptors: <RaptorsLogo />,
	Rockets: <RocketsLogo />,
	Spurs: <SpursLogo />,
	Suns: <SunsLogo />,
	Thunder: <ThunderLogo />,
	Timberwolves: <TimberwolvesLogo />,
	Trailblazers: <TrailblazersLogo />,
	Warriors: <WarriorsLogo />,
	Wizards: <WizardsLogo />
};

export function getLogo(teamName) {
  return logos[teamName];
}

export function getSVGLogo(teamName) {
  return svgLogos[teamName];
}
