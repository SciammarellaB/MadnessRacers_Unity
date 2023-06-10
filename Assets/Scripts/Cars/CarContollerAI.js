var centerOfMass : Vector3;
var path : Array;
var pathGroup : Transform;
var maxSteer : float;
var wheelFL : WheelCollider;
var wheelFR : WheelCollider;
var wheelRL : WheelCollider;
var wheelRR : WheelCollider;
var wheelFLTrans : Transform;
var wheelFRTrans : Transform;
var wheelRLTrans : Transform;
var wheelRRTrans : Transform;
var currentPathObj : int;
var distFromPath : float;
var maxTorque : float;
var currentSpeed : float;
var topSpeed : float;
var reduceSpeed : float;
var aSource : AudioSource ;
var engineStartPitch: float;
var sensorLength : float;
var frontSensorStartPoint : float;
var frontSensorSideDist : float;
var frontSensorAngle : float;
var sidewaySensorLength : float;
private var flag : int;
var steerAngleFactor : float;
var currentSteerAngle : float;
var steerTarget : Transform;
var newSteer : float;
var currentFrictionScript : Skidding;
var speedLimit : float;
var raceStarted : boolean;
var needToBrake : boolean;

function Start () 
{
	gameObject.GetComponent(Rigidbody).centerOfMass = centerOfMass;
	GetPath();
	speedLimit = topSpeed;

}

function Update () 
{
	if(raceStarted == true)
	{
		currentSpeed = gameObject.GetComponent(Rigidbody).velocity.magnitude * 3.6f;
		currentSpeed = Mathf.Round(currentSpeed);
		GetSteer();
		Move();
		Sensor();
		MyGears();
		wheelFLTrans.Rotate(0,0,-(wheelFL.rpm/60 * 360 * Time.deltaTime));
		wheelFRTrans.Rotate(0,0,(wheelFR.rpm/60 * 360 * Time.deltaTime));
		wheelRLTrans.Rotate(0,0,-(wheelRL.rpm/60 * 360 * Time.deltaTime));
		wheelRRTrans.Rotate(0,0,(wheelRR.rpm/60 * 360 * Time.deltaTime));
		wheelFLTrans.localEulerAngles.y = wheelFL.steerAngle;
		wheelFRTrans.localEulerAngles.y = wheelFR.steerAngle + 180 ;
	}
}

function GetPath()
{
	var path_objs : Array = pathGroup.GetComponentsInChildren(Transform);
	path = new Array();

	for(var path_obj : Transform in path_objs)
	{
		if(path_obj != pathGroup)
		path [path.length] = path_obj;
	}

	Debug.Log(path.length);
}

function FixedUpdate()
{
	WheelPosition();
	    wheelRR.attachedRigidbody.AddForce(-transform.up * 100 * wheelRR.attachedRigidbody.velocity.magnitude);
		wheelRL.attachedRigidbody.AddForce(-transform.up * 100 * wheelRL.attachedRigidbody.velocity.magnitude);
		wheelFR.attachedRigidbody.AddForce(-transform.up * 100 * wheelFR.attachedRigidbody.velocity.magnitude);
		wheelFL.attachedRigidbody.AddForce(-transform.up * 100 * wheelFL.attachedRigidbody.velocity.magnitude);
}

function GetSteer()
{
    steerAngleFactor = ((topSpeed - currentSpeed) / 100) + 2;
    var steerVector : Vector3 = transform.InverseTransformPoint(Vector3 (steerTarget.position.x,transform.position.y,steerTarget.position.z));
	newSteer = maxSteer * (steerVector.x/steerVector.magnitude);
	wheelFL.steerAngle = newSteer * steerAngleFactor;
	wheelFR.steerAngle = newSteer * steerAngleFactor;
	if(steerVector.magnitude <= distFromPath)
	{
		currentPathObj++;

		if(currentPathObj >= path.length)
		{
			currentPathObj = 0;
		}
	}
}

