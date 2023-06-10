#pragma strict

var carPlayer : GameObject;
var carIA : GameObject;
var startLine : GameObject;
var lapText : UI.Text;
var posText : UI.Text;
var lapCount: int;
var posCount: int;
var carLap : int;
var iaLap : int;


function Start () 
{
	carPlayer = GameObject.FindGameObjectWithTag("Car");
	carIA = GameObject.FindGameObjectWithTag("CarIA");
	startLine = GameObject.FindGameObjectWithTag("Limiter10");
}

function Update () 
{
	lapText.text = "Lap:" + lapCount + "/3";
	posText.text = "Pos:" + posCount + "/2";

	if(iaLap > carLap)
	{
		posCount = 2;
	}

	if(carLap > iaLap)
	{
		posCount = 1;
	}
}

function OnTriggerEnter(c : Collider)
{
	if(c.gameObject.tag == "CarIA")
	{
		iaLap++;
	}

	if(c.gameObject.tag == "Car")
	{
		carLap++;
		lapCount++;
	}
}

