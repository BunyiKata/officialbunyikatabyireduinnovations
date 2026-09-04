with open("public/app.js", "r") as f:
    js = f.read()

orig_modules_2 = """            } else if (nomborPeta === 2) {
                modules = [
                    { id: "suku_kata_kv", title: "KV", content: "ba ca", color: "var(--color-purple)" },
                    { id: "suku_kata_kv_kv", title: "KV + KV", content: "ba pa", color: "var(--color-purple)" },
                    { id: "suku_kata_v_kv", title: "V + KV", content: "a yam", color: "var(--color-purple)" },
                    { id: "suku_kata_kv_kv_kv", title: "KV + KV + KV", content: "ke ru si", color: "var(--color-purple)" },
                    { id: "suku_kata_kvk", title: "KVK", content: "beg mop", color: "var(--color-purple)" },
                    { id: "suku_kata_v_kvk", title: "V + KVK", content: "u bat", color: "var(--color-purple)" }
                ];"""

new_modules_2 = """            } else if (nomborPeta === 2) {
                modules = [
                    { id: "suku_kata_kv", title: "KV", content: "ba ca", image: "https://i.postimg.cc/qv4G9mt5/Copy-of-BUNYI-KATA-APPS-(9).png", color: "var(--color-purple)" },
                    { id: "suku_kata_kv_kv", title: "KV + KV", content: "ba pa", image: "https://i.postimg.cc/nh21ZvB7/Copy-of-BUNYI-KATA-APPS-(10).png", color: "var(--color-purple)" },
                    { id: "suku_kata_v_kv", title: "V + KV", content: "a yam", image: "https://i.postimg.cc/L5jzWfm1/Copy-of-BUNYI-KATA-APPS-(12).png", color: "var(--color-purple)" },
                    { id: "suku_kata_kv_kv_kv", title: "KV + KV + KV", content: "ke ru si", image: "https://i.postimg.cc/rm0GS3b0/Copy-of-BUNYI-KATA-APPS-(11).png", color: "var(--color-purple)" },
                    { id: "suku_kata_kvk", title: "KVK", content: "beg mop", image: "https://i.postimg.cc/TYqVqrkz/Copy-of-BUNYI-KATA-APPS-(13).png", color: "var(--color-purple)" },
                    { id: "suku_kata_v_kvk", title: "V + KVK", content: "u bat", image: "https://i.postimg.cc/HkYQSVR7/Copy-of-BUNYI-KATA-APPS-(14).png", color: "var(--color-purple)" }
                ];"""

js = js.replace(orig_modules_2, new_modules_2)

with open("public/app.js", "w") as f:
    f.write(js)
