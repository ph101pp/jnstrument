/**
 * Set the colour to a lovely pink.
 * Note that the color is a 4D Float
 * Vector, R,G,B and A and each part
 * runs from 0.0 to 1.0
 */

uniform int functions[1000];
uniform int events[1000];
uniform float functionsLength;
uniform float eventsLength;

uniform float msPerFunction;

uniform float width;
uniform float height;

void main() {
	float x = gl_FragCoord.x;
	float y = width-gl_FragCoord.y;
	vec2 coords = vec2(gl_FragCoord.x, width-gl_FragCoord.y);
	float lineGap = width/(functionsLength+1.);
	float eventGap = height/msPerFunction;

	// BackgroundColor
	vec4 color = vec4(1, 0, 1, 1);

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

	gl_FragColor = color;


}



