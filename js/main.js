$(document).ready(init);

function init() {
	load_nav();
	var load_map_wrapper = function() {
		for (var i = 1; i <= 6; i++) {
			load_map('', "map" + i.toString());
			$("#map" + i.toString()).click(function(i) {
				return function() {
					$("body").data('map_id', i);
					$(".map").css('background', '#FFF');
					$(this).css('background', '#EFEFEF');
				}
			}(i));
		}
	}
	setTimeout(load_map_wrapper, 2000);
	$("#maps_hide").fadeIn('slow');
	$("#maps_hide").click(function() {
		$("#maps").hide('blind');
		$("#maps_hide").hide();
		$("#maps_show").show();
	});

	$("#maps_show").click(function() {
		$("#maps").show('blind');
		$("#maps_show").hide();
		$("#maps_hide").show();
	});

	$("body").data('map_id', 1);			// set active map id to 1 (by default)
	$("#map1").css('background', '#EFEFEF');

	//load_scatterplot({});
}

function datmax(arr) {
	var res = 0;
	for (key in arr) {
		if (arr[key] > res) {
			res = arr[key];
		}
	}
	return res;
}

function datmin(arr) {
	var res = 0;
	if (arr.hasOwnProperty('06073')) {
		res = arr["06073"];					// initialize res to value of SD County
	}
	if (res < 0) {
		res = 0;
	}
	for (key in arr) {
		if (arr[key] > 0 && arr[key] < res) {
			res = arr[key];
		}
	}
	return res;
}

function load_map(data, div_id) {
	// This choropleth map code was seeded off an example by Mike Bostock
	// using SVG data for backing map from Mike Bostock, Tom Carden, and
	// the United States Census Bureau.

	$("#" + div_id).html('');
	var path = d3.geo.path();

	var svg = d3.select("#" + div_id)
	.append("svg")
	.attr("id",div_id);
	
	var g = d3.select("#" + div_id + " svg").append("g");

	// define country and states svg groups
	var counties = g.append("g")
	.attr("id", "counties");

	var states = g.append("g")
	.attr("id", "states");

	var colorScale = d3.scale.quantile()
	.domain([datmin(data), datmax(data)])
	.range(colorbrewer.Reds[9]);

	rg = colorScale.range();
	dm = colorScale.quantiles().slice();
	dm.unshift(0);
	dm = dm.map(function(d) { return d.toFixed(2); });

	var legend = g.append("g")
	.attr("id", "legend")

	for (var i = 8; i >= 0; i -= 1) {
		var ypos = 20 + 15*(8-i);

		g.append("rect")
			.attr("x", "30")
			.attr("y", ypos)
			.attr("height", "10")
			.attr("width", "10")
			.attr("fill",rg[i].toString());

		g.append("text")
			.attr("text-anchor", "start")
			.attr("x", "43")
			.attr("y", ypos + 10)
			.attr("fill", "#AAAAAA")
			.attr("style", "font-family: 'PT Sans'; color: #666")
			.style("font", "12px \'PT Sans\'")
			.text(function () { return (i == 8) ? dm[8]+'+': dm[i]+'-'+dm[i+1]; });
	}
	
	d3.json("data/us-counties.json", function(json) {
		counties.selectAll("path")
		.data(json.features)
		.enter().append("path")
		.attr("fill", function(d) {return (!isNaN(data[d.id]) && data[d.id] >= 0) ? colorScale(data[d.id]) : "#CCCCCC";})
		.attr("d", path);

		counties.selectAll("path").append("title").text(function(d) {return "FIPS: "+d.id+"\n"+data[d.id];});
	});

	d3.json("data/us-states.json", function(json) {
		states.selectAll("path")
		.data(json.features)
		.enter().append("path")
		.attr("d", path);
	});

	counties.selectAll("path").attr("class", quantize);

	function quantize(d) {
		return "q" + Math.min(8, ~~(data[d.id] * 9 / 12)) + "-9";
	};
}

function load_scatterplot(data) {
	// adapted from: http://stackoverflow.com/questions/10440646/a-simple-scatterplot-example-in-d3-js 

    var width = 800;
    var height = 200;

    var chart = d3.select("#scatterplot")
		.append('svg')
		.attr('width', width)
		.attr('height', height);

	var g = chart.append("g");
	var points = g.append("g").attr("id", "scatter-dots");

	update_scatterplot(data);
}

