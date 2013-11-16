function backlogCtrl($scope, $log, $location, $filter, $window, $element, $route,  logEntries) {	
	    
	    $scope.data = {};
	    $scope.isCollapsed = {};
	    $scope.buttonText = 'Create';
	    $scope.query="";
	    
	    $scope.searchNotDone = function(item) {
	    	return  $scope.search(item, false);
	    };
	    $scope.searchDone = function(item) {
	    	return  $scope.search(item, true);
	    };
	    $scope.search = function(item,isDone) {
	    	if(item.done == isDone){
	    		if($scope.query == "") {
	    			return true;
	    		}
	    		if(item.importance == $scope.query){
	    			return true;
	    		}
	    		return false;
	    	}
	    	return false;
	    };
	    
	    $scope.styles = [{'bkcolor': '#D61828', 'color': 'white'},
	                     {'bkcolor': '#B018D6', 'color': 'white'},
	                     {'bkcolor': '#D6CE18', 'color': 'white'},
	                     {'bkcolor': '#36D618', 'color': 'white'}
	                     ];
		
	    function isDefined(x) {
	        var undefined;
	        return x !== undefined;
	    }
	    
		$scope.init = function(){
			$scope.isCollapsed = true;
			logEntries.query(function(res){
				$scope.data.entries = res;
				for(var idx in $scope.data.entries)
				{
					var item = $scope.data.entries[idx];
					if(!isDefined(item.done))
					{
						item.done = false;
						var id = item._id;
						item.$update({Id: id}, function(entry) {
				     	       if(!entry)
					    		   $log.log('Impossible to update bakclog entry');
						});
					}
				}
			});			
		};
	    
	    function create() {
	    	$scope.isCollapsed = true;
	    	var newEntry = new logEntries($scope.entry);
	    	newEntry.$create(function(entry) {
	    	   if(!entry)
	    		   $log.log('Impossible to create new backlog entry');
	    	   else{
	    		   $scope.data.entries.push(entry);
	    		   $scope.data.entries = $filter('orderBy')($scope.data.entries, 'importance');
	    	   }
	    	});
	    };
	    
	    function update(entry) {
	    	$scope.isCollapsed = true;
	    	var id = entry._id;
	    	entry.$update({Id: id},function(entry) {
     	       if(!entry)
	    		   $log.log('Impossible to update bakclog entry');
	       	});    	
	    };
	    
	    $scope.action = function(){
	    	if($scope.buttonText == 'Create')	    		
	    		create();
	    	else
	    		update($scope.entry);
	    };
	    
	    
	    $scope.cancel = function() {
	    	$scope.isCollapsed = true;
	    	$location.path('/home');
	    };
	    
	    $scope.remove = function(entry) {
	    	var id = entry._id;
	    	entry.$remove({Id: id}, function(entry) {
	    		for(idx in $scope.data.entries){
		    		if($scope.data.entries[idx] == entry) {
		    			$scope.data.entries.splice(idx, 1);
		    		}
		    	}	
	    	});	    	    	
	    };
	    
	    $scope.edit = function(entry, e) {
	    	if(e){
	    		e.preventDefault(); //pour empecher que le content soit développé
	    		e.stopPropagation();
	    	}
	    	$scope.entry = entry;
	    	$scope.buttonText = 'Update';
	    	$scope.isCollapsed = false;
	    };
	    
	    $scope.showPanel = function() {
	    	$scope.entry = {};
	    	$scope.buttonText = 'Create';
	    	$scope.isCollapsed = false;
	    };
	    
	    $scope.chgState = function(item) {
	    	var id = item._id;
	    	item.done = !item.done;
			item.$update({Id: id}, function(entry) {
	     	       if(!entry)
		    		   $log.log('Impossible to update bakclog entry');
			});
	    	//$scope.data.entries[index].done = !$scope.data.entries[index].done;
	    	//$scope.data.entries.splice(index, 1);	    	
	    };
}