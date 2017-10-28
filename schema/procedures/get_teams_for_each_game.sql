CREATE PROCEDURE `new_procedure` ()
BEGIN
SELECT t.team_name AS home_team, t.city AS home_city, s.team_name AS away_team, s.city AS away_team
FROM games g
	JOIN teams t ON (g.home_team_id = t.team_id) 
	JOIN teams s ON (g.away_team_id = s.team_id);
END
