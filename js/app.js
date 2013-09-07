/*! App ARPAV Aria - v1.0.0 - 2013-09-07
* arpa.veneto.it
* Copyright (c) 2013 Daniele Lain - <daniele_lain@libero.it>;
	This program is free software: you can redistribute it and/or modify 
	it under the terms of the GNU General Public License as published by 
	the Free Software Foundation, either version 3 of the License, or 
	(at your option) any later version. 
 
	This program is distributed in the hope that it will be useful, 
	but WITHOUT ANY WARRANTY; without even the implied warranty of 
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the 
	GNU General Public License for more details. 
  
	You should have received a copy of the GNU General Public License 
	along with this program.  If not, see <http://www.gnu.org/licenses/>. */


var AA = AA || {}; 



// This fixes a bug with some devices running Android 2.x versions,
// Where calling JSON.parse(NULL) such as when there's no saved station
// does not return null but crashes the browser

JSON.originalParse = JSON.parse;

JSON.parse = function(text){
	if (text) {
		return JSON.originalParse(text);
	} else {
		// no longer crashing on null value but just returning null
		return null;
	}
}