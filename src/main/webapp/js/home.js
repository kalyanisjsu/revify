/**
 * Vijaya Kedar
 */

var categoryPath = "/revify/services/categories";

var loadCategories = function(){
    var url = extractBaseUrl() + categoryPath;
    jQuery.ajax(url, {
        dataType : "json",
        success : categoryOnSuccess,
        error : categoryOnError
    });
};

var extractBaseUrl = function(){
    var urlArr = location.href.split('/');
    var protocol = urlArr[0];
    var host = urlArr[2];
    return protocol + '//' + host;
}

var categoryOnSuccess = function(response, status, xhr){
	try{
		var categories = response;
		var categoryMenu = $('.dl-menu');
		for(var i in categories){
			var category = categories[i];
			var li = "<li><div><img src=\"" + category.icon +"\"><a href='user-reviews.html?cid=" + category.categoryID
                + "'><span>" + category.categoryName + "</span></a></div></li>";
			
			categoryMenu.append(li);
		}
	}catch(e){
		console.log(e);
		alert("Error loading page");		
	}
};

var categoryOnError = function(xhr, status, e){
    console.log(e);
    alert("Error in loading categories. Please try again");
};
//********************* Latest Reviews **********************/
var categoryArray = [1,3];
var latestReviewsPath = "/revify/services/reviews?range=latest&categoryID=";

var loadLatestReviews = function() {
    for (var i = 0; i < categoryArray.length; i++) {
        getLatestReviews(categoryArray[i]);
    }
};

var getLatestReviews = function(categoryID){
    var url = extractBaseUrl() + latestReviewsPath + categoryID;
    jQuery.ajax(url, {
        dataType: "json",
        success : latestReviewOnSuccess,
        error : latestReviewOnError
    });
};

var latestReviewOnSuccess = function(response, status, e){
    try{
        var reviews = response;
        var reviewContainer = $('#review-container');
        if(reviews!= null && reviews.length != 0){
            var category = reviews[0].categoryName;
            var categoryID = reviews[0].categoryID;
            var latestReviewStr = "Latest Reviews";
            var reviewHeadingTemplate  = " <div class=\"row\"><div class=\"col-md-12 review-heading\">" +
                "<span class=\"review-heading-left-block\">" + "categoryHolder" + "</span>"+
                "<a href=\"user-reviews.html?cid=" + categoryID +"\"><span class=\"review-heading-right-block\">See more</span></a></div></div>";
            var row = "<div class=\"row\"></div>";

            var categoryName = latestReviewStr.replace(" ", " " + category + " ");
            var reviewHeading = reviewHeadingTemplate.replace("categoryHolder", categoryName);
            reviewContainer.append(reviewHeading);
            reviewContainer.append(row);

            var reviewCardRow = $('div#review-container > div.row:last-child');

            //var row = $('#review-container:last-child');

            for(var i in reviews) {
                var review = reviews[i];

                var date = new Date(review.reviewDate);
                var reviewTime = date.toDateString();

                var ratingColor;
                var ratingWidth;

                switch (review.overallRating){
                    case 1:
                        ratingColor = "fill-red";
                        ratingWidth = 10;
                        break;

                    case 2:
                        ratingColor = "fill-light-red";
                        ratingWidth = 20;
                        break;

                    case 3:
                        ratingColor = "fill-yellow";
                        ratingWidth = 30;
                        break;

                    case 4:
                        ratingColor = "fill-light-green";
                        ratingWidth = 40;
                        break;

                    case 5:
                        ratingColor = "fill-green";
                        ratingWidth = 55;
                        break;
                }

                var reviewCard = "<div class=\"col-md-3 col-sm-6 col-xs-12\">" +
                    "<div class=\"review-panel review-card\"><div class=\"review-card-image review-border\">" +
                    "<a href=\"latest-review.html?pid="+ review.productID+ "&cid=" + review.categoryID + "\">" +
                    "<img class=\"img-responsive\" src=\"" + review.image + "\">" +
                    "</a></div><div class=\"review-panel-body\">" +
                    "<div class=\"row row-table review-border\"><div class=\"col-xs-12 text-center pv-lg\">" +
                    "<span data-toggle=\"tooltip\" title=\"" + review.productName  + "\" class=\"fs-20 text-bold\">" + review.productName.substring(0, 15) + "..." + "</span></div></div>" +
                    "<div class=\"row row-table review-border\"><div class=\"col-xs-4 text-center pv-lg\">" +
                    "<img src=\"images/star-blue.png\" class=\"rv-pd img-responsive\"></div>" +

                    "<div class=\"col-xs-8 pv-lg text-right fs-14\">" +
                    "<div class=\"m0 text-bold fs-22\">" + review.overallRating + "</div>" +

                    "<div class=\"product-review-bar\">" +
                    "<div class=\"" + ratingColor + " fill\" data-width=\"" + ratingWidth  + "\" style=\"width:" + ratingWidth  +"px;\">" +"</div>" +
                    "</div> </div> </div>" +

                    "<div class=\"row row-table\"><div class=\"col-xs-4 text-center pv-lg\">" +
                    "<span>by <span class=\"reviewer\" data-toggle=\"tooltip\" title=\""+ review.reviwer +"\">" + review.reviwer.substring(0,5) + "..." + "</span></span>" + "</div> <div class=\"col-xs-8 pv-lg text-right\">" +
                    "<span style=\"color:#3333FF\">" + reviewTime + "</span></div></div></div></div></div>";

                reviewCardRow.append(reviewCard);
            }

            $('[data-toggle="tooltip"]').tooltip();
        }
    }catch(e){
        console.log(e);
        alert("Error while loading latest reviews...");
    }
};

var latestReviewOnError = function(xhr, status, e){
    console.log(e);
    alert("Error loading latest review");
};

//******************** sign in ******************************/

var signinURL = extractBaseUrl() + "/revify/services/signin";

var signinURL = "/revify/services/signin";

var spinnerOn = function(){
    $('.disablingDiv').show();
    $('#spinner').show();
}

var spinnerOff = function(){
    $('#spinner').hide();
    $('.disablingDiv').hide();
}

var signin = function(){
    spinnerOn();
    jQuery.ajax(extractBaseUrl() + signinURL, {
        dataType: "text",
        success: signinOnSuccess,
        error: signinOnError
    });
};

var signinOnSuccess = function(response, status, xhr){
    window.open(response, "_self");
    spinnerOff();
};

var signinOnError = function(xhr, status, e){
    console.log(e);
    alert("Error while signing in");
};

$(".dl-menuwrapper").hover(function(){
    $(".dl-menu").addClass("dl-menuopen");
}, function(){
    $(".dl-menu").removeClass("dl-menuopen");
});


loadCategories();
loadLatestReviews();
