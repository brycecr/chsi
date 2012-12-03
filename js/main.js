$(document).ready(init);

function init() {
	load_map('')
	load_nav();
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
	for (key in arr) {
		if (arr[key] > 0 && arr[key] < res) {
			res = arr[key];
		}
	}
	return res;
}

function load_map(data) {
	// This choropleth map code was seeded off an example by Mike Bostock
	// using SVG data for backing map from Mike Bostock, Tom Carden, and
	// the United States Census Bureau.

	$("#map").html('');
	console.log(data);

	var path = d3.geo.path();

	var svg = d3.select("#map")
	.append("svg");
	
	var g = d3.select("svg").append("g");

	// define country and states svg groups
	var counties = g.append("g")
	.attr("id", "counties");

	var states = g.append("g")
	.attr("id", "states");
	// end define country and states svg groups

	var colorScale = d3.scale.quantile()
	.domain([datmin(data), datmax(data)])
	.range(colorbrewer.Reds[9]);

	rg = colorScale.range();
	dm = colorScale.quantiles();
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

	var xdata = [5, 10, 15, 20];
    var ydata = [3, 17, 4, 6];

    var x = d3.scale.linear()
          .domain([0, d3.max(xdata)])
          .range([ 0, width ]);

    var y = d3.scale.linear()
          .domain([0, d3.max(ydata)])
          .range([ height, 0 ]);

    var chart = d3.select("scatterplot")
		.append('svg:svg')
		.attr('width', 400)
		.attr('height', 400)
	};

	var xaxis = d3.svg.axis()
		.scale(x)
		.orient('bottom');

	var yaxis = d3.svg.axis()
		.scale(y)
		.orient('left');

	var g = main.append("svg:g");

	g.selectAll("scatter-dots")
		.data(ydata)  // using the values in the ydata array
		.enter().append("svg:circle")  // create a new circle for each value
	    	.attr("cy", function (d) { return y(d); } ) // translate y value to a pixel
	    	.attr("cx", function (d,i) { return x(xdata[i]); } ) // translate x value
	    	.attr("r", 10) // radius of circle
	    	.style("opacity", 0.6); // opacity of circle

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
			$("#nav").html(nav_html);
			$(".nav_category").each(function(i) {
				$(this).delay(50*i).toggle("slide", {"direction": "right"});
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
			for (var i = 0; i < data.length; i++) {
				nav_html += '<div class="nav_category" id="' + data[i]['COLUMN_NAME'] + '" style="display: none">' + data[i]['COLUMN_NAME'] + '<br><span style="font-size: 60%">' + data[i]['DESCRIPTION'] + '</span></div>';
			}
			$("#nav").html(nav_html);
			$(".nav_category").each(function(i) {
				$(this).delay(50*i).toggle("slide", {"direction": "right"});
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

	$(".nav_category").click(function() {
		$(this).animate({'marginLeft': "-=20px"}, 100);
		load_attribute($(this), category);
	});
}

function load_attribute(attribute_div, category) {
	$("#nav").html('<div id="nav_back" style="display: none">Back</div>');
	attribute_div.css('display', 'none');
	$("#nav").append(attribute_div);
	$("#nav_back").fadeIn('slow');
	attribute_div.fadeIn('slow');

	$("#nav_back").hover(
		function () {
   			$(this).css('background', '#666');
  		}, 
  		function () {
    		$(this).css('background', '#CCC');
		}
	);

	$("#nav_back").click(function() {
		load_category(category);
	});

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
			load_map(map_data);
			load_scatterplot(map_data);
		}
	});
}
