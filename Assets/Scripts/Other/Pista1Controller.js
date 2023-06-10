#pragma strict

var startLine : GameObject;
var car : GameObject;
var ia : GameObject;
var startLineScript : LapAndPos;
var carScript : CarController;
var iaScript : CarContollerAI;
var startCount : float;
var startCountToShow : float;
var startCountText : UI.Text;
var continuarText : GameObject;
var sairText : GameObject;
var canCount : boolean;
var startSoundSource1 : AudioSource;
var startClip : AudioClip;

function Start () 
{
	car = GameObject.FindGameObjectWithTag("Car");
	ia = GameObject.FindGameObjectWithTag("CarIA");
	startLine = GameObject.FindGameObjectWithTag("Limiter10");
	startLineScript = startLine.GetComponent("LapAndPos");
	carScript = car.GetComponent("CarController");
	iaScript = ia.GetComponent("CarContollerAI");
	canCount = true;
	startCount = 0;
	continuarText.SetActive(false);
	sairText.SetActive(false);
	Time.timeScale = 1;
}

function Update () 
{	
	StartRace();
	if(Input.GetKeyDown(KeyCode.Escape))	continuarText.SetActive(true);
	if(Input.GetKeyDown(KeyCode.Escape))	sairText.SetActive(true);
	if(Input.GetKeyDown(KeyCode.Escape))	Time.timeScale = 0;
}


function StartRace()
{
	if(canCount == true)
	{
		startCount += Time.deltaTime;
		startCountToShow = Mathf.Round(startCount);
		startCountText.text = startCountToShow.ToString();
	}

	if(startCountToShow == 4)
	{
		startCountText.text = "Vai!!!!!";
		iaScript.raceStarted = true;
		carScript.raceStarted = true;
		Destroy(startCountText,1);
		startSoundSource1.Pause();
		startSoundSource1.clip = startClip;
		startSoundSource1.Play();
	}
	if(startCountToShow > 4) canCount = false;
}

function Continuar()
{
	continuarText.SetActive(false);
	sairText.SetActive(false);
	Time.timeScale = 1;
}

function Sair()
{
	Application.LoadLevel("Menu");
}