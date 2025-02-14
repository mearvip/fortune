import React, { createContext, useContext, useState } from 'react';

interface TarotReadingContextProps {
  isReading: boolean;
  setIsReading: (value: boolean) => void;
}

const TarotReadingContext = createContext<TarotReadingContextProps>({
  isReading: false,
  setIsReading: () => {},
});

export const TarotReadingProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [isReading, setIsReading] = useState<boolean>(false);

  return (
    <TarotReadingContext.Provider value={{ isReading, setIsReading }}>
      {children}
    </TarotReadingContext.Provider>
  );
};

export const useTarotReadingContext = () => useContext(TarotReadingContext); 