import { ComponentProps, forwardRef, useMemo } from 'react'

import { Command } from 'cmdk'

import { cn } from '@/lib/utils'

export interface SearchRootProps extends ComponentProps<typeof Command> {
  children: React.ReactNode
  className?: string
}

export function SearchRoot({ children, className, ...props }: SearchRootProps) {
  return (
    <Command
      className={cn(
        `w-full rounded-lg border bg-Grayscale-B0 border-b border-Grayscale-B50`,
        className,
      )}
      {...props}
    >
      {children}
    </Command>
  )
}

export interface SearchInputProps extends ComponentProps<typeof Command.Input> {
  icon?: React.ReactNode
  button?: React.ReactNode
  inputWrapperClassName?: string
  className?: string
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      placeholder = 'Search...',
      icon = <></>,
      button,
      inputWrapperClassName,
      className,
      defaultValue,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        className={cn(
          'flex h-9 p-2 bg-Grayscale-B0 rounded-lg border border-Grayscale-B50 justify-start items-center gap-3',
          inputWrapperClassName,
        )}
      >
        {icon}
        <Command.Input
          ref={ref}
          placeholder={placeholder}
          className={cn(
            `grow shrink basis-0 h-full text-Grayscale-B900 text-Pre-14-R placeholder:text-Grayscale-B100 outline-none`,
            className,
          )}
          {...props}
        />
        {button}
      </div>
    )
  },
)

export interface SearchListProps extends ComponentProps<typeof Command.List> {
  children: React.ReactNode
  className?: string
}

export function SearchList({ children, className, ...props }: SearchListProps) {
  return (
    <Command.List
      className={cn(
        `w-full max-h-[300px] p-2 bg-Grayscale-B0 flex flex-col items-start [&>*]:w-full`,
        'overflow-x-hidden overflow-y-auto scrollbar-thin scrollbar-thumb-Grayscale-B600 scrollbar-track-transparent',
        className,
      )}
      {...props}
    >
      {children}
    </Command.List>
  )
}

export interface SearchGroupProps extends ComponentProps<typeof Command.Group> {
  children: React.ReactNode
  className?: string
}

export function SearchGroup({ children, className, ...props }: SearchGroupProps) {
  return (
    <Command.Group className={cn('w-full flex flex-col gap-y-1', className)} {...props}>
      {children}
    </Command.Group>
  )
}

export interface SearchItemProps extends ComponentProps<typeof Command.Item> {
  children: React.ReactNode
  className?: string
  selected?: boolean
}

export function SearchItem({ children, className, selected, ...props }: SearchItemProps) {
  return (
    <Command.Item
      className={cn(
        `w-full h-[36px] cursor-pointer relative flex items-center rounded-lg p-2 outline-none hover:bg-Grayscale-B50 data-[selected=true]:bg-Grayscale-B50`,
        selected ? 'bg-Grayscale-B50' : '',
        className,
      )}
      {...props}
    >
      {children}
    </Command.Item>
  )
}

export interface SearchButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  className?: string
}
export function SearchButton({ children, className, disabled, ...props }: SearchButtonProps) {
  const buttonStyle = useMemo(() => {
    return disabled
      ? 'text-Grayscale-B100 pointer-events-none hover:text-Grayscale-B100'
      : 'text-Finola-Blue'
  }, [disabled])

  return (
    <div className={cn('text-Pre-14-B', disabled ? 'cursor-not-allowed' : '')}>
      <button className={cn(`h-5`, buttonStyle, className)} type="button" {...props}>
        {children}
      </button>
    </div>
  )
}

export interface SearchEmptyProps {
  children: React.ReactNode
  className?: string
}

export function SearchEmpty({ children, className }: SearchEmptyProps) {
  return (
    <div
      className={cn(
        'h-9 p-2 rounded-lg justify-center items-center gap-1.5 inline-flex',
        className,
      )}
    >
      <div className="text-Grayscale-B200 text-Pre-14-R">{children}</div>
    </div>
  )
}

export interface SearchLoadingProps {
  children: React.ReactNode
  className?: string
}

export function SearchLoading({ children, className }: SearchLoadingProps) {
  return (
    <div
      className={cn(
        'w-full h-9 p-2 rounded-lg justify-center items-center gap-1.5 inline-flex',
        className,
      )}
    >
      <div className="text-Grayscale-B200 text-Pre-14-R">{children}</div>
    </div>
  )
}

export const Search = {
  Root: SearchRoot,
  Input: SearchInput,
  Button: SearchButton,
  List: SearchList,
  Group: SearchGroup,
  Item: SearchItem,
  Empty: SearchEmpty,
  Loading: SearchLoading,
}
