#pragma strict

//var speedText : UI.Text;
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
var maxBrakeTorque : float;
var aSource : AudioSource ;
var engineStartPitch: float;
var nitro : float;
var raceStarted : boolean;
var userControlScript : UserControl;


function Start () 
{
	rBody = gameObject.GetComponent(Rigidbody);
	rBody.centerOfMass.y = -0.9f;
}

function FixedUpdate () 
{
	//if(raceStarted == true)
	//{
		Controle();
		SteerAngleFactor();
	//}
}

function Update()
{
	//speedText.text = "Km/h:" + currentSpeed.ToString();
	wheelFLTrans.Rotate(0,0,(wheelFL.rpm/60 * 360 * Time.deltaTime));
	wheelFRTrans.Rotate(0,0,-(wheelFR.rpm/60 * 360 * Time.deltaTime));
	wheelRLTrans.Rotate(0,0,-(wheelRL.rpm/60 * 360 * Time.deltaTime));
	wheelRRTrans.Rotate(0,0,(wheelRR.rpm/60 * 360 * Time.deltaTime));
	wheelFLTrans.localEulerAngles.y = wheelFL.steerAngle;
	wheelFRTrans.localEulerAngles.y = wheelFR.steerAngle + 180 ;
	WheelPosition();
	MyGears();
}

function Controle()
{
	currentSpeed = rBody.velocity.magnitude * 3.6f;
	currentSpeed = Mathf.Round(currentSpeed);
	if(currentSpeed < topSpeed)
	{
		wheelRR.motorTorque = maxTorque * userControlScript.motor;
		wheelRL.motorTorque = maxTorque * userControlScript.motor;
		wheelFL.motorTorque = maxTorque * userControlScript.motor;
		wheelFR.motorTorque = maxTorque * userControlScript.motor;
		wheelRR.attachedRigidbody.AddForce(-transform.up * 100 * wheelRR.attachedRigidbody.velocity.magnitude);
		wheelRL.attachedRigidbody.AddForce(-transform.up * 100 * wheelRL.attachedRigidbody.velocity.magnitude);
		wheelFR.attachedRigidbody.AddForce(-transform.up * 100 * wheelFR.attachedRigidbody.velocity.magnitude);
		wheelFL.attachedRigidbody.AddForce(-transform.up * 100 * wheelFL.attachedRigidbody.velocity.magnitude);
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

function SteerAngleFactor()
{
	steerAngleFactor = ((topSpeed - currentSpeed) / 100) + 2;
	currentSteerAngle = steerMaxAngle * steerAngleFactor;
	wheelFL.steerAngle = userControlScript.steering * currentSteerAngle;
	wheelFR.steerAngle = userControlScript.steering * currentSteerAngle;
}

function MyGears()
{
	if(currentSpeed < topSpeed/3.3f)
	{
		aSource.pitch = currentSpeed/topSpeed + engineStartPitch;
	}

	if(currentSpeed > topSpeed/3.3f && currentSpeed < topSpeed/2.06f)
	{
		aSource.pitch = currentSpeed/topSpeed + engineStartPitch - 0.1f;
	}

	if(currentSpeed > topSpeed/2.06f && currentSpeed < topSpeed/1.5f)
	{
		aSource.pitch = currentSpeed/topSpeed + engineStartPitch - 0.25f;
	}

	if(currentSpeed > topSpeed/1.5f && currentSpeed < topSpeed/1.17f)
	{
		aSource.pitch = currentSpeed/topSpeed + engineStartPitch - 0.4f;
	}

	if(currentSpeed > topSpeed/1.17f)
	{
		aSource.pitch = currentSpeed/topSpeed + engineStartPitch - 0.55f;
	}
}

function Nitro()
{
	
}