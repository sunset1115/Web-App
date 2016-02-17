# MyGravity Customer Webpages

This is the future branch for the customer webpages 

## Notes

At present it is using the runtime compiler. For production this will be changed for precompiling

## Run locally

Need to setup nginx (or other proxy) to push locally to stage.mygravity.co

## Useful functions

There are bunch of useful functions, the most useful is a low memory forEach loop:

`mygravity.utils.forEach(<array>, function(<index>, <value>){
	// code to execute
	// not if you return true at any point you can break out of this loop	
})
`
