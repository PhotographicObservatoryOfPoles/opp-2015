$(document).ready(function() {

  /*-- FUNCTIONS */
  /* Draw the world map with world.json data */
  function drawWorld() {
    d3.json("../sites/all/themes/opp/js/data/world.json", function(error, world) {
      g.append("path")
       .datum({type: "Sphere"})
       .attr("class", "sphere")
       .attr("d", path);

      g.append("path")
       .datum(topojson.merge(world, world.objects.countries.geometries))
       .attr("class", "land")
       .attr("d", path);

      g.append("path")
       .datum(topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; }))
       .attr("class", "boundary")
       .attr("d", path);
    });
  }

  /* Draw the points map with json data generated by Drupal View (@param url) */
  function drawItems(url) {
    $(".item").remove();
    $(".fo_tooltip").remove();   

    d3.json(url, function(error, item) {
      // path (item) creation
      g2.selectAll('.item')
      .data(item.features)
      .enter()
        .append('path')
          //.attr('d', path.pointRadius(sizePoint))
          .attr('class', function(d) { 
            numero_tag++; 
            return "item tag_"+item.features[numero_tag].properties.tag 
                    + " " + item.features[numero_tag].properties.type; 
          })
          .attr('url_item', function(d) { 
            numero_path++; 
            return item.features[numero_path].properties.path.replace(/\\/g, ''); 
          })
          .attr('url_image', function(d) { 
            numero_image++; 
            return item.features[numero_image].properties.vignette.replace(/\\/g, ''); 
          })
          .attr('name', function(d) { 
            numero_name++; 
            return item.features[numero_name].properties.name.replace(/\\/g, ''); 
          })
          .attr('id', function(d) { 
            numero_id++; 
            return item.features[numero_id].properties.id; 
          })
          .attr('type', function(d) { 
            numero_type++; 
            return item.features[numero_type].properties.type; 
          })
          ;

        resizePoints();
        // tooltip creation        
        if (navigator.userAgent.indexOf('MSIE') != -1){
          IEcreateTooltips();
          IEdisplayTooltip();

        }
        else{
          createTooltips();
          displayTooltip();
        }

        fixImageUrl();

    });

  }

  // creation tooltip FOR IE
  function IEcreateTooltips(){
    // construction des tooltips
      $('svg path.item').each(function(){

        var stringType;

        /*select type of fo*/
        if ($(this).attr('type') == "gallery"){
          stringType = gallerieText_Fr;
        }
        else if ($(this).attr('type') == "expedition"){
          stringType = expeditionText_Fr;
        }

        $('.map-zone').append('<div class="ie_fo_tooltip grid-3" id="'+$(this).attr('id')+'"><div class="info_item"><p class="type_item">'+stringType+'</p><a href='+ $(this).attr('url_item')+'><h2>'+$(this).attr('name')+'</h2><img class="img_item" src="'+$(this).attr('url_image')+'" /><button type="button" class="discover-button">'+btnText_Fr+'</button></a></div></div>');



      }); // end foreignObject

      
      $('.map-zone').css({
        'min-height': '500px'
      });

      /*
      $('.context-arctic-map #region-sidebar-left').css({
        'display': 'none'
      });
      */

      $('.map-zone .ie_fo_tooltip').css({
        'text-transform': 'uppercase',
        'position': 'absolute',
        'margin-top' : '100px',
        'margin-left' : (width-foWidth-20)+'px',
        //'padding-left' : '100px',
        'visibility': 'hidden',
        'width': foWidth+'px',
        'display': 'block',
        'top ': '30px',
        'background': 'rgba(255, 255, 255, 0.8)' // surcharge du body principal
      });

      $('.map-zone .ie_fo_tooltip p.type_item').css({
        'margin' : 'auto',
        'padding': '5px 0 0',
        'width': '90%'
      });

      $('.map-zone .ie_fo_tooltip h2').css({
        'margin' : '15px auto 10px auto',
        'width': '90%'
      });

      $('.map-zone .ie_fo_tooltip img.img_item').css({
        'width': '90%',
        'height': 'auto',
        'display': 'block',
        'margin': 'auto'
      });

      $('.map-zone .ie_fo_tooltip button.discover-button').css({
        'background': '#3183A2',
        'color': 'white',
        'border': 'none',
        'display': 'block',
        'margin': '20px auto',
        'padding': '10px 20px',
        'text-shadow': 'none',
        'width': '90%',
        'font-size': '1.3em',
        'font-weight': 'normal',
        'border-radius' : '0'
      });
  }

    // tooltip display for IE
  function IEdisplayTooltip() {

      //apparition /disparition tooltip
      $("svg").find('path.item').on('mouseover', function(){
        
        var idItem = $(this).attr('id');

        $('.ie_fo_tooltip').each(function(){

          $(this).css({
              'visibility' : 'hidden'
          });
          if ($(this).attr('id') == idItem){
            console.log("ok");
            $(this).css({
              'visibility' : 'visible'
            });
          }
        })
      
      }); // end on mouseover
  }

  // tooltip creation
  function createTooltips() {

      // construction des tooltips
      $('path.item').each(function(){

        var stringType;

        /*select type of fo*/
        if ($(this).attr('type') == "gallery"){
          stringType = gallerieText_Fr;
        }
        else if ($(this).attr('type') == "expedition"){
          stringType = expeditionText_Fr;
        }

        var fo = g3.append('foreignObject')
          .attr('x',  $('svg').attr('width')-foWidth-20)
          .attr('y',  0)
          .attr('width', foWidth)
          .attr('height', $('svg').attr('height'))
          .attr('id', $(this).attr('id'))
          .attr('class', 'fo_tooltip');

        var mapBodyInfo = fo.append('xhtml:body')
            .attr('xmlns','http://www.w3.org/1999/xhtml')
            .attr('class','info_item');

        var mapDivInfo =  mapBodyInfo.append('xhtml:div')
          .attr('class', 'info_item');

        var mapTypeInfo = mapDivInfo.append('xhtml:p')
          .attr('class', 'type_item')
          .html(stringType);

        var mapLinkInfo = mapDivInfo.append('xhtml:a')
          .attr('href', $(this).attr('url_item'));

        mapLinkInfo.append('xhtml:h2')
          .html($(this).attr('name'))

        mapLinkInfo.append('xhtml:img')
          .attr('class', 'img_item')
          .attr('src', $(this).attr('url_image'))
          .attr('typeof', 'foaf:Image')
         ;

        mapLinkInfo.append('xhtml:button')
          .attr('type', 'button')
          .attr('class', 'discover-button')
          .html(btnText_Fr)
          ;


      }); // end foreignObject

      $('svg .fo_tooltip body.info_item').css({'width': foWidth});
      $('svg .fo_tooltip div.info_item').css({'width': foWidth});

      // pb position webkit 
      if (navigator.userAgent.indexOf('Safari') != -1 || navigator.userAgent.indexOf('Chrome') != -1) {
        $('svg .fo_tooltip body.info_item').css({'left': ($('svg').attr('width')-foWidth-20)+"px"});
      }

      
      // pb display safari
      if (navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1) {
        $('svg .fo_tooltip div.info_item').css({'background': 'rgba(200, 200, 200, 0.5)', 'padding-bottom': '5px'});
      }
        
              
  }

  // tooltip display
  function displayTooltip() {

      //apparition /disparition tooltip
      $('svg path.item').on('mouseover', function(){
        
        var idItem = $(this).attr('id');

        $('svg .fo_tooltip').each(function(){

          $(this).css({
              'visibility' : 'hidden'
          });
          if ($(this).attr('id') == idItem){
            console.log("ok");
            $(this).css({
              'visibility' : 'visible'
            });
          }
        })
      
      }); // end on mouseover
  }

  function initNumeros() {
    numero_objet = -1;
    numero_tag = -1;
    numero_name = -1;
    numero_image = -1;
    numero_path = -1;
    numero_id = -1;
    numero_type = -1;
  }

  // every point representing items have the good size
  function resizePoints() {
    // scale on map
    if (d3.event != null){
      previousScaleValue = d3.event.scale;
      if(d3.event.scale < sizePoint*0.5){
        g2.selectAll('.item').attr('d', path.pointRadius(sizePoint-d3.event.scale*1.5));
        
      }
      else{
        g2.selectAll('.item').attr('d', path.pointRadius(sizePoint/4));
      }
    }
    //initialisation of map
    else{
      if(previousScaleValue < sizePoint*0.5){
        g2.selectAll('.item').attr('d', path.pointRadius(sizePoint-(previousScaleValue*1.5)));    
      }
      else{
        g2.selectAll('.item').attr('d', path.pointRadius(sizePoint/4));
      }
    }
  }

  /* Zoom function */
  function zoomed() {

    g.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
    g2.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");

    resizePoints();
  }


  function fixImageUrl() {
    $('svg path.item').each(function(){

      var split = $(this).attr('url_image').split("/");
      var nameImage = split[split.length-1];
      var newUrl = "http://"+window.location.hostname+url_images_directory+nameImage;

      //console.log(newUrl);

      var idItem = $(this).attr('id');

       $('svg .fo_tooltip').each(function(){     
          if ($(this).attr('id') == idItem){
            
            $(this).children('body').children('div').children('a').children('img').attr('src', newUrl);

          }
        })

    });

  }

  /* Check if a filter is selected (if an item is already in the array) */
  function isSelected(filter, selectedFilters) {
    for(var i = 0; i < selectedFilters.length; i++) {
      if(filter === selectedFilters[i]) {
        return true;
      }
    }
    return false;
  }

  /* Get the filter clicked */
  function getFilter(link) {
    var split = link.attr("href").split("/");
    return split[split.length-1];
  }

  /* Update the filters given in url as parameters */
  function updateFilters(filter, selectedFilters) {
    // default value
    var filters = "all";
    // push or remove it into array
    if(!isSelected(filter, selectedFilters))
      selectedFilters.push(filter);
    else
      selectedFilters.splice($.inArray(filter, selectedFilters), 1);
    // build the params string
    if(selectedFilters.length !== 0) {
      filters = selectedFilters[0];
      for(var i = 1; i < selectedFilters.length; i++) {
        filters += "+" + selectedFilters[i];
      }
    }
    return filters;
  }

