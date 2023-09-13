import { Spin } from 'antd';
import React from 'react';
import { useAppSelector } from '../../app/hooks';
import { SelectLoading } from '../../app/reducers/loading/loading.reducer';


const GlobalLoading = () => {
  const loadingState = useAppSelector(SelectLoading);
  const [loading, setLoading] = React.useState(loadingState);

  React.useEffect(() => {
    setLoading(loadingState);
  }, [loadingState]);

  return (
    <>
      {loading && <div className="loading">
        <Spin size="large"/>
      </div>}
    </>
  );
};

export default GlobalLoading;
