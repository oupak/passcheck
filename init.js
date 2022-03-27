var elem;
var breached;
var count;
var inputdetected = false;

var tooltip = document.createElement("span");
pwdfields = [];
var exists = false;

document.addEventListener('focus', function(e){
	elem = e.target;
	var rect = elem.getBoundingClientRect();
	if (elem.type.toLowerCase() === "password") {
		pwdfields.forEach(function(i) {
			if (i == elem) {
				exists = true;
			}
		})
		if (!exists) {
			elem.addEventListener('input', function checkpwd() {
				if (e.target.value == "") {
					tooltip.style.opacity = 0;
				}
				else {
					logSha1(e.target.value);
				}
			})
			pwdfields.push(elem)
		}
		exists = false;
		tooltip.setAttribute('id', 'pwdcheck-tooltip');
		tooltip.style.top = rect.top+"px";
		tooltip.style.left = rect.right+"px";
		tooltip.innerHTML = `
			<div id="pwdcheckCont">
				<img id="pwdcheckicon">
				<div>
					<p id="pwdcheck-popularity"></p>
					<p id="pwdcheck-message"></p>
				</div>
			</div>
		`;
		document.body.appendChild(tooltip)
	}
}, true);

document.addEventListener("focusout", function() {
	tooltip.style.opacity = 0;
})

// source: https://stackoverflow.com/a/50030304/
async function logSha1( str ) {
  const buffer = new TextEncoder( 'utf-8' ).encode( str );
  const digest = await crypto.subtle.digest('SHA-1', buffer);

  // Convert digest to hex string
  const result = Array.from(new Uint8Array(digest)).map( x => x.toString(16).padStart(2,'0') ).join('');

  findMatches(result);
}

function findMatches(pwd) {
	breached = false;
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if (xhr.readyState == XMLHttpRequest.DONE) {
			//console.log(pwd.slice(-5));
			xhr.responseText.split('\n').forEach( function(breachedpwd) {
				if (breachedpwd.split(':')[0] == pwd.slice(-35).toUpperCase()) {
					count = breachedpwd.split(':')[1].split('\r')[0];
					breached = true;
				}
			})
			if (breached == true) {
				document.getElementById('pwdcheck-popularity').innerHTML = 'That password has been used <b>'+count+'</b>+ times';
				document.getElementById('pwdcheck-message').innerHTML = 'Consider choosing another one.';
				pwdcheckicon.src = chrome.runtime.getURL("trash.png");
				tooltip.style.opacity = 1;
			}
			else {
				document.getElementById('pwdcheck-popularity').innerHTML = 'No records of this password being used before';
				document.getElementById('pwdcheck-message').innerHTML = '';
				pwdcheckicon.src = chrome.runtime.getURL("lock.png");
				tooltip.style.opacity = 1;
			}
		}
	}
	xhr.open("GET", "https://api.pwnedpasswords.com/range/"+pwd.slice(0,5));
	xhr.send(null);
}
