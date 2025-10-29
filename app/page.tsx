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
// BREADCRUMB COMPONENT
// ==============================
interface BreadcrumbItem {
  label: string;
  href?: string;
  active?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  separator?: string;
  className?: string;
}

const Breadcrumb = ({ items, separator = "/", className = '' }: BreadcrumbProps) => {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex items-center space-x-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && <span className="mx-2 text-gray-400">{separator}</span>}
            {item.href ? (
              <a
                href={item.href}
                className={`text-sm ${
                  item.active
                    ? "text-gray-900 font-medium"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {item.label}
              </a>
            ) : (
              <span
                className={`text-sm ${
                  item.active
                    ? "text-gray-900 font-medium"
                    : "text-gray-500"
                }`}
              >
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

// ==============================
// SKELETON COMPONENT
// ==============================
interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'rectangular' | 'circular';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

const Skeleton = ({ 
  className = '', 
  variant = 'text', 
  width, 
  height, 
  animation = 'pulse' 
}: SkeletonProps) => {
  const variants = {
    text: "rounded",
    rectangular: "rounded-md",
    circular: "rounded-full"
  };

  const animations = {
    pulse: "animate-pulse",
    wave: "animate-shimmer",
    none: ""
  };

  return (
    <div
      className={`bg-gray-200 ${variants[variant]} ${animations[animation]} ${className}`}
      style={{ width, height }}
    />
  );
};

// ==============================
// EMPTY STATE COMPONENT
// ==============================
interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

const EmptyState = ({ icon, title, description, action, className = '' }: EmptyStateProps) => {
  return (
    <div className={`text-center py-12 ${className}`}>
      {icon && <div className="mx-auto h-12 w-12 text-gray-400 mb-4">{icon}</div>}
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      {description && <p className="text-gray-500 mb-6">{description}</p>}
      {action}
    </div>
  );
};

// ==============================
// ACCORDION COMPONENT
// ==============================
interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
  disabled?: boolean;
}

interface AccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
  defaultOpen?: string[];
  className?: string;
}

const Accordion = ({ items, allowMultiple = false, defaultOpen = [], className = '' }: AccordionProps) => {
  const [openItems, setOpenItems] = useState<string[]>(defaultOpen);

  const toggleItem = (id: string) => {
    if (allowMultiple) {
      setOpenItems(prev =>
        prev.includes(id)
          ? prev.filter(item => item !== id)
          : [...prev, id]
      );
    } else {
      setOpenItems(prev =>
        prev.includes(id) ? [] : [id]
      );
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {items.map((item) => (
        <div key={item.id} className="border border-gray-200 rounded-lg">
          <button
            onClick={() => !item.disabled && toggleItem(item.id)}
            disabled={item.disabled}
            className={`w-full px-4 py-3 text-left flex items-center justify-between ${
              item.disabled ? 'text-gray-400 cursor-not-allowed' : 'text-gray-900 hover:bg-gray-50'
            }`}
          >
            <span className="font-medium">{item.title}</span>
            <span
              className={`h-5 w-5 transform transition-transform ${
                openItems.includes(item.id) ? 'rotate-180' : ''
              }`}
            >
              ▼
            </span>
          </button>
          {openItems.includes(item.id) && (
            <div className="px-4 py-3 border-t border-gray-200">
              {item.content}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// ==============================
// SELECT COMPONENT
// ==============================
interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: SelectOption[];
  helperText?: string;
}

const Select = ({ label, error, options, helperText, className = '', ...props }: SelectProps) => {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium mb-2 text-gray-700">{label}</label>}
      <select
        className={`
          w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors
          ${error ? 'border-red-500 focus:ring-red-500' : ''}
          ${className}
        `}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value} disabled={option.disabled}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <div className="mt-1 text-sm text-red-600">{error}</div>}
      {helperText && !error && <div className="mt-1 text-sm text-gray-500">{helperText}</div>}
    </div>
  );
};

// ==============================
// TEXTAREA COMPONENT
// ==============================
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  resize?: 'none' | 'both' | 'horizontal' | 'vertical';
}

const Textarea = ({ label, error, helperText, resize = 'vertical', className = '', ...props }: TextareaProps) => {
  const resizeClasses = {
    none: 'resize-none',
    both: 'resize',
    horizontal: 'resize-x',
    vertical: 'resize-y'
  };

  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium mb-2 text-gray-700">{label}</label>}
      <textarea
        className={`
          w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors
          ${error ? 'border-red-500 focus:ring-red-500' : ''}
          ${resizeClasses[resize]}
          ${className}
        `}
        {...props}
      />
      {error && <div className="mt-1 text-sm text-red-600">{error}</div>}
      {helperText && !error && <div className="mt-1 text-sm text-gray-500">{helperText}</div>}
    </div>
  );
};

// ==============================
// CHECKBOX COMPONENT
// ==============================
interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  indeterminate?: boolean;
}

const Checkbox = ({ label, error, helperText, indeterminate = false, className = '', ...props }: CheckboxProps) => {
  const checkboxRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  return (
    <div className={className}>
      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            ref={checkboxRef}
            type="checkbox"
            className={`
              h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500
              ${error ? 'border-red-500' : ''}
            `}
            {...props}
          />
        </div>
        {label && (
          <div className="ml-3 text-sm">
            <label htmlFor={props.id} className="font-medium text-gray-700">
              {label}
            </label>
            {helperText && <p className="text-gray-500">{helperText}</p>}
          </div>
        )}
      </div>
      {error && <div className="mt-1 text-sm text-red-600">{error}</div>}
    </div>
  );
};

// ==============================
// RADIO COMPONENT
// ==============================
interface RadioOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface RadioProps {
  name: string;
  options: RadioOption[];
  label?: string;
  error?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

const Radio = ({ name, options, label, error, value, onChange, className = '' }: RadioProps) => {
  return (
    <div className={className}>
      {label && <label className="block text-sm font-medium mb-2 text-gray-700">{label}</label>}
      <div className="space-y-2">
        {options.map((option) => (
          <div key={option.value} className="flex items-center">
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange?.(option.value)}
              disabled={option.disabled}
              className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <label className="ml-3 text-sm font-medium text-gray-700">
              {option.label}
            </label>
          </div>
        ))}
      </div>
      {error && <div className="mt-1 text-sm text-red-600">{error}</div>}
    </div>
  );
};

// ==============================
// SLIDER COMPONENT
// ==============================
interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  showLabel?: boolean;
  className?: string;
}

const Slider = ({ 
  value, 
  onChange, 
  min = 0, 
  max = 100, 
  step = 1, 
  disabled = false, 
  showLabel = false,
  className = '' 
}: SliderProps) => {
  return (
    <div className={className}>
      {showLabel && (
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Value</span>
          <span className="text-sm font-medium text-gray-700">{value}</span>
        </div>
      )}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        disabled={disabled}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
      />
    </div>
  );
};

// ==============================
// RATING COMPONENT
// ==============================
interface RatingProps {
  value: number;
  onChange?: (value: number) => void;
  max?: number;
  readonly?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Rating = ({ value, onChange, max = 5, readonly = false, size = 'md', className = '' }: RatingProps) => {
  const sizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg"
  };

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {Array.from({ length: max }, (_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => !readonly && onChange?.(i + 1)}
          disabled={readonly}
          className={`${sizes[size]} ${readonly ? 'cursor-default' : 'cursor-pointer'} transition-colors`}
        >
          <span className={`${sizes[size]} ${
            i < value ? 'text-yellow-400' : 'text-gray-300'
          }`}>
            ★
          </span>
        </button>
      ))}
    </div>
  );
};

// ==============================
// UPLOAD COMPONENT
// ==============================
interface UploadProps {
  accept?: string;
  multiple?: boolean;
  onFilesSelected: (files: File[]) => void;
  className?: string;
}

const Upload = ({ accept, multiple = false, onFilesSelected, className = '' }: UploadProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    onFilesSelected(files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      onFilesSelected(files);
    }
  };

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
        isDragOver
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-300 hover:border-gray-400'
      } ${className}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="mx-auto h-12 w-12 text-gray-400 mb-4 flex items-center justify-center">
        <span className="text-2xl">📁</span>
      </div>
      <p className="text-sm text-gray-600 mb-2">
        Drag and drop files here, or click to select files
      </p>
      <Button
        variant="outline"
        onClick={() => fileInputRef.current?.click()}
      >
        Select Files
      </Button>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
};

// ==============================
// DIVIDER COMPONENT
// ==============================
interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  label?: string;
  className?: string;
}

const Divider = ({ orientation = 'horizontal', label, className = '' }: DividerProps) => {
  if (orientation === 'vertical') {
    return <div className={`h-full w-px bg-gray-300 ${className}`} />;
  }

  if (label) {
    return (
      <div className={`relative ${className}`}>
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">{label}</span>
        </div>
      </div>
    );
  }

  return <div className={`w-full border-t border-gray-300 ${className}`} />;
};

// ==============================
// LIST COMPONENT
// ==============================
interface ListItem {
  id: string;
  title: string;
  description?: string;
  avatar?: React.ReactNode;
  actions?: React.ReactNode;
  onClick?: () => void;
}

interface ListProps {
  items: ListItem[];
  className?: string;
}

const List = ({ items, className = '' }: ListProps) => {
  return (
    <div className={`divide-y divide-gray-200 ${className}`}>
      {items.map((item) => (
        <div
          key={item.id}
          onClick={item.onClick}
          className={`p-4 flex items-center justify-between ${
            item.onClick ? 'cursor-pointer hover:bg-gray-50' : ''
          }`}
        >
          <div className="flex items-center gap-3">
            {item.avatar && <div className="flex-shrink-0">{item.avatar}</div>}
            <div>
              <p className="text-sm font-medium text-gray-900">{item.title}</p>
              {item.description && (
                <p className="text-sm text-gray-500">{item.description}</p>
              )}
            </div>
          </div>
          {item.actions && <div className="flex-shrink-0">{item.actions}</div>}
        </div>
      ))}
    </div>
  );
};

// ==============================
// TIMELINE COMPONENT
// ==============================
interface TimelineItem {
  id: string;
  title: string;
  description?: string;
  date?: string;
  status?: 'complete' | 'current' | 'upcoming';
  icon?: React.ReactNode;
}

interface TimelineProps {
  items: TimelineItem[];
  className?: string;
}

const Timeline = ({ items, className = '' }: TimelineProps) => {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-300"></div>
      {items.map((item, index) => (
        <div key={item.id} className="relative flex items-start gap-4 pb-8">
          <div
            className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 ${
              item.status === 'complete'
                ? 'border-green-500 bg-green-500'
                : item.status === 'current'
                ? 'border-blue-500 bg-white'
                : 'border-gray-300 bg-white'
            }`}
          >
            {item.status === 'complete' ? (
              <span className="text-white text-xs">✓</span>
            ) : (
              item.icon || (
                <span
                  className={`h-2 w-2 rounded-full ${
                    item.status === 'current' ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                />
              )
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900">{item.title}</p>
            {item.description && (
              <p className="text-sm text-gray-500">{item.description}</p>
            )}
            {item.date && (
              <p className="text-xs text-gray-400 mt-1">{item.date}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

// ==============================
// TAG COMPONENT
// ==============================
interface TagProps {
  children: React.ReactNode;
  color?: Color;
  removable?: boolean;
  onRemove?: () => void;
  className?: string;
}

const Tag = ({ children, color = 'primary', removable = false, onRemove, className = '' }: TagProps) => {
  const colors = {
    primary: "bg-blue-100 text-blue-800",
    secondary: "bg-gray-100 text-gray-800",
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    error: "bg-red-100 text-red-800",
    info: "bg-cyan-100 text-cyan-800"
  };

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${colors[color]} ${className}`}>
      {children}
      {removable && (
        <button
          onClick={onRemove}
          className="hover:bg-black hover:bg-opacity-10 rounded-full p-0.5"
        >
          <span className="text-xs">×</span>
        </button>
      )}
    </span>
  );
};

// ==============================
// NOTIFICATION COMPONENT
// ==============================
interface NotificationProps {
  title: string;
  message?: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  onClose?: () => void;
  duration?: number;
  className?: string;
}

const Notification = ({ title, message, type = 'info', onClose, duration = 5000, className = '' }: NotificationProps) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const types = {
    info: "bg-blue-50 border-blue-200 text-blue-800",
    success: "bg-green-50 border-green-200 text-green-800",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
    error: "bg-red-50 border-red-200 text-red-800"
  };

  const icons = {
    info: <span className="text-blue-500">ℹ️</span>,
    success: <span className="text-green-500">✓</span>,
    warning: <span className="text-yellow-500">⚠️</span>,
    error: <span className="text-red-500">✕</span>
  };

  return (
    <div className={`border rounded-lg p-4 ${types[type]} ${className}`}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">{icons[type]}</div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium">{title}</p>
          {message && <p className="text-sm mt-1">{message}</p>}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600"
          >
            <span className="text-sm">×</span>
          </button>
        )}
      </div>
    </div>
  );
};

// ==============================
// SPINNER COMPONENT
// ==============================
interface SpinnerProps {
  size?: Size;
  color?: Color;
  className?: string;
}

