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
  type ReactNode,
} from "react";

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
  toggleMenu: VoidFunction;
  isMenuOpen: boolean;
  width: number;
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

  useEffect(() => {
    onChangeOptionRef.current = onChangeValue;
  }, [onChangeValue]);

  const onChangeOption = useCallback((value: T) => {
    onChangeOptionRef.current(value);
  }, []);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  const values = useMemo(() => {
    return {
      onChangeOption,
      selected: value,
      toggleMenu,
      isMenuOpen,
      width,
    };
  }, [
    onChangeOption,
    value,
    toggleMenu,
    isMenuOpen,
    width,
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
  const { toggleMenu, width, selected } = useCombobox();
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
        placeholder={props.placeholder ?? "Select"}
        value={props.value ? props.value : (selected?.value ?? "")}
        onChange={props.onChange}
        onClick={toggleMenu}
        className={"border border-gray-400 w-full h-9 pl-12"}
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
  const { isMenuOpen, width } = useCombobox();
  if (!isMenuOpen) return;
  return (
    <div
      role="listbox"
      className={`shadow rounded p-2 ${props.className}`}
      style={{ width: `${width}px` }}
    >
      {props.children}
    </div>
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
        onChangeOption(props.value);
        onClick?.(e);
      }}
      aria-selected={selected === value}
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
