/*
 *This program is free software: you can redistribute it and/or modify
 *it under the terms of the GNU General Public License as published by
 *the Free Software Foundation, either version 3 of the License, or
 *(at your option) any later version.
 *
 *This program is distributed in the hope that it will be useful,
 *but WITHOUT ANY WARRANTY; without even the implied warranty of
 *MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *GNU General Public License for more details.
 *
 *You should have received a copy of the GNU General Public License
 *along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
(function(ext) {

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  ext.getpop = function(str, callback) {

    $.ajax({
  	type: "GET",
  	url: "http://nominatim.openstreetmap.org/search.php?q=" + str + "&extratags=1",
  	dataType: "jsonp",
  	data: {
  	  format: "json"
  	},
  	jsonp: "json_callback",
  	success: function(data) {
  	  console.log(numberWithCommas(data[0].extratags.population));
  	},
  	error: function(jqxhr, textStatus, error) {
  	  callback(null);
  	}
    });
  };

  ext._getStatus = function() {
    return { status:2, msg:'Ready' };
  };

  // Cleanup function when the extension is unloaded
  ext._shutdown = function() {};

  var descriptor = {
    blocks: [

	  ['R', 'population of %s', 'getpop', 'Boston, MA']
    ],

    url: 'https://jbarndt.github.io/js/pop.js'
  };

  ScratchExtensions.register('Population', descriptor, ext);

})({});