const Spinner = ({ size = 'md', color = 'primary', className = '' }: SpinnerProps) => {
  const sizes = {
    xs: "h-4 w-4",
    sm: "h-5 w-5",
    md: "h-6 w-6",
    lg: "h-8 w-8",
    xl: "h-12 w-12"
  };

  const colors = {
    primary: "text-blue-600",
    secondary: "text-gray-600",
    success: "text-green-600",
    warning: "text-yellow-500",
    error: "text-red-600",
    info: "text-cyan-600"
  };

  return (
    <div className={`animate-spin ${sizes[size]} ${colors[color]} ${className}`}>
      <span className="block h-full w-full rounded-full border-2 border-current border-t-transparent"></span>
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
// DROPDOWN COMPONENT
// ==============================
interface DropdownItem {
  label: string;
  value: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  danger?: boolean;
}

interface DropdownProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  position?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';
  className?: string;
}

const Dropdown = ({ trigger, items, position = 'bottom-left', className = '' }: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const positions = {
    'bottom-left': 'top-full left-0 mt-1',
    'bottom-right': 'top-full right-0 mt-1',
    'top-left': 'bottom-full left-0 mb-1',
    'top-right': 'bottom-full right-0 mb-1'
  };

  return (
    <div className={`relative inline-block ${className}`} ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)}>
        {trigger}
      </div>
      {isOpen && (
        <div className={`absolute z-50 w-48 rounded-md bg-white py-1 border border-gray-200 shadow-lg ${positions[position]}`}>
          {items.map((item) => (
            <button
              key={item.value}
              onClick={() => {
                item.onClick?.();
                setIsOpen(false);
              }}
              disabled={item.disabled}
              className={`w-full px-4 py-2 text-left text-sm flex items-center gap-2 ${
                item.disabled 
                  ? 'text-gray-400 cursor-not-allowed' 
                  : item.danger 
                    ? 'text-red-600 hover:bg-red-50' 
                    : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ==============================
// TABLE COMPONENT
// ==============================
interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: any) => React.ReactNode;
}

interface TableProps {
  columns: TableColumn[];
  data: any[];
  onSort?: (key: string, direction: 'asc' | 'desc') => void;
  sortKey?: string;
  sortDirection?: 'asc' | 'desc';
  className?: string;
}

const Table = ({ columns, data, onSort, sortKey, sortDirection, className = '' }: TableProps) => {
  const handleSort = (key: string) => {
    if (onSort) {
      const direction = sortKey === key && sortDirection === 'asc' ? 'desc' : 'asc';
      onSort(key, direction);
    }
  };

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {column.sortable ? (
                  <button
                    onClick={() => handleSort(column.key)}
                    className="flex items-center gap-1 hover:text-gray-700"
                  >
                    {column.label}
                    {sortKey === column.key && (
                      sortDirection === 'asc' ? <span>↑</span> : <span>↓</span>
                    )}
                  </button>
                ) : (
                  column.label
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, index) => (
            <tr key={index} className="hover:bg-gray-50">
              {columns.map((column) => (
                <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {column.render ? column.render(row[column.key], row) : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
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
// BADGE COMPONENT (FIXED)
// ==============================
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'solid' | 'outline' | 'soft';
  size?: 'sm' | 'md' | 'lg';
  color?: Color;
  className?: string;
}

const Badge = ({ 
  children, 
  variant = 'solid', 
  size = 'md', 
  color = 'primary',
  className = '' 
}: BadgeProps) => {
  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-0.5 text-sm",
    lg: "px-3 py-1 text-base"
  };

  const variants = {
    solid: {
      primary: "bg-blue-100 text-blue-800",
      secondary: "bg-gray-100 text-gray-800",
      success: "bg-green-100 text-green-800",
      warning: "bg-yellow-100 text-yellow-800",
      error: "bg-red-100 text-red-800",
      info: "bg-cyan-100 text-cyan-800"
    },
    outline: {
      primary: "border border-blue-600 text-blue-600",
      secondary: "border border-gray-600 text-gray-600",
      success: "border border-green-600 text-green-600",
      warning: "border border-yellow-600 text-yellow-600",
      error: "border border-red-600 text-red-600",
      info: "border border-cyan-600 text-cyan-600"
    },
    soft: {
      primary: "bg-blue-50 text-blue-700",
      secondary: "bg-gray-50 text-gray-700",
      success: "bg-green-50 text-green-700",
      warning: "bg-yellow-50 text-yellow-700",
      error: "bg-red-50 text-red-700",
      info: "bg-cyan-50 text-cyan-700"
    }
  };

  return (
    <span className={`inline-flex items-center rounded-full font-medium ${sizes[size]} ${variants[variant][color]} ${className}`}>
      {children}
    </span>
  );
};

// ==============================
// INPUT COMPONENT
// ==============================
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  helperText?: string;
}

const Input = ({ label, error, icon, helperText, className = '', ...props }: InputProps) => {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium mb-2 text-gray-700">{label}</label>}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
            {icon}
          </div>
        )}
        <input
          className={`
            w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors
            ${error ? 'border-red-500 focus:ring-red-500' : ''}
            ${icon ? 'pl-10' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && <div className="mt-1 text-sm text-red-600">{error}</div>}
      {helperText && !error && <div className="mt-1 text-sm text-gray-500">{helperText}</div>}
    </div>
  );
};

// ==============================
// CARD COMPONENT
// ==============================
interface CardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  hover?: boolean;
  padding?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Card = ({ children, title, subtitle, actions, hover = false, padding = 'md', className = '' }: CardProps) => {
  const paddings = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  return (
    <div className={`bg-white border border-gray-200 rounded-xl shadow-sm ${paddings[padding]} ${hover ? 'hover:shadow-md transition-shadow duration-200' : ''} ${className}`}>
      {(title || subtitle || actions) && (
        <div className="flex items-start justify-between mb-4">
          <div>
            {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
            {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
          </div>
          {actions && <div className="flex gap-2 ml-4">{actions}</div>}
        </div>
      )}
      <div className="text-gray-700">
        {children}
      </div>
    </div>
  );
};

// ==============================
// ALERT COMPONENT
// ==============================
interface AlertProps {
  children: React.ReactNode;
  variant?: 'info' | 'success' | 'warning' | 'error';
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
}

const Alert = ({ children, variant = 'info', dismissible = false, onDismiss, className = '' }: AlertProps) => {
  const variants = {
    info: "bg-blue-50 border-blue-200 text-blue-800",
    success: "bg-green-50 border-green-200 text-green-800",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
    error: "bg-red-50 border-red-200 text-red-800"
  };

  const icons = {
    info: <span className="text-blue-500">ℹ️</span>,
    success: <span className="text-green-500">✓</span>,
    warning: <span className="text-yellow-500">⚠️</span>,
    error: <span className="text-red-500">✕</span>
  };

  return (
    <div className={`border rounded-md p-4 ${variants[variant]} ${className}`}>
      <div className="flex">
        <div className="flex-shrink-0">
          {icons[variant]}
        </div>
        <div className="ml-3 flex-1">
          <div className="text-sm">{children}</div>
        </div>
        {dismissible && (
          <div className="ml-auto pl-3">
            <button
              onClick={onDismiss}
              className="inline-flex text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              <span className="text-sm">×</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// ==============================
// TABS COMPONENT
// ==============================
interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: TabItem[];
  defaultTab?: string;
  className?: string;
}

const Tabs = ({ tabs, defaultTab, className = '' }: TabsProps) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  return (
    <div className={className}>
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
      <div className="mt-4">
        {tabs.find((tab) => tab.id === activeTab)?.content}
      </div>
    </div>
  );
};

// ==============================
// PAGINATION COMPONENT
// ==============================
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

const Pagination = ({ currentPage, totalPages, onPageChange, className = '' }: PaginationProps) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  
  return (
    <div className={`flex items-center justify-between ${className}`}>
      <div className="text-sm text-gray-700">
        Showing page {currentPage} of {totalPages}
      </div>
      <div className="flex gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          Previous
        </button>
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-1 text-sm border rounded-md ${
              page === currentPage
                ? 'bg-blue-600 text-white border-blue-600'
                : 'border-gray-300 hover:bg-gray-50'
            }`}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

// ==============================
// TOOLTIP COMPONENT
// ==============================
interface TooltipProps {
  content: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  children: React.ReactNode;
  className?: string;
}

const Tooltip = ({ content, position = 'top', children, className = '' }: TooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);
  
  const positions = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2'
  };

  const arrowPositions = {
    top: 'top-full left-1/2 transform -translate-x-1/2 -mt-1',
    bottom: 'bottom-full left-1/2 transform -translate-x-1/2 -mb-1',
    left: 'left-full top-1/2 transform -translate-y-1/2 -ml-1',
    right: 'right-full top-1/2 transform -translate-y-1/2 -mr-1'
  };

  return (
    <div 
      className={`relative inline-block ${className}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div className={`absolute z-50 px-3 py-2 text-sm text-white bg-gray-900 rounded-md ${positions[position]}`}>
          {content}
          <div className={`absolute w-2 h-2 bg-gray-900 transform rotate-45 ${arrowPositions[position]}`}></div>
        </div>
      )}
    </div>
  );
};

// ==============================
// PROGRESS COMPONENT
// ==============================
interface ProgressProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  color?: Color;
  showLabel?: boolean;
  className?: string;
}

const Progress = ({ value, max = 100, size = 'md', color = 'primary', showLabel = false, className = '' }: ProgressProps) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  
  const sizes = {
    sm: "h-2",
    md: "h-4",
    lg: "h-6"
  };

  const colors = {
    primary: "bg-blue-600",
    secondary: "bg-gray-600",
    success: "bg-green-600",
    warning: "bg-yellow-500",
    error: "bg-red-600",
    info: "bg-cyan-600"
  };

  return (
    <div className={className}>
      {showLabel && (
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium text-gray-700">Progress</span>
          <span className="text-sm font-medium text-gray-700">{Math.round(percentage)}%</span>
        </div>
      )}
      <div className={`w-full bg-gray-200 rounded-full ${sizes[size]}`}>
        <div
          className={`${colors[color]} ${sizes[size]} rounded-full`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

// ==============================
// TOGGLE COMPONENT
// ==============================
interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Toggle = ({ checked, onChange, disabled = false, size = 'md', className = '' }: ToggleProps) => {
  const sizes = {
    sm: "h-5 w-9",
    md: "h-6 w-11",
    lg: "h-7 w-13"
  };

  const dotSizes = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6"
  };

  const dotPositions = {
    sm: checked ? "translate-x-4" : "translate-x-0.5",
    md: checked ? "translate-x-5" : "translate-x-0.5",
    lg: checked ? "translate-x-6" : "translate-x-0.5"
  };

  return (
    <button
      type="button"
      className={`${
        checked ? "bg-blue-600" : "bg-gray-200"
      } relative inline-flex flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${sizes[size]} ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      } ${className}`}
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
    >
      <span
        className={`${
          checked ? "bg-white" : "bg-white"
        } pointer-events-none inline-block h-5 w-5 transform rounded-full shadow ring-0 transition duration-200 ease-in-out ${dotSizes[size]} ${dotPositions[size]}`}
      />
    </button>
  );
};

// ==============================
// CHIP COMPONENT
// ==============================
interface ChipProps {
  label: string;
  onDelete?: () => void;
  avatar?: React.ReactNode;
  color?: Color;
  className?: string;
}

const Chip = ({ label, onDelete, avatar, color = 'primary', className = '' }: ChipProps) => {
  const colors = {
    primary: "bg-blue-100 text-blue-800",
    secondary: "bg-gray-100 text-gray-800",
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    error: "bg-red-100 text-red-800",
    info: "bg-cyan-100 text-cyan-800"
  };

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${colors[color]} ${className}`}>
      {avatar && <span className="flex-shrink-0">{avatar}</span>}
      <span>{label}</span>
      {onDelete && (
        <button
          onClick={onDelete}
          className="flex-shrink-0 ml-1 rounded-full hover:bg-black hover:bg-opacity-10 p-0.5"
        >
          <span className="text-xs">×</span>
        </button>
      )}
    </div>
  );
};

// ==============================
// STEPS COMPONENT
// ==============================
interface StepItem {
  id: string;
  label: string;
  description?: string;
  status?: 'complete' | 'current' | 'upcoming';
}

interface StepsProps {
  steps: StepItem[];
  className?: string;
}

const Steps = ({ steps, className = '' }: StepsProps) => {
  return (
    <nav aria-label="Progress" className={className}>
      <ol className="flex items-center">
        {steps.map((step, stepIdx) => (
          <li key={step.id} className={`${stepIdx !== steps.length - 1 ? 'flex-1' : ''}`}>
            <div className={`flex items-center ${stepIdx !== steps.length - 1 ? 'w-full' : ''}`}>
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                  step.status === 'complete'
                    ? 'border-blue-600 bg-blue-600'
                    : step.status === 'current'
                    ? 'border-blue-600 bg-white'
                    : 'border-gray-300 bg-white'
                }`}
              >
                {step.status === 'complete' ? (
                  <span className="text-white text-xs">✓</span>
                ) : step.status === 'current' ? (
                  <span className="text-blue-600">{stepIdx + 1}</span>
                ) : (
                  <span className="text-gray-500">{stepIdx + 1}</span>
                )}
              </div>
              <div className={`ml-4 min-w-0 flex-1 ${stepIdx !== steps.length - 1 ? 'pr-8' : ''}`}>
                <p
                  className={`text-sm font-medium ${
                    step.status === 'complete'
                      ? 'text-blue-600'
                      : step.status === 'current'
                      ? 'text-blue-600'
                      : 'text-gray-500'
                  }`}
                >
                  {step.label}
                </p>
                {step.description && (
                  <p className="text-sm text-gray-500">{step.description}</p>
                )}
              </div>
              {stepIdx !== steps.length - 1 && (
                <div
                  className={`absolute top-5 left-10 h-0.5 w-full ${
                    step.status === 'complete' ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                />
              )}
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
};

// ==============================
// NEW COMPONENTS
// ==============================

// ==============================
// CALENDAR COMPONENT
// ==============================
interface CalendarProps {
  selectedDate?: Date;
  onDateSelect?: (date: Date) => void;
  className?: string;
}

const Calendar = ({ selectedDate = new Date(), onDateSelect, className = '' }: CalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1));
  
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
  
  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };
  
  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };
  
  const handleDateClick = (day: number) => {
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    onDateSelect?.(newDate);
  };
  
  const renderDays = () => {
    const days = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    // Add day names
    dayNames.forEach(day => {
      days.push(
        <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
          {day}
        </div>
      );
    });
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-8"></div>);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected = 
        selectedDate.getDate() === day &&
        selectedDate.getMonth() === currentMonth.getMonth() &&
        selectedDate.getFullYear() === currentMonth.getFullYear();
      
      days.push(
        <button
          key={day}
          onClick={() => handleDateClick(day)}
          className={`h-8 rounded-full text-sm ${
            isSelected
              ? 'bg-blue-600 text-white'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          {day}
        </button>
      );
    }
    
    return days;
  };
  
  return (
    <div className={`bg-white rounded-lg shadow p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <button onClick={handlePrevMonth} className="p-1 rounded hover:bg-gray-100">
          <span>←</span>
        </button>
        <h3 className="text-lg font-medium">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h3>
        <button onClick={handleNextMonth} className="p-1 rounded hover:bg-gray-100">
          <span>→</span>
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {renderDays()}
      </div>
    </div>
  );
};

// ==============================
// DATE PICKER COMPONENT
// ==============================
interface DatePickerProps {
  value?: Date;
  onChange?: (date: Date) => void;
  label?: string;
  error?: string;
  helperText?: string;
  className?: string;
}

const DatePicker = ({ value = new Date(), onChange, label, error, helperText, className = '' }: DatePickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(value);
  
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    onChange?.(date);
    setIsOpen(false);
  };
  
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };
  
  return (
    <div className={`relative ${className}`}>
      {label && <label className="block text-sm font-medium mb-2 text-gray-700">{label}</label>}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-3 py-2 border rounded-lg text-left ${
          error ? 'border-red-500' : 'border-gray-300'
        } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
      >
        {formatDate(selectedDate)}
      </button>
      {error && <div className="mt-1 text-sm text-red-600">{error}</div>}
      {helperText && !error && <div className="mt-1 text-sm text-gray-500">{helperText}</div>}
      
      {isOpen && (
        <div className="absolute z-10 mt-1">
          <Calendar
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
          />
        </div>
      )}
    </div>
  );
};

// ==============================
// CAROUSEL COMPONENT
// ==============================
interface CarouselProps {
  children: React.ReactNode[];
  autoPlay?: boolean;
  interval?: number;
  showIndicators?: boolean;
  className?: string;
}

const Carousel = ({ 
  children, 
  autoPlay = false, 
  interval = 3000, 
  showIndicators = true,
  className = '' 
}: CarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  useEffect(() => {
    if (!autoPlay) return;
    
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % children.length);
    }, interval);
    
    return () => clearInterval(timer);
  }, [autoPlay, interval, children.length]);
  
  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };
  
  const goToPrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + children.length) % children.length);
  };
  
  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % children.length);
  };
  
  return (
    <div className={`relative ${className}`}>
      <div className="overflow-hidden">
        <div 
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {children.map((child, index) => (
            <div key={index} className="w-full flex-shrink-0">
              {child}
            </div>
          ))}
        </div>
      </div>
      
      <button
        onClick={goToPrev}
        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 rounded-full p-2 hover:bg-opacity-75"
      >
        <span>←</span>
      </button>
      
      <button
        onClick={goToNext}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 rounded-full p-2 hover:bg-opacity-75"
      >
        <span>→</span>
      </button>
      
      {showIndicators && (
        <div className="flex justify-center mt-4 space-x-2">
          {children.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full ${
                index === currentIndex ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// ==============================
// KPI CARD COMPONENT
// ==============================
interface KpiCardProps {
  title: string;
  value: string | number;
  change?: {
    value: string;
    type: 'increase' | 'decrease';
  };
  icon?: React.ReactNode;
  className?: string;
}

const KpiCard = ({ title, value, change, icon, className = '' }: KpiCardProps) => {
  return (
    <div className={`bg-white rounded-xl shadow-sm p-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-semibold text-gray-900 mt-1">{value}</p>
          {change && (
            <p className={`text-sm mt-2 ${
              change.type === 'increase' ? 'text-green-600' : 'text-red-600'
            }`}>
              {change.type === 'increase' ? '↑' : '↓'} {change.value}
            </p>
          )}
        </div>
        {icon && (
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
              {icon}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ==============================
// METER COMPONENT
// ==============================
interface MeterProps {
  value: number;
  max?: number;
  min?: number;
  low?: number;
  high?: number;
  optimum?: number;
  size?: 'sm' | 'md' | 'lg';
  color?: Color;
  showLabel?: boolean;
  className?: string;
}

const Meter = ({ 
  value, 
  max = 100, 
  min = 0, 
  low, 
  high, 
  optimum, 
  size = 'md', 
  color = 'primary', 
  showLabel = false, 
  className = '' 
}: MeterProps) => {
  const percentage = ((value - min) / (max - min)) * 100;
  
  const sizes = {
    sm: "h-2",
    md: "h-4",
    lg: "h-6"
  };

  const colors = {
    primary: "bg-blue-600",
    secondary: "bg-gray-600",
    success: "bg-green-600",
    warning: "bg-yellow-500",
    error: "bg-red-600",
    info: "bg-cyan-600"
  };

  return (
    <div className={className}>
      {showLabel && (
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium text-gray-700">Value</span>
          <span className="text-sm font-medium text-gray-700">{value}</span>
        </div>
      )}
      <div className={`w-full bg-gray-200 rounded-full ${sizes[size]}`}>
        <div
          className={`${colors[color]} ${sizes[size]} rounded-full`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

// ==============================
// STATISTIC COMPONENT
// ==============================
interface StatisticProps {
  title: string;
  value: string | number;
  prefix?: string;
  suffix?: string;
  precision?: number;
  className?: string;
}

const Statistic = ({ title, value, prefix, suffix, precision, className = '' }: StatisticProps) => {
  const formatValue = (val: string | number) => {
    if (typeof val === 'number' && precision !== undefined) {
      return val.toFixed(precision);
    }
    return val.toString();
  };

  return (
    <div className={`text-center ${className}`}>
      <div className="text-3xl font-bold text-gray-900">
        {prefix}{formatValue(value)}{suffix}
      </div>
      <div className="text-sm text-gray-500 mt-1">{title}</div>
    </div>
  );
};

// ==============================
// FORM COMPONENT
// ==============================
interface FormProps {
  children: React.ReactNode;
  onSubmit?: (e: React.FormEvent) => void;
  className?: string;
}

const Form = ({ children, onSubmit, className = '' }: FormProps) => {
  return (
    <form onSubmit={onSubmit} className={className}>
      {children}
    </form>
  );
};

// ==============================
// FORM FIELD COMPONENT
// ==============================
interface FormFieldProps {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

const FormField = ({ label, error, helperText, required, children, className = '' }: FormFieldProps) => {
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      {children}
      {error && <div className="mt-1 text-sm text-red-600">{error}</div>}
      {helperText && !error && <div className="mt-1 text-sm text-gray-500">{helperText}</div>}
    </div>
  );
};

// ==============================
// FORM GROUP COMPONENT
// ==============================
interface FormGroupProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

const FormGroup = ({ title, description, children, className = '' }: FormGroupProps) => {
  return (
    <div className={`mb-6 ${className}`}>
      {title && <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>}
      {description && <p className="text-sm text-gray-500 mb-4">{description}</p>}
      {children}
    </div>
  );
};

// ==============================
// ACTION SHEET COMPONENT
// ==============================
interface ActionSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const ActionSheet = ({ isOpen, onClose, title, children, className = '' }: ActionSheetProps) => {
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
      <div className="flex min-h-screen items-end justify-center">
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} />
        <div className={`relative w-full max-w-lg transform rounded-t-xl bg-white p-6 transition-all ${className}`}>
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
// POPUP COMPONENT
// ==============================
interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  position?: 'center' | 'top' | 'bottom';
  className?: string;
}

const Popup = ({ isOpen, onClose, title, children, position = 'center', className = '' }: PopupProps) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const positions = {
    center: "flex items-center justify-center",
    top: "flex items-start justify-center pt-10",
    bottom: "flex items-end justify-center pb-10"
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className={`min-h-screen ${positions[position]} p-4`}>
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} />
        <div className={`relative max-w-lg w-full transform rounded-xl bg-white p-6 transition-all shadow-xl ${className}`}>
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
// COLLAPSE COMPONENT
// ==============================
interface CollapseProps {
  isOpen: boolean;
  children: React.ReactNode;
  className?: string;
}

const Collapse = ({ isOpen, children, className = '' }: CollapseProps) => {
  const [height, setHeight] = useState<number | undefined>(isOpen ? undefined : 0);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      if (isOpen) {
        setHeight(contentRef.current.scrollHeight);
        setTimeout(() => setHeight(undefined), 300);
      } else {
        setHeight(contentRef.current.scrollHeight);
        setTimeout(() => setHeight(0), 10);
      }
    }
  }, [isOpen]);

  return (
    <div
      ref={contentRef}
      className={`overflow-hidden transition-all duration-300 ease-in-out ${className}`}
      style={{ height }}
    >
      {children}
    </div>
  );
};

// ==============================
// TREE COMPONENT
// ==============================
interface TreeNode {
  id: string;
  label: string;
  children?: TreeNode[];
  icon?: React.ReactNode;
  defaultExpanded?: boolean;
}

interface TreeProps {
  data: TreeNode[];
  onSelect?: (node: TreeNode) => void;
  className?: string;
}

const Tree = ({ data, onSelect, className = '' }: TreeProps) => {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(
    new Set(data.filter(node => node.defaultExpanded).map(node => node.id))
  );

  const toggleNode = (nodeId: string) => {
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  };

  const renderNode = (node: TreeNode, level = 0) => (
    <div key={node.id} className="select-none">
      <div
        className={`flex items-center py-1 px-2 hover:bg-gray-100 rounded cursor-pointer`}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={() => {
          if (node.children && node.children.length > 0) {
            toggleNode(node.id);
          }
          onSelect?.(node);
        }}
      >
        {node.children && node.children.length > 0 && (
          <span className="mr-1 text-gray-500">
            {expandedNodes.has(node.id) ? '▼' : '▶'}
          </span>
        )}
        {node.icon && <span className="mr-2">{node.icon}</span>}
        <span>{node.label}</span>
      </div>
      {node.children && expandedNodes.has(node.id) && (
        <div>
          {node.children.map(child => renderNode(child, level + 1))}
        </div>
      )}
    </div>
  );

  return (
    <div className={className}>
      {data.map(node => renderNode(node))}
    </div>
  );
};

// ==============================
// MASONRY COMPONENT
// ==============================
interface MasonryProps {
  columns?: number;
  gap?: number;
  children: React.ReactNode[];
  className?: string;
}

const Masonry = ({ columns = 3, gap = 16, children, className = '' }: MasonryProps) => {
  const columnElements = Array.from({ length: columns }, () => [] as React.ReactNode[]);
  
  children.forEach((child, index) => {
    columnElements[index % columns].push(child);
  });

  return (
    <div className={`flex ${className}`} style={{ gap: `${gap}px` }}>
      {columnElements.map((column, columnIndex) => (
        <div key={columnIndex} className="flex-1" style={{ display: 'flex', flexDirection: 'column', gap: `${gap}px` }}>
          {column.map((child, childIndex) => (
            <div key={childIndex}>{child}</div>
          ))}
        </div>
      ))}
    </div>
  );
};

// ==============================
// IMAGE COMPONENT
// ==============================
interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallback?: string;
  alt: string;
}

const Image = ({ src, fallback, alt, className = '', ...props }: ImageProps) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError && fallback) {
      setImgSrc(fallback);
      setHasError(true);
    }
  };

  return (
    <img
      src={imgSrc}
      alt={alt}
      onError={handleError}
      className={className}
      {...props}
    />
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
// AUTH CARD COMPONENT
// ==============================
interface AuthCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

const AuthCard = ({ title, subtitle, children, footer, className = '' }: AuthCardProps) => {
  return (
    <div className={`bg-white rounded-xl shadow-lg overflow-hidden max-w-md w-full mx-auto ${className}`}>
      <div className="px-6 py-8 sm:px-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          {subtitle && <p className="mt-2 text-sm text-gray-600">{subtitle}</p>}
        </div>
        <div className="mt-8">
          {children}
        </div>
      </div>
      {footer && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 sm:px-8">
          {footer}
        </div>
      )}
    </div>
  );
};

// ==============================
// TESTIMONIAL COMPONENT
// ==============================
interface TestimonialProps {
  content: string;
  author: string;
  role?: string;
  avatar?: string;
  className?: string;
}

const Testimonial = ({ content, author, role, avatar, className = '' }: TestimonialProps) => {
  return (
    <div className={`bg-white rounded-xl shadow-md p-6 ${className}`}>
      <div className="flex items-start space-x-4">
        {avatar && (
          <div className="flex-shrink-0">
            <img src={avatar} alt={author} className="h-12 w-12 rounded-full" />
          </div>
        )}
        <div>
          <div className="text-gray-900">
            <p className="text-lg font-medium">{content}</p>
          </div>
          <div className="mt-4 flex items-center">
            <div className="flex-shrink-0">
              {avatar ? (
                <img src={avatar} alt={author} className="h-8 w-8 rounded-full" />
              ) : (
                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-600">
                    {author.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">{author}</p>
              {role && <p className="text-sm text-gray-500">{role}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==============================
// PRICING CARD COMPONENT
// ==============================
interface PricingCardProps {
  title: string;
  price: string;
  period?: string;
  description?: string;
  features: string[];
  highlighted?: boolean;
  action?: React.ReactNode;
  className?: string;
}

const PricingCard = ({ title, price, period, description, features, highlighted = false, action, className = '' }: PricingCardProps) => {
  return (
    <div className={`bg-white rounded-xl shadow-md overflow-hidden ${highlighted ? 'ring-2 ring-blue-500 transform scale-105' : ''} ${className}`}>
      {highlighted && (
        <div className="bg-blue-500 text-white text-center py-1 text-sm font-medium">
          Most Popular
        </div>
      )}
      <div className="p-6">
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        <div className="mt-4 flex items-baseline">
          <span className="text-4xl font-extrabold text-gray-900">{price}</span>
          {period && <span className="text-gray-500 ml-1">{period}</span>}
        </div>
        {description && <p className="mt-2 text-sm text-gray-500">{description}</p>}
        <ul className="mt-6 space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex">
              <span className="text-green-500 mr-2">✓</span>
              <span className="text-gray-700">{feature}</span>
            </li>
          ))}
        </ul>
        <div className="mt-8">
          {action}
        </div>
      </div>
    </div>
  );
};

// ==============================
// FEATURE CARD COMPONENT
// ==============================
interface FeatureCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  className?: string;
}

const FeatureCard = ({ title, description, icon, className = '' }: FeatureCardProps) => {
  return (
    <div className={`bg-white rounded-xl shadow-md p-6 ${className}`}>
      <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg text-blue-600 mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
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
// NAVBAR COMPONENT
// ==============================
interface NavbarLink {
  label: string;
  href?: string;
  active?: boolean;
}

interface NavbarProps {
  brand?: React.ReactNode;
  links: NavbarLink[];
  actions?: React.ReactNode;
  className?: string;
}

const Navbar = ({ brand, links, actions, className = '' }: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className={`bg-blue-600 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            {brand && <div className="flex-shrink-0">{brand}</div>}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {links.map((link, index) => (
                  <a
                    key={index}
                    href={link.href || '#'}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      link.active
                        ? 'bg-blue-700 text-white'
                        : 'text-white hover:bg-blue-500'
                    }`}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            {actions}
          </div>
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-blue-200 hover:text-white hover:bg-blue-700 focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {!isMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {links.map((link, index) => (
              <a
                key={index}
                href={link.href || '#'}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  link.active
                    ? 'bg-blue-700 text-white'
                    : 'text-white hover:bg-blue-500'
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>
          <div className="pt-4 pb-3 border-t border-blue-700">
            {actions}
          </div>
        </div>
      )}
    </nav>
  );
};

// ==============================
// TEAM COMPONENT
// ==============================
interface TeamMember {
  name: string;
  role: string;
  avatar?: string;
  bio?: string;
  socialLinks?: React.ReactNode;
}

interface TeamProps {
  title?: string;
  description?: string;
  members: TeamMember[];
  className?: string;
}

const Team = ({ title, description, members, className = '' }: TeamProps) => {
  return (
    <div className={`bg-white py-12 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {title && (
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900">{title}</h2>
            {description && <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">{description}</p>}
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {members.map((member, index) => (
            <div key={index} className="text-center">
              <div className="mb-4">
                {member.avatar ? (
                  <img
                    className="mx-auto h-24 w-24 rounded-full"
                    src={member.avatar}
                    alt={member.name}
                  />
                ) : (
                  <div className="mx-auto h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-xl font-medium text-gray-600">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                )}
              </div>
              <h3 className="text-lg font-medium text-gray-900">{member.name}</h3>
              <p className="text-sm text-gray-500">{member.role}</p>
              {member.bio && <p className="mt-2 text-gray-600">{member.bio}</p>}
              {member.socialLinks && (
                <div className="mt-4 flex justify-center space-x-2">
                  {member.socialLinks}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ==============================
// CTA COMPONENT
// ==============================
interface CtaProps {
  title: string;
  description?: string;
  primaryAction?: React.ReactNode;
  secondaryAction?: React.ReactNode;
  backgroundImage?: string;
  className?: string;
}

const Cta = ({ title, description, primaryAction, secondaryAction, backgroundImage, className = '' }: CtaProps) => {
  return (
    <div className={`relative ${className}`}>
      {backgroundImage && (
        <div className="absolute inset-0 z-0">
          <img src={backgroundImage} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-blue-600 bg-opacity-90"></div>
        </div>
      )}
      <div className={`relative z-10 px-4 py-16 sm:px-6 sm:py-24 lg:py-32 ${backgroundImage ? '' : 'bg-blue-600'}`}>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold text-white">
            {title}
          </h2>
          {description && (
            <p className="mt-6 text-lg leading-8 text-blue-100">
              {description}
            </p>
          )}
          <div className="mt-10 flex items-center justify-center gap-x-6">
            {primaryAction}
            {secondaryAction}
          </div>
        </div>
      </div>
    </div>
  );
};

// ==============================
// FAQ COMPONENT
// ==============================
interface FaqItem {
  question: string;
  answer: string;
}

interface FaqProps {
  title?: string;
  description?: string;
  items: FaqItem[];
  className?: string;
}

const Faq = ({ title, description, items, className = '' }: FaqProps) => {
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggleItem = (index: string) => {
    setOpenItems(prev =>
      prev.includes(index)
        ? prev.filter(item => item !== index)
        : [...prev, index]
    );
  };

  return (
    <div className={`bg-white py-12 ${className}`}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {title && (
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900">{title}</h2>
            {description && <p className="mt-4 text-lg text-gray-500">{description}</p>}
          </div>
        )}
        
        <dl className="space-y-6">
          {items.map((item, index) => (
            <div key={index} className="border-b border-gray-200 pb-6">
              <dt className="text-lg">
                <button
                  className="text-left w-full flex justify-between items-start text-gray-400"
                  onClick={() => toggleItem(index.toString())}
                >
                  <span className="font-medium text-gray-900">{item.question}</span>
                  <span className="ml-6 h-7 flex items-center">
                    <span
                      className={`h-6 w-6 transform ${
                        openItems.includes(index.toString()) ? '-rotate-180' : 'rotate-0'
                      }`}
                    >
                      ▼
                    </span>
                  </span>
                </button>
              </dt>
              <dd className={`mt-2 pr-12 ${openItems.includes(index.toString()) ? 'block' : 'hidden'}`}>
                <p className="text-base text-gray-500">{item.answer}</p>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
};

// ==============================
// LAYOUT SIDEBAR COMPONENT
// ==============================
interface LayoutSidebarProps {
  children: React.ReactNode;
  className?: string;
}

const LayoutSidebar = ({ children, className = '' }: LayoutSidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const sidebarItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <span>📊</span>,
      active: true
    },
    {
      id: 'projects',
      label: 'Projects',
      icon: <span>📁</span>,
      badge: 5
    },
    {
      id: 'team',
      label: 'Team',
      icon: <span>👥</span>
    },
    {
      id: 'calendar',
      label: 'Calendar',
      icon: <span>📅</span>
    },
    {
      id: 'documents',
      label: 'Documents',
      icon: <span>📄</span>
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: <span>📈</span>
    }
  ];

  return (
    <div className={`flex h-screen bg-gray-100 ${className}`}>
      <div className={`${isCollapsed ? 'w-16' : 'w-64'} bg-white shadow-md transition-all duration-300`}>
        <div className="flex items-center justify-between p-4 border-b">
          {!isCollapsed && <h2 className="text-lg font-semibold text-gray-800">SaaS App</h2>}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 rounded hover:bg-gray-100"
          >
            {isCollapsed ? <span>→</span> : <span>←</span>}
          </button>
        </div>
        <nav className="mt-4">
          {sidebarItems.map((item) => (
            <a
              key={item.id}
              href="#"
              className={`flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 ${
                item.active ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' : ''
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              {!isCollapsed && (
                <>
                  <span className="ml-3">{item.label}</span>
                  {item.badge && (
                    <span className="ml-auto bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </a>
          ))}
        </nav>
      </div>
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
};

// ==============================
// SETTINGS SIDEBAR COMPONENT
// ==============================
interface SettingsSidebarProps {
  children: React.ReactNode;
  className?: string;
}

const SettingsSidebar = ({ children, className = '' }: SettingsSidebarProps) => {
  const [activeTab, setActiveTab] = useState('profile');
  
  const sidebarItems = [
    {
      id: 'profile',
      label: 'Profile',
      icon: <span>👤</span>
    },
    {
      id: 'account',
      label: 'Account',
      icon: <span>🔐</span>
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: <span>🔔</span>
    },
    {
      id: 'security',
      label: 'Security',
      icon: <span>🔒</span>
    },
    {
      id: 'billing',
      label: 'Billing',
      icon: <span>💳</span>
    },
    {
      id: 'integrations',
      label: 'Integrations',
      icon: <span>🔗</span>
    }
  ];

  return (
    <div className={`flex h-screen bg-gray-100 ${className}`}>
      <div className="w-64 bg-white shadow-md">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">Settings</h2>
        </div>
        <nav className="mt-4">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center px-4 py-2 text-left text-gray-700 hover:bg-gray-100 ${
                activeTab === item.id ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' : ''
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="ml-3">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            {sidebarItems.find(item => item.id === activeTab)?.label}
          </h1>
          {children}
        </div>
      </div>
    </div>
  );
};

// ==============================
// DASHBOARD SIDEBAR COMPONENT
// ==============================
interface DashboardSidebarProps {
  children: React.ReactNode;
  className?: string;
}

const DashboardSidebar = ({ children, className = '' }: DashboardSidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState('overview');
  
  const sidebarSections = [
    {
      title: 'Main',
      items: [
        {
          id: 'overview',
          label: 'Overview',
          icon: <span>📊</span>
        },
        {
          id: 'analytics',
          label: 'Analytics',
          icon: <span>📈</span>
        }
      ]
    },
    {
      title: 'Management',
      items: [
        {
          id: 'users',
          label: 'Users',
          icon: <span>👥</span>,
          badge: 12
        },
        {
          id: 'projects',
          label: 'Projects',
          icon: <span>📁</span>,
          badge: 5
        },
        {
          id: 'tasks',
          label: 'Tasks',
          icon: <span>✅</span>,
          badge: 3
        }
      ]
    },
    {
      title: 'Settings',
      items: [
        {
          id: 'profile',
          label: 'Profile',
          icon: <span>👤</span>
        },
        {
          id: 'settings',
          label: 'Settings',
          icon: <span>⚙️</span>
        }
      ]
    }
  ];

  return (
    <div className={`flex h-screen bg-gray-100 ${className}`}>
      <div className={`${isCollapsed ? 'w-16' : 'w-64'} bg-white shadow-md transition-all duration-300`}>
        <div className="flex items-center justify-between p-4 border-b">
          {!isCollapsed && <h2 className="text-lg font-semibold text-gray-800">Dashboard</h2>}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 rounded hover:bg-gray-100"
          >
            {isCollapsed ? <span>→</span> : <span>←</span>}
          </button>
        </div>
        <nav className="mt-4">
          {sidebarSections.map((section) => (
            <div key={section.title} className="mb-6">
              {!isCollapsed && (
                <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  {section.title}
                </h3>
              )}
              {section.items.map((item) => (
                <a
                  key={item.id}
                  href="#"
                  onClick={() => setActiveItem(item.id)}
                  className={`flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 ${
                    activeItem === item.id ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' : ''
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  {!isCollapsed && (
                    <>
                      <span className="ml-3">{item.label}</span>
                      {item.badge && (
                        <span className="ml-auto bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </a>
              ))}
            </div>
          ))}
        </nav>
      </div>
      <div className="flex-1 overflow-auto">
        {children}
      </div>
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

const FormComponentCode = `// TypeScript Interface
interface FormProps {
  children: React.ReactNode;
  onSubmit?: (e: React.FormEvent) => void;
  className?: string;
}

// Component Implementation
const Form = ({ children, onSubmit, className = '' }: FormProps) => {
  return (
    <form onSubmit={onSubmit} className={className}>
      {children}
    </form>
  );
};

// Usage Examples
<Form onSubmit={(e) => {
  e.preventDefault();
  // Handle form submission
}}>
  <FormField label="Name" required>
    <Input placeholder="Enter your name" />
  </FormField>
  <FormField label="Email" required>
    <Input type="email" placeholder="Enter your email" />
  </FormField>
  <Button type="submit">Submit</Button>
</Form>`;

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
  <p>This is the content of the drawer.</p>
</Drawer>`;

const TreeComponentCode = `// TypeScript Interface
interface TreeNode {
  id: string;
  label: string;
  children?: TreeNode[];
  icon?: React.ReactNode;
  defaultExpanded?: boolean;
}

interface TreeProps {
  data: TreeNode[];
  onSelect?: (node: TreeNode) => void;
  className?: string;
}

// Component Implementation
const Tree = ({ data, onSelect, className = '' }: TreeProps) => {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(
    new Set(data.filter(node => node.defaultExpanded).map(node => node.id))
  );

  const toggleNode = (nodeId: string) => {
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  };

  const renderNode = (node: TreeNode, level = 0) => (
    <div key={node.id} className="select-none">
      <div
        className={\`flex items-center py-1 px-2 hover:bg-gray-100 rounded cursor-pointer\`}
        style={{ paddingLeft: \`\${level * 16 + 8}px\` }}
        onClick={() => {
          if (node.children && node.children.length > 0) {
            toggleNode(node.id);
          }
          onSelect?.(node);
        }}
      >
        {node.children && node.children.length > 0 && (
          <span className="mr-1 text-gray-500">
            {expandedNodes.has(node.id) ? '▼' : '▶'}
          </span>
        )}
        {node.icon && <span className="mr-2">{node.icon}</span>}
        <span>{node.label}</span>
      </div>
      {node.children && expandedNodes.has(node.id) && (
        <div>
          {node.children.map(child => renderNode(child, level + 1))}
        </div>
      )}
    </div>
  );

  return (
    <div className={className}>
      {data.map(node => renderNode(node))}
    </div>
  );
};

// Usage Examples
const treeData = [
  {
    id: '1',
    label: 'Documents',
    icon: <span>📁</span>,
    defaultExpanded: true,
    children: [
      { id: '1-1', label: 'Report.pdf', icon: <span>📄</span> },
      { id: '1-2', label: 'Presentation.pptx', icon: <span>📄</span> }
    ]
  },
  {
    id: '2',
    label: 'Images',
    icon: <span>📁</span>,
    children: [
      { id: '2-1', label: 'Photo.jpg', icon: <span>🖼️</span> },
      { id: '2-2', label: 'Icon.png', icon: <span>🖼️</span> }
    ]
  }
];

<Tree 
  data={treeData} 
  onSelect={(node) => console.log('Selected:', node)} 
/>`;

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

const AuthCardComponentCode = `// TypeScript Interface
interface AuthCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

// Component Implementation
const AuthCard = ({ title, subtitle, children, footer, className = '' }: AuthCardProps) => {
  return (
    <div className={\`bg-white rounded-xl shadow-lg overflow-hidden max-w-md w-full mx-auto \${className}\`}>
      <div className="px-6 py-8 sm:px-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          {subtitle && <p className="mt-2 text-sm text-gray-600">{subtitle}</p>}
        </div>
        <div className="mt-8">
          {children}
        </div>
      </div>
      {footer && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 sm:px-8">
          {footer}
        </div>
      )}
    </div>
  );
};

// Usage Examples
<AuthCard 
  title="Sign In" 
  subtitle="Welcome back! Please sign in to continue.">
  <Form>
    <FormField label="Email" required>
      <Input type="email" placeholder="Enter your email" />
    </FormField>
    <FormField label="Password" required>
      <Input type="password" placeholder="Enter your password" />
    </FormField>
    <div className="flex items-center justify-between">
      <Checkbox id="remember" label="Remember me" />
      <a href="#" className="text-sm text-blue-600 hover:text-blue-500">Forgot password?</a>
    </div>
    <Button type="submit" className="w-full mt-6">Sign In</Button>
  </Form>
  <div className="mt-6 text-center">
    <p className="text-sm text-gray-600">
      Don't have an account? <a href="#" className="font-medium text-blue-600 hover:text-blue-500">Sign up</a>
    </p>
  </div>
</AuthCard>`;

const TestimonialComponentCode = `// TypeScript Interface
interface TestimonialProps {
  content: string;
  author: string;
  role?: string;
  avatar?: string;
  className?: string;
}

// Component Implementation
const Testimonial = ({ content, author, role, avatar, className = '' }: TestimonialProps) => {
  return (
    <div className={\`bg-white rounded-xl shadow-md p-6 \${className}\`}>
      <div className="flex items-start space-x-4">
        {avatar && (
          <div className="flex-shrink-0">
            <img src={avatar} alt={author} className="h-12 w-12 rounded-full" />
          </div>
        )}
        <div>
          <div className="text-gray-900">
            <p className="text-lg font-medium">{content}</p>
          </div>
          <div className="mt-4 flex items-center">
            <div className="flex-shrink-0">
              {avatar ? (
                <img src={avatar} alt={author} className="h-8 w-8 rounded-full" />
              ) : (
                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-600">
                    {author.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">{author}</p>
              {role && <p className="text-sm text-gray-500">{role}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Usage Examples
<Testimonial 
  content="This is the best product I've ever used. It has saved me so much time and effort."
  author="John Doe"
  role="CEO at Company"
  avatar="https://picsum.photos/seed/john/100/100.jpg"
/>`;

const PricingCardComponentCode = `// TypeScript Interface
interface PricingCardProps {
  title: string;
  price: string;
  period?: string;
  description?: string;
  features: string[];
  highlighted?: boolean;
  action?: React.ReactNode;
  className?: string;
}

// Component Implementation
const PricingCard = ({ title, price, period, description, features, highlighted = false, action, className = '' }: PricingCardProps) => {
  return (
    <div className={\`bg-white rounded-xl shadow-md overflow-hidden \${highlighted ? 'ring-2 ring-blue-500 transform scale-105' : ''} \${className}\`}>
      {highlighted && (
        <div className="bg-blue-500 text-white text-center py-1 text-sm font-medium">
          Most Popular
        </div>
      )}
      <div className="p-6">
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        <div className="mt-4 flex items-baseline">
          <span className="text-4xl font-extrabold text-gray-900">{price}</span>
          {period && <span className="text-gray-500 ml-1">{period}</span>}
        </div>
        {description && <p className="mt-2 text-sm text-gray-500">{description}</p>}
        <ul className="mt-6 space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex">
              <span className="text-green-500 mr-2">✓</span>
              <span className="text-gray-700">{feature}</span>
            </li>
          ))}
        </ul>
        <div className="mt-8">
          {action}
        </div>
      </div>
    </div>
  );
};

// Usage Examples
<PricingCard 
  title="Pro Plan"
  price="$29"
  period="/month"
  description="Perfect for small businesses"
  features={[
    "10 Projects",
    "5 Team Members",
    "Advanced Analytics",
    "Priority Support"
  ]}
  highlighted={true}
  action={<Button variant="solid" color="primary" className="w-full">Get Started</Button>}
/>`;

const FeatureCardComponentCode = `// TypeScript Interface
interface FeatureCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  className?: string;
}

// Component Implementation
const FeatureCard = ({ title, description, icon, className = '' }: FeatureCardProps) => {
  return (
    <div className={\`bg-white rounded-xl shadow-md p-6 \${className}\`}>
      <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg text-blue-600 mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

// Usage Examples
<FeatureCard 
  title="Easy to Use"
  description="Our intuitive interface makes it easy for anyone to get started in minutes."
  icon={<span>🎯</span>
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

const NavbarComponentCode = `// TypeScript Interface
interface NavbarLink {
  label: string;
  href?: string;
  active?: boolean;
}

interface NavbarProps {
  brand?: React.ReactNode;
  links: NavbarLink[];
  actions?: React.ReactNode;
  className?: string;
}

// Component Implementation
const Navbar = ({ brand, links, actions, className = '' }: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className={\`bg-blue-600 \${className}\`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            {brand && <div className="flex-shrink-0">{brand}</div>}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {links.map((link, index) => (
                  <a
                    key={index}
                    href={link.href || '#'}
                    className={\`px-3 py-2 rounded-md text-sm font-medium \${link.active
                      ? 'bg-blue-700 text-white'
                      : 'text-white hover:bg-blue-500'
                    }\`}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            {actions}
          </div>
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-blue-200 hover:text-white hover:bg-blue-700 focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {!isMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {links.map((link, index) => (
              <a
                key={index}
                href={link.href || '#'}
                className={\`block px-3 py-2 rounded-md text-base font-medium \${link.active
                  ? 'bg-blue-700 text-white'
                  : 'text-white hover:bg-blue-500'
                }\`}
              >
                {link.label}
              </a>
            ))}
          </div>
          <div className="pt-4 pb-3 border-t border-blue-700">
            {actions}
          </div>
        </div>
      )}
    </nav>
  );
};

// Usage Examples
<Navbar 
  brand={<div className="text-xl font-bold text-white">YourBrand</div>}
  links={[
    { label: "Dashboard", href: "#", active: true },
    { label: "Team", href: "#" },
    { label: "Projects", href: "#" },
    { label: "Reports", href: "#" }
  ]}
  actions={
    <div className="flex space-x-4">
      <Button variant="ghost" size="sm" className="text-white hover:bg-blue-700">Profile</Button>
      <Button variant="outline" size="sm" className="border-white text-white hover:bg-white hover:text-blue-600">Sign Out</Button>
    </div>
  }
/>`;

const TeamComponentCode = `// TypeScript Interface
interface TeamMember {
  name: string;
  role: string;
  avatar?: string;
  bio?: string;
  socialLinks?: React.ReactNode;
}

interface TeamProps {
  title?: string;
  description?: string;
  members: TeamMember[];
  className?: string;
}

// Component Implementation
const Team = ({ title, description, members, className = '' }: TeamProps) => {
  return (
    <div className={\`bg-white py-12 \${className}\`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {title && (
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900">{title}</h2>
            {description && <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">{description}</p>}
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {members.map((member, index) => (
            <div key={index} className="text-center">
              <div className="mb-4">
                {member.avatar ? (
                  <img
                    className="mx-auto h-24 w-24 rounded-full"
                    src={member.avatar}
                    alt={member.name}
                  />
                ) : (
                  <div className="mx-auto h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-xl font-medium text-gray-600">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                )}
              </div>
              <h3 className="text-lg font-medium text-gray-900">{member.name}</h3>
              <p className="text-sm text-gray-500">{member.role}</p>
              {member.bio && <p className="mt-2 text-gray-600">{member.bio}</p>}
              {member.socialLinks && (
                <div className="mt-4 flex justify-center space-x-2">
                  {member.socialLinks}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Usage Examples
<Team 
  title="Our Team"
  description="Meet the amazing people behind our company"
  members={[
    {
      name: "John Doe",
      role: "CEO & Founder",
      bio: "John has over 20 years of experience in the industry.",
      avatar: "https://picsum.photos/seed/john/200/200.jpg",
      socialLinks: (
        <>
          <a href="#" className="text-gray-400 hover:text-gray-500">
            <span>📘</span>
          </a>
          <a href="#" className="text-gray-400 hover:text-gray-500">
            <span>🐦</span>
          </a>
          <a href="#" className="text-gray-400 hover:text-gray-500">
            <span>💼</span>
          </a>
        </>
      )
    },
    {
      name: "Jane Smith",
      role: "CTO",
      bio: "Jane is a technology enthusiast with a passion for innovation.",
      avatar: "https://picsum.photos/seed/jane/200/200.jpg",
      socialLinks: (
        <>
          <a href="#" className="text-gray-400 hover:text-gray-500">
            <span>📘</span>
          </a>
          <a href="#" className="text-gray-400 hover:text-gray-500">
            <span>🐦</span>
          </a>
          <a href="#" className="text-gray-400 hover:text-gray-500">
            <span>💼</span>
          </a>
        </>
      )
    },
    {
      name: "Bob Johnson",
      role: "Head of Design",
      bio: "Bob brings creative solutions to complex problems.",
      avatar: "https://picsum.photos/seed/bob/200/200.jpg",
      socialLinks: (
        <>
          <a href="#" className="text-gray-400 hover:text-gray-500">
            <span>📘</span>
          </a>
          <a href="#" className="text-gray-400 hover:text-gray-500">
            <span>🐦</span>
          </a>
          <a href="#" className="text-gray-400 hover:text-gray-500">
            <span>💼</span>
          </a>
        </>
      )
    }
  ]}
/>`;

const CtaComponentCode = `// TypeScript Interface
interface CtaProps {
  title: string;
  description?: string;
  primaryAction?: React.ReactNode;
  secondaryAction?: React.ReactNode;
  backgroundImage?: string;
  className?: string;
}

// Component Implementation
const Cta = ({ title, description, primaryAction, secondaryAction, backgroundImage, className = '' }: CtaProps) => {
  return (
    <div className={\`relative \${className}\`}>
      {backgroundImage && (
        <div className="absolute inset-0 z-0">
          <img src={backgroundImage} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-blue-600 bg-opacity-90"></div>
        </div>
      )}
      <div className={\`relative z-10 px-4 py-16 sm:px-6 sm:py-24 lg:py-32 \${backgroundImage ? '' : 'bg-blue-600'}\`}>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold text-white">
            {title}
          </h2>
          {description && (
            <p className="mt-6 text-lg leading-8 text-blue-100">
              {description}
            </p>
          )}
          <div className="mt-10 flex items-center justify-center gap-x-6">
            {primaryAction}
            {secondaryAction}
          </div>
        </div>
      </div>
    </div>
  );
};

// Usage Examples
<Cta 
  title="Ready to get started?"
  description="Join thousands of satisfied customers who are already using our platform."
  primaryAction={<Button variant="solid" color="white" className="text-blue-600">Get Started</Button>}
  secondaryAction={<Button variant="outline" color="white" className="border-white text-white hover:bg-white hover:text-blue-600">Learn More</Button>}
  backgroundImage="https://picsum.photos/seed/cta/1920/1080.jpg"
/>`;

const FaqComponentCode = `// TypeScript Interface
interface FaqItem {
  question: string;
  answer: string;
}

interface FaqProps {
  title?: string;
  description?: string;
  items: FaqItem[];
  className?: string;
}

// Component Implementation
const Faq = ({ title, description, items, className = '' }: FaqProps) => {
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggleItem = (index: string) => {
    setOpenItems(prev =>
      prev.includes(index)
        ? prev.filter(item => item !== index)
        : [...prev, index]
    );
  };

  return (
    <div className={\`bg-white py-12 \${className}\`}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {title && (
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900">{title}</h2>
            {description && <p className="mt-4 text-lg text-gray-500">{description}</p>}
          </div>
        )}
        
        <dl className="space-y-6">
          {items.map((item, index) => (
            <div key={index} className="border-b border-gray-200 pb-6">
              <dt className="text-lg">
                <button
                  className="text-left w-full flex justify-between items-start text-gray-400"
                  onClick={() => toggleItem(index.toString())}
                >
                  <span className="font-medium text-gray-900">{item.question}</span>
                  <span className="ml-6 h-7 flex items-center">
                    <span
                      className={\`h-6 w-6 transform \${openItems.includes(index.toString()) ? '-rotate-180' : 'rotate-0'}\`}
                    >
                      ▼
                    </span>
                  </span>
                </button>
              </dt>
              <dd className={\`mt-2 pr-12 \${openItems.includes(index.toString()) ? 'block' : 'hidden'}\`}>
                <p className="text-base text-gray-500">{item.answer}</p>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
};

// Usage Examples
<Faq 
  title="Frequently Asked Questions"
  description="Find answers to common questions about our product"
  items={[
    {
      question: "How do I get started?",
      answer: "Getting started is easy. Simply sign up for an account, choose a plan that fits your needs, and follow our onboarding process."
    },
    {
      question: "Can I change my plan later?",
      answer: "Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle."
    },
    {
      question: "Is my data secure?",
      answer: "Absolutely. We use industry-standard encryption and security measures to protect your data."
    }
  ]}
/>`;

// ==============================
// APP COMPONENT
// ==============================
const App = () => {
  const [activeComponent, setActiveComponent] = useState('button');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [enabled, setEnabled] = useState(false);
  const [chips, setChips] = useState(['React', 'TypeScript', 'Tailwind']);
  const [rating, setRating] = useState(3);
  const [sliderValue, setSliderValue] = useState(50);
  const [selectedCountry, setSelectedCountry] = useState('us');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('credit');
  const [accordionOpen, setAccordionOpen] = useState(['1']);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const tabs = [
    {
      id: 'tab1',
      label: 'Profile',
      content: <div className="p-4 bg-gray-50 rounded">Profile content goes here</div>
    },
    {
      id: 'tab2',
      label: 'Settings',
      content: <div className="p-4 bg-gray-50 rounded">Settings content goes here</div>
    },
    {
      id: 'tab3',
      label: 'Security',
      content: <div className="p-4 bg-gray-50 rounded">Security content goes here</div>
    }
  ];

  const dropdownItems = [
    { label: 'Edit', value: 'edit', onClick: () => console.log('Edit'), icon: <span>✏️</span> },
    { label: 'Duplicate', value: 'duplicate', onClick: () => console.log('Duplicate'), icon: <span>📋</span> },
    { label: 'Delete', value: 'delete', onClick: () => console.log('Delete'), icon: <span>🗑️</span>, danger: true }
  ];

  const tableColumns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'role', label: 'Role' },
    { 
      key: 'status', 
      label: 'Status',
      render: (value: string) => (
        <Badge variant={value === 'Active' ? 'solid' : 'outline'}>{value}</Badge>
      )
    }
  ];

  const tableData = [
    { name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active' },
    { name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'Inactive' },
    { name: 'Bob Johnson', email: 'bob@example.com', role: 'User', status: 'Active' }
  ];

  const steps = [
    { id: '1', label: 'Account', status: 'complete' },
    { id: '2', label: 'Profile', status: 'current', description: 'This is the current step' },
    { id: '3', label: 'Review', status: 'upcoming' }
  ];

  const timelineItems = [
    {
      id: '1',
      title: 'Order Placed',
      date: '2024-01-15',
      status: 'complete' as const
    },
    {
      id: '2',
      title: 'Order Shipped',
      date: '2024-01-16',
      status: 'current' as const
    },
    {
      id: '3',
      title: 'Order Delivered',
      status: 'upcoming' as const
    }
  ];

  const listItems = [
    {
      id: '1',
      title: 'John Doe',
      description: 'john@example.com',
      avatar: <Avatar fallback="JD" size="sm" />,
      actions: <Button size="sm">View</Button>
    },
    {
      id: '2',
      title: 'Jane Smith',
      description: 'jane@example.com',
      avatar: <Avatar fallback="JS" size="sm" />,
      actions: <Button size="sm">View</Button>
    }
  ];

  const accordionItems = [
    {
      id: '1',
      title: 'What is your return policy?',
      content: 'We offer a 30-day return policy for all unused items in original packaging.'
    },
    {
      id: '2',
      title: 'How long does shipping take?',
      content: 'Standard shipping typically takes 5-7 business days.'
    },
    {
      id: '3',
      title: 'Do you offer international shipping?',
      content: 'Yes, we ship to over 50 countries worldwide.'
    }
  ];

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Components', href: '/components' },
    { label: 'Button', active: true }
  ];

  const selectOptions = [
    { value: 'us', label: 'United States' },
    { value: 'ca', label: 'Canada' },
    { value: 'uk', label: 'United Kingdom' }
  ];

  const radioOptions = [
    { value: 'credit', label: 'Credit Card' },
    { value: 'debit', label: 'Debit Card' },
    { value: 'paypal', label: 'PayPal' }
  ];

  const treeData = [
    {
      id: '1',
      label: 'Documents',
      icon: <span>📁</span>,
      defaultExpanded: true,
      children: [
        { id: '1-1', label: 'Report.pdf', icon: <span>📄</span> },
        { id: '1-2', label: 'Presentation.pptx', icon: <span>📄</span> }
      ]
    },
    {
      id: '2',
      label: 'Images',
      icon: <span>📁</span>,
      children: [
        { id: '2-1', label: 'Photo.jpg', icon: <span>🖼️</span> },
        { id: '2-2', label: 'Icon.png', icon: <span>🖼️</span> }
      ]
    }
  ];

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
      id: 'dropdown',
      label: 'Dropdown',
      icon: <span>📋</span>,
      active: activeComponent === 'dropdown',
      onClick: () => setActiveComponent('dropdown'),
      category: 'components'
    },
    {
      id: 'table',
      label: 'Table',
      icon: <span>📊</span>,
      active: activeComponent === 'table',
      onClick: () => setActiveComponent('table'),
      category: 'components'
    },
    {
      id: 'badge',
      label: 'Badge',
      icon: <span>🏷️</span>,
      active: activeComponent === 'badge',
      onClick: () => setActiveComponent('badge'),
      category: 'components'
    },
    {
      id: 'input',
      label: 'Input',
      icon: <span>📝</span>,
      active: activeComponent === 'input',
      onClick: () => setActiveComponent('input'),
      category: 'components'
    },
    {
      id: 'card',
      label: 'Card',
      icon: <span>🃏</span>,
      active: activeComponent === 'card',
      onClick: () => setActiveComponent('card'),
      category: 'components'
    },
    {
      id: 'alert',
      label: 'Alert',
      icon: <span>🚨</span>,
      active: activeComponent === 'alert',
      onClick: () => setActiveComponent('alert'),
      category: 'components'
    },
    {
      id: 'tabs',
      label: 'Tabs',
      icon: <span>📑</span>,
      active: activeComponent === 'tabs',
      onClick: () => setActiveComponent('tabs'),
      category: 'components'
    },
    {
      id: 'pagination',
      label: 'Pagination',
      icon: <span>📄</span>,
      active: activeComponent === 'pagination',
      onClick: () => setActiveComponent('pagination'),
      category: 'components'
    },
    {
      id: 'tooltip',
      label: 'Tooltip',
      icon: <span>💬</span>,
      active: activeComponent === 'tooltip',
      onClick: () => setActiveComponent('tooltip'),
      category: 'components'
    },
    {
      id: 'progress',
      label: 'Progress',
      icon: <span>📈</span>,
      active: activeComponent === 'progress',
      onClick: () => setActiveComponent('progress'),
      category: 'components'
    },
    {
      id: 'toggle',
      label: 'Toggle',
      icon: <span>🔀</span>,
      active: activeComponent === 'toggle',
      onClick: () => setActiveComponent('toggle'),
      category: 'components'
    },
    {
      id: 'chip',
      label: 'Chip',
      icon: <span>🏷️</span>,
      active: activeComponent === 'chip',
      onClick: () => setActiveComponent('chip'),
      category: 'components'
    },
    {
      id: 'steps',
      label: 'Steps',
      icon: <span>🔢</span>,
      active: activeComponent === 'steps',
      onClick: () => setActiveComponent('steps'),
      category: 'components'
    },
    {
      id: 'breadcrumb',
      label: 'Breadcrumb',
      icon: <span>🧭</span>,
      active: activeComponent === 'breadcrumb',
      onClick: () => setActiveComponent('breadcrumb'),
      category: 'components'
    },
    {
      id: 'skeleton',
      label: 'Skeleton',
      icon: <span>🦴</span>,
      active: activeComponent === 'skeleton',
      onClick: () => setActiveComponent('skeleton'),
      category: 'components'
    },
    {
      id: 'empty',
      label: 'Empty State',
      icon: <span>📭</span>,
      active: activeComponent === 'empty',
      onClick: () => setActiveComponent('empty'),
      category: 'components'
    },
    {
      id: 'accordion',
      label: 'Accordion',
      icon: <span>📁</span>,
      active: activeComponent === 'accordion',
      onClick: () => setActiveComponent('accordion'),
      category: 'components'
    },
    {
      id: 'select',
      label: 'Select',
      icon: <span>📋</span>,
      active: activeComponent === 'select',
      onClick: () => setActiveComponent('select'),
      category: 'components'
    },
    {
      id: 'textarea',
      label: 'Textarea',
      icon: <span>📝</span>,
      active: activeComponent === 'textarea',
      onClick: () => setActiveComponent('textarea'),
      category: 'components'
    },
    {
      id: 'checkbox',
      label: 'Checkbox',
      icon: <span>☑️</span>,
      active: activeComponent === 'checkbox',
      onClick: () => setActiveComponent('checkbox'),
      category: 'components'
    },
    {
      id: 'radio',
      label: 'Radio',
      icon: <span>🔘</span>,
      active: activeComponent === 'radio',
      onClick: () => setActiveComponent('radio'),
      category: 'components'
    },
    {
      id: 'slider',
      label: 'Slider',
      icon: <span>🎚️</span>,
      active: activeComponent === 'slider',
      onClick: () => setActiveComponent('slider'),
      category: 'components'
    },
    {
      id: 'rating',
      label: 'Rating',
      icon: <span>⭐</span>,
      active: activeComponent === 'rating',
      onClick: () => setActiveComponent('rating'),
      category: 'components'
    },
    {
      id: 'upload',
      label: 'Upload',
      icon: <span>📤</span>,
      active: activeComponent === 'upload',
      onClick: () => setActiveComponent('upload'),
      category: 'components'
    },
    {
      id: 'divider',
      label: 'Divider',
      icon: <span>➖</span>,
      active: activeComponent === 'divider',
      onClick: () => setActiveComponent('divider'),
      category: 'components'
    },
    {
      id: 'list',
      label: 'List',
      icon: <span>📋</span>,
      active: activeComponent === 'list',
      onClick: () => setActiveComponent('list'),
      category: 'components'
    },
    {
      id: 'timeline',
      label: 'Timeline',
      icon: <span>📅</span>,
      active: activeComponent === 'timeline',
      onClick: () => setActiveComponent('timeline'),
      category: 'components'
    },
    {
      id: 'tag',
      label: 'Tag',
      icon: <span>🏷️</span>,
      active: activeComponent === 'tag',
      onClick: () => setActiveComponent('tag'),
      category: 'components'
    },
    {
      id: 'notification',
      label: 'Notification',
      icon: <span>🔔</span>,
      active: activeComponent === 'notification',
      onClick: () => setActiveComponent('notification'),
      category: 'components'
    },
    {
      id: 'spinner',
      label: 'Spinner',
      icon: <span>🔄</span>,
      active: activeComponent === 'spinner',
      onClick: () => setActiveComponent('spinner'),
      category: 'components'
    },
    {
      id: 'calendar',
      label: 'Calendar',
      icon: <span>📅</span>,
      active: activeComponent === 'calendar',
      onClick: () => setActiveComponent('calendar'),
      category: 'components'
    },
    {
      id: 'datepicker',
      label: 'Date Picker',
      icon: <span>📆</span>,
      active: activeComponent === 'datepicker',
      onClick: () => setActiveComponent('datepicker'),
      category: 'components'
    },
    {
      id: 'carousel',
      label: 'Carousel',
      icon: <span>🎠</span>,
      active: activeComponent === 'carousel',
      onClick: () => setActiveComponent('carousel'),
      category: 'components'
    },
    {
      id: 'kpicard',
      label: 'KPI Card',
      icon: <span>📊</span>,
      active: activeComponent === 'kpicard',
      onClick: () => setActiveComponent('kpicard'),
      category: 'components'
    },
    {
      id: 'meter',
      label: 'Meter',
      icon: <span>⏱️</span>,
      active: activeComponent === 'meter',
      onClick: () => setActiveComponent('meter'),
      category: 'components'
    },
    {
      id: 'statistic',
      label: 'Statistic',
      icon: <span>📈</span>,
      active: activeComponent === 'statistic',
      onClick: () => setActiveComponent('statistic'),
      category: 'components'
    },
    {
      id: 'form',
      label: 'Form',
      icon: <span>📝</span>,
      active: activeComponent === 'form',
      onClick: () => setActiveComponent('form'),
      category: 'components'
    },
    {
      id: 'formfield',
      label: 'Form Field',
      icon: <span>📋</span>,
      active: activeComponent === 'formfield',
      onClick: () => setActiveComponent('formfield'),
      category: 'components'
    },
    {
      id: 'formgroup',
      label: 'Form Group',
      icon: <span>📁</span>,
      active: activeComponent === 'formgroup',
      onClick: () => setActiveComponent('formgroup'),
      category: 'components'
    },
    {
      id: 'actionsheet',
      label: 'Action Sheet',
      icon: <span>📋</span>,
      active: activeComponent === 'actionsheet',
      onClick: () => setActiveComponent('actionsheet'),
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
    {
      id: 'popup',
      label: 'Popup',
      icon: <span>🔲</span>,
      active: activeComponent === 'popup',
      onClick: () => setActiveComponent('popup'),
      category: 'components'
    },
    {
      id: 'collapse',
      label: 'Collapse',
      icon: <span>📉</span>,
      active: activeComponent === 'collapse',
      onClick: () => setActiveComponent('collapse'),
      category: 'components'
    },
    {
      id: 'tree',
      label: 'Tree',
      icon: <span>🌳</span>,
      active: activeComponent === 'tree',
      onClick: () => setActiveComponent('tree'),
      category: 'components'
    },
    {
      id: 'masonry',
      label: 'Masonry',
      icon: <span>🧱</span>,
      active: activeComponent === 'masonry',
      onClick: () => setActiveComponent('masonry'),
      category: 'components'
    },
    {
      id: 'image',
      label: 'Image',
      icon: <span>🖼️</span>,
      active: activeComponent === 'image',
      onClick: () => setActiveComponent('image'),
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
      id: 'navbar',
      label: 'Navbar',
      icon: <span>🧭</span>,
      active: activeComponent === 'navbar',
      onClick: () => setActiveComponent('navbar'),
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
      id: 'team',
      label: 'Team',
      icon: <span>👥</span>,
      active: activeComponent === 'team',
      onClick: () => setActiveComponent('team'),
      category: 'blocks'
    },
    {
      id: 'cta',
      label: 'CTA',
      icon: <span>📣</span>,
      active: activeComponent === 'cta',
      onClick: () => setActiveComponent('cta'),
      category: 'blocks'
    },
    {
      id: 'faq',
      label: 'FAQ',
      icon: <span>❓</span>,
      active: activeComponent === 'faq',
      onClick: () => setActiveComponent('faq'),
      category: 'blocks'
    },
    {
      id: 'authcard',
      label: 'Auth Card',
      icon: <span>🔐</span>,
      active: activeComponent === 'authcard',
      onClick: () => setActiveComponent('authcard'),
      category: 'blocks'
    },
    {
      id: 'testimonial',
      label: 'Testimonial',
      icon: <span>💬</span>,
      active: activeComponent === 'testimonial',
      onClick: () => setActiveComponent('testimonial'),
      category: 'blocks'
    },
    {
      id: 'pricingcard',
      label: 'Pricing Card',
      icon: <span>💳</span>,
      active: activeComponent === 'pricingcard',
      onClick: () => setActiveComponent('pricingcard'),
      category: 'blocks'
    },
    {
      id: 'featurecard',
      label: 'Feature Card',
      icon: <span>✨</span>,
      active: activeComponent === 'featurecard',
      onClick: () => setActiveComponent('featurecard'),
      category: 'blocks'
    },
    // Layout Blocks
    {
      id: 'layoutsidebar',
      label: 'Layout Sidebar',
      icon: <span>🖥️</span>,
      active: activeComponent === 'layoutsidebar',
      onClick: () => setActiveComponent('layoutsidebar'),
      category: 'blocks'
    },
    {
      id: 'settingssidebar',
      label: 'Settings Sidebar',
      icon: <span>⚙️</span>,
      active: activeComponent === 'settingssidebar',
      onClick: () => setActiveComponent('settingssidebar'),
      category: 'blocks'
    },
    {
      id: 'dashboardsidebar',
      label: 'Dashboard Sidebar',
      icon: <span>📊</span>,
      active: activeComponent === 'dashboardsidebar',
      onClick: () => setActiveComponent('dashboardsidebar'),
      category: 'blocks'
    }
  ];

  const handleDeleteChip = (chipToDelete: string) => {
    setChips(chips.filter(chip => chip !== chipToDelete));
  };

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
            <CodeBlock code={`// TypeScript Interface
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
</Modal>`} />
          </div>
        );
      
      case 'dropdown':
        return (
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Dropdown Component</h2>
            <div className="mb-6">
              <Dropdown 
                trigger={<Button variant="outline">Options</Button>}
                items={dropdownItems}
              />
            </div>
            <h3 className="text-lg font-medium mb-3">Component Code:</h3>
            <CodeBlock code={`// TypeScript Interface
interface DropdownItem {
  label: string;
  value: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  danger?: boolean;
}

interface DropdownProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  position?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';
  className?: string;
}

// Component Implementation
const Dropdown = ({ trigger, items, position = 'bottom-left', className = '' }: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const positions = {
    'bottom-left': 'top-full left-0 mt-1',
    'bottom-right': 'top-full right-0 mt-1',
    'top-left': 'bottom-full left-0 mb-1',
    'top-right': 'bottom-full right-0 mb-1'
  };

  return (
    <div className={\`relative inline-block \${className}\`} ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)}>
        {trigger}
      </div>
      {isOpen && (
        <div className={\`absolute z-50 w-48 rounded-md bg-white py-1 border border-gray-200 shadow-lg \${positions[position]}\`}>
          {items.map((item) => (
            <button
              key={item.value}
              onClick={() => {
                item.onClick?.();
                setIsOpen(false);
              }}
              disabled={item.disabled}
              className={\`w-full px-4 py-2 text-left text-sm flex items-center gap-2 \${item.disabled 
                ? 'text-gray-400 cursor-not-allowed' 
                : item.danger 
                  ? 'text-red-600 hover:bg-red-50' 
                  : 'text-gray-700 hover:bg-gray-50'
              }\`}
            >
              {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Usage Examples
const dropdownItems = [
  { label: 'Edit', value: 'edit', onClick: () => console.log('Edit'), icon: <span>✏️</span> },
  { label: 'Duplicate', value: 'duplicate', onClick: () => console.log('Duplicate'), icon: <span>📋</span> },
  { label: 'Delete', value: 'delete', onClick: () => console.log('Delete'), icon: <span>🗑️</span>, danger: true }
];

<Dropdown 
  trigger={<Button variant="outline">Options</Button>}
  items={dropdownItems}
/>`} />
          </div>
        );
      
      case 'table':
        return (
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Table Component</h2>
            <div className="mb-6">
              <Table columns={tableColumns} data={tableData} />
            </div>
            <h3 className="text-lg font-medium mb-3">Component Code:</h3>
            <CodeBlock code={`// TypeScript Interface
interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: any) => React.ReactNode;
}

interface TableProps {
  columns: TableColumn[];
  data: any[];
  onSort?: (key: string, direction: 'asc' | 'desc') => void;
  sortKey?: string;
  sortDirection?: 'asc' | 'desc';
  className?: string;
}

// Component Implementation
const Table = ({ columns, data, onSort, sortKey, sortDirection, className = '' }: TableProps) => {
  const handleSort = (key: string) => {
    if (onSort) {
      const direction = sortKey === key && sortDirection === 'asc' ? 'desc' : 'asc';
      onSort(key, direction);
    }
  };

  return (
    <div className={\`overflow-x-auto \${className}\`}>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {column.sortable ? (
                  <button
                    onClick={() => handleSort(column.key)}
                    className="flex items-center gap-1 hover:text-gray-700"
                  >
                    {column.label}
                    {sortKey === column.key && (
                      sortDirection === 'asc' ? <span>↑</span> : <span>↓</span>
                    )}
                  </button>
                ) : (
                  column.label
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, index) => (
            <tr key={index} className="hover:bg-gray-50">
              {columns.map((column) => (
                <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {column.render ? column.render(row[column.key], row) : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Usage Examples
const tableColumns = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'role', label: 'Role' },
  { 
    key: 'status', 
    label: 'Status',
    render: (value: string) => (
      <Badge variant={value === 'Active' ? 'success' : 'warning'}>{value}</Badge>
    )
  }
];

const tableData = [
  { name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active' },
  { name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'Inactive' },
  { name: 'Bob Johnson', email: 'bob@example.com', role: 'User', status: 'Active' }
];

<Table columns={tableColumns} data={tableData} />`} />
          </div>
        );
      
      case 'badge':
        return (
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Badge Component</h2>
            <div className="flex gap-4 flex-wrap mb-6">
              <Badge variant="solid" color="primary">Primary</Badge>
              <Badge variant="outline" color="success">Success</Badge>
              <Badge variant="soft" color="warning">Warning</Badge>
              <Badge variant="solid" color="error">Error</Badge>
            </div>
            <h3 className="text-lg font-medium mb-3">Component Code:</h3>
            <CodeBlock code={`// TypeScript Interface
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'solid' | 'outline' | 'soft';
  size?: 'sm' | 'md' | 'lg';
  color?: Color;
  className?: string;
}

// Component Implementation
const Badge = ({ 
  children, 
  variant = 'solid', 
  size = 'md', 
  color = 'primary',
  className = '' 
}: BadgeProps) => {
  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-0.5 text-sm",
    lg: "px-3 py-1 text-base"
  };

  const variants = {
    solid: {
      primary: "bg-blue-100 text-blue-800",
      secondary: "bg-gray-100 text-gray-800",
      success: "bg-green-100 text-green-800",
      warning: "bg-yellow-100 text-yellow-800",
      error: "bg-red-100 text-red-800",
      info: "bg-cyan-100 text-cyan-800"
    },
    outline: {
      primary: "border border-blue-600 text-blue-600",
      secondary: "border border-gray-600 text-gray-600",
      success: "border border-green-600 text-green-600",
      warning: "border border-yellow-600 text-yellow-600",
      error: "border border-red-600 text-red-600",
      info: "border border-cyan-600 text-cyan-600"
    },
    soft: {
      primary: "bg-blue-50 text-blue-700",
      secondary: "bg-gray-50 text-gray-700",
      success: "bg-green-50 text-green-700",
      warning: "bg-yellow-50 text-yellow-700",
      error: "bg-red-50 text-red-700",
      info: "bg-cyan-50 text-cyan-700"
    }
  };

  // Check if variant is actually a color
  if (variant === 'primary' || variant === 'secondary' || variant === 'success' || variant === 'warning' || variant === 'error' || variant === 'info') {
    // If variant is a color, use it as the color and default to 'solid' variant
    return (
      <span className={\`inline-flex items-center rounded-full font-medium \${sizes[size]} \${variants.solid[variant]} \${className}\`}>
        {children}
      </span>
    );
  }

  return (
    <span className={\`inline-flex items-center rounded-full font-medium \${sizes[size]} \${variants[variant][color]} \${className}\`}>
      {children}
    </span>
  );
};

// Usage Examples
<Badge variant="solid" color="primary">Primary</Badge>
<Badge variant="outline" color="success">Success</Badge>
<Badge variant="soft" color="warning">Warning</Badge>
<Badge variant="solid" color="error">Error</Badge>`} />
          </div>
        );
      
      case 'input':
        return (
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Input Component</h2>
            <div className="space-y-4 w-full max-w-sm mb-6">
              <Input placeholder="Basic input" />
              <Input label="Email" type="email" helperText="We'll never share your email." />
              <Input icon={<span>🔍</span>} placeholder="Search..." />
              <Input error="This field is required" placeholder="Error state" />
            </div>
            <h3 className="text-lg font-medium mb-3">Component Code:</h3>
            <CodeBlock code={`// TypeScript Interface
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  helperText?: string;
}

// Component Implementation
const Input = ({ label, error, icon, helperText, className = '', ...props }: InputProps) => {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium mb-2 text-gray-700">{label}</label>}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
            {icon}
          </div>
        )}
        <input
          className={\`
            w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors
            \${error ? 'border-red-500 focus:ring-red-500' : ''}
            \${icon ? 'pl-10' : ''}
            \${className}
          \`}
          {...props}
        />
      </div>
      {error && <div className="mt-1 text-sm text-red-600">{error}</div>}
      {helperText && !error && <div className="mt-1 text-sm text-gray-500">{helperText}</div>}
    </div>
  );
};

// Usage Examples
<Input placeholder="Basic input" />
<Input label="Email" type="email" helperText="We'll never share your email." />
<Input icon={<span>🔍</span>} placeholder="Search..." />
<Input error="This field is required" placeholder="Error state" />`} />
          </div>
        );
      
      case 'card':
        return (
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Card Component</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <Card>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Basic Card</h3>
                <p className="text-gray-700">This is a simple card component.</p>
              </Card>

              <Card hover>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Hover Card</h3>
                <p className="text-gray-700">This card has hover effects.</p>
              </Card>

              <Card title="Featured Card" subtitle="Secondary information" actions={<Button size="sm">Action</Button>}>
                <p className="text-gray-700">Card with title, subtitle, and actions.</p>
              </Card>
            </div>
            <h3 className="text-lg font-medium mb-3">Component Code:</h3>
            <CodeBlock code={`// TypeScript Interface
interface CardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  hover?: boolean;
  padding?: 'sm' | 'md' | 'lg';
  className?: string;
}

// Component Implementation
const Card = ({ children, title, subtitle, actions, hover = false, padding = 'md', className = '' }: CardProps) => {
  const paddings = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  return (
    <div className={\`bg-white border border-gray-200 rounded-xl shadow-sm \${paddings[padding]} \${hover ? 'hover:shadow-md transition-shadow duration-200' : ''} \${className}\`}>
      {(title || subtitle || actions) && (
        <div className="flex items-start justify-between mb-4">
          <div>
            {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
            {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
          </div>
          {actions && <div className="flex gap-2 ml-4">{actions}</div>}
        </div>
      )}
      <div className="text-gray-700">
        {children}
      </div>
    </div>
  );
};

// Usage Examples
<Card>
  <h3 className="text-lg font-semibold text-gray-900 mb-2">Basic Card</h3>
  <p className="text-gray-700">This is a simple card component.</p>
</Card>

<Card hover>
  <h3 className="text-lg font-semibold text-gray-900 mb-2">Hover Card</h3>
  <p className="text-gray-700">This card has hover effects.</p>
</Card>

<Card title="Featured Card" subtitle="Secondary information" actions={<Button size="sm">Action</Button>}>
  <p className="text-gray-700">Card with title, subtitle, and actions.</p>
</Card>`} />
          </div>
        );
      
      case 'alert':
        return (
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Alert Component</h2>
            <div className="space-y-4 mb-6">
              <Alert variant="info">This is an informational alert.</Alert>
              <Alert variant="success">Operation completed successfully!</Alert>
              <Alert variant="warning">Please review your input.</Alert>
              <Alert variant="error" dismissible onDismiss={() => console.log('dismissed')}>
                An error occurred. Please try again.
              </Alert>
            </div>
            <h3 className="text-lg font-medium mb-3">Component Code:</h3>
            <CodeBlock code={`// TypeScript Interface
interface AlertProps {
  children: React.ReactNode;
  variant?: 'info' | 'success' | 'warning' | 'error';
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
}

// Component Implementation
const Alert = ({ children, variant = 'info', dismissible = false, onDismiss, className = '' }: AlertProps) => {
  const variants = {
    info: "bg-blue-50 border-blue-200 text-blue-800",
    success: "bg-green-50 border-green-200 text-green-800",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
    error: "bg-red-50 border-red-200 text-red-800"
  };

  const icons = {
    info: <span className="text-blue-500">ℹ️</span>,
    success: <span className="text-green-500">✓</span>,
    warning: <span className="text-yellow-500">⚠️</span>,
    error: <span className="text-red-500">✕</span>
  };

  return (
    <div className={\`border rounded-md p-4 \${variants[variant]} \${className}\`}>
      <div className="flex">
        <div className="flex-shrink-0">
          {icons[variant]}
        </div>
        <div className="ml-3 flex-1">
          <div className="text-sm">{children}</div>
        </div>
        {dismissible && (
          <div className="ml-auto pl-3">
            <button
              onClick={onDismiss}
              className="inline-flex text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              <span className="text-sm">×</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Usage Examples
<Alert variant="info">This is an informational alert.</Alert>
<Alert variant="success">Operation completed successfully!</Alert>
<Alert variant="warning">Please review your input.</Alert>
<Alert variant="error" dismissible onDismiss={() => console.log('dismissed')}>
  An error occurred. Please try again.
</Alert>`} />
          </div>
        );
      
      case 'tabs':
        return (
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Tabs Component</h2>
            <div className="mb-6">
              <Tabs tabs={tabs} defaultTab="tab1" />
            </div>
            <h3 className="text-lg font-medium mb-3">Component Code:</h3>
            <CodeBlock code={`// TypeScript Interface
interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: TabItem[];
  defaultTab?: string;
  className?: string;
}

// Component Implementation
const Tabs = ({ tabs, defaultTab, className = '' }: TabsProps) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  return (
    <div className={className}>
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={\`py-2 px-1 border-b-2 font-medium text-sm \${activeTab === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }\`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
      <div className="mt-4">
        {tabs.find((tab) => tab.id === activeTab)?.content}
      </div>
    </div>
  );
};

// Usage Examples
const tabs = [
  {
    id: 'tab1',
    label: 'Profile',
    content: <div className="p-4 bg-gray-50 rounded">Profile content goes here</div>
  },
  {
    id: 'tab2',
    label: 'Settings',
    content: <div className="p-4 bg-gray-50 rounded">Settings content goes here</div>
  },
  {
    id: 'tab3',
    label: 'Security',
    content: <div className="p-4 bg-gray-50 rounded">Security content goes here</div>
  }
];

<Tabs tabs={tabs} defaultTab="tab1" />`} />
          </div>
        );
      
      case 'pagination':
        return (
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Pagination Component</h2>
            <div className="mb-6">
              <Pagination 
                currentPage={currentPage}
                totalPages={10}
                onPageChange={setCurrentPage}
              />
            </div>
            <h3 className="text-lg font-medium mb-3">Component Code:</h3>
            <CodeBlock code={`// TypeScript Interface
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

// Component Implementation
const Pagination = ({ currentPage, totalPages, onPageChange, className = '' }: PaginationProps) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  
  return (
    <div className={\`flex items-center justify-between \${className}\`}>
      <div className="text-sm text-gray-700">
        Showing page {currentPage} of {totalPages}
      </div>
      <div className="flex gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          Previous
        </button>
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={\`px-3 py-1 text-sm border rounded-md \${page === currentPage
              ? 'bg-blue-600 text-white border-blue-600'
              : 'border-gray-300 hover:bg-gray-50'
            }\`}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

// Usage Examples
const [currentPage, setCurrentPage] = useState(1);

<Pagination 
  currentPage={currentPage}
  totalPages={10}
  onPageChange={setCurrentPage}
/>`} />
          </div>
        );
      
      case 'tooltip':
        return (
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Tooltip Component</h2>
            <div className="flex gap-4 items-center mb-6">
              <Tooltip content="This is a tooltip">
                <Button>Hover me</Button>
              </Tooltip>
              <Tooltip content="Tooltip on the right" position="right">
                <Avatar fallback="JD" />
              </Tooltip>
              <Tooltip content="Tooltip on the bottom" position="bottom">
                <Badge variant="solid" color="success">Success</Badge>
              </Tooltip>
            </div>
            <h3 className="text-lg font-medium mb-3">Component Code:</h3>
            <CodeBlock code={`// TypeScript Interface
interface TooltipProps {
  content: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  children: React.ReactNode;
  className?: string;
}

// Component Implementation
const Tooltip = ({ content, position = 'top', children, className = '' }: TooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);
  
  const positions = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2'
  };

  const arrowPositions = {
    top: 'top-full left-1/2 transform -translate-x-1/2 -mt-1',
    bottom: 'bottom-full left-1/2 transform -translate-x-1/2 -mb-1',
    left: 'left-full top-1/2 transform -translate-y-1/2 -ml-1',
    right: 'right-full top-1/2 transform -translate-y-1/2 -mr-1'
  };

  return (
    <div 
      className={\`relative inline-block \${className}\`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div className={\`absolute z-50 px-3 py-2 text-sm text-white bg-gray-900 rounded-md \${positions[position]}\`}>
          {content}
          <div className={\`absolute w-2 h-2 bg-gray-900 transform rotate-45 \${arrowPositions[position]}\`}></div>
        </div>
      )}
    </div>
  );
};

// Usage Examples
<Tooltip content="This is a tooltip">
  <Button>Hover me</Button>
</Tooltip>
<Tooltip content="Tooltip on the right" position="right">
  <Avatar fallback="JD" />
</Tooltip>
<Tooltip content="Tooltip on the bottom" position="bottom">
  <Badge variant="solid" color="success">Success</Badge>
</Tooltip>`} />
          </div>
        );
      
      case 'progress':
        return (
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Progress Component</h2>
            <div className="space-y-4 w-full max-w-md mb-6">
              <Progress value={30} showLabel />
              <Progress value={60} color="success" size="lg" />
              <Progress value={90} color="warning" />
            </div>
            <h3 className="text-lg font-medium mb-3">Component Code:</h3>
            <CodeBlock code={`// TypeScript Interface
interface ProgressProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  color?: Color;
  showLabel?: boolean;
  className?: string;
}

// Component Implementation
const Progress = ({ value, max = 100, size = 'md', color = 'primary', showLabel = false, className = '' }: ProgressProps) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  
  const sizes = {
    sm: "h-2",
    md: "h-4",
    lg: "h-6"
  };

  const colors = {
    primary: "bg-blue-600",
    secondary: "bg-gray-600",
    success: "bg-green-600",
    warning: "bg-yellow-500",
    error: "bg-red-600",
    info: "bg-cyan-600"
  };

  return (
    <div className={className}>
      {showLabel && (
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium text-gray-700">Progress</span>
          <span className="text-sm font-medium text-gray-700">{Math.round(percentage)}%</span>
        </div>
      )}
      <div className={\`w-full bg-gray-200 rounded-full \${sizes[size]}\`}>
        <div
          className={\`\${colors[color]} \${sizes[size]} rounded-full\`}
          style={{ width: \`\${percentage}%\` }}
        ></div>
      </div>
    </div>
  );
};

// Usage Examples
<Progress value={30} showLabel />
<Progress value={60} color="success" size="lg" />
<Progress value={90} color="warning" />`} />
          </div>
        );
      
      case 'toggle':
        return (
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Toggle Component</h2>
            <div className="flex gap-4 items-center mb-6">
              <Toggle checked={enabled} onChange={setEnabled} />
              <Toggle checked={true} disabled />
              <Toggle checked={false} size="lg" />
            </div>
            <h3 className="text-lg font-medium mb-3">Component Code:</h3>
            <CodeBlock code={`// TypeScript Interface
interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

// Component Implementation
const Toggle = ({ checked, onChange, disabled = false, size = 'md', className = '' }: ToggleProps) => {
  const sizes = {
    sm: "h-5 w-9",
    md: "h-6 w-11",
    lg: "h-7 w-13"
  };

  const dotSizes = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6"
  };

  const dotPositions = {
    sm: checked ? "translate-x-4" : "translate-x-0.5",
    md: checked ? "translate-x-5" : "translate-x-0.5",
    lg: checked ? "translate-x-6" : "translate-x-0.5"
  };

  return (
    <button
      type="button"
      className={\`\${checked ? "bg-blue-600" : "bg-gray-200"} relative inline-flex flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 \${sizes[size]} \${disabled ? "opacity-50 cursor-not-allowed" : ""} \${className}\`}
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
    >
      <span
        className={\`\${checked ? "bg-white" : "bg-white"} pointer-events-none inline-block h-5 w-5 transform rounded-full shadow ring-0 transition duration-200 ease-in-out \${dotSizes[size]} \${dotPositions[size]}\`}
      />
    </button>
  );
};

// Usage Examples
const [enabled, setEnabled] = useState(false);

<Toggle checked={enabled} onChange={setEnabled} />
<Toggle checked={true} disabled />
<Toggle checked={false} size="lg" />`} />
          </div>
        );
      
      case 'chip':
        return (
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Chip Component</h2>
            <div className="flex gap-2 flex-wrap mb-6">
              {chips.map((chip) => (
                <Chip 
                  key={chip} 
                  label={chip} 
                  onDelete={() => handleDeleteChip(chip)}
                  avatar={<Avatar fallback={chip.substring(0, 2)} size="xs" />}
                />
              ))}
            </div>
            <h3 className="text-lg font-medium mb-3">Component Code:</h3>
            <CodeBlock code={`// TypeScript Interface
interface ChipProps {
  label: string;
  onDelete?: () => void;
  avatar?: React.ReactNode;
  color?: Color;
  className?: string;
}

// Component Implementation
const Chip = ({ label, onDelete, avatar, color = 'primary', className = '' }: ChipProps) => {
  const colors = {
    primary: "bg-blue-100 text-blue-800",
    secondary: "bg-gray-100 text-gray-800",
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    error: "bg-red-100 text-red-800",
    info: "bg-cyan-100 text-cyan-800"
  };

  return (
    <div className={\`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm \${colors[color]} \${className}\`}>
      {avatar && <span className="flex-shrink-0">{avatar}</span>}
      <span>{label}</span>
      {onDelete && (
        <button
          onClick={onDelete}
          className="flex-shrink-0 ml-1 rounded-full hover:bg-black hover:bg-opacity-10 p-0.5"
        >
          <span className="text-xs">×</span>
        </button>
      )}
    </div>
  );
};

// Usage Examples
const [chips, setChips] = useState(['React', 'TypeScript', 'Tailwind']);

const handleDeleteChip = (chipToDelete: string) => {
  setChips(chips.filter(chip => chip !== chipToDelete));
};

{chips.map((chip) => (
  <Chip 
    key={chip} 
    label={chip} 
    onDelete={() => handleDeleteChip(chip)}
    avatar={<Avatar fallback={chip.substring(0, 2)} size="xs" />}
  />
))}`} />
          </div>
        );
      
      case 'steps':
        return (
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Steps Component</h2>
            <div className="mb-6">
              <Steps steps={steps} />
            </div>
            <h3 className="text-lg font-medium mb-3">Component Code:</h3>
            <CodeBlock code={`// TypeScript Interface
interface StepItem {
  id: string;
  label: string;
  description?: string;
  status?: 'complete' | 'current' | 'upcoming';
}

interface StepsProps {
  steps: StepItem[];
  className?: string;
}

// Component Implementation
const Steps = ({ steps, className = '' }: StepsProps) => {
  return (
    <nav aria-label="Progress" className={className}>
      <ol className="flex items-center">
        {steps.map((step, stepIdx) => (
          <li key={step.id} className={\`\${stepIdx !== steps.length - 1 ? 'flex-1' : ''}\`}>
            <div className={\`flex items-center \${stepIdx !== steps.length - 1 ? 'w-full' : ''}\`}>
              <div
                className={\`flex h-10 w-10 items-center justify-center rounded-full border-2 \${step.status === 'complete'
                  ? 'border-blue-600 bg-blue-600'
                  : step.status === 'current'
                  ? 'border-blue-600 bg-white'
                  : 'border-gray-300 bg-white'
                }\`}
              >
                {step.status === 'complete' ? (
                  <span className="text-white text-xs">✓</span>
                ) : step.status === 'current' ? (
                  <span className="text-blue-600">{stepIdx + 1}</span>
                ) : (
                  <span className="text-gray-500">{stepIdx + 1}</span>
                )}
              </div>
              <div className={\`ml-4 min-w-0 flex-1 \${stepIdx !== steps.length - 1 ? 'pr-8' : ''}\`}>
                <p
                  className={\`text-sm font-medium \${step.status === 'complete'
                    ? 'text-blue-600'
                    : step.status === 'current'
                    ? 'text-blue-600'
                    : 'text-gray-500'
                  }\`}
                >
                  {step.label}
                </p>
                {step.description && (
                  <p className="text-sm text-gray-500">{step.description}</p>
                )}
              </div>
              {stepIdx !== steps.length - 1 && (
                <div
                  className={\`absolute top-5 left-10 h-0.5 w-full \${step.status === 'complete' ? 'bg-blue-600' : 'bg-gray-300'}\`}
                />
              )}
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
};

// Usage Examples
const steps = [
  { id: '1', label: 'Account', status: 'complete' },
  { id: '2', label: 'Profile', status: 'current', description: 'This is the current step' },
  { id: '3', label: 'Review', status: 'upcoming' }
];

<Steps steps={steps} />`} />
          </div>
        );
      
      case 'breadcrumb':
        return (
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Breadcrumb Component</h2>
            <div className="mb-6">
              <Breadcrumb items={breadcrumbItems} />
            </div>
            <h3 className="text-lg font-medium mb-3">Component Code:</h3>
            <CodeBlock code={`// TypeScript Interface
interface BreadcrumbItem {
  label: string;
  href?: string;
  active?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  separator?: string;
  className?: string;
}

// Component Implementation
const Breadcrumb = ({ items, separator = "/", className = '' }: BreadcrumbProps) => {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex items-center space-x-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && <span className="mx-2 text-gray-400">{separator}</span>}
            {item.href ? (
              <a
                href={item.href}
                className={\`text-sm \${item.active
                  ? "text-gray-900 font-medium"
                  : "text-gray-500 hover:text-gray-700"
                }\`}
              >
                {item.label}
              </a>
            ) : (
              <span
                className={\`text-sm \${item.active
                  ? "text-gray-900 font-medium"
                  : "text-gray-500"
                }\`}
              >
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

// Usage Examples
const breadcrumbItems = [
  { label: 'Home', href: '/' },
  { label: 'Components', href: '/components' },
  { label: 'Button', active: true }
];

<Breadcrumb items={breadcrumbItems} />`} />
          </div>
        );
      
      case 'skeleton':
        return (
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Skeleton Component</h2>
            <div className="space-y-4 w-full max-w-md mb-6">
              <Skeleton variant="text" width="100%" height="20px" />
              <Skeleton variant="text" width="80%" height="20px" />
              <Skeleton variant="rectangular" width="200px" height="100px" />
              <div className="flex gap-4">
                <Skeleton variant="circular" width="40px" height="40px" />
                <div className="flex-1 space-y-2">
                  <Skeleton variant="text" width="60%" height="16px" />
                  <Skeleton variant="text" width="40%" height="16px" />
                </div>
              </div>
            </div>
            <h3 className="text-lg font-medium mb-3">Component Code:</h3>
            <CodeBlock code={`// TypeScript Interface
interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'rectangular' | 'circular';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

// Component Implementation
const Skeleton = ({ 
  className = '', 
  variant = 'text', 
  width, 
  height, 
  animation = 'pulse' 
}: SkeletonProps) => {
  const variants = {
    text: "rounded",
    rectangular: "rounded-md",
    circular: "rounded-full"
  };

  const animations = {
    pulse: "animate-pulse",
    wave: "animate-shimmer",
    none: ""
  };

  return (
    <div
      className={\`bg-gray-200 \${variants[variant]} \${animations[animation]} \${className}\`}
      style={{ width, height }}
    />
  );
};

// Usage Examples
<Skeleton variant="text" width="100%" height="20px" />
<Skeleton variant="text" width="80%" height="20px" />
<Skeleton variant="rectangular" width="200px" height="100px" />
<div className="flex gap-4">
  <Skeleton variant="circular" width="40px" height="40px" />
  <div className="flex-1 space-y-2">
    <Skeleton variant="text" width="60%" height="16px" />
    <Skeleton variant="text" width="40%" height="16px" />
  </div>
</div>`} />
          </div>
        );
      
      case 'empty':
        return (
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Empty State Component</h2>
            <div className="mb-6">
              <EmptyState
                icon={<span className="text-4xl">📭</span>}
                title="No data found"
                description="Try adjusting your search or filter criteria"
                action={<Button variant="outline">Clear Filters</Button>}
              />
            </div>
            <h3 className="text-lg font-medium mb-3">Component Code:</h3>
            <CodeBlock code={`// TypeScript Interface
interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

// Component Implementation
const EmptyState = ({ icon, title, description, action, className = '' }: EmptyStateProps) => {
  return (
    <div className={\`text-center py-12 \${className}\`}>
      {icon && <div className="mx-auto h-12 w-12 text-gray-400 mb-4">{icon}</div>}
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      {description && <p className="text-gray-500 mb-6">{description}</p>}
      {action}
    </div>
  );
};

// Usage Examples
<EmptyState
  icon={<span className="text-4xl">📭</span>}
  title="No data found"
  description="Try adjusting your search or filter criteria"
  action={<Button variant="outline">Clear Filters</Button>}
/>`} />
          </div>
        );
      
      case 'accordion':
        return (
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Accordion Component</h2>
            <div className="mb-6 max-w-2xl">
              <Accordion 
                items={accordionItems}
                defaultOpen={accordionOpen}
              />
            </div>
            <h3 className="text-lg font-medium mb-3">Component Code:</h3>
            <CodeBlock code={`// TypeScript Interface
interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
  disabled?: boolean;
}

interface AccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
  defaultOpen?: string[];
  className?: string;
}

// Component Implementation
const Accordion = ({ items, allowMultiple = false, defaultOpen = [], className = '' }: AccordionProps) => {
  const [openItems, setOpenItems] = useState<string[]>(defaultOpen);

  const toggleItem = (id: string) => {
    if (allowMultiple) {
      setOpenItems(prev =>
        prev.includes(id)
          ? prev.filter(item => item !== id)
          : [...prev, id]
      );
    } else {
      setOpenItems(prev =>
        prev.includes(id) ? [] : [id]
      );
    }
  };

  return (
    <div className={\`space-y-2 \${className}\`}>
      {items.map((item) => (
        <div key={item.id} className="border border-gray-200 rounded-lg">
          <button
            onClick={() => !item.disabled && toggleItem(item.id)}
            disabled={item.disabled}
            className={\`w-full px-4 py-3 text-left flex items-center justify-between \${item.disabled ? 'text-gray-400 cursor-not-allowed' : 'text-gray-900 hover:bg-gray-50'}\`}
          >
            <span className="font-medium">{item.title}</span>
            <span
              className={\`h-5 w-5 transform transition-transform \${openItems.includes(item.id) ? 'rotate-180' : ''}\`}
            >
              ▼
            </span>
          </button>
          {openItems.includes(item.id) && (
            <div className="px-4 py-3 border-t border-gray-200">
              {item.content}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// Usage Examples
const accordionItems = [
  {
    id: '1',
    title: 'What is your return policy?',
    content: 'We offer a 30-day return policy for all unused items in original packaging.'
  },
  {
    id: '2',
    title: 'How long does shipping take?',
    content: 'Standard shipping typically takes 5-7 business days.'
  },
  {
    id: '3',
    title: 'Do you offer international shipping?',
    content: 'Yes, we ship to over 50 countries worldwide.'
  }
];

<Accordion 
  items={accordionItems}
  defaultOpen={['1']}
/>`} />
          </div>
        );
      
      case 'select':
        return (
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Select Component</h2>
            <div className="space-y-4 w-full max-w-sm mb-6">
              <Select 
                label="Country"
                options={selectOptions}
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
              />
              <Select 
                label="Category"
                options={[
                  { value: '', label: 'Select a category' },
                  { value: 'tech', label: 'Technology' },
                  { value: 'design', label: 'Design' },
                  { value: 'business', label: 'Business' }
                ]}
                helperText="Choose the most relevant category"
              />
            </div>
            <h3 className="text-lg font-medium mb-3">Component Code:</h3>
            <CodeBlock code={`// TypeScript Interface
interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: SelectOption[];
  helperText?: string;
}

// Component Implementation
const Select = ({ label, error, options, helperText, className = '', ...props }: SelectProps) => {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium mb-2 text-gray-700">{label}</label>}
      <select
        className={\`
          w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors
          \${error ? 'border-red-500 focus:ring-red-500' : ''}
          \${className}
        \`}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value} disabled={option.disabled}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <div className="mt-1 text-sm text-red-600">{error}</div>}
      {helperText && !error && <div className="mt-1 text-sm text-gray-500">{helperText}</div>}
    </div>
  );
};

// Usage Examples
const [selectedCountry, setSelectedCountry] = useState('us');

<Select 
  label="Country"
  options={[
    { value: 'us', label: 'United States' },
    { value: 'ca', label: 'Canada' },
    { value: 'uk', label: 'United Kingdom' }
  ]}
  value={selectedCountry}
  onChange={(e) => setSelectedCountry(e.target.value)}
/>`} />
          </div>
        );
      
      case 'textarea':
        return (
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Textarea Component</h2>
            <div className="space-y-4 w-full max-w-sm mb-6">
              <Textarea
                label="Message"
                placeholder="Enter your message here..."
                rows={4}
                helperText="Maximum 500 characters"
              />
              <Textarea
                label="Description"
                placeholder="Provide a detailed description..."
                rows={6}
                resize="vertical"
              />
            </div>
            <h3 className="text-lg font-medium mb-3">Component Code:</h3>
            <CodeBlock code={`// TypeScript Interface
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  resize?: 'none' | 'both' | 'horizontal' | 'vertical';
}

// Component Implementation
const Textarea = ({ label, error, helperText, resize = 'vertical', className = '', ...props }: TextareaProps) => {
  const resizeClasses = {
    none: 'resize-none',
    both: 'resize',
    horizontal: 'resize-x',
    vertical: 'resize-y'
  };

  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium mb-2 text-gray-700">{label}</label>}
      <textarea
        className={\`
          w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors
          \${error ? 'border-red-500 focus:ring-red-500' : ''}
          \${resizeClasses[resize]}
          \${className}
        \`}
        {...props}
      />
      {error && <div className="mt-1 text-sm text-red-600">{error}</div>}
      {helperText && !error && <div className="mt-1 text-sm text-gray-500">{helperText}</div>}
    </div>
  );
};

// Usage Examples
<Textarea
  label="Message"
  placeholder="Enter your message here..."
  rows={4}
  helperText="Maximum 500 characters"
/>
<Textarea
  label="Description"
  placeholder="Provide a detailed description..."
  rows={6}
  resize="vertical"
/>`} />
          </div>
        );
      
      case 'checkbox':
        return (
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Checkbox Component</h2>
            <div className="space-y-4 w-full max-w-sm mb-6">
              <Checkbox
                id="terms"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                label="I agree to the terms and conditions"
                helperText="You must agree to continue"
              />
              <Checkbox
                id="newsletter"
                label="Subscribe to newsletter"
                helperText="Get updates about new features"
              />
              <Checkbox
                id="indeterminate"
                indeterminate
                label="Select all items"
              />
            </div>
            <h3 className="text-lg font-medium mb-3">Component Code:</h3>
            <CodeBlock code={`// TypeScript Interface
interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  indeterminate?: boolean;
}

// Component Implementation
const Checkbox = ({ label, error, helperText, indeterminate = false, className = '', ...props }: CheckboxProps) => {
  const checkboxRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  return (
    <div className={className}>
      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            ref={checkboxRef}
            type="checkbox"
            className={\`
              h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500
              \${error ? 'border-red-500' : ''}
            \`}
            {...props}
          />
        </div>
        {label && (
          <div className="ml-3 text-sm">
            <label htmlFor={props.id} className="font-medium text-gray-700">
              {label}
            </label>
            {helperText && <p className="text-gray-500">{helperText}</p>}
          </div>
        )}
      </div>
      {error && <div className="mt-1 text-sm text-red-600">{error}</div>}
    </div>
  );
};

// Usage Examples
const [termsAccepted, setTermsAccepted] = useState(false);

<Checkbox
  id="terms"
  checked={termsAccepted}
  onChange={(e) => setTermsAccepted(e.target.checked)}
  label="I agree to the terms and conditions"
  helperText="You must agree to continue"
/>
<Checkbox
  id="newsletter"
  label="Subscribe to newsletter"
  helperText="Get updates about new features"
/>
<Checkbox
  id="indeterminate"
  indeterminate
  label="Select all items"
/>`} />
          </div>
        );
      
      case 'radio':
        return (
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Radio Component</h2>
            <div className="space-y-4 w-full max-w-sm mb-6">
              <Radio
                name="payment"
                label="Payment Method"
                options={radioOptions}
                value={paymentMethod}
                onChange={setPaymentMethod}
              />
            </div>
            <h3 className="text-lg font-medium mb-3">Component Code:</h3>
            <CodeBlock code={`// TypeScript Interface
interface RadioOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface RadioProps {
  name: string;
  options: RadioOption[];
  label?: string;
  error?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

// Component Implementation
const Radio = ({ name, options, label, error, value, onChange, className = '' }: RadioProps) => {
  return (
    <div className={className}>
      {label && <label className="block text-sm font-medium mb-2 text-gray-700">{label}</label>}
      <div className="space-y-2">
        {options.map((option) => (
          <div key={option.value} className="flex items-center">
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange?.(option.value)}
              disabled={option.disabled}
              className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <label className="ml-3 text-sm font-medium text-gray-700">
              {option.label}
            </label>
          </div>
        ))}
      </div>
      {error && <div className="mt-1 text-sm text-red-600">{error}</div>}
    </div>
  );
};

// Usage Examples
const [paymentMethod, setPaymentMethod] = useState('credit');

const radioOptions = [
  { value: 'credit', label: 'Credit Card' },
  { value: 'debit', label: 'Debit Card' },
  { value: 'paypal', label: 'PayPal' }
];

<Radio
  name="payment"
  label="Payment Method"
  options={radioOptions}
  value={paymentMethod}
  onChange={setPaymentMethod}
/>`} />
          </div>
        );
      
      case 'slider':
        return (
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Slider Component</h2>
            <div className="space-y-4 w-full max-w-md mb-6">
              <Slider
                value={sliderValue}
                onChange={setSliderValue}
                min={0}
                max={100}
                showLabel
              />
              <Slider
                value={75}
                onChange={() => {}}
                min={0}
                max={200}
                step={10}
                color="success"
              />
            </div>
            <h3 className="text-lg font-medium mb-3">Component Code:</h3>
            <CodeBlock code={`// TypeScript Interface
interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  showLabel?: boolean;
  className?: string;
}

// Component Implementation
const Slider = ({ 
  value, 
  onChange, 
  min = 0, 
  max = 100, 
  step = 1, 
  disabled = false, 
  showLabel = false,
  className = '' 
}: SliderProps) => {
  return (
    <div className={className}>
      {showLabel && (
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Value</span>
          <span className="text-sm font-medium text-gray-700">{value}</span>
        </div>
      )}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        disabled={disabled}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
      />
    </div>
  );
};

// Usage Examples
const [sliderValue, setSliderValue] = useState(50);

<Slider
  value={sliderValue}
  onChange={setSliderValue}
  min={0}
  max={100}
  showLabel
/>
<Slider
  value={75}
  onChange={() => {}}
  min={0}
  max={200}
  step={10}
  color="success"
/>`} />
          </div>
        );
      
      case 'rating':
        return (
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Rating Component</h2>
            <div className="space-y-4 mb-6">
              <div>
                <p className="text-sm text-gray-600 mb-2">Interactive Rating</p>
                <Rating value={rating} onChange={setRating} max={5} />
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">Readonly Rating</p>
                <Rating value={4} readonly max={5} size="lg" />
              </div>
            </div>
            <h3 className="text-lg font-medium mb-3">Component Code:</h3>
            <CodeBlock code={`// TypeScript Interface
interface RatingProps {
  value: number;
  onChange?: (value: number) => void;
  max?: number;
  readonly?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

// Component Implementation
const Rating = ({ value, onChange, max = 5, readonly = false, size = 'md', className = '' }: RatingProps) => {
  const sizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg"
  };

  return (
    <div className={\`flex items-center gap-1 \${className}\`}>
      {Array.from({ length: max }, (_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => !readonly && onChange?.(i + 1)}
          disabled={readonly}
          className={\`\${sizes[size]} \${readonly ? 'cursor-default' : 'cursor-pointer'} transition-colors\`}
        >
          <span className={\`\${sizes[size]} \${i < value ? 'text-yellow-400' : 'text-gray-300'}\`}>
            ★
          </span>
        </button>
      ))}
    </div>
  );
};

// Usage Examples
const [rating, setRating] = useState(3);

<Rating value={rating} onChange={setRating} max={5} />
<Rating value={4} readonly max={5} size="lg" />`} />
          </div>
        );
      
      case 'upload':
        return (
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Upload Component</h2>
            <div className="mb-6">
              <Upload
                accept="image/*"
                multiple
                onFilesSelected={(files) => console.log('Selected files:', files)}
              />
            </div>
            <h3 className="text-lg font-medium mb-3">Component Code:</h3>
            <CodeBlock code={`// TypeScript Interface
interface UploadProps {
  accept?: string;
  multiple?: boolean;
  onFilesSelected: (files: File[]) => void;
  className?: string;
}

// Component Implementation
const Upload = ({ accept, multiple = false, onFilesSelected, className = '' }: UploadProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    onFilesSelected(files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      onFilesSelected(files);
    }
  };

  return (
    <div
      className={\`border-2 border-dashed rounded-lg p-6 text-center transition-colors \${isDragOver
        ? 'border-blue-500 bg-blue-50'
        : 'border-gray-300 hover:border-gray-400'
      } \${className}\`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="mx-auto h-12 w-12 text-gray-400 mb-4 flex items-center justify-center">
        <span className="text-2xl">📁</span>
      </div>
      <p className="text-sm text-gray-600 mb-2">
        Drag and drop files here, or click to select files
      </p>
      <Button
        variant="outline"
        onClick={() => fileInputRef.current?.click()}
      >
        Select Files
      </Button>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
};

// Usage Examples
<Upload
  accept="image/*"
  multiple
  onFilesSelected={(files) => console.log('Selected files:', files)}
/>`} />
          </div>
        );
      
      case 'divider':
        return (
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Divider Component</h2>
            <div className="space-y-6 mb-6">
              <div>
                <p className="text-sm text-gray-600 mb-2">Simple Divider</p>
                <Divider />
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">Divider with Label</p>
                <Divider label="OR" />
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">Vertical Divider</p>
                <div className="flex items-center gap-4">
                  <span>Left content</span>
                  <Divider orientation="vertical" className="h-8" />
                  <span>Right content</span>
                </div>
              </div>
            </div>
            <h3 className="text-lg font-medium mb-3">Component Code:</h3>
            <CodeBlock code={`// TypeScript Interface
interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  label?: string;
  className?: string;
}

// Component Implementation
const Divider = ({ orientation = 'horizontal', label, className = '' }: DividerProps) => {
  if (orientation === 'vertical') {
    return <div className={\`h-full w-px bg-gray-300 \${className}\`} />;
  }

  if (label) {
    return (
      <div className={\`relative \${className}\`}>
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">{label}</span>
        </div>
      </div>
    );
  }

  return <div className={\`w-full border-t border-gray-300 \${className}\`} />;
};

// Usage Examples
<Divider />
<Divider label="OR" />
<div className="flex items-center gap-4">
  <span>Left content</span>
  <Divider orientation="vertical" className="h-8" />
  <span>Right content</span>
</div>`} />
          </div>
        );
      
      case 'list':
        return (
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">List Component</h2>
            <div className="mb-6 max-w-md">
              <List items={listItems} />
            </div>
            <h3 className="text-lg font-medium mb-3">Component Code:</h3>
            <CodeBlock code={`// TypeScript Interface
interface ListItem {
  id: string;
  title: string;
  description?: string;
  avatar?: React.ReactNode;
  actions?: React.ReactNode;
  onClick?: () => void;
}

interface ListProps {
  items: ListItem[];
  className?: string;
}

// Component Implementation
const List = ({ items, className = '' }: ListProps) => {
  return (
    <div className={\`divide-y divide-gray-200 \${className}\`}>
      {items.map((item) => (
        <div
          key={item.id}
          onClick={item.onClick}
          className={\`p-4 flex items-center justify-between \${item.onClick ? 'cursor-pointer hover:bg-gray-50' : ''}\`}
        >
          <div className="flex items-center gap-3">
            {item.avatar && <div className="flex-shrink-0">{item.avatar}</div>}
            <div>
              <p className="text-sm font-medium text-gray-900">{item.title}</p>
              {item.description && (
                <p className="text-sm text-gray-500">{item.description}</p>
              )}
            </div>
          </div>
          {item.actions && <div className="flex-shrink-0">{item.actions}</div>}
        </div>
      ))}
    </div>
  );
};

// Usage Examples
const listItems = [
  {
    id: '1',
    title: 'John Doe',
    description: 'john@example.com',
    avatar: <Avatar fallback="JD" size="sm" />,
    actions: <Button size="sm">View</Button>
  },
  {
    id: '2',
    title: 'Jane Smith',
    description: 'jane@example.com',
    avatar: <Avatar fallback="JS" size="sm" />,
    actions: <Button size="sm">View</Button>
  }
];

<List items={listItems} />`} />
          </div>
        );
      
      case 'timeline':
        return (
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Timeline Component</h2>
            <div className="mb-6 max-w-md">
              <Timeline items={timelineItems} />
            </div>
            <h3 className="text-lg font-medium mb-3">Component Code:</h3>
            <CodeBlock code={`// TypeScript Interface
interface TimelineItem {
  id: string;
  title: string;
  description?: string;
  date?: string;
  status?: 'complete' | 'current' | 'upcoming';
  icon?: React.ReactNode;
}

interface TimelineProps {
  items: TimelineItem[];
  className?: string;
}

// Component Implementation
const Timeline = ({ items, className = '' }: TimelineProps) => {
  return (
    <div className={\`relative \${className}\`}>
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-300"></div>
      {items.map((item, index) => (
        <div key={item.id} className="relative flex items-start gap-4 pb-8">
          <div
            className={\`relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 \${item.status === 'complete'
              ? 'border-green-500 bg-green-500'
              : item.status === 'current'
              ? 'border-blue-500 bg-white'
              : 'border-gray-300 bg-white'
            }\`}
          >
            {item.status === 'complete' ? (
              <span className="text-white text-xs">✓</span>
            ) : (
              item.icon || (
                <span
                  className={\`h-2 w-2 rounded-full \${item.status === 'current' ? 'bg-blue-500' : 'bg-gray-300'}\`}
                />
              )
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900">{item.title}</p>
            {item.description && (
              <p className="text-sm text-gray-500">{item.description}</p>
            )}
            {item.date && (
              <p className="text-xs text-gray-400 mt-1">{item.date}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

// Usage Examples
const timelineItems = [
  {
    id: '1',
    title: 'Order Placed',
    date: '2024-01-15',
    status: 'complete'
  },
  {
    id: '2',
    title: 'Order Shipped',
    date: '2024-01-16',
    status: 'current'
  },
  {
    id: '3',
    title: 'Order Delivered',
    status: 'upcoming'
  }
];

<Timeline items={timelineItems} />`} />
          </div>
        );
      
      case 'tag':
        return (
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Tag Component</h2>
            <div className="flex gap-2 flex-wrap mb-6">
              <Tag color="primary">React</Tag>
              <Tag color="success" removable onRemove={() => console.log('removed')}>TypeScript</Tag>
              <Tag color="warning">Beta</Tag>
              <Tag color="error">Deprecated</Tag>
              <Tag color="info">New</Tag>
            </div>
            <h3 className="text-lg font-medium mb-3">Component Code:</h3>
            <CodeBlock code={`// TypeScript Interface
interface TagProps {
  children: React.ReactNode;
  color?: Color;
  removable?: boolean;
  onRemove?: () => void;
  className?: string;
}

// Component Implementation
const Tag = ({ children, color = 'primary', removable = false, onRemove, className = '' }: TagProps) => {
  const colors = {
    primary: "bg-blue-100 text-blue-800",
    secondary: "bg-gray-100 text-gray-800",
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    error: "bg-red-100 text-red-800",
    info: "bg-cyan-100 text-cyan-800"
  };

  return (
    <span className={\`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium \${colors[color]} \${className}\`}>
      {children}
      {removable && (
        <button
          onClick={onRemove}
          className="hover:bg-black hover:bg-opacity-10 rounded-full p-0.5"
        >
          <span className="text-xs">×</span>
        </button>
      )}
    </span>
  );
};

// Usage Examples
<Tag color="primary">React</Tag>
<Tag color="success" removable onRemove={() => console.log('removed')}>TypeScript</Tag>
<Tag color="warning">Beta</Tag>
<Tag color="error">Deprecated</Tag>
<Tag color="info">New</Tag>`} />
          </div>
        );
      
      case 'notification':
        return (
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Notification Component</h2>
            <div className="space-y-4 mb-6 max-w-md">
              <Notification
                title="Success!"
                message="Your changes have been saved."
                type="success"
                duration={0}
              />
              <Notification
                title="Warning"
                message="Please review your input."
                type="warning"
                duration={0}
              />
              <Notification
                title="Error"
                message="Something went wrong. Please try again."
                type="error"
                duration={0}
              />
            </div>
            <h3 className="text-lg font-medium mb-3">Component Code:</h3>
            <CodeBlock code={`// TypeScript Interface
interface NotificationProps {
  title: string;
  message?: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  onClose?: () => void;
  duration?: number;
  className?: string;
}

// Component Implementation
const Notification = ({ title, message, type = 'info', onClose, duration = 5000, className = '' }: NotificationProps) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const types = {
    info: "bg-blue-50 border-blue-200 text-blue-800",
    success: "bg-green-50 border-green-200 text-green-800",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
    error: "bg-red-50 border-red-200 text-red-800"
  };

  const icons = {
    info: <span className="text-blue-500">ℹ️</span>,
    success: <span className="text-green-500">✓</span>,
    warning: <span className="text-yellow-500">⚠️</span>,
    error: <span className="text-red-500">✕</span>
  };

  return (
    <div className={\`border rounded-lg p-4 \${types[type]} \${className}\`}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">{icons[type]}</div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium">{title}</p>
          {message && <p className="text-sm mt-1">{message}</p>}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600"
          >
            <span className="text-sm">×</span>
          </button>
        )}
      </div>
    </div>
  );
};

// Usage Examples
<Notification
  title="Success!"
  message="Your changes have been saved."
  type="success"
  duration={0}
/>
<Notification
  title="Warning"
  message="Please review your input."
  type="warning"
  duration={0}
/>
<Notification
  title="Error"
  message="Something went wrong. Please try again."
  type="error"
  duration={0}
/>`} />
          </div>
        );
      
      case 'spinner':
        return (
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Spinner Component</h2>
            <div className="flex gap-4 items-center mb-6">
              <Spinner size="sm" color="primary" />
              <Spinner size="md" color="success" />
              <Spinner size="lg" color="warning" />
              <Spinner size="xl" color="error" />
            </div>
            <h3 className="text-lg font-medium mb-3">Component Code:</h3>
            <CodeBlock code={`// TypeScript Interface
interface SpinnerProps {
  size?: Size;
  color?: Color;
  className?: string;
}

// Component Implementation
const Spinner = ({ size = 'md', color = 'primary', className = '' }: SpinnerProps) => {
  const sizes = {
    xs: "h-4 w-4",
    sm: "h-5 w-5",
    md: "h-6 w-6",
    lg: "h-8 w-8",
    xl: "h-12 w-12"
  };

  const colors = {
    primary: "text-blue-600",
    secondary: "text-gray-600",
    success: "text-green-600",
    warning: "text-yellow-500",
    error: "text-red-600",
    info: "text-cyan-600"
  };

  return (
    <div className={\`animate-spin \${sizes[size]} \${colors[color]} \${className}\`}>
      <span className="block h-full w-full rounded-full border-2 border-current border-t-transparent"></span>
    </div>
  );
};

// Usage Examples
<Spinner size="sm" color="primary" />
<Spinner size="md" color="success" />
<Spinner size="lg" color="warning" />
<Spinner size="xl" color="error" />`} />
          </div>
        );
      
      case 'calendar':
        return (
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Calendar Component</h2>
            <div className="mb-6 max-w-md">
              <Calendar
                selectedDate={selectedDate}
                onDateSelect={setSelectedDate}
              />
            </div>
            <h3 className="text-lg font-medium mb-3">Component Code:</h3>
            <CodeBlock code={`// TypeScript Interface
interface CalendarProps {
  selectedDate?: Date;
  onDateSelect?: (date: Date) => void;
  className?: string;
}

// Component Implementation
const Calendar = ({ selectedDate = new Date(), onDateSelect, className = '' }: CalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1));
  
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
  
  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };
  
  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };
  
  const handleDateClick = (day: number) => {
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    onDateSelect?.(newDate);
  };
  
  const renderDays = () => {
    const days = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    // Add day names
    dayNames.forEach(day => {
      days.push(
        <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
          {day}
        </div>
      );
    });
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={\`empty-\${i}\`} className="h-8"></div>);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected = 
        selectedDate.getDate() === day &&
        selectedDate.getMonth() === currentMonth.getMonth() &&
        selectedDate.getFullYear() === currentMonth.getFullYear();
      
      days.push(
        <button
          key={day}
          onClick={() => handleDateClick(day)}
          className={\`h-8 rounded-full text-sm \${isSelected
            ? 'bg-blue-600 text-white'
            : 'text-gray-700 hover:bg-gray-100'
          }\`}
        >
          {day}
        </button>
      );
    }
    
    return days;
  };
  
  return (
    <div className={\`bg-white rounded-lg shadow p-4 \${className}\`}>
      <div className="flex items-center justify-between mb-4">
        <button onClick={handlePrevMonth} className="p-1 rounded hover:bg-gray-100">
          <span>←</span>
        </button>
        <h3 className="text-lg font-medium">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h3>
        <button onClick={handleNextMonth} className="p-1 rounded hover:bg-gray-100">
          <span>→</span>
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {renderDays()}
      </div>
    </div>
  );
};

// Usage Examples
const [selectedDate, setSelectedDate] = useState(new Date());

<Calendar
  selectedDate={selectedDate}
  onDateSelect={setSelectedDate}
/>`} />
          </div>
        );
      
      case 'datepicker':
        return (
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Date Picker Component</h2>
            <div className="space-y-4 w-full max-w-sm mb-6">
              <DatePicker
                value={selectedDate}
                onChange={setSelectedDate}
                label="Select Date"
                helperText="Choose a date for your appointment"
              />
            </div>
            <h3 className="text-lg font-medium mb-3">Component Code:</h3>
            <CodeBlock code={`// TypeScript Interface
interface DatePickerProps {
  value?: Date;
  onChange?: (date: Date) => void;
  label?: string;
  error?: string;
  helperText?: string;
  className?: string;
}

// Component Implementation
const DatePicker = ({ value = new Date(), onChange, label, error, helperText, className = '' }: DatePickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(value);
  
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    onChange?.(date);
    setIsOpen(false);
  };
  
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };
  
  return (
    <div className={\`relative \${className}\`}>
      {label && <label className="block text-sm font-medium mb-2 text-gray-700">{label}</label>}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={\`w-full px-3 py-2 border rounded-lg text-left \${error ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500\`}
      >
        {formatDate(selectedDate)}
      </button>
      {error && <div className="mt-1 text-sm text-red-600">{error}</div>}
      {helperText && !error && <div className="mt-1 text-sm text-gray-500">{helperText}</div>}
      
      {isOpen && (
        <div className="absolute z-10 mt-1">
          <Calendar
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
          />
        </div>
      )}
    </div>
  );
};

// Usage Examples
const [selectedDate, setSelectedDate] = useState(new Date());

<DatePicker
  value={selectedDate}
  onChange={setSelectedDate}
  label="Select Date"
  helperText="Choose a date for your appointment"
/>`} />
          </div>
        );
      
      case 'carousel':
        return (
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Carousel Component</h2>
            <div className="mb-6">
              <Carousel autoPlay={true} interval={5000}>
                <div className="bg-blue-500 h-64 flex items-center justify-center text-white text-2xl">Slide 1</div>
                <div className="bg-green-500 h-64 flex items-center justify-center text-white text-2xl">Slide 2</div>
                <div className="bg-purple-500 h-64 flex items-center justify-center text-white text-2xl">Slide 3</div>
              </Carousel>
            </div>
            <h3 className="text-lg font-medium mb-3">Component Code:</h3>
            <CodeBlock code={`// TypeScript Interface
interface CarouselProps {
  children: React.ReactNode[];
  autoPlay?: boolean;
  interval?: number;
  showIndicators?: boolean;
  className?: string;
}

// Component Implementation
const Carousel = ({ 
  children, 
  autoPlay = false, 
  interval = 3000, 
  showIndicators = true,
  className = '' 
}: CarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  useEffect(() => {
    if (!autoPlay) return;
    
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % children.length);
    }, interval);
    
    return () => clearInterval(timer);
  }, [autoPlay, interval, children.length]);
  
  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };
  
  const goToPrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + children.length) % children.length);
  };
  
  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % children.length);
  };
  
  return (
    <div className={\`relative \${className}\`}>
      <div className="overflow-hidden">
        <div 
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: \`translateX(-\${currentIndex * 100}%)\` }}
        >
          {children.map((child, index) => (
            <div key={index} className="w-full flex-shrink-0">
              {child}
            </div>
          ))}
        </div>
      </div>
      
      <button
        onClick={goToPrev}
        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 rounded-full p-2 hover:bg-opacity-75"
      >
        <span>←</span>
      </button>
      
      <button
        onClick={goToNext}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 rounded-full p-2 hover:bg-opacity-75"
      >
        <span>→</span>
      </button>
      
      {showIndicators && (
        <div className="flex justify-center mt-4 space-x-2">
          {children.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={\`w-2 h-2 rounded-full \${index === currentIndex ? 'bg-blue-600' : 'bg-gray-300'}\`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Usage Examples
<Carousel autoPlay={true} interval={5000}>
  <div className="bg-blue-500 h-64 flex items-center justify-center text-white text-2xl">Slide 1</div>
  <div className="bg-green-500 h-64 flex items-center justify-center text-white text-2xl">Slide 2</div>
  <div className="bg-purple-500 h-64 flex items-center justify-center text-white text-2xl">Slide 3</div>
</Carousel>`} />
          </div>
        );
      
      case 'kpicard':
        return (
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">KPI Card Component</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <KpiCard
                title="Total Revenue"
                value="$45,231"
                change={{ value: "12.5%", type: "increase" }}
                icon={<span>💰</span>}
              />
              <KpiCard
                title="Active Users"
                value="2,543"
                change={{ value: "8.2%", type: "increase" }}
                icon={<span>👥</span>}
              />
              <KpiCard
                title="Conversion Rate"
                value="3.2%"
                change={{ value: "2.1%", type: "decrease" }}
                icon={<span>📈</span>}
              />
            </div>
            <h3 className="text-lg font-medium mb-3">Component Code:</h3>
            <CodeBlock code={`// TypeScript Interface
interface KpiCardProps {
  title: string;
  value: string | number;
  change?: {
    value: string;
    type: 'increase' | 'decrease';
  };
  icon?: React.ReactNode;
  className?: string;
}

// Component Implementation
const KpiCard = ({ title, value, change, icon, className = '' }: KpiCardProps) => {
  return (
    <div className={\`bg-white rounded-xl shadow-sm p-6 \${className}\`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-semibold text-gray-900 mt-1">{value}</p>
          {change && (
            <p className={\`text-sm mt-2 \${change.type === 'increase' ? 'text-green-600' : 'text-red-600'}\`}>
              {change.type === 'increase' ? '↑' : '↓'} {change.value}
            </p>
          )}
        </div>
        {icon && (
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
              {icon}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Usage Examples
<KpiCard
  title="Total Revenue"
  value="$45,231"
  change={{ value: "12.5%", type: "increase" }}
  icon={<span>💰</span>}
/>
<KpiCard
  title="Active Users"
  value="2,543"
  change={{ value: "8.2%", type: "increase" }}
  icon={<span>👥</span>}
/>
<KpiCard
  title="Conversion Rate"
  value="3.2%"
  change={{ value: "2.1%", type: "decrease" }}
  icon={<span>📈</span}/>
/>`} />
          </div>
        );
      
      case 'meter':
        return (
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Meter Component</h2>
            <div className="space-y-4 w-full max-w-md mb-6">
              <Meter
                value={65}
                max={100}
                min={0}
                low={25}
                high={75}
                optimum={50}
                showLabel
              />
              <Meter
                value={30}
                max={100}
                min={0}
                color="success"
                size="lg"
              />
            </div>
            <h3 className="text-lg font-medium mb-3">Component Code:</h3>
            <CodeBlock code={`// TypeScript Interface
interface MeterProps {
  value: number;
  max?: number;
  min?: number;
  low?: number;
  high?: number;
  optimum?: number;
  size?: 'sm' | 'md' | 'lg';
  color?: Color;
  showLabel?: boolean;
  className?: string;
}

// Component Implementation
const Meter = ({ 
  value, 
  max = 100, 
  min = 0, 
  low, 
  high, 
  optimum, 
  size = 'md', 
  color = 'primary', 
  showLabel = false, 
  className = '' 
}: MeterProps) => {
  const percentage = ((value - min) / (max - min)) * 100;
  
  const sizes = {
    sm: "h-2",
    md: "h-4",
    lg: "h-6"
  };

  const colors = {
    primary: "bg-blue-600",
    secondary: "bg-gray-600",
    success: "bg-green-600",
    warning: "bg-yellow-500",
    error: "bg-red-600",
    info: "bg-cyan-600"
  };

  return (
    <div className={className}>
      {showLabel && (
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium text-gray-700">Value</span>
          <span className="text-sm font-medium text-gray-700">{value}</span>
        </div>
      )}
      <div className={\`w-full bg-gray-200 rounded-full \${sizes[size]}\`}>
        <div
          className={\`\${colors[color]} \${sizes[size]} rounded-full\`}
          style={{ width: \`\${percentage}%\` }}
        ></div>
      </div>
    </div>
  );
};

// Usage Examples
<Meter
  value={65}
  max={100}
  min={0}
  low={25}
  high={75}
  optimum={50}
  showLabel
/>
<Meter
  value={30}
  max={100}
  min={0}
  color="success"
  size="lg"
/>`} />
          </div>
        );
      
      case 'statistic':
        return (
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Statistic Component</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Statistic
                title="Total Sales"
                value={1234567}
                prefix="$"
                precision={2}
              />
              <Statistic
                title="Growth Rate"
                value={23.5}
                suffix="%"
                precision={1}
              />
              <Statistic
                title="Active Now"
                value={892}
              />
            </div>
            <h3 className="text-lg font-medium mb-3">Component Code:</h3>
            <CodeBlock code={`// TypeScript Interface
interface StatisticProps {
  title: string;
  value: string | number;
  prefix?: string;
  suffix?: string;
  precision?: number;
  className?: string;
}

// Component Implementation
const Statistic = ({ title, value, prefix, suffix, precision, className = '' }: StatisticProps) => {
  const formatValue = (val: string | number) => {
    if (typeof val === 'number' && precision !== undefined) {
      return val.toFixed(precision);
    }
    return val.toString();
  };

  return (
    <div className={\`text-center \${className}\`}>
      <div className="text-3xl font-bold text-gray-900">
        {prefix}{formatValue(value)}{suffix}
      </div>
      <div className="text-sm text-gray-500 mt-1">{title}</div>
    </div>
  );
};

// Usage Examples
<Statistic
  title="Total Sales"
  value={1234567}
  prefix="$"
  precision={2}
/>
<Statistic
  title="Growth Rate"
  value={23.5}
  suffix="%"
  precision={1}
/>
<Statistic
  title="Active Now"
  value={892}
/>`} />
          </div>
        );
      
      case 'form':
        return (
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Form Component</h2>
            <div className="mb-6 max-w-md">
              <Form onSubmit={(e) => {
                e.preventDefault();
                console.log('Form submitted');
              }}>
                <FormField label="Name" required>
                  <Input placeholder="Enter your name" />
                </FormField>
                <FormField label="Email" required>
                  <Input type="email" placeholder="Enter your email" />
                </FormField>
                <Button type="submit">Submit</Button>
              </Form>
            </div>
            <h3 className="text-lg font-medium mb-3">Component Code:</h3>
            <CodeBlock code={FormComponentCode} />
          </div>
        );
      
      case 'formfield':
        return (
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Form Field Component</h2>
            <div className="space-y-4 w-full max-w-sm mb-6">
              <FormField label="Name" required error="This field is required">
                <Input placeholder="Enter your name" />
              </FormField>
              <FormField label="Email" helperText="We'll never share your email">
                <Input type="email" placeholder="Enter your email" />
              </FormField>
            </div>
            <h3 className="text-lg font-medium mb-3">Component Code:</h3>
            <CodeBlock code={`// TypeScript Interface
interface FormFieldProps {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

// Component Implementation
const FormField = ({ label, error, helperText, required, children, className = '' }: FormFieldProps) => {
  return (
    <div className={\`mb-4 \${className}\`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      {children}
      {error && <div className="mt-1 text-sm text-red-600">{error}</div>}
      {helperText && !error && <div className="mt-1 text-sm text-gray-500">{helperText}</div>}
    </div>
  );
};

// Usage Examples
<FormField label="Name" required error="This field is required">
  <Input placeholder="Enter your name" />
</FormField>
<FormField label="Email" helperText="We'll never share your email">
  <Input type="email" placeholder="Enter your email" />
</FormField>`} />
          </div>
        );
      
      case 'formgroup':
        return (
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Form Group Component</h2>
            <div className="mb-6 max-w-md">
              <Form>
                <FormGroup title="Personal Information" description="Please provide your personal details">
                  <FormField label="First Name" required>
                    <Input placeholder="Enter your first name" />
                  </FormField>
                  <FormField label="Last Name" required>
                    <Input placeholder="Enter your last name" />
                  </FormField>
                </FormGroup>
                <FormGroup title="Contact Information">
                  <FormField label="Email" required>
                    <Input type="email" placeholder="Enter your email" />
                  </FormField>
                  <FormField label="Phone">
                    <Input placeholder="Enter your phone number" />
                  </FormField>
                </FormGroup>
                <Button type="submit">Submit</Button>
              </Form>
            </div>
            <h3 className="text-lg font-medium mb-3">Component Code:</h3>
            <CodeBlock code={`// TypeScript Interface
interface FormGroupProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

// Component Implementation
const FormGroup = ({ title, description, children, className = '' }: FormGroupProps) => {
  return (
    <div className={\`mb-6 \${className}\`}>
      {title && <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>}
      {description && <p className="text-sm text-gray-500 mb-4">{description}</p>}
      {children}
    </div>
  );
};

// Usage Examples
<FormGroup title="Personal Information" description="Please provide your personal details">
  <FormField label="First Name" required>
    <Input placeholder="Enter your first name" />
  </FormField>
  <FormField label="Last Name" required>
    <Input placeholder="Enter your last name" />
  </FormField>
</FormGroup>
<FormGroup title="Contact Information">
  <FormField label="Email" required>
    <Input type="email" placeholder="Enter your email" />
  </FormField>
  <FormField label="Phone">
    <Input placeholder="Enter your phone number" />
  </FormField>
</FormGroup>`} />
          </div>
        );
      
      case 'actionsheet':
        return (
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Action Sheet Component</h2>
            <div className="mb-6">
              <Button onClick={() => setIsModalOpen(true)}>Open Action Sheet</Button>
            </div>
            <h3 className="text-lg font-medium mb-3">Component Code:</h3>
            <CodeBlock code={`// TypeScript Interface
interface ActionSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

// Component Implementation
const ActionSheet = ({ isOpen, onClose, title, children, className = '' }: ActionSheetProps) => {
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
      <div className="flex min-h-screen items-end justify-center">
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} />
        <div className={\`relative w-full max-w-lg transform rounded-t-xl bg-white p-6 transition-all \${className}\`}>
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
const [isActionSheetOpen, setIsActionSheetOpen] = useState(false);

<Button onClick={() => setIsActionSheetOpen(true)}>Open Action Sheet</Button>
<ActionSheet 
  isOpen={isActionSheetOpen} 
  onClose={() => setIsActionSheetOpen(false)} 
  title="Action Sheet"
>
  <div className="space-y-2">
    <button className="w-full text-left px-4 py-3 hover:bg-gray-100 rounded-lg">Option 1</button>
    <button className="w-full text-left px-4 py-3 hover:bg-gray-100 rounded-lg">Option 2</button>
    <button className="w-full text-left px-4 py-3 hover:bg-gray-100 rounded-lg text-red-600">Delete</button>
  </div>
</ActionSheet>`} />
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
      
      case 'popup':
        return (
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Popup Component</h2>
            <div className="mb-6">
              <Button onClick={() => setIsModalOpen(true)}>Open Popup</Button>
            </div>
            <h3 className="text-lg font-medium mb-3">Component Code:</h3>
            <CodeBlock code={`// TypeScript Interface
interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  position?: 'center' | 'top' | 'bottom';
  className?: string;
}

// Component Implementation
const Popup = ({ isOpen, onClose, title, children, position = 'center', className = '' }: PopupProps) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const positions = {
    center: "flex items-center justify-center",
    top: "flex items-start justify-center pt-10",
    bottom: "flex items-end justify-center pb-10"
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className={\`min-h-screen \${positions[position]} p-4\`}>
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} />
        <div className={\`relative max-w-lg w-full transform rounded-xl bg-white p-6 transition-all shadow-xl \${className}\`}>
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
const [isPopupOpen, setIsPopupOpen] = useState(false);

<Button onClick={() => setIsPopupOpen(true)}>Open Popup</Button>
<Popup 
  isOpen={isPopupOpen} 
  onClose={() => setIsPopupOpen(false)} 
  title="Popup Title"
>
  <p className="text-gray-700 mb-4">This is the content of the popup.</p>
  <div className="flex justify-end gap-2">
    <Button variant="outline" onClick={() => setIsPopupOpen(false)}>Cancel</Button>
    <Button onClick={() => setIsPopupOpen(false)}>Confirm</Button>
  </div>
</Popup>`} />
          </div>
        );
      
      case 'collapse':
        return (
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Collapse Component</h2>
            <div className="mb-6 max-w-md">
              <Button onClick={() => setAccordionOpen(accordionOpen.includes('1') ? [] : ['1'])}>
                Toggle Collapse
              </Button>
              <Collapse isOpen={accordionOpen.includes('1')} className="mt-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p>This is the collapsible content. It can be shown or hidden with a button click.</p>
                </div>
              </Collapse>
            </div>
            <h3 className="text-lg font-medium mb-3">Component Code:</h3>
            <CodeBlock code={`// TypeScript Interface
interface CollapseProps {
  isOpen: boolean;
  children: React.ReactNode;
  className?: string;
}

// Component Implementation
const Collapse = ({ isOpen, children, className = '' }: CollapseProps) => {
  const [height, setHeight] = useState<number | undefined>(isOpen ? undefined : 0);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      if (isOpen) {
        setHeight(contentRef.current.scrollHeight);
        setTimeout(() => setHeight(undefined), 300);
      } else {
        setHeight(contentRef.current.scrollHeight);
        setTimeout(() => setHeight(0), 10);
      }
    }
  }, [isOpen]);

  return (
    <div
      ref={contentRef}
      className={\`overflow-hidden transition-all duration-300 ease-in-out \${className}\`}
      style={{ height }}
    >
      {children}
    </div>
  );
};

// Usage Examples
const [isOpen, setIsOpen] = useState(false);

<Button onClick={() => setIsOpen(!isOpen)}>Toggle Collapse</Button>
<Collapse isOpen={isOpen} className="mt-4">
  <div className="p-4 bg-gray-50 rounded-lg">
    <p>This is the collapsible content. It can be shown or hidden with a button click.</p>
  </div>
</Collapse>`} />
          </div>
        );
      
      case 'tree':
        return (
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Tree Component</h2>
            <div className="mb-6 max-w-md">
              <Tree 
                data={treeData} 
                onSelect={(node) => console.log('Selected:', node)} 
              />
            </div>
            <h3 className="text-lg font-medium mb-3">Component Code:</h3>
            <CodeBlock code={TreeComponentCode} />
          </div>
        );
      
      case 'masonry':
        return (
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Masonry Component</h2>
            <div className="mb-6">
              <Masonry columns={3} gap={16}>
                <div className="bg-blue-100 p-4 rounded-lg">Item 1</div>
                <div className="bg-green-100 p-8 rounded-lg">Item 2</div>
                <div className="bg-yellow-100 p-6 rounded-lg">Item 3</div>
                <div className="bg-red-100 p-4 rounded-lg">Item 4</div>
                <div className="bg-purple-100 p-10 rounded-lg">Item 5</div>
                <div className="bg-pink-100 p-6 rounded-lg">Item 6</div>
              </Masonry>
            </div>
            <h3 className="text-lg font-medium mb-3">Component Code:</h3>
            <CodeBlock code={`// TypeScript Interface
interface MasonryProps {
  columns?: number;
  gap?: number;
  children: React.ReactNode[];
  className?: string;
}

// Component Implementation
const Masonry = ({ columns = 3, gap = 16, children, className = '' }: MasonryProps) => {
  const columnElements = Array.from({ length: columns }, () => [] as React.ReactNode[]);
  
  children.forEach((child, index) => {
    columnElements[index % columns].push(child);
  });

  return (
    <div className={\`flex \${className}\`} style={{ gap: \`\${gap}px\` }}>
      {columnElements.map((column, columnIndex) => (
        <div key={columnIndex} className="flex-1" style={{ display: 'flex', flexDirection: 'column', gap: \`\${gap}px\` }}>
          {column.map((child, childIndex) => (
            <div key={childIndex}>{child}</div>
          ))}
        </div>
      ))}
    </div>
  );
};

// Usage Examples
<Masonry columns={3} gap={16}>
  <div className="bg-blue-100 p-4 rounded-lg">Item 1</div>
  <div className="bg-green-100 p-8 rounded-lg">Item 2</div>
  <div className="bg-yellow-100 p-6 rounded-lg">Item 3</div>
  <div className="bg-red-100 p-4 rounded-lg">Item 4</div>
  <div className="bg-purple-100 p-10 rounded-lg">Item 5</div>
  <div className="bg-pink-100 p-6 rounded-lg">Item 6</div>
</Masonry>`} />
          </div>
        );
      
      case 'image':
        return (
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Image Component</h2>
            <div className="mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Basic Image</p>
                  <Image 
                    src="https://picsum.photos/seed/example1/300/200.jpg" 
                    alt="Example image" 
                    className="rounded-lg w-full"
                  />
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">Image with Fallback</p>
                  <Image 
                    src="https://invalid-url.com/image.jpg" 
                    fallback="https://picsum.photos/seed/fallback/300/200.jpg"
                    alt="Image with fallback" 
                    className="rounded-lg w-full"
                  />
                </div>
              </div>
            </div>
            <h3 className="text-lg font-medium mb-3">Component Code:</h3>
            <CodeBlock code={`// TypeScript Interface
interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallback?: string;
  alt: string;
}

// Component Implementation
const Image = ({ src, fallback, alt, className = '', ...props }: ImageProps) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError && fallback) {
      setImgSrc(fallback);
      setHasError(true);
    }
  };

  return (
    <img
      src={imgSrc}
      alt={alt}
      onError={handleError}
      className={className}
      {...props}
    />
  );
};

// Usage Examples
<Image 
  src="https://picsum.photos/seed/example1/300/200.jpg" 
  alt="Example image" 
  className="rounded-lg w-full"
/>
<Image 
  src="https://invalid-url.com/image.jpg" 
  fallback="https://picsum.photos/seed/fallback/300/200.jpg"
  alt="Image with fallback" 
  className="rounded-lg w-full"
/>`} />
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
      
      case 'navbar':
        return (
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Navbar Component</h2>
            <div className="mb-6">
              <Navbar 
                brand={<div className="text-xl font-bold text-white">YourBrand</div>}
                links={[
                  { label: "Dashboard", href: "#", active: true },
                  { label: "Team", href: "#" },
                  { label: "Projects", href: "#" },
                  { label: "Reports", href: "#" }
                ]}
                actions={
                  <div className="flex space-x-4">
                    <Button variant="ghost" size="sm" className="text-white hover:bg-blue-700">Profile</Button>
                    <Button variant="outline" size="sm" className="border-white text-white hover:bg-white hover:text-blue-600">Sign Out</Button>
                  </div>
                }
              />
            </div>
            <h3 className="text-lg font-medium mb-3">Component Code:</h3>
            <CodeBlock code={NavbarComponentCode} />
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
      
      case 'team':
        return (
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Team Component</h2>
            <div className="mb-6">
              <Team 
                title="Our Team"
                description="Meet the amazing people behind our company"
                members={[
                  {
                    name: "John Doe",
                    role: "CEO & Founder",
                    bio: "John has over 20 years of experience in the industry.",
                    avatar: "https://picsum.photos/seed/john/200/200.jpg",
                    socialLinks: (
                      <>
                        <a href="#" className="text-gray-400 hover:text-gray-500">
                          <span>📘</span>
                        </a>
                        <a href="#" className="text-gray-400 hover:text-gray-500">
                          <span>🐦</span>
                        </a>
                        <a href="#" className="text-gray-400 hover:text-gray-500">
                          <span>💼</span>
                        </a>
                      </>
                    )
                  },
                  {
                    name: "Jane Smith",
                    role: "CTO",
                    bio: "Jane is a technology enthusiast with a passion for innovation.",
                    avatar: "https://picsum.photos/seed/jane/200/200.jpg",
                    socialLinks: (
                      <>
                        <a href="#" className="text-gray-400 hover:text-gray-500">
                          <span>📘</span>
                        </a>
                        <a href="#" className="text-gray-400 hover:text-gray-500">
                          <span>🐦</span>
                        </a>
                        <a href="#" className="text-gray-400 hover:text-gray-500">
                          <span>💼</span>
                        </a>
                      </>
                    )
                  },
                  {
                    name: "Bob Johnson",
                    role: "Head of Design",
                    bio: "Bob brings creative solutions to complex problems.",
                    avatar: "https://picsum.photos/seed/bob/200/200.jpg",
                    socialLinks: (
                      <>
                        <a href="#" className="text-gray-400 hover:text-gray-500">
                          <span>📘</span>
                        </a>
                        <a href="#" className="text-gray-400 hover:text-gray-500">
                          <span>🐦</span>
                        </a>
                        <a href="#" className="text-gray-400 hover:text-gray-500">
                          <span>💼</span>
                        </a>
                      </>
                    )
                  }
                ]}
              />
            </div>
            <h3 className="text-lg font-medium mb-3">Component Code:</h3>
            <CodeBlock code={TeamComponentCode} />
          </div>
        );
      
      case 'cta':
        return (
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">CTA Component</h2>
            <div className="mb-6">
              <Cta 
                title="Ready to get started?"
                description="Join thousands of satisfied customers who are already using our platform."
                primaryAction={<Button variant="solid" color="white" className="text-blue-600">Get Started</Button>}
                secondaryAction={<Button variant="outline" color="white" className="border-white text-white hover:bg-white hover:text-blue-600">Learn More</Button>}
                backgroundImage="https://picsum.photos/seed/cta/1920/1080.jpg"
              />
            </div>
            <h3 className="text-lg font-medium mb-3">Component Code:</h3>
            <CodeBlock code={CtaComponentCode} />
          </div>
        );
      
      case 'faq':
        return (
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">FAQ Component</h2>
            <div className="mb-6">
              <Faq 
                title="Frequently Asked Questions"
                description="Find answers to common questions about our product"
                items={[
                  {
                    question: "How do I get started?",
                    answer: "Getting started is easy. Simply sign up for an account, choose a plan that fits your needs, and follow our onboarding process."
                  },
                  {
                    question: "Can I change my plan later?",
                    answer: "Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle."
                  },
                  {
                    question: "Is my data secure?",
                    answer: "Absolutely. We use industry-standard encryption and security measures to protect your data."
                  }
                ]}
              />
            </div>
            <h3 className="text-lg font-medium mb-3">Component Code:</h3>
            <CodeBlock code={FaqComponentCode} />
          </div>
        );
      
      case 'authcard':
        return (
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Auth Card Component</h2>
            <div className="mb-6 max-w-md mx-auto">
              <AuthCard 
                title="Sign In" 
                subtitle="Welcome back! Please sign in to continue.">
                <Form>
                  <FormField label="Email" required>
                    <Input type="email" placeholder="Enter your email" />
                  </FormField>
                  <FormField label="Password" required>
                    <Input type="password" placeholder="Enter your password" />
                  </FormField>
                  <div className="flex items-center justify-between">
                    <Checkbox id="remember" label="Remember me" />
                    <a href="#" className="text-sm text-blue-600 hover:text-blue-500">Forgot password?</a>
                  </div>
                  <Button type="submit" className="w-full mt-6">Sign In</Button>
                </Form>
                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600">
                    Don't have an account? <a href="#" className="font-medium text-blue-600 hover:text-blue-500">Sign up</a>
                  </p>
                </div>
              </AuthCard>
            </div>
            <h3 className="text-lg font-medium mb-3">Component Code:</h3>
            <CodeBlock code={AuthCardComponentCode} />
          </div>
        );
      
      case 'testimonial':
        return (
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Testimonial Component</h2>
            <div className="mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Testimonial 
                  content="This is the best product I've ever used. It has saved me so much time and effort."
                  author="John Doe"
                  role="CEO at Company"
                  avatar="https://picsum.photos/seed/john/100/100.jpg"
                />
                <Testimonial 
                  content="I can't imagine working without this tool anymore. It's completely transformed our workflow."
                  author="Jane Smith"
                  role="Product Manager"
                  avatar="https://picsum.photos/seed/jane/100/100.jpg"
                />
              </div>
            </div>
            <h3 className="text-lg font-medium mb-3">Component Code:</h3>
            <CodeBlock code={TestimonialComponentCode} />
          </div>
        );
      
      case 'pricingcard':
        return (
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Pricing Card Component</h2>
            <div className="mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <PricingCard 
                  title="Basic"
                  price="$9"
                  period="/month"
                  description="Perfect for individuals"
                  features={[
                    "5 Projects",
                    "2 Team Members",
                    "Basic Analytics",
                    "Email Support"
                  ]}
                  action={<Button variant="outline" color="primary" className="w-full">Get Started</Button>}
                />
                <PricingCard 
                  title="Pro"
                  price="$29"
                  period="/month"
                  description="Perfect for small businesses"
                  features={[
                    "10 Projects",
                    "5 Team Members",
                    "Advanced Analytics",
                    "Priority Support"
                  ]}
                  highlighted={true}
                  action={<Button variant="solid" color="primary" className="w-full">Get Started</Button>}
                />
                <PricingCard 
                  title="Enterprise"
                  price="$99"
                  period="/month"
                  description="Perfect for large organizations"
                  features={[
                    "Unlimited Projects",
                    "Unlimited Team Members",
                    "Advanced Analytics",
                    "24/7 Phone Support"
                  ]}
                  action={<Button variant="outline" color="primary" className="w-full">Contact Sales</Button>}
                />
              </div>
            </div>
            <h3 className="text-lg font-medium mb-3">Component Code:</h3>
            <CodeBlock code={PricingCardComponentCode} />
          </div>
        );
      
      case 'featurecard':
        return (
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Feature Card Component</h2>
            <div className="mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FeatureCard 
                  title="Easy to Use"
                  description="Our intuitive interface makes it easy for anyone to get started in minutes."
                  icon={<span>🎯</span>}
                />
                <FeatureCard 
                  title="Powerful Features"
                  description="All the tools you need to manage your projects efficiently."
                  icon={<span>⚡</span>}
                />
                <FeatureCard 
                  title="Secure & Reliable"
                  description="Your data is safe with our enterprise-grade security."
                  icon={<span>🔒</span>}
                />
              </div>
            </div>
            <h3 className="text-lg font-medium mb-3">Component Code:</h3>
            <CodeBlock code={FeatureCardComponentCode} />
          </div>
        );
      
      case 'layoutsidebar':
        return (
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Layout Sidebar Component</h2>
            <div className="mb-6">
              <LayoutSidebar>
                <div className="p-6">
                  <h1 className="text-2xl font-bold text-gray-800 mb-4">Dashboard</h1>
                  <p className="text-gray-600 mb-6">Welcome to your dashboard. Here's what's happening with your projects today.</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Card>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Active Projects</h3>
                      <p className="text-3xl font-bold text-blue-600">12</p>
                    </Card>
                    <Card>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Completed Tasks</h3>
                      <p className="text-3xl font-bold text-green-600">24</p>
                    </Card>
                    <Card>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Team Members</h3>
                      <p className="text-3xl font-bold text-purple-600">8</p>
                    </Card>
                  </div>
                </div>
              </LayoutSidebar>
            </div>
            <h3 className="text-lg font-medium mb-3">Component Code:</h3>
            <CodeBlock code={`// TypeScript Interface
interface LayoutSidebarProps {
  children: React.ReactNode;
  className?: string;
}

// Component Implementation
const LayoutSidebar = ({ children, className = '' }: LayoutSidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const sidebarItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <span>📊</span>,
      active: true
    },
    {
      id: 'projects',
      label: 'Projects',
      icon: <span>📁</span>,
      badge: 5
    },
    {
      id: 'team',
      label: 'Team',
      icon: <span>👥</span>
    },
    {
      id: 'calendar',
      label: 'Calendar',
      icon: <span>📅</span>
    },
    {
      id: 'documents',
      label: 'Documents',
      icon: <span>📄</span>
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: <span>📈</span>
    }
  ];

  return (
    <div className={\`flex h-screen bg-gray-100 \${className}\`}>
      <div className={\`\${isCollapsed ? 'w-16' : 'w-64'} bg-white shadow-md transition-all duration-300\`}>
        <div className="flex items-center justify-between p-4 border-b">
          {!isCollapsed && <h2 className="text-lg font-semibold text-gray-800">SaaS App</h2>}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 rounded hover:bg-gray-100"
          >
            {isCollapsed ? <span>→</span> : <span>←</span>}
          </button>
        </div>
        <nav className="mt-4">
          {sidebarItems.map((item) => (
            <a
              key={item.id}
              href="#"
              className={\`flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 \${item.active ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' : ''}\`}
            >
              <span className="text-xl">{item.icon}</span>
              {!isCollapsed && (
                <>
                  <span className="ml-3">{item.label}</span>
                  {item.badge && (
                    <span className="ml-auto bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </a>
          ))}
        </nav>
      </div>
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
};

// Usage Examples
<LayoutSidebar>
  <div className="p-6">
    <h1 className="text-2xl font-bold text-gray-800 mb-4">Dashboard</h1>
    <p className="text-gray-600 mb-6">Welcome to your dashboard. Here's what's happening with your projects today.</p>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Active Projects</h3>
        <p className="text-3xl font-bold text-blue-600">12</p>
      </Card>
      <Card>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Completed Tasks</h3>
        <p className="text-3xl font-bold text-green-600">24</p>
      </Card>
      <Card>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Team Members</h3>
        <p className="text-3xl font-bold text-purple-600">8</p>
      </Card>
    </div>
  </div>
</LayoutSidebar>`} />
          </div>
        );
      
      case 'settingssidebar':
        return (
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Settings Sidebar Component</h2>
            <div className="mb-6">
              <SettingsSidebar>
                <div className="p-6">
                  <p className="text-gray-600 mb-4">Manage your account settings and preferences.</p>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Email Notifications</span>
                      <Toggle checked={true} onChange={() => {}} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Two-Factor Authentication</span>
                      <Toggle checked={false} onChange={() => {}} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Profile Visibility</span>
                      <Select 
                        options={[
                          { value: 'public', label: 'Public' },
                          { value: 'private', label: 'Private' }
                        ]}
                        value="public"
                        onChange={() => {}}
                      />
                    </div>
                  </div>
                </div>
              </SettingsSidebar>
            </div>
            <h3 className="text-lg font-medium mb-3">Component Code:</h3>
            <CodeBlock code={`// TypeScript Interface
interface SettingsSidebarProps {
  children: React.ReactNode;
  className?: string;
}

// Component Implementation
const SettingsSidebar = ({ children, className = '' }: SettingsSidebarProps) => {
  const [activeTab, setActiveTab] = useState('profile');
  
  const sidebarItems = [
    {
      id: 'profile',
      label: 'Profile',
      icon: <span>👤</span>
    },
    {
      id: 'account',
      label: 'Account',
      icon: <span>🔐</span>
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: <span>🔔</span>
    },
    {
      id: 'security',
      label: 'Security',
      icon: <span>🔒</span>
    },
    {
      id: 'billing',
      label: 'Billing',
      icon: <span>💳</span>
    },
    {
      id: 'integrations',
      label: 'Integrations',
      icon: <span>🔗</span>
    }
  ];

  return (
    <div className={\`flex h-screen bg-gray-100 \${className}\`}>
      <div className="w-64 bg-white shadow-md">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">Settings</h2>
        </div>
        <nav className="mt-4">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={\`w-full flex items-center px-4 py-2 text-left text-gray-700 hover:bg-gray-100 \${activeTab === item.id ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' : ''}\`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="ml-3">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            {sidebarItems.find(item => item.id === activeTab)?.label}
          </h1>
          {children}
        </div>
      </div>
    </div>
  );
};

// Usage Examples
<SettingsSidebar>
  <div className="p-6">
    <p className="text-gray-600 mb-4">Manage your account settings and preferences.</p>
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-gray-700">Email Notifications</span>
        <Toggle checked={true} onChange={() => {}} />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-gray-700">Two-Factor Authentication</span>
        <Toggle checked={false} onChange={() => {}} />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-gray-700">Profile Visibility</span>
        <Select 
          options={[
            { value: 'public', label: 'Public' },
            { value: 'private', label: 'Private' }
          ]}
          value="public"
          onChange={() => {}}
        />
      </div>
    </div>
  </div>
</SettingsSidebar>`} />
          </div>
        );
      
      case 'dashboardsidebar':
        return (
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Dashboard Sidebar Component</h2>
            <div className="mb-6">
              <DashboardSidebar>
                <div className="p-6">
                  <h1 className="text-2xl font-bold text-gray-800 mb-4">Dashboard Overview</h1>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <Card>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Total Revenue</h3>
                      <p className="text-2xl font-bold text-gray-900">$45,231</p>
                      <p className="text-xs text-green-600">+12.5%</p>
                    </Card>
                    <Card>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Active Users</h3>
                      <p className="text-2xl font-bold text-gray-900">2,543</p>
                      <p className="text-xs text-green-600">+8.2%</p>
                    </Card>
                    <Card>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Conversion Rate</h3>
                      <p className="text-2xl font-bold text-gray-900">3.2%</p>
                      <p className="text-xs text-red-600">-2.1%</p>
                    </Card>
                    <Card>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Avg. Session</h3>
                      <p className="text-2xl font-bold text-gray-900">5m 42s</p>
                      <p className="text-xs text-green-600">+18s</p>
                    </Card>
                  </div>
                  <div className="bg-white rounded-lg shadow p-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <Avatar fallback="JD" size="sm" className="mr-3" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">John Doe</p>
                          <p className="text-xs text-gray-500">Created a new project</p>
                        </div>
                        <span className="text-xs text-gray-400 ml-auto">2 hours ago</span>
                      </div>
                      <div className="flex items-center">
                        <Avatar fallback="JS" size="sm" className="mr-3" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Jane Smith</p>
                          <p className="text-xs text-gray-500">Completed a task</p>
                        </div>
                        <span className="text-xs text-gray-400 ml-auto">5 hours ago</span>
                      </div>
                      <div className="flex items-center">
                        <Avatar fallback="BJ" size="sm" className="mr-3" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Bob Johnson</p>
                          <p className="text-xs text-gray-500">Updated profile</p>
                        </div>
                        <span className="text-xs text-gray-400 ml-auto">1 day ago</span>
                      </div>
                    </div>
                  </div>
                </div>
              </DashboardSidebar>
            </div>
            <h3 className="text-lg font-medium mb-3">Component Code:</h3>
            <CodeBlock code={`// TypeScript Interface
interface DashboardSidebarProps {
  children: React.ReactNode;
  className?: string;
}

// Component Implementation
const DashboardSidebar = ({ children, className = '' }: DashboardSidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState('overview');
  
  const sidebarSections = [
    {
      title: 'Main',
      items: [
        {
          id: 'overview',
          label: 'Overview',
          icon: <span>📊</span>
        },
        {
          id: 'analytics',
          label: 'Analytics',
          icon: <span>📈</span>
        }
      ]
    },
    {
      title: 'Management',
      items: [
        {
          id: 'users',
          label: 'Users',
          icon: <span>👥</span>,
          badge: 12
        },
        {
          id: 'projects',
          label: 'Projects',
          icon: <span>📁</span>,
          badge: 5
        },
        {
          id: 'tasks',
          label: 'Tasks',
          icon: <span>✅</span>,
          badge: 3
        }
      ]
    },
    {
      title: 'Settings',
      items: [
        {
          id: 'profile',
          label: 'Profile',
          icon: <span>👤</span>
        },
        {
          id: 'settings',
          label: 'Settings',
          icon: <span>⚙️</span>
        }
      ]
    }
  ];

  return (
    <div className={\`flex h-screen bg-gray-100 \${className}\`}>
      <div className={\`\${isCollapsed ? 'w-16' : 'w-64'} bg-white shadow-md transition-all duration-300\`}>
        <div className="flex items-center justify-between p-4 border-b">
          {!isCollapsed && <h2 className="text-lg font-semibold text-gray-800">Dashboard</h2>}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 rounded hover:bg-gray-100"
          >
            {isCollapsed ? <span>→</span> : <span>←</span>}
          </button>
        </div>
        <nav className="mt-4">
          {sidebarSections.map((section) => (
            <div key={section.title} className="mb-6">
              {!isCollapsed && (
                <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  {section.title}
                </h3>
              )}
              {section.items.map((item) => (
                <a
                  key={item.id}
                  href="#"
                  onClick={() => setActiveItem(item.id)}
                  className={\`flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 \${activeItem === item.id ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' : ''}\`}
                >
                  <span className="text-xl">{item.icon}</span>
                  {!isCollapsed && (
                    <>
                      <span className="ml-3">{item.label}</span>
                      {item.badge && (
                        <span className="ml-auto bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </a>
              ))}
            </div>
          ))}
        </nav>
      </div>
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
};

// Usage Examples
<DashboardSidebar>
  <div className="p-6">
    <h1 className="text-2xl font-bold text-gray-800 mb-4">Dashboard Overview</h1>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card>
        <h3 className="text-sm font-medium text-gray-500 mb-1">Total Revenue</h3>
        <p className="text-2xl font-bold text-gray-900">$45,231</p>
        <p className="text-xs text-green-600">+12.5%</p>
      </Card>
      <Card>
        <h3 className="text-sm font-medium text-gray-500 mb-1">Active Users</h3>
        <p className="text-2xl font-bold text-gray-900">2,543</p>
        <p className="text-xs text-green-600">+8.2%</p>
      </Card>
      <Card>
        <h3 className="text-sm font-medium text-gray-500 mb-1">Conversion Rate</h3>
        <p className="text-2xl font-bold text-gray-900">3.2%</p>
        <p className="text-xs text-red-600">-2.1%</p>
      </Card>
      <Card>
        <h3 className="text-sm font-medium text-gray-500 mb-1">Avg. Session</h3>
        <p className="text-2xl font-bold text-gray-900">5m 42s</p>
        <p className="text-xs text-green-600">+18s</p>
      </Card>
    </div>
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
      <div className="space-y-3">
        <div className="flex items-center">
          <Avatar fallback="JD" size="sm" className="mr-3" />
          <div>
            <p className="text-sm font-medium text-gray-900">John Doe</p>
            <p className="text-xs text-gray-500">Created a new project</p>
          </div>
          <span className="text-xs text-gray-400 ml-auto">2 hours ago</span>
        </div>
        <div className="flex items-center">
          <Avatar fallback="JS" size="sm" className="mr-3" />
          <div>
            <p className="text-sm font-medium text-gray-900">Jane Smith</p>
            <p className="text-xs text-gray-500">Completed a task</p>
          </div>
          <span className="text-xs text-gray-400 ml-auto">5 hours ago</span>
        </div>
        <div className="flex items-center">
          <Avatar fallback="BJ" size="sm" className="mr-3" />
          <div>
            <p className="text-sm font-medium text-gray-900">Bob Johnson</p>
            <p className="text-xs text-gray-500">Updated profile</p>
          </div>
          <span className="text-xs text-gray-400 ml-auto">1 day ago</span>
        </div>
      </div>
    </div>
  </div>
</DashboardSidebar>`} />
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar 
        items={sidebarItems}
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
          <Input placeholder="Input field" />
          <Select 
            options={[
              { value: 'option1', label: 'Option 1' },
              { value: 'option2', label: 'Option 2' }
            ]}
          />
          <Button onClick={() => setIsDrawerOpen(false)}>Close</Button>
        </div>
      </Drawer>
    </div>
  );
};

export default App;