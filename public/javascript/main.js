var blogCategoryJSON, blogCategoryArray, numCategories, blogCategory, blogJSON;
blogCategoryJSON = '';
numCategories = '';
numBlogs = '';
blogCategory = '';
blogJSON = '';
blogCategoryArray = [];
blogCategoryCountArray = [];
blogCategoryIDArray = [];
blogLinkArray = [];
blogDateArray = [];
blogTitleArray = [];
blogExcerptArray = [];
blogImageArray = [];

// get blog categories from WP API
(function() {
	showHideElements();
  var blogCategoryJSON = $.getJSON('https://wordpress.imhlabs.com/wp-json/wp/v2/' + 'categories?&fields=id,count,name')
	.done(function(data, status, request) {
		numCategories = request.getResponseHeader('x-wp-total');
		$('#blog-counts').html(numCategories + ' total categories');
		// loop through each value to dynamically build html from json data values and build category values
    $.each(data, function(i, e){
      blogCategoryArray.push(e.name);
			blogCategoryCountArray.push(e.count);
			blogCategoryIDArray.push(e.id);
		})
		// append returned category count to UI
		buildBlogCategories ();
	})
	})
	();

// Populate Category drop down with values from API call
function buildBlogCategories () {
	i = 0;
	$.each(blogCategoryArray, function(index, value) {
		console.log(value);
		var option = $('<option></option>').attr("value", blogCategoryIDArray[i]).text(value.substr(0,1).toUpperCase()+value.substr(1) + ' (' +  blogCategoryCountArray[i] + ')' );
		$("#blog-categories").append(option);
		i++;
	});
}

// Get blog titles from WP API
function blogTitles () {
	blogCategory = document.getElementById('blog-categories').value;
	var blogJSON = $.getJSON('https://wordpress.imhlabs.com/wp-json/wp/v2/' + 'posts?fields=link,date,title.rendered,excerpt.rendered,featured_media,categories&categories=' + blogCategory)
	.done(function(data, status, request) {
	numBlogs = request.getResponseHeader('x-wp-total');
	$('#blog-counts').html(numBlogs + ' posts in this category');
	// loop through each value to dynamically build html from json data values and build category values
	$.each(data, function(i, e){
		blogLinkArray.push(e.link);
		blogDateArray.push(e.date);
		blogTitleArray.push(e.title.rendered);
		blogExcerptArray.push(e.excerpt.rendered);
		blogImageArray.push(e.featured_media);
		// media path: https://wordpress.imhlabs.com/wp-json/wp/v2/media/
	})
	// append returned category count to UI
	buildBlogTitles ();
})
}

// Populate blog title drop down with values from API call
function buildBlogTitles () {
	var option = $('<option></option>').attr("value", "").text("Please Select");
	$("#blogs").empty().append(option);
	$.each(blogTitleArray, function(index, value) {
		var option = $('<option></option>').attr("value", value).text(value);
		$("#blogs").append(option);
	});
}

// Hide blog selector & alignment if no category is selected
function showHideElements() {
	blogCategory = document.getElementById('blog-categories').value;
	if (blogCategory !== "") {
		$("#blog-element").show();
		$("#button-alignment").show();
 	} else {
		$("#blog-element").hide();
		$("#button-alignment").hide();
	}
}

// Event Listeners
document.getElementById("blog-categories").addEventListener("change", showHideElements);
document.getElementById("blog-categories").addEventListener("change", blogTitles);
//document.getElementById("blog-categories").addEventListener("change", buildBlogTitles);
