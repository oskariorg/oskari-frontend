# Usage notes for tools

Install with

	npm install

If you are behind corporate proxy, configure npm and prompt with proxy settings:

	npm config set proxy http://domain:port
	npm config set https-proxy http://domain:port

For windows command prompt:

	set HTTP_PROXY=http://domain:port
	set HTTPS_PROXY=http://domain:port

For Linux/OSX:

	export http_proxy=http://domain:port
	export https_proxy=https://domain:port

Note! npm doesn't support Cygwin environment so you might be better off installing in windows prompt. Also check windows PATH environment variable so at the Windows installed Git cmd folder is previously than cygwin bin folder (if these are wrong order npm install also can fail).
Running Grunt etc after install works correctly on Cygwin also.

## Trimming trailing spaces from code

Run command:

	npm run trim
