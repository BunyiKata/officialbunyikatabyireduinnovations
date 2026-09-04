const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// The block is:
//             </div>
//         </div>
//         <button className="neo-btn bg-yellow" style={{"width":"100%","marginTop":"10px","fontSize":"1.2rem","padding":"15px"}} onClick={(e) => { logMasukMurid() }}>

code = code.replace(/<\/div>\s*<\/div>\s*<button className="neo-btn bg-yellow"/,
    `</div>\n        <button className="neo-btn bg-yellow"`);

fs.writeFileSync('src/App.tsx', code);
