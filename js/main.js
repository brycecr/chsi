$(document).ready(init);

function init() {
	load_map();
	load_attributes();
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
	var data; // loaded asynchronously

	var path = d3.geo.path();

	var svg = d3.select("#chart")
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
 
	d3.json("data/unemployment.json", function(json) {
			data = json;
			var colorScale = d3.scale.quantile()
			.domain([datmin(data), datmax(data)-10])
			.range(colorbrewer.Blues[9])

	rg = colorScale.range();

	var legendGradient = defs.append("linearGradient")
	.attr("id", "linenGrad");
	for (var i = 8; i >= 0; i -= 1) {
		legendGradient.append('stop').attr('stop-color',rg[i].toString()).attr('offset',1-i/8);
	}

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

function load_attributes() {
	$("#attributes").html('Hella Mortality and Stuff');
}
