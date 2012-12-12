$(document).ready(init);

function init() {
   	$.blockUI({												// block page until finished loading
   		css: {
	        padding: '15px', 
	        background: '#000',
	        opacity: '0.5',
	        'font-size': '150%',
	        color: '#FFF',
	        'text-align': 'center'
    	}, message: 
    		'<img src="images/loading.gif">Loading...<br><span class="text_small">Thank you for your patience!</span>'
    }); 

	$("body").data('map_ids_present', {});					// track map ids with data (key: map id, value: true/false)
	$("body").data('map_id_active', 1);						// set active map id to 1 (default)
	$("#map1").css('background', '#EFEFEF');

	var ajax_calls = function() {
		$.ajax({											// load state json data
			url: 'data/us-states.json',
			dataType: 'json',
			async: false,
			success: function(data) {
				$("body").data('states_json', data);

				$.ajax({									// load county json data
					url: 'data/us-counties.json',
					dataType: 'json',
					async: false,
					success: function(data) {
						$("body").data('counties_json', data);
						$("#top").children().fadeOut('fast');
						$.unblockUI();						// unblock page and show top and nav
						setTimeout(load_top, 800);
						setTimeout(load_nav, 1200);
						set_names();
						load_maps();
					}
				});
			}
		});
	}

	setTimeout(ajax_calls, 500);							// allows page to be blocked first
	setTimeout(set_names, 500);

}

function load_top() {
	$("#top_text1").show("drop", { direction: "up" }, 1000);
	$("#top_text2").show("drop", { direction: "right" }, 1000);
	$("#top_text3").fadeIn('slow');
}

function set_names() {
	var names = {};
	var county = $("body").data('counties_json').features;
	var states = $("body").data('states_json').features;
	var j = 0;
	for (var i = 0; i < county.length; ++i) {
		if (county[i].id.slice(0,2) != states[j].id) ++j;
		names[county[i].id] = county[i].properties.name + ", " + states[j].properties.name;
	}

	// Special rules for exceptional counties
	names["15005"] = "Kalawao, Hawaii";
	names["15007"] = "Kauai, Hawaii";
	names['25007'] = "Dukes, Massachusetts";
	names['25019'] = "Nantucket, Massachusetts";
	names['36085'] = "Richmond, New York";
	names['44005'] = "Newport, Rhode Island";
	names['51131'] = 'Northampton, Virginia';
	names['51515'] = 'Bedford, Virginia';
	names['51530'] = 'Buena Vista, Virginia';
	names['51540'] = 'Charlottesville, Virginia';
	names['51570'] = 'Colonial Heights, Virginia';
	names['51580'] = 'Covington, Virginia';
	names['51595'] = 'Emporia, Virginia';
	names['51600'] = 'Fairfax, Virginia';
	names['51610'] = 'Falls Church, Virginia';
	names['51620'] = 'Franklin, Virginia';
	names['51630'] = 'Fredericksburg, Virginia';
	names['51640'] = 'Galax, Virginia';
	names['51660'] = 'Harrisonburg, Virginia';
	names['51678'] = 'Lexington, Virginia';
	names['51683'] = 'Manassas, Virginia';
	names['51685'] = 'Manassas Park, Virginia';
	names['51690'] = 'Martinsville, Virginia';
	names['51720'] = 'Norton, Virginia';
	names['51750'] = 'Radford, Virginia';
	names['51775'] = 'Salem, Virginia';
	names['51790'] = 'Staunton, Virginia';
	names['51820'] = 'Waynesboro, Virginia';
	names['51830'] = 'Williamsburg, Virginia';
	names['51840'] = 'Winchester, Virginia';
	names['53029'] = 'Island, Washington';
	names['53055'] = 'San Juan, Washington';
	names['08014'] = 'Broomfield, Colorado';

	$('body').data('names', names);
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
		$("#nav").hide('blind', {}, 1000);
		$("#nav_hide").hide();
		$("#nav_show").show();
	});

	$("#nav_show").click(function() {
		$("#nav").show('blind', {}, 1000);
		$("#nav_show").hide();
		$("#nav_hide").show();
	});

	$("#maps_hide").fadeIn('slow');
	$("#maps_hide").click(function() {
		$("#maps").hide('blind', {}, 1000);
		$("#maps_hide").hide();
		$("#maps_show").show();
	});

	$("#maps_show").click(function() {
		$("#maps").show('blind', {}, 1000);
		$("#maps_show").hide();
		$("#maps_hide").show();
	});

	$("#parallel_coordinates").html('<br>Select two or more attributes to create a parallel coordinates graph!');
	$("#pcoords_hide").fadeIn('slow');
	$("#pcoords_hide").click(function() {
		$("#parallel_coordinates").hide('blind', {}, 1000);
		$("#pcoords_hide").hide();
		$("#pcoords_show").show();
	});

	$("#pcoords_show").click(function() {
		$("#parallel_coordinates").show('blind', {}, 1000);
		$("#pcoords_show").hide();
		$("#pcoords_hide").show();
	});

	$("#grid").html('<br>Select one or more attributes to create a data table!');
	$("#datatable_hide").fadeIn('slow');
	$("#datatable_hide").click(function() {
		$("#grid").hide('blind', {}, 1000);
		$("#datatable_hide").hide();
		$("#datatable_show").show();
	});

	$("#datatable_show").click(function() {
		$("#grid").show('blind', {}, 1000);
		$("#datatable_show").hide();
		$("#datatable_hide").show();
	});

	$("#scatterplots_container").html('<br>Select two or more attributes to create scatterplots!');
	$("#scatterplots_hide").fadeIn('slow');
	$("#scatterplots_hide").click(function() {
		$("#scatterplots_container").hide('blind', {}, 1000);
		$("#scatterplots_hide").hide();
		$("#scatterplots_show").show();
	});

	$("#scatterplots_show").click(function() {
		$("#scatterplots_container").show('blind', {}, 1000);
		$("#scatterplots_show").hide();
		$("#scatterplots_hide").show();
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
		$("#nav_hide").trigger('click');
		var map_id = $("body").data('map_id_active');
		load_attribute($(this).attr('id'), category);
	});
}

function load_attribute(attr_id, category) {
	$.ajax({
		url: 'php/load_attribute.php',
		dataType: 'json',
		data: 'category=' + category + '&attribute=' + attr_id,
		async: false,
		success: function(data) {
			map_data = new Object();
			for (var i = 0; i < data.length; i++) {
				map_data[("0" + data[i]['State_FIPS_Code'].toString()).slice(-2) + ("00" + data[i]['County_FIPS_Code'].toString()).slice(-3)] = parseInt(data[i][attr_id]);
			}

			var map_id = $("body").data('map_id_active');
			$("body").data("map_ids_present")[map_id] = true;			// update map_ids_present
			$("body").data('map' + map_id + '_data', map_data);			// update map_i_data
			$("body").data('map' + map_id + '_title', attr_id);			// update map_i_title
			$("#map" + map_id + "_title").html(attr_id + '<div class="map_title_option" id="map' + map_id + '_clear"><a href="javascript:void(0);">clear</a></div><div class="map_title_option" id="map' + map_id + '_expand"><a href="javascript:void(0);">expand</a></div>');
			update_map(map_data, 'map' + map_id, 0.4);
			load_parcoords();
			load_scatterplots();

			$("#map" + map_id + "_expand").click(function(map_id, attr_id) {
				return function() {
					$("#map_large_title").html(attr_id + '<div class="map_title_option" id="map_large_close"><a href="javascript:void(0);">close</a></div>');
					$("#map_large_container").css('top', $(document).scrollTop()+50);
					$("#map_large_container").css('left', ($(document).width()-820)/2);
					update_map(map_data, 'map_large', 1);
					$("#map_large_container").fadeIn('slow');

					$("#map_large_close").click(function() {
						$("#map_large_container").fadeOut('slow');
					});
				}
			}(map_id, attr_id));
			$("#map" + map_id + "_clear").click(function(map_id) {
				return function() {
					$("body").data('map' + map_id + '_data', {});
					$("body").data('map' + map_id + '_title', '');
					$("body").data('map_ids_present')[map_id] = false;
					$("#map" + map_id + "_title").html('');
					update_map({}, 'map' + map_id, 0.4);
					load_parcoords();
					load_scatterplots();
				}
			}(map_id));
		}
	});
}

function load_maps() {
	for (var i = 1; i <= 6; i++) {
		load_map('', "map" + i.toString(), 0.4);		// load maps with json data
		$("#map" + i.toString()).click(function(i) {
			return function() {
				$("body").data('map_id_active', i);
				$(".map").css('background', '#FFF');
				$(this).css('background', '#EFEFEF');
				$("#nav_show").trigger('click');
			}
		}(i));
	}
	load_map('', 'map_large', 1);
}

function load_map(data, div_id, scale) {
	// This choropleth map code was seeded off an example by Mike Bostock
	// using SVG data for backing map from Mike Bostock, Tom Carden, and
	// the United States Census Bureau.

	$("#" + div_id).html('');
	var path = d3.geo.path();

	var svg = d3.select("#" + div_id)
	.append("svg")
	.attr("width", 900)
	.attr("height", 500)
	.attr("id",div_id+"svg");
	
	var g = d3.select("#" + div_id + " svg").append("g");

	// define country and states svg groups
	var counties = g.append("g")
	.attr("id", "counties");

	var states = g.append("g")
	.attr("id", "states");

	var legend = g.append("g")
	.attr("id", "legend");

	var colorScale = d3.scale.quantile()
	.domain([datmin(data), datmax(data)])
	.range(colorbrewer.Reds[9]);

	rg = colorScale.range();
	dm = colorScale.quantiles().slice();

	counties.selectAll("path")
	.data($("body").data('counties_json').features)
	.enter().append("path")
	.attr("fill", "#DDDDDD")
	.attr("d", path);

	states.selectAll("path")
	.data($("body").data('states_json').features)
	.enter().append("path")
	.attr("d", path);

	g.attr("transform", "scale(" + scale + ")");
}

function update_map(data, div_id, scale) {
	var g = d3.select("#" + div_id+"svg").select("g");

	var colorScale = d3.scale.quantile()
	.domain([datmin(data), datmax(data)])
	.range(colorbrewer.Reds[9]);

	rg = colorScale.range();
	dm = colorScale.quantiles().slice();
	dm.unshift(0);
	dm = dm.map(function(d) { return d.toFixed(2); });

	var legend = g.select("#legend");
	legend.selectAll("text").remove();
	legend.selectAll("rect").remove();

	if (Object.keys(data).length > 0) {
		for (var i = 8; i >= 0; i -= 1) {
			var ypos = 20 + 15*(8-i);

			legend.append("rect")
				.attr("x", "30")
				.attr("y", ypos)
				.attr("height", "10")
				.attr("width", "10")
				.attr("fill",rg[i].toString());

			legend.append("text")
				.attr("text-anchor", "start")
				.attr("x", "43")
				.attr("y", ypos + 10)
				.attr("fill", "#AAAAAA")
				.attr("style", "font-family: 'PT Sans'; color: #666")
				.style("font", "12px \'PT Sans\'")
				.text(function () { return (i == 8) ? dm[8]+'+': dm[i]+'-'+dm[i+1]; });
		}
	}

	g.select("#counties").selectAll("path")
		.attr("fill", function(d) {return (!isNaN(data[d.id]) && data[d.id] >= 0) ? colorScale(data[d.id]) : "#CCCCCC";})
		.append("title").text(function(d) {return "FIPS: "+d.id+"\n"+data[d.id];});

	g.attr("transform", "scale(" + scale + ")");
}

function load_parcoords() {
	var num_maps = 0;
	for (var map_id in $("body").data('map_ids_present')) {
		if ($("body").data('map_ids_present')[map_id] == true) {
			num_maps += 1;
		}
	}

	if (num_maps < 2) {
		$("#parallel_coordinates").html('<br>Select two or more attributes to create a parallel coordinates graph!');
	}

	if (num_maps < 1) {
		$("#grid").html('<br>Select one or more attributes to create a data table!');
		return;
	}

	var transdata = [];						// array of objects, each object contains set of associated key/val pairs

	var is_first_pass = true;
	for (var map_id in $("body").data('map_ids_present')) {
		if ($("body").data('map_ids_present')[map_id] == false) {
			continue;
		}

		data = $("body").data('map' + map_id + '_data');
		attr_id = $("body").data('map' + map_id + '_title');

		if (is_first_pass) {				// save county names for data table
			var k = 0;
			for (key in data) {
				transdata[k] = {};
				transdata[k]["County Name"] = $('body').data('names')[key];
				// transdata[k]["FIPS Code"] = key;
				k++;
			}
			is_first_pass = false;
		}

		var i = -1;
		for (key in data) {
			i += 1;
			if (data[key] < 0) {
				continue;
			} else if (transdata[i] instanceof Object == true) {
				transdata[i][attr_id] = data[key];
			} else {
				transdata[i] = {};
				transdata[i][attr_id] = data[key];
			}
		}
	}

	// update color of parcoords
	function change_color(dimension) { 
		pc.svg.selectAll(".dimension")
			.style("font-weight", "normal")
			.filter(function(d) { return d == dimension; })
			.style("font-weight", "bold")

			pc.color(zcolor(pc.data(),dimension)).render()
	};

	// return color function based on plot and dimension
	function zcolor(col, dimension) {
		var z = zscore(_(col).pluck(dimension).map(parseFloat))
			return function(d) { return zcolorscale(z(d[dimension])) }
	};

	// color by zscore
	function zscore(col) {
		var n = col.length,
		    mean = _(col).mean(),
		    sigma = _(col).stdDeviation();
		return function(d) {
			return (d-mean)/sigma;
		};
	};

	if (num_maps >= 2) {
		$("#parallel_coordinates").html('');
		var pc = d3.parcoords()("#parallel_coordinates");
		pc = pc.data(transdata, String)
			.autoscale()
			.createAxes() // I guess we have to do this for the first load
			.autoscale()
			.alpha(0.4)
			.mode("queue")
			.render()
			.createAxes()
			.brushable()
			.shadows()
			.reorderable();

		// click label to activate coloring
		pc.svg.selectAll(".dimension")
			.on("click", change_color)
			.selectAll(".label")
			.style("font-size", "14px");

		var zcolorscale = d3.scale.linear()
			.domain([-2,-0.5,0.5,2])
			.range(colorbrewer.Reds[4])
			.clamp(true)
			.interpolate(d3.interpolateLab);

		change_color(pc.dimensions()[0]);

		$("#grid").html('');
		var grid = d3.divgrid();
		d3.select('#grid')
			.datum(transdata)
			.call(grid)
			.selectAll(".row")
			.on({"mouseover" : function(d){pc.highlight([d]);},
					"mouseout" : pc.unhighlight});

		pc.on("brush", function(d) {
			d3.select("#grid")
			.datum(d)
			.call(grid)
			.selectAll(".row")
			.on({"mouseover": function(d) { pc.highlight([d]) },
				"mouseout": pc.unhighlight
				});
			});
	} else {
		$("#grid").html('');
		var grid = d3.divgrid();
		d3.select('#grid')
			.datum(transdata)
			.call(grid);
	}
};

