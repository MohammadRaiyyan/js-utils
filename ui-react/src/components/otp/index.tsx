import { useRef, useState, type ChangeEvent, type SubmitEvent } from "react";

export default function OTP({ length = 6 }: { length?: number }) {
  const [inputs, setInputs] = useState(() => Array.from({ length }, () => ""));
  const [error, setError] = useState<string | null>(null);
  const inputRefs = useRef<Array<HTMLInputElement>>([]);

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const isValid = inputs.join("").length === length;
    if (!isValid) {
      setError("Invalid inputs");
      return;
    }
    setError(null);
    alert("You can submit" + JSON.stringify(inputs));
  };

  const handleInput = (idx: number) => {
    return (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;

      if (value && !/^\d$/.test(value)) {
        return;
      }
      if (value.length > 1) return;
      setInputs((prev) => {
        const copy = [...prev];
        copy[idx] = value;
        return copy;
      });

      const nextInput = idx + 1;
      if (nextInput === length) {
        return;
      }
      inputRefs.current[nextInput].focus();
    };
  };

  return (
    <section className="flex items-center justify-center w-screen h-screen">
      <form
        onSubmit={handleSubmit}
        className="flex items-center justify-center flex-col gap-4 bg-gray-50 p-5 rounded"
      >
        <div className="flex items-center justify-center gap-4">
          {inputs.map((inp, idx) => {
            return (
              <input
                className="text-center size-12 p-2 font-bold text-2xl border border-gray-300 rounded"
                key={idx}
                type="text"
                value={inp}
                placeholder="0"
                id={`input-idx-${idx}`}
                onChange={handleInput(idx)}
                ref={(element) => {
                  inputRefs.current[idx] = element;
                }}
                onKeyDown={({ key }) => {
                  if (key === "Backspace") {
                    const prevIndex = idx - 1;
                    if (prevIndex < 0) {
                      return;
                    }
                    inputRefs.current[idx].value = "";
                    inputRefs.current[idx - 1].focus();
                  }
                }}
              />
            );
          })}
        </div>
        {error ? <span className="text-red-500">{error}</span> : null}
        <button className="flex items-center justify-center font-medium bg-indigo-500 text-white px-3 py-2 h-12 w-full rounded">
          Verify
        </button>
      </form>
    </section>
  );
}
