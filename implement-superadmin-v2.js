const fs = require('fs');
const pathSuperadmin = 'src/app/superadmin/page.js';
let code = fs.readFileSync(pathSuperadmin, 'utf8');

// The main layout starts here:
// <div className="flex h-screen bg-background text-foreground font-sans overflow-hidden">

const targetStartRegex = /return \(\s*<div className="flex h-screen bg-background text-foreground font-sans overflow-hidden">/;

const newLayoutStart = `return (
    <div className="flex h-screen bg-background text-foreground font-sans overflow-hidden relative">
      
      {/* Premium Luxury Background Glows (Mesh Gradient Effect) */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/20 rounded-[100%] blur-[160px] pointer-events-none z-0 animate-pulse-soft mix-blend-multiply dark:mix-blend-screen"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-violet-500/20 rounded-[100%] blur-[160px] pointer-events-none z-0 animate-pulse-soft mix-blend-multiply dark:mix-blend-screen" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-[20%] left-[30%] w-[40%] h-[40%] bg-fuchsia-500/10 rounded-[100%] blur-[140px] pointer-events-none z-0 animate-pulse-soft mix-blend-multiply dark:mix-blend-screen" style={{ animationDelay: '1s' }}></div>
`;

code = code.replace(targetStartRegex, newLayoutStart);

// Upgrade Sidebar bg
// Find: <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border/60 flex flex-col shrink-0 h-full shadow-xl transform transition-transform duration-300 md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}">
const oldSidebarRegex = /<aside className="fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border\/60 flex flex-col shrink-0 h-full shadow-xl transform transition-transform duration-300 md:relative md:translate-x-0 \$\{isSidebarOpen \? 'translate-x-0' : '-translate-x-full'\}">/;
const newSidebar = `<aside className="fixed inset-y-0 left-0 z-50 w-64 bg-card/40 backdrop-blur-2xl border-r border-border/60 flex flex-col justify-between shrink-0 h-full shadow-xl shadow-indigo-500/10 transform transition-transform duration-300 md:relative md:translate-x-0 \$\{isSidebarOpen ? 'translate-x-0' : '-translate-x-full'\}">`;
code = code.replace(oldSidebarRegex, newSidebar);

// Upgrade Header / Top Bar
const oldHeader = '<header className="h-20 flex items-center justify-between px-4 md:px-8 shrink-0 border-b border-border/30 bg-background/50 backdrop-blur-md">';
const newHeader = '<header className="h-20 flex items-center justify-between px-4 md:px-8 shrink-0 border-b border-border/30 bg-background/40 backdrop-blur-2xl relative z-20">';
code = code.replace(oldHeader, newHeader);

// Upgrade Search Bar
const oldSearchBar = 'className="flex bg-card border border-border rounded-full px-4 py-2 w-48 md:w-96 shadow-sm items-center gap-2"';
const newSearchBar = 'className="flex bg-card/50 backdrop-blur-md border border-border/50 rounded-full px-4 py-2.5 w-48 md:w-96 shadow-sm hover:shadow-md hover:bg-card/80 transition-all items-center gap-2"';
code = code.replace(oldSearchBar, newSearchBar);

// Upgrade main wrapper relative z-10
const oldMainWrapper = '<div className="flex-1 flex flex-col h-screen overflow-hidden relative z-10 bg-muted/10 w-full">';
const newMainWrapper = '<div className="flex-1 flex flex-col h-screen overflow-hidden relative z-10 w-full">';
code = code.replace(oldMainWrapper, newMainWrapper);

// Upgrade main content animate fade-in
const oldMain = '<main className="flex-1 overflow-y-auto p-4 md:p-8">';
const newMain = '<main className="flex-1 overflow-y-auto p-4 md:p-8 relative z-10 animate-fade-in">';
code = code.replace(oldMain, newMain);

// Add beautiful backdrop-blur to Pricing form
const oldPricingCard = '<div className="bg-card rounded-3xl border border-border/50 shadow-sm overflow-hidden flex flex-col p-6 max-w-4xl">';
const newPricingCard = '<div className="bg-card/40 backdrop-blur-3xl rounded-3xl border border-border/60 shadow-xl overflow-hidden flex flex-col p-6 md:p-10 max-w-4xl">';
code = code.replace(oldPricingCard, newPricingCard);

// Add beautiful backdrop-blur to Vouchers table container
const oldVouchersCard = '<div className="bg-card rounded-3xl border border-border/50 shadow-sm overflow-hidden flex flex-col p-6">';
const newVouchersCard = '<div className="bg-card/40 backdrop-blur-3xl rounded-3xl border border-border/60 shadow-xl overflow-hidden flex flex-col p-6 md:p-8">';
code = code.replace(oldVouchersCard, newVouchersCard);

fs.writeFileSync(pathSuperadmin, code, 'utf8');
console.log('Superadmin V2 UI Revamp completed!');
