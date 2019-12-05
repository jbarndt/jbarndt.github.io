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

  var locations = {};
  var populations = {};

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  ext.getloc = function(str, unit, callback) {

    $.ajax({
      type: "GET",
      url: "http://nominatim.openstreetmap.org/search/",
      dataType: "jsonp",
      data: {
        format: "json",
        q: str
      },
      jsonp: "json_callback",
      success: function(data) {
        locations[str] = {};
        locations[str].coords = [data[0].lon, data[0].lat];
        locations[str].overhead = false;

        if (unit === "longitude")
	      callback(locations[str].coords[0]);
	    else if (unit === "latitude")
		  callback(locations[str].coords[1]);
      },
      error: function(jqxhr, textStatus, error) {
        callback(null);
      }
    });
  };

  ext.getpop = function(str2, callback) {

    $.ajax({
      type: "GET",
      url: "http://nominatim.openstreetmap.org/search.php?q=" + str2 + "&extratags=1",
      dataType: "jsonp",
      data: {
        format: "json"
      },
      jsonp: "json_callback",
      success: function(data) {
		  populations[str2] = {};
          populations[str2].pop = data[0].extratags.population;
          populations[str2].overhead = false;
	    callback(numberWithCommas(populations[str2].pop);
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
	  ['R', 'location of %s in %m.loc', 'getloc', 'Boston, MA', 'longitude'],
	  ['R', 'population of %s', 'getpop', 'Boston, MA']
    ],
    menus: {
      loc: ['longitude', 'latitude'],
    },
    url: 'https://jbarndt.github.io/js/maps.js'
  };

  ScratchExtensions.register('Maps', descriptor, ext);

})({});
