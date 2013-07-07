var config={
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
			maxPushForce : 80,
			minPushForce : 0,
			maxActivePushForce : 50,
			minActivePushForce : 0,
			maxPullForce : 100,
			minPullForce : 0,
			maxAcceleration : 1.2,

			pairDistance : 10,
			elementPadding : 30,
			elementMargin : 30,
			minRadius: 5,
			maxRadius: 60,

			activeRadius: 300,
			activeGrowEasing : 0.3,
			activeCirclePadding : 90,

			outlineMaxWidth : 5,

			opacity: 0.5,
			maxOpacity : 1.0


		},
		gE : {
			maxPushForce : 50,
			minPushForce : 0,
			maxGravity : 3,
			maxRadiusGrow : 1.1,

			maxAcceleration : 1.2,
		},
		boundForce : 60,
		msOnScreen : 1000,
		cursorSize : 20
	}

}
module.exports = config;
