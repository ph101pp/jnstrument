/**
 * Multiply each vertex by the
 * model-view matrix and the
 * projection matrix (both provided
 * by Three.js) to get a final
 * vertex position
 */

varying vec3 fragNormal;
void main() {

	fragNormal = normal;

  	gl_Position = projectionMatrix *
                modelViewMatrix *
                vec4(position,1.0);
}