const fs = require('fs');

const path = 'src/app/[masjidId]/admin/page.js';
let code = fs.readFileSync(path, 'utf8');

// Replace setActionStatus({success: true/false, message: ...})
code = code.replace(/setActionStatus\(\{\s*success:\s*true,\s*message:\s*(.*?)\s*\}\);?/g, 'toast.success($1);');
code = code.replace(/setActionStatus\(\{\s*success:\s*false,\s*message:\s*(.*?)\s*\}\);?/g, 'toast.error($1);');

// Replace executeSave wrapper setActionStatus
code = code.replace(/setActionStatus\(\{\s*success:\s*true,\s*message:\s*successMsg\s*\}\);?/g, 'toast.success(successMsg);');
code = code.replace(/setActionStatus\(\{\s*success:\s*false,\s*message:\s*(.*?)\s*\}\);?/g, 'toast.error($1);');

// Replace manual alert
code = code.replace(/alert\((.*?)\);?/g, 'toast($1);');

// Remove actionStatus declarations and usage
// Since it's complex, I'll just leave the variable declaration unused or manually remove it later.
// We need to remove the status alert badge rendering (line 874)

fs.writeFileSync(path, code);
console.log('Refactored alerts to toast in', path);
