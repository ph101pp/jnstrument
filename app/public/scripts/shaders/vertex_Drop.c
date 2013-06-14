/**
 * Multiply each vertex by the
 * model-view matrix and the
 * projection matrix (both provided
 * by Three.js) to get a final
 * vertex position
 */

attribute vec4 events1;
attribute vec4 events2;

varying vec4 vEvents1;
varying vec4 vEvents2;

void main() {
	vEvents1 = events1;
	vEvents2 = events2;
  	gl_Position = projectionMatrix *
                modelViewMatrix *
                vec4(position,1.0);
}