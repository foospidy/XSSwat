# XSSwat
Chrome extension to prevent visiting web pages that are known to be vulnerable to XSS. This is somewhat of an experimental concept. Sites with known vulnerabilities are defined by postings from https://www.reddit.com/r/xss/. Big brand sites are often reported as vulnerable and could be used in attacks or phishing campaigns to attack users.

## Approach
The extension generates a signature for every URL requested. The signature is based on the full URL path and all parameters names. Then a call is made to a hosted service at riskdiscovery.com to check if that signature matches a signature of a vulnerable URL reported at https://www.reddit.com/r/xss/. If there is a match the browser is redirected to a warning page on riskdiscovery.com.

## Installation (Unpacked Extension)
- Download and unzip/save folder containing extension files.
- Open (chrome://extensions/) or select the menu More Tools > Extensions.
- Enable the developer mode at top right.
- Click Load unpacked extension... and select the source code folder.
- Make sure the Enabled checkbox is checked.
- You can now browse the web with XSSwat protection.

## Notes
- Currently only GET requests are supported