/*-- VARIABLES */
  /* Filters and url paramaters to update json file */
  var url = "json/arctic-map/";
  var selectedThemes = [], selectedTypes = [],
    themes = "all", types = "all";

  var url_images_directory = "/sites/default/files/"

  /* Dimensions */
  var width = $(document).width() - 20,
      height = $(document).height() - 50;

  /* Orthogaphic projection */
  // la projection : ici, une projection orthographique
  var projection = d3.geo.orthographic()
      .translate([width / 2, height / 2])
      .clipAngle(90) // on arrête l'affichage à 90° --> on n'affiche que la moitié supérieure de la Terre
      .scale((width) /Math.PI) // niveau de zoom de départ
      .precision(.1); 

  // faire tourner la map (sinon on se retrouve face à la France)
  projection.rotate([0, -90]);

  // le zoom
  var zoom = d3.behavior.zoom()
      .scaleExtent([1, 5])
      .on("zoom", zoomed);


  var path = d3.geo.path()
      .projection(projection);

  // on initialise le svg
  var svg = d3.select(".map-wrapper").append("svg") // .map-wrapper or .map-zone
      .attr("width", width)
      .attr("height", height)
      .append("g");

  
  var g = svg.append("g");
  var g2 = svg.append("g"); // pour les galeries
  var g3 = svg.append("g"); // pour les tooltips
  

  var sizePoint = 6.5; // la taille de base des points sur la carte 
  var previousScaleValue = 1; // sauvegarde du niveau de scale de la carte (utile quand on clique sur des filtres) 
  var foWidth = width/4; // la largeur d'un tooltip foreignObject

  var numero_objet = -1;
  var numero_tag = -1;
  var numero_name = -1;
  var numero_image = -1;
  var numero_path = -1;
  var numero_id = -1;
  var numero_type = -1;

  var btnText_Fr = 'Explorer';
  var gallerieText_Fr = 'Galerie';
  var expeditionText_Fr = 'Expédition';

