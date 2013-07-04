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
			pairDistance : 30,
			actionRadius : 60,
			maxPushForce : 5,
			minPushForce : 0,
			maxPullForce : 100,
			minPullForce : 0,

			maxAcceleration : 1.4
		},
		gE : {
			maxPushForce : 50,
			minPushForce : 20
		},
		boundForce : 80
	}

}