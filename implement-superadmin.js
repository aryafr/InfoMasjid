const fs = require('fs');
const pathSuperadmin = 'src/app/superadmin/page.js';
let code = fs.readFileSync(pathSuperadmin, 'utf8');

// 1. Add 'Copy', 'Check' icons to lucide-react import
if (!code.includes('Copy,')) {
    code = code.replace('from "lucide-react";', 'Copy, Check\n} from "lucide-react";');
}

// 2. Add copy state to component
if (!code.includes('const [copiedCode,')) {
    code = code.replace('const [newVoucher, setNewVoucher] = useState({', 'const [copiedCode, setCopiedCode] = useState(null);\n  const [newVoucher, setNewVoucher] = useState({');
}

// 3. Upgrade Sidebar
code = code.replace(
  'className="flex items-center gap-3 px-3 md:px-4 py-3 rounded-xl text-sm font-medium transition-all text-muted-foreground hover:bg-muted hover:text-foreground"',
  'className="flex items-center gap-3 px-3 md:px-4 py-3 rounded-xl text-sm font-medium transition-all text-muted-foreground hover:bg-indigo-500/10 hover:text-indigo-500 hover:shadow-inner"'
).replace(
  'className="flex items-center gap-3 px-3 md:px-4 py-3 rounded-xl text-sm font-bold bg-primary text-primary-foreground shadow-md relative overflow-hidden"',
  'className="flex items-center gap-3 px-3 md:px-4 py-3 rounded-xl text-sm font-bold bg-indigo-500 text-white shadow-lg shadow-indigo-500/30 relative overflow-hidden"'
);

// We should replace all inactive tab classes and active tab classes
code = code.replace(/className="flex items-center gap-3 px-3 md:px-4 py-3 rounded-xl text-sm font-medium transition-all text-muted-foreground hover:bg-muted hover:text-foreground"/g, 
  'className="flex items-center gap-3 px-3 md:px-4 py-3 rounded-xl text-sm font-medium transition-all text-muted-foreground hover:bg-indigo-500/10 hover:text-indigo-500 hover:shadow-inner"');

code = code.replace(/className="flex items-center gap-3 px-3 md:px-4 py-3 rounded-xl text-sm font-bold bg-primary text-primary-foreground shadow-md relative overflow-hidden"/g, 
  'className="flex items-center gap-3 px-3 md:px-4 py-3 rounded-xl text-sm font-bold bg-indigo-500 text-white shadow-lg shadow-indigo-500/30 relative overflow-hidden"');

// Fix the little active tab indicator from bg-primary to bg-indigo-500
code = code.replace(/bg-primary rounded-r-md/g, 'bg-indigo-500 rounded-r-md');
code = code.replace(/text-primary/g, 'text-indigo-500'); // make primary text indigo
code = code.replace(/bg-primary/g, 'bg-indigo-500'); // make primary bg indigo 
// Note: we might accidentally replace tailwind classes. Let's do it carefully.
// The above is too aggressive, let's revert in memory and do specific.

code = fs.readFileSync(pathSuperadmin, 'utf8');

if (!code.includes('Copy,')) {
  code = code.replace('from "lucide-react";', 'Copy, Check\n} from "lucide-react";');
}

if (!code.includes('const [copiedCode,')) {
  code = code.replace('const [newVoucher, setNewVoucher] = useState({', 'const [copiedCode, setCopiedCode] = useState(null);\n  const [newVoucher, setNewVoucher] = useState({');
}

// Copy Code function
if (!code.includes('const handleCopyCode')) {
  code = code.replace('const submitEditPackage = async () => {', 
  `const handleCopyCode = (codeText) => {
    navigator.clipboard.writeText(codeText);
    setCopiedCode(codeText);
    setTimeout(() => setCopiedCode(null), 2000);
  };
  
  const submitEditPackage = async () => {`);
}

// 4. Upgrade Stats Cards
const oldStatCard = 'className="bg-card p-6 rounded-3xl border border-border/50 shadow-sm flex flex-col justify-between"';
const newStatCard = 'className="bg-card/40 backdrop-blur-3xl p-6 rounded-3xl border border-border/60 shadow-xl transition-all hover:-translate-y-2 hover:shadow-indigo-500/20 group flex flex-col justify-between"';
code = code.split(oldStatCard).join(newStatCard);

// 5. Upgrade Table in Customers
const oldTableContainer = 'className="bg-card rounded-3xl border border-border/50 shadow-sm overflow-hidden"';
const newTableContainer = 'className="bg-card/40 backdrop-blur-3xl rounded-3xl border border-border/60 shadow-xl shadow-indigo-500/5 overflow-hidden"';
code = code.split(oldTableContainer).join(newTableContainer);

// 6. Fix primary button in customers to indigo
code = code.replace(/bg-primary text-primary-foreground/g, 'bg-indigo-500 text-white hover:bg-indigo-600 shadow-indigo-500/30');
code = code.replace(/bg-primary text-white/g, 'bg-indigo-500 text-white hover:bg-indigo-600 shadow-indigo-500/30');
code = code.replace(/text-primary/g, 'text-indigo-500');

// 7. Add Copy button in Vouchers table
// Find: <td className="px-4 py-4 font-bold text-primary">{v.code}</td>
// Replace with:
const oldCodeRow = `<td className="px-4 py-4 font-bold text-indigo-500">{v.code}</td>`;
const newCodeRow = `<td className="px-4 py-4 font-bold text-indigo-500">
                            <div className="flex items-center gap-2">
                              {v.code}
                              <button 
                                onClick={() => handleCopyCode(v.code)}
                                className="p-1.5 hover:bg-indigo-500/10 rounded-md transition-colors text-muted-foreground hover:text-indigo-500"
                                title="Copy code"
                              >
                                {copiedCode === v.code ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                              </button>
                            </div>
                          </td>`;
code = code.replace(oldCodeRow, newCodeRow);

// 8. Add premium aura to Sidebar right
const oldRightSidebar = 'className="w-80 bg-card border-l border-border/60 flex flex-col shrink-0 h-full z-20 shadow-xl hidden xl:flex"';
const newRightSidebar = 'className="w-80 bg-card/60 backdrop-blur-xl border-l border-border/60 flex flex-col shrink-0 h-full z-20 shadow-2xl hidden xl:flex relative"';
code = code.replace(oldRightSidebar, newRightSidebar);

fs.writeFileSync(pathSuperadmin, code, 'utf8');
console.log('Superadmin UI upgraded successfully!');
