$(document).ready(function(){
	var navLinks = $('.nav-links');
	navLinks.click(function(e){
		e.preventDefault();
		openCloseNav();
		$('body,html').animate({
			scrollTop: $(this.hash).offset().top
		}, 500);
	});
	var scrollLinks = $('.scroll-links');
	scrollLinks.click(function(e){
		e.preventDefault();
		$('body,html').animate({
			scrollTop: $(this.hash).offset().top
		}, 500);
	});

	var btnTeamSelectors = $('.btn-team-selector');
	var teams = $('.teams');
	var currentTeam = teams.eq(0);
	var currentSelector = btnTeamSelectors.eq(0);
	currentTeam.css('display','flex');
	currentSelector.css('background','#ff4b5a');
	currentSelector.css('background','white');
	currentSelector.css('color','#ff4b5a');

	btnTeamSelectors.eq(0).click(function(){
		currentSelector.css('background','#ff4b5a');
		currentSelector.css('color','black');
		currentTeam.css('display','none');
		teams.eq(0).css('display', 'flex');
		currentTeam = teams.eq(0);
		currentSelector = btnTeamSelectors.eq(0);
		currentSelector.css('background','white');
		currentSelector.css('color','#ff4b5a');
	});
	
	btnTeamSelectors.eq(1).click(function(){
		currentSelector.css('background','#ff4b5a');
		currentSelector.css('color','black');
		currentTeam.css('display','none');
		teams.eq(1).css('display', 'flex');
		currentTeam = teams.eq(1);
		currentSelector = btnTeamSelectors.eq(1);
		currentSelector.css('background','white');
		currentSelector.css('color','#ff4b5a');
	});
	btnTeamSelectors.eq(2).click(function(){
		currentSelector.css('background','#ff4b5a');
		currentSelector.css('color','black');
		currentTeam.css('display','none');
		teams.eq(2).css('display', 'flex');
		currentTeam = teams.eq(2);
		currentSelector = btnTeamSelectors.eq(2);
		currentSelector.css('background','white');
		currentSelector.css('color','#ff4b5a');
	});
	btnTeamSelectors.eq(3).click(function(){
		currentSelector.css('background','#ff4b5a');
		currentSelector.css('color','black');
		currentTeam.css('display','none');
		teams.eq(3).css('display', 'flex');
		currentTeam = teams.eq(3);
		currentSelector = btnTeamSelectors.eq(3);
		currentSelector.css('background','white');
		currentSelector.css('color','#ff4b5a');
	});
});

function openCloseNav(){
	$(".nav-ham").toggleClass("nav-ham-aimateIn");
	$(".on-nav-rotate").toggleClass("on-nav-rotate-animateIn");
	$(".link1").toggleClass("nav-link1-animateIn");
	$(".link2").toggleClass("nav-link2-animateIn");
	$(".link3").toggleClass("nav-link3-animateIn");
	$(".link4").toggleClass("nav-link4-animateIn");
	$(".link5").toggleClass("nav-link5-animateIn");
}