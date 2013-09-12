var config={
	// socketAdress : "jnstrument.com",
//	socketAdress : "192.168.1.13:8000",
//	socketAdress : "10.162.66.20:8000",
	inputAdress : "http://169.254.78.204:8000",
	outputAdress : "http://169.254.78.204:8000",
	webAdress : "http://169.254.78.204:8000",

	colors : {
		background : 0x000015, // 0x000026,//
		normalDots : 0xCCCCCC,
		normalLines : 0xBBBBBB,
		activeDots : 0xdddddd,
		activeLines : 0xdddddd,
		activeGlow : 0x76BDE5,

		outputColor : 0x0071BC,
		inputColor : 0x98D44C
	},


	neuron : {
		fE : {
			maxPushForce : 80,
			minPushForce : 0,
			maxActivePushForce : 70,
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
			activeElementRadius: 60,
			activeGrowEasing : 0.3,
			activeCirclePadding : 90,
			activeScalePadding :10,

			outlineMaxWidth : 5,
			activeOutlineMaxWidth: 10,

			opacity: 0.5,
			maxOpacity : 0.9,

			arrowArmLength :8,
			arrowArmAngle:20

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
