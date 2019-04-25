import React, { useState, useEffect } from 'react';

import myApi, { BroughtRspData, BroughtItem } from '@/services/my';

import styles from './index.css';

export interface AlbumsInfoItemProps {
  data: BroughtItem;
}

const AlbumsInfoItem = ({ data }: AlbumsInfoItemProps) => {
  return <div>{data.name}</div>;
};

export interface AlbumsInfosProps {
  data: BroughtRspData;
}

function AlbumsInfos({ data }: AlbumsInfosProps) {
  return <div>{data.totalCount}</div>;
}

export default function() {
  const [broughtAlbumsRsp, setBroughtAlbumsRsp] = useState(null);

  useEffect(() => {
    (async () => {
      const { data } = await myApi.getHasBroughtAlbums();
      setBroughtAlbumsRsp(data);
    })();
  }, []);

  return (
    <div className={styles.normal}>
      {broughtAlbumsRsp ? (
        <AlbumsInfos data={broughtAlbumsRsp} />
      ) : (
        'loading...'
      )}
    </div>
  );
}