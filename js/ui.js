var UI = new Object();

/**
 * Search for div data-include="item"> and include ./views/item.html in the page
 */
UI.load = function(){
	let includes = $('[data-include]')
	  $.each(includes, function () {
		let file = 'views/' + $(this).data('include') + '.html'
		$(this).load(file)
	  })
}

/**
 * Inject HTML code for a project card
 */
UI.loadCard = function(item, index){
	let html = "\
	<div class=\"card_bot\" onclick=\"cardClicked("+index+")\">\
		<div class=\"card_bot_image\"><img src=\""+item.thumbnail_url+"\"></img></div>\
		<div class=\"card_bot_name\">"+item.name+"</div>\
		<div class=\"card_bot_author\">by "+item.author_name+"</div>\
		<div class=\"card_bot_description\">"+item.description_short+"</div>\
		<div class=\"card_bot_tags\">";

		// TAGS
		html += "<div class=\"card_bot_tag\">"+item.programming_language+"</div>";
		for(let tagIdx in item.tags){
			html += "<div class=\"card_bot_tag\">"+item.tags[tagIdx]+"</div>";
		}

		html += "\
			</div>\
		</div>";

	$("#div_bot_panel").append(html);

}

/**
 * Inject HTML code for a project page
 */
UI.loadBot = function(){
	let id = new URL(window.location.href).searchParams.get("id");
	let item = RECORDS[id];

	let html = "\
	\
	<div id=\"botName\">"+item.name+"</div>\
	<div id=\"botAuthor\">by <a href=\""+item.author_site+"\">"+item.author_name+"</a> on "+item.upload_date+"</div>\
	\
	<div id=\"botDescription\">"+item.description+"</div>\
	<div class=\"card_bot_tags_bot\"><b>tags: </b>";

	// TAGS
	html += "<div class=\"card_bot_tag\">"+item.programming_language+"</div>";
	for(let tagIdx in item.tags){
		html += "<div class=\"card_bot_tag\">"+item.tags[tagIdx]+"</div>";
	}
	html += "</div>";

	// GITHUB repo card
	if(item.repository_url != null && item.repository_url != ""){
		html += "\
			<div class=\"div_git_repo\">\
			<b>Repository:</b><br/>\
				<a href=\""+item.repository_url+"\">\
				<img align=\"center\" src=\"https://github-readme-stats.vercel.app/api/pin/?username=botcity-dev&repo="+item.repository_name+"\" />\
				</a><br/>\
			<font style='font-size:12px'>* Source code may be subject to copyright, check with author for redistribution.</font>\
			</div>";
	}

	// Youtube Video
	if(item.youtube_video != null && item.youtube_video != ""){
		html += "\
		<div class=\"video-container\">\
			<iframe class=\"youtube_embeded\" width=\"\" height=\"\" src=\""+item.youtube_video+"\" title=\"YouTube video player\" frameborder=\"0\" allow=\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture\" allowfullscreen></iframe>\
		</div>";
	}

	$("#botPanel").html(html);

	if(item.youtube_video != null && item.youtube_video != ""){
		// Set youtube dimensions
		let hp = item.youtube_height/item.youtube_width * 100;
		$(".video-container").css("padding-bottom", hp+"%");
	}
};