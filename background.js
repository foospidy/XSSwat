// XSSwat Copyright (C) 2015 foospidy
// https://github.com/foospidy/XSSwat
// See LICENSE for details
// This script requires/uses the CryptoJS md5 module (code.google.com/p/crypto-js) which
// has its own license, see code.google.com/p/crypto-js/wiki/License

chrome.webRequest.onBeforeRequest.addListener(
	function(request) {
		try {
			if('GET' == request.method) {
				//console.log("url: " + request.url);
				//console.log("method: " + request.method);
				
				var request_signature = '';
				var query_parameters  = '';
				var hash_parameters   = '';
				var hash_signature    = '';

				// get query parameters
				var url_parts = request.url.split('?', 2);
				
				if(2 == url_parts.length) {
					request_signature = url_parts[0];
					query_parameters  = url_parts[1];

					var parameters = query_parameters.split('&');
					
					for(i=0; i<parameters.length; i++) {
						//console.log('    ' + parameters[i]);
						parameter_parts = parameters[i].split('=', 2);
						request_signature += '?' + parameter_parts[0];						
					}
				}
				
				// get hash parameters
				var url_parts = request.url.split('#', 2);
				
				if(2 == url_parts.length) {
					// if there were no query parameters then set url base to request signature
					if(!request_signature.length) {
						request_signature = url_parts[0];
					}
					
					hash_parameters = url_parts[1];

					var parameters = hash_parameters.split('&');
					
					for(i=0; i<parameters.length; i++) {
						//console.log('    ' + parameters[i]);
						parameter_parts = parameters[i].split('=', 2);
						request_signature += '#' + parameter_parts[0];
					}
				}
				
				// if there were no query/hash parameters then set url base to request signature
				if(!request_signature.length) {
					request_signature = url_parts[0];
				}
				
				var hash = CryptoJS.MD5(request_signature.trim());
				
				xhr = new XMLHttpRequest();
				xhr.open('GET', 'https://riskdiscovery.com/api/xsswat/' + hash, false);
				xhr.send();
				
				json   = xhr.responseText;
				object = JSON.parse(json);
				
				if('true' == object.xss) {
					return { redirectUrl: 'https://riskdiscovery.com/xsswat/' + hash } 
				}
			}

			return { cancel: false }

		} catch(e) {
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
