#pragma strict

var cameraPos : Transform[];
var cameraObj : GameObject;
var i : int;



function Start () 
{
	i = 0;
}

function Update () 
{
	if (Input.GetKeyDown (KeyCode.C))
		{
			i++;
		}

		if (i > 2)
		{
			i = 0;
		}

		cameraObj.transform.position = cameraPos[i].position;

		if(Input.GetKeyDown(KeyCode.B))
		{
			
		}

		else
		{
			
		}
}