import { SearchIcon } from "lucide-react";
import { useState, type ChangeEvent } from "react";
import useDebouncedCallback from "../../hooks/useDebouncedCallback";
interface FilterProps {
  onChangeSearch: (value: string) => void;
}
export default function Filter(props: FilterProps) {
  const debouncedCallback = useDebouncedCallback(props.onChangeSearch);
  const [search, setSearch] = useState("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value: val } = e.target;
    setSearch(val);
    debouncedCallback(val);
  };
  return (
    <section className="flex items-center gap-4">
      <div className="relative">
        <div className="absolute inset-0 left-2 flex items-center justify-center h-full w-8">
          <SearchIcon />
        </div>
        <input
          className="pl-12 pr-3 h-9 border border-gray-300"
          value={search}
          onChange={handleChange}
        />
      </div>
    </section>
  );
}
