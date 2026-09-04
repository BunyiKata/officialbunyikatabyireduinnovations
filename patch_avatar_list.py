import re

with open("public/app.js", "r") as f:
    js = f.read()

old_list = r"""        const avatarList = \[
            'fa-child-reaching', 'fa-child', 'fa-user-graduate', 'fa-user-astronaut', 'fa-user-ninja', 'fa-face-smile', 'fa-face-laugh-beam'
        \];"""

new_list = """        const avatarList = [
            'fa-child-reaching', 'fa-child', 'fa-user-graduate', 'fa-user-astronaut', 'fa-user-ninja', 'fa-face-smile', 'fa-face-laugh-beam', 'fa-frog', 'fa-cat', 'fa-dog', 'fa-robot', 'fa-dragon'
        ];"""

if re.search(old_list, js):
    js = re.sub(old_list, new_list, js)
    print("Patched avatarList")
else:
    print("avatarList pattern not found")

with open("public/app.js", "w") as f:
    f.write(js)
