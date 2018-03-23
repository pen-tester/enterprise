var mainApp = angular.module("mainapp", []);

mainApp.controller('mainController', function($scope, $http) {
    $scope.carts={
        id:[],
        cart_products:[]
    };

    var tmp_strcarts= window.localStorage.getItem("shopping_carts", $scope.carts);
    try{
        var tmp_carts = JSON.parse(tmp_strcarts);
        if(tmp_carts.id !== undefined){
            $scope.carts = tmp_carts;
        }
    }catch(ex){

    }

    $scope.carting_products ={
        products:[],
        total_amount:0,
        total_count:0
    }

    var length = $scope.carts.cart_products.length;
    for(var i=0; i<length;i++){
        var product =$scope.carts.cart_products[i];
        $scope.carting_products.products.push({id:product.product_id, count:product.count, amount:product.amount});
        $scope.carting_products.total_amount =((+$scope.carting_products.total_amount) + (+product.amount) * product.count).toFixed(2);
        $scope.carting_products.total_count += product.count;
    }

    document.getElementsByName("amount")[0].value=$scope.carting_products.total_amount;
    document.getElementsByName("cart_info")[0].value=JSON.stringify($scope.carting_products);


    //Shopping in anywhere

    $scope.add_product_to_cart = function(product){
        var index = $scope.carts.id.indexOf(product.product_id);
        console.log(index);
        if(index >=0){
            $scope.carts.cart_products[index].count++;
        }else{
            $scope.carts.id.push(product.product_id);
            $scope.carts.counts.push(1);
            product.count=1;
            $scope.carts.cart_products.push(product);
        }


        window.localStorage.setItem("shopping_carts", JSON.stringify($scope.carts));
    }

    $scope.get_cart_total_info = function(){
        var length = $scope.carts.cart_products.length;
        var total_count = 0, total_amount =0;
        for(var i = 0 ;i<length; i++){
            total_count += $scope.carts.cart_products[i].count;
            total_amount = ((+total_amount) + (+$scope.carts.cart_products[i].amount) * $scope.carts.cart_products[i].count).toFixed(2);
        }

        return {count:total_count, total_amount:total_amount};
    }    
});

   
