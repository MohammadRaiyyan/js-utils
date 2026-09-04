import { useMemo, useState } from "react";
import Combobox, { type OptionType } from "./combobox";
import { SearchIcon } from "lucide-react";

const OPTIONS: OptionType[] = [
  { label: "Apple", value: "apple" },
  { label: "Mango", value: "mango" },
  { label: "Banana", value: "banana" },
];
export default function TypeHead() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState({
    label: "All",
    value: "all",
  });

  const options = useMemo(() => {
    if (search) {
      return OPTIONS.filter((option) => option.value.includes(search));
    }
    return OPTIONS;
  }, [search]);

  return (
    <main>
      <Combobox.Root
        value={selected}
        onChangeValue={(option) => setSelected(option)}
      >
        <Combobox.Input
          placeholder="Search fruites"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          iconLeft={<SearchIcon />}
        />
        <Combobox.Content placement="bottom" gutter={8}>
          {options.map((option) => (
            <Combobox.Option key={option.value} value={option}>
              {option.label}
            </Combobox.Option>
          ))}
        </Combobox.Content>
      </Combobox.Root>
    </main>
  );
}
