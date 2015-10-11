var App = angular.module(
    'sc2hl',
    ['ngRoute', 'ngResource', 'ui.bootstrap', 'angularMoment', 'angular-loading-bar', 'ngAnimate', 'ngSanitize', 'analytics', 'ngFileUpload']
);

App.factory('configService', function() {
  return {
      api_url  : 'http://api.sc2hl.com',
      site_url : 'http://sc2hl.com'
  };
});

App.config(
	['$routeProvider', '$locationProvider',  function($routeProvider, $locationProvider) {
		$routeProvider
			.when('/', {
				templateUrl: 'views/homepage.html',
				controller: 'homepageController',
				metaTitle: 'Home',
				metaDescription: 'The SC2HL homepage',
				width: '1380',
			})
			.when('/highlight', {
				templateUrl: 'views/highlightList.html',
				controller: 'HighlightListController',
				metaTitle: 'Highlight List',
				metaDescription: 'A list of all the highlights on SC2HL',
				width: '1380',
			})
			.when('/random', {
				templateUrl: 'views/highlight.html',
				controller: 'randomHighlightController',
				metaTitle: 'Random highlight',
				metaDescription: 'Show a random highlight',
				width: '1380',
			})
			.when('/contest', {
				templateUrl: 'views/contest.html',
				controller: 'contestController',
				metaTitle: 'SC2HL Hype Contest',
				metaDescription: 'SC2HL Hype Contest',
				width: '1380',
			})		
			.when('/highlight/:id', {
				templateUrl: 'views/highlight.html',
				controller: 'highlightController',
				metaTitle: 'Highlight',
				metaDescription: 'SC2HL\'s highlights',
				width: '1380',
			})
			.when('/submitreplay', {
				templateUrl: 'views/submitReplay.html',
				controller: 'replayController',
				metaTitle: 'Submit Your Replay',
				metaDescription: 'Submit Your Replay',
				width: '1380',
			})
			.when('/search/:subject', {
				templateUrl: 'views/search.html',
				controller: 'searchController',
				metaTitle: 'Search',
				metaDescription: 'SC2HL\'s search page',
				width: '980',
			})
			.when('/aboutus', {
				templateUrl: '/views/aboutus.html',
				metaTitle: 'About Us',
				metaDescription: 'About the people behind SC2HL',
				width:'980'
			})
			.when('/blog/:blogId', {
				templateUrl: '/views/blog.html',
				controller: 'blogController',
				metaTitle: 'Blog Post',
				metaDescription: 'SC2HL\'s blog post page',
				width:'980'
			})
			.when('/404', {
				templateUrl: '/views/404.html',
				metaTitle: '404',
				metaDescription: 'Page not found',
				width:'980'
			})
			.otherwise({
				redirectTo: function () {
					return "/404";
				}
			});
		$locationProvider.html5Mode(true);
	}]
);

App.run(
	['$location', '$rootScope', function($location, $rootScope, $scope, analytics) {
		$rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
			$rootScope.metaTitle = current.$$route.metaTitle;
			$rootScope.metaDescription = current.$$route.metaDescription;
			$rootScope.pageWidth = current.$$route.width;
		});

		$rootScope.changePage = function(page) {
			$location.path(page);
		};
	}]
);

App.controller('userMenu', function($modal, $scope, $location) {
    $scope.openSuggestForm = function() {
        var modalInstance = $modal.open({
            templateUrl: 'views/modals/suggest.html',
            controller: 'modalSuggestForm',
            size: 'md'
        });
    };

    $scope.getClass = function(path) {
    	if ($location.path().substr(0, path.length) == path) {
    		if (path == '/' && $location.path() == '/') {
    			return 'active-item';
    		} 

    		else if (path == '/') {
    			return '';
    		}

    		else {
    			return 'active-item';
    		}
    	} 

    	else {
    		return '';
    	}
    }
});

App.controller('footerMenu', function($modal, $scope) {
    $scope.openContactForm = function() {
        var modalInstance = $modal.open({
            templateUrl: 'views/modals/contact.html',
            controller: 'modalContactForm',
            size: 'md'
        });
    };
});

App.filter('slice', function() {
	return function(array, start, end) {
		return array.slice(start, end);
	};
});

App.filter('moment', function() {
	return function(dateString, format) {
		return moment(dateString).format(format);
	};
});


App.directive('dirDisqus', ['$window', function($window) {
	return {
		restrict: 'E',
		scope: {
			disqus_shortname: '@disqusShortname',
			disqus_identifier: '@disqusIdentifier',
			disqus_title: '@disqusTitle',
			disqus_url: '@disqusUrl',
			disqus_category_id: '@disqusCategoryId',
			disqus_disable_mobile: '@disqusDisableMobile',
			readyToBind: "@"
		},
		template: '<div id="disqus_thread"></div><a href="http://disqus.com" class="dsq-brlink">comments powered by <span class="logo-disqus">Disqus</span></a>',
		link: function(scope) {

			// ensure that the disqus_identifier and disqus_url are both set, otherwise we will run in to identifier conflicts when using URLs with "#" in them
			// see http://help.disqus.com/customer/portal/articles/662547-why-are-the-same-comments-showing-up-on-multiple-pages-
			if (typeof scope.disqus_identifier === 'undefined' || typeof scope.disqus_url === 'undefined') {
				throw "Please ensure that the `disqus-identifier` and `disqus-url` attributes are both set.";
			}

			scope.$watch("readyToBind", function(isReady) {

				// If the directive has been called without the 'ready-to-bind' attribute, we
				// set the default to "true" so that Disqus will be loaded straight away.
				if ( !angular.isDefined( isReady ) ) {
					isReady = "true";
				}
				if (scope.$eval(isReady)) {
					// put the config variables into separate global vars so that the Disqus script can see them
					$window.disqus_shortname = scope.disqus_shortname;
					$window.disqus_identifier = scope.disqus_identifier;
					$window.disqus_title = scope.disqus_title;
					$window.disqus_url = scope.disqus_url;
					$window.disqus_category_id = scope.disqus_category_id;
					$window.disqus_disable_mobile = scope.disqus_disable_mobile;

					// get the remote Disqus script and insert it into the DOM, but only if it not already loaded (as that will cause warnings)
					if (!$window.DISQUS) {
						var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
						dsq.src = '//' + scope.disqus_shortname + '.disqus.com/embed.js';
						(document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
					} else {
						$window.DISQUS.reset({
							reload: true,
							config: function () {
								this.page.identifier = scope.disqus_identifier;
								this.page.url = scope.disqus_url;
								this.page.title = scope.disqus_title;
							}
						});
					}
				}
			});
		}
	};
}]);
