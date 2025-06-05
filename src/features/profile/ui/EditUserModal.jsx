import { ProfileEditView } from './ProfileEditView';

export const EditUserModal = ({ user, onSave, onCancel }) => (
  
  <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center">
    <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
      <ProfileEditView
        user={user}
        
        isAdmin={true}
        onSave={onSave}
        onCancel={onCancel}
      />
      
    </div>
  </div>
);