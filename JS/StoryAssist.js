function StoryAssist(stories){
	console.log(stories);
	
	this.stories=stories;
	var result = [];
	this.formatDuplicates=function(){
		var temp;
		var obj;
		stories.forEach(function (story){
			index = exists(story.lat,story.lng);
			if(index<0){
				temp = {
					lat:story.lat,
					lng:story.lng,
					stories:[]
				};
				delete story.lat;
				delete story.lng;
				temp.stories.push(story);
				result.push(temp);
			}
			else{
				delete story.lat;
				delete story.lng;
				result[index].stories.push(story);
			}
		});
		//console.log(result);
		return result;
	};
	function exists(lat,lng){
		for(var i=0; i<result.length;i++){
			if(result[i].lat==lat && result[i].lng==lng){
				return i;
			}
		}
		return -1;
	}
}