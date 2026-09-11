import {
  useCallback,
  useEffect,
  useState,
  type KeyboardEvent,
  type KeyboardEventHandler,
  type MouseEvent,
  type MouseEventHandler,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";

interface IModalHeaderProps {
  children: ReactNode;
  className?: string;
}
function ModalHeader(props: IModalHeaderProps) {
  return <div className={props.className}>{props.children}</div>;
}
interface IModalTitle {
  children: string;
  className?: string;
}
function ModalTitle(props: IModalTitle) {
  return (
    <>
      {typeof props.children === "string" ? (
        <h1 className={props.className}>{props.children}</h1>
      ) : (
        <div className={props.className}>{props.children}</div>
      )}
    </>
  );
}
interface IModalDescription {
  children: string;
  className?: string;
}
function ModalDescription(props: IModalDescription) {
  return (
    <>
      {typeof props.children === "string" ? (
        <p className={props.className}>{props.children}</p>
      ) : (
        <div className={props.className}>{props.children}</div>
      )}
    </>
  );
}

interface IModalContentProps {
  children: ReactNode;
  className?: string;
}
function ModalContent(props: IModalContentProps) {
  return <div className={props.className}>{props.children}</div>;
}

function useOutSideClick(callback: VoidFunction) {
  const [target, setTarget] = useState<Node | null>(null);
  const setTargetRef = useCallback((node: Node | null) => {
    setTarget(node);
  }, []);

  useEffect(() => {
    if (!target) return;
    function handleOutSideClick(e: Event) {
      if (!target.contains(e.target as Node)) {
        callback();
      }
    }
    document.addEventListener("mousedown", handleOutSideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutSideClick);
    };
  }, [target, callback]);
  return setTargetRef;
}

interface IModalProps {
  children: ReactNode;
  className?: string;
  open: boolean;
  onClose: () => void;
}
function Modal(props: IModalProps) {
  const { onClose } = props;
  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  const ref = useOutSideClick(handleClose);

  useEffect(() => {
    const handleKeyDown = (e: Event) => {
      const { key } = e as unknown as KeyboardEvent;
      if (key !== "Escape") return;
      handleClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.addEventListener("keydown", handleKeyDown);
    };
  }, [handleClose]);

  if (!props.open) return null;
  return createPortal(
    <div className="bg-black/50 w-screen h-screen fixed inset-0 flex items-center justify-center">
      <div ref={ref} className={`max-h-[90vh] w-auto ${props.className}`}>
        {props.children}
      </div>
    </div>,
    document.body,
  );
}

export default function ModalExample() {
  const [showLogin, setShowLogin] = useState(false);
  return (
    <section>
      <h2>Welcome, Click on login to proceed</h2>
      <button
        onClick={() => setShowLogin(true)}
        className="flex items-center justify-center w-full cursor-pointer text-white bg-indigo-500 rounded h-10 px-2 font-medium text-lg ring focus:ring-indigo-500"
      >
        Login
      </button>
      <Modal
        open={showLogin}
        onClose={() => setShowLogin(false)}
        className="bg-white rounded border border-gray-300 shadow-2xl"
      >
        <ModalHeader className=" p-4 border-b-gray-300">
          <ModalTitle className="text-2xl font-medium mb-2">Login</ModalTitle>
          <ModalDescription>Enter your credentials to proceed</ModalDescription>
        </ModalHeader>
        <ModalContent className="p-4">
          <form
            className="flex flex-col gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              setShowLogin(false);
            }}
          >
            <input
              className=" rounded h-10 px-2 font-medium text-lg ring focus:ring-indigo-500"
              placeholder="Email"
            />
            <input
              className=" rounded h-10 px-2 font-medium text-lg ring focus:ring-indigo-500"
              placeholder="Paswword"
            />
            <button className="flex items-center justify-center w-full cursor-pointer text-white bg-indigo-500 rounded h-10 px-2 font-medium text-lg ring focus:ring-indigo-500">
              Login
            </button>
          </form>
        </ModalContent>
      </Modal>
    </section>
  );
}
