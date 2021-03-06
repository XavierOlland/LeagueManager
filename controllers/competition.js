LeagueManager.directive('competition', function() {
	return {
		restrict: 'E',
		templateUrl: 'views/competition.html',

		controller: function($scope, $rootScope, $http, $timeout, $routeParams) {
			$scope.competition = {};
			$scope.bet; //Match courant sur lequel on fait les pronos
			$scope.showBets = false; //gere l'affichage de la fenetre des pronos
			$scope.errorBets = false; //gere l'affichage du message d'erreur
			$scope.errorMessage = ""; //Message d'erreur

			$rootScope.setColours([$rootScope.colourA, $rootScope.colourB, '#F7FB03']);
			$rootScope.competitionId = $routeParams.ID;
			$rootScope.orderFilter = 'round';
			$rootScope.reverse = true;
			$scope.saving = true;

			$scope.showNextDays = function(i) {
				$scope.displayDay = 0;
			};

			$scope.competitionTest = function() {
				var test = {
					"id": $routeParams.ID
				};
				$http
					.post('backend/routes.php?action=test', test)
					.success(function(competition) {
						console.log(competition);
					});
			};

			$scope.competitionFetch = function() {
				$scope.competition = {
					"id": $routeParams.ID
				};
				$http
					.post('backend/routes.php?action=competition', $scope.competition)
					.success(function(competition) {
						$scope.competition = competition;

						$rootScope.title = $scope.competition.site_name;
						if ($scope.competition.format == 'Sponsors') {
							$scope.sponsorsCalendarUpdate(competition)
						} else {
							$scope.calendarUpdate(competition);
						}
					});
			};
			$scope.calendarUpdate = function(competition) {
				$http
					.post('backend/routes.php?action=competitionCalendar', [competition.id])
					.success(function(result) {
						$scope.calendar = result;
						if (competition.competition_mode == 'Coupe') {
							$scope.finals = $rootScope.finalsTemplate;
							$scope.finals.splice($scope.calendar.length);
							$scope.finals.reverse();
						};
						//Si la saison est finie ou fait moins de 6 journées on affiche la totalité du calendrier
						$scope.currentDay = $scope.calendar[0].currentDay;
						if ($scope.calendar.length < 6 || !$scope.currentDay) {
							$scope.displayDay = 0;
						} else {
							$scope.displayDay = $scope.currentDay;
						};

						$scope.matchesToSave = [];
						if ($scope.competition.format != 'ladder') {
							for (i = 0; $scope.calendar.length > i; i++) {
								var matchs = $scope.calendar[i].matchs;
								for (j = 0; matchs.length > j; j++) {
									if (matchs[j].cyanide_id == null) {
										$scope.matchesToSave.push(matchs[j].contest_id)
									}
								}
							};
						}
						$scope.saving = false;
					});
			};

			$scope.sponsorsCalendarUpdate = function(competition) {
				$http
					.post('backend/routes.php?action=sponsorsCalendar', [competition.id])
					.success(function(calendar) {
						$scope.calendar = calendar;

					});
			};


			$scope.competitionFetch();

			//Check si pronos déjà fait sur un match donné par le user connecté
			$scope.betsAlreadyDone = function(match) {
				for ($v in match.bets) {
					if (match.bets[$v]["coach_id"] == $rootScope.coach_id)
						return true;
				}
				return false;
			}

			//Check si Match joué ou non et renvoi vers la bonne fonctionnalité
			$scope.ifClicked = function(match) {
				if (match.cyanide_id) {
					$scope.goToPage('match/' + match.id)
				} else if ($rootScope.external != 1) {
					if (($rootScope.coach_id == match.coach_id_1 || $rootScope.coach_id == match.coach_id_2) && match.started == null) {
						$scope.match = match;
						$scope.showMatchDate = true;
					} else {
						$scope.odds(match);
						$scope.doBets(match);
					}
				}
			};
			$scope.rightClicked = function(match) {

				if (($rootScope.coach_id == match.coach_id_1 || $rootScope.coach_id == match.coach_id_2 || $rootScope.admin == 1) && match.cyanide_id == null) {
					$scope.match = match;
					$scope.showMatchDate = true;
				}
			};

			//Mise à jour de la competition
			$scope.competitionUpdate = function(league, competition_name) {
				$scope.saving = true;
				var params = [window.Cyanide_Key, window.Cyanide_League, competition_name, $scope.competition.id, $scope.matchesToSave, $scope.competition.format, $scope.currentDay];

				$http.post('backend/routes.php?action=competitionUpdate', params)
					.then(function(result) {
						$scope.calendarUpdate($scope.competition);
					});
			};

			//Mise à jour de date
			$scope.matchDate = function(match) {
				$http.post('backend/routes.php?action=matchDate', match)
					.then(function(result) {
						$scope.veilOff();
					});
			};





			//Affichage stats des pronos
			$scope.ratio = function(match) {
				$res = "";
				$a = 0;
				$b = 0;
				$e = 0;
				for ($v in match.bets) {
					$s1 = Number(match.bets[$v]["team_score_1"]);
					$s2 = Number(match.bets[$v]["team_score_2"]);
					if ($s1 == $s2)
						$e++;
					else if ($s1 > $s2)
						$a++;
					else
						$b++
				}
				$total = $a + $b + $e;
				$odds_1 = ($a > 0) ? (1 / ($a / $total))
					.toFixed(2) : 0;
				$odds_2 = ($b > 0) ? (1 / ($b / $total))
					.toFixed(2) : 0;
				$odds_e = ($e > 0) ? (1 / ($e / $total))
					.toFixed(2) : 0;
				$res = "<div><span>1</span>" + $odds_1 + "</div><div><span>X</span>" + $odds_e + "</div><div><span>2</span>" + $odds_2 + "</div>";
				return $res;
			};
			$scope.odds = function(match) {
				$res = "";
				$a = 0;
				$b = 0;
				$e = 0;
				for ($v in match.bets) {
					$s1 = Number(match.bets[$v]["team_score_1"]);
					$s2 = Number(match.bets[$v]["team_score_2"]);
					if ($s1 == $s2) {
						$e++;
					} else if ($s1 > $s2) {
						$a++;
					} else {
						$b++
					}
				}
				$total = $a + $b + $e;
				$scope.odds_1 = ($a > 0) ? (1 / ($a / $total))
					.toFixed(2) : 0;
				$scope.odds_2 = ($b > 0) ? (1 / ($b / $total))
					.toFixed(2) : 0;
				$scope.odds_e = ($e > 0) ? (1 / ($e / $total))
					.toFixed(2) : 0;
			};

			//Ensemble de fonctions pour gerer la couleur d'affichage des pronos
			$scope.sup = function(bets) {
				return bets.team_score_1 > bets.team_score_2;
			}
			$scope.nul = function(bets) {
				return bets.team_score_1 == bets.team_score_2;
			}
			$scope.inf = function(bets) {
				return bets.team_score_1 < bets.team_score_2;
			}
			$scope.isMe = function(bets) {
				return bets.coach_id == $rootScope.coach_id;
			}

			//ouvre la fenetre de pronostics en fixant le match
			$scope.doBets = function(match) {
				$scope.bet1 = 0;
				$scope.bet2 = 0;
				$scope.stake = 10;
				$scope.bet = match;
				for ($v in $scope.bet.bets) {
					if ($scope.bet.bets[$v]["coach_id"] == $rootScope.coach_id) {
						//modif en live
						$scope.bet1 = $scope.bet.bets[$v]["team_score_1"];
						$scope.bet2 = $scope.bet.bets[$v]["team_score_2"];
						$scope.stake = $scope.bet.bets[$v]["stake"];
					}
				}
				$scope.showBets = true;
			};

			//ferme la fenetre de pronostics
			$scope.veilOff = function() {
				$scope.showMatchDate = false;
				$scope.showBets = false;
				$scope.errorBets = false;
			};

			//Gestion des Pronos
			$scope.BetsDone = function(bets1, bets2, stake) {

				//Test des données récuperées
				if (!stake) {
					$scope.errorMessage = "Vous avez des origines orques?";
					$scope.errorBets = true;
				} else if (stake > $rootScope.coach_gold) {
					$scope.errorMessage = "Votre comptable vous a menti...";
					$scope.errorBets = true;
				} else {
					$scope.errorBets = false;
					$newBets = true;

					//On cherche si le prono a déjà était fait
					//Si oui MAJ
					//A transformer en While (ca c'est moche mais je connais la syntaxe)
					for ($v in $scope.bet.bets) {
						if ($scope.bet.bets[$v]["coach_id"] == $rootScope.coach_id) {
							$newBets = false;
							//modif en live
							$scope.bet.bets[$v]["team_score_1"] = bets1;
							$scope.bet.bets[$v]["team_score_2"] = bets2;
							$scope.bet.bets[$v]["stake"] = stake;

							var prognos = {
								"coach_id": $rootScope.coach_id,
								"bets_1": bets1,
								"bets_2": bets2,
								"stake": stake,
								"match_id": $scope.bet.id
							};
							//MAJ en base
							$http.post('backend/update/routes.php?action=betUpdate', prognos)
								.then(function(result) {
									$rootScope.coach_gold -= result.data;
								});
						}
					}
					//Si non Ajout d'un bets
					if ($newBets) {
						//Modif en live
						$tmp = []; //TODO AJSUTEMENT d'AFFICHAGE
						$tmp["coach_id"] = $rootScope.coach_id;
						$tmp["team_score_1"] = bets1;
						$tmp["team_score_2"] = bets2;
						$tmp["stake"] = stake;
						$scope.bet.bets.push($tmp);
						//Ajout en base
						var prognos = {
							"coach_id": $rootScope.coach_id,
							"bets_1": bets1,
							"bets_2": bets2,
							"stake": stake,
							"match_id": $scope.bet.id
						};
						$http.post('backend/update/routes.php?action=betAdd', prognos)
							.then(function(result) {
								$rootScope.coach_gold -= result.data;
							});
					}
					//Fermeture de la fenetre de bets
					$scope.showBets = false;
				}
			};

			$scope.betInc = function(bet) {
				if ($scope[bet] < 9) {
					$scope[bet]++;
				}
			};

			$scope.betDec = function(bet) {
				if ($scope[bet] > 0) {
					$scope[bet]--;
				}
			};

		}
	}
});