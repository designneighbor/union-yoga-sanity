import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'base';
  children: React.ReactNode;
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'base', children, asChild = false, ...props }, ref) => {
    const baseClasses = 'inline-flex items-center justify-center rounded-sm font-sans font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer';
    
    const variantClasses = {
      primary: 'bg-secondary-700 text-white font-normal hover:bg-secondary-900 active:ring-secondary-900 ring-1 ring-secondary-700 hover:ring-secondary-900',
      secondary: 'bg-primary-950 text-white font-normal hover:bg-primary-700 focus-visible:ring-primary-700 ring-1 ring-primary-950',
    };
    const sizeClasses = {
      sm: 'h-auto px-4 py-2 text-sm',
      base: 'h-10 px-6 py-4 text-base',
    };
    
    const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`.trim();
    
    if (asChild) {
      const child = children as React.ReactElement;
      return React.cloneElement(child, {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        className: `${classes} ${(child.props as any)?.className || ''}`.trim(),
        ref,
        ...props,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);
    }
    
    return (
      <button
        className={classes}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';

export { Button };