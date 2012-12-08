$(document).ready(init);

function init() {
	load_map('')
	load_scatterplot({});
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
	
	//From a quick glance, San Diego County does a good job reporting.
	//So we initialize to that to avoid initing to a negative value
	var res = 0;
	if (arr.hasOwnProperty('06073')) {
		res = arr["06073"]; //this line assumes arr is county fips deyed data
	} 
	if (res < 0) {
		console.log("San Diego N/A Data Error");
		res = 0;
	}
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

	svg.attr("id","map");
	
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
		var o = {fips: key, val: data[key]};
		transdata[i] = o;
	}

	var pc = d3.parcoords()("#coordspar")
		.data(transdata)
		.render()
		.createAxes();

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
			update_scatterplot(map_data);
			load_parcoords(map_data);
		}
	});
}
