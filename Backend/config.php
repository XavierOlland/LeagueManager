<?php
//This code allows use of phpBB identification and the link between the manager and the forum.
//Utilisation de l'authentification phpBB, lien entre le manager et le forum
define('IN_PHPBB', true);
$phpbb_root_path = (defined('PHPBB_ROOT_PATH')) ? PHPBB_ROOT_PATH : './Forum/';


$phpEx = substr(strrchr(__FILE__, '.'), 1);

include($phpbb_root_path . 'common.' . $phpEx);
include($phpbb_root_path . 'includes/functions_display.' . $phpEx);
include($phpbb_root_path . 'config.' . $phpEx);

//Create the mandatory variables / Création des variables nécessaires
$user->session_begin();
$auth->acl($user->data);
$user->setup();


//MySQL connection / Connexion MySQL
$con = mysqli_connect($dbhost,$dbuser,$dbpasswd,$dbname);
if (!$con) { die('Could not connect: ' . mysqli_error()); }
mysqli_set_charset($con,'utf8');
$coach = $con->query("SELECT id, gold FROM site_coachs WHERE user_id=".$user->data['user_id']);
$coach = $coach->fetch_assoc();

$Cyanide_Key = 'b20b49cf35dce68418a4c375bf4e3cd3';
$Cyanide_League = 'BBBL';
?>
