/**
 * Set the colour to a lovely pink.
 * Note that the color is a 4D Float
 * Vector, R,G,B and A and each part
 * runs from 0.0 to 1.0
 */

varying vec4 vevents1;
varying vec4 vevents2;

// vec2 center = vec2(width/2., height/2.);
// float maxRadius = length(center - vec2(0,0));

void main() {

	if(vevents1.x < 199.) {
		gl_FragColor = vec4(1., .0, 0., 1.);

	}
	else gl_FragColor = vec4(0., 1., 0., 1.);


return;

	// float x = gl_FragCoord.x;
	// float y = width-gl_FragCoord.y;
	// float radius = length(center - gl_FragCoord.xy);

	// gl_FragColor = vec4(.2, .2, .2, 1.);
	
	// for(float i = 0.; i<eventCount; i++) {
	// 	if( abs( (maxRadius*events[int(i)]) / onScreen - radius) < 1. ) {
	// 		gl_FragColor.a -= 0.1;
	// 	}
	// }

	// float lineGap = width/(functionsLength+1.);
	// float eventGap = height/msPerFunction;

	// BackgroundColor
	// vec4 color = vec4(1, 0, 1, 1);

	// // Create Lines
	// int k =0;
	// int c =0;
	// int j= 0;
	// for( float i=0.; i<functionsLength; i++) {
	// 	float targetX = lineGap*(i+1.);
	// 	if(abs(coords.x-targetX) < .5) {
			
	// 		if(abs(coords.x-targetX) < .5) 
	// 			color = vec4(1, 0, 1, 1);
			
	// 		j = int(i);
	// 		for( c = 0 ; c<functions[j]; c++) {
	// 			// if(abs(coords.y - (eventGap* float(events[k]))) < 3.) 
	// 			// 	color = vec4(1, 0, 0, 1);
	// 			k+=1;
	// 		}

	// 	}
	// }

	// gl_FragColor = color;


}



