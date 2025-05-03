import React from 'react';
import { Dialog, DialogPanel } from '@headlessui/react';
import { ItemsNavbar } from '../components/ItemsNavbar';
import { AuthNav } from '../components/AuthNav';
import { Header_logo } from '../components/Header_logo';
import { MobileMenuButton } from './MobileMenuButton';

export const MobileNavigation = ({ isOpen, onClose, logoProps }) => {
  return (
    <Dialog open={isOpen} onClose={onClose} className="lg:hidden">
      <div className="fixed inset-0 z-10" />
      <DialogPanel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-primary px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
        <div className="flex items-center justify-between">
          <Header_logo filePath={logoProps.filePath} alt={logoProps.alt} />
          <MobileMenuButton isOpen={true} onClick={onClose} className="-m-2.5 rounded-md p-2.5" />
        </div>
        <div className="mt-6 flow-root">
          <div className="-my-6 divide-y divide-secondary">
            <div className="space-y-2 py-6">
              <ItemsNavbar link="/" style="text-white" text="Inicio" />
              {/* Aquí puedes agregar más elementos de navegación según sea necesario */}
            </div>

            <div className="py-6">
              <AuthNav />
            </div>
          </div>
        </div>
      </DialogPanel>
    </Dialog>
  );
};