function Move()
{
	var positiveSteering : float = Mathf.Abs(newSteer);

		if(positiveSteering > 0.8f && currentFrictionScript.currentFrictionValue > 0.1f || speedLimit < currentSpeed)
		{
			Debug.Log("Need to Brake");
			needToBrake = true;

		}

		else
		{
			needToBrake = false;
		}

		if(currentSpeed <= topSpeed && needToBrake == false)
		{
			wheelRL.motorTorque = maxTorque;
			wheelRR.motorTorque = maxTorque;
			wheelFL.motorTorque = maxTorque;
			wheelFR.motorTorque = maxTorque;
			wheelRL.brakeTorque = 0;
			wheelRR.brakeTorque = 0;
			wheelFL.brakeTorque = 0;
			wheelFR.brakeTorque = 0;
		}
		else
		{
			wheelRL.motorTorque = 0;
			wheelRR.motorTorque = 0;
			wheelFL.motorTorque = 0;
			wheelFR.motorTorque = 0;
			wheelRL.brakeTorque = reduceSpeed;
			wheelRR.brakeTorque = reduceSpeed;
			wheelFL.brakeTorque = reduceSpeed;
			wheelFR.brakeTorque = reduceSpeed;
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

function Sensor()
{
	flag = 0;
	var pos : Vector3;
	var hit : RaycastHit;
	var rightAngle = Quaternion.AngleAxis(frontSensorAngle,transform.up) * transform.forward;
	var leftAngle = Quaternion.AngleAxis(-frontSensorAngle,transform.up) * transform.forward;

	//Front mid Sensor
	pos = transform.position;
	pos += transform.forward * frontSensorStartPoint;
	if(Physics.Raycast(pos,transform.forward,hit,sensorLength))
	{
		Debug.DrawLine(pos,hit.point,Color.white);
	}

	//Front Straight Right Sensor
	pos += transform.right * frontSensorSideDist;
	if(Physics.Raycast(pos,transform.forward,hit,sensorLength))
	{
		Debug.DrawLine(pos,hit.point,Color.white);
		flag ++;
	}

	//Front Angled Right Sensor
	if(Physics.Raycast(pos,rightAngle,hit,sensorLength))
	{
		Debug.DrawLine(pos,hit.point,Color.white);
	}

	//Front Straight Left Sensor
	pos = transform.position;
	pos += transform.forward * frontSensorStartPoint;
	pos -= transform.right * frontSensorSideDist;
	if(Physics.Raycast(pos,transform.forward,hit,sensorLength))
	{
		Debug.DrawLine(pos,hit.point,Color.white);
	}

	//Front Angled Left Sensor

	if(Physics.Raycast(pos,leftAngle,hit,sensorLength))
	{
		Debug.DrawLine(pos,hit.point,Color.white);
	}

	//Right SidaWay Sensor
	if(Physics.Raycast(transform.position,transform.right,hit,sidewaySensorLength))
	{
		Debug.DrawLine(transform.position,hit.point,Color.white);
	}

	//Left SidaWay Sensor
	if(Physics.Raycast(transform.position,-transform.right,hit,sidewaySensorLength))
	{
		Debug.DrawLine(transform.position,hit.point,Color.white);
	}

}

function OnTriggerEnter (c : Collider)
{
	if(c.gameObject.tag == "Limiter1")
	{
		Debug.Log("Need to do 200Km/h");
		speedLimit = 200;
	}

	if(c.gameObject.tag == "Limiter2")
	{
		Debug.Log("Need to do 110Km/h");
		speedLimit = 110;
	}

	if(c.gameObject.tag == "Limiter3")
	{
		Debug.Log("Need to do 220Km/h");
		speedLimit = 220;
	}

	if(c.gameObject.tag == "Limiter4")
	{
		Debug.Log("Need to do 80Km/h");
		speedLimit = 80;
	}

	if(c.gameObject.tag == "Limiter5")
	{
		Debug.Log("Need to do 180Km/h");
		speedLimit = 180;
	}

	if(c.gameObject.tag == "Limiter6")
	{
		Debug.Log("Need to do 100Km/h");
		speedLimit = 100;
	}

	if(c.gameObject.tag == "Limiter7")
	{
		Debug.Log("Need to do 180Km/h");
		speedLimit = 180;
	}

	if(c.gameObject.tag == "Limiter8")
	{
		Debug.Log("Need to do 200Km/h");
		speedLimit = 200;
	}

	if(c.gameObject.tag == "Limiter9")
	{
		Debug.Log("Need to do TopSpeed");
		speedLimit = topSpeed;
	}

}