interface PaginationProps {
  onPageChange: (newPage: number) => void;
  onLimitChange: (newLimit: number) => void;
  currentPage: number;
  currentLimit: number;
  hasMore: boolean;
  disabled: boolean;
}

export default function Pagination(props: PaginationProps) {
  return (
    <div className="flex items-center justify-end gap-4">
      <button
        className="h-9 px-3 py-2 bg-gray-200 disabled:opacity-20 cursor-pointer disabled:cursor-default"
        disabled={props.currentPage === 0 || props.disabled}
        onClick={() => {
          props.onPageChange(props.currentPage - 1);
        }}
      >
        Prev
      </button>
      <span>Current:{props.currentPage}</span>
      <button
        className="h-9 px-3 py-2 bg-gray-200 disabled:opacity-20  cursor-pointer disabled:cursor-default"
        disabled={!props.hasMore || props.disabled}
        onClick={() => {
          props.onPageChange(props.currentPage + 1);
        }}
      >
        Next
      </button>
      <select
        onChange={({ target }) => props.onLimitChange(+target.value)}
        value={props.currentLimit}
        className="h-9 px-3 py-2 bg-gray-200 disabled:opacity-20  cursor-pointer disabled:cursor-default"
      >
        <option value={10}>10</option>
        <option value={20}>20</option>
        <option value={30}>30</option>
      </select>
    </div>
  );
}
