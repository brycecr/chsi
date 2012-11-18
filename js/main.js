$(document).ready(init);

function init() {
	load_map();
	load_attributes();
}

function load_map() {
	var data; // loaded asynchronously

	var path = d3.geo.path();

	var svg = d3.select("#chart")
	.append("svg");
	
	var g = d3.select("svg").append("g");

	var defs = g.append("defs");

	var legendGradient = defs.append("linearGradient")
	.attr("id", "linenGrad");
	legendGradient.append('stop').attr('stop-color',"#F60").attr('offset',"0");
	legendGradient.append('stop').attr('stop-color',"#FF6").attr('offset',"1");

	var counties = g.append("g")
	.attr("id", "counties")
	.attr("class", "GnBu");

	var states = g.append("g")
	.attr("id", "states");

	var rect = g.append("rect")
	.attr("fill","url(#linenGrad)")
	.attr("stroke","black")
	.attr("stroke-width","5")
	.attr("x","100")
	.attr("y","100")
	.attr("width","600")
	.attr("height","200");

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

function load_attributes() {
	$("#attributes").html('Hella Mortality and Stuff');
}
