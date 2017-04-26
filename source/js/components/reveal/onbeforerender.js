// This script is inlined just inside the body tag.
// document.readystate, window.onload, and jQuery.ready fires
// later and cannot be used in this situation
// It is render blocking so keep it to a minimum

// Only enhance if we are not logged in to Sitecore
if(!window.Sitecore) {
	var el = document.querySelector('body');
	el.classList.add('is-visually-enhanced');
}