import React, { createContext, useContext, useState, useEffect } from 'react';

interface FortuneState {
  tarotReading: {
    formData: any;
    result: string;
    loading: boolean;
  };
  baziAnalysis: {
    formData: any;
    result: string;
    loading: boolean;
  };
  fortunePrediction: {
    formData: any;
    result: string;
    loading: boolean;
  };
  monthlyFortune: {
    formData: any;
    result: string;
    loading: boolean;
  };
  mbtiAnalysis: {
    formData: any;
    result: string;
    loading: boolean;
  };
  deepPersonality: {
    formData: any;
    result: string;
    loading: boolean;
  };
  zodiacBlood: {
    formData: any;
    result: string;
    loading: boolean;
  };
  loveFortune: {
    formData: any;
    result: string;
    loading: boolean;
  };
  relationshipAnalysis: {
    formData: any;
    result: string;
    loading: boolean;
  };
  careerFortune: {
    formData: any;
    result: string;
    loading: boolean;
  };
  healthFortune: {
    formData: any;
    result: string;
    loading: boolean;
  };
}

interface FortuneContextType {
  state: FortuneState;
  updateState: (section: keyof FortuneState, data: Partial<FortuneState[keyof FortuneState]>) => void;
  clearState: (section: keyof FortuneState) => void;
}

const initialState: FortuneState = {
  tarotReading: { formData: {}, result: '', loading: false },
  baziAnalysis: { formData: {}, result: '', loading: false },
  fortunePrediction: { formData: {}, result: '', loading: false },
  monthlyFortune: { formData: {}, result: '', loading: false },
  mbtiAnalysis: { formData: {}, result: '', loading: false },
  deepPersonality: { formData: {}, result: '', loading: false },
  zodiacBlood: { formData: {}, result: '', loading: false },
  loveFortune: { formData: {}, result: '', loading: false },
  relationshipAnalysis: { formData: {}, result: '', loading: false },
  careerFortune: { formData: {}, result: '', loading: false },
  healthFortune: { formData: {}, result: '', loading: false },
};

const FortuneContext = createContext<FortuneContextType>({
  state: initialState,
  updateState: () => {},
  clearState: () => {},
});

export const FortuneProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [state, setState] = useState<FortuneState>(initialState);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedState = sessionStorage.getItem('fortuneState');
      if (savedState) {
        try {
          setState(JSON.parse(savedState));
        } catch (error) {
          console.error('解析fortuneState状态失败:', error);
          sessionStorage.removeItem('fortuneState');
        }
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('fortuneState', JSON.stringify(state));
    }
  }, [state]);

  const updateState = (section: keyof FortuneState, data: Partial<FortuneState[keyof FortuneState]>) => {
    setState(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        ...data,
      },
    }));
  };

  const clearState = (section: keyof FortuneState) => {
    setState(prev => ({
      ...prev,
      [section]: initialState[section],
    }));
  };

  return (
    <FortuneContext.Provider value={{ state, updateState, clearState }}>
      {children}
    </FortuneContext.Provider>
  );
};

export const useFortuneContext = () => useContext(FortuneContext);
