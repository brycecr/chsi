$(document).ready(init);

function init() {
	load_nav();

	var load_map_wrapper = function() {
		load_map();
	}
	setTimeout(load_map_wrapper, 1000);
}


function datmax(arr) {
	var res = 0;
	for (key in arr) {
		if (arr[key] > res) {
			res = arr[key];
		}
	}
	console.log("max" + res);
	return res;
}

function datmin(arr) {
	var res = 0;
	for (key in arr) {
		if (arr[key] < res) {
			res = arr[key];
		}
	}
	console.log("min" + res);
	return res;
}

function load_map() {
	//This choropleth map code was seeded off an example by Mike Bostock
	//using SVG data for backing map from Mike Bostock, Tom Carden, and
	//the United States Census Bureau.
	var data; 

	var path = d3.geo.path();

	var svg = d3.select("#map")
	.append("svg");
	
	var g = d3.select("svg").append("g");

	//Define Legend
	var defs = g.append("defs");

	var rect = g.append("rect")
	.attr("fill","url(#linenGrad)")
	.attr("x","20")
	.attr("y","-40")
	.attr("width","160")
	.attr("height","20")
	.attr("transform","rotate(90)");
	//End Define Legend
	

	//define country and states svg groups
	var counties = g.append("g")
	.attr("id", "counties");

	var states = g.append("g")
	.attr("id", "states");
	//end define country and states svg groups
 
	//deal with data synchronously
	d3.json("data/unemployment.json", function(json) {
			data = json;
			var colorScale = d3.scale.quantile()
			.domain([datmin(data), datmax(data)])
			.range(colorbrewer.Blues[9])

	rg = colorScale.range();

	var legendGradient = defs.append("linearGradient")
	.attr("id", "linenGrad");
	for (var i = 8; i >= 0; i -= 1) {
		legendGradient.append('stop').attr('stop-color',rg[i].toString()).attr('offset',1-i/8);
	}

	g.append("text")
	.attr("text-anchor", "start")
	.attr("x", "43")
	.attr("y", "30")
	.attr("fill", "#AAAAAA")
	.attr("style", "font-family: 'PT Sans'; color: #666")
	.style("font", "12px \'PT Sans\'")
	.text(datmax(data))

	g.append("text")
	.attr("text-anchor", "start")
	.attr("x", "43")
	.attr("y", "190")
	.attr("fill", "#AAAAAA")
	.attr("style", "font-family: 'PT Sans'; color: #666")
	.style("font", "12px \'PT Sans\'")
	.text(datmin(data))
	

	d3.json("data/us-counties.json", function(json) {
			counties.selectAll("path")
			.data(json.features)
			.enter().append("path")
			.attr("fill", function(d) {return colorScale(data[d.id]);})
			.attr("d", path);
			});

	d3.json("data/us-states.json", function(json) {
			states.selectAll("path")
			.data(json.features)
			.enter().append("path")
			.attr("d", path);
			});
	});
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
