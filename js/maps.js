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

  var EARTH_RADIUS = 6371000; //meters

  var locations = {};

  function getLocation(str, callback) {

    if (locations[str]) {
      callback(locations[str]);
      return;
    }

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
        callback(locations[str]);
      },
      error: function(jqxhr, textStatus, error) {
        callback(null);
      }
    });
  }

  ext.getloc = function(str, coords) {

    getLocation(str, function(loc) {
      var lat = loc.coords[1];
	  var lon = loc.coords[0];
    });

    if (coords === "longitude")
      return lon;
    else if (coords === "latitude")
      return lat;
  };

  ext._getStatus = function() {
    return { status:2, msg:'Ready' };
  };

  // Cleanup function when the extension is unloaded
  ext._shutdown = function() {};

  var descriptor = {
    blocks: [
      //['h', 'when ISS passes over %s', 'whenISSPasses', 'Boston, MA'],
      //['R', 'distance from %s in %m.measurements', 'distanceFrom', 'Boston, MA', 'kilometers'],
      //['r', 'current ISS %m.loc', 'getISSInfo', 'longitude']

	  ['R', 'location of %s in %m.loc', 'getloc', 'Boston, MA', 'longitude']
    ],
    menus: {
      loc: ['longitude', 'latitude'],
      //measurements: ['kilometers', 'miles']
    },
    url: 'https://jbarndt.github.io/js/maps.js'
  };

  ScratchExtensions.register('Maps', descriptor, ext);

})({});