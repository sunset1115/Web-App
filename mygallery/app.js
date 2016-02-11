angular.module('img-gallery', [])
	.controller('MainController',
		['$scope', '$http',
			function ($scope, $http) {
				var fpathArr = [];
				var curIndex = 0;
				var image_obj = [];

				/*  get file lists from local file(image-list.txt)
				*/
				function getFileList() {
					$http.get('image-list.txt')
						.success(function(result) {
							var fileList = result.split(";");
							fpathArr = [];
							image_obj = [];
							fileList.forEach(function(list) {
								var fname = list.trim();
								fpathArr.push(fname);
								image_obj.push({fname: fname, image_path: "img/" + fname});
							});
							console.log(image_obj);
							$scope.imgs = image_obj;
							setTimeout(function() {
								$scope.$apply();
							})
						})
					.error(function(){
						console.warn('An error occurred whilst loading the file', arguments);
					});

				}

				getFileList();

				// show the image selected in grid				
				$scope.showImage = function(fileName) {
					curIndex = fpathArr.indexOf(fileName);
					$scope.modalTitle = fileName;
					$scope.showmodal = true;
					$scope.selImagUrl = "img/" + fileName;
					angular.element(document.querySelector("#mymodal")).removeClass("modal-hide").addClass("modal-show");
					setTimeout( function() {$scope.$apply();}, 50);
					console.log($scope.showmodal);
				};

				//show the previous image
				$scope.prevImage = function() {
					curIndex--;
					if(curIndex < 0) curIndex = 0;
					var img_obj = image_obj[curIndex];
					$scope.selImagUrl = img_obj.image_path;
					setTimeout(function() {$scope.$apply();}, 50);
				}

				//show the next image
				$scope.nextImage = function() {
					curIndex++;
					if(curIndex >= fpathArr.length) curIndex = fpathArr.length - 1;
					var img_obj = image_obj[curIndex];
					$scope.selImagUrl = img_obj.image_path;
					setTimeout(function() {$scope.$apply();}, 50);
				}

				//close the dialog;
				$scope.cancel = function() {
					angular.element(document.querySelector("#mymodal")).removeClass("modal-show").addClass("modal-hide");
					setTimeout(function() {$scope.$apply();}, 50);
				}
			}
		]
	);