function update_scatterplot(data) {
    var chart = d3.select("#scatterplot");

    var width = 800;
    var height = 200;
    var plotbuf = 20;

    //X axis represents state, so we take 1st to digits of the FIPS code
    var x = d3.scale.ordinal()
		.domain(Object.keys(data).map(function(s) {return s.slice(0,2);}))
          .rangePoints([ plotbuf, width-plotbuf ]);

    var y = d3.scale.linear()
          .domain([0, datmax(data)])
          .range([ height-plotbuf, plotbuf ])
		.clamp(true);

    var xaxis = d3.svg.axis()
		.scale(x)
		.orient('bottom');

    var yaxis = d3.svg.axis()
		.scale(y)
		.orient('left');

	var dots = chart.select('g').selectAll("scatter-dots").data(Object.keys(data));  // using the values in the ydata array
		dots.enter().append("circle")  // create a new circle for each value
		.attr("cy", function (d,i) { return (data[d]>0) ? y(data[d]) : -50; } ) // translate y value to a pixel
		.attr("cx", function (d,i) { return x(d.slice(0,2)); } ) // translate x value
		.attr("r", 2) // radius of circle
		.attr("fill", "#000000")
		.style("opacity", 0.6); // opacity of circle

	dots.exit().remove();
}

function load_parcoords(data) {
	var transdata = [];
	var i = 0;
	for (key in data) {
		if (data[key]<=0) continue;
		var o = {fips: key, val: data[key]};
		transdata[i++] = o;
	}

	var pc = d3.parcoords()("#coordspar")
		.data(transdata)
		.alpha(0.4)
		.render()
		.brushable()
		.reorderable();
}

function load_nav() {
	$.ajax({
		url: 'php/load_categories.php',
		dataType: 'json',
		async: false,
		success: function(data) {
			nav_html = '';
			for (var i = 0; i < data.length; i++) {
				nav_html += '<div class="nav_category" id="' + data[i]['name'] + '" style="display: none">' + data[i]['display_name'] + '</div>';
			}
			$("#nav1").html(nav_html);
			$(".nav_category").each(function(i) {
				$(this).delay(100*i).show('drop');
			});
		}
	});

	$(".nav_category").hover(
		function () {
   			$(this).css('background', '#666');
   			$(this).animate({'marginLeft': "+=20px"}, 100);
  		}, 
  		function () {
    		$(this).css('background', '#999');
    		$(this).animate({'marginLeft': "-=20px"}, 100);
		}
	);

	$(".nav_category").click(function() {
		load_category($(this).attr('id'));
	});

	$("#nav2").html('<span class="text_large"><br><br><br><br>Choose a category to begin browsing!</span>');
	$("#nav_hide").fadeIn('slow');

	$("#nav_hide").click(function() {
		$("#nav").hide('blind');
		$("#nav_hide").hide();
		$("#nav_show").show();
	});

	$("#nav_show").click(function() {
		$("#nav").show('blind');
		$("#nav_show").hide();
		$("#nav_hide").show();
	});
}

function load_category(category) {
	$.ajax({
		url: 'php/load_category.php',
		dataType: 'json',
		data: 'category=' + category,
		async: false,
		success: function(data) {
			nav_html = '';
			for (var i = 0; i < data.length; i++) {
				nav_html += '<div class="nav_attribute" id="' + data[i]['COLUMN_NAME'] + '">' + data[i]['COLUMN_NAME'] + '<div class="nav_attribute_description">' + data[i]['DESCRIPTION'] + '</div></div>';
			}
			$("#nav2").hide()
			$("#nav2").html(nav_html);
			$("#nav2").fadeIn('slow');
		}
	});

	$(".nav_attribute").hover(
		function () {
   			$(this).css('background', '#666');
  		}, 
  		function () {
    		$(this).css('background', '#CCC');
		}
	);

	$(".nav_attribute").click(function() {
		load_attribute($(this), category);
	});
}

function load_attribute(attribute_div, category) {
	$.ajax({
		url: 'php/load_attribute.php',
		dataType: 'json',
		data: 'category=' + category + '&attribute=' + attribute_div.attr('id'),
		async: false,
		success: function(data) {
			map_data = new Object();
			for (var i = 0; i < data.length; i++) {
				map_data[("0" + data[i]['State_FIPS_Code'].toString()).slice(-2) + ("00" + data[i]['County_FIPS_Code'].toString()).slice(-3)] = parseInt(data[i][attribute_div.attr('id')]);
			}

			$("#map" + $("body").data('map_id') + "_title").text(attribute_div.attr('id'));
			load_map(map_data, 'map' + $("body").data('map_id'));
			//update_scatterplot(map_data);
			//load_parcoords(map_data);
		}
	});
}
