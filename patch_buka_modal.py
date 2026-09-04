import re

with open("public/app.js", "r") as f:
    js = f.read()

old_buka = r"""        window\.bukaModalAvatar = function\(\) \{
            tutupSidePanel\(\);
            if \(\!namaMuridAktif \|\| \!studentData\[namaMuridAktif\]\) return;"""

new_buka = """        window.bukaModalAvatar = function() {
            tutupSidePanel();
            console.log("bukaModalAvatar invoked. namaMuridAktif:", namaMuridAktif);
            if (!namaMuridAktif) {
                alert("Sila log masuk dahulu!");
                return;
            }
            if (!studentData[namaMuridAktif]) {
                studentData[namaMuridAktif] = studentRecord();
            }"""

if re.search(old_buka, js):
    js = re.sub(old_buka, new_buka, js)
    print("Patched bukaModalAvatar robustness")
else:
    print("bukaModalAvatar pattern not found")

with open("public/app.js", "w") as f:
    f.write(js)
