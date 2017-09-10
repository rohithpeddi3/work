## PROMISE
- A promise represents the eventual value returned from the single completion of an operation. 
- A promise may be in one of the three states, unfulfilled, fulfilled, and failed. 
- The promise may only move from unfulfilled to fulfilled, or unfulfilled to failed.
- Once a promise is fulfilled or failed, the promise’s value MUST not be changed, just as primitives and object identities.
- The immutable characteristic of promises are important for avoiding side-effects.

```
	A promise is defined as an object that has a function as the value for the property ‘then’:
	then(fulfilledHandler, errorHandler, progressHandler)
```

- Adds a fulfilledHandler, errorHandler, and progressHandler to be called for completion of a promise. 
- The fulfilledHandler is called when the promise is fulfilled. 
- The errorHandler is called when a promise fails. 
- The progressHandler is called for progress events. 

All arguments are optional and non-function values are ignored. 

- The progressHandler is not only an optional argument, but progress events are purely optional. 
- Promise implementors are not required to ever call a progressHandler (the progressHandler may be ignored), this parameter exists so that implementors may call it if they have progress events to report.
- This function returns a new promise that is fulfilled when the given fulfilledHandler or errorHandler callback is finished.
- This allows promise operations to be chained together. 
- The value returned from the callback handler is the fulfillment value for the returned promise. 
- If the callback throws an error, the returned promise will be moved to failed state.
- Then is not a mechanism for attaching callbacks to an aggregate collection. 
- It’s a mechanism for applying a transformation to a promise, and yielding a new promise from that transformation.

```
new Promise(function(resolve,reject) {
	resolve('hi'); 		//works
	resolve('bye');		//can't happen a second time
});
```
- Promises are settled only once
- They are executed on the main thread, so are potentially blocking.
- Web workers run on seperate threads and post data to main thread

### What promises are really about

- The point of promises is to give us back functional composition and error building in the async world. 
- They do this by saying that your functions should return a promise, which can do one of two things:
	Become fulfilled by a value
	Become rejected with an exception

- If you have a correctly implemented then function that follows Promises/A, then fulfillment and rejection will compose just like their synchronous counterparts, with fulfillments flowing up a compositional chain, but being interrupted at any time by a rejection that is only handled by someone who declares they are ready to handle it.

### STAGES OF PROMISE

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

###THENNING: 
	
###CATCHING:




