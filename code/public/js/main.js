 
    var fill = d3.scale.category10();  
  $('#btn').click(
  function () {
    var msv = $('#msv').val();   
    
    
	
	$.getJSON('check/' + msv, function(data) {
		  if (data) {
		  $('#tags').empty();
			callback();
		  }
		  else 
			alert('No student');
	});
	
	function callback() {

		 

		var vis = d3.select('#tags').append('svg:g');  

			d3.json('/get/' + msv, function(json) {
			   
			  
  			var parsed = {}			  
			  	
			  	parsed['tuchon'] = {};
			  	parsed['tuchon']['nodes']= [];
			  	parsed['batbuoc'] = {};
			  	parsed['batbuoc']['nodes'] = [];
			  for (var i = 0,ilen = json.nodes.length; i < ilen; i++){			  	
			  	var item = json.nodes[i];
			  	if (item['tuchon'] == 0) {
			  		parsed['batbuoc']['nodes'].push(item);
			  	} else {
			  		parsed['tuchon']['nodes'].push(item);
			  	}
			  	
			  }
				
			  

				var dis = 500;
			  var force = d3.layout.force()
				.charge(-2000)
				.distance(500)  
				.gravity(0.05)
				.nodes(json.nodes)
				.links(json.links)
				.size([dis * 2, dis * 6])
				.start();
			

				
			  var link = vis.selectAll('line.link')
				  .data(json.links)
				.enter().append('svg:line')
				  .attr("class", "link")  					  
					.attr("stroke", "black")	
					.style('stroke-width', "2")			 
				  .attr("x1", function(d) { return d.source.x; })
				  .attr("y1", function(d) { return d.source.y; })
				  .attr("x2", function(d) { return d.target.x; })
				  .attr("y2", function(d) { return d.target.y; })
				  ;
			
			  
			  var node = vis.selectAll("circle.node")
				 // .data(json.nodes)
				 .data(parsed['batbuoc']['nodes'])
				.enter().append("svg:circle")
				  .attr("class", "node")
				  .attr("name", function(d) { return d.name; })
				  .attr("cx", function(d) { return d.x; })
				  .attr("cy", function(d) { return d.y ; })
				  .attr("r", 40)
				  .style("fill", function(d) { return d.color; })				
				  .call(force.drag);
				 
			 var node2 = vis.selectAll("rect.node")
				 // .data(json.nodes)
				 .data(parsed['tuchon']['nodes'])
				.enter().append("svg:rect")				  
				  .attr("name", function(d) { return d.name; })
				  .attr("x", function(d) { return d.x; })
				  .attr("y", function(d) { return d.y ; })
				  .attr("width", 70)
				  .attr("height", 70)
				  .style("fill", function(d) { return d.color; })				
				  .call(force.drag); 

				var text = vis.selectAll("text")
					.data(json.nodes)
					.enter().append("svg:text")
					.attr("x", function(d) { return d.x ; })
					.attr("y", function(d) { return d.y ; })
					.attr("stroke", function(d) {
						if (d.tuchon == 1)
						 return 'orange'; 
						else return 'black';
					})
					.text(function(d) { return  d.name ; })
					.attr("font-size","40")
					.call(force.drag);
				
			   node.append('title')
				  .text(function(d) { return 'Mã môn:\t' + d.mamon +
				  		 '\nSố tín chỉ:\t' + d.dvht + 
						 '\nKhối kiến thức:\t' + d.khoikienthuc +
						 '\nNhóm tự chọn:\t' + d.tuchon +
						  '\nTên nhóm:\t' + d.tennhom; });
				  node2.append('title')
				  .text(function(d) { return 'Mã môn:\t' + d.mamon +
				  		 '\nSố tín chỉ:\t' + d.dvht + 
						 '\nKhối kiến thức:\t' + d.khoikienthuc +
						 '\nNhóm tự chọn:\t' + d.somontuchon  +
						 '\nTên nhóm:\t' + d.tennhom; });
		   
				
			
			  force.on("tick", function(e) {    



				node.each(function(d) { 			
					d.x += ((5-d.group) * dis - d.x) ; 	
					d.x = dis * 5 - d.x;		
					d.x -= 400; 			 
				});
				node2.each(function(d) { 			
					d.x += ((5-d.group) * dis - d.x) ; 	
					d.x = dis * 5 - d.x;		
					d.x -= 400; 			 
				});
				text.each(function(d) { 			
					d.x += ((5-d.group) * dis - d.x) ; 	
					d.x = dis * 5 - d.x;
					d.x -= 400;
				});
				
				link.
				attr("x1", function(d) { return d.source.x; })
					.attr("y1", function(d) { return d.source.y ; })
					.attr("x2", function(d) { return d.target.x; })
					.attr("y2", function(d) { return d.target.y  ; })
					.attr("marker-end","url(#arrow)");
			  
				node.attr("cx", function(d) { return d.x ; })
					.attr("cy", function(d) { return d.y ; });

				node2.attr("x", function(d) { return d.x - 35 ; })
					.attr("y", function(d) { return d.y - 35 ; });
				
				text.attr("x", function(d) { return d.x + 35; })
					.attr("y", function(d) { return d.y + 10; });
			  });

			});
		}
	});
	