import { Children, cloneElement, isValidElement, type HTMLAttributes, type ReactElement } from 'react';
import { cn } from '@/lib/utils/cn';

/** Composição no estilo Radix Slot, sem dependência externa. */
export function Slot({ children, ...props }: HTMLAttributes<HTMLElement>) {
  const child = Children.only(children) as ReactElement<HTMLAttributes<HTMLElement>>;
  if (!isValidElement(child)) return null;

  return cloneElement(child, {
    ...props,
    ...child.props,
    className: cn(props.className, child.props.className),
  });
}
