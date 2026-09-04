with open("public/app.js", "r") as f:
    js = f.read()

orig_modules = """            } else if (nomborPeta === 3) {
                modules = [
                    { id: "suku_kata_kv_kvk", title: "KV + KVK", content: "ka sut", color: "var(--color-orange)" },
                    { id: "suku_kata_kvk_kv", title: "KVK + KV", content: "bot ku", color: "var(--color-orange)" },
                    { id: "suku_kata_kvk_kvk", title: "KVK + KVK", content: "dok tor", color: "var(--color-orange)" },
                    { id: "suku_kata_kvkk", title: "KVKK", content: "bank zink", color: "var(--color-orange)" },
                    { id: "suku_kata_kv_kv_kvk", title: "KV + KV + KVK", content: "ke re ta", color: "var(--color-orange)" },
                    { id: "suku_kata_kvk_kv_kvk", title: "KVK + KV + KVK", content: "sem pur na", color: "var(--color-orange)" }
                ];"""

new_modules = """            } else if (nomborPeta === 3) {
                modules = [
                    { id: "suku_kata_kv_kvk", title: "KV + KVK", content: "ka sut", image: "https://i.postimg.cc/nrfdMnzL/Copy-of-BUNYI-KATA-APPS-(15).png", color: "var(--color-orange)" },
                    { id: "suku_kata_kvk_kv", title: "KVK + KV", content: "bot ku", image: "https://i.postimg.cc/kGNTbL6f/Copy-of-BUNYI-KATA-APPS-(16).png", color: "var(--color-orange)" },
                    { id: "suku_kata_kvk_kvk", title: "KVK + KVK", content: "dok tor", image: "https://i.postimg.cc/2jncMLc2/Copy-of-BUNYI-KATA-APPS-(17).png", color: "var(--color-orange)" },
                    { id: "suku_kata_kvkk", title: "KVKK", content: "bank zink", image: "https://i.postimg.cc/ZKZ7SYXZ/Copy-of-BUNYI-KATA-APPS-(18).png", color: "var(--color-orange)" },
                    { id: "suku_kata_kv_kv_kvk", title: "KV + KV + KVK", content: "ke re ta", image: "https://i.postimg.cc/QddfF4Xp/Copy-of-BUNYI-KATA-APPS-(19).png", color: "var(--color-orange)" },
                    { id: "suku_kata_kvk_kv_kvk", title: "KVK + KV + KVK", content: "sem pur na", image: "https://i.postimg.cc/LsrD0mj1/Copy-of-BUNYI-KATA-APPS-(20).png", color: "var(--color-orange)" }
                ];"""

if orig_modules in js:
    js = js.replace(orig_modules, new_modules)
    with open("public/app.js", "w") as f:
        f.write(js)
    print("Patched successfully")
else:
    print("Could not find the original block")

