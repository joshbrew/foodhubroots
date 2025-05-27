import React from 'react';
import Spinner from 'react-bootstrap/Spinner';

const LoadingIndicator = ({ isLoading }: { isLoading?: boolean }) => {
  if (!isLoading) return null;

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100px' }}>
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>
  );
};

export default LoadingIndicator;