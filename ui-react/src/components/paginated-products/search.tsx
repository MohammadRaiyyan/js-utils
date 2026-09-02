import { useState, type FC } from "react";
import { SearchIcon } from "lucide-react";
import useDebouncedCallback from "../../hooks/useDebouncedCallback";
interface SearchProps {
  onSearchChange: (value: string) => void;
}

const Search: FC<SearchProps> = ({ onSearchChange }) => {
  const debouncedCallback = useDebouncedCallback(onSearchChange);

  const [value, setValue] = useState("");
  const handleChange = (v: string) => {
    setValue(v);
    debouncedCallback(v);
  };
  return (
    <div className="flex items-center relative">
      <div className="absolute left-0 flex items-center justify-center h-full w-8">
        <SearchIcon />
      </div>
      <input
        className="h-9 pl-8 pr-2 border border-gray-300 rounded"
        value={value}
        onChange={({ target }) => handleChange(target.value)}
      />
    </div>
  );
};

export default Search;
