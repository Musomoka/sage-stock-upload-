import React from 'react';
type ViewKey = 'dashboard' | 'import' | 'data' | 'settings';
interface SidebarProps {
    activeView: ViewKey;
    onNavigate: (view: ViewKey) => void;
    compact?: boolean;
}
declare const Sidebar: React.FC<SidebarProps>;
export default Sidebar;
