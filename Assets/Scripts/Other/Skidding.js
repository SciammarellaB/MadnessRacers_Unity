#pragma strict

var currentFrictionValue : float ;
var skidAt : float;
var soundEmition : float;
private var soundWait : float;
var skidAudioSource : AudioSource;
var skidSound : GameObject;

function Start () 
{
	skidAudioSource = gameObject.GetComponent(AudioSource);
}

function Update () 
{
	var hit : WheelHit;
	transform.GetComponent(WheelCollider).GetGroundHit(hit);
	currentFrictionValue = Mathf.Abs(hit.sidewaysSlip);

	if(skidAt <= currentFrictionValue && soundWait <= 0)
	{
		Instantiate(skidSound,hit.point,Quaternion.identity);
		soundWait = 1;
	}

	soundWait-= Time.deltaTime * soundEmition;
}