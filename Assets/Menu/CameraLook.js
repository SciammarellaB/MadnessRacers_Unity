#pragma strict

//Correr a camera irá olhar para o carro
//Opções a camera irá olhar para a toolboard
//Sair a camera irá olhar para a porta da garagem TERMINAR

var target : Transform[];
var i : int;
var onScreenText : UI.Text;

function Start ()
{
	i = 1;
}

function Update ()
{
	if(Input.GetKeyDown(KeyCode.RightArrow) && i <2)
	{
		i++;
	}

	if(Input.GetKeyDown(KeyCode.LeftArrow) && i >0)
	{
		i--;
	}

	if(i == 1 && Input.GetKeyDown(KeyCode.Return)) Application.LoadLevel("Pista1");
	if(i == 0 && Input.GetKeyDown(KeyCode.Return)) Application.Quit();
	
	if(i== 0) onScreenText.text = "Sair";
	if(i== 1) onScreenText.text = "Correr";
	if(i== 2) onScreenText.text = "Opções";

	gameObject.transform.LookAt(target[i]);

}