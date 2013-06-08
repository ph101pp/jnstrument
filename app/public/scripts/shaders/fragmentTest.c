/**
 * Set the colour to a lovely pink.
 * Note that the color is a 4D Float
 * Vector, R,G,B and A and each part
 * runs from 0.0 to 1.0
 */



uniform float lerpAlpha;
uniform float radius;
uniform float inbound;
uniform float outbound;

varying vec3 fragNormal;

vec3 inHighlight = vec3(1.0, 0.9, 1.0);
vec3 inNormal = vec3(1.0, 0.0, 1.0);

vec3 outHighlight = vec3(0.9, 0.9, 1.0);
vec3 outNormal = vec3(0.0, 0.0, 1.0);


void main() {
	vec3 thisColor;
	vec3 thisHighlight;
	vec2 norm = normalize(fragNormal).xy;
	// float alpha = degrees(atan(abs(fragNormal.y),(fragNormal.z)));
	// float beta = degrees(atan(abs(fragNormal.x),(fragNormal.z)));

	// if(alpha > 90.) alpha = 180. - alpha;
	// if(beta > 90.) beta = 180. - beta;

	// float a= cos(radians(alpha));
	// float c= cos(radians(beta));
	float threshhold = inbound/(inbound+outbound);

	if( length(norm) > threshhold){
		thisColor = outNormal; // BLUE YES
		thisHighlight = outHighlight;
	}
	else {
		thisColor = inNormal; // PINK NO
		thisHighlight = inHighlight;
	}

	float r = thisColor.x + ( thisHighlight.x - thisColor.x ) * lerpAlpha;
	float g = thisColor.y + ( thisHighlight.y - thisColor.y ) * lerpAlpha;
	float b = thisColor.z + ( thisHighlight.z - thisColor.z ) * lerpAlpha;

 	gl_FragColor = vec4(r, g, b, 1.0); // A
}

