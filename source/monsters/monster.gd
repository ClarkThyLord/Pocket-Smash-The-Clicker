extends Sprite

# class member variables go here, for example:
# var a = 2
# var b = "textvar"

export(String) var NAME = "Unknown Monster"

export(int) var LIFE = 100
export(int) var DEFENCE = 10
export(int) var RESISTENCE = 10

export(int) var DMG = 10
export(int) var FEED = 10
export(int) var POWER = 100

onready var ANI = getNode("animations")

func _ready():
	# Called every time the node is added to the scene.
	# Initialization here
	set_process(true)

func action():
	ANI.play("action")

func _process(delta):
	if LIFE <= 0:
		print(NAME + " IS DEAD")
