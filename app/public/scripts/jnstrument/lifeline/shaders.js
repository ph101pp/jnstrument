(function(THREE) {	

	/**
	 * @author alteredq / http://alteredqualia.com/
	 *
	 * Vignette shader
	 * based on PaintEffect postprocess from ro.me
	 * http://code.google.com/p/3-dreams-of-black/source/browse/deploy/js/effects/PaintEffect.js
	 */
	module.exports = {
		vignette : {

			uniforms: {

				"tDiffuse": { type: "t", value: null },
				"offset":   { type: "f", value: 1.0 },
				"darkness": { type: "f", value: 1.0 }

			},

			vertexShader: [

				"varying vec2 vUv;",

				"void main() {",

					"vUv = uv;",
					"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

				"}"

			].join("\n"),

			fragmentShader: [

				"uniform float offset;",
				"uniform float darkness;",
				"uniform sampler2D tDiffuse;",

				"varying vec2 vUv;",

				"void main() {",

					// Eskil's vignette

					"vec4 texel = texture2D( tDiffuse, vUv );",
					"vec2 uv = ( vUv - vec2( 0.5 ) ) * vec2( offset );",
					"gl_FragColor = vec4( mix( texel.rgb, vec3( 1.0 - darkness ), dot( uv, uv ) ), texel.a );",

					
					// alternative version from glfx.js
					// this one makes more "dusty" look (as opposed to "burned")

					// "vec4 color = texture2D( tDiffuse, vUv );",
					// "float dist = distance( vUv, vec2( 0.5 ) );",
					// "color.rgb *= smoothstep( 0.8, offset * 0.799, dist *( darkness + offset ) );",
					// "gl_FragColor = color;",
					

				"}"

			].join("\n")
		},
		/**
		 * @author stemkoski / http://github.com/stemkoski
		 *
		 * Blend two textures additively
		 */

		additiveBlend : {

			uniforms: {
			
				"tDiffuse1": { type: "t", value: null },
				"tDiffuse2": { type: "t", value: null },
				"clearColor": { type: "c", value: new THREE.Color(0,0,0) }
			},

			vertexShader: [

				"varying vec2 vUv;",

				"void main() {",

					"vUv = uv;",
					"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

				"}"

			].join("\n"),

			fragmentShader: [

				"uniform sampler2D tDiffuse1;",
				"uniform sampler2D tDiffuse2;",

				"uniform vec3 clearColor;",

				"varying vec2 vUv;",

				"void main() {",

					"vec4 texel1 = texture2D( tDiffuse1, vUv );",
					"vec4 texel2 = texture2D( tDiffuse2, vUv );",
					"if(clearColor != texel2.xyz)",
						"gl_FragColor = texel1 + texel2;",
					"else",
						"gl_FragColor = texel1;",
				"}"

			].join("\n")

		},

		/**
		 * @author zz85 / http://www.lab4games.net/zz85/blog
		 *
		 * Two pass Gaussian blur filter (horizontal and vertical blur shaders)
		 * - described in http://www.gamerendering.com/2008/10/11/gaussian-blur-filter-shader/
		 *   and used in http://www.cake23.de/traveling-wavefronts-lit-up.html
		 *
		 * - 9 samples per pass
		 * - standard deviation 2.7
		 * - "h" and "v" parameters should be set to "1 / width" and "1 / height"
		 */

		horizontalBlur : {

			uniforms: {

				"tDiffuse": { type: "t", value: null },
				"h":        { type: "f", value: 1.0 / 512.0 }

			},

			vertexShader: [

				"varying vec2 vUv;",

				"void main() {",

					"vUv = uv;",
					"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

				"}"

			].join("\n"),

			fragmentShader: [

				"uniform sampler2D tDiffuse;",
				"uniform float h;",

				"varying vec2 vUv;",

				"void main() {",

					"vec4 sum = vec4( 0.0 );",

					"sum += texture2D( tDiffuse, vec2( vUv.x - 4.0 * h, vUv.y ) ) * 0.051;",
					"sum += texture2D( tDiffuse, vec2( vUv.x - 3.0 * h, vUv.y ) ) * 0.0918;",
					"sum += texture2D( tDiffuse, vec2( vUv.x - 2.0 * h, vUv.y ) ) * 0.12245;",
					"sum += texture2D( tDiffuse, vec2( vUv.x - 1.0 * h, vUv.y ) ) * 0.1531;",
					"sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y ) ) * 0.1633;",
					"sum += texture2D( tDiffuse, vec2( vUv.x + 1.0 * h, vUv.y ) ) * 0.1531;",
					"sum += texture2D( tDiffuse, vec2( vUv.x + 2.0 * h, vUv.y ) ) * 0.12245;",
					"sum += texture2D( tDiffuse, vec2( vUv.x + 3.0 * h, vUv.y ) ) * 0.0918;",
					"sum += texture2D( tDiffuse, vec2( vUv.x + 4.0 * h, vUv.y ) ) * 0.051;",

					"gl_FragColor = sum;",

				"}"

			].join("\n")

		},
		/**
		 * @author zz85 / http://www.lab4games.net/zz85/blog
		 *
		 * Two pass Gaussian blur filter (horizontal and vertical blur shaders)
		 * - described in http://www.gamerendering.com/2008/10/11/gaussian-blur-filter-shader/
		 *   and used in http://www.cake23.de/traveling-wavefronts-lit-up.html
		 *
		 * - 9 samples per pass
		 * - standard deviation 2.7
		 * - "h" and "v" parameters should be set to "1 / width" and "1 / height"
		 */

		verticalBlur : {

			uniforms: {

				"tDiffuse": { type: "t", value: null },
				"v":        { type: "f", value: 1.0 / 512.0 }

			},

			vertexShader: [

				"varying vec2 vUv;",

				"void main() {",

					"vUv = uv;",
					"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

				"}"

			].join("\n"),

			fragmentShader: [

				"uniform sampler2D tDiffuse;",
				"uniform float v;",

				"varying vec2 vUv;",

				"void main() {",

					"vec4 sum = vec4( 0.0 );",

					"sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 4.0 * v ) ) * 0.051;",
					"sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 3.0 * v ) ) * 0.0918;",
					"sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 2.0 * v ) ) * 0.12245;",
					"sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 1.0 * v ) ) * 0.1531;",
					"sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y ) ) * 0.1633;",
					"sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 1.0 * v ) ) * 0.1531;",
					"sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 2.0 * v ) ) * 0.12245;",
					"sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 3.0 * v ) ) * 0.0918;",
					"sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 4.0 * v ) ) * 0.051;",

					"gl_FragColor = sum;",

				"}"

			].join("\n")

		},
		/**
		 * @author alteredq / http://alteredqualia.com/
		 *
		 * Colorify shader
		 */

		tint : {

			uniforms: {

				"tDiffuse": { type: "t", value: null },
				"color":    { type: "c", value: new THREE.Color( 0xffffff ) }

			},

			vertexShader: [

				"varying vec2 vUv;",

				"void main() {",

					"vUv = uv;",
					"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

				"}"

			].join("\n"),

			fragmentShader: [

				"uniform vec3 color;",
				"uniform sampler2D tDiffuse;",

				"varying vec2 vUv;",

				"void main() {",

					"vec4 texel = texture2D( tDiffuse, vUv );",

	//				"vec3 luma = vec3( 0.299, 0.587, 0.114 );",
					"vec3 luma = vec3( 0.7, 0.8, 0.6 );",
					"float v = dot( texel.xyz, luma );",

					"gl_FragColor = vec4( v * color * vec3(0.2,0.2,0.2), texel.w );",

				"}"

			].join("\n")

		}


	};


})(THREE);