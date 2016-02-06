// XSSwat Copyright (C) 2015 foospidy
// https://github.com/foospidy/XSSwat
// XSSwat is licensed under GPL v2.0, see LICENSE for details
// This script requires/uses the CryptoJS md5 module (code.google.com/p/crypto-js) which
// has its own license, see code.google.com/p/crypto-js/wiki/License

chrome.webRequest.onBeforeRequest.addListener(
	function(request) {
		try {
			// if the a GET request then proceed
			if('GET' == request.method) {
				var request_signature = '';
				var query_parameters  = '';
				var hash_parameters   = '';
				var hash_signature    = '';

				// get any query parameters
				var url_parts = request.url.split('?', 2);
				
				// if there are query parameters then proceed to get parameter
				// names and generate a request signature
				if(2 == url_parts.length) {
					request_signature = url_parts[0]; // everything before query parameters
					query_parameters  = url_parts[1]; // query parameters

					// split up query parameters into an array
					var parameters = query_parameters.split('&');
					
                    			parameters.sort();
					
					// loop through all parameters and append parameter 
					// names to request signature
					for(i=0; i<parameters.length; i++) {
						parameter_parts = parameters[i].split('=', 2); // split parameter into parts
						request_signature += '?' + parameter_parts[0]; // append parameter name		
					}
				}
				
				// get any hash parameters
				var url_parts = request.url.split('#', 2);
				
				// if there are hash parameters then proceed to get parameter
				// names and generate or append to the request signature
				if(2 == url_parts.length) {
					// if there were no query parameters then we didn't initialize the
					// request signature, create it now
					if(!request_signature.length) {
						request_signature = url_parts[0];
					}
					
					hash_parameters = url_parts[1]; // hash parameters
					
					// split up hash parameters into an array
					var parameters = hash_parameters.split('&');
                    
            				parameters.sort();

					for(i=0; i<parameters.length; i++) {
						parameter_parts = parameters[i].split('=', 2); // split parameter into parts
						request_signature += '#' + parameter_parts[0]; // append parameter name	
					}
				}
				
				// if there were no query/hash parameters then initialize the request signature
				if(!request_signature.length) {
					request_signature = url_parts[0];
				}
				
				// generate md5 hash of the request signature
				var hash = CryptoJS.MD5(request_signature.trim());
				
				// make the request to riskdiscovery.com with the hash
				xhr = new XMLHttpRequest();
				xhr.open('GET', 'https://riskdiscovery.com/api/xsswat/' + hash, false);
				xhr.send();
				
				// convert the response to a json object
				json   = xhr.responseText;
				object = JSON.parse(json);
				
				// if the response indicates xss then redirect browser to warning page
				if('true' == object.xss) {
					return { redirectUrl: 'https://riskdiscovery.com/xsswat/' + hash } 
				}
			}

			// no check took place so continue without blocking
			return { cancel: false }

		} catch(e) {
			// some exception occured, log and block request
			console.log('Error: ' + e);
			return { cancel: true }
		}
	}, {
		urls: [
		  "*://*/*"
		]
	},
	["requestBody", "blocking"]	
);
