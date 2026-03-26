import { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
    ChevronDown,
    UserCircle,
    ArrowLeft,
    ArrowRight,
} from 'lucide-react';
import { ModeToggle } from '../common/ModelToggle';
import { menuItems } from '../../constants';
import CodeNest_Logo from '../../assets/codenest_logo_horizontal.webp';
import type { TMenuItem } from '../../types';

const Sidebar = () => {
    const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
    const [openSubMenus, setOpenSubMenus] = useState<Record<string, boolean>>({});

    const location = useLocation();

    // Kiểm tra xem một item hoặc sub-item có đang active hay không
    const checkActive = (item: TMenuItem): boolean => {
        if (item.link && location.pathname === item.link) return true;
        if (item.subItems) {
            return item.subItems.some(sub => sub.link === location.pathname);
        }
        return false;
    };

    const toggleSubMenu = (label: string) => {
        if (isCollapsed) return;
        setOpenSubMenus(prev => ({
            ...prev,
            [label]: !prev[label]
        }));
    };

    return (
        <aside className={`sticky top-0 left-0 flex flex-col h-screen transition-all duration-300 bg-foreground text-slate-100 border-r border-slate-700 ${isCollapsed ? 'w-20' : 'w-64'}`}>

            {/* Toggle Button */}
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="absolute text-text top-8 -right-4 w-8 h-8 bg-foreground border border-slate-700 rounded-full flex items-center justify-center cursor-pointer hover:bg-primary/10 transition-colors z-50"
            >
                {isCollapsed ? <ArrowRight size={18} /> : <ArrowLeft size={18} />}
            </button>

            {/* Logo Section */}
            <div className="p-4 flex items-center justify-center h-20 border-b border-primary/10">
                <img
                    src={CodeNest_Logo}
                    alt="Logo"
                    className={`transition-all duration-300 object-contain ${isCollapsed ? 'w-10' : 'w-40'}`}
                />
            </div>

            {/* Menu List */}
            <nav className="flex-1 overflow-y-auto p-3 space-y-2 overflow-x-hidden">
                {(menuItems as TMenuItem[]).map((item, index) => {
                    const isActive = checkActive(item);
                    const hasSubItems = !!item.subItems && item.subItems.length > 0;
                    const isOpen = openSubMenus[item.label] || (isActive && !isCollapsed);

                    return (
                        <div key={index} className="w-full">
                            {hasSubItems ? (
                                <>
                                    <div
                                        onClick={() => toggleSubMenu(item.label)}
                                        className={`w-full flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all
                                            ${isActive ? 'text-primary' : 'text-text hover:bg-primary/10 hover:text-primary'}
                                        `}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="flex-shrink-0">{item.icon}</div>
                                            {!isCollapsed && <span className="font-medium whitespace-nowrap">{item.label}</span>}
                                        </div>
                                        {!isCollapsed && (
                                            <ChevronDown size={16} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                                        )}
                                    </div>

                                    {/* Render Sub-items */}
                                    {!isCollapsed && isOpen && (
                                        <div className="ml-9 mt-1 space-y-1 border-l border-slate-700">
                                            {item.subItems?.map((sub, idx) => (
                                                <Link
                                                    key={idx}
                                                    to={sub.link || '#'}
                                                    className={`block p-2 pl-4 text-sm rounded-md transition-all
                                                        ${location.pathname === sub.link
                                                            ? 'text-primary bg-primary/10 font-bold'
                                                            : 'text-text-secondary hover:text-primary hover:bg-primary/10'}
                                                    `}
                                                >
                                                    {sub.label}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </>
                            ) : (
                                <Link
                                    to={item.link || '#'}
                                    className={`flex items-center gap-3 p-3 rounded-lg transition-all
                                        ${isActive
                                            ? 'bg-primary/10 text-primary font-bold'
                                            : 'text-text hover:bg-primary/10 hover:text-primary'}
                                    `}
                                >
                                    <div className="flex-shrink-0">{item.icon}</div>
                                    {!isCollapsed && <span className="font-medium whitespace-nowrap">{item.label}</span>}
                                </Link>
                            )}
                        </div>
                    );
                })}
            </nav>

            {/* Footer Profile */}
            <div className={`p-4 border-t border-primary/10 flex items-center transition-all ${isCollapsed ? 'flex-col gap-4' : 'justify-between'}`}>
                <ModeToggle />
                <div className="cursor-pointer hover:opacity-80 transition-opacity">
                    <UserCircle size={isCollapsed ? 28 : 32} className="text-text" />
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;