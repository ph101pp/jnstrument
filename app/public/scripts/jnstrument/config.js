module.exports = {
	socketAdress : "127.0.0.1:8000",

	colors : {
		background : 0x000026,//0x1D1D26,
		normalDots : 0xFFFFFF,
		normalLines : 0xCCCCCC,
		activeDots : 0xFF0000,
		activeLines : 0xFFFFFF,
		activeGlow : 0x76BDE5
	},


	neuron : {
		fE : {
			maxPushForce : 30,
			minPushForce : 0,
			maxPullForce : 70,
			minPullForce : 0,
			maxAcceleration : 1.4,

			pairDistance : 5,
			elementPadding : 30,
			elementMargin : 40,
			minRadius: 3,
			maxRadius: 60


		},
		gE : {
			maxPushForce : 40,
			minPushForce : 0
		},
		boundForce : 60,
		msOnScreen : 1000
	}

}