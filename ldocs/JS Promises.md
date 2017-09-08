STATES OF JAVASCRIPT PROMISES

- Fulfilled (Resolved)
- Rejected (It didn't work)
- Pending (Still waiting ..)
- Settled (Something happened!)

```
new Promise(function(resolve,reject) {
	resolve('hi'); 		//works
	resolve('bye');		//can't happen a second time
});
```

- Promises are settled only once
- They are executed on the main thread, so are potentially blocking.
- Web workers run on seperate threads and post data to main thread

STAGES OF PROMISE

- WRAPPING: 
	
	- Try/catch block around code.
```
		var promise = new Promise(function(resolve[,reject]){
			var value = doSomething();
			if (thingWorked) {
				resolve(value);
			} else if (somethingWentWrong) {
				reject();
			}
		}).then(function(value){
			return nextThing();
		}).catch(rejectFunction);
```
		--> Resolve leads to next then in the chain and reject leads to next catch.
		--> If a promise is passed as a value then that is executed first.
		
		//ABOVE EXAMPLE 
```
		new Promise(function(resolve,reject) {
			var img = document.createElement('img');
			img.src = 'image.jpg';
			img.onload = resolve;
			img.onerror = reject;
			document.body.appendChild(img);
		})
		.then(finishLoading)
		.catch(showAlternateImage);
```
	- Becareful with the scope of 'this' in the promises

- THENNING: 
	
	- 
