#pragma strict

var speedText : UI.Text;
var rBody : Rigidbody;
var wheelFL : WheelCollider;
var wheelFR : WheelCollider;
var wheelRR : WheelCollider;
var wheelRL : WheelCollider;
var wheelFLTrans : Transform;
var wheelFRTrans : Transform;
var wheelRLTrans : Transform;
var wheelRRTrans : Transform;
var steerMaxAngle : float;
var currentSteerAngle : float;
var steerAngleFactor : float;
var decelerationSpeed: float ;
var currentSpeed : float;
var topSpeed : float ;
var maxTorque : float;
var braked : boolean;
var maxBrakeTorque : float;
var aSource : AudioSource ;
var gearRatio : float[];
var gear : int;

function Start () 
{
	rBody = gameObject.GetComponent(Rigidbody);
	rBody.centerOfMass.y = -0.8f;

}

function FixedUpdate () 
{
	Controle();
	HandBrake();
	SteerAngleFactor();
	

}

function Update()
{
	speedText.text = "Km/h:" + currentSpeed.ToString();
	wheelFLTrans.Rotate((wheelFL.rpm/60 * 360 * Time.deltaTime),0,0);
	wheelFRTrans.Rotate((wheelFR.rpm/60 * 360 * Time.deltaTime),0,0);
	wheelRLTrans.Rotate((wheelRL.rpm/60 * 360 * Time.deltaTime),0,0);
	wheelRRTrans.Rotate(-(wheelRR.rpm/60 * 360 * Time.deltaTime),0,0);
	wheelFLTrans.localEulerAngles.y = wheelFL.steerAngle;
	wheelFRTrans.localEulerAngles.y = wheelFR.steerAngle + 180;
	WheelPosition();
	EngineSound();
}

function Controle()
{
	currentSpeed = rBody.velocity.magnitude * 3.6f;
	currentSpeed = Mathf.Round(currentSpeed);
	if(currentSpeed < topSpeed && !braked)
	{
		//wheelRR.motorTorque = maxTorque * Input.GetAxis("Vertical");
		//wheelRL.motorTorque = maxTorque * Input.GetAxis("Vertical");
		wheelFL.motorTorque = maxTorque * Input.GetAxis("Vertical");
		wheelFR.motorTorque = maxTorque * Input.GetAxis("Vertical");
	}
	else
	{
		wheelRR.motorTorque = 0;
		wheelRL.motorTorque = 0;
		wheelFR.motorTorque = 0;
		wheelFL.motorTorque = 0;
	}
	if(Input.GetButton("Vertical")==false)
	{
		wheelRL.brakeTorque = decelerationSpeed;
		wheelRR.brakeTorque = decelerationSpeed;
		wheelFL.brakeTorque = decelerationSpeed;
		wheelFR.brakeTorque = decelerationSpeed;
	}

	else
	{
		wheelRL.brakeTorque = 0;
		wheelRR.brakeTorque = 0;
		wheelFL.brakeTorque = 0;
		wheelFR.brakeTorque = 0;
	}



}

function WheelPosition()
{
	var hit : RaycastHit;
	var wheelPos : Vector3;
	if(Physics.Raycast(wheelFL.transform.position, -wheelFL.transform.up,hit, wheelFL.radius + wheelFL.suspensionDistance))
	{
		wheelPos = hit.point + wheelFL.transform.up * wheelFL.radius;
	}
	else
	{
		wheelPos = wheelFL.transform.position - wheelFL.transform.up * wheelFL.suspensionDistance;
	}
	wheelFLTrans.position = wheelPos;

	if(Physics.Raycast(wheelFR.transform.position, -wheelFR.transform.up,hit, wheelFR.radius + wheelFR.suspensionDistance))
	{
		wheelPos = hit.point + wheelFR.transform.up * wheelFR.radius;
	}
	else
	{
		wheelPos = wheelFR.transform.position - wheelFR.transform.up * wheelFR.suspensionDistance;
	}
	wheelFRTrans.position = wheelPos;

	if(Physics.Raycast(wheelRL.transform.position, -wheelRL.transform.up,hit, wheelRL.radius + wheelRL.suspensionDistance))
	{
		wheelPos = hit.point + wheelRL.transform.up * wheelRL.radius;
	}
	else
	{
		wheelPos = wheelRL.transform.position - wheelRL.transform.up * wheelRL.suspensionDistance;
	}
	wheelRLTrans.position = wheelPos;

	if(Physics.Raycast(wheelRR.transform.position, -wheelRR.transform.up,hit, wheelRR.radius + wheelRR.suspensionDistance))
	{
		wheelPos = hit.point + wheelRR.transform.up * wheelRR.radius;
	}
	else
	{
		wheelPos = wheelRR.transform.position - wheelRR.transform.up * wheelRR.suspensionDistance;
	}
	wheelRRTrans.position = wheelPos;


}

function HandBrake()
{
	if(Input.GetButton("Jump"))
	{
		braked = true;
	}

	else braked = false;

	if( braked)
	{
		wheelRR.brakeTorque = maxBrakeTorque;
		wheelRL.brakeTorque = maxBrakeTorque;
		wheelRR.motorTorque = 0;
		wheelRL.motorTorque = 0;
	}

}

function EngineSoundWithGears()
{
	for(var i = 0; i < gearRatio.length; i++)
	{
		if(gearRatio[i]>currentSpeed)
		{
			gear = i;
			break;
		}
	}

	var gearMinValue : float = 0.00;
	var gearMaxValue : float = 0.00;

	if(i == 0)
	{
		gearMinValue = 0;
		//gearMaxValue = gearRatio[i];
	}

	else
	{
		gearMinValue = gearRatio[i-1];

	}
	gearMaxValue = gearRatio[i];
	var enginePitch : float = ((currentSpeed - gearMinValue) / (gearMaxValue - gearMinValue)) ;
	aSource.pitch = enginePitch + 1f;
}

function EngineSound()
{
	aSource.pitch = currentSpeed/topSpeed + 0.3f;
}

function SteerAngleFactor()
{
	steerAngleFactor = (topSpeed - currentSpeed) / 100;

	currentSteerAngle = steerMaxAngle * steerAngleFactor;

	wheelFL.steerAngle = Input.GetAxis("Horizontal") * currentSteerAngle;
	wheelFR.steerAngle = Input.GetAxis("Horizontal") * currentSteerAngle;
}