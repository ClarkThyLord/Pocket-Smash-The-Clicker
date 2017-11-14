extends Area2D

# class member variables go here, for example:
# var a = 2
# var b = "textvar"

export(String, FILE) var LOCATION = "";

onready var ANI = get_node("animations")

func _ready():
	# Called every time the node is added to the scene.
	# Initialization here
	set_process_input(true)
	connect("mouse_enter", self, "_mouse_enter")
	connect("mouse_exit", self, "_mouse_exit")

func _input(event):
	if event.type == InputEvent.MOUSE_BUTTON and event.button_index == BUTTON_LEFT and event.pressed:
		ANI.play("press")
		get_tree().change_scene(LOCATION)

func _mouse_enter():
	ANI.play("hover")

func _mouse_exit():
	ANI.play("default")
