import { Toaster } from 'react-hot-toast';

const Toast = () => {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: {
          background: '#fff',
          color: '#2C1810',
          padding: '16px',
          borderRadius: '8px',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.12)',
          fontFamily: 'Inter, sans-serif',
        },
        success: {
          iconTheme: {
            primary: '#2D6A4F',
            secondary: '#fff',
          },
        },
        error: {
          iconTheme: {
            primary: '#C1121F',
            secondary: '#fff',
          },
        },
      }}
    />
  );
};

export default Toast;
