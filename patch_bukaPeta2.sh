sed -i '754,766c\
            let modules = [];\
            if (nomborPeta === 1) {\
                modules = [\
                    { id: "kenali_huruf", title: "Kenali Huruf", content: "A a B b", color: "var(--color-red)" },\
                    { id: "huruf_vokal", title: "Huruf Vokal", content: "A E I O U", color: "var(--color-red)" },\
                    { id: "huruf_konsonan", title: "Huruf Konsonan", content: "B C D F G", color: "var(--color-red)" },\
                    { id: "fonik_abc", title: "Fonik ABC", content: "a b c", color: "var(--color-red)" }\
                ];\
            } else if (nomborPeta === 2) {\
                modules = [\
                    { id: "suku_kata_kv", title: "KV", content: "ba ca", color: "var(--color-purple)" },\
                    { id: "suku_kata_kv_kv", title: "KV + KV", content: "ba pa", color: "var(--color-purple)" },\
                    { id: "suku_kata_v_kv", title: "V + KV", content: "a yam", color: "var(--color-purple)" },\
                    { id: "suku_kata_kv_kv_kv", title: "KV + KV + KV", content: "ke ru si", color: "var(--color-purple)" },\
                    { id: "suku_kata_kvk", title: "KVK", content: "beg mop", color: "var(--color-purple)" },\
                    { id: "suku_kata_v_kvk", title: "V + KVK", content: "u bat", color: "var(--color-purple)" }\
                ];\
            } else if (nomborPeta === 3) {\
                modules = [\
                    { id: "suku_kata_kv_kvk", title: "KV + KVK", content: "ka sut", color: "var(--color-orange)" },\
                    { id: "suku_kata_kvk_kv", title: "KVK + KV", content: "bot ku", color: "var(--color-orange)" },\
                    { id: "suku_kata_kvk_kvk", title: "KVK + KVK", content: "dok tor", color: "var(--color-orange)" },\
                    { id: "suku_kata_kvkk", title: "KVKK", content: "bank zink", color: "var(--color-orange)" },\
                    { id: "suku_kata_kv_kv_kvk", title: "KV + KV + KVK", content: "ke re ta", color: "var(--color-orange)" },\
                    { id: "suku_kata_kvk_kv_kvk", title: "KVK + KV + KVK", content: "sem pur na", color: "var(--color-orange)" }\
                ];\
            } else if (nomborPeta === 4) {\
                modules = [\
                    { id: "ayat_mudah", title: "Ayat Mudah", content: "Ayat", color: "var(--color-green)" },\
                    { id: "ayat_pendek", title: "Ayat Pendek", content: "Ayat Pendek", color: "var(--color-green)" },\
                    { id: "ayat_panjang", title: "Ayat Panjang", content: "Ayat Panjang", color: "var(--color-green)" },\
                    { id: "petikan_tahap_1", title: "Petikan Tahap 1", content: "Petikan 1", color: "var(--color-green)" },\
                    { id: "petikan_tahap_2", title: "Petikan Tahap 2", content: "Petikan 2", color: "var(--color-green)" },\
                    { id: "cerita_pendek", title: "Cerita Pendek", content: "Cerita", color: "var(--color-green)" }\
                ];\
            }\
' public/app.js
