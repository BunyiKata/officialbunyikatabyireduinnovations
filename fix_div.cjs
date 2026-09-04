const fs = require('fs');
let code = fs.readFileSync('src/components/TandukKataGame.tsx', 'utf-8');

code = code.replace(
    /> <i className="fa-solid fa-arrow-up"><\/i> <\/button>\n\s*<\/div>\n\s*<\/div>\n\s*\);\n};/g,
    "> <i className=\"fa-solid fa-arrow-up\"></i> </button>\n                </div>\n            </div>\n        </div>\n    );\n};"
);

// Wait, the regex might fail. Let's just fix the end of the file.
// The file currently ends with:
// > <i className="fa-solid fa-arrow-up"></i> </button>            </div>        </div>    );};
// Actually let's just restore from .bak and run it perfectly ONE more time.
