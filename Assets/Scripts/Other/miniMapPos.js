#pragma strict

	var target : GameObject;

function Start () 
{
	target = GameObject.FindGameObjectWithTag("Car");
}

function Update ()
{
	gameObject.transform.position.x = target.transform.position.x;
	gameObject.transform.position.z = target.transform.position.z;
}