<!DOCTYPE html>

<html  ng-app="LeagueManager">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta name="format-detection" content="telephone=no" />
  <meta http-equiv="Cache-control" content="private, max-age=864000" />

  <title>Blood Bowl Baston League</title>
  <meta name="description" content="Ligue francophone de Blood Bowl">
  <meta name="robots" content="index,follow" />

  <link rel="stylesheet" href="bower_components/bootstrap/dist/css/bootstrap.min.css" type="text/css">
  <link rel="stylesheet" href="css/app.css" type="text/css">
  <link href='https://fonts.googleapis.com/css?family=Muli' rel='stylesheet' type='text/css'>

</head>
<body>
  <header>
    <div id="Intro" class="hd-100 x-center y-center">la Blood Bowl Baston League pr&eacute;sente</div>
    <nav class="navbar">
      <div id="Logo" class="logo" ng-click="goToPage('/')"></div>
      <h1 class="navbar-brand inline text-cutter">{{title}}</h1>
      <ul class="nav navbar-nav  inline collapse navbar-toggleable-md pull-xs-right" id="Menu">
        <li><a class="nav" href="Forum">Forum</a></li>
        <li class="hidden-sm-down"><a class="nav" href="steam://run/236690">Jouer</a></li>
        <li class="hidden-sm-down"><a class="nav" href="razercomms://">Vocal</a></li>
        <li ng-click="displayConnector()"><a class="nav">Connexion</a></li>
      </ul>
      <div class="navbar-toggler hidden-lg-up pull-right zelda" type="button" data-toggle="collapse" data-target="#Menu">&#9776;</div>
    </nav>
  </header>



  <div id="Main" class="container-fluid" ng-class="{ blur : reader }">
    <ng-view></ng-view>
    <!-- Articles plein écran -->
    <modal></modal>


  </div>

  <!-- jquery -->
  <script src="bower_components/jquery/dist/jquery.min.js"></script>
  <!-- Bootstrap -->
  <script src="bower_components/bootstrap/dist/js/bootstrap.min.js"></script>
  <!-- Angular -->
  <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.4.9/angular.min.js"></script>
  <!--<script src="bower_components/angular/angular.min.js"></script>-->
  <script src="bower_components/restangular/dist/restangular.min.js"></script>
  <script src="bower_components/angular-route/angular-route.min.js"></script>
  <script src="bower_components/lodash/lodash.min.js"></script>
  <script src="bower_components/angular-sanitize/angular-sanitize.min.js"></script>
  <script src="bower_components/angular-css/angular-css.min.js"></script>

  <!-- Module BBBL -->
  <script src="controllers/app.js"></script>
  <script src="controllers/main.js"></script>
  <script src="controllers/league.js"></script>
  <script src="controllers/competition.js"></script>
  <script src="controllers/match.js"></script>
  <script src="controllers/team.js"></script>
  <script src="controllers/modal.js"></script>

</body>
</html>
