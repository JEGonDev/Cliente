export const DeleteUserModal = ({ user, onConfirm, onCancel }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
    <div className="bg-white rounded-lg p-6 max-w-md w-full">
      <h2 className="text-xl font-bold mb-4">Confirmar eliminación</h2>
      <p className="mb-4">
        ¿Estás seguro de que deseas eliminar al usuario <strong>{user.firstName} {user.lastName}</strong>?
      </p>
      <p className="text-sm text-gray-600 mb-6">
        Esta acción no se puede deshacer y eliminará todos los datos asociados con este usuario.
      </p>
      <div className="flex justify-end space-x-3">
        <button
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Cancelar
        </button>
        <button
          onClick={onConfirm}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Eliminar
        </button>
      </div>
    </div>
  </div>
);