var utils = require('../utils');
var update_network = require('../network/update_network');

module.exports = function(config, params, filter_type) {

  var views = params.network_data.views;
  var all_views = _.filter(views, function(d) { return utils.has(d,filter_type); });

  // // filter for column category if necessary
  // if ( utils.has(all_views[0],'col_cat') ) {

  //   // get views with current_col_cat
  //   all_views = _.filter(all_views, function(d){
  //     if (d.col_cat == params.current_col_cat){
  //       return d;
  //     }
  //   })
  // }

  var inst_max = all_views.length - 1;

  // make dictionary
  var N_dict = {};

  // filters
  var all_filt = _.pluck( params.network_data.views, 'N_row_sum');

  all_filt.forEach(function(d){
    var tmp_index = _.indexOf(all_filt, d);

    N_dict[tmp_index] = d;

  });

  $( '.slider_'+filter_type ).slider({
    value:0,
    min: 0,
    max: inst_max,
    step: 1,
    stop: function() {

      // get value
      var inst_index = $( '.slider_'+filter_type ).slider( "value" );

      var inst_top = N_dict[inst_index];

      var change_view = {'N_row_sum':inst_top};

      var viz_svg = params.viz.viz_svg;

      d3.select(viz_svg).style('opacity',0.70);

      d3.select(params.root+' .'+filter_type).text('Top rows: '+inst_top+' rows');

      // $('.slider_filter').slider('disable');
      d3.selectAll(params.root+' .btn').attr('disabled',true);
      d3.selectAll(params.root+' .category_section')
        .on('click', '')
        .select('text')
        .style('opacity',0.5);

      params = update_network(config, params, change_view);

      setTimeout(function(){
        params.viz.run_trans = false;
      }, 2500);

      function enable_slider(){
        // $('.slider_filter').slider('enable');
        d3.selectAll(params.root+' .btn').attr('disabled',null);
        // d3.selectAll(params.root+' .category_section')
        //   .on('click', category_key_click)
        //   .select('text')
        //   .style('opacity',1);
      }
      setTimeout(enable_slider, 2500);

    }
  });

};