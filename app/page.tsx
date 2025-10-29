"use client";
import React, { useState, useRef, useEffect } from 'react';

// ==============================
// TYPES
// ==============================
type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type Variant = 'solid' | 'outline' | 'ghost';
type Color = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
type Position = 'top' | 'bottom' | 'left' | 'right';

// ==============================
// CODE BLOCK COMPONENT
// ==============================
interface CodeBlockProps {
  code: string;
  language?: string;
}

const CodeBlock = ({ code, language = 'tsx' }: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative">
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 px-3 py-1 text-xs bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors z-10"
      >
        {copied ? 'Copied!' : 'Copy'}
      </button>
      <pre className="bg-gray-900 text-white p-4 rounded-md overflow-x-auto text-sm">
        <code>{code}</code>
      </pre>
    </div>
  );
};

// ==============================
// BUTTON COMPONENT
// ==============================
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  color?: Color;
}

const Button = ({ 
  children, 
  variant = 'solid', 
  size = 'md', 
  loading = false,
  icon,
  iconPosition = 'left',
  color = 'primary',
  className = '',
  disabled,
  ...props 
}: ButtonProps) => {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg";
  
  const sizes = {
    xs: "px-2 py-1 text-xs",
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
    xl: "px-8 py-4 text-lg"
  };

  const colors = {
    primary: "focus:ring-blue-500",
    secondary: "focus:ring-gray-500",
    success: "focus:ring-green-500",
    warning: "focus:ring-yellow-500",
    error: "focus:ring-red-500",
    info: "focus:ring-cyan-500"
  };

  const variants = {
    solid: {
      primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-sm",
      secondary: "bg-gray-600 text-white hover:bg-gray-700 shadow-sm",
      success: "bg-green-600 text-white hover:bg-green-700 shadow-sm",
      warning: "bg-yellow-500 text-white hover:bg-yellow-600 shadow-sm",
      error: "bg-red-600 text-white hover:bg-red-700 shadow-sm",
      info: "bg-cyan-600 text-white hover:bg-cyan-700 shadow-sm"
    },
    outline: {
      primary: "border border-blue-600 text-blue-600 hover:bg-blue-50",
      secondary: "border border-gray-300 text-gray-700 hover:bg-gray-50",
      success: "border border-green-600 text-green-600 hover:bg-green-50",
      warning: "border border-yellow-600 text-yellow-600 hover:bg-yellow-50",
      error: "border border-red-600 text-red-600 hover:bg-red-50",
      info: "border border-cyan-600 text-cyan-600 hover:bg-cyan-50"
    },
    ghost: {
      primary: "text-blue-600 hover:bg-blue-50",
      secondary: "text-gray-700 hover:bg-gray-100",
      success: "text-green-600 hover:bg-green-50",
      warning: "text-yellow-600 hover:bg-yellow-50",
      error: "text-red-600 hover:bg-red-50",
      info: "text-cyan-600 hover:bg-cyan-50"
    }
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant][color]} ${sizes[size]} ${colors[color]} ${loading || disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {icon && !loading && iconPosition === 'left' && <span className="mr-2">{icon}</span>}
      {loading && <span className="mr-2 animate-spin">⟳</span>}
      {children}
      {icon && !loading && iconPosition === 'right' && <span className="ml-2">{icon}</span>}
    </button>
  );
};

// ==============================
// AVATAR COMPONENT
// ==============================
interface AvatarProps {
  src?: string;
  alt?: string;
  size?: Size;
  fallback?: string;
  status?: 'online' | 'offline' | 'away' | 'busy';
  className?: string;
}

