function keydownCallback(){
	$('#text_search').on('keydown', function(e) {
	  if (e.keyCode === 13) {
		e.preventDefault();
		e.stopImmediatePropagation();
		let query = $('#text_search').val();

		if(query != null)
			window.history.pushState("", "", 'index.html?q='+query);

		updateCards(query);
	  }
	});
}


function updateCards(){
	var query = new URL(window.location.href).searchParams.get("q");
	console.log(query);
	$("#div_bot_panel").empty();

	let matched=0;
	for(let i in RECORDS){
		let item = RECORDS[i];
		if(match(item, query)){
			UI.loadCard(item, i);
			matched++;
		}
	}
	/*
	if(matched > 2)
		$("#div_bot_panel").css("justify-content", "space-between");
	else{
		$("#div_bot_panel").css("justify-content", "flex-start");
		$(".card_bot").css("margin-right", "calc((75vw - 1086px) / 2)"); ; // 1086 = 360 (card_bot_width) + 2 (border) * 3
	}
	*/
}

function match(item, query){
	if(query == null || query == "")
		return true;

	// match programming language
	if(matchQueryString(item.programming_language, query))
		return true;

	// match tags
	for(let i in item.tags){
		if(matchQueryString(item.tags[i], query))
			return true;
	}

	return false;
}

function matchQueryString(query, str){
	if(str.toLowerCase().indexOf(query.toLowerCase()) != -1)
		return true;
	return false;
}

function cardClicked(index){
	let item = RECORDS[index];
	window.location.href="bot.html?id="+index;
}