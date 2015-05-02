# XSSwat
Chrome extension to prevent visiting web pages that are known to be vulnerable to XSS. This is somewhat of an experimental concept. Sites with known vulnerabilities are defined by postings on https://www.reddit.com/r/xss/. Big brand sites are often reported as vulnerable and they don't appear to patch very quickly, or at all. This leaves Internet users open to XSS attacks.

## Approach
The extension generates a signature for every URL requested. The signature is based on the full URL (domain + path + query parameters). Only the query parameter names are used to generate the signature, the values are ignored. Next a MD5 hash of the signature is generated. Then a call is made to a hosted service at riskdiscovery.com to check if the hash of the signature matches the hash signature of a vulnerable URL reported at https://www.reddit.com/r/xss/. If there is a match the extension blocks loading the vulnerable URL and redirects the browser to a warning page on riskdiscovery.com. Example warning page: https://riskdiscovery.com/xsswat/9ab9c934e2329708df92a86781ba47b9

## Installation (Unpacked Extension)
- Download and unzip/save folder containing extension files.
- Open (chrome://extensions/) or select the menu More Tools > Extensions.
- Enable the developer mode at top right.
- Click Load unpacked extension... and select the source code folder.
- Make sure the Enabled checkbox is checked.
- You can now browse the web with XSSwat protection.

## Notes
- Currently only GET requests are supported
