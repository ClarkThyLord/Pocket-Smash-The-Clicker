extends Area2D

# class member variables go here, for example:
# var a = 2
# var b = "textvar"

onready var ANI = get_node("text/animations")
export var LOCATION = ""

func _ready():
	# Called every time the node is added to the scene.
	# Initialization here
	pass

func _input_event(viewport, event, shape_idx):
	if event.type == InputEvent.MOUSE_BUTTON and event.button_index == BUTTON_LEFT and event.pressed:
		get_tree().change_scene(LOCATION)


func _on_mouse_enter():
	ANI.play("hover")


func _on_mouse_exit():
	ANI.play("default")