/*-- FUNCTIONS CALL (init) */
  drawWorld();
  initNumeros();
  drawItems(url+themes+"/"+types);
//  createZoomButton();

/*-- EVENTS */
  /* Zoom */
    svg.call(zoom).call(zoom.event);

  /* Click on filters : update path of json items file when the anchor change in the url */
  // themes filters
  $(".theme > a").click(function(e) {
    // block link default behaviour and toggle class
    e.preventDefault();
    $(this).toggleClass("is-selected");
    // get the filter clicked
    theme = getFilter($(this));
    // update filters
    themes = updateFilters(theme, selectedThemes);
    // init numeros
    initNumeros();
    // re-draw items
    drawItems(url+themes+"/"+types);
  });

  // types filters
  $(".type > a").click(function(e) {
    // block link default behaviour and toggle class
    e.preventDefault();
    $(this).toggleClass("is-selected");
    // get the filter clicked 
    type = getFilter($(this));
    // update filters
    types = updateFilters(type, selectedTypes);
    // init numeros
    initNumeros();
    // re-draw items
    drawItems(url+themes+"/"+types);
  });

/*
  // Simplest possible buttons
  svg.selectAll(".button")
      .data(['zoom_in', 'zoom_out'])
      .enter()
      .append("rect")
      .attr("x", function(d,i){return 10 + 50*i})
      .attr({y: 10, width: 40, height: 20, class: "button"})
      .attr("id", function(d){return d})
      .style("fill", function(d,i){ return i ? "red" : "green"})

  d3.selectAll('.button').on('click', function(){
      d3.event.preventDefault();

      var scale = zoom.scale(),
          extent = zoom.scaleExtent(),
          translate = zoom.translate(),
          x = translate[0], y = translate[1],
          factor = (this.id === 'zoom_in') ? 1.2 : 1/1.2,
          target_scale = scale * factor;

      // If we're already at an extent, done
      if (target_scale === extent[0] || target_scale === extent[1]) { return false; }
      // If the factor is too much, scale it down to reach the extent exactly
      var clamped_target_scale = Math.max(extent[0], Math.min(extent[1], target_scale));
      if (clamped_target_scale != target_scale){
          target_scale = clamped_target_scale;
          factor = target_scale / scale;
      }

      // Center each vector, stretch, then put back
      x = (x - center[0]) * factor + center[0];
      y = (y - center[1]) * factor + center[1];

      // Transition to the new view over 350ms
      d3.transition().duration(350).tween("zoom", function () {
          var interpolate_scale = d3.interpolate(scale, target_scale),
              interpolate_trans = d3.interpolate(translate, [x,y]);
          return function (t) {
              zoom.scale(interpolate_scale(t))
                  .translate(interpolate_trans(t));
              zoomed();
          };
      });
  });
*/

});