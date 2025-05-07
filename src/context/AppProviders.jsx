import { EducationProvider } from '../features/education/context/EducationContext';
import { ProfileProvider } from '../features/profile/context/ProfileContext';
import { AuthProvider } from './../features/authentication/context/AuthContext';
import { CommunityProvider } from './../features/community/context/CommunityContext';
import { ContentProvider } from './../features/community/context/ContentContext';

/**
 * Componente que envuelve TODOS los providers de contexto de la app.
 * Así solo importas uno en tu entrypoint y mantienes todo centralizado.
 */
export function AppProviders({ children }) {
  return (
    <AuthProvider>
      <ProfileProvider>
        <CommunityProvider>
          <EducationProvider>
            <ContentProvider>
              {children}
            </ContentProvider>
          </EducationProvider>
        </CommunityProvider>
      </ProfileProvider>
    </AuthProvider>
  );
}
