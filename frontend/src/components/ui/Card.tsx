import React from 'react';
import { cn } from '../../lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

/**
 * Card container component
 */
export function Card({ className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-xl shadow-lg shadow-gray-200/50 overflow-hidden border border-gray-100 transition-all duration-200 hover:shadow-xl',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * Card header component
 */
export function CardHeader({ className, children, ...props }: CardProps) {
  return (
    <div
      className={cn('px-5 py-4 sm:px-6 border-b border-gray-100 bg-gray-50/50', className)}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * Card body component
 */
export function CardBody({ className, children, ...props }: CardProps) {
  return (
    <div className={cn('px-5 py-5 sm:p-6', className)} {...props}>
      {children}
    </div>
  );
}

/**
 * Card footer component
 */
export function CardFooter({ className, children, ...props }: CardProps) {
  return (
    <div
      className={cn('px-5 py-4 sm:px-6 bg-gradient-to-br from-gray-50 to-gray-100/50 border-t border-gray-100', className)}
      {...props}
    >
      {children}
    </div>
  );
}

export default Card;