const Avatar = ({ src, alt, size = 'md', fallback, status, className = '' }: AvatarProps) => {
  const sizes = {
    xs: "h-6 w-6 text-xs",
    sm: "h-8 w-8 text-sm",
    md: "h-10 w-10 text-base",
    lg: "h-12 w-12 text-lg",
    xl: "h-16 w-16 text-xl"
  };

  const statusColors = {
    online: "bg-green-500",
    offline: "bg-gray-400",
    away: "bg-yellow-500",
    busy: "bg-red-500"
  };

  return (
    <div className={`relative inline-flex ${className}`}>
      <div className={`relative inline-flex items-center justify-center rounded-full bg-gray-200 ${sizes[size]}`}>
        {src ? (
          <img src={src} alt={alt} className="h-full w-full rounded-full object-cover" />
        ) : (
          <span className="font-medium text-gray-600">
            {fallback?.charAt(0).toUpperCase()}
          </span>
        )}
      </div>
      {status && (
        <span className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${statusColors[status]}`} />
      )}
    </div>
  );
};

// ==============================
// SIDEBAR COMPONENT
// ==============================
interface SidebarItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string | number;
  active?: boolean;
  onClick?: () => void;
  children?: SidebarItem[];
  category?: string;
}

interface SidebarProps {
  items: SidebarItem[];
  collapsed?: boolean;
  onToggle?: () => void;
  className?: string;
}

const Sidebar = ({ items, collapsed = false, onToggle, className = '' }: SidebarProps) => {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleExpanded = (id: string) => {
    setExpandedItems(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const filteredItems = items.filter(item => 
    item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderSidebarItem = (item: SidebarItem, level = 0) => (
    <div key={item.id}>
      <button
        onClick={() => {
          if (item.children) {
            toggleExpanded(item.id);
          } else {
            item.onClick?.();
          }
        }}
        className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
          item.active
            ? 'bg-blue-50 text-blue-700'
            : 'text-gray-700 hover:bg-gray-100'
        }`}
        style={{ paddingLeft: `${level * 12 + 12}px` }}
      >
        {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
        {!collapsed && (
          <>
            <span className="flex-1 text-left">{item.label}</span>
            {item.badge && (
              <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                {item.badge}
              </span>
            )}
            {item.children && (
              <span
                className={`h-4 w-4 transform transition-transform ${
                  expandedItems.includes(item.id) ? 'rotate-180' : ''
                }`}
              >
                ▼
              </span>
            )}
          </>
        )}
      </button>
      {!collapsed && item.children && expandedItems.includes(item.id) && (
        <div className="mt-1">
          {item.children.map(child => renderSidebarItem(child, level + 1))}
        </div>
      )}
    </div>
  );

  const categories = [...new Set(items.map(item => item.category).filter(Boolean))];

  return (
    <div className={`flex flex-col bg-white border-r border-gray-200 ${collapsed ? 'w-16' : 'w-64'} ${className}`}>
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!collapsed && <h2 className="text-lg font-semibold">Components</h2>}
        <button onClick={onToggle} className="p-1 rounded hover:bg-gray-100">
          {collapsed ? <span>→</span> : <span>←</span>}
        </button>
      </div>
      
      {!collapsed && (
        <div className="p-3 border-b border-gray-200">
          <div className="relative">
            <input
              type="text"
              placeholder="Search components..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <span className="absolute left-2 top-2.5 text-gray-400">
              🔍
            </span>
          </div>
        </div>
      )}
      
      <nav className="flex-1 p-2 overflow-y-auto">
        {searchQuery && (
          <div className="mb-2 px-3 py-1 text-xs text-gray-500">
            {filteredItems.length} results for "{searchQuery}"
          </div>
        )}
        
        {categories.map(category => (
          <div key={category} className="mb-4">
            <div className="px-3 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              {category}
            </div>
            {filteredItems
              .filter(item => item.category === category)
              .map(item => renderSidebarItem(item))}
          </div>
        ))}
        
        {filteredItems.length === 0 && (
          <div className="px-3 py-2 text-sm text-gray-500 text-center">
            No components found
          </div>
        )}
      </nav>
    </div>
  );
};

// ==============================
// MODAL COMPONENT
// ==============================
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
}

const Modal = ({ isOpen, onClose, title, children, size = 'md', className = '' }: ModalProps) => {
  const sizes = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    full: "max-w-7xl"
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} />
        <div className={`relative w-full ${sizes[size]} transform rounded-xl bg-white p-6 transition-all shadow-xl ${className}`}>
          {title && (
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                <span className="text-lg">×</span>
              </button>
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  );
};

// ==============================
// DRAWER COMPONENT
// ==============================
interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  position?: 'left' | 'right' | 'top' | 'bottom';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const Drawer = ({ isOpen, onClose, title, children, position = 'right', size = 'md', className = '' }: DrawerProps) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const sizes = {
    sm: position === 'left' || position === 'right' ? "w-64" : "h-64",
    md: position === 'left' || position === 'right' ? "w-80" : "h-80",
    lg: position === 'left' || position === 'right' ? "w-96" : "h-96",
    xl: position === 'left' || position === 'right' ? "w-full max-w-md" : "h-full max-h-md"
  };

  const positions = {
    left: "left-0 top-0 h-full",
    right: "right-0 top-0 h-full",
    top: "top-0 left-0 w-full",
    bottom: "bottom-0 left-0 w-full"
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen">
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} />
        <div className={`relative ${sizes[size]} ${positions[position]} bg-white shadow-xl transform transition-all ${className}`}>
          {title && (
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                <span className="text-lg">×</span>
              </button>
            </div>
          )}
          <div className="p-4 overflow-y-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

// ==============================
// HERO COMPONENT
// ==============================
interface HeroProps {
  title: string;
  subtitle?: string;
  description?: string;
  primaryAction?: React.ReactNode;
  secondaryAction?: React.ReactNode;
  backgroundImage?: string;
  className?: string;
}

