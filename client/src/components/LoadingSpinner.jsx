import './LoadingSpinner.css';

const LoadingSpinner = ({ size = 'medium', fullScreen = false }) => {
  const sizeClass = `spinner-${size}`;
  
  if (fullScreen) {
    return (
      <div className="spinner-fullscreen">
        <div className={`spinner ${sizeClass}`}></div>
        <p className="spinner-text">Loading...</p>
      </div>
    );
  }

  return <div className={`spinner ${sizeClass}`}></div>;
};

export default LoadingSpinner;
