#pragma strict

var destroyAfter : float;
private var timer : float;

function Update () 
{
	timer+= Time.deltaTime;
	if(destroyAfter <= timer)
	{
		Destroy(gameObject);
	}
}