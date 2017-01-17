'use strict';
import request from 'superagent';
import post from './post';

let MaxPosts = 10 //default

class Feed {
	constructor(){
		this.myPosts = []
		this.postCount = 0
		this.progressBlockNode = document.getElementById('progressBlock');
		this.finishTextNode = document.getElementById('finishText');
		this.progressIndexNode = document.getElementById('progressIndex');
			
	}
	reset(){
		console.log("Reset.")
		this.myPosts = [];
		this.postCount = 0;

		this.finishTextNode.innerHTML = "";

		let rootNode = document.getElementById('feeds');
		rootNode.innerHTML = "";
		document.getElementById("downloadBlock").classList = ['hide'];
	}
	get(){
		if(this.myPosts.length !==0){
			this.reset();
		}
		document.getElementById('progressBlock').classList = ['show'];

		//set max
		MaxPosts = Number(document.getElementById('inputMax').value);
		FB.api(
			"/me/feed",
			(response)=>{
				if(response && !response.error){
					this.addToList(response.data);
					if(response.paging){
						if(response.paging.next){
							this.getMore(response.paging.next).then((d)=>{
								this.addToList(d);
							})
						}
					}else{
						console.log("REACH END."+this.postCount)
						this.finish();
					}
				}
			}
		)
	}
	getMore(url){
		console.log("GET MORE:"+url)
		return new Promise((resolve, reject)=>{
			request.get(url)
			   	   .end((err,res)=>{
			   			if(!res) reject("Complete.");
	
			   			let d = JSON.parse(res.text);	
			   			if(d.paging){			  		
							if(d.paging.next && this.postCount < MaxPosts){
								this.getMore(d.paging.next).then((d)=>{
									console.log("GetMore:")
									console.log(d)
									this.addToList(d);
								})
							}else{
								this.finish();
							}
						}else{
							console.log("REACH END."+this.postCount)
							this.finish();
						}
						resolve(d.data)
			   		
			   		})
		})
	}
	shouldAdd(entry){
		console.log(entry)
		if(entry.message !== undefined){
			return true;
		}return false;
	}
	addToList(data){
		
		data.forEach((entry)=>{
			console.log("- postCount "+this.postCount)
			//show progress
			this.progressIndexNode.innerHTML = "";
			this.progressIndexNode.appendChild(document.createTextNode(this.postCount));


			if(this.postCount < MaxPosts){

				this.postCount++
				entry.index = this.postCount;
				console.log(entry)
				
				//get likes
				post.getLikeCount(entry.id).then((d)=>{
					entry.totalCount = d;
					//add to list
					this.myPosts.push(entry)
					
				})
			}
		})

		console.log("====> "+this.myPosts.length)
		
		
		
	}
	addToDom(entry){
		let rootNode = document.getElementById('feeds')
		
		let body = entry.message;
		if(!body){
			body = entry.story;
		}
		
		let entry_node = document.createElement("a")

		let ids = entry.id.split('_');
		//entry_node.setAttribute('href', '//www.facebook.com/'+ids[0]+'/posts/'+ids[1]);
		entry_node.setAttribute('href', '//www.facebook.com/'+entry.id);
		entry_node.setAttribute('target','_blank')
		entry_node.classList.add("feed-entry")

		let left_block_node = document.createElement("div");
		left_block_node.classList.add("feed-left")

		let index_node = document.createElement("div")
		index_node.appendChild(document.createTextNode(entry.index))
		
		let right_block_node = document.createElement("div");
		right_block_node.classList.add("feed-right")
	
		let time_node = document.createElement("div")
		time_node.appendChild(document.createTextNode(entry.created_time))
		
		let body_node = document.createElement("div")
		body_node.appendChild(document.createTextNode(body))
		body_node.classList.add("feed-body")

		let count_node = document.createElement("div")
		count_node.appendChild(document.createTextNode(entry.totalCount))
		count_node.classList.add("feed-count")


		//combine
		left_block_node.appendChild(index_node)
		right_block_node.appendChild(time_node)
		right_block_node.appendChild(body_node)
		right_block_node.appendChild(count_node)

		entry_node.appendChild(left_block_node);
		entry_node.appendChild(right_block_node);
	
		rootNode.appendChild(entry_node)
		
	}
	finish(){
		//add to dom
		this.myPosts.sort((a,b)=>{
			return a.index - b.index;
		})
		this.myPosts.map((a)=>{
			this.addToDom(a);
		})
					

		//document.getElementById('progressBlock').classList = ['hide'];
		
		this.finishTextNode.append(document.createTextNode("done!"))
		if(this.postCount < MaxPosts){
			this.finishTextNode.append(document.createTextNode(" Has reached the end of your feeds on facebook."))
		}

		this.download();
	}
	download(){
		document.getElementById("downloadBlock").classList = ['show'];

		//JSON
		let json = JSON.stringify(this.myPosts,null, 4);
		let blob = new Blob([json], {type: 'application/json'})
		let url = URL.createObjectURL(blob);
		let j = document.getElementById('downloadJSON');
		j.download = "myFeed.json";
		j.href = url;

		//CSV
		let csvRows = [];
		csvRows.push('created_time,message,link,total_count')
		this.myPosts.forEach((d)=>{
			let content = d.message||d.story;
			if(content){
				content = content.replace(/(\r\n|\n|\r)/gm,'');
				content = content.replace(/,/g,' ');
			}
			//console.log(content)
			csvRows.push(`${d.created_time},${content},https://www.facebook.com/${d.id},${d.totalCount}`)
		}); 
		let csvString = csvRows.join('\n');

		let c = document.getElementById('downloadCSV');
		c.download = 'myFeed.csv';
		c.href = 'data:attachment/csv,' +  encodeURIComponent(csvString);


	}
}
export default Feed;