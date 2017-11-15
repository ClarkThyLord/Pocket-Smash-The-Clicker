extends Node2D

# class member variables go here, for example:
# var a = 2
# var b = "textvar"

export(String, DIR) var PATH = ""

var ON = 0
var SIZE = 0

func _ready():
	# Called every time the node is added to the scene.
	# Initialization here
	var dir = Directory.new()
	if dir.open(PATH) == OK:
		dir.list_dir_begin()
		var POS = 400
		while true:
			# Get the file
			var file = dir.get_next()
			
			# Check if it's a invalid file
			if file == "." or file == ".." or file.begins_with("monster"):
				continue
			
			elif file == "":
				break
			
			if file.extension() == "xml":
				print(PATH + "/" + file)
			
				var instance = load(PATH + "/" + file).instance()
				instance.set_name(file)
				instance.set_pos(Vector2(POS, 350))
				self.add_child(instance)
				
				SIZE += 1
				POS += 375