function load_scatterplots() {
	// adapted from: http://alignedleft.com/tutorials/d3/making-a-scatterplot/ 
	var num_maps = 0;
	var map_ids = [];
	for (var map_id in $("body").data('map_ids_present')) {
		if ($("body").data('map_ids_present')[map_id] == true) {
			num_maps += 1;
			map_ids.push(map_id);
		}
	}

	if (num_maps < 2) {
		$("#scatterplots_container").html('<br>Select two or more attributes to create scatterplots!');
		return;
	}

	$("#scatterplots_container").html('');
	var counter = 1;
    var dataset = [];
	for (var i = 0; i < num_maps-1; i++) {
		var data1 = $("body").data('map' + map_ids[i].toString() + '_data');
		for (var j = i+1; j < num_maps; j++) {
			dataset = [];
			var data2 = $("body").data('map' + map_ids[j].toString() + '_data');
			for (key in data1) {
				if (key in data2) {
					dataset.push([data1[key], data2[key]]);
				}
			}

			$("#scatterplots_container").append('<div class="scatterplot" id="scatterplot' + counter.toString() + '"></div>');
			var w = 400; var h = 350; var padding_x = 70; var padding_y = 30; 
			var svg = d3.select("#scatterplot" + counter.toString())
            .append("svg")
            .attr("width", w)
            .attr("height", h);

            var xScale = d3.scale.linear()
            .domain([d3.min(dataset, 
				function(d) { if (d[0]>=0) return d[0]; }), 
				d3.max(dataset, function(d) { return d[0]; })])
           	.range([padding_x, w - padding_x * 2]);

           	var yScale = d3.scale.linear()
            .domain([d3.min(dataset, function(d) { if (d[1]>=0) return d[1]; }), 
				 d3.max(dataset, function(d) { return d[1]; })])
            .range([h - padding_y, padding_y]);

            svg.selectAll("circle")
			.data(dataset)
			.enter()
			.append("circle")
			.attr("cx", function(d) {
				return xScale(d[0]);
			})
			.attr("cy", function(d) {
			    return yScale(d[1]);
			})
			.attr("r", 2)
			.attr("fill", "#333");

			var xAxis = d3.svg.axis()
            .scale(xScale)
            .orient("bottom")
            .ticks(5);

            var yAxis = d3.svg.axis()
            .scale(yScale)
            .orient("left")
            .ticks(5);

			svg.append("g")
    		.attr("class", "scatterplot_axis")
    		.attr("transform", "translate(0," + (h - padding_y) + ")")
   			.call(xAxis);

   			svg.append("g")
    		.attr("class", "scatterplot_axis")
    		.attr("transform", "translate(" + padding_x + ",0)")
    		.call(yAxis);

    		svg.append("text")
		    .attr("class", "scatterplot_label")
		    .attr("text-anchor", "start")
		    .attr("x", w - 120)
		    .attr("y", h - 10)
		    .text($("body").data('map' + map_ids[i].toString() + '_title'));

		    svg.append("text")
		    .attr("class", "scatterplot_label")
		    .attr("text-anchor", "end")
		    .attr("y", 85)
		    .attr("transform", "rotate(-90)")
		    .text($("body").data('map' + map_ids[j].toString() + '_title'));

			counter += 1;
		}
	}
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
