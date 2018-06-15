var returnedImages, imageJSON, numMedia, numPages, mediaSource, mediaCategory, mediaPath, folder, imageJSON, categoryValues;
mediaSource = [];
mediaCategory = [];
folder = '';
mediaPath = '';
imageJSON = '';
categoryValues = '';

// get image data from WP API
(function() {
 $.getJSON(wpEndPoint + '?per_page=100&fields=source_url')

	.done(function(data, status, request) {
		returnedImages = "";
		numMedia = request.getResponseHeader('x-wp-total');
		numPages = request.getResponseHeader('x-wp-totalpages');
		// loop through each value to dynamically build html from json data values and build image elements
		$.each(data, function(key, value) {
				returnedImages += '<img class="slds-p-around_xxx-small grow" src="' + value.source_url + '" width="100" height="100">';
		});
		// append html generated to cms-images div & update results returned count
		$('#cms-images').html(returnedImages);
		$('#cms-images>img').css('cursor', 'pointer');
		$('#image-selection-count').html(numMedia + ' total images. First 100 returned.');
		callLinks();
    buildArrays();
	})
	})();

// loop through the total number of pages of media and store values in an array
function buildArrays () {
completedRequests = 0;
for (var i=1; i <= numPages; i++) {

var imageJSON = $.getJSON(wpEndPoint + '?page=' + i + '&per_page=100&fields=source_url,media_details.file', function() {
  })
  .done(function(data, status, request) {
    $.each(data, function(i, e){
      mediaSource.push(e.source_url);
      mediaPath = e.media_details.file;
      folder = mediaPath.substring(0, mediaPath.indexOf("/"));
      mediaCategory.push(folder);
      completedRequests++;
      if (completedRequests === parseInt(numMedia, 10)) {
        getUniqueCategories();
      }
    });
  })
}
}

// determines the unique values/folders in WP and appends to the category drop down filter to allow for dynamic options
function getUniqueCategories () {
  var returnedCategories = '';
  var categoryValues = mediaCategory.filter(function(unique, i, mediaCategory) {
      return i == mediaCategory.indexOf(unique);
  });

  $.each(categoryValues, function(index, value) {
    console.log(value);
    var option = $('<option></option>').attr("value", value).text(value.substr(0,1).toUpperCase()+value.substr(1));
    $("#image-filter").append(option);
  });
}

// rebuild image list based on category selected
function imageRebuild () {
	var filterCategory, filteredCount, filteredImages;
	filterCategory = document.getElementById('image-filter').value;
	$.getJSON(wpEndPoint + '?search=' + filterCategory + '/&per_page=100&fields=source_url,media_details.file')

	 .done(function(data, status, request) {
		 filteredImages = "";
		 filteredCount = request.getResponseHeader('x-wp-total');
		 // loop through each value to dynamically build html from json data values and build image elements
		 $.each(data, function(key, value) {
				 filteredImages += '<img class="slds-p-around_xxx-small grow" src="' + value.source_url + '" width="100" height="100">';
		 });
		 // replace html in cms-images div & update results returned count
		 $('#cms-images').html(filteredImages);
		 $('#image-selection-count').html(filteredCount + ' results returned');
		 $('#cms-images>img').css('cursor', 'pointer');
		 callLinks();
})
}

// SDK logic to set and retrieve attributes of block

var sdk = new window.sfdc.BlockSDK();

var link, width, height, scale, alignment, imageurl;

function blockSettings () {
	document.getElementById('image-link').value = link;
	document.getElementById('slider-image-width').value = width;
	document.getElementById('slider-image-height').value = height;
	document.getElementById('slider-image-width-val').innerHTML = width;
	document.getElementById('slider-image-height-val').innerHTML = height;

	if (scale === "yes") {
		document.getElementById('scale-yes').setAttribute("checked", "checked");
	} else {
		document.getElementById('scale-yes').removeAttribute("checked");
		document.getElementById('scale-no').setAttribute("checked", "checked");
	}

	if (alignment === "left") {
		document.getElementById('image-left').setAttribute("checked", "checked");
		document.getElementById('image-center').removeAttribute("checked");
		document.getElementById('image-right').removeAttribute("checked");
	} else if (alignment === "right") {
		document.getElementById('image-left').removeAttribute("checked");
		document.getElementById('image-center').removeAttribute("checked");
		document.getElementById('image-right').setAttribute("checked", "checked");
	} else {
		document.getElementById('image-left').removeAttribute("checked");
		document.getElementById('image-center').setAttribute("checked", "checked");
		document.getElementById('image-right').removeAttribute("checked");
	}
	disableOptions();
}


function sliderValues () {
	document.getElementById('slider-image-width-val').innerHTML = document.getElementById('slider-image-width').value;
	document.getElementById('slider-image-height-val').innerHTML = document.getElementById('slider-image-height').value;
}

function setImage() {
	link = document.getElementById('image-link').value;
	width = document.getElementById('slider-image-width').value;
	height = document.getElementById('slider-image-height').value;
	alignment = document.querySelector('input[name="alignment"]:checked').value;
	scale = document.querySelector('input[name="scale"]:checked').value;
	if (scale === "yes") {
  	sdk.setContent('<div style="text-align: ' + alignment + ';"> <a href="' + link + '"><img style="width: 100%" src="' + imageurl + '" /></a></div>');
	} else {
		sdk.setContent('<div style="text-align: ' + alignment + ';"> <a href="' + link + '"><img height="' + height + '" width="' + width + '" src="' + imageurl + '" /></a></div>');
	}
	sdk.setData({
	link: link,
	width: width,
	height: height,
	imageurl: imageurl,
	alignment: alignment,
	scale: scale
	});
}

sdk.getData(function (data) {
	link = data.link || '';
	width = data.width || '300';
	height = data.height || '300';
	imageurl = data.imageurl || 'https://experts-cb-sdk-wordpress.herokuapp.com/images/wordpress-logo.jpg';
	alignment = data.alignment || 'center';
	scale = data.scale || 'no';
    blockSettings();
    setImage();
});

// set image url after user click
function callLinks () {
	$("#cms-images").children("img").click(function() {
	    imageurl = $(this).attr('src');
	    setImage();
	})
}

//disable slider values & alignment when scale to fit is selected
function disableOptions () {
	if (document.querySelector('input[name="scale"]:checked').value === "yes") {
		document.getElementById('slider-image-height').setAttribute("disabled","");
		document.getElementById('slider-image-width').setAttribute("disabled","");
		document.getElementById('image-left').setAttribute("disabled","");
		document.getElementById('image-center').setAttribute("disabled","");
		document.getElementById('image-right').setAttribute("disabled","");
	} else {
		document.getElementById('slider-image-height').removeAttribute("disabled");
		document.getElementById('slider-image-width').removeAttribute("disabled");
		document.getElementById('image-left').removeAttribute("disabled");
		document.getElementById('image-center').removeAttribute("disabled");
		document.getElementById('image-right').removeAttribute("disabled");
	}
}

// Event Listeners
document.getElementById("image-filter").addEventListener("change", imageRebuild);
document.getElementById("image-scale").addEventListener("click", disableOptions);
document.getElementById("slider-image-width").addEventListener("change", sliderValues);
document.getElementById("slider-image-width").addEventListener("change", setImage);
document.getElementById("slider-image-height").addEventListener("change", sliderValues);
document.getElementById("slider-image-height").addEventListener("change", setImage);
document.getElementById("image-link").addEventListener("change", setImage);
document.getElementById("image-alignment").addEventListener("change", setImage);
document.getElementById("image-scale").addEventListener("change", setImage);
