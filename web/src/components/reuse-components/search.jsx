import { Search } from 'lucide-react';

export default function SearchBar({ value, onChange, placeholder }) {
  return (
    <div className="invoiceCRM-search-box">
      <label htmlFor="search">
        <Search variant="outline" size={18}/>
      </label>
      <input
        id="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}