const Hero = ({ title, subtitle, description, primaryAction, secondaryAction, backgroundImage, className = '' }: HeroProps) => {
  return (
    <div className={`relative ${className}`}>
      {backgroundImage && (
        <div className="absolute inset-0 z-0">
          <img src={backgroundImage} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        </div>
      )}
      <div className={`relative z-10 px-4 py-16 sm:px-6 sm:py-24 lg:py-32 ${backgroundImage ? 'text-white' : ''}`}>
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            {subtitle && <h2 className="text-base font-semibold tracking-wide uppercase">{subtitle}</h2>}
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              {title}
            </h1>
            {description && (
              <p className="mt-6 max-w-lg mx-auto text-xl">
                {description}
              </p>
            )}
            <div className="mt-10 flex justify-center gap-4">
              {primaryAction}
              {secondaryAction}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==============================
// HEADER COMPONENT
// ==============================
interface HeaderLink {
  label: string;
  href?: string;
  active?: boolean;
}

interface HeaderProps {
  logo?: React.ReactNode;
  links: HeaderLink[];
  actions?: React.ReactNode;
  className?: string;
}

const Header = ({ logo, links, actions, className = '' }: HeaderProps) => {
  return (
    <header className={`bg-white shadow-sm ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            {logo && <div className="flex-shrink-0">{logo}</div>}
            <nav className="hidden md:ml-6 md:flex md:space-x-8">
              {links.map((link, index) => (
                <a
                  key={index}
                  href={link.href || '#'}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    link.active
                      ? 'border-blue-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>
          <div className="flex items-center">
            {actions}
          </div>
        </div>
      </div>
    </header>
  );
};

// ==============================
// FOOTER COMPONENT
// ==============================
interface FooterLink {
  label: string;
  href?: string;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

interface FooterProps {
  sections: FooterSection[];
  copyright?: string;
  socialLinks?: React.ReactNode;
  className?: string;
}

const Footer = ({ sections, copyright, socialLinks, className = '' }: FooterProps) => {
  return (
    <footer className={`bg-gray-900 text-white ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {sections.map((section, index) => (
            <div key={index}>
              <h3 className="text-lg font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    {link.href ? (
                      <a href={link.href} className="text-gray-300 hover:text-white transition-colors">
                        {link.label}
                      </a>
                    ) : (
                      <span className="text-gray-300">{link.label}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          {copyright && <p className="text-gray-400 text-sm">{copyright}</p>}
          {socialLinks && <div className="mt-4 md:mt-0">{socialLinks}</div>}
        </div>
      </div>
    </footer>
  );
};

// ==============================
// SIDEBAR LAYOUT COMPONENT
// ==============================
interface SidebarLayoutProps {
  children: React.ReactNode;
  sidebarItems: SidebarItem[];
  sidebarCollapsed: boolean;
  onSidebarToggle: () => void;
  className?: string;
}

const SidebarLayout = ({ children, sidebarItems, sidebarCollapsed, onSidebarToggle, className = '' }: SidebarLayoutProps) => {
  return (
    <div className={`flex h-screen bg-gray-100 ${className}`}>
      <Sidebar 
        items={sidebarItems}
        collapsed={sidebarCollapsed}
        onToggle={onSidebarToggle}
      />
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
};

// ==============================
// DASHBOARD LAYOUT COMPONENT
// ==============================
interface DashboardLayoutProps {
  header?: React.ReactNode;
  sidebar?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

const DashboardLayout = ({ header, sidebar, children, className = '' }: DashboardLayoutProps) => {
  return (
    <div className={`flex h-screen bg-gray-100 ${className}`}>
      {sidebar}
      <div className="flex-1 flex flex-col overflow-hidden">
        {header}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

// ==============================
// APP LAYOUT COMPONENT
// ==============================
interface AppLayoutProps {
  header?: React.ReactNode;
  sidebar?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

const AppLayout = ({ header, sidebar, footer, children, className = '' }: AppLayoutProps) => {
  return (
    <div className={`min-h-screen flex flex-col ${className}`}>
      {header}
      <div className="flex flex-1">
        {sidebar}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
      {footer}
    </div>
  );
};

// ==============================
// CODE EXAMPLES
// ==============================
const ButtonComponentCode = `// TypeScript Interface
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'solid' | 'outline' | 'ghost';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
}

// Component Implementation
const Button = ({ 
  children, 
  variant = 'solid', 
  size = 'md', 
  loading = false,
  icon,
  iconPosition = 'left',
  color = 'primary',
  className = '',
  disabled,
  ...props 
}: ButtonProps) => {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const sizes = {
    xs: "px-2 py-1 text-xs",
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
    xl: "px-8 py-4 text-lg"
  };

  const variants = {
    solid: {
      primary: "bg-blue-600 text-white hover:bg-blue-700",
      secondary: "bg-gray-600 text-white hover:bg-gray-700",
      // ... other colors
    },
    outline: {
      primary: "border border-blue-600 text-blue-600 hover:bg-blue-50",
      // ... other colors
    },
    ghost: {
      primary: "text-blue-600 hover:bg-blue-50",
      // ... other colors
    }
  };

  return (
    <button
      className={\`\${baseStyles} \${variants[variant][color]} \${sizes[size]} \${loading ? 'opacity-50 cursor-not-allowed' : ''} \${className}\`}
      disabled={disabled || loading}
      {...props}
    >
      {icon && !loading && iconPosition === 'left' && <span className="mr-2">{icon}</span>}
      {loading && <span className="mr-2 animate-spin">⟳</span>}
      {children}
      {icon && !loading && iconPosition === 'right' && <span className="ml-2">{icon}</span>}
    </button>
  );
};

// Usage Examples
<Button variant="solid" color="primary">Primary Button</Button>
<Button variant="outline" color="success">Success Button</Button>
<Button variant="ghost" color="error">Error Button</Button>
<Button loading>Loading Button</Button>`;

const AvatarComponentCode = `// TypeScript Interface
interface AvatarProps {
  src?: string;
  alt?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  fallback?: string;
  status?: 'online' | 'offline' | 'away' | 'busy';
  className?: string;
}

// Component Implementation
const Avatar = ({ src, alt, size = 'md', fallback, status, className = '' }: AvatarProps) => {
  const sizes = {
    xs: "h-6 w-6 text-xs",
    sm: "h-8 w-8 text-sm",
    md: "h-10 w-10 text-base",
    lg: "h-12 w-12 text-lg",
    xl: "h-16 w-16 text-xl"
  };

  const statusColors = {
    online: "bg-green-500",
    offline: "bg-gray-400",
    away: "bg-yellow-500",
    busy: "bg-red-500"
  };

  return (
    <div className={\`relative inline-flex \${className}\`}>
      <div className={\`relative inline-flex items-center justify-center rounded-full bg-gray-300 \${sizes[size]}\`}>
        {src ? (
          <img src={src} alt={alt} className="h-full w-full rounded-full object-cover" />
        ) : (
          <span className="font-medium text-gray-600">
            {fallback?.charAt(0).toUpperCase()}
          </span>
        )}
      </div>
      {status && (
        <span className={\`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white \${statusColors[status]}\`} />
      )}
    </div>
  );
};

// Usage Examples
<Avatar src="/avatar.jpg" alt="User" size="md" status="online" />
<Avatar fallback="John Doe" size="lg" status="away" />
<Avatar fallback="A" size="sm" status="offline" />`;

const ModalComponentCode = `// TypeScript Interface
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
}

// Component Implementation
const Modal = ({ isOpen, onClose, title, children, size = 'md', className = '' }: ModalProps) => {
  const sizes = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    full: "max-w-7xl"
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} />
        <div className={\`relative w-full \${sizes[size]} transform rounded-xl bg-white p-6 transition-all shadow-xl \${className}\`}>
          {title && (
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                <span className="text-lg">×</span>
              </button>
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  );
};

// Usage Examples
const [isModalOpen, setIsModalOpen] = useState(false);

<Button onClick={() => setIsModalOpen(true)}>Open Modal</Button>
<Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Example Modal">
  <p className="text-gray-700 mb-4">This is an example modal. You can put any content here.</p>
  <div className="flex justify-end gap-2">
    <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
    <Button onClick={() => setIsModalOpen(false)}>Confirm</Button>
  </div>
</Modal>`;

const DrawerComponentCode = `// TypeScript Interface
interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  position?: 'left' | 'right' | 'top' | 'bottom';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

// Component Implementation
const Drawer = ({ isOpen, onClose, title, children, position = 'right', size = 'md', className = '' }: DrawerProps) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const sizes = {
    sm: position === 'left' || position === 'right' ? "w-64" : "h-64",
    md: position === 'left' || position === 'right' ? "w-80" : "h-80",
    lg: position === 'left' || position === 'right' ? "w-96" : "h-96",
    xl: position === 'left' || position === 'right' ? "w-full max-w-md" : "h-full max-h-md"
  };

  const positions = {
    left: "left-0 top-0 h-full",
    right: "right-0 top-0 h-full",
    top: "top-0 left-0 w-full",
    bottom: "bottom-0 left-0 w-full"
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen">
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} />
        <div className={\`relative \${sizes[size]} \${positions[position]} bg-white shadow-xl transform transition-all \${className}\`}>
          {title && (
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                <span className="text-lg">×</span>
              </button>
            </div>
          )}
          <div className="p-4 overflow-y-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

// Usage Examples
const [isDrawerOpen, setIsDrawerOpen] = useState(false);

<Button onClick={() => setIsDrawerOpen(true)}>Open Drawer</Button>
<Drawer 
  isOpen={isDrawerOpen} 
  onClose={() => setIsDrawerOpen(false)} 
  title="Drawer Title"
  position="right"
  size="md"
>
  <p className="text-gray-700 mb-4">This is the content of the drawer.</p>
  <div className="space-y-4">
    <Input placeholder="Input field" />
    <Select 
      options={[
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' }
      ]}
    />
    <Button onClick={() => setIsDrawerOpen(false)}>Close</Button>
  </div>
</Drawer>`;

const HeroComponentCode = `// TypeScript Interface
interface HeroProps {
  title: string;
  subtitle?: string;
  description?: string;
  primaryAction?: React.ReactNode;
  secondaryAction?: React.ReactNode;
  backgroundImage?: string;
  className?: string;
}

// Component Implementation
const Hero = ({ title, subtitle, description, primaryAction, secondaryAction, backgroundImage, className = '' }: HeroProps) => {
  return (
    <div className={\`relative \${className}\`}>
      {backgroundImage && (
        <div className="absolute inset-0 z-0">
          <img src={backgroundImage} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        </div>
      )}
      <div className={\`relative z-10 px-4 py-16 sm:px-6 sm:py-24 lg:py-32 \${backgroundImage ? 'text-white' : ''}\`}>
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            {subtitle && <h2 className="text-base font-semibold tracking-wide uppercase">{subtitle}</h2>}
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              {title}
            </h1>
            {description && (
              <p className="mt-6 max-w-lg mx-auto text-xl">
                {description}
              </p>
            )}
            <div className="mt-10 flex justify-center gap-4">
              {primaryAction}
              {secondaryAction}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Usage Examples
<Hero 
  title="Build Something Amazing" 
  subtitle="Introducing Our New Product"
  description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies tincidunt."
  primaryAction={<Button variant="solid" color="primary">Get Started</Button>}
  secondaryAction={<Button variant="outline" color="secondary">Learn More</Button>}
  backgroundImage="https://picsum.photos/seed/hero/1920/1080.jpg"
/>`;

const HeaderComponentCode = `// TypeScript Interface
interface HeaderLink {
  label: string;
  href?: string;
  active?: boolean;
}

interface HeaderProps {
  logo?: React.ReactNode;
  links: HeaderLink[];
  actions?: React.ReactNode;
  className?: string;
}

// Component Implementation
const Header = ({ logo, links, actions, className = '' }: HeaderProps) => {
  return (
    <header className={\`bg-white shadow-sm \${className}\`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            {logo && <div className="flex-shrink-0">{logo}</div>}
            <nav className="hidden md:ml-6 md:flex md:space-x-8">
              {links.map((link, index) => (
                <a
                  key={index}
                  href={link.href || '#'}
                  className={\`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium \${link.active
                    ? 'border-blue-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }\`}
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>
          <div className="flex items-center">
            {actions}
          </div>
        </div>
      </div>
    </header>
  );
};

// Usage Examples
<Header 
  logo={<div className="text-xl font-bold text-blue-600">YourLogo</div>}
  links={[
    { label: "Home", href: "#", active: true },
    { label: "Features", href: "#" },
    { label: "Pricing", href: "#" },
    { label: "About", href: "#" }
  ]}
  actions={
    <div className="flex space-x-4">
      <Button variant="ghost" size="sm">Sign In</Button>
      <Button variant="solid" color="primary" size="sm">Get Started</Button>
    </div>
  }
/>`;

const FooterComponentCode = `// TypeScript Interface
interface FooterLink {
  label: string;
  href?: string;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

interface FooterProps {
  sections: FooterSection[];
  copyright?: string;
  socialLinks?: React.ReactNode;
  className?: string;
}

// Component Implementation
const Footer = ({ sections, copyright, socialLinks, className = '' }: FooterProps) => {
  return (
    <footer className={\`bg-gray-900 text-white \${className}\`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {sections.map((section, index) => (
            <div key={index}>
              <h3 className="text-lg font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    {link.href ? (
                      <a href={link.href} className="text-gray-300 hover:text-white transition-colors">
                        {link.label}
                      </a>
                    ) : (
                      <span className="text-gray-300">{link.label}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          {copyright && <p className="text-gray-400 text-sm">{copyright}</p>}
          {socialLinks && <div className="mt-4 md:mt-0">{socialLinks}</div>}
        </div>
      </div>
    </footer>
  );
};

// Usage Examples
<Footer 
  sections={[
    {
      title: "Product",
      links: [
        { label: "Features", href: "#" },
        { label: "Pricing", href: "#" },
        { label: "Testimonials", href: "#" }
      ]
    },
    {
      title: "Company",
      links: [
        { label: "About", href: "#" },
        { label: "Team", href: "#" },
        { label: "Careers", href: "#" }
      ]
    },
    {
      title: "Resources",
      links: [
        { label: "Blog", href: "#" },
        { label: "Documentation", href: "#" },
        { label: "Support", href: "#" }
      ]
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy Policy", href: "#" },
        { label: "Terms of Service", href: "#" }
      ]
    }
  ]}
  copyright="© 2023 Your Company. All rights reserved."
  socialLinks={
    <div className="flex space-x-6">
      <a href="#" className="text-gray-400 hover:text-white">
        <span className="sr-only">Facebook</span>
        <span>📘</span>
      </a>
      <a href="#" className="text-gray-400 hover:text-white">
        <span className="sr-only">Twitter</span>
        <span>🐦</span>
      </a>
      <a href="#" className="text-gray-400 hover:text-white">
        <span className="sr-only">LinkedIn</span>
        <span>💼</span>
      </a>
    </div>
  }
/>`;

const SidebarLayoutCode = `// TypeScript Interface
interface SidebarItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string | number;
  active?: boolean;
  onClick?: () => void;
  children?: SidebarItem[];
  category?: string;
}

interface SidebarLayoutProps {
  children: React.ReactNode;
  sidebarItems: SidebarItem[];
  sidebarCollapsed: boolean;
  onSidebarToggle: () => void;
  className?: string;
}

// Component Implementation
const SidebarLayout = ({ children, sidebarItems, sidebarCollapsed, onSidebarToggle, className = '' }: SidebarLayoutProps) => {
  return (
    <div className={\`flex h-screen bg-gray-100 \${className}\`}>
      <Sidebar 
        items={sidebarItems}
        collapsed={sidebarCollapsed}
        onToggle={onSidebarToggle}
      />
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
};

// Usage Examples
const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
const sidebarItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: <span>📊</span>,
    active: true,
    onClick: () => setActiveComponent('dashboard'),
    category: 'main'
  },
  {
    id: 'users',
    label: 'Users',
    icon: <span>👥</span>,
    onClick: () => setActiveComponent('users'),
    category: 'main'
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: <span>⚙️</span>,
    onClick: () => setActiveComponent('settings'),
    category: 'main'
  }
];

<SidebarLayout 
  sidebarItems={sidebarItems}
  sidebarCollapsed={sidebarCollapsed}
  onSidebarToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
>
  <div className="p-6">
    <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
    <p>This is the main content area.</p>
  </div>
</SidebarLayout>`;

const DashboardLayoutCode = `// TypeScript Interface
interface DashboardLayoutProps {
  header?: React.ReactNode;
  sidebar?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

// Component Implementation
const DashboardLayout = ({ header, sidebar, children, className = '' }: DashboardLayoutProps) => {
  return (
    <div className={\`flex h-screen bg-gray-100 \${className}\`}>
      {sidebar}
      <div className="flex-1 flex flex-col overflow-hidden">
        {header}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

// Usage Examples
const sidebar = (
  <div className="w-64 bg-white shadow-md">
    <div className="p-4">
      <h2 className="text-lg font-semibold">Dashboard</h2>
    </div>
    <nav className="mt-4">
      <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Overview</a>
      <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Analytics</a>
      <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Reports</a>
    </nav>
  </div>
);

const header = (
  <header className="bg-white shadow-sm">
    <div className="px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-semibold">Dashboard</h1>
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm">Profile</Button>
        <Button variant="outline" size="sm">Logout</Button>
      </div>
    </div>
  </header>
);

<DashboardLayout 
  header={header}
  sidebar={sidebar}
>
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-medium mb-2">Total Revenue</h3>
      <p className="text-2xl font-bold">$45,231</p>
    </div>
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-medium mb-2">Active Users</h3>
      <p className="text-2xl font-bold">2,543</p>
    </div>
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-medium mb-2">Conversion Rate</h3>
      <p className="text-2xl font-bold">3.2%</p>
    </div>
  </div>
</DashboardLayout>`;

const AppLayoutCode = `// TypeScript Interface
interface AppLayoutProps {
  header?: React.ReactNode;
  sidebar?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

// Component Implementation
const AppLayout = ({ header, sidebar, footer, children, className = '' }: AppLayoutProps) => {
  return (
    <div className={\`min-h-screen flex flex-col \${className}\`}>
      {header}
      <div className="flex flex-1">
        {sidebar}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
      {footer}
    </div>
  );
};

// Usage Examples
const header = (
  <Header 
    logo={<div className="text-xl font-bold text-blue-600">YourApp</div>}
    links={[
      { label: "Home", href: "#", active: true },
      { label: "Features", href: "#" },
      { label: "Pricing", href: "#" },
      { label: "About", href: "#" }
    ]}
    actions={
      <div className="flex space-x-4">
        <Button variant="ghost" size="sm">Sign In</Button>
        <Button variant="solid" color="primary" size="sm">Get Started</Button>
      </div>
    }
  />
);

const sidebar = (
  <div className="w-64 bg-white shadow-md">
    <div className="p-4">
      <h2 className="text-lg font-semibold">Navigation</h2>
    </div>
    <nav className="mt-4">
      <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Dashboard</a>
      <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Profile</a>
      <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Settings</a>
    </nav>
  </div>
);

const footer = (
  <Footer 
    sections={[
      {
        title: "Product",
        links: [
          { label: "Features", href: "#" },
          { label: "Pricing", href: "#" }
        ]
      },
      {
        title: "Company",
        links: [
          { label: "About", href: "#" },
          { label: "Team", href: "#" }
        ]
      }
    ]}
    copyright="© 2023 Your Company. All rights reserved."
  />
);

<AppLayout 
  header={header}
  sidebar={sidebar}
  footer={footer}
>
  <div className="max-w-4xl mx-auto">
    <h1 className="text-3xl font-bold mb-6">Welcome to Your App</h1>
    <p className="text-lg text-gray-600 mb-8">
      This is the main content area of your application.
    </p>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-2">Feature 1</h3>
        <p className="text-gray-600">Description of feature 1.</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-2">Feature 2</h3>
        <p className="text-gray-600">Description of feature 2.</p>
      </div>
    </div>
  </div>
</AppLayout>`;

// ==============================
// APP COMPONENT
// ==============================
const App = () => {
  const [activeComponent, setActiveComponent] = useState('button');
  const [activeCategory, setActiveCategory] = useState('components');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const sidebarItems = [
    // Components
    {
      id: 'button',
      label: 'Button',
      icon: <span>🔘</span>,
      active: activeComponent === 'button',
      onClick: () => setActiveComponent('button'),
      category: 'components'
    },
    {
      id: 'avatar',
      label: 'Avatar',
      icon: <span>👤</span>,
      active: activeComponent === 'avatar',
      onClick: () => setActiveComponent('avatar'),
      category: 'components'
    },
    {
      id: 'modal',
      label: 'Modal',
      icon: <span>🪟</span>,
      active: activeComponent === 'modal',
      onClick: () => setActiveComponent('modal'),
      category: 'components'
    },
    {
      id: 'drawer',
      label: 'Drawer',
      icon: <span>🗂️</span>,
      active: activeComponent === 'drawer',
      onClick: () => setActiveComponent('drawer'),
      category: 'components'
    },
    // Blocks
    {
      id: 'hero',
      label: 'Hero',
      icon: <span>🦸</span>,
      active: activeComponent === 'hero',
      onClick: () => setActiveComponent('hero'),
      category: 'blocks'
    },
    {
      id: 'header',
      label: 'Header',
      icon: <span>📄</span>,
      active: activeComponent === 'header',
      onClick: () => setActiveComponent('header'),
      category: 'blocks'
    },
    {
      id: 'footer',
      label: 'Footer',
      icon: <span>🦶</span>,
      active: activeComponent === 'footer',
      onClick: () => setActiveComponent('footer'),
      category: 'blocks'
    },
    {
      id: 'sidebarlayout',
      label: 'Sidebar Layout',
      icon: <span>📐</span>,
      active: activeComponent === 'sidebarlayout',
      onClick: () => setActiveComponent('sidebarlayout'),
      category: 'blocks'
    },
    {
      id: 'dashboardlayout',
      label: 'Dashboard Layout',
      icon: <span>📊</span>,
      active: activeComponent === 'dashboardlayout',
      onClick: () => setActiveComponent('dashboardlayout'),
      category: 'blocks'
    },
    {
      id: 'applayout',
      label: 'App Layout',
      icon: <span>📱</span>,
      active: activeComponent === 'applayout',
      onClick: () => setActiveComponent('applayout'),
      category: 'blocks'
    }
  ];

  const filteredSidebarItems = sidebarItems.filter(item => item.category === activeCategory);

  const renderComponent = () => {
    switch (activeComponent) {
      case 'button':
        return (
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Button Component</h2>
            <div className="flex gap-4 flex-wrap mb-6">
              <Button variant="solid" color="primary">Primary</Button>
              <Button variant="outline" color="success">Success</Button>
              <Button variant="ghost" color="error">Error</Button>
              <Button loading>Loading</Button>
              <Button disabled>Disabled</Button>
            </div>
            <h3 className="text-lg font-medium mb-3">Component Code:</h3>
            <CodeBlock code={ButtonComponentCode} />
          </div>
        );
      
      case 'avatar':
        return (
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Avatar Component</h2>
            <div className="flex gap-4 items-center mb-6">
              <Avatar size="xs" fallback="A" status="online" />
              <Avatar size="sm" fallback="JD" status="away" />
              <Avatar size="md" fallback="John" status="busy" />
              <Avatar size="lg" fallback="Jane" status="offline" />
              <Avatar size="xl" fallback="User" />
            </div>
            <h3 className="text-lg font-medium mb-3">Component Code:</h3>
            <CodeBlock code={AvatarComponentCode} />
          </div>
        );
      
      case 'modal':
        return (
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Modal Component</h2>
            <div className="mb-6">
              <Button onClick={() => setIsModalOpen(true)}>Open Modal</Button>
            </div>
            <h3 className="text-lg font-medium mb-3">Component Code:</h3>
            <CodeBlock code={ModalComponentCode} />
          </div>
        );
      
      case 'drawer':
        return (
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Drawer Component</h2>
            <div className="mb-6">
              <Button onClick={() => setIsDrawerOpen(true)}>Open Drawer</Button>
            </div>
            <h3 className="text-lg font-medium mb-3">Component Code:</h3>
            <CodeBlock code={DrawerComponentCode} />
          </div>
        );
      
      case 'hero':
        return (
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Hero Component</h2>
            <div className="mb-6">
              <Hero 
                title="Build Something Amazing" 
                subtitle="Introducing Our New Product"
                description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies tincidunt."
                primaryAction={<Button variant="solid" color="primary">Get Started</Button>}
                secondaryAction={<Button variant="outline" color="secondary">Learn More</Button>}
                backgroundImage="https://picsum.photos/seed/hero/1920/1080.jpg"
              />
            </div>
            <h3 className="text-lg font-medium mb-3">Component Code:</h3>
            <CodeBlock code={HeroComponentCode} />
          </div>
        );
      
      case 'header':
        return (
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Header Component</h2>
            <div className="mb-6">
              <Header 
                logo={<div className="text-xl font-bold text-blue-600">YourLogo</div>}
                links={[
                  { label: "Home", href: "#", active: true },
                  { label: "Features", href: "#" },
                  { label: "Pricing", href: "#" },
                  { label: "About", href: "#" }
                ]}
                actions={
                  <div className="flex space-x-4">
                    <Button variant="ghost" size="sm">Sign In</Button>
                    <Button variant="solid" color="primary" size="sm">Get Started</Button>
                  </div>
                }
              />
            </div>
            <h3 className="text-lg font-medium mb-3">Component Code:</h3>
            <CodeBlock code={HeaderComponentCode} />
          </div>
        );
      
      case 'footer':
        return (
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Footer Component</h2>
            <div className="mb-6">
              <Footer 
                sections={[
                  {
                    title: "Product",
                    links: [
                      { label: "Features", href: "#" },
                      { label: "Pricing", href: "#" },
                      { label: "Testimonials", href: "#" }
                    ]
                  },
                  {
                    title: "Company",
                    links: [
                      { label: "About", href: "#" },
                      { label: "Team", href: "#" },
                      { label: "Careers", href: "#" }
                    ]
                  },
                  {
                    title: "Resources",
                    links: [
                      { label: "Blog", href: "#" },
                      { label: "Documentation", href: "#" },
                      { label: "Support", href: "#" }
                    ]
                  },
                  {
                    title: "Legal",
                    links: [
                      { label: "Privacy Policy", href: "#" },
                      { label: "Terms of Service", href: "#" }
                    ]
                  }
                ]}
                copyright="© 2023 Your Company. All rights reserved."
                socialLinks={
                  <div className="flex space-x-6">
                    <a href="#" className="text-gray-400 hover:text-white">
                      <span className="sr-only">Facebook</span>
                      <span>📘</span>
                    </a>
                    <a href="#" className="text-gray-400 hover:text-white">
                      <span className="sr-only">Twitter</span>
                      <span>🐦</span>
                    </a>
                    <a href="#" className="text-gray-400 hover:text-white">
                      <span className="sr-only">LinkedIn</span>
                      <span>💼</span>
                    </a>
                  </div>
                }
              />
            </div>
            <h3 className="text-lg font-medium mb-3">Component Code:</h3>
            <CodeBlock code={FooterComponentCode} />
          </div>
        );
      
      case 'sidebarlayout':
        return (
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Sidebar Layout Component</h2>
            <div className="mb-6">
              <SidebarLayout 
                sidebarItems={filteredSidebarItems}
                sidebarCollapsed={sidebarCollapsed}
                onSidebarToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
              >
                <div className="p-6">
                  <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
                  <p>This is the main content area.</p>
                </div>
              </SidebarLayout>
            </div>
            <h3 className="text-lg font-medium mb-3">Component Code:</h3>
            <CodeBlock code={SidebarLayoutCode} />
          </div>
        );
      
      case 'dashboardlayout':
        return (
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Dashboard Layout Component</h2>
            <div className="mb-6">
              <DashboardLayout 
                header={
                  <header className="bg-white shadow-sm">
                    <div className="px-6 py-4 flex justify-between items-center">
                      <h1 className="text-xl font-semibold">Dashboard</h1>
                      <div className="flex items-center space-x-4">
                        <Button variant="ghost" size="sm">Profile</Button>
                        <Button variant="outline" size="sm">Logout</Button>
                      </div>
                    </div>
                  </header>
                }
                sidebar={
                  <div className="w-64 bg-white shadow-md">
                    <div className="p-4">
                      <h2 className="text-lg font-semibold">Dashboard</h2>
                    </div>
                    <nav className="mt-4">
                      <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Overview</a>
                      <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Analytics</a>
                      <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Reports</a>
                    </nav>
                  </div>
                }
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-medium mb-2">Total Revenue</h3>
                    <p className="text-2xl font-bold">$45,231</p>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-medium mb-2">Active Users</h3>
                    <p className="text-2xl font-bold">2,543</p>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-medium mb-2">Conversion Rate</h3>
                    <p className="text-2xl font-bold">3.2%</p>
                  </div>
                </div>
              </DashboardLayout>
            </div>
            <h3 className="text-lg font-medium mb-3">Component Code:</h3>
            <CodeBlock code={DashboardLayoutCode} />
          </div>
        );
      
      case 'applayout':
        return (
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">App Layout Component</h2>
            <div className="mb-6">
              <AppLayout 
                header={
                  <Header 
                    logo={<div className="text-xl font-bold text-blue-600">YourApp</div>}
                    links={[
                      { label: "Home", href: "#", active: true },
                      { label: "Features", href: "#" },
                      { label: "Pricing", href: "#" },
                      { label: "About", href: "#" }
                    ]}
                    actions={
                      <div className="flex space-x-4">
                        <Button variant="ghost" size="sm">Sign In</Button>
                        <Button variant="solid" color="primary" size="sm">Get Started</Button>
                      </div>
                    }
                  />
                }
                sidebar={
                  <div className="w-64 bg-white shadow-md">
                    <div className="p-4">
                      <h2 className="text-lg font-semibold">Navigation</h2>
                    </div>
                    <nav className="mt-4">
                      <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Dashboard</a>
                      <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Profile</a>
                      <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Settings</a>
                    </nav>
                  </div>
                }
                footer={
                  <Footer 
                    sections={[
                      {
                        title: "Product",
                        links: [
                          { label: "Features", href: "#" },
                          { label: "Pricing", href: "#" }
                        ]
                      },
                      {
                        title: "Company",
                        links: [
                          { label: "About", href: "#" },
                          { label: "Team", href: "#" }
                        ]
                      }
                    ]}
                    copyright="© 2023 Your Company. All rights reserved."
                  />
                }
              >
                <div className="max-w-4xl mx-auto">
                  <h1 className="text-3xl font-bold mb-6">Welcome to Your App</h1>
                  <p className="text-lg text-gray-600 mb-8">
                    This is the main content area of your application.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow">
                      <h3 className="text-lg font-medium mb-2">Feature 1</h3>
                      <p className="text-gray-600">Description of feature 1.</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                      <h3 className="text-lg font-medium mb-2">Feature 2</h3>
                      <p className="text-gray-600">Description of feature 2.</p>
                    </div>
                  </div>
                </div>
              </AppLayout>
            </div>
            <h3 className="text-lg font-medium mb-3">Component Code:</h3>
            <CodeBlock code={AppLayoutCode} />
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar 
        items={filteredSidebarItems}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">SaaS Component Library</h1>
              <p className="text-gray-600">
                A comprehensive component library for SaaS applications with TypeScript and Tailwind CSS.
              </p>
            </div>
            
            {/* Navigation Bar to switch between Components and Blocks */}
            <div className="mb-8 bg-white rounded-lg shadow-sm p-1 flex">
              <button
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeCategory === 'components'
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-700 hover:text-gray-900'
                }`}
                onClick={() => setActiveCategory('components')}
              >
                Components
              </button>
              <button
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeCategory === 'blocks'
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-700 hover:text-gray-900'
                }`}
                onClick={() => setActiveCategory('blocks')}
              >
                Blocks
              </button>
            </div>
            
            {renderComponent()}
          </div>
        </div>
      </div>
      
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Example Modal">
        <p className="text-gray-700 mb-4">This is an example modal. You can put any content here.</p>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
          <Button onClick={() => setIsModalOpen(false)}>Confirm</Button>
        </div>
      </Modal>
      
      <Drawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        title="Drawer Title"
        position="right"
        size="md"
      >
        <p className="text-gray-700 mb-4">This is the content of the drawer.</p>
        <div className="space-y-4">
          <Button onClick={() => setIsDrawerOpen(false)}>Close</Button>
        </div>
      </Drawer>
    </div>
  );
};

export default App;