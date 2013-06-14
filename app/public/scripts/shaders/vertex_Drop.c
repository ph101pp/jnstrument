/**
 * Multiply each vertex by the
 * model-view matrix and the
 * projection matrix (both provided
 * by Three.js) to get a final
 * vertex position
 */

attribute vec4 events1;
attribute vec4 events2;

varying vec4 vevents1;
varying vec4 vevents2;

void main() {
	vevents1 = vec4(200,0,0,0);
	vevents2 = events2;
  	gl_Position = projectionMatrix *
                modelViewMatrix *
                vec4(position,1.0);
}