var mainApp = angular.module("mainapp", []);

mainApp.controller('mainController', function($scope, $http) {
    $scope.latest_products = [];

    $scope.carts={
        id:[],
        cart_products:[],
    };

    var tmp_strcarts= window.localStorage.getItem("shopping_carts", $scope.carts);
    try{
        var tmp_carts = JSON.parse(tmp_strcarts);
        if(tmp_carts.id !== undefined){
            $scope.carts = tmp_carts;
        }
    }catch(ex){

    }

    $http.get("/helper/product/latest").then(
        function(response){
            $scope.latest_products=[];
            if(response.data.status == 1){
                $scope.latest_products = response.data.data;
            }
            console.log(response.data);
        },
        function(response){
            console.log(response.data);
        }
    );

    $scope.add_product_to_cart = function(product){
        var index = $scope.carts.id.indexOf(product.product_id);
        console.log(index);
        if(index >=0){
            $scope.carts.cart_products[index].count++;
        }else{
            $scope.carts.id.push(product.product_id);
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

   
