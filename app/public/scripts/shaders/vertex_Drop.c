/**
 * Multiply each vertex by the
 * model-view matrix and the
 * projection matrix (both provided
 * by Three.js) to get a final
 * vertex position
 */

attribute vec4 events1;
attribute vec4 events2;
// attribute vec4 events3;
// attribute vec4 events4;

varying vec4 vEvents1;
varying vec4 vEvents2;
// varying vec4 vEvents3;
// varying vec4 vEvents4;

void main() {
	vEvents1 = events1;
	vEvents2 = events2;
	// vEvents3 = events3;
	// vEvents4 = events4;
  	gl_Position = projectionMatrix *
                modelViewMatrix *
                vec4(position,1.0);
}