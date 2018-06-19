var blogCategoryJSON, blogCategoryArray, numCategories, blogCategory, blogJSON;
blogCategoryJSON = '';
numCategories = '';
numBlogs = '';
blogCategory = '';
blogJSON = '';
blogCategoryArray = [];
blogCategoryCountArray = [];
blogCategoryIDArray = [];
blogArrayIndex = '';
selectedBlog = '';
blogImage = '';


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
	$('#blogs').empty();
	blogID = [];
	blogLinkArray = [];
	blogDateArray = [];
	blogTitleArray = [];
	blogExcerptArray = [];
	blogImageArray = [];
	blogCategory = document.getElementById('blog-categories').value;
	var blogJSON = $.getJSON('https://wordpress.imhlabs.com/wp-json/wp/v2/' + 'posts?fields=id,link,date,title.rendered,excerpt.rendered,featured_media,categories&categories=' + blogCategory)
	.done(function(data, status, request) {
	numBlogs = request.getResponseHeader('x-wp-total');
	$('#blog-counts').html(numBlogs + ' posts in this category');
	// loop through each value to dynamically build html from json data values and build category values
	$.each(data, function(i, e){
		blogID.push(e.id);
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
	$('#blogs').append(option);
	i=0;
	$.each(blogTitleArray, function(index, value) {
		var option = $('<option></option>').attr("value", blogID[i]).text(value);
		$('#blogs').append(option);
		i++;
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

var sdk = new window.sfdc.BlockSDK();

function setBlog () {
	var alignment = document.querySelector('input[name="alignment"]:checked').value;
	var selectedBlog = document.getElementById('blogs').value;
	var selectedBlogNum = parseInt(selectedBlog, 10);
	var blogArrayIndex = blogID.indexOf(selectedBlogNum);
	blogContentDate = blogDateArray[blogArrayIndex];
	blogContentLink = blogLinkArray[blogArrayIndex];
	blogContentImage = blogImageArray[blogArrayIndex];
	blogContentTitle = blogTitleArray[blogArrayIndex];
	blogContentExcerpt = blogExcerptArray[blogArrayIndex];
	var excerptStart = blogContentExcerpt.indexOf('<p>') + 3;
	var excerptEnd = blogContentExcerpt.indexOf('</p>', excerptStart);
	var blogContentExcerptText = blogContentExcerpt.substring(excerptStart,excerptEnd);
	var blogImageJSON = $.getJSON('https://wordpress.imhlabs.com/wp-json/wp/v2/media/' + blogContentImage + '?fields=source_url')
	.done(function(data, status, request) {
		$.each(data, function(key, value){
			var blogImage = value;
			sdk.setContent('<div> <a href="' + blogContentLink + '"><img style="width: 100%" src=' + blogImage + ' /></a></div><div><strong><h1>' + blogContentTitle + '</h1></strong></div><div>' + blogContentExcerptText + '</div><br><div style="text-align: ' + alignment + ';"><a href="' + blogContentLink + '"><button style="background:#2C70CB; cursor:pointer;font-size:16px;color:white;padding:15px 32px">Read More</button></a></div>');
		})
})
}



// Event Listeners
document.getElementById("blog-categories").addEventListener("change", showHideElements);
document.getElementById("blog-categories").addEventListener("change", blogTitles);
document.getElementById("blogs").addEventListener("change", setBlog);
document.getElementById("button-alignment").addEventListener("change", setBlog);
