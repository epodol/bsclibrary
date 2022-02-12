import React, { createContext, useState } from 'react';
import Library from '@common/types/Library';

const ActiveLibrary = createContext<Library | null>(null);

const SetActiveLibrary = createContext<
  React.Dispatch<React.SetStateAction<Library | null>>
>(null as unknown as React.Dispatch<React.SetStateAction<Library | null>>);

export const NotificationProvider = ({ children }: any) => {
  const [activeLibrary, setActiveLibrary] = useState<Library | null>(null);

  return (
    <ActiveLibrary.Provider value={activeLibrary}>
      <SetActiveLibrary.Provider value={setActiveLibrary}>
        {children}
      </SetActiveLibrary.Provider>
    </ActiveLibrary.Provider>
  );
};

export default ActiveLibrary;
