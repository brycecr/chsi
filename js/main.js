$(document).ready(init);

function init() {
	load_nav();

	var load_map_wrapper = function() {
		load_map();
	}
	setTimeout(load_map_wrapper, 1000);
}

function load_map() {
	var data; // loaded asynchronously

	var path = d3.geo.path();

	var svg = d3.select("#map")
	.append("svg");

	var counties = svg.append("g")
	.attr("id", "counties")
	.attr("class", "RdYlGn");

	var states = svg.append("g")
	.attr("id", "states");

	d3.json("data/us-counties.json", function(json) {
			counties.selectAll("path")
			.data(json.features)
			.enter().append("path")
			.attr("class", data ? quantize : null)
			.attr("d", path);
			});

	d3.json("data/us-states.json", function(json) {
			states.selectAll("path")
			.data(json.features)
			.enter().append("path")
			.attr("d", path);
			});

	d3.json("data/unemployment.json", function(json) {
			data = json;
			counties.selectAll("path")
			.attr("class", quantize);
			});

	function quantize(d) {
		return "q" + Math.min(8, ~~(data[d.id] * 9 / 12)) + "-9";
	}
}

function load_nav() {
	$.ajax({
		url: 'php/load_categories.php',
		dataType: 'json',
		async: false,
		success: function(data) {
			nav_html = '';
			for (i = 0; i < data.length; i++) {
				nav_html += '<div class="nav_category" id="' + data[i]['name'] + '" style="display: none">' + data[i]['display_name'] + '</div>';
			}
			$("#nav").html(nav_html);
			$(".nav_category").each(function(i) {
				$(this).delay(50*i).toggle("slide", {"direction": "left"});
			});
		}
	});

	$(".nav_category").hover(
		function () {
   			$(this).css('background', '#666');
   			$(this).animate({'marginLeft': "+=20px"}, 100);
  		}, 
  		function () {
    		$(this).css('background', '#CCC');
    		$(this).animate({'marginLeft': "-=20px"}, 100);
		}
	);

	$(".nav_category").click(function() {
		load_category($(this).attr('id'));
	});
}

function load_category(category) {
	$.ajax({
		url: 'php/load_category.php',
		dataType: 'json',
		data: 'category=' + category,
		async: false,
		success: function(data) {
			nav_html = '<div id="nav_back">Back</div>';
			for (i = 0; i < data.length; i++) {
				nav_html += '<div class="nav_category" id="' + data[i]['COLUMN_NAME'] + '" style="display: none">' + data[i]['COLUMN_NAME'] + '<br><span style="font-size: 60%">' + data[i]['DESCRIPTION'] + '</span></div>';
			}
			$("#nav").html(nav_html);
			$(".nav_category").each(function(i) {
				$(this).delay(50*i).toggle("slide", {"direction": "left"});
			});
		}
	});

	$("#nav_back").hover(
		function () {
   			$(this).css('background', '#666');
  		}, 
  		function () {
    		$(this).css('background', '#CCC');
		}
	);

	$("#nav_back").click(function() {
		load_nav();
	});

	$(".nav_category").hover(
		function () {
   			$(this).css('background', '#666');
   			$(this).animate({'marginLeft': "+=20px"}, 100);
  		}, 
  		function () {
    		$(this).css('background', '#CCC');
    		$(this).animate({'marginLeft': "-=20px"}, 100);
		}
	);
}
