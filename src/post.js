'use strict'
class Post {
	static getLikeCount(id){
		
		return new Promise((resolve, reject)=>{
			console.log(id)

			FB.api(
			    `/${id}/likes?summary=true`,
			    function (response) {
			      if (response && !response.error) {
			        //console.log("+ GET LIKES +")
			        if(response.summary){
			        	resolve(response.summary.total_count)
			        }else{
			        	console.log(response)
			        	resolve('')
			        	
			        }
			      }else{
			      	reject()
			      }
			    }
			);

		})
		
	}
	
}
export default Post;