import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type HTMLAttributes,
  type KeyboardEventHandler,
  type ReactNode,
} from "react";
import useHandleOutsideClick from "./useHandleOutsideClick";
import { createPortal } from "react-dom";

type MenuPlacement = "top" | "bottom" | "left" | "right";
export type OptionType = {
  label: string;
  value: string;
  [key: string]: unknown;
};

const DEFAULT_WIDTH = 300;
interface RootProps<T> {
  value: T | undefined;
  onChangeValue: (option: T) => void;
  children: ReactNode;
  width?: number;
}

interface IComboboxContext<T> {
  onChangeOption: (value: T) => void;
  selected: T | undefined;
  setOpenMenu: (state: boolean) => void;
  isMenuOpen: boolean;
  width: number;
  setTriggerNode: (node: HTMLInputElement | null) => void;
  triggerRef: HTMLInputElement | null;
}

const ComboboxContext = createContext<IComboboxContext<unknown> | undefined>(
  undefined,
);

function useCombobox() {
  const combobox = useContext(ComboboxContext);
  if (!combobox)
    throw new Error(
      "useCombobox Hook must be used inside the Combobox Context provider",
    );
  return combobox as IComboboxContext<OptionType>;
}
function Root<T extends OptionType>(props: RootProps<T>) {
  const { value, onChangeValue, children, width = DEFAULT_WIDTH } = props;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const onChangeOptionRef = useRef<(option: T) => void | undefined>(undefined);
  const [triggerRef, setTriggerRef] = useState<HTMLInputElement | null>(null);

  const setTriggerNode = useCallback(
    (node: HTMLInputElement | null) => setTriggerRef(node),
    [],
  );

  useEffect(() => {
    onChangeOptionRef.current = onChangeValue;
  }, [onChangeValue]);

  const setOpenMenu = useCallback((state: boolean) => {
    setIsMenuOpen(state);
  }, []);
  const onChangeOption = useCallback(
    (value: T) => {
      onChangeOptionRef.current(value);
      setIsMenuOpen(false);
      requestAnimationFrame(() => {
        triggerRef?.focus();
      });
    },
    [triggerRef],
  );

  const values = useMemo(() => {
    return {
      onChangeOption,
      selected: value,
      setOpenMenu,
      isMenuOpen,
      width,
      setTriggerNode,
      triggerRef,
    };
  }, [
    onChangeOption,
    value,
    setOpenMenu,
    isMenuOpen,
    width,
    setTriggerNode,
    triggerRef,
  ]) satisfies IComboboxContext<T>;

  return (
    <ComboboxContext.Provider value={values}>
      {children}
    </ComboboxContext.Provider>
  );
}
interface InputProps {
  placeholder?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  iconLeft?: ReactNode;
}
function Input(props: InputProps) {
  const { setOpenMenu, width, selected, setTriggerNode, isMenuOpen } =
    useCombobox();
  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.key === "Enter") {
      if (!isMenuOpen) {
        setOpenMenu(true);
      }
    }
  };
  return (
    <div
      className={`flex items-center relative ${props.className}`}
      style={{ width: `${width}px` }}
    >
      {props.iconLeft && (
        <div className="flex items-center justify-center absolute h-full inset-0 left-3 w-max">
          {props.iconLeft}
        </div>
      )}
      <input
        placeholder={
          selected?.value ? selected?.label : (props.placeholder ?? "Select")
        }
        tabIndex={0}
        data-selected={Boolean(selected?.value)}
        value={props.value}
        onChange={props.onChange}
        onClick={() => setOpenMenu(true)}
        onKeyDown={handleKeyDown}
        ref={setTriggerNode}
        className={
          "border border-gray-400 w-full h-9 pl-12 data-[selected=true]:placeholder:text-inherit"
        }
      />
    </div>
  );
}
interface ContentProps {
  placement: MenuPlacement;
  gutter: number;
  children: ReactNode;
  className?: string;
}
function Content(props: ContentProps) {
  const { isMenuOpen, width, setOpenMenu, triggerRef } = useCombobox();
  const handleOutSideClick = useCallback(() => {
    if (!isMenuOpen) return;
    setOpenMenu(false);
  }, [setOpenMenu, isMenuOpen]);
  const ref = useHandleOutsideClick(handleOutSideClick);
  if (!isMenuOpen) return;
  const rect = triggerRef.getBoundingClientRect();

  const style = {
    width: `${width}px`,
    position: "absolute" as const,
    top: `${rect.bottom + props.gutter}px`,
    left: `${rect.left}px`,
  };
  return createPortal(
    <div
      role="listbox"
      className={`shadow rounded p-2 border border-gray-300 ${props.className}`}
      style={style}
      ref={ref}
      tabIndex={0}
    >
      {props.children}
    </div>,
    document.body,
  );
}
interface OptionProps<T> extends HTMLAttributes<
  Omit<HTMLButtonElement, "aria-selected">
> {
  value: T;
  children: ReactNode;
}
function Option<T extends OptionType>(props: OptionProps<T>) {
  const { onChangeOption, selected } = useCombobox();
  const { className = "", value, onClick, ...rest } = props;

  return (
    <button
      onClick={(e) => {
        onChangeOption(value);
        onClick?.(e);
      }}
      tabIndex={0}
      aria-selected={selected?.value === value?.value}
      className={`text-left hover:bg-gray-200 w-full px-3 py-2 aria-selected:bg-indigo-500 aria-selected:text-indigo-50 ${className}`}
      {...rest}
    >
      {props.children}
    </button>
  );
}

const Combobox = Object.freeze({
  Root,
  Input,
  Content,
  Option,
});

export default Combobox;
