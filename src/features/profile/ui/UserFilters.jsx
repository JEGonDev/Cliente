import { Search, Filter, RefreshCw } from 'lucide-react';

export const UserFilters = ({
  onSearchChange,
  onRoleChange,
  onStatusChange,
  onRefresh,
  searchValue = "",
  roleValue = "",
  statusValue = ""
}) => (
  <div className="flex flex-col sm:flex-row justify-between mb-6 space-y-4 sm:space-y-0">
    <div className="relative">
      <input
        type="text"
        placeholder="Buscar usuario..."
        className="pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-700 focus:border-green-700"
        value={searchValue}
        onChange={e => onSearchChange?.(e.target.value)}
      />
      <Search className="absolute left-3 top-2.5 text-gray-400 h-5 w-5" />
    </div>
    <div className="flex space-x-2">
      <div className="relative">
        <select
          className="h-10 pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-700 focus:border-green-700 appearance-none"
          value={roleValue}
          onChange={e => onRoleChange?.(e.target.value)}
        >
          <option value="">Todos los roles</option>
          <option value="Administrador">Administrador</option>
          <option value="Moderador">Moderador</option>
          <option value="Usuario">Usuario</option>
        </select>
        <Filter className="absolute right-3 top-2.5 text-gray-400 h-5 w-5 pointer-events-none" />
      </div>
      <div className="relative">
        <select
          className="h-10 pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-700 focus:border-green-700 appearance-none"
          value={statusValue}
          onChange={e => onStatusChange?.(e.target.value)}
        >
          <option value="">Todos los estados</option>
          <option value="Activo">Activo</option>
          <option value="Inactivo">Inactivo</option>
        </select>
        <Filter className="absolute right-3 top-2.5 text-gray-400 h-5 w-5 pointer-events-none" />
      </div>
      <button
        className="inline-flex items-center p-2 border border-gray-300 bg-white rounded-md shadow-sm hover:bg-gray-50"
        onClick={onRefresh}
      >
        <RefreshCw className="h-5 w-5 text-gray-400" />
      </button>
    </div>
  </div>
);