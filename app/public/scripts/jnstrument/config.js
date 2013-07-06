module.exports = {
	socketAdress : "127.0.0.1:8000",

	colors : {
		background : 0x000026,//0x1D1D26,
		normalDots : 0xFFFFFF,
		normalLines : 0xCCCCCC,
		activeDots : 0xFF0000,
		activeLines : 0xFFFFFF,
		activeGlow : 0x76BDE5,

		outputColor : 0x0071BC,
		inputColor : 0x98D44C
	},


	neuron : {
		fE : {
			maxPushForce : 60,
			minPushForce : 0,
			maxPullForce : 100,
			minPullForce : 0,
			maxAcceleration : 1.4,

			pairDistance : 5,
			elementPadding : 30,
			elementMargin : 30,
			minRadius: 3,
			maxRadius: 60,
			activeRadius: 200,

			outlineMaxWidth : 5,

			opacity: 0.5,
			maxOpacity : 0.9


		},
		gE : {
			maxPushForce : 50,
			minPushForce : 0,
			maxGravity : 3,
			maxRadiusGrow : 1.1
		},
		boundForce : 60,
		msOnScreen : 1000,
		cursorSize : 2
	}

}