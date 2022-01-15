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
	window.location.href="bot-"+id+".html";
};