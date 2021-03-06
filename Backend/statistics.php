<?php
/**
 * Get the leaders in an area of the game
 * @param $con la connexion à la BDD
 */

function league($con){

    $sql_leagueStats = "SELECT SUM(sustainedcasualties) AS casualties, SUM(sustaineddead) AS death, SUM(inflictedtouchdowns) AS TD FROM site_players_stats";
    $res_leagueStats = $con->query($sql_leagueStats);
    $leagueStats = $res_leagueStats->fetch_object();

    $sql_coachs = "SELECT COUNT(*) FROM site_coachs WHERE active=1";
    $res_coachs = $con->query($sql_coachs);
    $coachs = $res_coachs->fetch_row();
    $leagueStats->coachs = $coachs[0];

    $sql_matches = "SELECT COUNT(*) FROM site_matchs WHERE started IS NOT NULL";
    $res_matches = $con->query($sql_matches);
    $matches = $res_matches->fetch_row();
    $leagueStats->matches = $matches[0];

    //Leaderboards
    $competitions = [];
    $sql_competitions =  'SELECT id FROM site_competitions WHERE active=1';
    $res_competitions = $con->query($sql_competitions);
    while($data = $res_competitions->fetch_assoc()){
      array_push($competitions, $data[id]);
    }
    $leagueStats->playersStats = [];
    $stats = ['scorer','thrower','tackler','killer','intercepter','catcher','punchingball'];
    foreach($stats as $stat){
        array_push($leagueStats->playersStats, leaders($con,[$stat,$competitions,1]));
    }

    return $leagueStats;
}

/**
 * Get the leaders in an area of the game
 * @param $con la connexion à la BDD
 * @param $params les données à insérer
 */
function leaders($con, $params){

    $leaders = new stdClass();
    $leaders->type = $params[0];
    $leaders->players = [];

    switch ($params[0]){
        case "scorer":
            $leaders->stats = ['inflictedtouchdowns','inflictedmetersrunning','inflictedcatches'];
            break;
        case "thrower":
            $leaders->stats = ['inflictedmeterspassing','inflictedpasses'];
            break;
        case "tackler":
            $leaders->stats = ['inflictedinjuries','inflictedcasualties','inflicteddead'];
            break;
        case "killer":
            $leaders->stats = ['inflicteddead'];
            break;
        case "intercepter":
            $leaders->stats = ['inflictedinterceptions'];
            break;
        case "punchingball":
            $leaders->stats = ['sustainedinjuries'];
            break;
        case "catcher":
            $leaders->stats = ['inflictedcatches'];
            break;
    }

    //Prepare fields and Order by for the query
    $fields = "";
    $orderBy = " ORDER BY";
    foreach( $leaders->stats as $key=>$stat ){
        $fields = $fields.', SUM(s.'.$stat.') AS stat'.$key;
        if($orderBy == " ORDER BY" ){
            $orderBy = $orderBy.' SUM(s.'.$stat.') DESC';
        }
        else{
            $orderBy = $orderBy.', SUM(s.'.$stat.') DESC';
        }
    }
    //Manage competition filter
    if($params[2]){
        $where = " AND s.match_id IN (SELECT id FROM site_matchs WHERE competition_id IN (".implode(",",$params[1])."))";
    }
    else{
        $where = " AND s.match_id IN (SELECT id FROM site_matchs WHERE competition_id IN (".$params[1]."))";
    }

    $sqlPlayers = "SELECT p.id as player, p.name, t.id AS team_id, t.name AS team, t.logo".$fields."
        FROM site_players_stats AS s
        INNER JOIN site_players AS p ON p.id=s.player_id
        LEFT JOIN site_teams AS t ON t.id=p.team_id
        WHERE s.".$leaders->stats[0].">0".$where."
        GROUP BY p.id".$orderBy;
    $resultPlayers = $con->query($sqlPlayers);
    while($dataPlayers = mysqli_fetch_array($resultPlayers,MYSQLI_ASSOC)) {
        array_push($leaders->players, $dataPlayers);
    }

    return $leaders;

}

?>
