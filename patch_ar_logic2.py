import re

with open("public/app-logic.js", "r") as f:
    content = f.read()

target1 = """        'v_kv': ["abu", "api", "ubi", "ibu", "isi", "ikan", "ayam", "ular", "awan", "ulat", "itik", "emak", "ekor", "oren", "otak", "obor", "epal", "emas", "enam"],
        'kvkvkv': ["kamera", "kereta", "menara", "kucing", "burung", "pisang", "jagung", "payung", "loceng", "sotong", "butang", "padang", "kacang", "gunting", "kambing"]
    };"""

replacement1 = """        'v_kv': ["abu", "api", "ubi", "ibu", "isi", "ikan", "ayam", "ular", "awan", "ulat", "itik", "emak", "ekor", "oren", "otak", "obor", "epal", "emas", "enam"],
        'kvkvkv': ["kamera", "kereta", "menara", "kucing", "burung", "pisang", "jagung", "payung", "loceng", "sotong", "butang", "padang", "kacang", "gunting", "kambing"],
        'kvk': ["beg", "bot", "bas", "cat", "jam", "jus", "kek", "zip", "kad", "mop", "pen", "pin", "tin", "van", "gam", "gol", "jet", "sos"],
        'v_kvk': ["adik", "ekor", "ikan", "ular", "otak", "awan", "emas", "epal", "ubat", "emak", "ulat", "itik", "oren"]
    };"""

content = content.replace(target1, replacement1)

target2 = """    if (window.arFaceMesh) {
        window.arFaceMesh.close();
        window.arFaceMesh = null;
    }
    paparSkrin('murid-menu-belajar');
};"""

replacement2 = """    if (window.arFaceMesh) {
        window.arFaceMesh.close();
        window.arFaceMesh = null;
    }
    paparSkrin('map-screen');
};"""

content = content.replace(target2, replacement2)

with open("public/app-logic.js", "w") as f:
    f.write(content)

print("Patched app-logic.js words and exit target")
