#pragma strict

var motor : float;
var steering : float;


function Start () 
{

}

function Update () 
{
	motor = Input.GetAxis("Vertical");
	steering = Input.GetAxis("Horizontal");
}