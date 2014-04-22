$('btn').bind('click', graphTextInput);
var ctx = document.getElementById('c').getContext('2d');
document.getElementById('c').width = 500;
document.getElementById('c').height = 500;

function graphTextInput() {
	graph(makeDataStructureForString($('#input').val()));
}

function graph() {
	var arr = makeDataStructureForString("((h4, h5) h2, h3) h1");
	var depth = getDepthOfNestedArrays(arr, 0);
	var height = getNumberOfChildren(arr);
	debugger;
	drawNodesForArray(arr, 0, 300, 300, height, depth, []);
}

function drawNodesForArray(arr, left, xScale, yScale, totalHeight, totalDepth, parents, previousPoint) {
	if (previousPoint) {
		drawLineFromPointToPoint(previousPoint.x, previousPoint.y, xScale * (left/totalDepth) , yScale * (getNumberOfNodesAboveNode(arr, parents, parents[0])/totalHeight));
	}

	var tPoint = {x:xScale * (left/totalDepth), y:yScale * (getNumberOfNodesAboveNode(arr, parents, parents[0])/totalHeight)};

	childrenToDraw = [];
	var i = 0;
	for (i = 0; i < arr.length; i++) {
		if (arr[i][0] == 1) {
			childrenToDraw.push(arr[i]); //eventually add names + sort etc
		}
		else {
			drawNodesForArray(arr[i], left + 1, xScale, yScale, totalHeight, totalDepth, parents.concat(arr), tPoint);
		}
	}

	if (childrenToDraw.length > 0) {
		for (i = 0; i < childrenToDraw.length;i++) {
			var above = getNumberOfNodesAboveNode(childrenToDraw[i], parents.concat(arr), parents[0]);
			drawLineFromPointToPoint(tPoint.x, tPoint.y, xScale * totalDepth , yScale * (above/totalHeight));
		}
	}
}

function getNumberOfNodesAboveNode(node, parents, arr) {
	var count = 0;
	for (var i in arr) {
		var cont = 1;
		count++;
		if (typeof(arr[i]) == 'object') {
			for (var j in parents) {
				if (arr[i] == parents[j]) {
					cont = 0;
					count += getNumberOfNodesAboveNode(node, parents, arr[i]);
				}
				else {
					if (arr[i] == node) {
						return cont;
					}
				}
			}
			if (!cont) {
				break;
			}
			else {
				count = count + getNumberOfChildren(arr[i]);
			}
		}
		else {
			return 1;
		}
	}

	return count;
}

function drawLineFromPointToPoint(x1, y1, x2, y2) {
	ctx.beginPath();
	ctx.moveTo(x1,y1);
	ctx.lineTo(x2,y2);
	ctx.strokeStyle = '#c0392b';
	ctx.lineWidth = 1;
	ctx.stroke();
	ctx.closePath();
}

function getDepthOfNestedArrays(arrs, depth) {
	var nums = 0;
	for (var i in arrs) {
		if (typeof(arrs[i]) == 'object') {
			var tDepth = getDepthOfNestedArrays(arrs[i], depth + 1);
			if (nums < tDepth) {
				nums = tDepth - depth;
			}
		}
		else {
			if (nums < 1) {
				nums = 1;
			}
		}
	}

	return depth + nums;
}

function removeSpaces(str) {
	return str.replace(/\s+/g, '');
}

function makeDataStructureForString(str, depth) { //string to parse / depth / coordinates of parent
	var objs = getObjects(str);
	// console.log(objs);
	var arr = [];

	for (var i = 0; i < objects.length; i++) {
		var trig = 0;
		for (var j = objects[i].length - 1; j > -1 ; j--) {
			if (objects[i].charAt(j) == ')') {
				trig = 1;
				arr.push(makeDataStructureForString(objects[i].substring(1, j), depth + 1));
				break;
			}
		}
		if (!trig) {
			arr.push([1]);
		}
	}

	return arr;
}

function getNumberOfChildren(arrs) {
	var children = 0;
	for (var i in arrs) {
		if (typeof(arrs[i]) == 'object') {
			children = children + getNumberOfChildren(arrs[i]);
		}
		else {
			return 1;
		}
	}

	return children;
}

function getJSONForString(str) {
	var d = {};
	d[str.substr(getIndexOfLastObj(str))] = {};
	var depth = 0;
	
}

function getObjects(str) {
	objects = [];
	var depth;
	for (var i = 0; i < str.length; i++) {
		if (i === 0 || str.charAt(i) == ',') {
			var end = findEndOfObjectFromPosition(str, (i === 0 ? i : i + 1));
			objects.push(str.substring(i + 1 + (i === 0 ? -1 : 1), end));
			i = end - 1;
		}
	}

	return objects;
}

function findEndOfObjectFromPosition(str, start) { //str from paren - ie (asdf) would be asdf)
	var depth = 0;
	for (var i = start; i < str.length; i++) {
		switch (str.charAt(i)) {
			case ',':
				if (!depth) {
					return i;
				}
				break;

			case ')':
				depth++;
				break;

			case '(':
				depth--;
				break;
		}

		if (i == str.length - 1) {
			return i + 1;
		}
	}
}

graph();